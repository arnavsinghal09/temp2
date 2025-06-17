export interface ClipOptions {
  duration: 15 | 30
  timestamp: number
  title: string
}

export interface DemoUser {
  id: string
  name: string
  username: string
  avatar: string
  isOnline?: boolean
}

export interface VoiceNote {
  blob: Blob
  duration: number
  url: string
}

export interface ClipShareData {
  clipOptions: ClipOptions
  selectedUsers: DemoUser[]
  message?: string
  voiceNote?: VoiceNote
}

export type ClipMenuStep = "options" | "sharing" | "success"
