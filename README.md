# FlickBox 🎬

A modern, responsive movie and TV show discovery platform built with Next.js, React, and the TMDB API. Discover trending content, manage your watchlist, and explore detailed information about your favorite movies and shows.

## ✨ Features

### Core Functionality
- **🔍 Smart Search**: Real-time search with debouncing for movies and TV shows
- **📈 Trending Dashboard**: Discover popular and trending content
- **📋 Detailed Views**: Comprehensive information including cast, crew, ratings, and trailers
- **❤️ Personal Watchlist**: Add, remove, and manage your watchlist with localStorage persistence
- **✅ Watch Status**: Mark items as watched/unwatched
- **📱 Responsive Design**: Mobile-first approach with beautiful Netflix-inspired UI

### Advanced Features
- **🎭 Genre Filtering**: Browse content by genre
- **🔄 Multiple Sorting Options**: Sort by popularity, rating, or release date
- **🌙 Dark Theme**: Netflix-style dark theme interface
- **🔗 Social Sharing**: Share movies and watchlists
- **📄 Pagination**: Efficient browsing of large result sets
- **⚠️ Error Handling**: Graceful error states and loading indicators

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React Hooks + localStorage
- **API**: TMDB (The Movie Database)
- **Icons**: Lucide React
- **Theme**: next-themes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flickbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Get TMDB API Key**
   - Visit [TMDB API](https://www.themoviedb.org/settings/api)
   - Create an account and request an API key
   - Add the key to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
flickbox/
├── app/                    # Next.js App Router pages
│   ├── movie/[id]/        # Movie detail pages
│   ├── tv/[id]/           # TV show detail pages
│   ├── search/            # Search results page
│   ├── watchlist/         # User watchlist page
│   ├── movies/            # Movies browse page
│   ├── tv-shows/          # TV shows browse page
│   ├── genres/            # Genre browse page
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── flixbox-hero.tsx  # Hero section component
│   ├── flixbox-row.tsx   # Netflix-style content rows
│   ├── media-card.tsx    # Movie/TV show cards
│   ├── search-bar.tsx    # Search functionality
│   └── ...
├── hooks/                # Custom React hooks
│   ├── use-watchlist.ts  # Watchlist management
│   └── use-debounce.ts   # Search debouncing
├── services/             # API services
│   └── tmdb-service.ts   # TMDB API integration
├── types/                # TypeScript type definitions
│   └── media.ts          # Media-related types
└── lib/                  # Utility functions
    └── utils.ts          # Helper functions
```

## 🔧 API Integration

### TMDB API Endpoints Used
- `/trending/movie/week` - Trending movies
- `/trending/tv/week` - Trending TV shows
- `/search/movie` - Movie search
- `/search/tv` - TV show search
- `/search/multi` - Multi-search
- `/movie/{id}` - Movie details
- `/tv/{id}` - TV show details
- `/genre/movie/list` - Movie genres
- `/genre/tv/list` - TV genres
- `/discover/movie` - Discover movies with filters
- `/discover/tv` - Discover TV shows with filters

### Rate Limiting
The application implements rate limiting awareness:
- Automatic retry on 429 (Too Many Requests) responses
- 1-second delay before retry
- Error handling for API failures

## 💾 Data Management

### Local Storage
- **Watchlist**: Persisted in `flickbox-watchlist` key
- **Theme Preference**: Managed by next-themes
- **Data Structure**: JSON format with metadata (added date, watched status)

### Caching Strategy
- API responses are cached at the component level
- Images use TMDB's CDN with multiple size options
- Debounced search prevents excessive API calls

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface on mobile devices

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast theme support

### Loading States
- Skeleton loaders for content
- Spinner components for actions
- Progressive image loading
- Graceful error boundaries

## 📱 Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `.next` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`
Runs the built app in production mode.

### `npm run lint`
Runs ESLint to check for code quality issues.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_TMDB_API_KEY`
4. Deploy automatically on push

### Other Platforms
The app can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### Manual Testing Checklist
- [ ] Search functionality works with debouncing
- [ ] Watchlist add/remove operations
- [ ] Theme toggle functionality
- [ ] Responsive design on different screen sizes
- [ ] Error handling for network failures
- [ ] Pagination in search results
- [ ] Movie/TV show detail pages load correctly

### Future Testing Improvements
- Unit tests with Jest and React Testing Library
- E2E tests with Playwright or Cypress
- API mocking for reliable testing

## 🔮 Future Enhancements

### Planned Features
- [ ] User authentication and cloud sync
- [ ] Advanced filtering (year, rating, runtime)
- [ ] Recommendation engine
- [ ] Watch providers integration
- [ ] Social features and user reviews
- [ ] Offline support with PWA
- [ ] Multiple language support

### Performance Optimizations
- [ ] Image optimization with Next.js Image component
- [ ] API response caching with SWR or React Query
- [ ] Virtual scrolling for large lists
- [ ] Code splitting and lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie and TV show data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [TMDB API documentation](https://developers.themoviedb.org/3)
- Review the Next.js documentation

---

**Built with ❤️ using Next.js and TMDB API**
