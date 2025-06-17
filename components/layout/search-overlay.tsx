"use client"
import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"

interface SearchOverlayProps {
  isVisible: boolean
  onClose: () => void
}

const recentSearches = ["Breaking Bad", "Stranger Things", "The Office", "Game of Thrones"]

const trendingSearches = ["Wednesday", "House of the Dragon", "The Bear", "Andor", "The Crown"]

export function SearchOverlay({ isVisible, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in">
      <div className="max-w-2xl mx-auto pt-20 px-6">
        <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center p-4 border-b border-gray-800">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for shows, movies, or friends..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results/Suggestions */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {searchQuery ? (
              <div>
                <p className="text-gray-400 text-sm mb-4">Search results for "{searchQuery}"</p>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-900 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                    <p className="text-white">No results found</p>
                    <p className="text-gray-400 text-sm">Try searching for something else</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recent Searches */}
                <div>
                  <h3 className="text-[#ff6404] font-semibold mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Searches
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="w-full text-left p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <p className="text-white">{search}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div>
                  <h3 className="text-[#ff6404] font-semibold mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending
                  </h3>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="w-full text-left p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <p className="text-white">{search}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
