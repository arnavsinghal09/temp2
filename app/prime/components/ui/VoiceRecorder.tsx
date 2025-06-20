"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Play, Pause, Trash2, X } from "lucide-react"

interface VoiceRecorderProps {
  isOpen: boolean
  onClose: () => void
  onVoiceNote: (audioBlob: Blob, duration: number) => void
}

export default function VoiceRecorder({ isOpen, onClose, onVoiceNote }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingWaveform, setRecordingWaveform] = useState<number[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
     setIsRecording(true)
     setRecordingTime(0)
     setRecordingWaveform([])

     // Start timer and waveform animation
     timerRef.current = setInterval(() => {
       setRecordingTime(prev => prev + 1)
       setRecordingWaveform(prev => {
         const newValue = Math.random() * 0.7 + 0.2
         return [...prev, newValue].slice(-15)
       })
     }, 1000)

   } catch (error) {
     alert("Could not access microphone. Please check permissions.")
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
   if (audioBlob && !isPlaying) {
     const audio = new Audio(URL.createObjectURL(audioBlob))
     audioRef.current = audio
     
     audio.onended = () => {
       setIsPlaying(false)
     }
     
     audio.play()
     setIsPlaying(true)
   } else if (audioRef.current && isPlaying) {
     audioRef.current.pause()
     setIsPlaying(false)
   }
 }

 const deleteRecording = () => {
   setAudioBlob(null)
   setRecordingTime(0)
   setRecordingWaveform([])
   if (audioRef.current) {
     audioRef.current.pause()
     setIsPlaying(false)
   }
 }

 const saveRecording = () => {
   if (audioBlob) {
     onVoiceNote(audioBlob, recordingTime)
     onClose()
     // Reset state
     setAudioBlob(null)
     setRecordingTime(0)
     setRecordingWaveform([])
   }
 }

 const formatTime = (seconds: number) => {
   const mins = Math.floor(seconds / 60)
   const secs = seconds % 60
   return `${mins}:${secs.toString().padStart(2, "0")}`
 }

 if (!isOpen) return null

 return (
   <div className="absolute bottom-12 right-0 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4">
     <div className="flex items-center justify-between mb-4">
       <h3 className="text-white font-medium">Voice Message</h3>
       <button
         onClick={onClose}
         className="text-gray-400 hover:text-white transition-colors"
       >
         <X className="w-4 h-4" />
       </button>
     </div>

     {!audioBlob ? (
       <div className="space-y-4">
         <div className="text-center">
           <div className="text-white text-lg font-medium mb-2">
             {formatTime(recordingTime)}
           </div>
           
           {isRecording && (
             <div className="flex items-end justify-center space-x-1 h-16 mb-4">
               {recordingWaveform.map((height, index) => (
                 <div
                   key={index}
                   className="w-1 bg-[#FF6B35] rounded-full animate-pulse"
                   style={{ height: `${height * 60}px` }}
                 />
               ))}
             </div>
           )}
         </div>

         <div className="flex justify-center">
           {!isRecording ? (
             <button
               onClick={startRecording}
               className="w-16 h-16 bg-[#FF6B35] hover:bg-[#FF8C42] rounded-full flex items-center justify-center transition-colors"
             >
               <Mic className="w-8 h-8 text-white" />
             </button>
           ) : (
             <button
               onClick={stopRecording}
               className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors animate-pulse"
             >
               <MicOff className="w-8 h-8 text-white" />
             </button>
           )}
         </div>

         <p className="text-gray-400 text-sm text-center">
           {isRecording ? "Recording... Tap to stop" : "Tap to start recording"}
         </p>
       </div>
     ) : (
       <div className="space-y-4">
         <div className="text-center">
           <div className="text-white text-lg font-medium mb-2">
             {formatTime(recordingTime)}
           </div>
           <p className="text-gray-400 text-sm">Recording ready</p>
         </div>

         <div className="flex items-center justify-center space-x-4">
           <button
             onClick={playRecording}
             className="w-12 h-12 bg-[#FF6B35] hover:bg-[#FF8C42] rounded-full flex items-center justify-center transition-colors"
           >
             {isPlaying ? (
               <Pause className="w-6 h-6 text-white" />
             ) : (
               <Play className="w-6 h-6 text-white ml-1" />
             )}
           </button>

           <button
             onClick={deleteRecording}
             className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
           >
             <Trash2 className="w-6 h-6 text-white" />
           </button>
         </div>

         <div className="flex space-x-2">
           <button
             onClick={onClose}
             className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
           >
             Cancel
           </button>
           <button
             onClick={saveRecording}
             className="flex-1 bg-[#FF6B35] hover:bg-[#FF8C42] text-white py-2 rounded-lg transition-colors"
           >
             Send
           </button>
         </div>
       </div>
     )}
   </div>
 )
}
