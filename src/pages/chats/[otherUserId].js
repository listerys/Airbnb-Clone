// pages/chats/[otherUserId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Header from '../../components/layout/Header';

export default function ChatDetail({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const { otherUserId } = router.query; // from [otherUserId].js

  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserName, setOtherUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  console.log('jwt_decode is:', jwt_decode);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login?redirect=/chats');
      return;
    }

    try {
      const decoded = jwt_decode(token);
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
    if (!isLoading && otherUserId && currentUserId) {
      fetchChat();
      fetchOtherUserName();
    }
  }, [isLoading, otherUserId, currentUserId]);

  async function fetchOtherUserName() {
    try {
      const { data: userData } = await axios.get(
        `http://localhost:5000/users/${otherUserId}`
      );
      setOtherUserName(userData.name);
    } catch (err) {
      console.error('Error fetching other user name', err);
    }
  }

  async function fetchChat() {
    try {
      const { data: allMessages } = await axios.get('http://localhost:5000/messages');

      // Filter to just messages where fromUserId === currentUserId & toUserId === otherUserId
      // OR fromUserId === otherUserId & toUserId === currentUserId
      const chatMessages = allMessages.filter((m) => {
        return (
          (m.fromUserId === currentUserId && m.toUserId === Number(otherUserId)) ||
          (m.fromUserId === Number(otherUserId) && m.toUserId === currentUserId)
        );
      });

      // Sort by timestamp ascending (optional)
      chatMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setMessages(chatMessages);
    } catch (err) {
      console.error('Error fetching chat messages', err);
    }
  }

  async function handleSend() {
    if (!newMessage.trim()) return;
    if (!currentUserId) return;

    const msgData = {
      text: newMessage,
      fromUserId: currentUserId,
      toUserId: Number(otherUserId),
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:5000/messages', msgData);
      setNewMessage('');
      fetchChat(); // refresh
    } catch (error) {
      console.error('Error sending message', error);
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

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-100px)]">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow p-4 rounded-t-md">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Chat with {otherUserName || `User ${otherUserId}`}
            </h1>
            {/* Optionally show other info */}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 shadow px-4 py-4 overflow-y-auto space-y-3 rounded-b-md">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No messages yet
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.fromUserId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[70%] p-3 rounded-lg
                      ${isMe 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <span className="block mt-1 text-xs text-gray-200 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
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
