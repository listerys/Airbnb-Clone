// components/layout/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { IoGlobeOutline, IoMoon, IoSunny } from 'react-icons/io5';
import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Header({ currentTheme, onToggleTheme }) {
  const router = useRouter();

  // Main search panel toggle
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Dropdown suggestions toggle
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Logged-in / user menu
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // "Filters" / Search states
  const [locationQuery, setLocationQuery] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [ac, setAc] = useState(false);
  const [pool, setPool] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  // All unique locations + filtered suggestions
  const [allLocations, setAllLocations] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Refs for outside-click behavior and focusing
  const containerRef = useRef(null);
  const locationInputRef = useRef(null);
  const checkInRef = useRef(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // For now, assume the user is logged in if there's a token
      setIsLoggedIn(true);
    }
  }, []);

  // 1) Fetch unique locations
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch('http://localhost:5000/listings');
        const data = await res.json();
        const locations = [...new Set(data.map((item) => item.location))];
        setAllLocations(locations);
      } catch (err) {
        console.error('Error fetching locations', err);
      }
    }
    fetchLocations();
  }, []);

  // 2) Outside-click logic
  useEffect(() => {
    function handleOutsideClick(e) {
      // Close the user dropdown if clicked outside
      if (showUserDropdown && e.target.closest('.user-menu') === null) {
        setShowUserDropdown(false);
      }

      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Click outside entire search panel
        setShowSearchPanel(false);
        setShowLocationSuggestions(false);
      } else {
        // Inside the search panel, but not location input => hide suggestions
        if (
          locationInputRef.current &&
          !locationInputRef.current.contains(e.target)
        ) {
          setShowLocationSuggestions(false);
        }
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showUserDropdown]);

  // 3) Location filter logic
  useEffect(() => {
    // If the user hasn't typed anything, close suggestions
    if (!locationQuery) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    const query = locationQuery.toLowerCase();
    const filtered = allLocations.filter((loc) =>
      loc.toLowerCase().includes(query)
    );

    setLocationSuggestions(filtered);

    // Check for exact match (case-insensitive)
    const exactMatch = allLocations.some(
      (loc) => loc.toLowerCase() === query
    );

    setShowLocationSuggestions(filtered.length > 0 && !exactMatch);
  }, [locationQuery, allLocations]);

  // 4) Handle "Apply Filters"
  const handleApplyFilters = () => {
    alert('Filters saved (UI only, no search action).');
    setShowSearchPanel(false);
    setShowLocationSuggestions(false);
  };

  // 5) Handle suggestion selection
  const handleSuggestionClick = (e, suggestion) => {
    e.stopPropagation();
    e.preventDefault();

    setLocationQuery(suggestion);

    // Close suggestions
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);

    // Shift focus to the Check-In date picker
    if (checkInRef.current && typeof checkInRef.current.setFocus === 'function') {
      checkInRef.current.setFocus();
    }
  };

  // Handle user menu toggling
  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setShowUserDropdown((prev) => !prev);
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        {/* Left: MyAirbnb brand text */}
        <div className="mr-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-semibold text-red-500 dark:text-red-400">
              MyAirbnb
            </span>
          </Link>
        </div>

        {/* Center: The Search Container */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-[600px]" ref={containerRef}>
            {/* Closed search bar => click to open panel */}
            {!showSearchPanel && (
              <div
                onClick={() => setShowSearchPanel(true)}
                className="
                  h-12 w-full bg-gray-100 dark:bg-gray-800
                  cursor-pointer rounded-full px-6
                  flex items-center justify-center
                "
              >
                <FaSearch className="text-gray-500 dark:text-gray-400 mr-3 text-lg" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Where are you going?
                </span>
              </div>
            )}

            {/* Main Search Panel */}
            <div
              className={`
                absolute left-0 top-full mt-2 w-full
                bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50
                p-8 transform transition-all duration-300 origin-top
                ${
                  showSearchPanel
                    ? 'scale-y-100 opacity-100'
                    : 'scale-y-0 opacity-0 pointer-events-none'
                }
              `}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location */}
                <div className="relative" ref={locationInputRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                               border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Search by city/country"
                  />

                  {/* Location Suggestions */}
                  <div
                    className={`
                      absolute left-0 right-0 top-[70px]
                      bg-white dark:bg-gray-700
                      rounded-b-lg shadow-lg
                      max-h-52 overflow-y-auto
                      z-10
                      transform transition-all duration-300 origin-top
                      ${
                        locationSuggestions.length
                          ? 'scale-y-100 opacity-100 pointer-events-auto'
                          : 'scale-y-0 opacity-0 pointer-events-none'
                      }
                    `}
                  >
                    {locationSuggestions.map((suggestion) => (
                      <div
                        key={suggestion}
                        onClick={(e) => handleSuggestionClick(e, suggestion)}
                        className="
                          px-4 py-2 cursor-pointer
                          hover:bg-gray-100 dark:hover:bg-gray-600
                          text-gray-700 dark:text-gray-200
                        "
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Check-In */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Check-In
                  </label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                               border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholderText="Select date"
                    ref={checkInRef}
                  />
                </div>

                {/* Check-Out */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Check-Out
                  </label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                               border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholderText="Select date"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                               border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Price Range */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range ($)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-1/2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                                 border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-1/2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                                 border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                               border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Any</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Cabin">Cabin</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Wi-Fi', state: wifi, setter: setWifi },
                    { label: 'Parking', state: parking, setter: setParking },
                    { label: 'Pet Friendly', state: petFriendly, setter: setPetFriendly },
                    { label: 'Air Conditioning', state: ac, setter: setAc },
                    { label: 'Pool', state: pool, setter: setPool },
                    { label: 'Kitchen', state: kitchen, setter: setKitchen },
                  ].map((amenity) => (
                    <label
                      key={amenity.label}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={amenity.state}
                        onChange={(e) => amenity.setter(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-red-500"
                      />
                      <span>{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters */}
              <button
                onClick={handleApplyFilters}
                className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg 
                           transition duration-300 font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Right: Nav Icons */}
        <nav className="ml-4 flex items-center space-x-4">
          <Link
            href="/listings"
            className="hidden lg:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
          >
            Explore
          </Link>
          <Link
            href="/listings/create"
            className="hidden lg:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
          >
            Host
          </Link>
          <Link
            href="/experiences"
            className="hidden lg:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
          >
            Experiences
          </Link>

          {/* Language/Currency Switch */}
          <button
            className="p-2 rounded-full transition duration-300 
                       hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Switch language or currency"
          >
            <IoGlobeOutline className="text-xl text-gray-600 dark:text-gray-300" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            className="p-2 rounded-full transition duration-300 
                       hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
          >
            {currentTheme === 'light' ? (
              <IoMoon className="text-xl text-gray-600" />
            ) : (
              <IoSunny className="text-xl text-yellow-400" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-full relative transition duration-300 
                       hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Notifications"
            onClick={() => alert('No new notifications')}
          >
            <FaBell className="text-gray-600 dark:text-gray-300 text-xl" />
            <span
              className="
                absolute top-0 right-0 inline-flex items-center justify-center 
                px-2 py-1 text-xs font-bold leading-none 
                text-red-100 bg-red-600 rounded-full
              "
            >
              0
            </span>
          </button>

          {/* If not logged in, show Log In / Sign Up */}
          {!isLoggedIn && (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* If logged in, show profile menu */}
          {isLoggedIn && (
            <div className="relative user-menu">
              <button
                className="flex items-center p-2 rounded-full transition duration-300 
                           hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleUserMenuClick}
                aria-label="User menu"
              >
                <FaUserCircle className="text-gray-600 dark:text-gray-300 text-2xl" />
              </button>

              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg py-2 z-50"
                >
<Link
  href="/chats"
  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
>
  Messages
</Link>

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
