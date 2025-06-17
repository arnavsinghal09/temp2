"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage, ChatParticipant } from "@/lib/types"
import { MessageSystem } from "@/lib/message-system"

interface ChatPanelProps {
  participant: ChatParticipant | null
  onClose: () => void
  currentUser: any
}

interface MessageBubbleProps {
  message: ChatMessage
  isCurrentUser: boolean
}

function VoiceMessage({ message, isCurrentUser }: { message: ChatMessage; isCurrentUser: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const simulationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (simulationRef.current) {
        clearTimeout(simulationRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setProgress(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (simulationRef.current) {
        clearTimeout(simulationRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    } else {
      setIsPlaying(true)
      setAudioError(false)
      simulatePlayback()
    }
  }

  const simulatePlayback = () => {
    const durationParts = message.voiceData?.duration?.split(":") || ["0", "15"]
    const totalSeconds = Number.parseInt(durationParts[0]) * 60 + Number.parseInt(durationParts[1])
    const totalMs = totalSeconds * 1000

    const startTime = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressPercent = Math.min((elapsed / totalMs) * 100, 100)
      setProgress(progressPercent)

      if (progressPercent >= 100) {
        setIsPlaying(false)
        setProgress(0)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, 50)

    simulationRef.current = setTimeout(() => {
      setIsPlaying(false)
      setProgress(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, totalMs)
  }

  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg max-w-xs",
        isCurrentUser ? "bg-[#ff6404] text-black" : "bg-gray-800 text-white",
      )}
    >
      <button
        onClick={togglePlay}
        className={cn(
          "p-2 rounded-full transition-colors",
          isCurrentUser ? "bg-black/20 hover:bg-black/30" : "bg-[#ff6404] hover:bg-orange-500",
        )}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="flex-1">
        <div className="flex items-center space-x-1 mb-1">
          {message.voiceData?.waveform.map((height, index) => (
            <div
              key={index}
              className={cn(
                "w-1 rounded-full transition-all duration-200",
                isCurrentUser ? "bg-black/40" : "bg-[#ff6404]/60",
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
  )
}

function ClipMessage({ message, isCurrentUser }: { message: ChatMessage; isCurrentUser: boolean }) {
  return (
    <div className={cn("max-w-sm rounded-lg overflow-hidden", isCurrentUser ? "bg-[#ff6404]/10" : "bg-gray-800")}>
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
        <h4 className="text-white font-medium text-sm">{message.clipData?.title}</h4>
        <p className="text-[#ff6404] text-xs">{message.clipData?.platform}</p>
      </div>
    </div>
  )
}

function ImageMessage({ message, isCurrentUser }: { message: ChatMessage; isCurrentUser: boolean }) {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden">
      <img
        src={message.imageData?.url || "/placeholder.svg"}
        alt={message.imageData?.caption || "Shared image"}
        className="w-full h-48 object-cover rounded-lg"
      />
      {message.imageData?.caption && <p className="text-gray-300 text-sm mt-2">{message.imageData.caption}</p>}
    </div>
  )
}

function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">{message.content}</div>
      </div>
    )
  }

  return (
    <div className={cn("flex mb-4", isCurrentUser ? "justify-end" : "justify-start")}>
      {!isCurrentUser && (
        <img
          src={message.avatar || "/placeholder.svg"}
          alt={message.sender}
          className="w-8 h-8 rounded-full mr-3 mt-1 flex-shrink-0"
        />
      )}
      <div className={cn("max-w-xs lg:max-w-md", isCurrentUser && "order-1")}>
        {!isCurrentUser && <p className="text-[#ff6404] text-xs font-medium mb-1">{message.sender}</p>}

        {message.type === "text" && (
          <div
            className={cn(
              "p-3 rounded-lg break-words",
              isCurrentUser ? "bg-[#ff6404] text-black rounded-br-sm" : "bg-gray-800 text-white rounded-bl-sm",
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}

        {message.type === "voice" && <VoiceMessage message={message} isCurrentUser={isCurrentUser} />}

        {message.type === "clip" && (
          <div className="space-y-2">
            {message.content && (
              <div
                className={cn(
                  "p-3 rounded-lg break-words",
                  isCurrentUser ? "bg-[#ff6404] text-black rounded-br-sm" : "bg-gray-800 text-white rounded-bl-sm",
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
                  isCurrentUser ? "bg-[#ff6404] text-black rounded-br-sm" : "bg-gray-800 text-white rounded-bl-sm",
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            )}
            <ImageMessage message={message} isCurrentUser={isCurrentUser} />
          </div>
        )}

        <p className={cn("text-xs text-gray-400 mt-1", isCurrentUser ? "text-right" : "text-left")}>
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
  )
}

export function ChatPanel({ participant, onClose, currentUser }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingWaveform, setRecordingWaveform] = useState<number[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    setShouldRender(!!participant)
  }, [participant])

  // Load messages when participant changes
  useEffect(() => {
    if (participant && currentUser) {
      const loadedMessages = MessageSystem.getMessagesForChat(currentUser.id, participant.id, participant.type)
      setMessages(loadedMessages)
    }
  }, [participant, currentUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 100
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px"
    }
  }, [newMessage])

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [])

  const handleSendMessage = () => {
    if ((newMessage.trim() || selectedFile) && participant && currentUser) {
      let messageType: "text" | "clip" | "image" = "text"
      let messageData = {}

      if (selectedFile) {
        if (selectedFile.type.startsWith("image/")) {
          messageType = "image"
          messageData = {
            imageData: {
              url: URL.createObjectURL(selectedFile),
              caption: newMessage.trim() || undefined,
            },
          }
        } else {
          messageType = "clip"
          messageData = {
            clipData: {
              title: selectedFile.name,
              thumbnail: "/placeholder.svg?height=120&width=200",
              duration: "0:30",
              platform: "Local",
            },
          }
        }
      }

      const newMsg: ChatMessage = {
        id: Date.now(),
        type: messageType,
        sender: currentUser.name,
        content: newMessage.trim() || (selectedFile ? `Shared ${selectedFile.name}` : ""),
        timestamp: new Date().toLocaleString(),
        avatar: currentUser.avatar,
        ...messageData,
      }

      // Send message through the message system
      if (participant.type === "friend") {
        MessageSystem.sendDirectMessage(currentUser.id, participant.id, newMsg)
      } else {
        MessageSystem.sendCampfireMessage(currentUser.id, participant.id, newMsg)
      }

      // Reload messages to get the updated chat
      const updatedMessages = MessageSystem.getMessagesForChat(currentUser.id, participant.id, participant.type)
      setMessages(updatedMessages)

      setNewMessage("")
      setSelectedFile(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleVoiceRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }

      if (participant && currentUser) {
        // Create voice message
        const minutes = Math.floor(recordingTime / 60)
        const seconds = recordingTime % 60
        const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`

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
        }

        // Send voice message
        if (participant.type === "friend") {
          MessageSystem.sendDirectMessage(currentUser.id, participant.id, voiceMsg)
        } else {
          MessageSystem.sendCampfireMessage(currentUser.id, participant.id, voiceMsg)
        }

        // Reload messages
        const updatedMessages = MessageSystem.getMessagesForChat(currentUser.id, participant.id, participant.type)
        setMessages(updatedMessages)
      }

      setRecordingTime(0)
      setRecordingWaveform([])
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingWaveform([])

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
        setRecordingWaveform((prev) => {
          const newValue = Math.random() * 0.7 + 0.2
          return [...prev, newValue].slice(-15)
        })
      }, 1000)
    }
  }

  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60)
    const seconds = recordingTime % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getParticipantName = () => {
    if (!participant) return "Unknown"
    if (participant.type === "friend") {
      return participant.name || "Unknown Friend"
    } else {
      return participant.name || "Unknown Campfire"
    }
  }

  const getParticipantSubtitle = () => {
    if (!participant) return ""
    if (participant.type === "friend") {
      return participant.isOnline ? participant.status || "Online" : "Offline"
    } else {
      return `${participant.members?.length || 0} members`
    }
  }

  const panelWidth = isExpanded ? "w-[600px]" : "w-[450px]"

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
          panelWidth,
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
              <span className="text-black font-bold text-sm">{(participant?.name || "U").charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold truncate">{getParticipantName()}</h3>
              <p className="text-gray-400 text-xs truncate">{getParticipantSubtitle()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isExpanded ? "Collapse panel" : "Expand panel"}
            >
              {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
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
            <MessageBubble key={message.id} message={message} isCurrentUser={message.sender === currentUser?.name} />
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
                    src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                    alt="Preview"
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#ff6404] rounded flex items-center justify-center flex-shrink-0">
                    <Paperclip className="w-5 h-5 text-black" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-gray-400 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-white flex-shrink-0">
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
                <p className="text-white">Recording... {formatRecordingTime()}</p>
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
                    : "text-gray-400 hover:text-[#ff6404] hover:bg-gray-800",
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
  ) : null
}
