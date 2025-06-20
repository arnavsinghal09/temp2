"use client";

import { useState } from "react";
import {
  X,
  Send,
  Clock,
  MessageSquare,
  Share2,
  Users,
  User,
  Mic,
  MicOff,
  Play,
  Pause,
  StopCircle,
} from "lucide-react";
import { useAuthStore } from "../../lib/stores/auth";
import { useClipsStore } from "../../lib/stores/clips";
import type { Content } from "../../lib/data/content";
import { VoiceRecordingVisualizer } from "./VoiceRecordingVisualizer";

interface SocialOverlayProps {
  content: Content;
  currentTime: number;
  onClose: () => void;
}

type Step = "clip" | "reaction" | "share" | "success";
type ReactionType = "text" | "voice" | "video";
type ShareTarget = "friends" | "campfires";

// Voice recording state interface
interface VoiceRecording {
  isRecording: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  duration: number;
  blob: Blob | null;
  url: string | null;
  base64: string | null; // Add base64 field
  mediaRecorder: MediaRecorder | null;
}

export default function SocialOverlay({
  content,
  currentTime,
  onClose,
}: SocialOverlayProps) {
  const { user } = useAuthStore();
  const { createClip, setIsCreating } = useClipsStore();

  const [step, setStep] = useState<Step>("clip");
  const [clipDuration, setClipDuration] = useState(15);
  const [reactionType, setReactionType] = useState<ReactionType>("text");
  const [reactionContent, setReactionContent] = useState("");
  const [shareTarget, setShareTarget] = useState<ShareTarget>("friends");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [selectedCampfires, setSelectedCampfires] = useState<number[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  // Voice recording state
  const [voiceRecording, setVoiceRecording] = useState<VoiceRecording>({
    isRecording: false,
    isPlaying: false,
    isPaused: false,
    duration: 0,
    blob: null,
    url: null,
    base64: null,
    mediaRecorder: null,
  });

  if (!user) return null;

  const startTime = currentTime;
  const endTime = Math.min(currentTime + clipDuration, content.duration);
  const userFriends = user.friends || [];
  const userCampfires = user.campfires || [];

  const handleCreateClip = () => {
    console.log("🎬 Creating clip for content:", content.title);
    setStep("reaction");
  };

  const handleAddReaction = () => {
    console.log("📝 Adding reaction, type:", reactionType);
    if (reactionType === "voice" && voiceRecording.blob) {
      console.log("🎤 Voice reaction data:", {
        blobSize: voiceRecording.blob.size,
        blobType: voiceRecording.blob.type,
        duration: voiceRecording.duration,
        hasBase64: !!voiceRecording.base64,
      });
    }
    setStep("share");
  };

  const handleSkipReaction = () => {
    console.log("⏭️ Skipping reaction");
    setReactionContent("");
    deleteVoiceRecording();
    setStep("share");
  };

  // Enhanced blob to base64 conversion
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("🔄 Converting blob to base64:", {
        size: blob.size,
        type: blob.type,
      });

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          console.log("✅ Blob converted to base64 successfully");
          resolve(reader.result);
        } else {
          console.error("❌ FileReader result is not a string");
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = (error) => {
        console.error("❌ FileReader error:", error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  };

  // Voice recording functions
  const startVoiceRecording = async () => {
    console.log("🎤 Starting voice recording...");

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("✅ Microphone access granted");

      // Check for MediaRecorder support
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      console.log("🎵 Using MIME type:", mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log("📦 Audio chunk received:", e.data.size, "bytes");
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("🛑 Recording stopped, processing audio...");

        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);

        console.log("🎵 Audio blob created:", {
          size: blob.size,
          type: blob.type,
        });

        try {
          // Convert to base64
          const base64 = await blobToBase64(blob);
          console.log("✅ Base64 conversion successful:", {
            base64Length: base64.length,
            base64Preview: base64.substring(0, 50) + "...",
          });

          setVoiceRecording((prev) => ({
            ...prev,
            isRecording: false,
            blob,
            url,
            base64,
            mediaRecorder: null,
          }));
        } catch (error) {
          console.error("❌ Failed to convert blob to base64:", error);
          setVoiceRecording((prev) => ({
            ...prev,
            isRecording: false,
            blob,
            url,
            base64: null,
            mediaRecorder: null,
          }));
        }

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("🎤 Microphone track stopped");
        });
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
        alert("Recording error occurred. Please try again.");

        // Clean up on error
        stream.getTracks().forEach((track) => track.stop());
        setVoiceRecording((prev) => ({
          ...prev,
          isRecording: false,
          mediaRecorder: null,
        }));
      };

      mediaRecorder.start(100); // Collect data every 100ms

      setVoiceRecording((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
        mediaRecorder,
        blob: null,
        url: null,
        base64: null,
      }));

      console.log("🎤 Voice recording started successfully");

      // Start duration counter
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (mediaRecorder.state === "recording") {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setVoiceRecording((prev) => ({
            ...prev,
            duration: elapsed,
          }));

          // Auto-stop after 60 seconds
          if (elapsed >= 60) {
            console.log("⏰ Auto-stopping recording after 60 seconds");
            stopVoiceRecording();
            clearInterval(interval);
          }
        } else {
          clearInterval(interval);
        }
      }, 1000);
    } catch (error: any) {
      console.error("❌ Error starting voice recording:", error);

      if (error.name === "NotAllowedError") {
        alert(
          "Microphone access denied. Please allow microphone access and try again."
        );
      } else if (error.name === "NotFoundError") {
        alert(
          "No microphone found. Please connect a microphone and try again."
        );
      } else {
        alert(
          "Could not access microphone. Please check your browser settings and try again."
        );
      }

      setVoiceRecording((prev) => ({
        ...prev,
        isRecording: false,
        mediaRecorder: null,
      }));
    }
  };

  const stopVoiceRecording = () => {
    console.log("🛑 Stopping voice recording...");

    if (
      voiceRecording.mediaRecorder &&
      voiceRecording.mediaRecorder.state === "recording"
    ) {
      console.log("🛑 MediaRecorder stop called");
      voiceRecording.mediaRecorder.stop();
    } else {
      console.log("⚠️ MediaRecorder not in recording state");
    }
  };

  const playVoiceRecording = () => {
    console.log("▶️ Playing voice recording...");

    if (voiceRecording.url && !voiceRecording.isPlaying) {
      console.log("🎵 Creating audio player with URL:", voiceRecording.url);

      try {
        const audio = new Audio(voiceRecording.url);

        setVoiceRecording((prev) => ({ ...prev, isPlaying: true }));

        audio.oncanplay = () => {
          console.log("✅ Audio can play");
        };

        audio.onloadstart = () => {
          console.log("🔄 Audio loading started");
        };

        audio.onended = () => {
          console.log("⏹️ Audio playback ended");
          setVoiceRecording((prev) => ({ ...prev, isPlaying: false }));
        };

        audio.onerror = (error) => {
          console.error("❌ Audio playback error:", error);
          setVoiceRecording((prev) => ({ ...prev, isPlaying: false }));
          alert("Error playing voice recording. Please try recording again.");
        };

        audio.play().catch((error) => {
          console.error("❌ Error starting audio playback:", error);
          setVoiceRecording((prev) => ({ ...prev, isPlaying: false }));
        });
      } catch (error) {
        console.error("❌ Error creating audio player:", error);
        setVoiceRecording((prev) => ({ ...prev, isPlaying: false }));
      }
    } else {
      console.log("⚠️ Cannot play: URL missing or already playing");
    }
  };

  const deleteVoiceRecording = () => {
    console.log("🗑️ Deleting voice recording");

    if (voiceRecording.url) {
      URL.revokeObjectURL(voiceRecording.url);
      console.log("🗑️ Object URL revoked");
    }

    setVoiceRecording({
      isRecording: false,
      isPlaying: false,
      isPaused: false,
      duration: 0,
      blob: null,
      url: null,
      base64: null,
      mediaRecorder: null,
    });

    console.log("✅ Voice recording deleted successfully");
  };

  // Update the handleShare function to add more logging for friend sharing

  const handleShare = async () => {
    if (getSelectedCount() === 0) return;

    console.log("🚀 Starting clip share process...");
    console.log("📊 Share details:", {
      shareTarget,
      selectedFriends,
      selectedCampfires,
      selectedCount: getSelectedCount(),
      userFriends: userFriends.map(f => ({ id: f.id, name: f.name })),
      userCampfires: userCampfires.map(c => ({ id: c.id, name: c.name })),
    });

    setIsCreating(true);
    setIsSharing(true);

    try {
      const sharedWith = shareTarget === "friends" ? selectedFriends : selectedCampfires;

      console.log("🎯 Final sharing targets:", {
        shareTarget,
        sharedWith,
        targetNames: shareTarget === "friends"
          ? sharedWith.map(id => userFriends.find(f => f.id === id)?.name || `Friend ${id}`)
          : sharedWith.map(id => userCampfires.find(c => c.id === id)?.name || `Campfire ${id}`),
      });

      // Prepare reaction data with proper blob handling
      let reactionData = undefined;
      if (reactionType === "text" && reactionContent.trim()) {
        console.log("📝 Preparing text reaction");
        reactionData = {
          type: "text" as const,
          content: reactionContent.trim(),
          timestamp: Date.now(),
        };
      } else if (reactionType === "voice" && voiceRecording.blob && voiceRecording.base64) {
        console.log("🎤 Preparing voice reaction:", {
          blobSize: voiceRecording.blob.size,
          blobType: voiceRecording.blob.type,
          duration: voiceRecording.duration,
          base64Length: voiceRecording.base64.length,
        });

        reactionData = {
          type: "voice" as const,
          content: "Voice message",
          timestamp: Date.now(),
          voiceBlob: voiceRecording.blob,
          voiceDuration: voiceRecording.duration,
          voiceBase64: voiceRecording.base64,
        };
      }

      const clipData = {
        contentId: content.id,
        contentTitle: content.title,
        contentThumbnail: content.thumbnail,
        startTime,
        endTime,
        duration: clipDuration,
        sharedBy: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        sharedWith,
        shareTarget,
        reaction: reactionData,
      };

      console.log("📦 Final clip data prepared:", {
        contentTitle: clipData.contentTitle,
        shareTarget: clipData.shareTarget,
        recipientCount: clipData.sharedWith.length,
        hasReaction: !!clipData.reaction,
        reactionType: clipData.reaction?.type,
        fromUser: clipData.sharedBy.name,
      });

      const clipId = await createClip(clipData);

      if (clipId) {
        console.log("✅ Clip shared successfully with ID:", clipId);
        setStep("success");

        setTimeout(() => {
          onClose();
          setIsCreating(false);
          setIsSharing(false);
        }, 3000);
      } else {
        throw new Error("Failed to create clip - no ID returned");
      }
    } catch (error) {
      console.error("❌ Failed to create clip:", error);
      setIsCreating(false);
      setIsSharing(false);
      setStep("clip");
      alert("Failed to share clip. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressWidth = () => {
    if (!content.duration || content.duration === 0) return 0;
    return (clipDuration / content.duration) * 100;
  };

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const toggleCampfireSelection = (campfireId: number) => {
    setSelectedCampfires((prev) =>
      prev.includes(campfireId)
        ? prev.filter((id) => id !== campfireId)
        : [...prev, campfireId]
    );
  };

  const getSelectedCount = () => {
    return shareTarget === "friends"
      ? selectedFriends.length
      : selectedCampfires.length;
  };

  const getSelectedNames = () => {
    if (shareTarget === "friends") {
      return selectedFriends.map((id) => {
        const friend = userFriends.find((f) => f.id === id);
        return friend?.name || "Unknown";
      });
    } else {
      return selectedCampfires.map((id) => {
        const campfire = userCampfires.find((c) => c.id === id);
        return campfire?.name || "Unknown";
      });
    }
  };

  const renderClipStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-netflix-red" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Create Your Clip</h3>
        <p className="text-gray-400">
          Capture this moment to share with your FireStories network
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-full h-24 object-cover rounded mb-3"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/400x225/374151/9CA3AF?text=No+Image";
          }}
        />
        <h4 className="font-medium mb-1">{content.title}</h4>
        <p className="text-sm text-gray-400">
          {content.description?.slice(0, 100)}...
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Clip Duration</label>
        <div className="grid grid-cols-2 gap-3">
          {[15, 30].map((duration) => (
            <button
              key={duration}
              onClick={() => setClipDuration(duration)}
              className={`p-3 rounded-lg border-2 transition-colors ${clipDuration === duration
                  ? "border-netflix-red bg-netflix-red/10 text-white"
                  : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
                }`}
            >
              {duration} seconds
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Clip Range:</span>
          <span className="text-white font-medium">
            {formatTime(startTime)} - {formatTime(endTime)}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Starting from current moment, capturing next {clipDuration} seconds
        </div>
        <div className="mt-2 h-1 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-netflix-red rounded transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, getProgressWidth()))}%`,
            }}
          />
        </div>
      </div>

      <button
        onClick={handleCreateClip}
        className="w-full bg-netflix-red hover:bg-red-700 py-3 rounded-lg font-medium transition-colors"
      >
        Create Clip
      </button>
    </div>
  );

  const renderReactionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Add Your Reaction</h3>
        <p className="text-gray-400">
          Tell your friends what you think (optional)
        </p>
      </div>

      {/* Reaction Type Toggle */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => {
            setReactionType("text");
            deleteVoiceRecording(); // Clear voice recording when switching to text
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${reactionType === "text"
              ? "bg-netflix-red text-white"
              : "text-gray-400 hover:text-white"
            }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Text</span>
        </button>
        <button
          onClick={() => {
            setReactionType("voice");
            setReactionContent(""); // Clear text when switching to voice
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${reactionType === "voice"
              ? "bg-netflix-red text-white"
              : "text-gray-400 hover:text-white"
            }`}
        >
          <Mic className="h-4 w-4" />
          <span>Voice</span>
        </button>
      </div>

      {/* Text Reaction */}
      {reactionType === "text" && (
        <div>
          <textarea
            value={reactionContent}
            onChange={(e) => setReactionContent(e.target.value)}
            placeholder="What did you think about this moment?"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red resize-none"
            rows={4}
            maxLength={280}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Share your thoughts...</span>
            <span>{reactionContent.length}/280</span>
          </div>
        </div>
      )}

      {/* Voice Reaction */}
      {reactionType === "voice" && (
        <div className="space-y-4">
          <VoiceRecordingVisualizer
            isRecording={voiceRecording.isRecording}
            duration={voiceRecording.duration}
            audioBlob={voiceRecording.blob}
            audioUrl={voiceRecording.url}
            onStartRecording={startVoiceRecording}
            onStopRecording={stopVoiceRecording}
            onPlayRecording={playVoiceRecording}
            onDeleteRecording={deleteVoiceRecording}
            isPlaying={voiceRecording.isPlaying}
          />
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleSkipReaction}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition-colors"
        >
          Skip
        </button>
        <button
          onClick={handleAddReaction}
          className="flex-1 bg-netflix-red hover:bg-red-700 py-3 rounded-lg font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderShareStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Share Your Clip</h3>
        <p className="text-gray-400">Choose who to share this clip with</p>
      </div>

      {/* Share Target Toggle */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setShareTarget("friends")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${shareTarget === "friends"
              ? "bg-netflix-red text-white"
              : "text-gray-400 hover:text-white"
            }`}
        >
          <User className="h-4 w-4" />
          <span>Friends ({userFriends.length})</span>
        </button>
        <button
          onClick={() => setShareTarget("campfires")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${shareTarget === "campfires"
              ? "bg-netflix-red text-white"
              : "text-gray-400 hover:text-white"
            }`}
        >
          <Users className="h-4 w-4" />
          <span>Campfires ({userCampfires.length})</span>
        </button>
      </div>

      {/* Friends List */}
      {shareTarget === "friends" && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {userFriends.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No friends available</p>
              <p className="text-gray-500 text-sm">
                Add friends on FireStories to share clips
              </p>
            </div>
          ) : (
            userFriends.map((friend) => (
              <label
                key={friend.id}
                className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend.id)}
                  onChange={() => toggleFriendSelection(friend.id)}
                  className="w-4 h-4 text-netflix-red bg-gray-700 border-gray-600 rounded focus:ring-netflix-red focus:ring-2"
                />
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg?height=40&width=40";
                  }}
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{friend.name}</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${friend.isOnline ? "bg-green-500" : "bg-gray-500"
                        }`}
                    />
                    <p className="text-gray-400 text-sm">{friend.status}</p>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
      )}

      {/* Campfires List */}
      {shareTarget === "campfires" && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {userCampfires.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No campfires available</p>
              <p className="text-gray-500 text-sm">
                Join campfires on FireStories to share clips
              </p>
            </div>
          ) : (
            userCampfires.map((campfire) => (
              <label
                key={campfire.id}
                className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCampfires.includes(campfire.id)}
                  onChange={() => toggleCampfireSelection(campfire.id)}
                  className="w-4 h-4 text-netflix-red bg-gray-700 border-gray-600 rounded focus:ring-netflix-red focus:ring-2"
                />
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{campfire.name}</p>
                  <p className="text-gray-400 text-sm">
                    {campfire.memberCount} members
                  </p>
                </div>
              </label>
            ))
          )}
        </div>
      )}

      {/* Selection Summary */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
          <span>Selected:</span>
          <span className="text-white font-medium">
            {getSelectedCount()}{" "}
            {shareTarget === "friends" ? "friend" : "campfire"}
            {getSelectedCount() !== 1 ? "s" : ""}
          </span>
        </div>
        {getSelectedCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {getSelectedNames().map((name) => (
              <span
                key={name}
                className="bg-netflix-red/20 text-netflix-red px-2 py-1 rounded text-xs"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleShare}
        disabled={getSelectedCount() === 0 || isSharing}
        className="w-full bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        {isSharing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Sharing...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Share Clip</span>
          </>
        )}
      </button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Send className="h-8 w-8 text-green-400" />
      </div>
      <h3 className="text-xl font-semibold">Clip Shared Successfully!</h3>
      <p className="text-gray-400">
        Your clip has been shared with {getSelectedCount()}{" "}
        {shareTarget === "friends" ? "friend" : "campfire"}
        {getSelectedCount() !== 1 ? "s" : ""} on FireStories
      </p>

      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-400 mb-2">Clip Details:</p>
        <p className="text-white font-medium">{content.title}</p>
        <p className="text-gray-400 text-sm">
          {formatTime(startTime)} - {formatTime(endTime)} ({clipDuration}s)
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Shared with: {getSelectedNames().join(", ")}
        </p>
        {reactionType === "voice" && voiceRecording.blob && (
          <p className="text-netflix-red text-sm mt-1">
            + Voice reaction attached
          </p>
        )}
        {reactionType === "text" && reactionContent && (
          <p className="text-netflix-red text-sm mt-1">
            + Text reaction attached
          </p>
        )}
      </div>

      <div className="text-sm text-gray-400">
        Your {shareTarget === "friends" ? "friends" : "campfire members"} can
        now see this clip in their FireStories chat!
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {["clip", "reaction", "share"].map((stepName) => {
                const currentStepIndex = [
                  "clip",
                  "reaction",
                  "share",
                  "success",
                ].indexOf(step);
                const stepIndex = ["clip", "reaction", "share"].indexOf(
                  stepName
                );

                return (
                  <div
                    key={stepName}
                    className={`w-2 h-2 rounded-full transition-colors ${step === stepName
                        ? "bg-netflix-red"
                        : currentStepIndex > stepIndex
                          ? "bg-gray-500"
                          : "bg-gray-700"
                      }`}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {step === "clip" && renderClipStep()}
        {step === "reaction" && renderReactionStep()}
        {step === "share" && renderShareStep()}
        {step === "success" && renderSuccessStep()}
      </div>
    </div>
  );
}
