// components/MessageHostWrapper.js
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Image from 'next/image';

export default function MessageHostWrapper({ host, isLoggedIn }) {
  const router = useRouter();

  const handleStartChat = () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=/chats/${host.id}`);
    } else {
      router.push(`/chats/${host.id}`);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 bg-white dark:bg-gray-800">
      {/* Host Avatar */}
      <div className="flex-shrink-0">
        <Image
          src={host.avatarUrl || '/images/default-avatar.png'} // Updated path
          alt={`${host.name}'s avatar`}
          width={100}
          height={100}
          className="rounded-full object-cover"
          priority
        />
      </div>

      {/* Host Information */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {host.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {host.bio || 'A dedicated host passionate about providing the best experience for guests.'}
        </p>

        {/* Action Button */}
        <div className="mt-4">
          <button
            onClick={handleStartChat}
            className="w-48 bg-red-600 text-white py-3 rounded-lg text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={isLoggedIn ? 'Start a chat with the host' : 'Log in to start a chat with the host'}
          >
            {isLoggedIn ? 'Start Chat' : 'Log In to Chat'}
          </button>
        </div>
      </div>
    </div>
  );
}

MessageHostWrapper.propTypes = {
  host: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
