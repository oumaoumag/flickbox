"use client"

import { useState } from "react"
import { Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrailerModal } from "@/components/trailer-modal"
import { tmdbService } from "@/services/tmdb-service"

interface TrailerButtonProps {
  itemId: number
  mediaType: "movie" | "tv"
  title: string
  variant?: "default" | "hero" | "compact"
  className?: string
}

export function TrailerButton({ itemId, mediaType, title, variant = "default", className = "" }: TrailerButtonProps) {
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchTrailer = async () => {
    if (trailerKey || loading) return

    try {
      setLoading(true)
      const details =
        mediaType === "movie" ? await tmdbService.getMovieDetails(itemId) : await tmdbService.getTVShowDetails(itemId)

      const trailer = details.videos.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

      if (trailer) {
        setTrailerKey(trailer.key)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error("Error fetching trailer:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = () => {
    if (trailerKey) {
      setShowTrailerModal(true)
    } else if (!loading && !error) {
      fetchTrailer()
    }
  }

  if (error) return null

  const getButtonProps = () => {
    switch (variant) {
      case "hero":
        return {
          size: "lg" as const,
          className: `bg-white/10 border-white/20 text-white hover:bg-white/20 ${className}`,
        }
      case "compact":
        return {
          size: "sm" as const,
          className: `bg-white text-black hover:bg-gray-200 rounded-full ${className}`,
        }
      default:
        return {
          size: "default" as const,
          className: `bg-primary hover:bg-primary/90 text-primary-foreground ${className}`,
        }
    }
  }

  const buttonProps = getButtonProps()

  return (
    <>
      <Button {...buttonProps} onClick={handleClick} disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
        {loading ? "Loading..." : "Watch Trailer"}
      </Button>

      {trailerKey && (
        <TrailerModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          videoKey={trailerKey}
          title={title}
        />
      )}
    </>
  )
}
