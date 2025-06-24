export default function HomePage() {
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
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">🔥 Trending Now</h2>
          <div className="bg-secondary rounded-lg p-8">
            <p className="text-muted-foreground text-lg">
              Trending movies and TV shows will be displayed here.
            </p>
            <p className="text-muted-foreground mt-2">
              This section will be implemented in future updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
