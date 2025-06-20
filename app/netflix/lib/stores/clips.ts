import { create } from "zustand";

export interface ClipReaction {
  type: "text" | "voice" | "video";
  content: string;
  timestamp: number;
  voiceBlob?: Blob; // Keep for immediate use
  voiceDuration?: number; // Duration in seconds
  voiceBase64?: string; // Base64 encoded audio for storage
}

export interface NetflixClipData {
  id: string;
  contentId: string;
  contentTitle: string;
  contentThumbnail: string;
  startTime: number;
  endTime: number;
  duration: number;
  timestamp: number; // When the clip was created
  videoUrl?: string; // Optional video URL for the clip
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
  shareTarget: "friends" | "campfires";
  reaction?: ClipReaction;
  createdAt: Date;
  status: "pending" | "processing" | "ready" | "failed";
  // New fields for integration
  clipData: NetflixClipData;
  platform: string; // "Netflix"
}

interface ClipsState {
  isCreating: boolean;
  currentClip: Partial<SharedClip> | null;
  sharedClips: SharedClip[]; // Track all shared clips

  // Actions
  createClip: (
    clipData: Omit<
      SharedClip,
      "id" | "createdAt" | "status" | "clipData" | "platform"
    >
  ) => Promise<string>;
  setCurrentClip: (clip: Partial<SharedClip> | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  getSharedClips: () => SharedClip[];
  addSharedClip: (clip: SharedClip) => void;
  updateClipStatus: (clipId: string, status: SharedClip["status"]) => void;
  getClipById: (clipId: string) => SharedClip | undefined;
  clearClips: () => void; // Add method to clear clips
}

// Import FireStories integration with proper error handling
const shareClipToFireStories = async (clip: SharedClip): Promise<boolean> => {
  try {
    // Dynamic import to avoid circular dependencies
    const { FireStoriesIntegration } = await import(
      "../services/firestories-integration"
    );
    return await FireStoriesIntegration.shareClipToFireStories(clip);
  } catch (error) {
    console.error("Failed to share clip to FireStories:", error);
    return false;
  }
};

export const useClipsStore = create<ClipsState>()((set, get) => ({
  isCreating: false,
  currentClip: null,
  sharedClips: [],

  createClip: async (clipInput) => {
    // Generate unique IDs
    const clipId = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const clipDataId = `clip_data_${Date.now()}`;
    
    const newClip: SharedClip = {
      ...clipInput,
      id: clipId,
      createdAt: new Date(),
      status: "pending",
      clipData: {
        id: clipDataId,
        contentId: clipInput.contentId,
        contentTitle: clipInput.contentTitle,
        contentThumbnail: clipInput.contentThumbnail,
        startTime: clipInput.startTime,
        endTime: clipInput.endTime,
        duration: clipInput.duration,
        timestamp: Date.now(),
      },
      platform: "Netflix",
    };

    console.log("🎬 Creating Netflix clip:", {
      clipId: newClip.id,
      contentTitle: newClip.contentTitle,
      shareTarget: newClip.shareTarget,
      recipientCount: newClip.sharedWith.length,
      hasReaction: !!newClip.reaction,
      reactionType: newClip.reaction?.type,
      voiceReactionDuration: newClip.reaction?.voiceDuration,
    });

    // Add clip to store with processing status
    set((state) => ({
      sharedClips: [...state.sharedClips, { ...newClip, status: "processing" }],
    }));

    try {
      // Actually share the clip to FireStories
      const success = await shareClipToFireStories(newClip);

      if (success) {
        // Update status to ready
        set((state) => ({
          sharedClips: state.sharedClips.map((clip) =>
            clip.id === newClip.id ? { ...clip, status: "ready" } : clip
          ),
        }));

        console.log("✅ Netflix clip shared successfully to FireStories");
        return newClip.id;
      } else {
        throw new Error("Failed to share clip to FireStories");
      }
    } catch (error) {
      console.error("❌ Failed to create and share clip:", error);

      // Update status to failed
      set((state) => ({
        sharedClips: state.sharedClips.map((clip) =>
          clip.id === newClip.id ? { ...clip, status: "failed" } : clip
        ),
      }));

      // Re-throw error for handling in UI
      throw error;
    }
  },

  setCurrentClip: (clip) => {
    set({ currentClip: clip });
  },

  setIsCreating: (isCreating) => {
    set({ isCreating });
  },

  getSharedClips: () => {
    return get().sharedClips;
  },

  addSharedClip: (clip) => {
    set((state) => ({
      sharedClips: [...state.sharedClips, clip],
    }));
  },

  updateClipStatus: (clipId, status) => {
    set((state) => ({
      sharedClips: state.sharedClips.map((clip) =>
        clip.id === clipId ? { ...clip, status } : clip
      ),
    }));
  },

  getClipById: (clipId) => {
    const state = get();
    return state.sharedClips.find((clip) => clip.id === clipId);
  },

  clearClips: () => {
    set({
      sharedClips: [],
      currentClip: null,
      isCreating: false,
    });
  },
}));

// Export helper functions for external use
export const clipHelpers = {
  formatDuration: (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  },

  getClipUrl: (contentId: string, startTime: number): string => {
    return `/netflix/watch/${contentId}?t=${Math.floor(startTime)}`;
  },

  validateClipData: (clipData: Partial<SharedClip>): boolean => {
    return !!(
      clipData.contentId &&
      clipData.contentTitle &&
      clipData.startTime !== undefined &&
      clipData.endTime !== undefined &&
      clipData.duration &&
      clipData.sharedBy &&
      clipData.sharedWith &&
      clipData.sharedWith.length > 0 &&
      clipData.shareTarget
    );
  },

  // Helper to create clip data from video player info
  createClipFromVideoData: (
    contentId: string,
    contentTitle: string,
    contentThumbnail: string,
    startTime: number,
    duration: number,
    sharedBy: { id: number; name: string; avatar: string },
    sharedWith: number[],
    shareTarget: "friends" | "campfires",
    reaction?: ClipReaction
  ): Omit<SharedClip, "id" | "createdAt" | "status" | "clipData" | "platform"> => {
    return {
      contentId,
      contentTitle,
      contentThumbnail,
      startTime,
      endTime: startTime + duration,
      duration,
      sharedBy,
      sharedWith,
      shareTarget,
      reaction,
    };
  },
};
