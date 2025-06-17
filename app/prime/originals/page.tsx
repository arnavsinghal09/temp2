import { Suspense } from "react"
import type { Metadata } from "next"
import ContentRow from "@/components/home/ContentRow"
import FeaturedBanner from "@/components/home/FeaturedBanner"
import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import { featuredOriginals } from "@/lib/data/mockData"
import type { FeaturedContent, ContentItem } from "@/lib/types"

export const metadata: Metadata = {
  title: "Prime Originals - Exclusive Content",
  description: "Discover award-winning Prime Video original series and movies",
}

const featuredOriginal: FeaturedContent = {
  id: "featured-original-1",
  title: "THE BOYS",
  description:
    "Season 4 · A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers. This dark, satirical take on the superhero genre pushes boundaries with its brutal action and sharp social commentary.",
  backgroundImage: "/placeholder.svg?height=800&width=1400&text=THE+BOYS+Original+Series",
  episodeInfo: "PRIME ORIGINAL SERIES",
  newEpisodeInfo: "All Episodes Available",
  imdbRating: "8.7",
  year: 2024,
  rating: "TV-MA",
  duration: "4 seasons",
}

const awardWinningOriginals: ContentItem[] = [
  {
    id: "award-1",
    title: "The Marvelous Mrs. Maisel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Mrs+Maisel+Award",
    badge: "EMMY WINNER",
    isPrime: true,
    year: 2023,
    duration: "5 seasons",
    rating: "8.7",
    genre: "Comedy-Drama",
  },
  {
    id: "award-2",
    title: "Fleabag",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Fleabag+Award",
    badge: "EMMY WINNER",
    isPrime: true,
    year: 2019,
    duration: "2 seasons",
    rating: "8.7",
    genre: "Comedy",
  },
  {
    id: "award-3",
    title: "The Power",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Power+Original",
    badge: "CRITICS CHOICE",
    isPrime: true,
    year: 2023,
    duration: "1 season",
    rating: "7.6",
    genre: "Sci-Fi",
  },
  {
    id: "award-4",
    title: "Manchester by the Sea",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Manchester+Sea",
    badge: "OSCAR WINNER",
    isPrime: true,
    year: 2016,
    duration: "2h 17m",
    rating: "7.8",
    genre: "Drama",
  },
  {
    id: "award-5",
    title: "Sound of Metal",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Sound+Metal+Award",
    badge: "OSCAR WINNER",
    isPrime: true,
    year: 2020,
    duration: "2h 0m",
    rating: "7.7",
    genre: "Drama",
  },
]

const newOriginals: ContentItem[] = [
  {
    id: "new-orig-1",
    title: "Fallout",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Fallout+New",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2024,
    duration: "1 season",
    rating: "8.4",
    genre: "Sci-Fi",
  },
  {
    id: "new-orig-2",
    title: "Mr. & Mrs. Smith",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Mr+Mrs+Smith+New",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2024,
    duration: "1 season",
    rating: "8.1",
    genre: "Action",
  },
  {
    id: "new-orig-3",
    title: "The Power",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Power+New",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2024,
    duration: "1 season",
    rating: "7.6",
    genre: "Drama",
  },
  {
    id: "new-orig-4",
    title: "Citadel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Citadel+New",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2023,
    duration: "1 season",
    rating: "6.5",
    genre: "Spy",
  },
  {
    id: "new-orig-5",
    title: "Daisy Jones & The Six",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Daisy+Jones",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2023,
    duration: "1 season",
    rating: "8.0",
    genre: "Music",
  },
]

export default function OriginalsPage() {
  return (
    <div className="pt-20 page-transition">
      <Suspense fallback={<LoadingSkeleton type="hero" />}>
        <FeaturedBanner content={featuredOriginal} />
      </Suspense>

      <div className="py-12 space-y-12">
        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="Award-Winning Originals" items={awardWinningOriginals} seeMoreLink="/originals/awards" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="All Prime Originals" items={featuredOriginals} seeMoreLink="/originals/all" />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow title="New Original Series" items={newOriginals} seeMoreLink="/originals/new" />
        </Suspense>
      </div>
    </div>
  )
}
