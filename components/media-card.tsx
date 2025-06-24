"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Calendar, Heart, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Movie, TVShow } from "@/types/media"
import { useWatchlist } from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  item: Movie | TVShow
  type: "movie" | "tv"
  variant?: "default" | "compact"
}

export function MediaCard({ item, type, variant = "default" }: MediaCardProps) {
  const router = useRouter()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [imageLoaded, setImageLoaded] = useState(false)

  const isInList = isInWatchlist(item.id, type)
  const title = item.title || item.name || "Unknown Title"
  const releaseDate = item.release_date || item.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null

  const handleCardClick = () => {
    router.push(`/${type}/${item.id}`)
  }

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInList) {
      removeFromWatchlist(item.id, type)
    } else {
      addToWatchlist({ ...item, media_type: type })
    }
  }

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/placeholder.svg?height=600&width=400"

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Poster Image */}
        <div className={cn(
          "relative overflow-hidden rounded-t-lg bg-gray-200",
          variant === "compact" ? "aspect-[2/3]" : "aspect-[2/3]"
        )}>
          <img
            src={posterUrl}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick()
                }}
              >
                <Play className="w-4 h-4 mr-1" />
                Play
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "bg-white/10 border-white/20 text-white hover:bg-white/20",
                  isInList && "bg-green-600 hover:bg-green-700"
                )}
                onClick={handleWatchlistToggle}
              >
                <Heart className={cn("w-4 h-4", isInList && "fill-current")} />
              </Button>
            </div>
          </div>

          {/* Rating Badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500 text-black">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {item.vote_average.toFixed(1)}
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center space-x-2">
              {year && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {year}
                </div>
              )}
              <Badge variant="outline" className="text-xs">
                {type === "movie" ? "Movie" : "TV Show"}
              </Badge>
            </div>
          </div>

          {variant !== "compact" && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.overview || "No description available."}
            </p>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
