"use client"

import { ChevronLeft, ChevronRight, Play, Plus, Star } from "lucide-react"
import { useRef, useState } from "react"

// Mock data for demonstration
const mockItems = [
  {
    id: "1",
    title: "The Boys",
    thumbnail: "https://images.unsplash.com/photo-1489599512143-c2481b30eb4e?w=320&h=180&fit=crop",
    rating: "8.7",
    year: "2019",
    duration: "1h",
    genre: "Action",
    badge: "TOP 10",
    isPrime: true
  },
  {
    id: "2",
    title: "Rings of Power",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=320&h=180&fit=crop",
    rating: "7.2",
    year: "2022",
    duration: "1h 10m",
    genre: "Fantasy",
    badge: "NEW SERIES",
    isPrime: true
  },
  {
    id: "3",
    title: "Jack Ryan",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&h=180&fit=crop",
    rating: "8.1",
    year: "2018",
    duration: "45m",
    genre: "Thriller",
    badge: "AWARD WINNER",
    isPrime: true
  },
  {
    id: "4",
    title: "The Marvelous Mrs. Maisel",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=180&fit=crop",
    rating: "8.5",
    year: "2017",
    duration: "1h",
    genre: "Comedy",
    badge: "NEW SEASON",
    isPrime: true
  },
  {
    id: "5",
    title: "Upload",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=320&h=180&fit=crop",
    rating: "7.8",
    year: "2020",
    duration: "30m",
    genre: "Sci-Fi",
    badge: "NEW",
    isPrime: true
  }
]

interface ContentItem {
  id: string
  title: string
  thumbnail?: string
  rating?: string
  year: string
  duration: string
  genre?: string
  badge?: string
  isPrime?: boolean
}

interface ContentRowProps {
  title: string
  items: ContentItem[]
  seeMoreLink?: string
}

export default function ContentRow({ 
  title = "Popular on Prime", 
  items = mockItems, 
  seeMoreLink 
}: ContentRowProps) {
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

  const truncateBadgeText = (text: string, maxLength = 11) => {
    const upperText = text.toUpperCase()

    if (upperText === "TOP 10" || upperText === "LIVE" || upperText === "NEW") {
      return upperText
    }

    if (upperText === "NEW SERIES") {
      return "NEW SERIES"
    }

    if (upperText === "NEW SEASON") {
      return "NEW SEASON"
    }

    if (upperText === "AWARD WINNER") {
      return "AWARD"
    }

    if (text.length <= maxLength) return text.toUpperCase()
    return text.substring(0, maxLength - 1).toUpperCase() + "…"
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between px-8 md:px-16 mb-6">
        <div className="text-white text-2xl font-bold tracking-tight">{title}</div>
        {seeMoreLink && (
          <a
            href={`/prime${seeMoreLink}`}
            className="text-[#00A8E1] hover:text-[#1FB6FF] text-sm font-semibold flex items-center group transition-all duration-300"
          >
            See more
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        )}
      </div>

      <div className="relative group/row">
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Content container */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto px-8 md:px-16 pb-4"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none"
          }}
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
                    {truncateBadgeText(item.badge)}
                  </div>
                )}

                {/* Image */}
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${
                  hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-lg leading-tight truncate pr-2">{item.title}</div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{item.rating || "8.1"}</span>
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
                      <a
                        href={`./watch/${item.id}`}
                        className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play</span>
                      </a>
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
                      <span className="text-white text-xs font-bold">prime</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}