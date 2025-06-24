"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Movie, TVShow } from "@/types/media"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface NetflixOriginalsProps {
  title: string
  items: (Movie | TVShow)[]
  type: "movie" | "tv" | "mixed"
  className?: string
}

export function NetflixOriginals({ title, items, type, className }: NetflixOriginalsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
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
    <div className={cn("relative group mb-12", className)}>
      {/* Row Title */}
      <div className="flex items-center mb-6 px-4 md:px-8">
        <Badge variant="outline" className="bg-netflix-red border-netflix-red text-white text-sm font-bold px-3 py-1 mr-4">
          FLICKBOX ORIGINALS
        </Badge>
        <h2 className="text-white text-xl md:text-2xl font-bold">
          {title}
        </h2>
      </div>

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

        {/* Cards Container - Larger cards for originals */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <OriginalCard key={item.id} item={item} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface OriginalCardProps {
  item: Movie | TVShow
  type: "movie" | "tv" | "mixed"
}

function OriginalCard({ item, type }: OriginalCardProps) {
  const router = useRouter()
  
  // Determine the actual media type
  const actualType = type === "mixed" ? ('title' in item ? "movie" : "tv") : type
  const title = ('title' in item ? item.title : item.name) || "Unknown Title"
  const year = (() => {
    const date = 'release_date' in item ? item.release_date : item.first_air_date
    return date ? new Date(date).getFullYear() : null
  })()

  const handleClick = () => {
    router.push(`/${actualType}/${item.id}`)
  }

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/placeholder.svg"

  return (
    <div
      className="netflix-card cursor-pointer w-80 md:w-96"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Main Image - Larger for originals */}
        <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 netflix-gradient opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Netflix Original Badge */}
              <Badge variant="outline" className="bg-netflix-red border-netflix-red text-white text-xs font-bold px-2 py-1 mb-3">
                FLICKBOX ORIGINAL
              </Badge>

              <h3 className="text-white font-bold text-xl mb-2 netflix-text-shadow">{title}</h3>

              {/* Info */}
              <div className="flex items-center space-x-2 text-sm mb-3">
                {item.vote_average > 0 && (
                  <span className="text-green-400 font-bold">{Math.round(item.vote_average * 10)}% Match</span>
                )}

                {year && <span className="text-gray-300">{year}</span>}

                <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                  HD
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                {item.overview || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
