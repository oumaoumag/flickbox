"use client"

import { useState, useEffect } from "react"
import type { MediaItem } from "@/types/media"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<MediaItem[]>([])

  useEffect(() => {
    // Loading watchlist from localStorage on mount
    const saved = localStorage.getItem("flickbox-watchlist")
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading watchlist:", error)
      }
    }
  }, [])

  const addToWatchlist = (item: MediaItem) => {
    const newWatchlist = [...watchlist, item]
    setWatchlist(newWatchlist)
    localStorage.setItem("flickbox-watchlist", JSON.stringify(newWatchlist))
  }

  const removeFromWatchlist = (id: number, type: "movie" | "tv") => {
    const newWatchlist = watchlist.filter(item => 
      !(item.id === id && item.media_type === type)
    )
    setWatchlist(newWatchlist)
    localStorage.setItem("flickbox-watchlist", JSON.stringify(newWatchlist))
  }

  const isInWatchlist = (id: number, type: "movie" | "tv") => {
    return watchlist.some(item => item.id === id && item.media_type === type)
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  }
}
