"use client"

import { Users } from "lucide-react"
import type { Campfire } from "@/lib/types"

interface CampfireCardProps {
  campfire: Campfire
  onClick?: (campfire: Campfire) => void
}

export function CampfireCard({ campfire, onClick }: CampfireCardProps) {
  return (
    <div
      className="bg-gray-950 rounded-lg p-4 transition-all duration-500 hover:bg-gray-900 hover:scale-105 cursor-pointer border border-gray-800 hover:border-[#ff6404]/30"
      onClick={() => onClick?.(campfire)}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff6404] to-orange-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-black" />
          </div>
          {campfire.isActive && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-[#ff6404] font-semibold">{campfire.name}</h3>
          <p className="text-gray-400 text-sm">{campfire.members.length} members</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <p className="text-[#ff6404] font-bold text-lg">{campfire.messageCount}</p>
          <p className="text-gray-400">Messages</p>
        </div>
        <div className="text-center">
          <p className="text-[#ff6404] font-bold text-lg">{campfire.clipCount}</p>
          <p className="text-gray-400">Clips</p>
        </div>
      </div>
      <p className="text-gray-500 text-xs mt-2">{campfire.lastActivity}</p>
    </div>
  )
}
