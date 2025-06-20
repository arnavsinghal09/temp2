"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";

import {
  X,
  Send,
  Play,
  Pause,
  Mic,
  ImageIcon,
  Paperclip,
  Smile,
  ChevronLeft,
  ChevronRight,
  StopCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatParticipant } from "@/lib/types";
import { MessageSystem } from "@/lib/message-system";
import { useRouter } from "next/navigation";

interface ChatPanelProps {
  participant: ChatParticipant | null;
  onClose: () => void;
  currentUser: any;
}

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

function VoiceMessage({
  message,
  isCurrentUser,
}: {
  message: ChatMessage;
  isCurrentUser: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setProgress(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      setAudioError(false);

      // Try to play actual audio if available
      if (message.voiceData?.voiceBlob) {
        playActualAudio();
      } else {
        simulatePlayback();
      }
    }
  };

  const playActualAudio = () => {
    if (message.voiceData?.voiceBlob) {
      try {
        const audioUrl = URL.createObjectURL(message.voiceData.voiceBlob);
        const audio = new Audio(audioUrl);

        audio.onloadedmetadata = () => {
          const totalDuration = audio.duration * 1000;
          const startTime = Date.now();

          intervalRef.current = setInterval(() => {
            if (audio.paused) {
              setIsPlaying(false);
              setProgress(0);
              if (intervalRef.current) clearInterval(intervalRef.current);
              return;
            }

            const elapsed = Date.now() - startTime;
            const progressPercent = Math.min(
              (elapsed / totalDuration) * 100,
              100
            );
            setProgress(progressPercent);

            if (progressPercent >= 100) {
              setIsPlaying(false);
              setProgress(0);
              if (intervalRef.current) clearInterval(intervalRef.current);
            }
          }, 50);
        };

        audio.onended = () => {
          setIsPlaying(false);
          setProgress(0);
          if (intervalRef.current) clearInterval(intervalRef.current);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setAudioError(true);
          simulatePlayback(); // Fallback to simulation
        };

        audio.play();
        audioRef.current = audio;
      } catch (error) {
        console.error("Error playing voice message:", error);
        simulatePlayback(); // Fallback to simulation
      }
    } else {
      simulatePlayback();
    }
  };

  const simulatePlayback = () => {
    const durationParts = message.voiceData?.duration?.split(":") || [
      "0",
      "15",
    ];
    const totalSeconds =
      Number.parseInt(durationParts[0]) * 60 +
      Number.parseInt(durationParts[1]);
    const totalMs = totalSeconds * 1000;

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / totalMs) * 100, 100);
      setProgress(progressPercent);

      if (progressPercent >= 100) {
        setIsPlaying(false);
        setProgress(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 50);

    simulationRef.current = setTimeout(() => {
      setIsPlaying(false);
      setProgress(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, totalMs);
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg max-w-xs",
        isCurrentUser ? "bg-[#ff6404] text-black" : "bg-gray-800 text-white"
      )}
    >
      <button
        onClick={togglePlay}
        className={cn(
          "p-2 rounded-full transition-colors",
          isCurrentUser
            ? "bg-black/20 hover:bg-black/30"
            : "bg-[#ff6404] hover:bg-orange-500"
        )}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>
      <div className="flex-1">
        <div className="flex items-center space-x-1 mb-1">
          {message.voiceData?.waveform.map((height, index) => (
            <div
              key={index}
              className={cn(
                "w-1 rounded-full transition-all duration-200",
                isCurrentUser ? "bg-black/40" : "bg-[#ff6404]/60"
              )}
              style={{
                height: `${height * 20 + 4}px`,
                backgroundColor:
                  index < (progress / 100) * message.voiceData!.waveform.length
                    ? isCurrentUser
                      ? "#000"
                      : "#ff6404"
                    : undefined,
              }}
            />
          ))}
        </div>
        <p className="text-xs opacity-70">{message.voiceData?.duration}</p>
      </div>
    </div>
  );
}

