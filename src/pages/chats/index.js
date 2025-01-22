// pages/chats/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Header from '../../components/layout/Header';

export default function Chats({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]); // list of { otherUserId, otherUserName }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login?redirect=/chats');
      return;
    }

    try {
      const decoded = jwt_decode(token);
      // check expiration
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        router.push('/auth/login?redirect=/chats');
      } else {
        setCurrentUserId(decoded.userId);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error decoding token', err);
      router.push('/auth/login?redirect=/chats');
    }
  }, [router]);

  useEffect(() => {
    if (!isLoading && currentUserId) {
      fetchConversations();
    }
  }, [isLoading, currentUserId]);

  async function fetchConversations() {
    try {
      // 1) Fetch all messages
      const { data: allMessages } = await axios.get('http://localhost:5000/messages');

      // 2) Filter messages that involve this user
      const myMsgs = allMessages.filter(
        (m) => m.fromUserId === currentUserId || m.toUserId === currentUserId
      );

      // 3) Collect the set of "otherUserId"s
      const otherUserIds = new Set();
      myMsgs.forEach((m) => {
        const other = m.fromUserId === currentUserId ? m.toUserId : m.fromUserId;
        otherUserIds.add(other);
      });

      // 4) For each otherUserId, fetch that user's name from /users
      const convos = [];
      for (const otherUserId of otherUserIds) {
        const userRes = await axios.get(`http://localhost:5000/users/${otherUserId}`);
        convos.push({
          otherUserId,
          otherUserName: userRes.data.name,
        });
      }

      setConversations(convos);
    } catch (err) {
      console.error('Error fetching conversations', err);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
        <div className="p-8 text-center text-gray-700 dark:text-gray-300">
          Checking authentication...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          My Chats
        </h1>

        {conversations.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            You have no active conversations.
          </p>
        ) : (
          <div className="space-y-4">
            {conversations.map((c) => (
              <div
                key={c.otherUserId}
                className="bg-white dark:bg-gray-800 rounded shadow p-4 
                           flex items-center justify-between cursor-pointer 
                           hover:shadow-md transition"
                onClick={() => router.push(`/chats/${c.otherUserId}`)}
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {c.otherUserName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to open chat
                  </p>
                </div>
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  &rarr;
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
