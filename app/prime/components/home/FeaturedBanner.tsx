"use client"

import Image from "next/image"
import { Play, Plus, Info, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { FeaturedContent } from "@/lib/types"
import { useState, useEffect, useRef } from "react"

interface FeaturedBannerProps {
  content: FeaturedContent
}

// Multiple featured content items for the carousel
const featuredCarousel: FeaturedContent[] = [
  {
    id: "featured-1",
    title: "THE TRAITORS",
    description:
      "Season 1 · Welcome to The Traitors — a ruthless reality show hosted by Karan Johar, where 20 celebrities betray and deceive each other for a chance to win a massive cash prize. Trust no one.",
    backgroundImage: "/placeholder.svg?height=800&width=1400&text=THE+TRAITORS+Hero+Banner",
    episodeInfo: "NEW EPISODES THURSDAY 8 PM",
    newEpisodeInfo: "New episode Thursday",
    imdbRating: "8.2",
    year: 2024,
    rating: "TV-MA",
    duration: "8 episodes",
  },
  {
    id: "featured-2",
    title: "FALLOUT",
    description:
      "Based on one of the greatest video game series of all time, Fallout is the story of haves and have-nots in a world in which there's almost nothing left to have. 200 years after the apocalypse, the gentle denizens of luxury fallout shelters are forced to return to the irradiated hellscape their ancestors left behind.",
    backgroundImage: "/placeholder.svg?height=800&width=1400&text=FALLOUT+Hero+Banner",
    episodeInfo: "NOW STREAMING",
    newEpisodeInfo: "All episodes available",
    imdbRating: "8.6",
    year: 2024,
    rating: "TV-MA",
    duration: "1 Season",
  },
  {
    id: "featured-3",
    title: "MR. & MRS. SMITH",
    description:
      "Two strangers land jobs with a spy agency that offers them a glorious life of espionage, wealth, world travel, and a dream house in the suburbs. What they don't know is that they're actually married to each other, as part of a highly classified and dangerous mission.",
    backgroundImage: "/placeholder.svg?height=800&width=1400&text=MR+%26+MRS+SMITH+Hero+Banner",
    episodeInfo: "NOW STREAMING",
    newEpisodeInfo: "Complete series available",
    imdbRating: "7.2",
    year: 2024,
    rating: "TV-MA",
    duration: "1 Season",
  },
  {
    id: "featured-4",
    title: "THE BOYS",
    description:
      "Season 4 · A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers. This dark, satirical take on the superhero genre pushes boundaries with its brutal action and sharp social commentary.",
    backgroundImage: "/placeholder.svg?height=800&width=1400&text=THE+BOYS+Hero+Banner",
    episodeInfo: "SEASON 4 NOW STREAMING",
    newEpisodeInfo: "New season available",
    imdbRating: "8.7",
    year: 2024,
    rating: "TV-MA",
    duration: "4 Seasons",
  },
  {
    id: "featured-5",
    title: "THE POWER",
    description:
      "Based on the award-winning novel, The Power is set in a world where women develop the ability to release electrical jolts from their hands. This newfound power shifts the global balance of power and changes everything we know about gender dynamics.",
    backgroundImage: "/placeholder.svg?height=800&width=1400&text=THE+POWER+Hero+Banner",
    episodeInfo: "NOW STREAMING",
    newEpisodeInfo: "Complete series available",
    imdbRating: "7.6",
    year: 2024,
    rating: "TV-MA",
    duration: "1 Season",
  },
]

export default function FeaturedBanner({ content }: FeaturedBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const totalSlides = featuredCarousel.length
  const currentContent = featuredCarousel[currentSlide]

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (slideIndex: number) => {
    if (isTransitioning || slideIndex === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(slideIndex)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide()
      }, 6000) // 6 seconds per slide
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPaused, currentSlide])

  return (
    <div
      className="relative h-[85vh] min-h-[700px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Transition */}
      <div className="absolute inset-0">
        <Image
          key={currentContent.id}
          src={currentContent.backgroundImage || "/placeholder.svg"}
          alt={currentContent.title}
          fill
          className={`object-cover transition-all duration-500 ease-in-out ${
            isTransitioning ? "scale-110 opacity-80" : "scale-105 opacity-100"
          }`}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E]/95 via-[#0F171E]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F171E]/60" />
      </div>

      {/* Content with Transition */}
      <div className="relative z-10 flex items-center h-full px-8 md:px-16">
        <div
          className={`max-w-3xl hero-content transition-all duration-500 ease-in-out ${
            isTransitioning ? "opacity-0 transform translate-x-8" : "opacity-100 transform translate-x-0"
          }`}
        >
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00A8E1] to-[#1FB6FF] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">prime</span>
              </div>
              <span className="text-[#00A8E1] font-semibold uppercase tracking-wider text-sm">Original Series</span>
            </div>
          </div>

          <div className="text-6xl md:text-8xl font-black mb-6 text-white tracking-tight leading-none bg-gradient-to-r from-white to-gray-200 bg-clip-text">
            {currentContent.title}
          </div>

          {currentContent.newEpisodeInfo && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm rounded-full shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                {currentContent.newEpisodeInfo}
              </span>
            </div>
          )}

          {currentContent.episodeInfo && (
            <div className="mb-6">
              <span className="text-white text-xl font-bold">{currentContent.episodeInfo}</span>
            </div>
          )}

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">{currentContent.imdbRating || "8.2"}</span>
              <span className="text-gray-400">IMDb</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-300">
              <span>{currentContent.year || "2024"}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="px-2 py-1 bg-gray-700/80 rounded text-sm font-medium">
                {currentContent.rating || "TV-MA"}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{currentContent.duration || "8 episodes"}</span>
            </div>
          </div>

          <div className="text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl">{currentContent.description}</div>

          <div className="flex items-center space-x-4 mb-8">
            <Link
              href={`/watch/${currentContent.id}`}
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

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 md:left-8 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 md:right-8 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Enhanced carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {featuredCarousel.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
              currentSlide === index ? "w-12 h-2 bg-white shadow-lg" : "w-4 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  )
}
