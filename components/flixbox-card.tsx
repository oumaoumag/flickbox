"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Movie, TVShow } from "@/types/media"
import { useWatchlist } from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"
import { tmdbService } from "@/services/tmdb-service"
import { TrailerModal } from "@/components/trailer-modal"

interface NetflixCardProps {
  item: Movie | TVShow
  type: "movie" | "tv" | "mixed"
}

export function NetflixCard({ item, type }: NetflixCardProps) {
  const router = useRouter()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)

  // Determine the actual media type
  const actualType = type === "mixed" ? ((item as any).title ? "movie" : "tv") : type

  useEffect(() => {
    const fetchTrailer = async () => {
      if (isHovered && !trailerKey) {
        try {
          const details =
            actualType === "movie" ? await tmdbService.getMovieDetails(item.id) : await tmdbService.getTVShowDetails(item.id)

          const trailer = details.videos.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

          if (trailer) {
            setTrailerKey(trailer.key)
          }
        } catch (error) {
          console.error("Error fetching trailer:", error)
        }
      }
    }

    fetchTrailer()
  }, [isHovered, item.id, actualType, trailerKey])

  const isInList = isInWatchlist(item.id, actualType)
  const title = (item as any).title || (item as any).name || "Unknown Title"
  const year =
    (item as any).release_date || (item as any).first_air_date ? new Date((item as any).release_date || (item as any).first_air_date!).getFullYear() : null

  const handleCardClick = () => {
    router.push(`/${actualType}/${item.id}`)
  }

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInList) {
      removeFromWatchlist(item.id, actualType)
    } else {
      addToWatchlist({ ...item, media_type: actualType })
    }
  }

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/placeholder.svg"

  return (
    <div
      className="netflix-card cursor-pointer w-64 md:w-72"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Main Image */}
        <div className="aspect-video bg-gray-800 rounded-md overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 netflix-gradient flex items-end p-4">
              <div className="w-full">
                <h3 className="text-white font-bold text-lg mb-2 netflix-text-shadow">{title}</h3>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 mb-3">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 rounded-full w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick()
                    }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "rounded-full w-8 h-8 p-0 border-2 border-gray-400 hover:border-white",
                      isInList ? "bg-white text-black" : "text-white",
                    )}
                    onClick={handleWatchlistToggle}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full w-8 h-8 p-0 border-2 border-gray-400 hover:border-white text-white"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full w-8 h-8 p-0 border-2 border-gray-400 hover:border-white text-white ml-auto"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* Info */}
                <div className="flex items-center space-x-2 text-sm">
                  {item.vote_average > 0 && (
                    <span className="text-green-400 font-bold">{Math.round(item.vote_average * 10)}% Match</span>
                  )}

                  {year && <span className="text-gray-300">{year}</span>}

                  <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                    HD
                  </Badge>
                </div>

                {/* Genres */}
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-300">
                  <span>{actualType === "movie" ? "Movie" : "Series"}</span>
                  <span>•</span>
                  <span>Drama</span>
                  <span>•</span>
                  <span>Thriller</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerKey && (
        <TrailerModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          videoKey={trailerKey}
          title={title}
        />
      )}
    </div>
  )
}
