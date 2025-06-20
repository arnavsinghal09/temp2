import { create } from "zustand";

export interface ClipReaction {
  type: "text" | "voice" | "video";
  content: string;
  timestamp: number;
  voiceBlob?: Blob; // Add voice blob data
  voiceDuration?: number; // Add voice duration in seconds
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
}

// Import FireStories integration (we'll create this next)
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

  createClip: async (clipData) => {
    const newClip: SharedClip = {
      ...clipData,
      id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      status: "pending",
      clipData: {
        id: `clip_data_${Date.now()}`,
        contentId: clipData.contentId,
        contentTitle: clipData.contentTitle,
        contentThumbnail: clipData.contentThumbnail,
        startTime: clipData.startTime,
        endTime: clipData.endTime,
        duration: clipData.duration,
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
    });

    // Update status to processing
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

      throw error;
    }
  },

  setCurrentClip: (clip) => set({ currentClip: clip }),
  setIsCreating: (isCreating) => set({ isCreating }),

  getSharedClips: () => get().sharedClips,

  addSharedClip: (clip) =>
    set((state) => ({
      sharedClips: [...state.sharedClips, clip],
    })),
}));
