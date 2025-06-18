import { Suspense } from "react"
import type { Metadata } from "next"
import ContentRow from "../components/home/ContentRow"
import LoadingSkeleton from "../components/ui/LoadingSkeleton"
import { Bookmark, Heart, Clock, Trash2 } from "lucide-react"
import type { ContentItem } from "../lib/types/index"

export const metadata: Metadata = {
  title: "My Bookmarks - Your Saved Content",
  description: "View and manage your bookmarked movies and TV shows",
}

// Mock bookmarked content
const bookmarkedMovies: ContentItem[] = [
  {
    id: "bookmark-movie-1",
    title: "The Tomorrow War",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Tomorrow+War",
    badge: "BOOKMARKED",
    isPrime: true,
    year: 2021,
    duration: "2h 18m",
    rating: "6.5",
    genre: "Action",
  },
  {
    id: "bookmark-movie-2",
    title: "Sound of Metal",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Sound+of+Metal",
    isPrime: true,
    year: 2020,
    duration: "2h 0m",
    rating: "7.7",
    genre: "Drama",
  },
  {
    id: "bookmark-movie-3",
    title: "The Power of the Dog",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Power+of+Dog",
    isPrime: true,
    year: 2021,
    duration: "2h 8m",
    rating: "6.8",
    genre: "Drama",
  },
]

const bookmarkedTVShows: ContentItem[] = [
  {
    id: "bookmark-tv-1",
    title: "The Boys",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Boys",
    badge: "WATCHING",
    isPrime: true,
    year: 2024,
    duration: "1h 2m",
    rating: "8.7",
    genre: "Superhero",
  },
  {
    id: "bookmark-tv-2",
    title: "The Marvelous Mrs. Maisel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Mrs+Maisel",
    isPrime: true,
    year: 2023,
    duration: "52m",
    rating: "8.7",
    genre: "Comedy-Drama",
  },
  {
    id: "bookmark-tv-3",
    title: "Fallout",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Fallout",
    badge: "NEW EPISODES",
    isPrime: true,
    year: 2024,
    duration: "1h 5m",
    rating: "8.4",
    genre: "Sci-Fi",
  },
]

const continueWatching: ContentItem[] = [
  {
    id: "continue-1",
    title: "THE TRAITORS",
    thumbnail: "/placeholder.svg?height=315&width=560&text=THE+TRAITORS",
    badge: "EPISODE 3",
    isPrime: true,
    year: 2024,
    duration: "45m",
    rating: "8.2",
    genre: "Reality TV",
  },
  {
    id: "continue-2",
    title: "Jack Ryan",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Jack+Ryan",
    badge: "SEASON 4",
    isPrime: true,
    year: 2023,
    duration: "1h 8m",
    rating: "8.0",
    genre: "Action",
  },
]

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-[#0F171E] pt-20 page-transition">
      {/* Header Section */}
      <div className="px-8 md:px-16 py-12">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full flex items-center justify-center shadow-lg">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-none">MY BOOKMARKS</h1>
              <p className="text-xl text-gray-300 mt-2">Your saved movies and TV shows</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-red-500" />
                <div>
                  <div className="text-white font-bold text-lg">
                    {bookmarkedMovies.length + bookmarkedTVShows.length}
                  </div>
                  <div className="text-gray-400 text-sm">Total Saved</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="text-white font-bold text-lg">{continueWatching.length}</div>
                  <div className="text-gray-400 text-sm">Continue Watching</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    {bookmarkedMovies.length + bookmarkedTVShows.length}
                  </div>
                  <div className="text-gray-400 text-sm">Prime Content</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <button className="flex items-center space-x-3 w-full text-left hover:bg-white/5 transition-colors duration-200 rounded-lg p-2 -m-2">
                <Trash2 className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-white font-bold text-sm">Clear All</div>
                  <div className="text-gray-400 text-xs">Remove bookmarks</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Continue Watching" items={continueWatching} />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Bookmarked Movies" items={bookmarkedMovies} />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Bookmarked TV Shows" items={bookmarkedTVShows} />
        </Suspense>
      </div>

      {/* Empty State (if no bookmarks) */}
      {bookmarkedMovies.length === 0 && bookmarkedTVShows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-4">No bookmarks yet</h2>
          <p className="text-gray-400 text-center max-w-md mb-8">
            Start exploring and bookmark your favorite movies and TV shows to see them here.
          </p>
          <button className="bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            Browse Content
          </button>
        </div>
      )}
    </div>
  )
}
