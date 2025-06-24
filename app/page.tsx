"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MovieGrid } from "@/components/movie-grid"
import { LoadingSpinner } from "@/components/loading-spinner"
import { tmdbService } from "@/services/tmdb-service"
import type { Movie, TVShow } from "@/types/media"

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [trendingTV, setTrendingTV] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true)
        const [movies, tvShows] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getTrendingTVShows()
        ])
        setTrendingMovies(movies.slice(0, 10))
        setTrendingTV(tvShows.slice(0, 10))
      } catch (error) {
        console.error("Error fetching trending content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Favorite Movie
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Search millions of movies and TV shows, create your watchlist, and never miss a great story
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for movies, TV shows, people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 bg-purple-600 hover:bg-purple-700">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Trending Content */}
      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Trending Movies */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  Trending Movies
                </h2>
                <Link href="/search?tab=movies">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <MovieGrid items={trendingMovies} type="movie" />
            </section>

            {/* Trending TV Shows */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  Trending TV Shows
                </h2>
                <Link href="/search?tab=tv">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <MovieGrid items={trendingTV} type="tv" />
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
