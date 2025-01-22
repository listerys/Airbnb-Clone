import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/layout/Header';

export default function HostDashboard({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Minimal check: parse token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      router.push('/auth/login');
      return;
    }

    // decode userId from token? We skip actual verification for demo
    try {
      const base64Url = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Url));
      setUserId(decoded.userId);
    } catch (err) {
      console.error(err);
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/listings?hostId=${userId}`).then(res => {
      setListings(res.data);
    });
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
      <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Host Dashboard</h1>
        <p className="mb-6 dark:text-gray-200">Manage your listings below.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map(listing => (
            <div
              key={listing.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 transition-colors"
            >
              <h2 className="text-lg font-semibold mb-1 dark:text-white">
                {listing.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                {listing.location}
              </p>
              <p className="text-red-600 dark:text-red-400 font-medium">
                ${listing.price} / night
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
