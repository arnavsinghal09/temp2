"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Plus, Star } from "lucide-react"
import { useRef, useState } from "react"

interface ContentItem {
  id: string
  title: string
  thumbnail: string
  year?: number
  duration?: string
  badge?: string
  isPrime?: boolean
  rating?: string
  genre?: string
}

interface ContentRowProps {
  title: string
  items: ContentItem[]
  seeMoreLink?: string
}

export default function ContentRow({ title, items, seeMoreLink }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const getBadgeClass = (badge: string) => {
    switch (badge.toUpperCase()) {
      case "TOP 10":
        return "bg-red-600"
      case "NEW SERIES":
        return "bg-green-600"
      case "NEW SEASON":
        return "bg-blue-600"
      case "AWARD WINNER":
        return "bg-yellow-600"
      case "LIVE":
        return "bg-red-500"
      case "UPCOMING":
        return "bg-purple-600"
      case "NEW":
        return "bg-orange-600"
      default:
        return "bg-green-600"
    }
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between px-8 md:px-16 mb-6">
        <div className="text-white text-2xl font-bold tracking-tight">
          {title}
        </div>
        {seeMoreLink && (
          <Link
            href={`/prime${seeMoreLink}`}
            className="text-[#00A8E1] hover:text-[#1FB6FF] text-sm font-semibold flex items-center group transition-all duration-300"
          >
            See more
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        )}
      </div>

      <div className="relative group/row">
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto px-8 md:px-16 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="relative w-[320px] aspect-[16/9] rounded-lg overflow-hidden group/item cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-20"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Badge */}
                {item.badge && (
                  <div
                    className={`absolute top-2 left-2 z-20 ${getBadgeClass(item.badge)} text-white text-xs font-bold px-2 py-1 rounded`}
                    title={item.badge.toUpperCase()}
                  >
                    {item.badge}
                  </div>
                )}

                <Image
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-500"
                  sizes="320px"
                />

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${
                  hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-lg leading-tight truncate pr-2">
                        {item.title}
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">
                          {item.rating || "8.1"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-3 text-sm text-gray-300">
                      <span>{item.year}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{item.duration}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="truncate">{item.genre || "Drama"}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/prime/watch/${item.id}`}
                        className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play</span>
                      </Link>
                      <button 
                        onClick={() => {
                          console.log(`Added ${item.title} to watchlist`)
                          // Add your watchlist functionality here
                        }}
                        className="flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
                        title="Add to Watchlist"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Prime logo */}
                {item.isPrime && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">
                        prime
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-all-300 hover:scale-110 backdrop-blur-sm shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}