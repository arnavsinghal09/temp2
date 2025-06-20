import { create } from "zustand";

export interface ClipReaction {
  type: "text" | "voice" | "video";
  content: string;
  timestamp: number;
}

export interface SharedClip {
  id: string;
  contentId: string;
  contentTitle: string;
  contentThumbnail: string;
  startTime: number;
  endTime: number;
  duration: number;
  sharedBy: {
    id: number;
    name: string;
    avatar: string;
  };
  sharedWith: number[];
  shareTarget: "friends" | "campfires"; // New field to indicate what type of sharing
  reaction?: ClipReaction;
  createdAt: Date;
  status: "pending" | "processing" | "ready" | "failed";
}

interface ClipsState {
  isCreating: boolean;
  currentClip: Partial<SharedClip> | null;

  // Actions
  createClip: (
    clipData: Omit<SharedClip, "id" | "createdAt" | "status">
  ) => string;
  setCurrentClip: (clip: Partial<SharedClip> | null) => void;
  setIsCreating: (isCreating: boolean) => void;
}

export const useClipsStore = create<ClipsState>()((set) => ({
  isCreating: false,
  currentClip: null,

  createClip: (clipData) => {
    const newClip: SharedClip = {
      ...clipData,
      id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      status: "ready",
    };

    // In the Netflix section, clips are created and logged for FireStories integration
    console.log("Clip created for FireStories integration:", {
      ...newClip,
      shareTargetType: newClip.shareTarget,
      recipientCount: newClip.sharedWith.length,
    });

    return newClip.id;
  },

  setCurrentClip: (clip) => set({ currentClip: clip }),
  setIsCreating: (isCreating) => set({ isCreating }),
}));
