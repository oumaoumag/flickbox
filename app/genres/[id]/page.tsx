"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MovieGrid } from "@/components/movie-grid"
import { tmdbService } from "@/services/tmdb-service"
import type { Movie, TVShow, Genre } from "@/types/media"
import Link from "next/link"

export default function GenrePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const genreId = Number(params.id)
  const contentType = (searchParams.get("type") as "all" | "movie" | "tv") || "all"

  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [currentGenre, setCurrentGenre] = useState<Genre | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState("popularity.desc")
  const [yearFilter, setYearFilter] = useState<number | null>(null)
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch genres to get the current genre name
        const [movieGenres, tvGenres] = await Promise.all([
          tmdbService.getMovieGenres(),
          tmdbService.getTVGenres(),
        ])

        const allGenres = [...movieGenres, ...tvGenres]
        const uniqueGenres = allGenres.filter(
          (genre, index, self) => index === self.findIndex((g) => g.id === genre.id)
        )
        setGenres(uniqueGenres)

        const genre = uniqueGenres.find((g) => g.id === genreId)
        setCurrentGenre(genre || null)

        // Fetch content based on content type
        if (contentType === "movie" || contentType === "all") {
          const movieResults = await tmdbService.discoverMovies({
            genre: [genreId],
            sortBy,
            page: currentPage,
            year: yearFilter || undefined,
            rating: ratingFilter || undefined,
          })
          setMovies(movieResults.results)
          if (contentType === "movie") {
            setTotalPages(movieResults.total_pages)
          }
        }

        if (contentType === "tv" || contentType === "all") {
          const tvResults = await tmdbService.discoverTVShows({
            genre: [genreId],
            sortBy,
            page: currentPage,
            year: yearFilter || undefined,
            rating: ratingFilter || undefined,
          })
          setTVShows(tvResults.results)
          if (contentType === "tv") {
            setTotalPages(tvResults.total_pages)
          }
        }

        if (contentType === "all") {
          // For "all", we'll use the max pages from both
          const movieResults = await tmdbService.discoverMovies({
            genre: [genreId],
            sortBy,
            page: currentPage,
          })
          const tvResults = await tmdbService.discoverTVShows({
            genre: [genreId],
            sortBy,
            page: currentPage,
          })
          setTotalPages(Math.max(movieResults.total_pages, tvResults.total_pages))
        }
      } catch (err) {
        setError("Failed to load genre content")
        console.error("Error fetching genre data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGenreData()
  }, [genreId, contentType, currentPage, sortBy, yearFilter, ratingFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFilterChange = (type: string, value: string) => {
    setCurrentPage(1) // Reset to first page when filters change
    
    switch (type) {
      case "sort":
        setSortBy(value)
        break
      case "year":
        setYearFilter(value === "all" ? null : Number(value))
        break
      case "rating":
        setRatingFilter(value === "all" ? null : Number(value))
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !currentGenre) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error || "Genre not found"}
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "The requested genre could not be found."}
          </p>
          <Link href="/genres">
            <Button>Back to Genres</Button>
          </Link>
        </div>
      </div>
    )
  }

  const allContent = [...movies, ...tvShows]
  const hasContent = allContent.length > 0

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/genres">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Genres
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentGenre.name}</h1>
            <p className="text-lg text-gray-400">
              Discover {contentType === "all" ? "movies and TV shows" : contentType === "movie" ? "movies" : "TV shows"} in the {currentGenre.name.toLowerCase()} genre
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <Select value={sortBy} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="popularity.desc" className="text-white hover:bg-gray-800">Most Popular</SelectItem>
                <SelectItem value="vote_average.desc" className="text-white hover:bg-gray-800">Highest Rated</SelectItem>
                <SelectItem value="release_date.desc" className="text-white hover:bg-gray-800">Newest First</SelectItem>
                <SelectItem value="release_date.asc" className="text-white hover:bg-gray-800">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter?.toString() || "all"} onValueChange={(value) => handleFilterChange("year", value)}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-800">All Years</SelectItem>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-800">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ratingFilter?.toString() || "all"} onValueChange={(value) => handleFilterChange("rating", value)}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-800">All Ratings</SelectItem>
                <SelectItem value="8" className="text-white hover:bg-gray-800">8.0+</SelectItem>
                <SelectItem value="7" className="text-white hover:bg-gray-800">7.0+</SelectItem>
                <SelectItem value="6" className="text-white hover:bg-gray-800">6.0+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {(yearFilter || ratingFilter) && (
            <span className="text-sm text-gray-400">Active filters:</span>
          )}
          {yearFilter && (
            <Badge
              variant="secondary"
              className="bg-netflix-red text-white cursor-pointer"
              onClick={() => handleFilterChange("year", "all")}
            >
              Year: {yearFilter} ✕
            </Badge>
          )}
          {ratingFilter && (
            <Badge
              variant="secondary"
              className="bg-netflix-red text-white cursor-pointer"
              onClick={() => handleFilterChange("rating", "all")}
            >
              Rating: {ratingFilter}.0+ ✕
            </Badge>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 pb-20">
        {hasContent ? (
          <>
            <MovieGrid items={allContent} type="mixed" />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No content found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or check back later for new content.
            </p>
            <Button onClick={() => {
              setYearFilter(null)
              setRatingFilter(null)
              setSortBy("popularity.desc")
              setCurrentPage(1)
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
