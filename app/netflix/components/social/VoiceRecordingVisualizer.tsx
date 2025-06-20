"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Play, Pause, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecordingVisualizerProps {
  isRecording: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  onDeleteRecording: () => void;
  isPlaying?: boolean;
}

export function VoiceRecordingVisualizer({
  isRecording,
  duration,
  audioBlob,
  audioUrl,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onDeleteRecording,
  isPlaying = false,
}: VoiceRecordingVisualizerProps) {
  const [waveform, setWaveform] = useState<number[]>([]);

  // Generate random waveform during recording
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveform((prev) => {
          const newWave = [...prev, Math.random() * 0.8 + 0.2];
          return newWave.slice(-20); // Keep last 20 bars
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  // Format duration to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // No recording state
  if (!isRecording && !audioBlob) {
    return (
      <div className="text-center py-6">
        <button
          onClick={onStartRecording}
          className="w-16 h-16 bg-netflix-red hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 mx-auto mb-3"
        >
          <Mic className="w-8 h-8" />
        </button>
        <p className="text-gray-400 text-sm">
          Tap to record your voice reaction
        </p>
        <p className="text-gray-500 text-xs mt-1">Maximum 60 seconds</p>
      </div>
    );
  }

  // Recording state
  if (isRecording) {
    return (
      <div className="text-center py-6">
        <button
          onClick={onStopRecording}
          className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 animate-pulse mx-auto mb-3"
        >
          <MicOff className="w-8 h-8" />
        </button>

        <p className="text-white font-medium mb-2">
          Recording... {formatDuration(duration)}
        </p>

        {/* Live waveform visualization */}
        <div className="flex items-center justify-center space-x-1 mb-2">
          {waveform.map((height, index) => (
            <div
              key={index}
              className="w-1 bg-netflix-red rounded-full transition-all duration-150"
              style={{
                height: `${height * 30 + 5}px`,
                opacity: index === waveform.length - 1 ? 1 : 0.6 - index * 0.03,
              }}
            />
          ))}
        </div>

        <p className="text-gray-400 text-xs">Tap the microphone to stop</p>
      </div>
    );
  }

  // Recorded state
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-netflix-red rounded-full flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Voice Reaction</p>
            <p className="text-gray-400 text-sm">{formatDuration(duration)}</p>
          </div>
        </div>
        <button
          onClick={onDeleteRecording}
          className="text-gray-400 hover:text-red-400 transition-colors p-1"
          title="Delete recording"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Static waveform for recorded audio */}
      <div className="flex items-center justify-center space-x-1 mb-3 py-2">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all duration-200",
              isPlaying ? "bg-netflix-red" : "bg-gray-600"
            )}
            style={{
              height: `${Math.sin(i * 0.5) * 15 + 20}px`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPlayRecording}
          disabled={isPlaying}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
            isPlaying
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-netflix-red hover:bg-red-700 text-white"
          )}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span className="text-sm">{isPlaying ? "Playing..." : "Play"}</span>
        </button>

        <button
          onClick={onDeleteRecording}
          className="text-gray-400 hover:text-red-400 transition-colors text-sm"
        >
          Record again
        </button>
      </div>
    </div>
  );
}
