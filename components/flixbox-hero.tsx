"use client"

import { useState, useEffect } from "react"
import { Play, Info, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Movie, TVShow } from "@/types/media"
import { useWatchlist } from "@/hooks/use-watchlist"
import { TrailerButton } from "@/components/trailer-button"
import { cn } from "@/lib/utils"

interface NetflixHeroProps {
  item: Movie | TVShow
  type: "movie" | "tv" | "mixed"
}

export function NetflixHero({ item, type }: NetflixHeroProps) {
  const { addToWatchlist, isInWatchlist } = useWatchlist()
  const [isMuted, setIsMuted] = useState(true)
  const [showVideo, setShowVideo] = useState(false)

  // Determine the actual media type
  const actualType = type === "mixed" ? ((item as any).title ? "movie" : "tv") : type
  const title = (item as any).title || (item as any).name || "Unknown Title"
  const year =
    (item as any).release_date || (item as any).first_air_date ? new Date((item as any).release_date || (item as any).first_air_date!).getFullYear() : null

  const isInList = isInWatchlist(item.id, actualType)

  const handleWatchlistToggle = () => {
    if (!isInList) {
      addToWatchlist({ ...item, media_type: actualType })
    }
  }

  const backdropUrl = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : "/placeholder.svg"

  // Auto-play video after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 netflix-hero-gradient" />
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            {/* Netflix Original Badge */}
            <div className="mb-4">
              <Badge variant="outline" className="bg-netflix-red border-netflix-red text-white text-sm font-bold px-3 py-1">
                FLICKBOX ORIGINAL
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 netflix-text-shadow">
              {title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center space-x-4 mb-6 text-white">
              {item.vote_average > 0 && (
                <div className="flex items-center">
                  <span className="text-green-400 font-bold text-lg">
                    {Math.round(item.vote_average * 10)}% Match
                  </span>
                </div>
              )}
              
              {year && (
                <span className="text-lg font-medium">{year}</span>
              )}
              
              <Badge variant="outline" className="border-gray-400 text-gray-300">
                {actualType === "movie" ? "Movie" : "Series"}
              </Badge>
              
              <Badge variant="outline" className="border-gray-400 text-gray-300">
                HD
              </Badge>
              
              <Badge variant="outline" className="border-gray-400 text-gray-300">
                5.1
              </Badge>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white mb-8 leading-relaxed netflix-text-shadow max-w-xl">
              {item.overview || "No description available."}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mb-8">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 text-lg"
              >
                <Play className="w-6 h-6 mr-2 fill-current" />
                Play
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="netflix-button text-white font-bold px-8 py-3 text-lg"
                onClick={handleWatchlistToggle}
              >
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>

              <TrailerButton
                itemId={item.id}
                mediaType={actualType}
                title={title}
                variant="hero"
                className="netflix-button text-white font-bold px-8 py-3 text-lg"
              />
            </div>

            {/* Additional Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span>Starring:</span>
                <span>Cast information loading...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="absolute bottom-24 right-8">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full w-12 h-12 border-2 border-gray-400 hover:border-white text-white"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>
        </div>

        {/* Age Rating */}
        <div className="absolute bottom-24 left-8">
          <div className="bg-gray-800 bg-opacity-80 px-3 py-1 rounded text-white text-sm font-bold">
            PG-13
          </div>
        </div>
      </div>
    </div>
  )
}
