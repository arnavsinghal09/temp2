"use client";

import { useState } from "react";
import { X, Send, Clock, MessageSquare, Share2 } from "lucide-react";
import { useAuthStore } from "../../lib/stores/auth";
import { useClipsStore } from "../../lib/stores/clips";
import type { Content } from "../../lib/data/content";

interface SocialOverlayProps {
  content: Content;
  currentTime: number;
  onClose: () => void;
}

type Step = "clip" | "reaction" | "success";
type ReactionType = "text" | "voice" | "video";

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
  const [isSharing, setIsSharing] = useState(false);

  if (!user) return null;

  const startTime = currentTime;
  const endTime = Math.min(currentTime + clipDuration, content.duration);

  const handleCreateClip = () => {
    setStep("reaction");
  };

  const handleAddReaction = () => {
    handleShare();
  };

  const handleSkipReaction = () => {
    setReactionContent("");
    handleShare();
  };

  const handleShare = async () => {
    setIsCreating(true);
    setIsSharing(true);

    try {
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
        sharedWith: [], // No friends list in Netflix - handled by FireStories
        reaction: reactionContent
          ? {
              type: reactionType,
              content: reactionContent,
              timestamp: Date.now(),
            }
          : undefined,
      };

      // Create the clip
      const clipId = createClip(clipData);

      if (clipId) {
        setStep("success");

        // Log for debugging
        console.log("Clip created successfully:", {
          clipId,
          contentTitle: content.title,
          reaction: reactionContent ? "Yes" : "No",
        });

        // Auto close after success
        setTimeout(() => {
          onClose();
          setIsCreating(false);
          setIsSharing(false);
        }, 3000);
      } else {
        throw new Error("Failed to create clip - no ID returned");
      }
    } catch (error) {
      console.error("Failed to create clip:", error);
      setIsCreating(false);
      setIsSharing(false);
      setStep("clip");
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

  const renderClipStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-netflix-red" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Create Your Clip</h3>
        <p className="text-gray-400">
          Capture this moment to share on FireStories
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
              className={`p-3 rounded-lg border-2 transition-colors ${
                clipDuration === duration
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

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Send className="h-8 w-8 text-green-400" />
      </div>
      <h3 className="text-xl font-semibold">Clip Created Successfully!</h3>
      <p className="text-gray-400">
        Your clip has been created and will be available on FireStories
      </p>

      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-400 mb-2">Clip Details:</p>
        <p className="text-white font-medium">{content.title}</p>
        <p className="text-gray-400 text-sm">
          {formatTime(startTime)} - {formatTime(endTime)} ({clipDuration}s)
        </p>
      </div>

      <div className="text-sm text-gray-400">
        Return to FireStories to share this clip with your friends
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {["clip", "reaction"].map((stepName) => {
                const currentStepIndex = [
                  "clip",
                  "reaction",
                  "success",
                ].indexOf(step);
                const stepIndex = ["clip", "reaction"].indexOf(stepName);

                return (
                  <div
                    key={stepName}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step === stepName
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
        {step === "success" && renderSuccessStep()}
      </div>
    </div>
  );
}