import type { Movie, TVShow, Genre, MediaDetails } from "@/types/media"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "demo_key"

class TMDBService {
  private async fetchFromTMDB(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
    url.searchParams.append("api_key", TMDB_API_KEY)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    try {
      const response = await fetch(url.toString())

      if (response.status === 429) {
        // Rate limiting – wait 1s and retry once
        await new Promise((r) => setTimeout(r, 1000))
        return this.fetchFromTMDB(endpoint, params)
      }

      if (response.status === 404) {
        console.warn(`TMDB 404: ${endpoint}`)
        return { results: [], total_results: 0, total_pages: 0 }
      }

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("TMDB API error:", error)
      throw error
    }
  }



  async searchMovies(query: string, page: number = 1) {
    try {
      const data = await this.fetchFromTMDB("/search/movie", {
        query: encodeURIComponent(query),
        page: page.toString(),
      })
      return {
        results: data.results || [],
        total_results: data.total_results || 0,
        total_pages: data.total_pages || 0,
      }
    } catch (error) {
      console.error("Error searching movies:", error)
      return { results: [], total_results: 0, total_pages: 0 }
    }
  }

  async searchTVShows(query: string, page: number = 1) {
    try {
      const data = await this.fetchFromTMDB("/search/tv", {
        query: encodeURIComponent(query),
        page: page.toString(),
      })
      return {
        results: data.results || [],
        total_results: data.total_results || 0,
        total_pages: data.total_pages || 0,
      }
    } catch (error) {
      console.error("Error searching TV shows:", error)
      return { results: [], total_results: 0, total_pages: 0 }
    }
  }



  async getMovieDetails(id: number): Promise<MediaDetails> {
    try {
      const [details, credits, videos] = await Promise.all([
        this.fetchFromTMDB(`/movie/${id}`),
        this.fetchFromTMDB(`/movie/${id}/credits`),
        this.fetchFromTMDB(`/movie/${id}/videos`),
      ])

      return {
        ...details,
        credits: credits || { cast: [], crew: [] },
        videos: videos.results || [],
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)
      throw error
    }
  }

  async getTVShowDetails(id: number): Promise<MediaDetails> {
    try {
      const [details, credits, videos] = await Promise.all([
        this.fetchFromTMDB(`/tv/${id}`),
        this.fetchFromTMDB(`/tv/${id}/credits`),
        this.fetchFromTMDB(`/tv/${id}/videos`),
      ])

      return {
        ...details,
        credits: credits || { cast: [], crew: [] },
        videos: videos.results || [],
      }
    } catch (error) {
      console.error("Error fetching TV show details:", error)
      throw error
    }
  }

  async getPopularMovies(): Promise<{ results: Movie[] }> {
    try {
      const data = await this.fetchFromTMDB("/movie/popular")
      return { results: data.results || [] }
    } catch (error) {
      console.error("Error fetching popular movies:", error)
      return { results: [] }
    }
  }

  async getTopRatedMovies(): Promise<{ results: Movie[] }> {
    try {
      const data = await this.fetchFromTMDB("/movie/top_rated")
      return { results: data.results || [] }
    } catch (error) {
      console.error("Error fetching top rated movies:", error)
      return { results: [] }
    }
  }

  async getTopRatedTVShows(): Promise<{ results: TVShow[] }> {
    try {
      const data = await this.fetchFromTMDB("/tv/top_rated")
      return { results: data.results || [] }
    } catch (error) {
      console.error("Error fetching top rated TV shows:", error)
      return { results: [] }
    }
  }

