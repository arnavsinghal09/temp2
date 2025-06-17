import { Suspense } from "react"
import type { Metadata } from "next"
import ContentRow from "@/components/home/ContentRow"
import FeaturedBanner from "@/components/home/FeaturedBanner"
import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import { popularMovies, topTVShows } from "@/lib/data/mockData"
import type { FeaturedContent, ContentItem } from "@/lib/types"

export const metadata: Metadata = {
  title: "Trending Now - Popular Content",
  description: "Discover what's trending on Prime Video right now",
}

const featuredTrending: FeaturedContent = {
  id: "featured-trending-1",
  title: "FALLOUT",
  description:
    "Season 1 · Based on the beloved video game series, Fallout is the story of haves and have-nots in a world in which there's almost nothing left to have. 200 years after the apocalypse, the gentle denizens of luxury fallout shelters are forced to return to the irradiated hellscape their ancestors left behind.",
  backgroundImage: "/placeholder.svg?height=800&width=1400&text=FALLOUT+Trending+Now",
  episodeInfo: "#1 TRENDING NOW",
  newEpisodeInfo: "Most watched this week",
  imdbRating: "8.4",
  year: 2024,
  rating: "TV-MA",
  duration: "8 episodes",
}

const trendingThisWeek: ContentItem[] = [
  {
    id: "trending-1",
    title: "Fallout",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Fallout+Trending",
    badge: "#1 TRENDING",
    isPrime: true,
    year: 2024,
    duration: "1h 5m",
    rating: "8.4",
    genre: "Sci-Fi",
  },
  {
    id: "trending-2",
    title: "The Boys",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Boys+Trending",
    badge: "#2 TRENDING",
    isPrime: true,
    year: 2024,
    duration: "1h 2m",
    rating: "8.7",
    genre: "Superhero",
  },
  {
    id: "trending-3",
    title: "Mr. & Mrs. Smith",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Mr+Mrs+Smith+Trending",
    badge: "#3 TRENDING",
    isPrime: true,
    year: 2024,
    duration: "55m",
    rating: "8.1",
    genre: "Action",
  },
  {
    id: "trending-4",
    title: "The Marvelous Mrs. Maisel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Mrs+Maisel+Trending",
    badge: "#4 TRENDING",
    isPrime: true,
    year: 2023,
    duration: "52m",
    rating: "8.7",
    genre: "Comedy-Drama",
  },
  {
    id: "trending-5",
    title: "Jack Ryan",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Jack+Ryan+Trending",
    badge: "#5 TRENDING",
    isPrime: true,
    year: 2023,
    duration: "1h 8m",
    rating: "8.0",
    genre: "Action",
  },
]

const risingStars: ContentItem[] = [
  {
    id: "rising-1",
    title: "The Power",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Power+Rising",
    badge: "RISING FAST",
    isPrime: true,
    year: 2024,
    duration: "58m",
    rating: "7.6",
    genre: "Drama",
  },
  {
    id: "rising-2",
    title: "Citadel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Citadel+Rising",
    badge: "RISING FAST",
    isPrime: true,
    year: 2023,
    duration: "58m",
    rating: "6.5",
    genre: "Spy",
  },
  {
    id: "rising-3",
    title: "The Wheel of Time",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Wheel+Time+Rising",
    badge: "RISING FAST",
    isPrime: true,
    year: 2023,
    duration: "1h 5m",
    rating: "7.1",
    genre: "Fantasy",
  },
  {
    id: "rising-4",
    title: "Upload",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Upload+Rising",
    badge: "RISING FAST",
    isPrime: true,
    year: 2022,
    duration: "30m",
    rating: "7.8",
    genre: "Sci-Fi",
  },
  {
    id: "rising-5",
    title: "The Terminal List",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Terminal+List+Rising",
    badge: "RISING FAST",
    isPrime: true,
    year: 2022,
    duration: "1h 0m",
    rating: "7.9",
    genre: "Thriller",
  },
]

export default function TrendingPage() {
  return (
    <div className="pt-20 page-transition">
      <Suspense fallback={<LoadingSkeleton type="hero" />}>
        <FeaturedBanner content={featuredTrending} />
      </Suspense>

      <div className="py-12 space-y-12">
        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Trending This Week" items={trendingThisWeek} seeMoreLink="/trending/week" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Popular Movies" items={popularMovies} seeMoreLink="/movies/popular" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Popular TV Shows" items={topTVShows} seeMoreLink="/tv-shows/popular" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Rising Stars" items={risingStars} seeMoreLink="/trending/rising" />
        </Suspense>
      </div>
    </div>
  )
}
