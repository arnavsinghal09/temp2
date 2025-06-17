import { Suspense } from "react"
import type { Metadata } from "next"
import ContentRow from "@/components/home/ContentRow"
import FeaturedBanner from "@/components/home/FeaturedBanner"
import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import { recentlyAdded } from "@/lib/data/mockData"
import type { FeaturedContent, ContentItem } from "@/lib/types"

export const metadata: Metadata = {
  title: "Recently Added - New Content",
  description: "Discover the latest movies and TV shows added to Prime Video",
}

const featuredRecent: FeaturedContent = {
  id: "featured-recent-1",
  title: "THE BEAR",
  description:
    "Season 3 · Carmen 'Carmy' Berzatto, a young chef from the fine dining world, comes home to Chicago to run his deceased brother's Italian beef sandwich shop. A world away from what he's used to, Carmy must balance the soul-crushing reality of small business ownership with his culinary ambitions.",
  backgroundImage: "/placeholder.svg?height=800&width=1400&text=THE+BEAR+Recently+Added",
  episodeInfo: "RECENTLY ADDED",
  newEpisodeInfo: "New on Prime Video",
  imdbRating: "8.7",
  year: 2024,
  rating: "TV-MA",
  duration: "3 seasons",
}

const thisWeekAdded: ContentItem[] = [
  {
    id: "week-1",
    title: "The Bear",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Bear+New",
    badge: "THIS WEEK",
    isPrime: true,
    year: 2024,
    duration: "30m",
    rating: "8.7",
    genre: "Comedy-Drama",
  },
  {
    id: "week-2",
    title: "Air",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Air+Movie+New",
    badge: "THIS WEEK",
    isPrime: true,
    year: 2023,
    duration: "1h 51m",
    rating: "7.4",
    genre: "Biography",
  },
  {
    id: "week-3",
    title: "The Consultant",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Consultant+New",
    badge: "THIS WEEK",
    isPrime: true,
    year: 2024,
    duration: "45m",
    rating: "6.8",
    genre: "Thriller",
  },
  {
    id: "week-4",
    title: "Daisy Jones & The Six",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Daisy+Jones+New",
    badge: "THIS WEEK",
    isPrime: true,
    year: 2023,
    duration: "50m",
    rating: "8.0",
    genre: "Music",
  },
  {
    id: "week-5",
    title: "Swarm",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Swarm+New",
    badge: "THIS WEEK",
    isPrime: true,
    year: 2023,
    duration: "35m",
    rating: "6.9",
    genre: "Thriller",
  },
]

const thisMonthAdded: ContentItem[] = [
  {
    id: "month-1",
    title: "The Power",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Power+Month",
    badge: "THIS MONTH",
    isPrime: true,
    year: 2024,
    duration: "58m",
    rating: "7.6",
    genre: "Drama",
  },
  {
    id: "month-2",
    title: "Citadel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Citadel+Month",
    badge: "THIS MONTH",
    isPrime: true,
    year: 2023,
    duration: "58m",
    rating: "6.5",
    genre: "Spy",
  },
  {
    id: "month-3",
    title: "Tetris",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Tetris+Movie",
    badge: "THIS MONTH",
    isPrime: true,
    year: 2023,
    duration: "1h 58m",
    rating: "7.4",
    genre: "Biography",
  },
  {
    id: "month-4",
    title: "Jury Duty",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Jury+Duty",
    badge: "THIS MONTH",
    isPrime: true,
    year: 2023,
    duration: "25m",
    rating: "8.2",
    genre: "Comedy",
  },
  {
    id: "month-5",
    title: "Dead Ringers",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Dead+Ringers",
    badge: "THIS MONTH",
    isPrime: true,
    year: 2023,
    duration: "50m",
    rating: "6.2",
    genre: "Thriller",
  },
]

export default function RecentPage() {
  return (
    <div className="pt-20 page-transition">
      <Suspense fallback={<LoadingSkeleton type="hero" />}>
        <FeaturedBanner content={featuredRecent} />
      </Suspense>

      <div className="py-12 space-y-12">
        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Added This Week" items={thisWeekAdded} seeMoreLink="/recent/week" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Recently Added" items={recentlyAdded} seeMoreLink="/recent/all" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Added This Month" items={thisMonthAdded} seeMoreLink="/recent/month" />
        </Suspense>
      </div>
    </div>
  )
}
