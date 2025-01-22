// pages/messages/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import jwt_decode from 'jwt-decode'; // optional
import Header from '../../components/layout/Header';

export default function Messages({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Not logged in => redirect to login
      router.push(`/auth/login?redirect=/messages`);
      return;
    }

    // If you want to decode the token to get userId:
    // try {
    //   const decoded = jwt_decode(token);
    //   if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    //     router.push(`/auth/login?redirect=/messages`);
    //   } else {
    //     setUserId(decoded.userId);
    //     setIsLoading(false);
    //   }
    // } catch (err) {
    //   console.error('Error decoding token', err);
    //   router.push(`/auth/login?redirect=/messages`);
    // }

    // For simplicity, let's assume userId is 1. 
    // In a real app, you'd decode or store userId in localStorage.
    setUserId(1);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      fetchMessages();
    }
  }, [isLoading]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/messages');
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msgData = {
      text: newMessage,
      fromUserId: userId,  // e.g. 1
      toUserId: 2,         // Host user (Anirban) = ID 2
      timestamp: new Date().toISOString()
    };

    try {
      await axios.post('http://localhost:5000/messages', msgData);
      setNewMessage('');
      fetchMessages(); // refresh chat
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

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

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-100px)]">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow p-4 rounded-t-md">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Chat with Host
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              (Anirban Khara)
            </p>
          </div>
          {/* Optionally, you can show status or anything else */}
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 shadow px-4 py-4 overflow-y-auto space-y-3 rounded-b-md">
          {messages.length === 0 ? (
            // If no messages
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No messages yet
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.fromUserId === userId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[70%] p-3 rounded-lg
                      ${isCurrentUser 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <span className="block mt-1 text-xs text-gray-200 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        <div className="mt-4 flex">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-l-md px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800
                       dark:text-gray-200"
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition
                       font-semibold focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
