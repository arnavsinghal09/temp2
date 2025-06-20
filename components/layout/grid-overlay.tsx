"use client"
import { X, Grid3X3, List, LayoutGrid } from "lucide-react"

interface GridOverlayProps {
  isVisible: boolean
  onClose: () => void
}

const viewOptions = [
  {
    id: "grid",
    name: "Grid View",
    icon: Grid3X3,
    description: "View content in a grid layout",
  },
  {
    id: "list",
    name: "List View",
    icon: List,
    description: "View content in a list layout",
  },
  {
    id: "compact",
    name: "Compact View",
    icon: LayoutGrid,
    description: "View more content at once",
  },
]

export function GridOverlay({ isVisible, onClose }: GridOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in">
      <div className="max-w-md mx-auto pt-32 px-6">
        <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h3 className="text-[#ff6404] font-semibold">View Options</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* View Options */}
          <div className="p-4 space-y-3">
            {viewOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={onClose}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#ff6404]" />
                  <div className="text-left">
                    <p className="text-white font-medium">{option.name}</p>
                    <p className="text-gray-400 text-sm">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
