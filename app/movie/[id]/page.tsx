"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, Calendar, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tmdbService } from "@/services/tmdb-service"
import type { MediaDetails } from "@/types/media"
import { useWatchlist } from "@/hooks/use-watchlist"
import { LoadingSpinner } from "@/components/loading-spinner"
import { cn } from "@/lib/utils"
import { TrailerButton } from "@/components/trailer-button"

export default function MovieDetailPage() {
  const params = useParams()
  const movieId = Number.parseInt(params.id as string)
  const [movie, setMovie] = useState<MediaDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  // Now using global context, this will automatically re-render when watchlist changes
  const isInList = movie ? isInWatchlist(movie.id, "movie") : false

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const movieData = await tmdbService.getMovieDetails(movieId)
        setMovie(movieData)
      } catch (err) {
        setError("Failed to load movie details")
        console.error("Error fetching movie:", err)
      } finally {
        setLoading(false)
      }
    }

    if (movieId) {
      fetchMovie()
    }
  }, [movieId])

  const handleWatchlistToggle = () => {
    if (!movie) return

    if (isInList) {
      removeFromWatchlist(movie.id, "movie")
    } else {
      addToWatchlist({ ...movie, media_type: "movie" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Movie not found"}</p>
        </div>
      </div>
    )
  }

  const director = movie.credits.crew.find((person) => person.job === "Director")
  const mainCast = movie.credits.cast.slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Poster */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg"
                  }
                  alt={movie.title}
                  className="w-full h-auto"
                />
              </Card>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

              {movie.tagline && <p className="text-xl text-gray-300 mb-6 italic">"{movie.tagline}"</p>}

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center bg-yellow-500 text-black px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}

                {movie.release_date && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <p className="text-lg text-gray-200 mb-8 leading-relaxed">{movie.overview}</p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleWatchlistToggle}
                  className={cn("bg-purple-600 hover:bg-purple-700", isInList && "bg-green-600 hover:bg-green-700")}
                >
                  <Heart className={cn("w-5 h-5 mr-2", isInList && "fill-current")} />
                  {isInList ? "In Watchlist" : "Add to Watchlist"}
                </Button>

                <TrailerButton itemId={movie.id} mediaType="movie" title={movie.title} variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="cast" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="cast" className="mt-8">
            <div className="space-y-8">
              {director && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">Director</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            director.profile_path
                              ? `https://image.tmdb.org/t/p/w185${director.profile_path}`
                              : "/placeholder.svg"
                          }
                          alt={director.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-lg">{director.name}</h4>
                          <p className="text-gray-600">{director.job}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-4">Main Cast</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mainCast.map((actor) => (
                    <Card key={actor.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                : "/placeholder.svg"
                            }
                            alt={actor.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{actor.name}</h4>
                            <p className="text-gray-600 text-sm truncate">{actor.character}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Movie Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{movie.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Release Date:</span>
                      <span className="font-medium">
                        {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Runtime:</span>
                      <span className="font-medium">
                        {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">
                        {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Production</h3>
                  <div className="space-y-4">
                    {movie.production_companies.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Production Companies</h4>
                        <div className="space-y-2">
                          {movie.production_companies.slice(0, 3).map((company) => (
                            <div key={company.id} className="flex items-center space-x-2">
                              {company.logo_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                  alt={company.name}
                                  className="w-8 h-8 object-contain"
                                />
                              )}
                              <span className="text-sm">{company.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {movie.production_countries.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Countries</h4>
                        <div className="flex flex-wrap gap-2">
                          {movie.production_countries.map((country) => (
                            <Badge key={country.iso_3166_1} variant="outline">
                              {country.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {movie.spoken_languages.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {movie.spoken_languages.map((language) => (
                            <Badge key={language.iso_639_1} variant="outline">
                              {language.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movie.videos
                .filter((video) => video.site === "YouTube")
                .map((video) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold line-clamp-2">{video.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{video.type}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {movie.videos.filter((video) => video.site === "YouTube").length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No videos available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