function NetflixClipMessage({
  message,
  isCurrentUser,
}: {
  message: ChatMessage;
  isCurrentUser: boolean;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingReaction, setIsPlayingReaction] = useState(false);

  const handlePlayClip = () => {
    if (message.clipData?.netflixData) {
      const { contentId, startTime } = message.clipData.netflixData;
      const netflixUrl = `/netflix/watch/${contentId}?t=${Math.floor(
        startTime
      )}`;

      // Check if user can access Netflix
      const canAccess = localStorage.getItem("netflix-user");

      if (canAccess) {
        router.push(netflixUrl);
      } else {
        // Prompt user to sign in to Netflix
        if (
          confirm(
            "You need to be signed in to Netflix to watch this clip. Go to Netflix now?"
          )
        ) {
          router.push("/netflix");
        }
      }
    }
  };

  const handlePlayVoiceReaction = async () => {
    if (isPlayingReaction) {
      console.log("⚠️ Voice reaction already playing, ignoring request");
      return;
    }

    console.log("🎵 Starting voice reaction playback:", {
      hasReactionData: !!message.reactionData,
      reactionType: message.reactionData?.type,
      hasVoiceBlob: !!message.reactionData?.voiceBlob,
      hasVoiceBase64: !!message.reactionData?.voiceBase64,
      voiceDuration: message.reactionData?.voiceDuration,
    });

    try {
      let audioBlob = message.reactionData?.voiceBlob;

      // If no blob but have base64, reconstruct the blob
      if (!audioBlob && message.reactionData?.voiceBase64) {
        console.log("🔄 No direct blob found, reconstructing from base64...");

        try {
          const reconstructed = await reconstructBlobFromBase64(
            message.reactionData.voiceBase64
          );
          audioBlob = reconstructed === null ? undefined : reconstructed;

          if (audioBlob) {
            console.log("✅ Blob reconstructed successfully:", {
              size: audioBlob.size,
              type: audioBlob.type,
            });
          } else {
            console.error("❌ Failed to reconstruct blob from base64");
          }
        } catch (conversionError) {
          console.error(
            "❌ Error during blob reconstruction:",
            conversionError
          );
        }
      }

      if (audioBlob && audioBlob instanceof Blob && audioBlob.size > 0) {
        console.log("🎵 Playing audio blob:", {
          size: audioBlob.size,
          type: audioBlob.type,
        });

        setIsPlayingReaction(true);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // Enhanced audio event logging
        audio.onloadstart = () => {
          console.log("🔄 Audio loading started");
        };

        audio.oncanplay = () => {
          console.log("✅ Audio can play, duration:", audio.duration);
        };

        audio.onloadeddata = () => {
          console.log("📊 Audio data loaded");
        };

        audio.ontimeupdate = () => {
          // Optional: log progress (commented out to avoid spam)
          // console.log("⏱️ Audio progress:", audio.currentTime, "/", audio.duration);
        };

        audio.onended = () => {
          console.log("⏹️ Audio playback ended naturally");
          setIsPlayingReaction(false);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = (error) => {
          console.error("❌ Audio playback error:", error);
          console.error("❌ Audio error details:", {
            error: audio.error,
            networkState: audio.networkState,
            readyState: audio.readyState,
          });
          setIsPlayingReaction(false);
          URL.revokeObjectURL(audioUrl);
          alert("Failed to play voice reaction. The audio may be corrupted.");
        };

        audio.onabort = () => {
          console.log("⏹️ Audio playback aborted");
          setIsPlayingReaction(false);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onstalled = () => {
          console.log("⏸️ Audio playback stalled");
        };

        audio.onsuspend = () => {
          console.log("⏸️ Audio loading suspended");
        };

        // Validate blob size before attempting playback
        if (audioBlob.size < 100) {
          console.error("❌ Audio blob too small:", audioBlob.size, "bytes");
          setIsPlayingReaction(false);
          URL.revokeObjectURL(audioUrl);
          alert("Voice reaction file is too small or corrupted.");
          return;
        }

        try {
          await audio.play();
          console.log("✅ Audio playback started successfully");
        } catch (playError: any) {
          console.error("❌ Error starting audio playback:", playError);
          setIsPlayingReaction(false);
          URL.revokeObjectURL(audioUrl);

          // Provide more specific error messages
          if (playError.name === "NotAllowedError") {
            alert(
              "Audio playback blocked. Please interact with the page first."
            );
          } else if (playError.name === "NotSupportedError") {
            alert("Audio format not supported by your browser.");
          } else {
            alert("Failed to play voice reaction. Please try again.");
          }
        }
      } else {
        console.error("❌ No valid audio data found:", {
          hasBlob: !!audioBlob,
          blobSize: audioBlob?.size,
          blobType: audioBlob?.type,
          isValidBlob: audioBlob instanceof Blob,
          hasBase64: !!message.reactionData?.voiceBase64,
        });
        alert(
          "Voice reaction could not be played. The audio data may be missing or corrupted."
        );
      }
    } catch (error) {
      setIsPlayingReaction(false);
      console.error(
        "❌ Unexpected error during voice reaction playback:",
        error
      );
      alert("An unexpected error occurred while playing the voice reaction.");
    }
  };

  // Add this helper function to the chat panel component
  const reconstructBlobFromBase64 = async (
    base64Data: string
  ): Promise<Blob | null> => {
    try {
      console.log("🔄 Reconstructing blob from base64:", {
        dataLength: base64Data.length,
        hasDataPrefix: base64Data.startsWith("data:"),
      });

      if (!base64Data || typeof base64Data !== "string") {
        console.error("❌ Invalid base64 data");
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

      console.log("🔍 Base64 reconstruction details:", {
        mimeType,
        base64Length: base64String.length,
      });

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const validTypes = [
        "audio/webm",
        "audio/mpeg",
        "audio/mp3",
        "audio/ogg",
        "audio/mp4",
      ];
      const finalType = validTypes.includes(mimeType) ? mimeType : "audio/webm";
      const blob = new Blob([byteArray], { type: finalType });

      console.log("✅ Blob reconstructed successfully:", {
        size: blob.size,
        type: blob.type,
      });

      return blob;
    } catch (error) {
      console.error("❌ Error reconstructing blob from base64:", error);
      return null;
    }
  };



  // Enhanced base64 to blob conversion with better error handling
  const base64ToBlob = (base64Data: string): Blob => {
    try {
      console.log("🔄 Converting base64 to blob...", {
        dataLength: base64Data.length,
        hasDataPrefix: base64Data.startsWith("data:"),
      });

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

      console.log("🔄 Decoded base64 info:", {
        mimeType,
        base64Length: base64String.length,
      });

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const validTypes = ["audio/webm", "audio/mpeg", "audio/mp3", "audio/ogg"];
      const finalType = validTypes.includes(mimeType) ? mimeType : "audio/webm";
      const blob = new Blob([byteArray], { type: finalType });

      console.log("✅ Blob created successfully:", {
        size: blob.size,
        type: blob.type,
      });

      return blob;
    } catch (error: any) {
      console.error("❌ Error converting base64 to blob:", error);
      throw new Error(`Failed to convert base64 to blob: ${error.message}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "max-w-sm rounded-lg overflow-hidden border-2 transition-all duration-300",
        isCurrentUser
          ? "bg-[#ff6404]/10 border-[#ff6404]/30"
          : "bg-gray-800 border-red-600/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={message.clipData?.thumbnail || "/placeholder.svg"}
          alt={message.clipData?.title}
          className="w-full h-32 object-cover"
        />

        {/* Netflix branding */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          NETFLIX
        </div>

        {/* Clip duration */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {message.clipData?.duration}
        </div>

        {/* Clip timestamp range */}
        {message.clipData?.netflixData && (
          <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatTime(message.clipData.netflixData.startTime)} -{" "}
            {formatTime(message.clipData.netflixData.endTime)}
          </div>
        )}

        {/* Play overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 cursor-pointer",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          onClick={handlePlayClip}
        >
          <div className="bg-red-600 rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
            <Play className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium text-sm truncate">
            {message.clipData?.title}
          </h4>
          <button
            onClick={handlePlayClip}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Watch on Netflix"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#ff6404] text-xs">{message.clipData?.platform}</p>

        {/* Enhanced reaction display */}
        {message.reactionData && (
          <div className="mt-3 p-3 bg-gray-900/50 rounded-lg text-xs border border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              {message.reactionData.type === "voice" ? (
                <Mic className="w-3 h-3 text-[#ff6404]" />
              ) : (
                <span className="text-[#ff6404]">💬</span>
              )}
              <span className="text-gray-400 font-medium">Reaction:</span>
            </div>

            {message.reactionData.type === "text" ? (
              <p className="text-white leading-relaxed">
                {message.reactionData.content}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVoiceReaction();
                      }}
                      disabled={isPlayingReaction}
                      className={cn(
                        "flex items-center space-x-1 px-2 py-1 rounded transition-colors",
                        isPlayingReaction
                          ? "bg-[#ff6404]/20 text-[#ff6404] cursor-not-allowed"
                          : "bg-[#ff6404]/10 text-[#ff6404] hover:bg-[#ff6404]/20"
                      )}
                    >
                      {isPlayingReaction ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      <span className="text-xs">
                        {isPlayingReaction ? "Playing..." : "Play"}
                      </span>
                    </button>
                    <span className="text-gray-300 text-xs">
                      ({message.reactionData.voiceDuration || "0:00"})
                    </span>
                  </div>
                </div>

                {/* Voice waveform visualization */}
                <div className="flex items-center justify-center space-x-1 py-2">
                  {Array.from({ length: 8 }, (_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-1 rounded-full transition-all duration-200",
                        isPlayingReaction ? "bg-[#ff6404]" : "bg-gray-500"
                      )}
                      style={{ height: `${Math.sin(index * 0.5) * 8 + 12}px` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ClipMessage({
  message,
  isCurrentUser,
}: {
  message: ChatMessage;
  isCurrentUser: boolean;
}) {
  // Check if this is a Netflix clip
  if (message.clipData?.netflixData) {
    return (
      <NetflixClipMessage message={message} isCurrentUser={isCurrentUser} />
    );
  }

  // Regular clip message (existing functionality)
  return (
    <div
      className={cn(
        "max-w-sm rounded-lg overflow-hidden",
        isCurrentUser ? "bg-[#ff6404]/10" : "bg-gray-800"
      )}
    >
      <div className="relative">
        <img
          src={message.clipData?.thumbnail || "/placeholder.svg"}
          alt={message.clipData?.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-[#ff6404] rounded-full p-2">
            <Play className="w-4 h-4 text-black fill-current" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {message.clipData?.duration}
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-white font-medium text-sm">
          {message.clipData?.title}
        </h4>
        <p className="text-[#ff6404] text-xs">{message.clipData?.platform}</p>
      </div>
    </div>
  );
}

function ImageMessage({
  message,
  isCurrentUser,
}: {
  message: ChatMessage;
  isCurrentUser: boolean;
}) {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden">
      <img
        src={message.imageData?.url || "/placeholder.svg"}
        alt={message.imageData?.caption || "Shared image"}
        className="w-full h-48 object-cover rounded-lg"
      />
      {message.imageData?.caption && (
        <p className="text-gray-300 text-sm mt-2">
          {message.imageData.caption}
        </p>
      )}
    </div>
  );
}

function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <img
          src={message.avatar || "/placeholder.svg"}
          alt={message.sender}
          className="w-8 h-8 rounded-full mr-3 mt-1 flex-shrink-0"
        />
      )}
      <div className={cn("max-w-xs lg:max-w-md", isCurrentUser && "order-1")}>
        {!isCurrentUser && (
          <p className="text-[#ff6404] text-xs font-medium mb-1">
            {message.sender}
          </p>
        )}

        {message.type === "text" && (
          <div
            className={cn(
              "p-3 rounded-lg break-words",
              isCurrentUser
                ? "bg-[#ff6404] text-black rounded-br-sm"
                : "bg-gray-800 text-white rounded-bl-sm"
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {message.type === "voice" && (
          <VoiceMessage message={message} isCurrentUser={isCurrentUser} />
        )}

        {message.type === "clip" && (
          <div className="space-y-2">
            {message.content &&
              message.content !==
              `Shared a clip from ${message.clipData?.title}` && (
                <div
                  className={cn(
                    "p-3 rounded-lg break-words",
                    isCurrentUser
                      ? "bg-[#ff6404] text-black rounded-br-sm"
                      : "bg-gray-800 text-white rounded-bl-sm"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              )}
            <ClipMessage message={message} isCurrentUser={isCurrentUser} />
          </div>
        )}

        {message.type === "image" && (
          <div className="space-y-2">
            {message.content && (
              <div
                className={cn(
                  "p-3 rounded-lg break-words",
                  isCurrentUser
                    ? "bg-[#ff6404] text-black rounded-br-sm"
                    : "bg-gray-800 text-white rounded-bl-sm"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            )}
            <ImageMessage message={message} isCurrentUser={isCurrentUser} />
          </div>
        )}

        <p
          className={cn(
            "text-xs text-gray-400 mt-1",
            isCurrentUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp}
        </p>
      </div>

      {isCurrentUser && (
        <img
          src={message.avatar || "/placeholder.svg"}
          alt={message.sender}
          className="w-8 h-8 rounded-full ml-3 mt-1 order-2 flex-shrink-0"
        />
      )}
    </div>
  );
}

export function ChatPanel({
  participant,
  onClose,
  currentUser,
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingWaveform, setRecordingWaveform] = useState<number[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(!!participant);
  }, [participant]);

  // Load messages when participant changes
  // REPLACE THE ABOVE useEffect WITH THIS:
  useEffect(() => {
    if (participant && currentUser) {
      console.log("🔍 Loading messages for chat panel:", {
        participantId: participant.id,
        participantType: participant.type,
        participantName: participant.name,
        currentUserId: currentUser.id,
        currentUserName: currentUser.name,
      });

      const loadedMessages = MessageSystem.getMessagesForChat(
        currentUser.id,
        participant.id,
        participant.type
      );

      console.log("📋 Messages loaded for chat panel:", {
        messageCount: loadedMessages.length,
        messages: loadedMessages.map(msg => ({
          id: msg.id,
          type: msg.type,
          sender: msg.sender,
          timestamp: msg.timestamp,
          hasNetflixClip: !!msg.clipData?.netflixData,
          hasVoiceReaction: msg.reactionData?.type === "voice",
        })),
      });

      setMessages(loadedMessages);
    }
  }, [participant, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 100;
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [newMessage]);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if ((newMessage.trim() || selectedFile) && participant && currentUser) {
      let messageType: "text" | "clip" | "image" = "text";
      let messageData = {};

      if (selectedFile) {
        if (selectedFile.type.startsWith("image/")) {
          messageType = "image";
          messageData = {
            imageData: {
              url: URL.createObjectURL(selectedFile),
              caption: newMessage.trim() || undefined,
            },
          };
        } else {
          messageType = "clip";
          messageData = {
            clipData: {
              title: selectedFile.name,
              thumbnail: "/placeholder.svg?height=120&width=200",
              duration: "0:30",
              platform: "Local",
            },
          };
        }
      }

      const newMsg: ChatMessage = {
        id: Date.now(),
        type: messageType,
        sender: currentUser.name,
        content:
          newMessage.trim() ||
          (selectedFile ? `Shared ${selectedFile.name}` : ""),
        timestamp: new Date().toLocaleString(),
        avatar: currentUser.avatar,
        ...messageData,
      };

      // Send message through the message system
      // REPLACE THE ABOVE PART WITH THIS:
      console.log("📤 Sending message from chat panel:", {
        messageType: newMsg.type,
        messageId: newMsg.id,
        fromUser: currentUser.name,
        toParticipant: participant.name,
        participantType: participant.type,
        participantId: participant.id,
      });

      // Send message through the message system
      if (participant.type === "friend") {
        console.log("👤 Sending direct message to friend");
        MessageSystem.sendDirectMessage(currentUser.id, participant.id, newMsg);
      } else {
        console.log("🔥 Sending campfire message");
        MessageSystem.sendCampfireMessage(
          currentUser.id,
          participant.id,
          newMsg
        );
      }

      console.log("🔄 Reloading messages after send...");

      // Reload messages to get the updated chat
      const updatedMessages = MessageSystem.getMessagesForChat(
        currentUser.id,
        participant.id,
        participant.type
      );

      console.log("📊 Messages after reload:", {
        previousCount: messages.length,
        newCount: updatedMessages.length,
        newMessage: updatedMessages.find(m => m.id === newMsg.id) ? "Found" : "NOT FOUND",
      });

      
      setMessages(updatedMessages);

      setNewMessage("");
      setSelectedFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      if (participant && currentUser) {
        // Create voice message
        const minutes = Math.floor(recordingTime / 60);
        const seconds = recordingTime % 60;
        const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        const voiceMsg: ChatMessage = {
          id: Date.now(),
          type: "voice",
          sender: currentUser.name,
          content: "Voice message",
          timestamp: new Date().toLocaleString(),
          avatar: currentUser.avatar,
          voiceData: {
            duration: durationStr,
            waveform: recordingWaveform,
          },
        };

        // Send voice message
        if (participant.type === "friend") {
          MessageSystem.sendDirectMessage(
            currentUser.id,
            participant.id,
            voiceMsg
          );
        } else {
          MessageSystem.sendCampfireMessage(
            currentUser.id,
            participant.id,
            voiceMsg
          );
        }

        // Reload messages
        const updatedMessages = MessageSystem.getMessagesForChat(
          currentUser.id,
          participant.id,
          participant.type
        );
        setMessages(updatedMessages);
      }

      setRecordingTime(0);
      setRecordingWaveform([]);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingWaveform([]);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        setRecordingWaveform((prev) => {
          const newValue = Math.random() * 0.7 + 0.2;
          return [...prev, newValue].slice(-15);
        });
      }, 1000);
    }
  };

  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getParticipantName = () => {
    if (!participant) return "Unknown";
    if (participant.type === "friend") {
      return participant.name || "Unknown Friend";
    } else {
      return participant.name || "Unknown Campfire";
    }
  };

  const getParticipantSubtitle = () => {
    if (!participant) return "";
    if (participant.type === "friend") {
      return participant.isOnline ? participant.status || "Online" : "Offline";
    } else {
      return `${participant.members?.length || 0} members`;
    }
  };

  const panelWidth = isExpanded ? "w-[600px]" : "w-[450px]";

  return shouldRender ? (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*"
        className="hidden"
      />

      {/* Overlay to prevent interaction with background */}
      <div className="fixed inset-0 bg-black/20 z-[60]" onClick={onClose} />

      <div
        className={cn(
          "fixed left-0 bg-gray-950 border-r border-gray-800 z-[70] flex flex-col animate-slide-in-left transition-all duration-300 shadow-2xl",
          panelWidth
        )}
        style={{
          top: "64px",
          height: "calc(100vh - 64px)",
          bottom: "0",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-sm">
                {(participant?.name || "U").charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold truncate">
                {getParticipantName()}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {getParticipantSubtitle()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isExpanded ? "Collapse panel" : "Expand panel"}
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 chat-scrollbar min-h-0">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender === currentUser?.name}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="px-4 py-2 border-t border-gray-800 bg-gray-900 flex-shrink-0">
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {selectedFile.type.startsWith("image/") ? (
                  <img
                    src={
                      URL.createObjectURL(selectedFile) || "/placeholder.svg"
                    }
                    alt="Preview"
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#ff6404] rounded flex items-center justify-center flex-shrink-0">
                    <Paperclip className="w-5 h-5 text-black" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Recording UI */}
        {isRecording && (
          <div className="px-4 py-3 border-t border-gray-800 bg-gray-900 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <p className="text-white">
                  Recording... {formatRecordingTime()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleVoiceRecord}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-end justify-center space-x-1 h-10">
              {recordingWaveform.map((height, index) => (
                <div
                  key={index}
                  className="w-1 bg-[#ff6404] rounded-full animate-pulse"
                  style={{ height: `${height * 40}px` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        {!isRecording && (
          <div className="px-4 py-4 border-t border-gray-800 bg-gray-950 flex-shrink-0">
            <div className="flex items-end space-x-3">
              <button
                onClick={handleFileSelect}
                className="p-2.5 text-gray-400 hover:text-[#ff6404] hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleFileSelect}
                className="p-2.5 text-gray-400 hover:text-[#ff6404] hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <div className="flex-1 relative min-w-0">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-[#ff6404] focus:outline-none resize-none min-h-[44px] max-h-[100px] overflow-hidden leading-5"
                    rows={1}
                  />
                  <button className="absolute right-3 top-3 p-1 text-gray-400 hover:text-[#ff6404] transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleVoiceRecord}
                className={cn(
                  "p-2.5 rounded-lg transition-colors flex-shrink-0",
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-gray-400 hover:text-[#ff6404] hover:bg-gray-800"
                )}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && !selectedFile}
                className="p-2.5 bg-[#ff6404] text-black rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  ) : null;
}
