import type { SharedClip, ClipReaction } from "../stores/clips";

// Enhanced ChatMessage interface that extends the base type
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
    isPlaying?: boolean;
  };
  imageData?: {
    url: string;
    caption?: string;
  };
  // Reaction data for clips with voice/text reactions
  reactionData?: {
    type: "text" | "voice";
    content: string;
    voiceBlob?: Blob;
    voiceDuration?: string;
    voiceBase64?: string;
    timestamp?: number;
    waveform?: number[];
  };
}

export class FireStoriesIntegration {
  /**
   * Share a Netflix clip to FireStories friends/campfires with enhanced audio handling
   */
  static async shareClipToFireStories(clip: SharedClip): Promise<boolean> {
    try {
      // Use the enhanced message system for Netflix clips
      const { MessageSystem } = await import("@/lib/message-system");

      // Prepare reaction data with proper voice handling
      let reactionData:
        | {
            type: "text" | "voice";
            content: string;
            timestamp: number;
            voiceDuration?: number;
            voiceBlob?: Blob;
            voiceBase64?: string;
          }
        | undefined = undefined;

      if (clip.reaction) {
        reactionData = {
          type: clip.reaction.type as "text" | "voice",
          content: clip.reaction.content,
          timestamp: clip.reaction.timestamp,
          voiceDuration: clip.reaction.voiceDuration,
        };

        // Handle voice blob conversion with enhanced error handling
        if (clip.reaction.type === "voice" && clip.reaction.voiceBlob) {
          try {
            // Convert blob to base64 for transmission
            const base64Audio = await this.blobToBase64(
              clip.reaction.voiceBlob
            );

            reactionData.voiceBlob = clip.reaction.voiceBlob;
            reactionData.voiceBase64 = base64Audio;
          } catch (error) {
            // Continue without voice data but handle the error silently
            reactionData.voiceBlob = undefined;
            reactionData.voiceBase64 = undefined;
          }
        }
      }

      // Prepare clip data for transmission
      const clipDataForTransmission = {
        id: clip.clipData.id,
        contentId: clip.contentId,
        contentTitle: clip.contentTitle,
        contentThumbnail: clip.contentThumbnail,
        startTime: clip.startTime,
        endTime: clip.endTime,
        duration: clip.duration,
      };

      // Send using the specialized Netflix clip method
      MessageSystem.sendNetflixClipMessage(
        clip.sharedBy.id,
        clip.sharedWith,
        clip.shareTarget,
        clipDataForTransmission,
        reactionData
      );

      // Store the shared clip in localStorage for persistence
      this.storeSharedClip(clip);

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Enhanced blob to base64 conversion with better error handling
   */
  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!blob || blob.size === 0) {
        reject(new Error("Invalid blob: blob is null or empty"));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(
            new Error("Failed to convert blob to base64: result is not string")
          );
        }
      };

      reader.onerror = (error) => {
        reject(new Error(`FileReader error: ${error}`));
      };

      reader.onabort = () => {
        reject(new Error("FileReader aborted"));
      };

      try {
        reader.readAsDataURL(blob);
      } catch (error) {
        reject(new Error(`Failed to start FileReader: ${error}`));
      }
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
        timestamp: clip.reaction.timestamp,
        voiceBase64: clip.reaction.voiceBase64,
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
        // Send direct message through MessageSystem
        const { MessageSystem } = await import("@/lib/message-system");
        MessageSystem.sendDirectMessage(
          clip.sharedBy.id,
          friendId,
          message as any // Type assertion to match existing interface
        );
      } catch (error) {
        // Silent error handling
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
        // Send campfire message through MessageSystem
        const { MessageSystem } = await import("@/lib/message-system");
        MessageSystem.sendCampfireMessage(
          clip.sharedBy.id,
          campfireId,
          message as any // Type assertion to match existing interface
        );
      } catch (error) {
        // Silent error handling
      }
    }
  }

  /**
   * Store shared clip in localStorage for persistence
   */
  private static storeSharedClip(clip: SharedClip): void {
    try {
      const existingClips = this.getStoredClips();

      // Create a storable version without problematic objects
      const storableClip = {
        ...clip,
        reaction: clip.reaction
          ? {
              ...clip.reaction,
              // Store base64 instead of blob for persistence
              voiceBlob: undefined,
              voiceBase64: clip.reaction.voiceBase64,
            }
          : undefined,
      };

      existingClips.push(storableClip);

      // Keep only last 100 clips to prevent storage bloat
      const clipsToStore = existingClips.slice(-100);

      localStorage.setItem(
        "netflix_shared_clips",
        JSON.stringify(clipsToStore)
      );
    } catch (error) {
      // Silent error handling
    }
  }

  /**
   * Get stored clips from localStorage
   */
  private static getStoredClips(): SharedClip[] {
    try {
      const stored = localStorage.getItem("netflix_shared_clips");
      const clips = stored ? JSON.parse(stored) : [];
      return clips;
    } catch (error) {
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

  /**
   * Reconstruct audio blob from base64 (utility method)
   */
  static async reconstructAudioFromBase64(
    base64Data: string
  ): Promise<Blob | null> {
    try {
      if (!base64Data || typeof base64Data !== "string") {
        return null;
      }

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

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      return blob;
    } catch (error) {
      return null;
    }
  }
}
