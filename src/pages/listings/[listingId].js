// pages/listings/[listingId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import MessageHostWrapper from '../../components/MessageHostWrapper';
import Image from 'next/image';

export default function ListingDetail({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const { listingId } = router.query;

  const [listing, setListing] = useState(null);
  const [host, setHost] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token presence
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Optionally, decode the token to check expiry
    }
  }, []);

  useEffect(() => {
    if (!listingId) return;

    async function fetchListing() {
      try {
        const res = await axios.get(`http://localhost:5000/listings/${listingId}`);
        setListing(res.data);

        // Also fetch the host user
        if (res.data.hostId) {
          const hostRes = await axios.get(`http://localhost:5000/users/${res.data.hostId}`);
          setHost(hostRes.data);
        }
      } catch (error) {
        console.error('Error fetching listing or host:', error);
      }
    }
    fetchListing();
  }, [listingId]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 ease-in-out">
        <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
        <p className="p-4 dark:text-white">Loading listing...</p>
      </div>
    );
  }

  const handleReserve = () => {
    if (!isLoggedIn) {
      // not logged in => redirect to login
      router.push(`/auth/login?redirect=/listings/${listing.id}`);
    } else {
      router.push(`/bookings/create?listingId=${listing.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

      <main className="flex-1 p-4 md:p-8 container mx-auto">
        {/* Hero Gallery */}
        <div className="relative w-full h-80 md:h-96 mb-8 rounded-2xl overflow-hidden">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            layout="fill"
            objectFit="cover"
            className="object-cover"
            priority
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md"
              aria-label="Save listing"
              onClick={() => alert('Listing saved!')}
            >
              <FaHeart className="text-red-500" />
            </button>
            <button
              className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md"
              aria-label="Share listing"
              onClick={() => alert('Share link copied!')}
            >
              <FaShareAlt className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Listing Info */}
        <div className="md:flex md:space-x-12">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {listing.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {listing.location}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {listing.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8 text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium">Property Type:</span> {listing.propertyType}
              </div>
              <div>
                <span className="font-medium">Guests:</span> {listing.guests}
              </div>
              <div>
                <span className="font-medium">Bedrooms:</span> {listing.bedrooms}
              </div>
              <div>
                <span className="font-medium">Beds:</span> {listing.beds}
              </div>
              <div>
                <span className="font-medium">Bathrooms:</span> {listing.bathrooms}
              </div>
              <div>
                <span className="font-medium">Wi-Fi:</span> {listing.wifi ? 'Yes' : 'No'}
              </div>
              {/* Add more details as needed */}
            </div>

            {/* Message Host */}
            {host && (
              <div className="mb-8">
                <MessageHostWrapper host={host} isLoggedIn={isLoggedIn} />
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="md:w-1/3 mt-8 md:mt-0">
            <div className="bg-gradient-to-t from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                ${listing.price} <span className="text-base font-medium">/ night</span>
              </div>
              <hr className="border-gray-300 dark:border-gray-600 my-4" />
              <button
                onClick={handleReserve}
                className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {isLoggedIn ? 'Reserve' : 'Log In to Reserve'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
