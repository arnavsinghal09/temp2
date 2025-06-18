"use client"

import Image from "next/image"
import { Play, Plus, Info, Star } from "lucide-react"
import Link from "next/link"

interface FeaturedContent {
  id: string
  title: string
  description: string
  backgroundImage: string
  year?: number
  rating?: string
  duration?: string
  episodeInfo?: string
  newEpisodeInfo?: string
  imdbRating?: string
}

export default function FeaturedBanner({ content }: { content: FeaturedContent }) {
  return (
    <div className="relative h-[85vh] min-h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImage || "/placeholder.svg"}
          alt={content.title}
          fill
          className="object-cover scale-105 transition-transform duration-[10s] ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E]/95 via-[#0F171E]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F171E]/60" />
      </div>

      <div className="relative z-10 flex items-center h-full px-8 md:px-16">
        <div className="max-w-3xl hero-content">
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">prime</span>
              </div>
              <span className="text-[#00A8E1] font-semibold uppercase tracking-wider text-sm">Original Series</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white tracking-tight leading-none bg-gradient-to-r from-white to-gray-200 bg-clip-text">
            {content.title}
          </h1>

          {content.newEpisodeInfo && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm rounded-full shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                {content.newEpisodeInfo}
              </span>
            </div>
          )}

          {content.episodeInfo && (
            <div className="mb-6">
              <span className="text-white text-xl font-bold">{content.episodeInfo}</span>
            </div>
          )}

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">{content.imdbRating || "8.2"}</span>
              <span className="text-gray-400">IMDb</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-300">
              <span>{content.year || "2024"}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="px-2 py-1 bg-gray-700/80 rounded text-sm font-medium">{content.rating || "TV-MA"}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{content.duration || "8 episodes"}</span>
            </div>
          </div>

          <p className="text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl">{content.description}</p>

          <div className="flex items-center space-x-4 mb-8">
            <Link
              href={`/prime/watch/${content.id}`}
              className="group flex items-center space-x-4 bg-white hover:bg-gray-100 text-black px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 play-button shadow-lg hover:shadow-xl"
            >
              <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform duration-300" />
              <div className="text-left">
                <div className="text-sm opacity-80">Play</div>
                <div className="text-lg font-black">Episode 1</div>
              </div>
            </Link>

            <button className="flex items-center justify-center w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-105">
              <Plus className="w-7 h-7" />
            </button>

            <button className="flex items-center justify-center w-16 h-16 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-105">
              <Info className="w-7 h-7" />
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full mr-3 shadow-lg"></div>
            <span className="text-white font-semibold">Included with Prime</span>
          </div>
        </div>
      </div>

      {/* Enhanced carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        <div className="w-12 h-1 bg-white rounded-full shadow-lg"></div>
        <div className="w-4 h-1 bg-white/40 rounded-full"></div>
        <div className="w-4 h-1 bg-white/40 rounded-full"></div>
        <div className="w-4 h-1 bg-white/40 rounded-full"></div>
        <div className="w-4 h-1 bg-white/40 rounded-full"></div>
      </div>
    </div>
  )
}
