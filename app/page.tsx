"use client"

import { useState, useEffect } from "react"
import { NetflixHero } from "@/components/flixbox-hero"
import { NetflixRow } from "@/components/flixbox-row"
import { NetflixOriginals } from "@/components/flixbox-originals"
import { LoadingSpinner } from "@/components/loading-spinner"
import { tmdbService } from "@/services/tmdb-service"
import type { Movie, TVShow } from "@/types/media"

export default function HomePage() {
  const [heroItem, setHeroItem] = useState<Movie | TVShow | null>(null)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [trendingTV, setTrendingTV] = useState<TVShow[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [topRatedTV, setTopRatedTV] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)

        // Fetch all content in parallel
        const [
          trendingMoviesData,
          trendingTVData,
          popularMoviesData,
          topRatedMoviesData,
          topRatedTVData
        ] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getTrendingTVShows(),
          tmdbService.getPopularMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getTopRatedTVShows()
        ])

        // Set state
        setTrendingMovies(trendingMoviesData)
        setTrendingTV(trendingTVData)
        setPopularMovies(popularMoviesData)
        setTopRatedMovies(topRatedMoviesData)
        setTopRatedTV(topRatedTVData)

        // Set hero item (first trending movie or TV show)
        const allTrending = [...trendingMoviesData, ...trendingTVData]
        if (allTrending.length > 0) {
          setHeroItem(allTrending[Math.floor(Math.random() * Math.min(5, allTrending.length))])
        }
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Netflix Hero Section */}
      {heroItem && (
        <NetflixHero
          item={heroItem}
          type="mixed"
        />
      )}

      {/* Content Rows */}
      <div className="relative z-10 -mt-32 space-y-8">
        {/* Netflix Originals */}
        <NetflixOriginals
          title="Award-Winning Content"
          items={topRatedMovies.slice(0, 8)}
          type="movie"
        />

        {/* Trending Now */}
        <NetflixRow
          title="Trending Now"
          items={[...trendingMovies.slice(0, 10), ...trendingTV.slice(0, 10)]}
          type="mixed"
        />

        {/* Popular Movies */}
        <NetflixRow
          title="Popular Movies"
          items={popularMovies.slice(0, 15)}
          type="movie"
        />

        {/* Top Rated TV Shows */}
        <NetflixRow
          title="Top Rated TV Shows"
          items={topRatedTV.slice(0, 15)}
          type="tv"
        />

        {/* More Trending Movies */}
        <NetflixRow
          title="Trending Movies"
          items={trendingMovies.slice(10, 25)}
          type="movie"
        />

        {/* More Trending TV Shows */}
        <NetflixRow
          title="Trending TV Shows"
          items={trendingTV.slice(10, 25)}
          type="tv"
        />
      </div>
    </div>
  )
}
