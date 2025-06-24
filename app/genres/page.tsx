"use client"

import { useState, useEffect } from "react"
import { Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { tmdbService } from "@/services/tmdb-service"
import type { Genre } from "@/types/media"
import Link from "next/link"

export default function GenresPage() {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([])
  const [tvGenres, setTVGenres] = useState<Genre[]>([])
  const [contentType, setContentType] = useState<"all" | "movie" | "tv">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true)
        const [movieGenresData, tvGenresData] = await Promise.all([
          tmdbService.getMovieGenres(),
          tmdbService.getTVGenres(),
        ])

        setMovieGenres(movieGenresData)
        setTVGenres(tvGenresData)
      } catch (err) {
        setError("Failed to load genres")
        console.error("Error fetching genres:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  const getDisplayGenres = () => {
    switch (contentType) {
      case "movie":
        return movieGenres
      case "tv":
        return tvGenres
      case "all":
      default:
        // Combine and deduplicate genres
        const allGenres = [...movieGenres, ...tvGenres]
        return allGenres.filter(
          (genre, index, self) => index === self.findIndex((g) => g.id === genre.id)
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Genres</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const displayGenres = getDisplayGenres()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse by Genre</h1>
            <p className="text-lg text-gray-400">
              Discover movies and TV shows by your favorite genres
            </p>
          </div>

          {/* Content Type Filter */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Content Type:</span>
            <Select value={contentType} onValueChange={(value: "all" | "movie" | "tv") => setContentType(value)}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-800">All</SelectItem>
                <SelectItem value="movie" className="text-white hover:bg-gray-800">Movies</SelectItem>
                <SelectItem value="tv" className="text-white hover:bg-gray-800">TV Shows</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Genre Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayGenres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.id}?type=${contentType}`}
              className="group"
            >
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:border-netflix-red">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-white group-hover:text-netflix-red transition-colors">
                    {genre.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {displayGenres.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No genres found</h3>
            <p className="text-gray-500">Try selecting a different content type</p>
          </div>
        )}
      </div>
    </div>
  )
}