  async getUpcomingMovies(): Promise<{ results: Movie[] }> {
    try {
      const data = await this.fetchFromTMDB("/movie/upcoming")
      return { results: data.results || [] }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error)
      return { results: [] }
    }
  }

  async getPopularTVShows(): Promise<{ results: TVShow[] }> {
    try {
      const data = await this.fetchFromTMDB("/tv/popular")
      return { results: data.results || [] }
    } catch (error) {
      console.error("Error fetching popular TV shows:", error)
      return { results: [] }
    }
  }

  async getAiringTodayTVShows(): Promise<{ results: TVShow[] }> {
    try {
      const data = await this.fetchFromTMDB("/tv/airing_today")
      return { results: data.results || [] }
    } catch (error) {
      console.error("Error fetching airing today TV shows:", error)
      return { results: [] }
    }
  }

  async getMovieGenres(): Promise<Genre[]> {
    try {
      const data = await this.fetchFromTMDB("/genre/movie/list")
      return data.genres || []
    } catch (error) {
      console.error("Error fetching movie genres:", error)
      return []
    }
  }

  async getTVGenres(): Promise<Genre[]> {
    try {
      const data = await this.fetchFromTMDB("/genre/tv/list")
      return data.genres || []
    } catch (error) {
      console.error("Error fetching TV genres:", error)
      return []
    }
  }

  async discoverMovies(filters: {
    genre?: number[]
    sortBy?: string
    page?: number
    year?: number
    rating?: number
  } = {}): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
    try {
      const params: Record<string, string> = {
        page: (filters.page || 1).toString(),
        sort_by: filters.sortBy || "popularity.desc",
      }

      if (filters.genre && filters.genre.length > 0) {
        params.with_genres = filters.genre.join(",")
      }

      if (filters.year) {
        params.year = filters.year.toString()
      }

      if (filters.rating) {
        params["vote_average.gte"] = filters.rating.toString()
      }

      const data = await this.fetchFromTMDB("/discover/movie", params)
      return {
        results: data.results || [],
        total_pages: data.total_pages || 0,
        total_results: data.total_results || 0,
      }
    } catch (error) {
      console.error("Error discovering movies:", error)
      return { results: [], total_pages: 0, total_results: 0 }
    }
  }

  async discoverTVShows(filters: {
    genre?: number[]
    sortBy?: string
    page?: number
    year?: number
    rating?: number
  } = {}): Promise<{ results: TVShow[]; total_pages: number; total_results: number }> {
    try {
      const params: Record<string, string> = {
        page: (filters.page || 1).toString(),
        sort_by: filters.sortBy || "popularity.desc",
      }

      if (filters.genre && filters.genre.length > 0) {
        params.with_genres = filters.genre.join(",")
      }

      if (filters.year) {
        params.first_air_date_year = filters.year.toString()
      }

      if (filters.rating) {
        params["vote_average.gte"] = filters.rating.toString()
      }

      const data = await this.fetchFromTMDB("/discover/tv", params)
      return {
        results: data.results || [],
        total_pages: data.total_pages || 0,
        total_results: data.total_results || 0,
      }
    } catch (error) {
      console.error("Error discovering TV shows:", error)
      return { results: [], total_pages: 0, total_results: 0 }
    }
  }

  async getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<Movie[]> {
    try {
      const data = await this.fetchFromTMDB(`/trending/movie/${timeWindow}`)
      return data.results || []
    } catch (error) {
      console.error("Error fetching trending movies:", error)
      return []
    }
  }

  async getTrendingTVShows(timeWindow: "day" | "week" = "week"): Promise<TVShow[]> {
    try {
      const data = await this.fetchFromTMDB(`/trending/tv/${timeWindow}`)
      return data.results || []
    } catch (error) {
      console.error("Error fetching trending TV shows:", error)
      return []
    }
  }

  async searchMulti(query: string, page: number = 1): Promise<(Movie | TVShow)[]> {
    try {
      const data = await this.fetchFromTMDB("/search/multi", {
        query: encodeURIComponent(query),
        page: page.toString(),
      })
      return data.results || []
    } catch (error) {
      console.error("Error searching multi:", error)
      return []
    }
  }
}

export const tmdbService = new TMDBService()
