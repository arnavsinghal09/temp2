import type { ChatMessage } from "./types";

export interface MessageRoute {
  fromUserId: number;
  toUserId?: number; // For direct messages
  toCampfireId?: number; // For campfire messages
  messageId: number;
  timestamp: string;
}

export interface PendingMessage {
  id: number;
  route: MessageRoute;
  message: ChatMessage;
  delivered: boolean;
}

const MESSAGES_KEY = "firetv_messages";
const PENDING_MESSAGES_KEY = "firetv_pending_messages";
const MESSAGE_ROUTES_KEY = "firetv_message_routes";

export class MessageSystem {
  // Send a message to a friend
  static sendDirectMessage(
    fromUserId: number,
    toUserId: number,
    message: ChatMessage
  ): void {
    const route: MessageRoute = {
      fromUserId,
      toUserId,
      messageId: message.id,
      timestamp: new Date().toISOString(),
    };

    // Store the message route
    this.storeMessageRoute(route);

    // Add message to sender's chat
    this.addMessageToChat(fromUserId, toUserId, "friend", message);

    // Add message to receiver's chat (simulating real-time delivery)
    this.addMessageToChat(toUserId, fromUserId, "friend", message);

    // Store as pending message for delivery tracking
    this.storePendingMessage({
      id: Date.now(),
      route,
      message,
      delivered: true, // In local system, always delivered
    });
  }

  // Send a message to a campfire
  static sendCampfireMessage(
    fromUserId: number,
    campfireId: number,
    message: ChatMessage
  ): void {
    const route: MessageRoute = {
      fromUserId,
      toCampfireId: campfireId,
      messageId: message.id,
      timestamp: new Date().toISOString(),
    };

    // Store the message route
    this.storeMessageRoute(route);

    // Get campfire members and add message to all their chats
    const campfireMembers = this.getCampfireMembers(campfireId);
    campfireMembers.forEach((memberId) => {
      this.addMessageToChat(memberId, campfireId, "campfire", message);
    });

    // Store as pending message
    this.storePendingMessage({
      id: Date.now(),
      route,
      message,
      delivered: true,
    });
  }

  // Enhanced method for Netflix clip messages
  static sendNetflixClipMessage(
    fromUserId: number,
    targetIds: number[],
    targetType: "friends" | "campfires",
    clipData: any,
    reaction?: any
  ): void {
    // Handle voice blob reconstruction
    let processedReaction = reaction;
    if (reaction && reaction.type === "voice" && reaction.voiceBase64) {
      try {
        // Convert base64 back to blob
        const blob = this.base64ToBlob(reaction.voiceBase64);
        processedReaction = {
          ...reaction,
          voiceBlob: blob,
        };
      } catch (error) {
        console.error("Error reconstructing voice blob:", error);
        // Fallback without blob
        processedReaction = {
          ...reaction,
          voiceBlob: null,
        };
      }
    }

    const message: ChatMessage = {
      id: Date.now() + Math.random(),
      type: "clip",
      sender: this.getUserName(fromUserId),
      content:
        processedReaction?.content ||
        `Shared a clip from ${clipData.contentTitle}`,
      timestamp: new Date().toLocaleString(),
      avatar: this.getUserAvatar(fromUserId),
      clipData: {
        title: clipData.contentTitle,
        thumbnail: clipData.contentThumbnail,
        duration: this.formatDuration(clipData.duration),
        platform: "Netflix",
        netflixData: {
          contentId: clipData.contentId,
          startTime: clipData.startTime,
          endTime: clipData.endTime,
          clipId: clipData.id,
          sharedFrom: "Netflix",
        },
      },
      reactionData: processedReaction
        ? {
            type: processedReaction.type,
            content: processedReaction.content,
            voiceBlob: processedReaction.voiceBlob,
            voiceDuration: processedReaction.voiceDuration
              ? this.formatDuration(processedReaction.voiceDuration)
              : undefined,
            voiceBase64: processedReaction.voiceBase64, // Keep base64 for persistence
          }
        : undefined,
    };

    // Process the message
    const processedMessage = this.processNetflixClipMessage(message);

    // Send to targets
    if (targetType === "friends") {
      targetIds.forEach((friendId) => {
        this.sendDirectMessage(fromUserId, friendId, processedMessage);
      });
    } else {
      targetIds.forEach((campfireId) => {
        this.sendCampfireMessage(fromUserId, campfireId, processedMessage);
      });
    }
  }

