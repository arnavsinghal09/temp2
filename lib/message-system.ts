import type { ChatMessage } from "./types";

export interface MessageRoute {
  fromUserId: number;
  toUserId?: number; // For direct messages
  toCampfireId?: number; // For campfire messages
  messageId: number;
  timestamp: string;
}

// Add this interface if not already present
export interface PrimeClipData {
  id: string;
  contentId: string;
  contentTitle: string;
  contentThumbnail: string;
  startTime: number;
  endTime: number;
  duration: number;
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

    try {
      // Add message to sender's chat (from sender's perspective)
      this.addMessageToChat(fromUserId, toUserId, "friend", message);

      // Add message to receiver's chat (from receiver's perspective)
      this.addMessageToChat(toUserId, fromUserId, "friend", message);

      // Store as pending message for delivery tracking
      this.storePendingMessage({
        id: Date.now(),
        route,
        message,
        delivered: true, // In local system, always delivered
      });

      // Verify the message was stored correctly
      this.verifyMessageStorage(fromUserId, toUserId, message.id);
    } catch (error) {
      throw error;
    }
  }

  // Add this new verification method
  private static verifyMessageStorage(
    fromUserId: number,
    toUserId: number,
    messageId: number
  ): void {
    try {
      // Check sender's chat
      const senderMessages = this.getMessagesForChat(
        fromUserId,
        toUserId,
        "friend"
      );
      const senderHasMessage = senderMessages.some(
        (msg) => msg.id === messageId
      );

      // Check receiver's chat
      const receiverMessages = this.getMessagesForChat(
        toUserId,
        fromUserId,
        "friend"
      );
      const receiverHasMessage = receiverMessages.some(
        (msg) => msg.id === messageId
      );

      if (!senderHasMessage || !receiverHasMessage) {
        throw new Error("Message storage verification failed");
      }
    } catch (error) {
      throw new Error("Error during message storage verification");
    }
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
    reaction?: {
      type: "text" | "voice";
      content: string;
      timestamp: number;
      voiceDuration?: number;
      voiceBlob?: Blob;
      voiceBase64?: string;
    }
  ): void {
    // Handle voice blob reconstruction
    let processedReaction = reaction;
    if (reaction && reaction.type === "voice") {
      if (reaction.voiceBase64) {
        try {
          // Keep both blob and base64 for compatibility
          processedReaction = {
            ...reaction,
            voiceBlob: reaction.voiceBlob, // Keep original blob if available
            voiceBase64: reaction.voiceBase64, // Keep base64 for persistence
          };
        } catch (error) {
          // Fallback without blob
          processedReaction = {
            ...reaction,
            voiceBlob: undefined,
          };
        }
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
            voiceBase64: processedReaction.voiceBase64,
            timestamp: processedReaction.timestamp,
          }
        : undefined,
    };

    // Process the message
    const processedMessage = this.processNetflixClipMessage(message);

    // Send to targets
    if (targetType === "friends") {
      targetIds.forEach((friendId) => {
        try {
          this.sendDirectMessage(fromUserId, friendId, processedMessage);
        } catch (error) {
          // Handle error silently or throw if needed
        }
      });
    } else {
      targetIds.forEach((campfireId) => {
        try {
          this.sendCampfireMessage(fromUserId, campfireId, processedMessage);
        } catch (error) {
          // Handle error silently or throw if needed
        }
      });
    }
  }

  static sendPrimeClipMessage(
    fromUserId: number,
    friendIds: number[],
    campfireIds: number[],
    clipData: any,
    reaction?: {
      type: "text" | "voice";
      content: string;
      timestamp: number;
      voiceDuration?: string;
      voiceBlob?: Blob;
      voiceBase64?: string;
    }
  ): void {
    // Handle voice blob reconstruction
    let processedReaction = reaction;
    if (reaction && reaction.type === "voice") {
      if (reaction.voiceBase64) {
        try {
          processedReaction = {
            ...reaction,
            voiceBlob: reaction.voiceBlob,
            voiceBase64: reaction.voiceBase64,
          };
        } catch (error) {
          processedReaction = {
            ...reaction,
            voiceBlob: undefined,
          };
        }
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
        thumbnail:
          clipData.contentThumbnail || "/placeholder.svg?height=200&width=300",
        duration: this.formatDuration(clipData.duration),
        platform: "Prime Video",
        primeData: {
          contentId: clipData.contentId,
          startTime: clipData.startTime,
          endTime: clipData.endTime,
          clipId: clipData.id,
          sharedFrom: "Prime Video",
          originalTitle: clipData.originalTitle || clipData.contentTitle,
        },
      },
      reactionData: processedReaction
        ? {
            type: processedReaction.type,
            content: processedReaction.content,
            voiceBlob: processedReaction.voiceBlob,
            voiceDuration: processedReaction.voiceDuration,
            voiceBase64: processedReaction.voiceBase64,
            timestamp: processedReaction.timestamp,
          }
        : undefined,
    };

    // Process the message
    const processedMessage = this.processPrimeClipMessage(message);

    // Send to friends
    friendIds.forEach((friendId) => {
      try {
        this.sendDirectMessage(fromUserId, friendId, processedMessage);
      } catch (error) {
        console.error(`Failed to send to friend ${friendId}:`, error);
      }
    });

    // Send to campfires
    campfireIds.forEach((campfireId) => {
      try {
        this.sendCampfireMessage(fromUserId, campfireId, processedMessage);
      } catch (error) {
        console.error(`Failed to send to campfire ${campfireId}:`, error);
      }
    });
  }

  // Enhanced base64 to blob conversion
  private static base64ToBlob(base64Data: string): Blob {
    try {
      // Handle data URL format
      let base64String = base64Data;
      let mimeType = "audio/webm";

      if (base64Data.startsWith("data:")) {
        const parts = base64Data.split(",");
        if (parts.length === 2) {
          const header = parts[0];
          base64String = parts[1];

          // Extract MIME type
          const mimeMatch = header.match(/data:([^;]+)/);
          if (mimeMatch) {
            mimeType = mimeMatch[1];
          }
        }
      }

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const validTypes = [
        "audio/webm",
        "audio/mpeg",
        "audio/mp3",
        "audio/ogg",
        "audio/mp4",
      ];
      const finalType = validTypes.includes(mimeType) ? mimeType : "audio/webm";
      const blob = new Blob([byteArray], { type: finalType });

      return blob;
    } catch (error) {
      throw new Error(`Failed to convert base64 to blob: ${error}`);
    }
  }

  // Get messages for a specific chat with enhanced audio reconstruction
  static getMessagesForChat(
    userId: number,
    participantId: number,
    type: "friend" | "campfire"
  ): ChatMessage[] {
    try {
      const key = this.getChatKey(userId, participantId, type);
      const stored = localStorage.getItem(key);

      if (!stored) {
        return [];
      }

      const messages: ChatMessage[] = JSON.parse(stored);

      // Reconstruct voice blobs from base64 data
      const processedMessages: ChatMessage[] = messages.map((message) => {
        if (
          message.reactionData?.voiceBase64 &&
          message.reactionData.type === "voice"
        ) {
          try {
            const blob = this.base64ToBlob(message.reactionData.voiceBase64);
            const url = URL.createObjectURL(blob);

            return {
              ...message,
              reactionData: {
                ...message.reactionData,
                voiceBlob: blob,
              },
              voiceData: message.voiceData
                ? {
                    ...message.voiceData,
                    voiceBlob: blob,
                    audioUrl: url,
                    duration: message.voiceData.duration || "0:00",
                  }
                : {
                    duration: "0:00",
                    waveform: this.generateWaveform(),
                    voiceBlob: blob,
                    audioUrl: url,
                  },
            };
          } catch (error) {
            return message;
          }
        }

        // Also handle legacy voiceData with base64
        if (
          message.voiceData &&
          !message.voiceData.voiceBlob &&
          (message as any).voiceData?.voiceBase64
        ) {
          try {
            const blob = this.base64ToBlob(
              (message as any).voiceData.voiceBase64
            );
            const url = URL.createObjectURL(blob);

            return {
              ...message,
              voiceData: {
                ...message.voiceData,
                voiceBlob: blob,
                audioUrl: url,
                duration: message.voiceData.duration || "0:00",
              },
            };
          } catch (error) {
            return message;
          }
        }

        return message;
      });

      return processedMessages;
    } catch (error) {
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
        console.warn("Netflix clip data validation warning");
      }
    }

    return message;
  }

  private static processPrimeClipMessage(message: ChatMessage): ChatMessage {
    if (message.type === "clip" && message.clipData?.primeData) {
      if (!message.clipData.primeData.sharedFrom) {
        message.clipData.primeData.sharedFrom = "Prime Video";
      }

      const { contentId, startTime, endTime, clipId } =
        message.clipData.primeData;
      if (
        !contentId ||
        startTime === undefined ||
        endTime === undefined ||
        !clipId
      ) {
        console.warn("Prime Video clip data validation warning");
      }
    }

    return message;
  }

  // Enhanced blob to base64 conversion for storage
  private static async blobToBase64Async(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  // Generate waveform helper
  private static generateWaveform(length: number = 20): number[] {
    return Array.from({ length }, () => Math.random() * 0.7 + 0.2);
  }

  // Add a message to a specific user's chat with enhanced audio handling
  private static addMessageToChat(
    userId: number,
    participantId: number,
    type: "friend" | "campfire",
    message: ChatMessage
  ): void {
    try {
      const key = this.getChatKey(userId, participantId, type);

      // Get existing messages WITHOUT using the enhanced getMessagesForChat
      // to avoid circular dependency during message addition
      const existingMessages = this.getRawMessagesForChat(
        userId,
        participantId,
        type
      );

      // Check if message already exists (prevent duplicates)
      const messageExists = existingMessages.some(
        (msg) => msg.id === message.id
      );

      if (messageExists) {
        return;
      }

      // Process Netflix clips if needed
      let processedMessage =
        message.type === "clip" && message.clipData?.netflixData
          ? this.processNetflixClipMessage(message)
          : message;

      const updatedMessages = [...existingMessages, processedMessage];

      // Use custom serializer to handle special objects
      const serializedMessages = JSON.stringify(
        updatedMessages,
        this.jsonReplacer
      );
      localStorage.setItem(key, serializedMessages);

      // Verify the message was actually stored
      const verificationMessages = this.getRawMessagesForChat(
        userId,
        participantId,
        type
      );
      const messageWasStored = verificationMessages.some(
        (msg) => msg.id === message.id
      );

      if (!messageWasStored) {
        throw new Error("Message storage verification failed");
      }
    } catch (error) {
      throw error;
    }
  }

  // Add this new method to get raw messages without processing
  private static getRawMessagesForChat(
    userId: number,
    participantId: number,
    type: "friend" | "campfire"
  ): ChatMessage[] {
    try {
      const key = this.getChatKey(userId, participantId, type);
      const stored = localStorage.getItem(key);

      if (!stored) {
        return [];
      }

      const messages: ChatMessage[] = JSON.parse(stored);
      return messages;
    } catch (error) {
      return [];
    }
  }

  // JSON replacer to handle special objects during serialization
  private static jsonReplacer(key: string, value: any): any {
    // Don't serialize Blob objects directly - they should be converted to base64 first
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
      // Handle error silently
    }
  }

  // Get all message routes
  private static getMessageRoutes(): MessageRoute[] {
    try {
      const stored = localStorage.getItem(MESSAGE_ROUTES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
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
      // Handle error silently
    }
  }

  // Get pending messages
  private static getPendingMessages(): PendingMessage[] {
    try {
      const stored = localStorage.getItem(PENDING_MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
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
      return "Unknown User";
    }
  }

  private static getUserAvatar(userId: number): string {
    try {
      const { UserManager } = require("./user-management");
      const user = UserManager.getUserById(userId);
      return user?.avatar || "/placeholder.svg?height=40&width=40";
    } catch (error) {
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
      // Handle error silently
    }
  }

  // Clear all messages for a user (useful for testing)
  static clearUserMessages(userId: number): void {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(`firetv_chat_${userId}_`)
      );

      keys.forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      // Handle error silently
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
