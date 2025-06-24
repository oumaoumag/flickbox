"use client"

import { useState, useEffect } from "react"
import type { WatchlistItem } from "@/types/media"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

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

  const addToWatchlist = (item: any) => {
    // Convert MediaDetails to WatchlistItem format
    const watchlistItem: WatchlistItem = {
      id: item.id,
      title: item.title,
      name: item.name,
      overview: item.overview,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      vote_average: item.vote_average,
      vote_count: item.vote_count,
      popularity: item.popularity,
      // Convert genres array to genre_ids array if needed
      genre_ids: item.genre_ids || (item.genres ? item.genres.map((g: any) => g.id) : []),
      media_type: item.media_type,
      // Add watchlist-specific properties
      added_at: new Date().toISOString(),
      watched: false
    }

    const newWatchlist = [...watchlist, watchlistItem]
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

  const toggleWatched = (id: number, type: "movie" | "tv") => {
    const newWatchlist = watchlist.map(item => {
      if (item.id === id && item.media_type === type) {
        return { ...item, watched: !item.watched }
      }
      return item
    })
    setWatchlist(newWatchlist)
    localStorage.setItem("flickbox-watchlist", JSON.stringify(newWatchlist))
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatched
  }
}
