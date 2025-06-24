"use client"

import React from "react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎬</span>
            <Link href="/" className="text-2xl font-bold">
              FlickBox
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground"
            >
              🏠 Home
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground"
            >
              🔍 Search
            </Link>
            <Link
              href="/search?tab=movies"
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground"
            >
              🎬 Movies
            </Link>
            <Link
              href="/search?tab=tv"
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground"
            >
              📺 TV Shows
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
