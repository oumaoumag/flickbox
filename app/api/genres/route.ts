import { NextRequest, NextResponse } from "next/server"
import { tmdbService } from "@/services/tmdb-service"

// Simple in-memory cache with 24-hour expiration
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all" // all, movie, tv

    const cacheKey = `genres-${type}`
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    let genres = []

    switch (type) {
      case "movie":
        genres = await tmdbService.getMovieGenres()
        break
      case "tv":
        genres = await tmdbService.getTVGenres()
        break
      case "all":
      default:
        const [movieGenres, tvGenres] = await Promise.all([
          tmdbService.getMovieGenres(),
          tmdbService.getTVGenres(),
        ])
        
        // Combine and deduplicate genres
        const allGenres = [...movieGenres, ...tvGenres]
        genres = allGenres.filter(
          (genre, index, self) => index === self.findIndex((g) => g.id === genre.id)
        )
        break
    }

    const response = {
      genres,
      type,
      cached_at: new Date().toISOString(),
    }

    setCachedData(cacheKey, response)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    )
  }
}
