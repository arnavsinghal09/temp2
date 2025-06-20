import type { SharedClip, ClipReaction } from "../stores/clips";

// Define the ChatMessage interface locally to avoid import issues
interface FireStoriesChatMessage {
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
    netflixData?: {
      contentId: string;
      startTime: number;
      endTime: number;
      clipId: string;
      sharedFrom: "Netflix";
    };
  };
  voiceData?: {
    duration: string;
    waveform: number[];
    audioUrl?: string;
    voiceBlob?: Blob;
  };
  reactionData?: {
    type: "text" | "voice";
    content: string;
    voiceBlob?: Blob;
    voiceDuration?: string;
  };
}

export class FireStoriesIntegration {
  /**
   * Share a Netflix clip to FireStories friends/campfires
   */
  static async shareClipToFireStories(clip: SharedClip): Promise<boolean> {
    try {
      console.log("🎬 Sharing Netflix clip to FireStories:", clip);

      // Use the enhanced message system for Netflix clips
      const { MessageSystem } = await import("@/lib/message-system");

      // Prepare reaction data with proper voice handling
      let reactionData = undefined;
      if (clip.reaction) {
        reactionData = {
          type: clip.reaction.type,
          content: clip.reaction.content,
          voiceDuration: clip.reaction.voiceDuration,
          voiceBlob: undefined as Blob | undefined,
          voiceBase64: undefined as string | undefined,
        };

        // Handle voice blob conversion
        if (clip.reaction.type === "voice" && clip.reaction.voiceBlob) {
          try {
            const base64Audio = await this.blobToBase64(
              clip.reaction.voiceBlob
            );
            reactionData.voiceBlob = clip.reaction.voiceBlob;
            reactionData.voiceBase64 = base64Audio;
            console.log("Voice blob converted to base64 for transmission");
          } catch (error) {
            console.error("Failed to convert voice blob:", error);
            // Continue without voice data
          }
        }
      }

      // Send using the specialized Netflix clip method
      MessageSystem.sendNetflixClipMessage(
        clip.sharedBy.id,
        clip.sharedWith,
        clip.shareTarget,
        clip.clipData,
        reactionData
      );

      // Store the shared clip in localStorage for persistence
      this.storeSharedClip(clip);

      console.log("✅ Successfully shared Netflix clip to FireStories");
      return true;
    } catch (error) {
      console.error(" Error sharing Netflix clip to FireStories:", error);
      return false;
    }
  }

  /**
   * Convert blob to base64 asynchronously
   */
  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Create a ChatMessage from a SharedClip (Legacy method for compatibility)
   */
  private static createClipMessage(clip: SharedClip): FireStoriesChatMessage {
    const baseMessage: FireStoriesChatMessage = {
      id: Date.now() + Math.random(),
      type: "clip",
      sender: clip.sharedBy.name,
      content:
        clip.reaction?.content || `Shared a clip from ${clip.contentTitle}`,
      timestamp: new Date().toLocaleString(),
      avatar: clip.sharedBy.avatar,
      clipData: {
        title: clip.contentTitle,
        thumbnail: clip.contentThumbnail,
        duration: this.formatDuration(clip.duration),
        platform: "Netflix",
        netflixData: {
          contentId: clip.contentId,
          startTime: clip.startTime,
          endTime: clip.endTime,
          clipId: clip.id,
          sharedFrom: "Netflix",
        },
      },
    };

    // Add reaction data if present
    if (clip.reaction) {
      baseMessage.reactionData = {
        type: clip.reaction.type as "text" | "voice",
        content: clip.reaction.content,
        voiceBlob: clip.reaction.voiceBlob,
        voiceDuration: clip.reaction.voiceDuration
          ? this.formatDuration(clip.reaction.voiceDuration)
          : undefined,
      };

      // If it's a voice reaction, also add voice data
      if (clip.reaction.type === "voice" && clip.reaction.voiceBlob) {
        baseMessage.voiceData = {
          duration: clip.reaction.voiceDuration
            ? this.formatDuration(clip.reaction.voiceDuration)
            : "0:00",
          waveform: this.generateWaveform(),
          voiceBlob: clip.reaction.voiceBlob,
        };
      }
    }

    return baseMessage;
  }

  /**
   * Share clip to selected friends (Legacy method for compatibility)
   */
  private static async shareToFriends(
    clip: SharedClip,
    message: FireStoriesChatMessage
  ): Promise<void> {
    for (const friendId of clip.sharedWith) {
      try {
        console.log(`📤 Sending clip to friend ${friendId}`);

        // Send direct message through MessageSystem
        const { MessageSystem } = await import("@/lib/message-system");
        MessageSystem.sendDirectMessage(
          clip.sharedBy.id,
          friendId,
          message as any // Type assertion to match existing interface
        );

        console.log(`✅ Clip sent to friend ${friendId}`);
      } catch (error) {
        console.error(`❌ Failed to send clip to friend ${friendId}:`, error);
      }
    }
  }

  /**
   * Share clip to selected campfires (Legacy method for compatibility)
   */
  private static async shareToCampfires(
    clip: SharedClip,
    message: FireStoriesChatMessage
  ): Promise<void> {
    for (const campfireId of clip.sharedWith) {
      try {
        console.log(`📤 Sending clip to campfire ${campfireId}`);

        // Send campfire message through MessageSystem
        const { MessageSystem } = await import("@/lib/message-system");
        MessageSystem.sendCampfireMessage(
          clip.sharedBy.id,
          campfireId,
          message as any // Type assertion to match existing interface
        );

        console.log(`✅ Clip sent to campfire ${campfireId}`);
      } catch (error) {
        console.error(
          `❌ Failed to send clip to campfire ${campfireId}:`,
          error
        );
      }
    }
  }

  /**
   * Store shared clip in localStorage for persistence
   */
  private static storeSharedClip(clip: SharedClip): void {
    try {
      const existingClips = this.getStoredClips();
      existingClips.push(clip);

      // Keep only last 100 clips to prevent storage bloat
      const clipsToStore = existingClips.slice(-100);

      localStorage.setItem(
        "netflix_shared_clips",
        JSON.stringify(clipsToStore)
      );
      console.log(`📁 Stored clip ${clip.id} in localStorage`);
    } catch (error) {
      console.error("Error storing shared clip:", error);
    }
  }

  /**
   * Get stored clips from localStorage
   */
  private static getStoredClips(): SharedClip[] {
    try {
      const stored = localStorage.getItem("netflix_shared_clips");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting stored clips:", error);
      return [];
    }
  }

  /**
   * Format duration from seconds to MM:SS
   */
  private static formatDuration(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Generate a random waveform for voice messages
   */
  private static generateWaveform(length: number = 20): number[] {
    return Array.from({ length }, () => Math.random() * 0.7 + 0.2);
  }

  /**
   * Get user's Netflix watch URL for a clip
   */
  static getNetflixWatchUrl(contentId: string, startTime: number): string {
    return `/netflix/watch/${contentId}?t=${Math.floor(startTime)}`;
  }

  /**
   * Check if user can access Netflix content
   */
  static canAccessNetflix(): boolean {
    try {
      // Check if user is logged in to Netflix (has user data)
      const netflixUser = localStorage.getItem("netflix-user");
      return !!netflixUser;
    } catch {
      return false;
    }
  }

  /**
   * Get current Netflix user data
   */
  static getNetflixUser(): any {
    try {
      const userData = localStorage.getItem("netflix-user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }
}
