"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NetflixCard } from "@/components/flixbox-card"
import type { Movie, TVShow } from "@/types/media"
import { cn } from "@/lib/utils"

interface NetflixRowProps {
  title: string
  items: (Movie | TVShow)[]
  type: "movie" | "tv" | "mixed"
  className?: string
}

export function NetflixRow({ title, items, type, className }: NetflixRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={cn("relative group mb-8", className)}>
      {/* Row Title */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-8">
        {title}
      </h2>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <NetflixCard item={item} type={type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
