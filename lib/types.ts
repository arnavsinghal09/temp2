export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  isOnline: boolean;
  lastSeen: string;
  status: string;
  currentShow?: string;
  campfires: number[]; // Array of campfire IDs the user belongs to
}

export interface HeroContent {
  id: number;
  title: string;
  subtitle: string;
  background: string;
  description: string;
  platform: string;
  type: string;
}

export interface StreamingService {
  id: number;
  name: string;
  redirectUrl?: string;
  image?: string;
  shortName: string;
}

export interface ContentItem {
  id: number;
  title: string;
  image: string;
  platform: string;
  progress?: number;
}

export interface ContentRow {
  id: number;
  title: string;
  items: ContentItem[];
}

export interface Campfire {
  id: number;
  name: string;
  members: string[];
  memberIds: number[]; // Array of user IDs who are members
  avatar: string;
  lastActivity: string;
  messageCount: number;
  clipCount: number;
  isActive: boolean;
}

export interface Clip {
  id: number;
  title: string;
  platform: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  shares: number;
  sharedBy: string;
  timestamp: string;
  campfire: string;
}

export interface TopSharer {
  id: number;
  name: string;
  clips: number;
  badge: string;
  avatar: string;
  rank: number;
}

export interface WeeklyDigestUser {
  id: number;
  name: string;
  views: number;
  engagement: string;
  avatar: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: any;
  color: string;
}

export interface Notification {
  id: number;
  type: string;
  sender: string;
  message: string;
  timestamp: string;
  campfire: string;
  isNew: boolean;
}

export interface Friend {
  id: number;
  name: string;
  status: string;
  avatar: string;
  isOnline: boolean;
  currentShow?: string | null;
}

export interface FriendRequest {
  id: number;
  name: string;
  mutualFriends: number;
  avatar: string;
}

export interface ChatMessage {
  id: number;
  type: "text" | "clip" | "voice" | "image" | "system";
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  clipData?: {
    title: string;
    thumbnail: string;
    duration: string;
    platform: string;
  };
  voiceData?: {
    duration: string;
    waveform: number[];
    audioUrl?: string;
  };
  imageData?: {
    url: string;
    caption?: string;
  };
}

export interface CampfireChat {
  campfireId: number;
  messages: ChatMessage[];
}

export interface FriendChat {
  friendId: number;
  messages: ChatMessage[];
}

export interface ChatParticipant {
  id: number;
  name: string;
  avatar: string;
  isOnline?: boolean;
  status?: string;
  type: "friend" | "campfire";
  members?: string[];
  messageCount?: number;
  clipCount?: number;
  lastActivity?: string;
}
