import Header from '../components/layout/Header';
import Link from 'next/link';

export default function Home({ currentTheme, onToggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&w=2000&q=80"
          alt="Hero background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute top-0 left-0 w-full h-full pointer-events-none" />
        <div className="relative z-10 text-center text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Find Your Next Adventure
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
            Stay in unique places and experience new cultures around the world
          </p>
          <Link
            href="/listings"
            className="inline-block bg-airbnb hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-all"
          >
            Explore Listings
          </Link>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
          Featured Destinations
        </h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-10 dark:text-gray-300">
          Explore some of the most popular places to stay and see what makes them special.
        </p>

        {/* Example placeholder: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <img
              src="https://ideogram.ai/assets/progressive-image/balanced/response/74-e_kXrSyKTKAaQogvV-A"
              alt="Beach"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Sunny Beaches</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Discover tropical getaways with pristine beaches and clear blue waters.
              </p>
              <Link
                href="/listings"
                className="text-airbnb font-semibold hover:underline"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <img
              src="https://ideogram.ai/assets/image/lossless/response/eklo2NPKSt6JDGRPTGYMhQ"
              alt="City Skyline"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">City Life</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Experience the hustle and bustle of iconic cities around the globe.
              </p>
              <Link
                href="/listings"
                className="text-airbnb font-semibold hover:underline"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <img
              src="https://ideogram.ai/assets/image/lossless/response/G_aTG_lLScCt9C91C32ZgA"
              alt="Mountains"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Mountain Escapes</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Retreat to stunning mountain vistas and fresh air for a relaxing escape.
              </p>
              <Link
                href="/listings"
                className="text-airbnb font-semibold hover:underline"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 text-center p-4">
        <p className="text-gray-600 dark:text-gray-400">
          © 2025 My Airbnb Clone. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
