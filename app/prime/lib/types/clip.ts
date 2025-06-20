export interface ClipOptions {
  duration: 15 | 30;
  timestamp: number;
  title: string;
}

export interface PrimeUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
}

export interface PrimeCampfire {
  id: string;
  name: string;
  avatar: string;
  members: string[];
  memberCount: number;
}

export interface VoiceNote {
  blob: Blob;
  duration: number;
  url: string;
}

export interface ClipShareData {
  clipOptions: ClipOptions;
  selectedUsers: PrimeUser[];
  selectedCampfires: PrimeCampfire[];
  message?: string;
  voiceNote?: VoiceNote;
}

export type ClipMenuStep = "options" | "sharing" | "success";
