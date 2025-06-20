"use client"
import { forwardRef } from "react"
import type React from "react"

import { User, Settings, LogOut, Crown } from "lucide-react"

interface AccountInfoPopupProps {
  isVisible: boolean
  position: { x: number; y: number }
  onNavigateToSettings: () => void
  onMouseEnter?: () => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export const AccountInfoPopup = forwardRef<HTMLDivElement, AccountInfoPopupProps>(
  ({ isVisible, position, onNavigateToSettings, onMouseEnter, onMouseLeave }, ref) => {
    if (!isVisible) return null

    // Calculate position to ensure popup stays within viewport
    const getPopupStyle = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const popupWidth = 264 // w-64 = 256px + padding
      const popupHeight = 300 // Approximate height

      const left = Math.max(10, Math.min(position.x - popupWidth / 2, viewportWidth - popupWidth - 10))
      let top = position.y + 10

      // If popup would go below viewport, show it above the trigger
      if (top + popupHeight > viewportHeight - 20) {
        top = position.y - popupHeight - 10
      }

      return {
        left: `${left}px`,
        top: `${top}px`,
      }
    }

    return (
      <div
        ref={ref}
        className="fixed z-50 bg-gray-950 border border-gray-800 rounded-lg shadow-2xl p-4 w-64 animate-fade-in-up"
        style={getPopupStyle()}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6404] to-orange-600 flex items-center justify-center">
            <span className="text-black font-bold text-lg">A</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">Arnav Kumar</h3>
            <div className="flex items-center space-x-1">
              <Crown className="w-3 h-3 text-[#ff6404]" />
              <span className="text-[#ff6404] text-xs">Premium Member</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Clips Shared</span>
            <span className="text-[#ff6404] font-semibold">47</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Campfires</span>
            <span className="text-[#ff6404] font-semibold">3</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Friends</span>
            <span className="text-[#ff6404] font-semibold">12</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3 space-y-2">
          <button
            onClick={onNavigateToSettings}
            className="w-full flex items-center space-x-2 text-left p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm">Account Settings</span>
          </button>
          <button className="w-full flex items-center space-x-2 text-left p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm">View Profile</span>
          </button>
          <button className="w-full flex items-center space-x-2 text-left p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
            <LogOut className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    )
  },
)

AccountInfoPopup.displayName = "AccountInfoPopup"
