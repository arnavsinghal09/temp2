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

  // Get messages for a specific chat
  static getMessagesForChat(
    userId: number,
    participantId: number,
    type: "friend" | "campfire"
  ): ChatMessage[] {
    try {
      const key = this.getChatKey(userId, participantId, type);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting messages for chat:", error);
      return [];
    }
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
        const updatedMessages = [...existingMessages, message];
        localStorage.setItem(key, JSON.stringify(updatedMessages));
      }
    } catch (error) {
      console.error("Error adding message to chat:", error);
    }
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
