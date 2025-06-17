"use client"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ContentCard } from "./content-card"
import type { ContentRow as ContentRowType } from "@/lib/types"

interface ContentRowProps {
  row: ContentRowType
}

export function ContentRow({ row }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" })
    }
  }

  return (
    <div className="mb-10 group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#ff6404] font-bold text-xl">{row.title}</h2>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={scrollLeft}
            className="p-2 bg-gray-800/80 hover:bg-[#ff6404] text-white hover:text-black rounded-full transition-all duration-300 hover:scale-110 transform-gpu"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 bg-gray-800/80 hover:bg-[#ff6404] text-white hover:text-black rounded-full transition-all duration-300 hover:scale-110 transform-gpu"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {row.items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
