import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '../../components/layout/Header';

export default function AdminPage({ currentTheme, onToggleTheme }) {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users').then(res => setUsers(res.data));
    axios.get('http://localhost:5000/listings').then(res => setListings(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

      <div className="p-4 md:p-8 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded shadow mt-6 transition-colors duration-300 ease-in-out">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Panel</h1>

        {/* Users Table */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Users</h2>
          <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-sm">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Host</th>
                  <th className="p-3">Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr
                    key={u.id}
                    className="border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="p-3 dark:text-gray-200">{u.id}</td>
                    <td className="p-3 dark:text-gray-200">{u.name}</td>
                    <td className="p-3 dark:text-gray-200">{u.email}</td>
                    <td className="p-3 dark:text-gray-200">{u.isHost ? 'Yes' : 'No'}</td>
                    <td className="p-3 dark:text-gray-200">{u.isAdmin ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Listings Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Listings</h2>
          <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-sm">
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Host ID</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr
                    key={l.id}
                    className="border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="p-3 dark:text-gray-200">{l.id}</td>
                    <td className="p-3 dark:text-gray-200">{l.title}</td>
                    <td className="p-3 dark:text-gray-200">{l.location}</td>
                    <td className="p-3 dark:text-gray-200">${l.price}</td>
                    <td className="p-3 dark:text-gray-200">{l.hostId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
