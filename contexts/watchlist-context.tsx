"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { WatchlistItem } from "@/types/media"
import { useToast } from "@/hooks/use-toast"

interface WatchlistContextType {
  watchlist: WatchlistItem[]
  addToWatchlist: (item: any) => void
  removeFromWatchlist: (id: number, mediaType: "movie" | "tv") => void
  toggleWatched: (id: number, mediaType: "movie" | "tv") => void
  isInWatchlist: (id: number, mediaType: "movie" | "tv") => boolean
  getWatchedItems: () => WatchlistItem[]
  getUnwatchedItems: () => WatchlistItem[]
  clearWatchlist: () => void
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const { toast } = useToast()

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("flickbox-watchlist")
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading watchlist:", error)
      }
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("flickbox-watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (item: any) => {
    const watchlistItem: WatchlistItem = {
      ...item,
      added_at: new Date().toISOString(),
      watched: false,
    }

    // Check if item already exists before updating state
    const exists = watchlist.some((w) => w.id === item.id && w.media_type === item.media_type)
    if (exists) {
      toast({
        title: "Already in watchlist",
        description: `${item.title || item.name} is already in your watchlist.`,
      })
      return
    }

    setWatchlist((prev) => [watchlistItem, ...prev])
    
    // Show success toast after state update
    toast({
      title: "Added to watchlist",
      description: `${item.title || item.name} has been added to your watchlist.`,
    })
  }

  const removeFromWatchlist = (id: number, mediaType: "movie" | "tv") => {
    const item = watchlist.find((w) => w.id === id && w.media_type === mediaType)
    
    setWatchlist((prev) => prev.filter((w) => !(w.id === id && w.media_type === mediaType)))
    
    if (item) {
      toast({
        title: "Removed from watchlist",
        description: `${item.title || item.name} has been removed from your watchlist.`,
      })
    }
  }

  const toggleWatched = (id: number, mediaType: "movie" | "tv") => {
    const item = watchlist.find((w) => w.id === id && w.media_type === mediaType)
    if (!item) return
    
    const newWatchedStatus = !item.watched
    
    setWatchlist((prev) =>
      prev.map((watchlistItem) => {
        if (watchlistItem.id === id && watchlistItem.media_type === mediaType) {
          return { ...watchlistItem, watched: newWatchedStatus }
        }
        return watchlistItem
      }),
    )
    
    toast({
      title: newWatchedStatus ? "Marked as watched" : "Marked as unwatched",
      description: `${item.title || item.name} has been ${newWatchedStatus ? "marked as watched" : "marked as unwatched"}.`,
    })
  }

  const isInWatchlist = (id: number, mediaType: "movie" | "tv") => {
    return watchlist.some((item) => item.id === id && item.media_type === mediaType)
  }

  const getWatchedItems = () => {
    return watchlist.filter((item) => item.watched)
  }

  const getUnwatchedItems = () => {
    return watchlist.filter((item) => !item.watched)
  }

  const clearWatchlist = () => {
    setWatchlist([])
    toast({
      title: "Watchlist cleared",
      description: "All items have been removed from your watchlist.",
    })
  }

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    isInWatchlist,
    getWatchedItems,
    getUnwatchedItems,
    clearWatchlist,
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider")
  }
  return context
}
