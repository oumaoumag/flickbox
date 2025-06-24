"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, Share2, Eye, EyeOff } from "lucide-react"
import { useWatchlist } from "@/hooks/use-watchlist"
import type { WatchlistItem } from "@/types/media"

export default function WatchlistPage() {
  const { watchlist, getWatchedItems, getUnwatchedItems, clearWatchlist, toggleWatched, removeFromWatchlist } =
    useWatchlist()

  const [activeTab, setActiveTab] = useState("all")

  const watchedItems = getWatchedItems()
  const unwatchedItems = getUnwatchedItems()

  const exportWatchlist = () => {
    const data = watchlist.map((item) => ({
      title: item.title || item.name,
      type: item.media_type,
      year:
        item.release_date || item.first_air_date
          ? new Date(item.release_date || item.first_air_date!).getFullYear()
          : "N/A",
      rating: item.vote_average,
      watched: item.watched ? "Yes" : "No",
      added: new Date(item.added_at).toLocaleDateString(),
    }))

    const csv = [
      "Title,Type,Year,Rating,Watched,Added",
      ...data.map(
        (row) => `"${row.title}","${row.type}","${row.year}","${row.rating}","${row.watched}","${row.added}"`,
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "flickbox-watchlist.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareWatchlist = async () => {
    const shareText = `Check out my FlickBox watchlist! I have ${watchlist.length} movies and TV shows saved.`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My FlickBox Watchlist",
          text: shareText,
          url: window.location.origin + "/watchlist",
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText)
      alert("Watchlist info copied to clipboard!")
    }
  }

  if (watchlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your watchlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start building your watchlist by searching for movies and TV shows you want to watch.
          </p>
          <Button onClick={() => (window.location.href = "/")}>Discover Movies & TV Shows</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Watchlist</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {watchlist.length} items • {watchedItems.length} watched • {unwatchedItems.length} to watch
          </p>
        </div>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={exportWatchlist}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={shareWatchlist}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="destructive" onClick={clearWatchlist} className="bg-red-600 hover:bg-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{watchlist.length}</p>
              </div>
              <Badge variant="secondary">{watchlist.filter((i) => i.media_type === "movie").length} Movies</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Watched</p>
                <p className="text-2xl font-bold text-green-600">{watchedItems.length}</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">To Watch</p>
                <p className="text-2xl font-bold text-blue-600">{unwatchedItems.length}</p>
              </div>
              <EyeOff className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="all">All ({watchlist.length})</TabsTrigger>
          <TabsTrigger value="unwatched">To Watch ({unwatchedItems.length})</TabsTrigger>
          <TabsTrigger value="watched">Watched ({watchedItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((item) => (
              <WatchlistItemCard
                key={`${item.id}-${item.media_type}`}
                item={item}
                onToggleWatched={() => toggleWatched(item.id, item.media_type)}
                onRemove={() => removeFromWatchlist(item.id, item.media_type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unwatched">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unwatchedItems.map((item) => (
              <WatchlistItemCard
                key={`${item.id}-${item.media_type}`}
                item={item}
                onToggleWatched={() => toggleWatched(item.id, item.media_type)}
                onRemove={() => removeFromWatchlist(item.id, item.media_type)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="watched">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {watchedItems.map((item) => (
              <WatchlistItemCard
                key={`${item.id}-${item.media_type}`}
                item={item}
                onToggleWatched={() => toggleWatched(item.id, item.media_type)}
                onRemove={() => removeFromWatchlist(item.id, item.media_type)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WatchlistItemCard({
  item,
  onToggleWatched,
  onRemove,
}: {
  item: WatchlistItem
  onToggleWatched: () => void
  onRemove: () => void
}) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="w-24 h-36 flex-shrink-0">
          <img
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                : "/placeholder.svg"
            }
            alt={item.title || item.name}
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{item.title || item.name}</h3>
            <Badge variant={item.watched ? "default" : "secondary"} className="ml-2">
              {item.media_type === "movie" ? "Movie" : "TV"}
            </Badge>
          </div>

          <div className="text-xs text-gray-500 mb-3">
            <p>Added: {new Date(item.added_at).toLocaleDateString()}</p>
            {item.release_date || item.first_air_date ? (
              <p>Released: {new Date(item.release_date || item.first_air_date!).getFullYear()}</p>
            ) : null}
            {item.vote_average > 0 && <p>Rating: {item.vote_average.toFixed(1)}/10</p>}
          </div>

          <div className="flex space-x-2">
            <Button
              variant={item.watched ? "default" : "outline"}
              size="sm"
              onClick={onToggleWatched}
              className="flex-1"
            >
              {item.watched ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Watched
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Mark Watched
                </>
              )}
            </Button>
            <Button variant="destructive" size="sm" onClick={onRemove}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
