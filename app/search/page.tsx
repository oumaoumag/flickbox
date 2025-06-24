"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { MovieGrid } from "@/components/movie-grid"
import { useDebounce } from "@/hooks/use-debounce"
import { tmdbService } from "@/services/tmdb-service"
import type { Movie, TVShow } from "@/types/media"

type SortOption = "popularity.desc" | "popularity.asc" | "vote_average.desc" | "vote_average.asc" | "release_date.desc" | "release_date.asc"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("popularity.desc")
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [allResults, setAllResults] = useState<(Movie | TVShow)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const debouncedQuery = useDebounce(query, 300)

  // Initialize from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    const urlTab = searchParams.get('tab')

    if (urlQuery) {
      setQuery(urlQuery)
    }
    if (urlTab && ['all', 'movies', 'tv'].includes(urlTab)) {
      setActiveTab(urlTab)
    }
  }, [searchParams])

  // Search function
  const performSearch = async (searchQuery: string, page: number = 1, loadMore: boolean = false) => {
    if (!searchQuery.trim()) {
      setMovies([])
      setTVShows([])
      setAllResults([])
      setTotalPages(0)
      setHasMore(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [movieResults, tvResults, multiResults] = await Promise.all([
        tmdbService.searchMovies(searchQuery, page),
        tmdbService.searchTVShows(searchQuery, page),
        tmdbService.searchMulti(searchQuery, page)
      ])

      if (loadMore) {
        setMovies(prev => [...prev, ...movieResults.results])
        setTVShows(prev => [...prev, ...tvResults.results])
        setAllResults(prev => [...prev, ...multiResults.results])
      } else {
        setMovies(movieResults.results)
        setTVShows(tvResults.results)
        setAllResults(multiResults.results)
      }

      setTotalPages(Math.max(movieResults.total_pages, tvResults.total_pages, multiResults.total_pages))
      setHasMore(page < Math.max(movieResults.total_pages, tvResults.total_pages, multiResults.total_pages))
    } catch (err) {
      setError("Failed to search. Please try again.")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Effect for debounced search
  useEffect(() => {
    setCurrentPage(1)
    performSearch(debouncedQuery, 1, false)
  }, [debouncedQuery])

  // Sort results
  const sortResults = <T extends Movie | TVShow>(results: T[]): T[] => {
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case "popularity.desc":
          return b.popularity - a.popularity
        case "popularity.asc":
          return a.popularity - b.popularity
        case "vote_average.desc":
          return b.vote_average - a.vote_average
        case "vote_average.asc":
          return a.vote_average - b.vote_average
        case "release_date.desc":
          const dateA = new Date((a as any).release_date || (a as any).first_air_date || "")
          const dateB = new Date((b as any).release_date || (b as any).first_air_date || "")
          return dateB.getTime() - dateA.getTime()
        case "release_date.asc":
          const dateC = new Date((a as any).release_date || (a as any).first_air_date || "")
          const dateD = new Date((b as any).release_date || (b as any).first_air_date || "")
          return dateC.getTime() - dateD.getTime()
        default:
          return 0
      }
    })
  }

  // Load more results
  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    performSearch(debouncedQuery, nextPage, true)
  }

  // Clear search
  const clearSearch = () => {
    setQuery("")
    setMovies([])
    setTVShows([])
    setAllResults([])
    setCurrentPage(1)
    setTotalPages(0)
    setHasMore(false)
  }

  const sortedMovies = sortResults(movies)
  const sortedTVShows = sortResults(tvShows)
  const sortedAllResults = sortResults(allResults)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Movies & TV Shows</h1>
        
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for movies, TV shows, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Sort by:</span>
          </div>
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity.desc">Popularity (High to Low)</SelectItem>
              <SelectItem value="popularity.asc">Popularity (Low to High)</SelectItem>
              <SelectItem value="vote_average.desc">Rating (High to Low)</SelectItem>
              <SelectItem value="vote_average.asc">Rating (Low to High)</SelectItem>
              <SelectItem value="release_date.desc">Release Date (Newest)</SelectItem>
              <SelectItem value="release_date.asc">Release Date (Oldest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      {debouncedQuery ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({allResults.length})</TabsTrigger>
            <TabsTrigger value="movies">Movies ({movies.length})</TabsTrigger>
            <TabsTrigger value="tv">TV Shows ({tvShows.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <MovieGrid items={sortedAllResults} type="mixed" />
          </TabsContent>

          <TabsContent value="movies" className="mt-6">
            <MovieGrid items={sortedMovies} type="movie" />
          </TabsContent>

          <TabsContent value="tv" className="mt-6">
            <MovieGrid items={sortedTVShows} type="tv" />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Search for Movies & TV Shows</h2>
          <p className="text-muted-foreground">
            Enter a title, actor, director, or keyword to get started
          </p>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && debouncedQuery && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} variant="outline">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  )
}
