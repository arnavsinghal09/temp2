import type { ChatMessage } from "./types"

const CHAT_STORAGE_KEY = "firetv_chats"

export interface StoredChat {
  participantId: number
  participantType: "friend" | "campfire"
  messages: ChatMessage[]
  lastUpdated: string
}

export class ChatStorage {
  private static getStoredChats(): StoredChat[] {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading chat storage:", error)
      return []
    }
  }

  private static saveStoredChats(chats: StoredChat[]): void {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats))
    } catch (error) {
      console.error("Error saving chat storage:", error)
    }
  }

  static getChatMessages(participantId: number, participantType: "friend" | "campfire"): ChatMessage[] {
    const storedChats = this.getStoredChats()
    const chat = storedChats.find((c) => c.participantId === participantId && c.participantType === participantType)
    return chat?.messages || []
  }

  static saveChatMessages(
    participantId: number,
    participantType: "friend" | "campfire",
    messages: ChatMessage[],
  ): void {
    const storedChats = this.getStoredChats()
    const existingChatIndex = storedChats.findIndex(
      (c) => c.participantId === participantId && c.participantType === participantType,
    )

    const updatedChat: StoredChat = {
      participantId,
      participantType,
      messages,
      lastUpdated: new Date().toISOString(),
    }

    if (existingChatIndex >= 0) {
      storedChats[existingChatIndex] = updatedChat
    } else {
      storedChats.push(updatedChat)
    }

    this.saveStoredChats(storedChats)
  }

  static addMessage(participantId: number, participantType: "friend" | "campfire", message: ChatMessage): void {
    const existingMessages = this.getChatMessages(participantId, participantType)
    const updatedMessages = [...existingMessages, message]
    this.saveChatMessages(participantId, participantType, updatedMessages)
  }

  static initializeChatIfEmpty(
    participantId: number,
    participantType: "friend" | "campfire",
    defaultMessages: ChatMessage[],
  ): ChatMessage[] {
    const existingMessages = this.getChatMessages(participantId, participantType)

    // If no stored messages exist, initialize with default messages
    if (existingMessages.length === 0 && defaultMessages.length > 0) {
      this.saveChatMessages(participantId, participantType, defaultMessages)
      return defaultMessages
    }

    return existingMessages
  }

  static clearAllChats(): void {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing chat storage:", error)
    }
  }

  static clearChat(participantId: number, participantType: "friend" | "campfire"): void {
    const storedChats = this.getStoredChats()
    const filteredChats = storedChats.filter(
      (c) => !(c.participantId === participantId && c.participantType === participantType),
    )
    this.saveStoredChats(filteredChats)
  }
}
