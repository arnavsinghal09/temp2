"use client"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { heroContent } from "@/lib/data"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroContent.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroContent.length) % heroContent.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const handlePrevClick = () => {
    prevSlide()
    setIsAutoPlaying(false)
  }

  const handleNextClick = () => {
    nextSlide()
    setIsAutoPlaying(false)
  }

  const currentHero = heroContent[currentSlide]

  return (
    <div
      className="relative h-96 overflow-hidden rounded-lg mb-6 group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />

      {/* Background images for all slides */}
      {heroContent.map((hero, index) => (
        <img
          key={hero.id}
          src={hero.background || "/placeholder.svg"}
          alt={hero.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform-gpu",
            index === currentSlide ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {/* Navigation arrows */}
      <button
        onClick={handlePrevClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 transform-gpu opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 transform-gpu opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative z-20 p-8 h-full flex flex-col justify-end">
        <h1 className="text-5xl font-bold text-[#ff6404] mb-2 tracking-wider animate-slide-up">{currentHero.title}</h1>
        <p className="text-white text-lg mb-4 font-medium animate-slide-up-delay-1">{currentHero.subtitle}</p>
        <p className="text-gray-300 text-sm mb-6 max-w-md leading-relaxed animate-slide-up-delay-2">
          {currentHero.description}
        </p>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-500 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 w-fit animate-slide-up-delay-3 transform-gpu">
          Learn More
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-8 z-20 flex space-x-3">
        {heroContent.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-500 transform-gpu focus:outline-none focus:ring-2 focus:ring-white/50",
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70 hover:scale-110",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute bottom-4 right-8 z-20">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isAutoPlaying ? "bg-[#ff6404] animate-pulse" : "bg-gray-500",
          )}
        />
      </div>
    </div>
  )
}
