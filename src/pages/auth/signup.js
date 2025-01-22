// pages/auth/signup.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/layout/Header';

export default function Signup({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const newUser = { name, email, password, isHost };
      await axios.post('http://localhost:5000/users', newUser);

      alert('Signup successful!');
      // Optionally auto-login or push them to /auth/login
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      setErrorMsg('Error occurred during signup.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Sign Up</h1>
          {errorMsg && (
            <p className="text-red-600 dark:text-red-400 mb-4">{errorMsg}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Name
              </label>
              <input
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded 
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Email
              </label>
              <input
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded 
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Password
              </label>
              <input
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded 
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2 dark:text-gray-200">
              <input
                id="hostCheck"
                type="checkbox"
                checked={isHost}
                onChange={(e) => setIsHost(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-500"
              />
              <label htmlFor="hostCheck">Register as a Host</label>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full font-semibold"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
