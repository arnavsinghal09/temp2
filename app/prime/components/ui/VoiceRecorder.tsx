"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Play, Pause, Trash2, Send } from "lucide-react"

interface VoiceRecorderProps {
  onVoiceNote: (audioBlob: Blob, duration: number) => void
  isOpen: boolean
  onClose: () => void
}

export default function VoiceRecorder({ onVoiceNote, isOpen, onClose }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (!isOpen) {
      stopRecording()
      resetRecording()
    }
  }, [isOpen])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPlaying(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const sendVoiceNote = () => {
    if (audioBlob) {
      onVoiceNote(audioBlob, recordingTime)
      onClose()
      resetRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200] bg-transparent" onClick={onClose} />

      {/* Voice Recorder Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl pointer-events-auto w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600 flex-shrink-0">
            <h3 className="text-white font-semibold text-lg">Voice Note</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-xl p-1 hover:bg-gray-700 rounded"
            >
              ×
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6">
              {!audioBlob ? (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-[#FF6B35] hover:bg-[#FF8C42]"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="w-10 h-10 text-white" />
                      ) : (
                        <Mic className="w-10 h-10 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="text-white font-mono text-2xl">{formatTime(recordingTime)}</div>

                  <p className="text-gray-400">{isRecording ? "Recording... Tap to stop" : "Tap to start recording"}</p>

                  {/* Recording Instructions */}
                  <div className="bg-gray-700/30 rounded-lg p-4 text-left">
                    <h4 className="text-white font-medium mb-2">Recording Tips:</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Speak clearly into your microphone</li>
                      <li>• Keep background noise to a minimum</li>
                      <li>• Maximum recording time: 2 minutes</li>
                      <li>• Tap the button again to stop recording</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">Voice Note</span>
                      <span className="text-gray-400">{formatTime(recordingTime)}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={playRecording}
                        className="w-12 h-12 bg-[#FF6B35] hover:bg-[#FF8C42] rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 h-3 bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF6B35] rounded-full w-1/3 transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* Recording Quality Info */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Recording Details:</h4>
                    <div className="text-gray-400 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-white">{formatTime(recordingTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className="text-white">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="text-white">WebM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          {audioBlob && (
            <div className="p-6 border-t border-gray-600 flex-shrink-0">
              <div className="flex space-x-3">
                <button
                  onClick={resetRecording}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={sendVoiceNote}
                  className="flex-1 py-3 px-4 bg-[#FF6B35] hover:bg-[#FF8C42] text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          <audio ref={audioRef} src={audioUrl || undefined} onEnded={() => setIsPlaying(false)} className="hidden" />
        </div>
      </div>
    </>
  )
}
