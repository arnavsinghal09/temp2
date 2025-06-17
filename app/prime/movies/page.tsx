import { Suspense } from "react"
import type { Metadata } from "next"
import ContentRow from "@/components/home/ContentRow"
import FeaturedBanner from "@/components/home/FeaturedBanner"
import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import { popularMovies, recentlyAdded } from "@/lib/data/mockData"
import type { FeaturedContent, ContentItem } from "@/lib/types"

export const metadata: Metadata = {
  title: "Movies - Stream Latest Films",
  description: "Discover the latest movies, blockbusters, and award-winning films on PrimeClone",
}

// Movie-specific content
const featuredMovie: FeaturedContent = {
  id: "featured-movie-1",
  title: "THE TOMORROW WAR",
  description:
    "A family man is drafted to fight in a future war where the fate of humanity relies on his ability to confront the past. Starring Chris Pratt in this action-packed sci-fi thriller that will keep you on the edge of your seat.",
  backgroundImage: "/placeholder.svg?height=800&width=1400&text=THE+TOMORROW+WAR+Hero",
  episodeInfo: "AVAILABLE NOW",
  newEpisodeInfo: "New on Prime",
  imdbRating: "6.5",
  year: 2021,
  rating: "PG-13",
  duration: "2h 18m",
}

const actionMovies: ContentItem[] = [
  {
    id: "action-1",
    title: "Nobody",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Nobody+Action",
    badge: "TOP 10",
    isPrime: true,
    year: 2021,
    duration: "1h 32m",
    rating: "7.4",
    genre: "Action",
  },
  {
    id: "action-2",
    title: "The Accountant",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Accountant",
    isPrime: true,
    year: 2016,
    duration: "2h 8m",
    rating: "7.3",
    genre: "Action",
  },
  {
    id: "action-3",
    title: "John Wick",
    thumbnail: "/placeholder.svg?height=315&width=560&text=John+Wick",
    badge: "TOP 10",
    isPrime: true,
    year: 2014,
    duration: "1h 41m",
    rating: "7.4",
    genre: "Action",
  },
  {
    id: "action-4",
    title: "Mad Max: Fury Road",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Mad+Max+Fury+Road",
    isPrime: true,
    year: 2015,
    duration: "2h 0m",
    rating: "8.1",
    genre: "Action",
  },
  {
    id: "action-5",
    title: "Atomic Blonde",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Atomic+Blonde",
    isPrime: true,
    year: 2017,
    duration: "1h 55m",
    rating: "6.7",
    genre: "Action",
  },
]

const comedyMovies: ContentItem[] = [
  {
    id: "comedy-1",
    title: "Coming 2 America",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Coming+2+America",
    badge: "NEW",
    isPrime: true,
    year: 2021,
    duration: "1h 50m",
    rating: "5.3",
    genre: "Comedy",
  },
  {
    id: "comedy-2",
    title: "The Grand Budapest Hotel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Grand+Budapest+Hotel",
    isPrime: true,
    year: 2014,
    duration: "1h 39m",
    rating: "8.1",
    genre: "Comedy",
  },
  {
    id: "comedy-3",
    title: "Knives Out",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Knives+Out",
    badge: "TOP 10",
    isPrime: true,
    year: 2019,
    duration: "2h 10m",
    rating: "7.9",
    genre: "Comedy",
  },
  {
    id: "comedy-4",
    title: "Palm Springs",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Palm+Springs",
    isPrime: true,
    year: 2020,
    duration: "1h 30m",
    rating: "7.4",
    genre: "Comedy",
  },
  {
    id: "comedy-5",
    title: "The Nice Guys",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Nice+Guys",
    isPrime: true,
    year: 2016,
    duration: "1h 56m",
    rating: "7.4",
    genre: "Comedy",
  },
]

const dramaMovies: ContentItem[] = [
  {
    id: "drama-1",
    title: "Manchester by the Sea",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Manchester+by+Sea",
    isPrime: true,
    year: 2016,
    duration: "2h 17m",
    rating: "7.8",
    genre: "Drama",
  },
  {
    id: "drama-2",
    title: "The Power of the Dog",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Power+of+Dog",
    badge: "AWARD WINNER",
    isPrime: true,
    year: 2021,
    duration: "2h 8m",
    rating: "6.8",
    genre: "Drama",
  },
  {
    id: "drama-3",
    title: "Sound of Metal",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Sound+of+Metal",
    badge: "AWARD WINNER",
    isPrime: true,
    year: 2020,
    duration: "2h 0m",
    rating: "7.7",
    genre: "Drama",
  },
  {
    id: "drama-4",
    title: "Moonlight",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Moonlight+Movie",
    isPrime: true,
    year: 2016,
    duration: "1h 51m",
    rating: "7.4",
    genre: "Drama",
  },
  {
    id: "drama-5",
    title: "Lady Bird",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Lady+Bird",
    isPrime: true,
    year: 2017,
    duration: "1h 34m",
    rating: "7.4",
    genre: "Drama",
  },
]

export default function MoviesPage() {
  return (
    <div className="pt-20 page-transition">
      <Suspense fallback={<LoadingSkeleton type="hero" />}>
        <FeaturedBanner content={featuredMovie} />
      </Suspense>

      <div className="py-12 space-y-12">
        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Popular Movies" items={popularMovies} seeMoreLink="/movies/popular" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Action & Adventure" items={actionMovies} seeMoreLink="/movies/action" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Comedy Movies" items={comedyMovies} seeMoreLink="/movies/comedy" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Award-Winning Dramas" items={dramaMovies} seeMoreLink="/movies/drama" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Recently Added Movies" items={recentlyAdded} seeMoreLink="/movies/recent" />
        </Suspense>
      </div>
    </div>
  )
}
