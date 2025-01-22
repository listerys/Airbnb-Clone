// pages/auth/login.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/layout/Header';

export default function Login({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const { redirect } = router.query; // e.g. ?redirect=/listings/1

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      // Call our API route
      const { data } = await axios.post('/api/auth/login', { email, password });
      const { token } = data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      alert('Login successful!');
      // Redirect to the original page or home
      router.push(redirect || '/');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setErrorMsg('Invalid credentials');
      } else {
        setErrorMsg('An error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Login</h1>
          {errorMsg && (
            <p className="text-red-600 dark:text-red-400 mb-4">{errorMsg}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded 
                           focus:outline-none focus:ring-2 focus:ring-red-500"
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
                type="password"
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded 
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full font-semibold"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
