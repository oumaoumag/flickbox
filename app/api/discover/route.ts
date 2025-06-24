import { NextRequest, NextResponse } from "next/server"
import { tmdbService } from "@/services/tmdb-service"

// Simple in-memory cache with shorter duration for discover results
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

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
    
    // Extract query parameters
    const type = searchParams.get("type") || "movie" // movie, tv
    const genreIds = searchParams.get("genres")?.split(",").map(Number).filter(Boolean) || []
    const sortBy = searchParams.get("sort_by") || "popularity.desc"
    const page = Number(searchParams.get("page")) || 1
    const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined

    // Create cache key based on all parameters
    const cacheKey = `discover-${type}-${genreIds.join(",")}-${sortBy}-${page}-${year || "any"}-${rating || "any"}`
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    let results

    const filters = {
      genre: genreIds.length > 0 ? genreIds : undefined,
      sortBy,
      page,
      year,
      rating,
    }

    if (type === "movie") {
      results = await tmdbService.discoverMovies(filters)
    } else if (type === "tv") {
      results = await tmdbService.discoverTVShows(filters)
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'movie' or 'tv'" },
        { status: 400 }
      )
    }

    const response = {
      ...results,
      type,
      filters: {
        genres: genreIds,
        sortBy,
        page,
        year,
        rating,
      },
      cached_at: new Date().toISOString(),
    }

    setCachedData(cacheKey, response)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error discovering content:", error)
    return NextResponse.json(
      { error: "Failed to discover content" },
      { status: 500 }
    )
  }
}
