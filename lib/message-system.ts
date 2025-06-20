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
    console.log("📤 Sending direct message:", {
      from: fromUserId,
      to: toUserId,
      type: message.type,
      hasVoiceData: !!message.voiceData,
      hasReactionData: !!message.reactionData,
    });

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

    console.log("✅ Direct message sent successfully");
  }

  // Send a message to a campfire
  static sendCampfireMessage(
    fromUserId: number,
    campfireId: number,
    message: ChatMessage
  ): void {
    console.log("📤 Sending campfire message:", {
      from: fromUserId,
      campfire: campfireId,
      type: message.type,
      hasVoiceData: !!message.voiceData,
      hasReactionData: !!message.reactionData,
    });

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
    console.log("👥 Campfire members:", campfireMembers);

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

    console.log("✅ Campfire message sent successfully");
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
    console.log("🎬 Sending Netflix clip message:", {
      from: fromUserId,
      targetType,
      targetCount: targetIds.length,
      hasReaction: !!reaction,
      reactionType: reaction?.type,
    });

    // Handle voice blob reconstruction
    let processedReaction = reaction;
    if (reaction && reaction.type === "voice") {
      console.log("🎤 Processing voice reaction:", {
        hasVoiceBlob: !!reaction.voiceBlob,
        hasVoiceBase64: !!reaction.voiceBase64,
        voiceDuration: reaction.voiceDuration,
      });

      if (reaction.voiceBase64) {
        try {
          // Keep both blob and base64 for compatibility
          processedReaction = {
            ...reaction,
            voiceBlob: reaction.voiceBlob, // Keep original blob if available
            voiceBase64: reaction.voiceBase64, // Keep base64 for persistence
          };
          console.log("✅ Voice reaction processed successfully");
        } catch (error) {
          console.error("❌ Error processing voice reaction:", error);
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

    console.log("📦 Netflix clip message prepared:", {
      hasClipData: !!message.clipData,
      hasNetflixData: !!message.clipData?.netflixData,
      hasReactionData: !!message.reactionData,
      reactionType: message.reactionData?.type,
    });

    // Process the message
    const processedMessage = this.processNetflixClipMessage(message);

    // Send to targets
    if (targetType === "friends") {
      console.log("👥 Sending to friends:", targetIds);
      targetIds.forEach((friendId) => {
        this.sendDirectMessage(fromUserId, friendId, processedMessage);
      });
    } else {
      console.log("🔥 Sending to campfires:", targetIds);
      targetIds.forEach((campfireId) => {
        this.sendCampfireMessage(fromUserId, campfireId, processedMessage);
      });
    }

    console.log("✅ Netflix clip message sent to all targets");
  }

  // Enhanced base64 to blob conversion
  private static base64ToBlob(base64Data: string): Blob {
    console.log("🔄 Converting base64 to blob:", {
      dataLength: base64Data.length,
      hasDataPrefix: base64Data.startsWith("data:"),
    });

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

      console.log("🔍 Base64 conversion details:", {
        mimeType,
        base64Length: base64String.length,
      });

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

      console.log("✅ Blob created successfully:", {
        size: blob.size,
        type: blob.type,
      });

      return blob;
    } catch (error) {
      console.error("❌ Error converting base64 to blob:", error);
      throw new Error(`Failed to convert base64 to blob: ${error}`);
    }
  }

  // Get messages for a specific chat with enhanced audio reconstruction
  static getMessagesForChat(
    userId: number,
    participantId: number,
    type: "friend" | "campfire"
  ): ChatMessage[] {
    console.log("📖 Getting messages for chat:", {
      userId,
      participantId,
      type,
    });

    try {
      const key = this.getChatKey(userId, participantId, type);
      const stored = localStorage.getItem(key);

      if (!stored) {
        console.log("📭 No stored messages found");
        return [];
      }

      const messages: ChatMessage[] = JSON.parse(stored);
      console.log("📥 Raw messages loaded:", {
        count: messages.length,
        hasVoiceReactions: messages.some(
          (m) => m.reactionData?.type === "voice"
        ),
      });

      // Reconstruct voice blobs from base64 data
      const processedMessages: ChatMessage[] = messages.map(
        (message, index) => {
          if (
            message.reactionData?.voiceBase64 &&
            message.reactionData.type === "voice"
          ) {
            console.log(`🔄 Reconstructing voice blob for message ${index}:`, {
              hasBase64: !!message.reactionData.voiceBase64,
              hasExistingBlob: !!message.reactionData.voiceBlob,
              base64Length: message.reactionData.voiceBase64.length,
            });

            try {
              const blob = this.base64ToBlob(message.reactionData.voiceBase64);
              const url = URL.createObjectURL(blob);

              console.log(`✅ Voice blob reconstructed for message ${index}:`, {
                blobSize: blob.size,
                blobType: blob.type,
                objectUrl: url,
              });

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
              console.error(
                `❌ Failed to reconstruct voice blob for message ${index}:`,
                error
              );
              return message;
            }
          }

          // Also handle legacy voiceData with base64
          if (
            message.voiceData &&
            !message.voiceData.voiceBlob &&
            (message as any).voiceData?.voiceBase64
          ) {
            console.log(
              `🔄 Reconstructing legacy voice data for message ${index}`
            );

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
              console.error(
                `❌ Failed to reconstruct legacy voice data for message ${index}:`,
                error
              );
              return message;
            }
          }

          return message;
        }
      );

      console.log("📤 Processed messages:", {
        count: processedMessages.length,
        withVoiceBlobs: processedMessages.filter(
          (m) => m.reactionData?.voiceBlob || m.voiceData?.voiceBlob
        ).length,
      });

      return processedMessages;
    } catch (error) {
      console.error("❌ Error getting messages for chat:", error);
      return [];
    }
  }

  // Validate and process Netflix clip messages
  private static processNetflixClipMessage(message: ChatMessage): ChatMessage {
    console.log("🎬 Processing Netflix clip message:", {
      type: message.type,
      hasClipData: !!message.clipData,
      hasNetflixData: !!message.clipData?.netflixData,
    });

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
          "⚠️ Netflix clip message missing required fields:",
          message.clipData.netflixData
        );
      } else {
        console.log("✅ Netflix clip data validated successfully");
      }
    }

    return message;
  }

  // Enhanced blob to base64 conversion for storage
  private static async blobToBase64Async(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log("🔄 Converting blob to base64 async:", {
        size: blob.size,
        type: blob.type,
      });

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          console.log("✅ Async blob to base64 conversion successful");
          resolve(reader.result);
        } else {
          console.error("❌ FileReader result is not a string");
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = (error) => {
        console.error("❌ FileReader error during conversion:", error);
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
    console.log("💾 Adding message to chat:", {
      userId,
      participantId,
      type,
      messageType: message.type,
      hasVoiceReaction: message.reactionData?.type === "voice",
    });

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

        // Special handling for voice reactions - ensure base64 conversion
        if (
          processedMessage.reactionData?.voiceBlob &&
          processedMessage.reactionData?.type === "voice"
        ) {
          console.log("🎤 Processing voice reaction for storage:", {
            hasBlobData: !!processedMessage.reactionData.voiceBlob,
            hasBase64: !!processedMessage.reactionData.voiceBase64,
            blobSize: processedMessage.reactionData.voiceBlob.size,
          });

          // If we don't have base64 yet, we need to convert
          if (!processedMessage.reactionData.voiceBase64) {
            console.log(
              "⚠️ Voice reaction missing base64, will be handled by calling component"
            );
          }
        }

        const updatedMessages = [...existingMessages, processedMessage];

        // Use custom serializer to handle special objects
        const serializedMessages = JSON.stringify(
          updatedMessages,
          this.jsonReplacer
        );
        localStorage.setItem(key, serializedMessages);

        console.log("✅ Message added to chat successfully:", {
          chatKey: key,
          messageType: processedMessage.type,
          hasNetflixData: !!processedMessage.clipData?.netflixData,
          hasVoiceReaction: !!processedMessage.reactionData?.type,
          totalMessages: updatedMessages.length,
        });
      } else {
        console.log("⚠️ Message already exists, skipping");
      }
    } catch (error) {
      console.error("❌ Error adding message to chat:", error);
    }
  }

  // JSON replacer to handle special objects during serialization
  private static jsonReplacer(key: string, value: any): any {
    // Don't serialize Blob objects directly - they should be converted to base64 first
    if (value instanceof Blob) {
      console.log(
        "⚠️ Attempting to serialize Blob directly, this will be ignored"
      );
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
      console.error("❌ Error storing message route:", error);
    }
  }

  // Get all message routes
  private static getMessageRoutes(): MessageRoute[] {
    try {
      const stored = localStorage.getItem(MESSAGE_ROUTES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("❌ Error getting message routes:", error);
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
      console.error("❌ Error storing pending message:", error);
    }
  }

  // Get pending messages
  private static getPendingMessages(): PendingMessage[] {
    try {
      const stored = localStorage.getItem(PENDING_MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("❌ Error getting pending messages:", error);
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
      console.error("❌ Error getting campfire members:", error);
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
      console.error("❌ Error getting user name:", error);
      return "Unknown User";
    }
  }

  private static getUserAvatar(userId: number): string {
    try {
      const { UserManager } = require("./user-management");
      const user = UserManager.getUserById(userId);
      return user?.avatar || "/placeholder.svg?height=40&width=40";
    } catch (error) {
      console.error("❌ Error getting user avatar:", error);
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
    console.log("🚀 Initializing user chats for user:", userId);

    try {
      // Import UserManager dynamically to avoid circular dependency
      const { UserManager } = require("./user-management");

      // Initialize friend chats with some default messages if they don't exist
      const friends = UserManager.getFriendsForUser(userId);
      console.log("👥 User friends:", friends.length);

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
          console.log("✅ Welcome message added for friend:", friend.name);
        }
      });

      // Initialize campfire chats for campfires the user belongs to
      const userCampfires = UserManager.getCampfiresForUser(userId);
      console.log("🔥 User campfires:", userCampfires);

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
          console.log(
            "✅ Welcome message added for campfire:",
            campfireNames[campfireId]
          );
        }
      });

      console.log("✅ User chat initialization complete");
    } catch (error) {
      console.error("❌ Error initializing user chats:", error);
    }
  }

  // Clear all messages for a user (useful for testing)
  static clearUserMessages(userId: number): void {
    console.log("🗑️ Clearing all messages for user:", userId);

    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(`firetv_chat_${userId}_`)
      );

      console.log("🗑️ Found chat keys to clear:", keys.length);

      keys.forEach((key) => {
        localStorage.removeItem(key);
        console.log("🗑️ Cleared chat key:", key);
      });

      console.log("✅ User messages cleared successfully");
    } catch (error) {
      console.error("❌ Error clearing user messages:", error);
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
