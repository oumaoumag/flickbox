// TMDB API service - placeholder for future implementation
export const tmdbService = {
  // This will be implemented in future updates
  getTrendingMovies: async () => {
    return []
  },
  
  getTrendingTVShows: async () => {
    return []
  },
  
  searchMovies: async (query: string) => {
    return { results: [], total_results: 0, total_pages: 0 }
  },
  
  searchTVShows: async (query: string) => {
    return { results: [], total_results: 0, total_pages: 0 }
  }
}
