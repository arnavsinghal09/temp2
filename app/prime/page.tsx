"use client"
import { useStorageListener } from "./hooks/use-storage-listener"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrimeAuthStore } from "./lib/stores/auth"
import { PrimeUserDataService } from "./lib/services/user-data"
import FeaturedBanner from "./components/home/FeaturedBanner"
import ContentRow from "./components/ContentRow"
import LoadingSkeleton from "./components/ui/LoadingSkeleton"
import {
  featuredContent,
  recentlyAdded,
  featuredOriginals,
  popularMovies,
  topTVShows,
} from "./lib/mockData"
import type { Metadata } from "next"

const metadata: Metadata = {
  title: "Home - Stream Your Favorite Content",
  description:
    "Discover trending movies, TV shows, and exclusive originals on Prime Video",
}

export default function HomePage() {
  const router = useRouter()
  const { user, setUser } = usePrimeAuthStore()

  // Add storage listener for prime-user changes
  const { timestamp } = useStorageListener("prime-user")

  useEffect(() => {
    console.log('Prime Home: Storage change detected, reinitializing user data')

    // Clear current user first
    if (user) {
      setUser(null)
    }

    // Initialize user data from FireStories
    const completeUserData = PrimeUserDataService.initializeFromFireStories()

    if (completeUserData) {
      setUser(completeUserData)
      console.log('Prime Home: User initialized/updated:', {
        user: completeUserData.name,
        friends: completeUserData.friends?.length || 0,
        campfires: completeUserData.campfires?.length || 0
      })
    } else {
      // If no user data available, redirect to main app
      console.log('Prime Home: No user data found, redirecting to FireStories')
      router.push("/")
      return
    }
  }, [timestamp, setUser, router]) // React to storage changes via timestamp


  // Show loading if user is not initialized
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F171E] pt-20">
        <LoadingSkeleton type="hero" />
        <div className="py-12 space-y-12">
          <LoadingSkeleton type="row" />
          <LoadingSkeleton type="row" />
          <LoadingSkeleton type="row" />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 page-transition">
      <FeaturedBanner content={featuredContent} />

      <div className="py-12 space-y-12">
        <ContentRow
          title="Featured Originals"
          items={featuredOriginals}
          seeMoreLink="#"
        />

        <ContentRow
          title="Trending Now"
          items={popularMovies}
          seeMoreLink="#"
        />

        <ContentRow
          title="Popular TV Shows"
          items={topTVShows}
          seeMoreLink="#"
        />

        <ContentRow
          title="Recently Added"
          items={recentlyAdded}
          seeMoreLink="#"
        />
      </div>
    </div>
  )
}