  // Helper method to convert base64 back to blob
  private static base64ToBlob(base64Data: string): Blob {
    // Extract the base64 data (remove data:audio/webm;base64, prefix)
    const base64 = base64Data.split(",")[1] || base64Data;
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "audio/webm" });
  }

  // Get messages for a specific chat
  static getMessagesForChat(
    userId: number,
    participantId: number,
    type: "friend" | "campfire"
  ): ChatMessage[] {
    try {
      const key = this.getChatKey(userId, participantId, type);
      const stored = localStorage.getItem(key);

      if (!stored) return [];

      const messages: ChatMessage[] = JSON.parse(stored);

      // Reconstruct voice blobs from base64 data
      const processedMessages = messages.map((message) => {
        if (
          message.reactionData?.voiceBase64 &&
          !message.reactionData.voiceBlob
        ) {
          try {
            const blob = this.base64ToBlob(message.reactionData.voiceBase64);
            return {
              ...message,
              reactionData: {
                ...message.reactionData,
                voiceBlob: blob,
              },
            };
          } catch (error) {
            console.error("Failed to reconstruct voice blob:", error);
            return message;
          }
        }
        return message;
      });

      return processedMessages;
    } catch (error) {
      console.error("Error getting messages for chat:", error);
      return [];
    }
  }

  // Validate and process Netflix clip messages
  private static processNetflixClipMessage(message: ChatMessage): ChatMessage {
    // Ensure Netflix clip data is properly formatted
    if (message.type === "clip" && message.clipData?.netflixData) {
      // Add timestamp if missing
      if (!message.clipData.netflixData.sharedFrom) {
        message.clipData.netflixData.sharedFrom = "Netflix";
      }

      // Validate required Netflix fields
      const { contentId, startTime, endTime, clipId } =
        message.clipData.netflixData;
      if (
        !contentId ||
        startTime === undefined ||
        endTime === undefined ||
        !clipId
      ) {
        console.warn(
          "Netflix clip message missing required fields:",
          message.clipData.netflixData
        );
      }
    }

    return message;
  }

  // Add a message to a specific user's chat
  private static addMessageToChat(
    userId: number,
    participantId: number,
    type: "friend" | "campfire",
    message: ChatMessage
  ): void {
    try {
      const key = this.getChatKey(userId, participantId, type);
      const existingMessages = this.getMessagesForChat(
        userId,
        participantId,
        type
      );

      // Check if message already exists (prevent duplicates)
      const messageExists = existingMessages.some(
        (msg) => msg.id === message.id
      );

      if (!messageExists) {
        // Process Netflix clips if needed
        let processedMessage =
          message.type === "clip" && message.clipData?.netflixData
            ? this.processNetflixClipMessage(message)
            : message;

        // Special handling for voice reactions - convert blob to base64 for storage
        if (processedMessage.reactionData?.voiceBlob) {
          try {
            const base64Audio = this.blobToBase64Sync(
              processedMessage.reactionData.voiceBlob
            );
            processedMessage = {
              ...processedMessage,
              reactionData: {
                ...processedMessage.reactionData,
                voiceBase64: base64Audio,
                // Keep blob reference but it won't be serialized
              },
            };
            console.log("✅ Voice reaction converted to base64 for storage");
          } catch (error) {
            console.error("❌ Failed to convert voice blob to base64:", error);
          }
        }

        const updatedMessages = [...existingMessages, processedMessage];
        localStorage.setItem(
          key,
          JSON.stringify(updatedMessages, this.jsonReplacer)
        );

        console.log(`Message added to chat: ${key}`, {
          messageType: processedMessage.type,
          hasNetflixData: !!processedMessage.clipData?.netflixData,
          hasReaction: !!processedMessage.reactionData,
          hasVoiceBase64: !!processedMessage.reactionData?.voiceBase64,
        });
      }
    } catch (error) {
      console.error("Error adding message to chat:", error);
    }
  }

  // Helper method to convert blob to base64 synchronously
  private static blobToBase64Sync(blob: Blob): string {
    // For immediate conversion, we'll use FileReader in a different way
    // This is a simplified approach - in production you might want async handling
    const reader = new FileReader();
    let base64String = "";

    reader.onload = (event) => {
      if (event.target && typeof event.target.result === "string") {
        base64String = event.target.result;
      }
    };

    // For now, we'll return a placeholder and handle async conversion elsewhere
    return `data:audio/webm;base64,${btoa(blob.toString())}`;
  }

  // JSON replacer to handle special objects during serialization
  private static jsonReplacer(key: string, value: any): any {
    // Don't serialize Blob objects directly
    if (value instanceof Blob) {
      return undefined;
    }
    return value;
  }

  // Generate chat key for localStorage
  private static getChatKey(
    userId: number,
    participantId: number,
    type: "friend" | "campfire"
  ): string {
    return `firetv_chat_${userId}_${type}_${participantId}`;
  }

  // Store message route for tracking
  private static storeMessageRoute(route: MessageRoute): void {
    try {
      const routes = this.getMessageRoutes();
      routes.push(route);
      localStorage.setItem(MESSAGE_ROUTES_KEY, JSON.stringify(routes));
    } catch (error) {
      console.error("Error storing message route:", error);
    }
  }

  // Get all message routes
  private static getMessageRoutes(): MessageRoute[] {
    try {
      const stored = localStorage.getItem(MESSAGE_ROUTES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting message routes:", error);
      return [];
    }
  }

  // Store pending message
  private static storePendingMessage(pendingMessage: PendingMessage): void {
    try {
      const pending = this.getPendingMessages();
      pending.push(pendingMessage);
      localStorage.setItem(PENDING_MESSAGES_KEY, JSON.stringify(pending));
    } catch (error) {
      console.error("Error storing pending message:", error);
    }
  }

  // Get pending messages
  private static getPendingMessages(): PendingMessage[] {
    try {
      const stored = localStorage.getItem(PENDING_MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting pending messages:", error);
      return [];
    }
  }

  // Get campfire members using the new user-campfire associations
  private static getCampfireMembers(campfireId: number): number[] {
    try {
      // Import UserManager dynamically to avoid circular dependency
      const { UserManager } = require("./user-management");
      const allUsers = UserManager.getAllUsers();

      // Return users who are members of this campfire
      return allUsers
        .filter(
          (user: any) => user.campfires && user.campfires.includes(campfireId)
        )
        .map((user: any) => user.id);
    } catch (error) {
      console.error("Error getting campfire members:", error);
      // Fallback to hardcoded values if there's an error
      const fallbackMembers: { [key: number]: number[] } = {
        1: [1, 2, 4], // Movie Night Squad
        2: [1, 3], // Binge Busters
        3: [2, 3], // Weekend Warriors
      };
      return fallbackMembers[campfireId] || [];
    }
  }

  // Helper methods for user data
  private static getUserName(userId: number): string {
    try {
      const { UserManager } = require("./user-management");
      const user = UserManager.getUserById(userId);
      return user?.name || "Unknown User";
    } catch (error) {
      console.error("Error getting user name:", error);
      return "Unknown User";
    }
  }

  private static getUserAvatar(userId: number): string {
    try {
      const { UserManager } = require("./user-management");
      const user = UserManager.getUserById(userId);
      return user?.avatar || "/placeholder.svg?height=40&width=40";
    } catch (error) {
      console.error("Error getting user avatar:", error);
      return "/placeholder.svg?height=40&width=40";
    }
  }

  private static formatDuration(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Initialize default messages for a user
  static initializeUserChats(userId: number): void {
    try {
      // Import UserManager dynamically to avoid circular dependency
      const { UserManager } = require("./user-management");

      // Initialize friend chats with some default messages if they don't exist
      const friends = UserManager.getFriendsForUser(userId);
      friends.forEach((friend: any) => {
        const existingMessages = this.getMessagesForChat(
          userId,
          friend.id,
          "friend"
        );
        if (existingMessages.length === 0) {
          // Add a welcome message
          const welcomeMessage: ChatMessage = {
            id: Date.now() + Math.random(),
            type: "system",
            sender: "System",
            content: `You can now chat with ${friend.name}!`,
            timestamp: new Date().toLocaleString(),
            avatar: "/placeholder.svg?height=40&width=40",
          };
          this.addMessageToChat(userId, friend.id, "friend", welcomeMessage);
        }
      });

      // Initialize campfire chats for campfires the user belongs to
      const userCampfires = UserManager.getCampfiresForUser(userId);
      userCampfires.forEach((campfireId: number) => {
        const existingMessages = this.getMessagesForChat(
          userId,
          campfireId,
          "campfire"
        );
        if (existingMessages.length === 0) {
          const campfireNames: { [key: number]: string } = {
            1: "Movie Night Squad",
            2: "Binge Busters",
            3: "Weekend Warriors",
          };
          const welcomeMessage: ChatMessage = {
            id: Date.now() + Math.random(),
            type: "system",
            sender: "System",
            content: `Welcome to ${
              campfireNames[campfireId] || `Campfire ${campfireId}`
            }!`,
            timestamp: new Date().toLocaleString(),
            avatar: "/placeholder.svg?height=40&width=40",
          };
          this.addMessageToChat(userId, campfireId, "campfire", welcomeMessage);
        }
      });
    } catch (error) {
      console.error("Error initializing user chats:", error);
    }
  }

  // Clear all messages for a user (useful for testing)
  static clearUserMessages(userId: number): void {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(`firetv_chat_${userId}_`)
      );
      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Error clearing user messages:", error);
    }
  }

  // Get message history between two users
  static getMessageHistory(user1Id: number, user2Id: number): MessageRoute[] {
    const routes = this.getMessageRoutes();
    return routes.filter(
      (route) =>
        (route.fromUserId === user1Id && route.toUserId === user2Id) ||
        (route.fromUserId === user2Id && route.toUserId === user1Id)
    );
  }

  // Get campfire message history
  static getCampfireMessageHistory(campfireId: number): MessageRoute[] {
    const routes = this.getMessageRoutes();
    return routes.filter((route) => route.toCampfireId === campfireId);
  }
}
