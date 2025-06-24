"use client"

import type { Movie, TVShow } from "@/types/media"
import { MediaCard } from "@/components/media-card"

interface MovieGridProps {
  items: (Movie | TVShow)[]
  type?: "movie" | "tv" | "mixed"
  variant?: "default" | "compact"
}

export function MovieGrid({ items, type = "mixed", variant = "default" }: MovieGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No items found</p>
      </div>
    )
  }

  return (
    <div
      className={`grid gap-6 ${
        variant === "compact"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      }`}
    >
      {items.map((item) => {
        const mediaType = type === "mixed" ? item.media_type || "movie" : type
        return (
          <MediaCard 
            key={`${item.id}-${mediaType}`} 
            item={item} 
            type={mediaType as "movie" | "tv"} 
            variant={variant} 
          />
        )
      })}
    </div>
  )
}
