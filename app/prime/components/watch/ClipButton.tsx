"use client"

import { useState } from "react"
import { Scissors, Sparkles } from "lucide-react"
import ClipMenu from "./ClipMenu"

interface ClipButtonProps {
  currentTime: number
  contentTitle: string
}

export default function ClipButton({ currentTime, contentTitle }: ClipButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleClipClick = () => {
    setIsMenuOpen(true)
    setShowTooltip(false)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={handleClipClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="fixed bottom-6 right-6 z-50 clip-button text-[#FF6B35] px-6 py-4 rounded-xl font-bold flex items-center space-x-3 group"
          aria-label="Clip this moment"
        >
          <div className="relative">
            <Scissors className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="relative">
            Clip This Moment
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
          </span>
        </button>

        {showTooltip && !isMenuOpen && (
          <div className="fixed bottom-24 right-6 z-50 bg-gray-900/95 text-white px-4 py-3 rounded-lg text-sm backdrop-blur-sm border border-gray-700/50 shadow-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#FF6B35]" />
              <span>Capture this scene and share on FireStories</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
          </div>
        )}
      </div>

      <ClipMenu isOpen={isMenuOpen} onClose={handleCloseMenu} currentTime={currentTime} contentTitle={contentTitle} />
    </>
  )
}
