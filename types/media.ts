export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  media_type?: "movie"
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  media_type?: "tv"
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface CrewMember {
  id: number
  name: string
  job: string
  profile_path: string | null
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  iso_639_1: string
  name: string
}

export interface MediaDetails {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  popularity: number
  media_type?: "movie" | "tv"
  genres: Genre[]
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos: Video[]
  tagline?: string
  runtime?: number
  budget?: number
  revenue?: number
  status?: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  // TV Show specific
  number_of_seasons?: number
  number_of_episodes?: number
  episode_run_time?: number[]
  last_air_date?: string
  created_by?: CrewMember[]
  networks?: ProductionCompany[]
}

export type MediaItem = Movie | TVShow

export interface WatchlistItem {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  media_type: "movie" | "tv"
  added_at: string
  watched: boolean
}
