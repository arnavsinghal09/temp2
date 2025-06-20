import { Play, Eye, ThumbsUp, Share2 } from "lucide-react"
import type { Clip } from "@/lib/types"

interface ClipPreviewCardProps {
  clip: Clip
}

export function ClipPreviewCard({ clip }: ClipPreviewCardProps) {
  return (
    <div className="bg-gray-950 rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer border border-gray-800 hover:border-[#ff6404]/30">
      <div className="relative">
        <img src={clip.thumbnail || "/placeholder.svg"} alt={clip.title} className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white font-semibold text-sm mb-1">{clip.title}</h3>
          <p className="text-[#ff6404] text-xs">{clip.platform}</p>
        </div>
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">{clip.duration}</div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#ff6404] rounded-full p-2">
            <Play className="w-4 h-4 text-black fill-current" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>by {clip.sharedBy}</span>
          <span>{clip.timestamp}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{clip.views}</span>
            </span>
            <span className="flex items-center space-x-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{clip.likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>{clip.shares}</span>
            </span>
          </div>
          <span className="text-[#ff6404]">{clip.campfire}</span>
        </div>
      </div>
    </div>
  )
}
