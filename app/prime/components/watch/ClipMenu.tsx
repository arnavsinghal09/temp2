"use client"

import { useState, useEffect } from "react"
import { X, Clock, Users, Share2, Check, Scissors, Sparkles, Smile, Mic } from "lucide-react"
import Image from "next/image"
import type { ClipOptions, DemoUser, ClipMenuStep } from "@/lib/types/clip"
import { demoUsers } from "@/lib/data/demoUsers"
import EmojiPicker from "@/components/ui/EmojiPicker"
import VoiceRecorder from "@/components/ui/VoiceRecorder"

interface VoiceNote {
  blob: Blob
  duration: number
  url: string
}

interface ClipMenuProps {
  isOpen: boolean
  onClose: () => void
  currentTime: number
  contentTitle: string
}

export default function ClipMenu({ isOpen, onClose, currentTime, contentTitle }: ClipMenuProps) {
  const [currentStep, setCurrentStep] = useState<ClipMenuStep>("options")
  const [clipOptions, setClipOptions] = useState<ClipOptions>({
    duration: 15,
    timestamp: currentTime,
    title: contentTitle,
  })
  const [selectedUsers, setSelectedUsers] = useState<DemoUser[]>([])
  const [message, setMessage] = useState("")
  const [voiceNote, setVoiceNote] = useState<VoiceNote | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)

  // Update timestamp when menu opens
  useEffect(() => {
    if (isOpen) {
      setClipOptions((prev) => ({
        ...prev,
        timestamp: currentTime,
      }))
    }
  }, [isOpen, currentTime])

  // Reset state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("options")
      setSelectedUsers([])
      setMessage("")
      setVoiceNote(null)
      setIsSharing(false)
      setShowEmojiPicker(false)
      setShowVoiceRecorder(false)
    }
  }, [isOpen])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDurationChange = (duration: 15 | 30) => {
    setClipOptions((prev) => ({ ...prev, duration }))
  }

  const handleTimestampChange = (adjustment: number) => {
    setClipOptions((prev) => ({
      ...prev,
      timestamp: Math.max(0, prev.timestamp + adjustment),
    }))
  }

  const handleUserToggle = (user: DemoUser) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id)
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id)
      } else {
        return [...prev, user]
      }
    })
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
  }

  const handleVoiceNote = (audioBlob: Blob, duration: number) => {
    const url = URL.createObjectURL(audioBlob)
    setVoiceNote({ blob: audioBlob, duration, url })
  }

  const handleRemoveVoiceNote = () => {
    if (voiceNote) {
      URL.revokeObjectURL(voiceNote.url)
      setVoiceNote(null)
    }
  }

  const handleShare = async () => {
    if (selectedUsers.length === 0) return

    setIsSharing(true)

    // Simulate sharing process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSharing(false)
    setCurrentStep("success")

    // Auto close after success
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const handleProceedToSharing = () => {
    setCurrentStep("sharing")
  }

  const handleBackToOptions = () => {
    setCurrentStep("options")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      {/* 4:3 Aspect Ratio Container - Much Wider */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-4xl aspect-[4/3] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl">Clip This Moment</h2>
              <p className="text-gray-400 text-lg">{contentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all duration-200"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable with more space */}
        <div className="flex-1 overflow-hidden">
          <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            {currentStep === "options" && (
              <ClipOptionsStep
                clipOptions={clipOptions}
                onDurationChange={handleDurationChange}
                onTimestampChange={handleTimestampChange}
                onProceed={handleProceedToSharing}
                formatTime={formatTime}
              />
            )}

            {currentStep === "sharing" && (
              <ClipSharingStep
                selectedUsers={selectedUsers}
                onUserToggle={handleUserToggle}
                message={message}
                onMessageChange={setMessage}
                voiceNote={voiceNote}
                onVoiceNote={handleVoiceNote}
                onRemoveVoiceNote={handleRemoveVoiceNote}
                onShare={handleShare}
                onBack={handleBackToOptions}
                isSharing={isSharing}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                showVoiceRecorder={showVoiceRecorder}
                setShowVoiceRecorder={setShowVoiceRecorder}
                onEmojiSelect={handleEmojiSelect}
              />
            )}

            {currentStep === "success" && (
              <ClipSuccessStep
                selectedUsers={selectedUsers}
                clipOptions={clipOptions}
                formatTime={formatTime}
                voiceNote={voiceNote}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Clip Options Step Component - Enhanced for wider layout
interface ClipOptionsStepProps {
  clipOptions: ClipOptions
  onDurationChange: (duration: 15 | 30) => void
  onTimestampChange: (adjustment: number) => void
  onProceed: () => void
  formatTime: (time: number) => string
}

function ClipOptionsStep({
  clipOptions,
  onDurationChange,
  onTimestampChange,
  onProceed,
  formatTime,
}: ClipOptionsStepProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Duration Selection */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-semibold text-xl mb-4">Clip Duration</label>
            <div className="grid grid-cols-2 gap-4">
              {[15, 30].map((duration) => (
                <button
                  key={duration}
                  onClick={() => onDurationChange(duration as 15 | 30)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    clipOptions.duration === duration
                      ? "border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]"
                      : "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-white/5"
                  }`}
                >
                  <div className="text-3xl font-bold">{duration}s</div>
                  <div className="text-base opacity-80">seconds</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
            <h3 className="text-white font-semibold text-lg mb-3">Clip Preview</h3>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-600">
              <div className="text-center text-gray-400">
                <Scissors className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Clip preview will appear here</p>
                <p className="text-xs mt-1">
                  {formatTime(clipOptions.timestamp)} - {formatTime(clipOptions.timestamp + clipOptions.duration)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timestamp Selection */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-semibold text-xl mb-4">Start Time</label>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400 text-lg">Current timestamp:</span>
                <div className="flex items-center space-x-3 text-white font-mono text-2xl">
                  <Clock className="w-6 h-6 text-[#FF6B35]" />
                  <span>{formatTime(clipOptions.timestamp)}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => onTimestampChange(-5)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  -5s
                </button>
                <button
                  onClick={() => onTimestampChange(-1)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  -1s
                </button>
                <button
                  onClick={() => onTimestampChange(1)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  +1s
                </button>
                <button
                  onClick={() => onTimestampChange(5)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  +5s
                </button>
              </div>

              <div className="text-center text-gray-400 bg-gray-900/50 rounded-lg p-4">
                <p className="text-base">
                  Clip will be from <span className="text-white font-mono">{formatTime(clipOptions.timestamp)}</span> to{" "}
                  <span className="text-white font-mono">
                    {formatTime(clipOptions.timestamp + clipOptions.duration)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={onProceed}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-[#FF6B35]/25 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
          >
            <Users className="w-6 h-6" />
            <span>Choose Friends to Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Clip Sharing Step Component - Enhanced for wider layout
interface ClipSharingStepProps {
  selectedUsers: DemoUser[]
  onUserToggle: (user: DemoUser) => void
  message: string
  onMessageChange: (message: string) => void
  voiceNote: VoiceNote | null
  onVoiceNote: (audioBlob: Blob, duration: number) => void
  onRemoveVoiceNote: () => void
  onShare: () => void
  onBack: () => void
  isSharing: boolean
  showEmojiPicker: boolean
  setShowEmojiPicker: (show: boolean) => void
  showVoiceRecorder: boolean
  setShowVoiceRecorder: (show: boolean) => void
  onEmojiSelect: (emoji: string) => void
}

function ClipSharingStep({
  selectedUsers,
  onUserToggle,
  message,
  onMessageChange,
  voiceNote,
  onVoiceNote,
  onRemoveVoiceNote,
  onShare,
  onBack,
  isSharing,
  showEmojiPicker,
  setShowEmojiPicker,
  showVoiceRecorder,
  setShowVoiceRecorder,
  onEmojiSelect,
}: ClipSharingStepProps) {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="text-center flex-shrink-0 mb-6">
        <h3 className="text-white font-semibold text-2xl mb-3">Share with Friends</h3>
        <p className="text-gray-400 text-lg">
          {selectedUsers.length} friend{selectedUsers.length !== 1 ? "s" : ""} selected
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Left Column - Friends List */}
        <div className="flex flex-col min-h-0">
          <h4 className="text-white font-medium text-lg mb-4">Select Friends</h4>
          <div className="flex-1 min-h-0">
            <div className="h-full max-h-80 overflow-y-auto space-y-3 custom-scrollbar pr-3">
              {demoUsers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id)
                return (
                  <button
                    key={user.id}
                    onClick={() => onUserToggle(user)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                      isSelected
                        ? "border-[#FF6B35] bg-[#FF6B35]/10"
                        : "border-gray-700 hover:border-gray-600 hover:bg-white/5"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-white font-medium text-lg truncate">{user.name}</div>
                      <div className="text-gray-400 truncate">{user.username}</div>
                    </div>
                    {isSelected && (
                      <div className="w-7 h-7 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Message Input */}
        <div className="flex flex-col h-full min-h-0">
          {/* Voice Note Display - Fixed height when present */}
          {voiceNote && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 mb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Voice Note</div>
                    <div className="text-gray-400 text-sm">
                      {Math.floor(voiceNote.duration / 60)}:{(voiceNote.duration % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onRemoveVoiceNote}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Message Input - Flexible height */}
          <div className="flex-1 min-h-0 flex flex-col">
            <label className="block text-white font-medium text-lg mb-3 flex-shrink-0">Add a message (optional)</label>
            <div className="relative flex-1 min-h-0 flex flex-col">
              <textarea
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Say something about this clip..."
                className="w-full flex-1 min-h-[120px] max-h-[200px] p-4 pr-24 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 resize-none focus:border-[#FF6B35] focus:outline-none transition-colors duration-200 text-base"
              />

              {/* Input Actions - Positioned absolutely */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker)
                      setShowVoiceRecorder(false)
                    }}
                    className="p-2 text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 bg-gray-700/50 rounded-lg"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <EmojiPicker
                    isOpen={showEmojiPicker}
                    onClose={() => setShowEmojiPicker(false)}
                    onEmojiSelect={onEmojiSelect}
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowVoiceRecorder(!showVoiceRecorder)
                      setShowEmojiPicker(false)
                    }}
                    className="p-2 text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 bg-gray-700/50 rounded-lg"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <VoiceRecorder
                    isOpen={showVoiceRecorder}
                    onClose={() => setShowVoiceRecorder(false)}
                    onVoiceNote={onVoiceNote}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex space-x-4 mt-6 flex-shrink-0">
            <button
              onClick={onBack}
              className="flex-1 py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200 text-lg"
            >
              Back
            </button>
            <button
              onClick={onShare}
              disabled={selectedUsers.length === 0 || isSharing}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#FF6B35]/25 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSharing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  <span>Share Clip</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Clip Success Step Component - Enhanced for wider layout
interface ClipSuccessStepProps {
  selectedUsers: DemoUser[]
  clipOptions: ClipOptions
  formatTime: (time: number) => string
  voiceNote: VoiceNote | null
}

function ClipSuccessStep({ selectedUsers, clipOptions, formatTime, voiceNote }: ClipSuccessStepProps) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-white" />
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-white font-bold text-3xl mb-4">Clip Shared Successfully!</h3>
        <p className="text-gray-400 text-xl">
          Your {clipOptions.duration}s clip from {formatTime(clipOptions.timestamp)} has been shared with{" "}
          {selectedUsers.length} friend{selectedUsers.length !== 1 ? "s" : ""}
          {voiceNote && " with a voice note"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shared Users */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="text-white font-medium text-lg mb-4">Shared with:</div>
          <div className="flex flex-wrap gap-3">
            {selectedUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 bg-gray-700/50 rounded-full px-4 py-2">
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-white">{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments */}
        {voiceNote && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-center space-x-3 text-[#FF6B35]">
              <Mic className="w-6 h-6" />
              <span className="font-medium text-lg">Voice note attached</span>
            </div>
          </div>
        )}
      </div>

      {/* FireStories Link */}
      <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C42]/10 border border-[#FF6B35]/20 rounded-xl p-6">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Sparkles className="w-6 h-6 text-[#FF6B35]" />
          <span className="text-white font-medium text-xl">View on FireStories</span>
        </div>
        <p className="text-gray-400 text-lg">
          Your clip is now live on FireStories! Friends will be notified and can view it there.
        </p>
      </div>

      <div className="text-gray-400">This menu will close automatically in a few seconds...</div>
    </div>
  )
}
