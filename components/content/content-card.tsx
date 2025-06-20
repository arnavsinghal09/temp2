"use client"
import { useState } from "react"
import type React from "react"
import type { ContentItem } from "@/lib/types"

interface ContentCardProps {
  item: ContentItem
}

export function ContentCard({ item }: ContentCardProps) {
  const [showLabel, setShowLabel] = useState(false)
  const [labelPosition, setLabelPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const labelWidth = 200 // Approximate label width

    let x = rect.left + rect.width / 2 - labelWidth / 2

    // Keep label within screen bounds
    if (x < 10) x = 10
    if (x + labelWidth > viewportWidth - 10) x = viewportWidth - labelWidth - 10

    setLabelPosition({ x, y: rect.bottom + 10 })
    setShowLabel(true)
  }

  const handleMouseLeave = () => {
    setShowLabel(false)
  }

  return (
    <>
      <div
        className="flex-shrink-0 w-40 group cursor-pointer transition-all duration-700 hover:translate-y-2 focus:outline-none focus:ring-2 focus:ring-[#ff6404] rounded-lg mr-6 transform-gpu hover:z-10 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-lg hover:shadow-2xl hover:shadow-[#ff6404]/20 transition-all duration-700">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-56 object-cover transition-all duration-1000 transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
        </div>
        {showLabel && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-[#ff6404]/30 rounded-b-lg p-3 shadow-2xl pointer-events-none animate-fade-in-up">
            <h3 className="text-white font-medium text-sm">{item.title}</h3>
            <p className="text-[#ff6404] text-xs">{item.platform}</p>
          </div>
        )}
      </div>
    </>
  )
}
