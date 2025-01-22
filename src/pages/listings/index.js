// File: pages/listings/index.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import { FaHeart } from 'react-icons/fa';

export default function Listings({ currentTheme, onToggleTheme }) {
  const [listings, setListings] = useState([]);

  // States for randomly selected items in each section
  const [bestRated, setBestRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [editorsChoice, setEditorsChoice] = useState([]);

  // State to control location-based sidebar
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch all listings on component mount
  useEffect(() => {
    async function fetchListings() {
      try {
        const { data } = await axios.get('http://localhost:5000/listings');
        console.log('Fetched Listings:', data); // Debugging line

        // Adjust based on API response structure
        let fetchedListings = [];
        if (data && Array.isArray(data.listings)) {
          fetchedListings = data.listings;
        } else if (Array.isArray(data)) {
          fetchedListings = data;
        } else {
          console.error('Unexpected data format:', data);
          return;
        }
        
        setListings(fetchedListings);

        // Once we have the listings, randomly pick items for each highlighted section
        if (fetchedListings.length > 0) {
          setBestRated(getRandomListings(fetchedListings, 3));
          setTrending(getRandomListings(fetchedListings, 3));
          setEditorsChoice(getRandomListings(fetchedListings, 3));
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    }
    fetchListings();
  }, []);

  // Utility function to pick `count` random items from `arr`
  function getRandomListings(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Hardcoded DMV locations to display as cards
  const dmvLocations = [
    {
      name: 'Washington, DC, USA',
      // Image URLs are now directly specified in the JSX
    },
    {
      name: 'Arlington, VA, USA',
      // Image URLs are now directly specified in the JSX
    },
    {
      name: 'Alexandria, VA, USA',
      // Image URLs are now directly specified in the JSX
    },
    {
      name: 'Bethesda, MD, USA',
      // Image URLs are now directly specified in the JSX
    },
    {
      name: 'Silver Spring, MD, USA',
      // Image URLs are now directly specified in the JSX
    },
  ];

  // Filter listings to show in the sidebar for the selected location
  const filteredListingsForSidebar = listings.filter(
    (listing) => listing.location === selectedLocation
  );

  // Optional: Prevent scrolling when sidebar is open
  useEffect(() => {
    if (selectedLocation) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header with Theme Toggle & "Create Listing" Button */}
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

      <main className="flex-1 p-4 md:p-8 container mx-auto relative">
        {/* Page Title & Create Listing Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Listings</h1>
          <Link
            href="/listings/create"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
          >
            + Create Listing
          </Link>
        </div>

        {/* --------- 1. BEST RATED SECTION --------- */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Best Rated</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestRated.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* --------- 2. ADDITIONAL HIGHLIGHTED SECTIONS --------- */}
        {/* Example: "Trending Now" */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* Example: "Editor's Choice" */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Editor's Choice</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editorsChoice.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* --------- 3. EXPLORE IN DMV SECTION --------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Explore in DMV</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {dmvLocations.map((loc) => (
              <button
                key={loc.name}
                onClick={() => setSelectedLocation(loc.name)}
                className="relative overflow-hidden rounded-xl shadow-md transition transform hover:scale-105 group"
                aria-label={`View listings in ${loc.name}`}
              >
                <img
                  src={
                    loc.name === 'Washington, DC, USA'
                      ? 'https://ideogram.ai/assets/image/lossless/response/XC0yoFHRQqOddog8teeabQ'
                      : loc.name === 'Arlington, VA, USA'
                      ? 'https://ideogram.ai/assets/image/lossless/response/KxIxHMYQS8yHGJBxwuncig'
                      : loc.name === 'Alexandria, VA, USA'
                      ? 'https://ideogram.ai/assets/image/lossless/response/VktAbzfNTPC1VmJrgzB3RA'
                      : loc.name === 'Bethesda, MD, USA'
                      ? 'https://ideogram.ai/assets/image/lossless/response/f_lYUnHVSMavHxGZGvBeCw'
                      : loc.name === 'Silver Spring, MD, USA'
                      ? 'https://ideogram.ai/assets/image/lossless/response/lCQS9H_yQAGHV5dbVH1GkA'
                      : 'https://example.com/default.jpg' // Fallback
                  }
                  alt={`Image representing ${loc.name}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />

                {/* Gradient Overlay + Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent px-4 py-2">
                  <p className="text-white font-semibold text-base drop-shadow-md">
                    {loc.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* --------- SLIDE-IN SIDEBAR FOR SELECTED LOCATION --------- */}
      {/* Always render the overlay and sidebar, but control their visibility */}
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300
          ${selectedLocation ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none z-0'}
        `}
        onClick={() => setSelectedLocation(null)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full sm:w-2/3 md:w-1/3
          bg-white dark:bg-gray-800 shadow-xl p-4 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          z-50
          ${selectedLocation ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-label={`Sidebar showing listings for ${selectedLocation}`}
      >
        <button
          className="mb-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={() => setSelectedLocation(null)}
          aria-label="Close sidebar"
        >
          Close ✕
        </button>

        <h3 className="text-xl font-bold mb-4 dark:text-white">
          Available Houses in {selectedLocation}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {filteredListingsForSidebar.length > 0 ? (
            filteredListingsForSidebar.map((listing) => (
              <div
                key={listing.id}
                className="border-b border-gray-300 pb-4 mb-4 dark:border-gray-700"
              >
                {/* Image */}
                {listing.images && listing.images.length > 0 && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-40 object-cover rounded mb-2"
                    loading="lazy"
                  />
                )}
                {/* Title & Price */}
                <h4 className="text-md font-semibold dark:text-white">
                  {listing.title}
                </h4>
                <p className="text-red-600 font-medium mb-2">
                  ${listing.price} / night
                </p>
                {/* Description & More Info Link */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {listing.description}
                </p>
                <Link
                  href={`/listings/${listing.id}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  More Info
                </Link>
              </div>
            ))
          ) : (
            <p className="dark:text-white">No listings available in this location.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

// Reusable Card Component for each listing
function ListingCard({ listing }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition relative group flex flex-col"
    >
      <Link href={`/listings/${listing.id}`} className="block">
        {/* Conditionally render the <img> tag only if images exist */}
        {listing.images && listing.images.length > 0 && (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-48 object-cover rounded-t"
            loading="lazy" // Native lazy loading
          />
        )}
        <div className="p-4 flex-1">
          <h2 className="text-lg font-semibold dark:text-white">
            {listing.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            {listing.location}
          </p>
          <p className="text-red-600 font-medium">
            ${listing.price} / night
          </p>
        </div>
      </Link>
      <button
        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow hidden group-hover:inline-block transition"
        aria-label="Save listing"
      >
        <FaHeart className="text-red-500" />
      </button>
    </div>
  );
}
