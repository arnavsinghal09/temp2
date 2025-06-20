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
      console.log("🎬 Starting FireStories integration for Netflix clip:", {
        clipId: clip.id,
        contentTitle: clip.contentTitle,
        shareTarget: clip.shareTarget,
        recipientCount: clip.sharedWith.length,
        hasReaction: !!clip.reaction,
        reactionType: clip.reaction?.type,
      });

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
        console.log("📝 Processing clip reaction:", {
          type: clip.reaction.type,
          hasContent: !!clip.reaction.content,
          hasVoiceBlob: !!clip.reaction.voiceBlob,
          voiceDuration: clip.reaction.voiceDuration,
        });

        reactionData = {
          type: clip.reaction.type as "text" | "voice",
          content: clip.reaction.content,
          timestamp: clip.reaction.timestamp,
          voiceDuration: clip.reaction.voiceDuration,
        };

        // Handle voice blob conversion with enhanced error handling
        if (clip.reaction.type === "voice" && clip.reaction.voiceBlob) {
          console.log("🎤 Processing voice blob for FireStories:", {
            blobSize: clip.reaction.voiceBlob.size,
            blobType: clip.reaction.voiceBlob.type,
          });

          try {
            // Convert blob to base64 for transmission
            const base64Audio = await this.blobToBase64(
              clip.reaction.voiceBlob
            );

            reactionData.voiceBlob = clip.reaction.voiceBlob;
            reactionData.voiceBase64 = base64Audio;

            console.log("✅ Voice blob converted to base64 successfully:", {
              originalBlobSize: clip.reaction.voiceBlob.size,
              base64Length: base64Audio.length,
              base64Preview: base64Audio.substring(0, 50) + "...",
            });
          } catch (error) {
            console.error("❌ Failed to convert voice blob to base64:", error);
            // Continue without voice data but log the issue
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

      console.log("📦 Sending clip data to MessageSystem:", {
        clipData: clipDataForTransmission,
        hasReactionData: !!reactionData,
        reactionType: reactionData?.type,
        hasVoiceData: !!(reactionData?.voiceBlob || reactionData?.voiceBase64),
      });

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

      console.log("✅ Successfully shared Netflix clip to FireStories:", {
        clipId: clip.id,
        shareTarget: clip.shareTarget,
        recipientCount: clip.sharedWith.length,
        reactionIncluded: !!reactionData,
      });

      return true;
    } catch (error) {
      console.error("❌ Error sharing Netflix clip to FireStories:", error);
      return false;
    }
  }

  /**
   * Enhanced blob to base64 conversion with better error handling
   */
  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log("🔄 Converting blob to base64:", {
        size: blob.size,
        type: blob.type,
      });

      if (!blob || blob.size === 0) {
        console.error("❌ Invalid blob provided for conversion");
        reject(new Error("Invalid blob: blob is null or empty"));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          console.log("✅ Blob to base64 conversion successful:", {
            originalSize: blob.size,
            base64Length: reader.result.length,
          });
          resolve(reader.result);
        } else {
          console.error("❌ FileReader result is not a string");
          reject(
            new Error("Failed to convert blob to base64: result is not string")
          );
        }
      };

      reader.onerror = (error) => {
        console.error("❌ FileReader error during blob conversion:", error);
        reject(new Error(`FileReader error: ${error}`));
      };

      reader.onabort = () => {
        console.error("❌ FileReader aborted during blob conversion");
        reject(new Error("FileReader aborted"));
      };

      try {
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("❌ Error starting FileReader:", error);
        reject(new Error(`Failed to start FileReader: ${error}`));
      }
    });
  }

  /**
   * Create a ChatMessage from a SharedClip (Legacy method for compatibility)
   */
  private static createClipMessage(clip: SharedClip): FireStoriesChatMessage {
    console.log("🎬 Creating chat message from shared clip:", {
      clipId: clip.id,
      contentTitle: clip.contentTitle,
      hasReaction: !!clip.reaction,
    });

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
      console.log("📝 Adding reaction data to message:", {
        type: clip.reaction.type,
        hasVoiceBlob: !!clip.reaction.voiceBlob,
      });

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
        console.log("🎤 Adding voice data to message");

        baseMessage.voiceData = {
          duration: clip.reaction.voiceDuration
            ? this.formatDuration(clip.reaction.voiceDuration)
            : "0:00",
          waveform: this.generateWaveform(),
          voiceBlob: clip.reaction.voiceBlob,
        };
      }
    }

    console.log("✅ Chat message created successfully");
    return baseMessage;
  }

  /**
   * Share clip to selected friends (Legacy method for compatibility)
   */
  private static async shareToFriends(
    clip: SharedClip,
    message: FireStoriesChatMessage
  ): Promise<void> {
    console.log("👥 Sharing clip to friends:", {
      friendCount: clip.sharedWith.length,
      friendIds: clip.sharedWith,
    });

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
    console.log("🔥 Sharing clip to campfires:", {
      campfireCount: clip.sharedWith.length,
      campfireIds: clip.sharedWith,
    });

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
      console.log("💾 Storing shared clip in localStorage:", clip.id);

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

      console.log("✅ Shared clip stored successfully:", {
        clipId: clip.id,
        totalStored: clipsToStore.length,
      });
    } catch (error) {
      console.error("❌ Error storing shared clip:", error);
    }
  }

  /**
   * Get stored clips from localStorage
   */
  private static getStoredClips(): SharedClip[] {
    try {
      const stored = localStorage.getItem("netflix_shared_clips");
      const clips = stored ? JSON.parse(stored) : [];

      console.log("📖 Retrieved stored clips:", {
        count: clips.length,
      });

      return clips;
    } catch (error) {
      console.error("❌ Error getting stored clips:", error);
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
      console.log("🔄 Reconstructing audio blob from base64");

      if (!base64Data || typeof base64Data !== "string") {
        console.error("❌ Invalid base64 data provided");
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

      console.log("✅ Audio blob reconstructed successfully:", {
        size: blob.size,
        type: blob.type,
      });

      return blob;
    } catch (error) {
      console.error("❌ Error reconstructing audio blob:", error);
      return null;
    }
  }
}
