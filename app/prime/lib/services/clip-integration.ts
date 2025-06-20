import type { ClipShareData } from "../types/clip";


export interface PrimeClipMessage {
  id: number;
  type: "clip";
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  clipData: {
    title: string;
    thumbnail: string;
    duration: string;
    platform: "Prime Video";
    primeData: {
      contentId: string;
      startTime: number;
      endTime: number;
      clipId: string;
      sharedFrom: "Prime Video";
    };
  };
  reactionData?: {
    type: "text" | "voice";
    content: string;
    voiceBlob?: Blob;
    voiceDuration?: string;
    voiceBase64?: string;
    timestamp?: number;
  };
}

export class PrimeClipIntegration {
  static async shareClipToFireStories(
    clipShareData: ClipShareData
  ): Promise<boolean> {
    try {
      // Get current user from Prime Video user data
      const currentUser = this.getCurrentPrimeUser();
      if (!currentUser) {
        throw new Error("No current user found");
      }

      // Prepare reaction data with proper voice handling
      let reactionData: any = undefined;
      if (clipShareData.message || clipShareData.voiceNote) {
        if (clipShareData.voiceNote) {
          // Convert voice blob to base64 for transmission
          const base64Audio = await this.blobToBase64(
            clipShareData.voiceNote.blob
          );
          reactionData = {
            type: "voice" as const,
            content: clipShareData.message || "Voice reaction",
            voiceBlob: clipShareData.voiceNote.blob,
            voiceDuration: this.formatDuration(
              clipShareData.voiceNote.duration
            ),
            voiceBase64: base64Audio,
            timestamp: Date.now(),
          };
        } else if (clipShareData.message) {
          reactionData = {
            type: "text" as const,
            content: clipShareData.message,
            timestamp: Date.now(),
          };
        }
      }

      // Create Prime Video specific clip data with proper content ID
      const primeClipData = {
        id: `prime_clip_${Date.now()}`,
        contentId: this.generateContentId(clipShareData.clipOptions.title),
        contentTitle: clipShareData.clipOptions.title,
        contentThumbnail: "/placeholder.svg?height=200&width=300",
        startTime: clipShareData.clipOptions.timestamp,
        endTime:
          clipShareData.clipOptions.timestamp +
          clipShareData.clipOptions.duration,
        duration: clipShareData.clipOptions.duration,
        originalTitle: clipShareData.clipOptions.title, // Store original title for reference
      };

      // Send to FireStories MessageSystem
      const { MessageSystem } = await import("@/lib/message-system");

      // Prepare friend IDs and campfire IDs
      const friendIds = clipShareData.selectedUsers.map((user) =>
        parseInt(user.id)
      );
      const campfireIds = clipShareData.selectedCampfires.map((campfire) =>
        parseInt(campfire.id)
      );

      // Send using the specialized Prime clip method
      MessageSystem.sendPrimeClipMessage(
        currentUser.id,
        friendIds,
        campfireIds,
        primeClipData,
        reactionData
      );

      return true;
    } catch (error) {
      console.error("Failed to share Prime clip to FireStories:", error);
      return false;
    }
  }

  // Add this new method to generate proper content IDs
  private static generateContentId(title: string): string {
    // Map common Prime Video content to actual IDs that exist in the mock data
    const contentMap: { [key: string]: string } = {
      "The Boys": "tv-1",
      "The Marvelous Mrs. Maisel": "tv-2",
      "Jack Ryan": "recent-4",
      Reacher: "action-1",
      "The Tomorrow War": "movie-1",
      "Sound of Metal": "movie-2",
      "Coming 2 America": "comedy-1",
      "The Bear": "recent-1",
      Fallout: "recent-2",
      "Mr. & Mrs. Smith": "recent-3",
      "The Power": "tv-2",
      Citadel: "original-2",
      "The Wheel of Time": "original-3",
      "Mission Impossible": "original-4",
      "THE TRAITORS": "original-1",
    };

    // Try to find a match in the content map
    for (const [key, value] of Object.entries(contentMap)) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Default fallback to a known working content ID
    return "featured-1";
  }

  private static getCurrentPrimeUser() {
    try {
      const userData = localStorage.getItem("prime-user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

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

  private static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}
