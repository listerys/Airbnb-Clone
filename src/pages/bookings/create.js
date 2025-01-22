import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RazorpayButton from '../../components/payments/RazorpayButton';
import Header from '../../components/layout/Header';

// Date Picker Library (install with: npm install react-datepicker)
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Make sure to import the CSS globally

export default function CreateBooking({ currentTheme, onToggleTheme }) {
  const router = useRouter();
  const { listingId } = router.query;

  // Listing data
  const [listing, setListing] = useState(null);

  // Form data for user/guest details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Additional info
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Dates
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  // Booking info
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (!listingId) return;

    async function fetchListing() {
      try {
        const { data } = await axios.get(`http://localhost:5000/listings/${listingId}`);
        setListing(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchListing();
  }, [listingId]);

  // Calculate nights between check-in and check-out
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    // A simplistic approach: (Date2 - Date1) / (1000 * 3600 * 24)
    const diffInMs = checkOutDate - checkInDate;
    return diffInMs > 0 ? Math.round(diffInMs / (1000 * 60 * 60 * 24)) : 0;
  };

  const nights = calculateNights();

  // Calculate pricing
  const pricePerNight = listing?.price || 0;
  const subtotal = nights * pricePerNight;
  const taxesAndFees = 10; // placeholder
  const total = subtotal + taxesAndFees;

  // Example booking handler
  async function handleBooking() {
    // Validate required fields
    if (!listing) {
      alert('Listing data is not loaded yet.');
      return;
    }
    if (!firstName || !lastName || !email || !checkInDate || !checkOutDate) {
      alert('Please fill in all required fields (name, email, check-in/out).');
      return;
    }

    const newBooking = {
      listingId: listing.id,
      userId: 2, // Hardcoded user (for demo)
      checkInDate,
      checkOutDate,
      guests,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      specialRequests,
    };

    try {
      await axios.post('http://localhost:5000/bookings', newBooking);
      alert('Booking created! Proceed to payment.');
    } catch (error) {
      console.error(error);
      alert('Error creating booking.');
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-pink-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
        <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
        <p className="p-6 dark:text-white">Loading listing...</p>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-tr from-indigo-50 via-white to-pink-50
        dark:bg-gray-900
        transition-colors duration-300 ease-in-out
      "
    >
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 dark:text-white tracking-tight">
          Complete Your Booking
        </h1>

        {/* 2-Column Layout, Wider */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          {/* LEFT COLUMN: User/Guest Details - bigger card */}
          <div
            className="
              bg-white/70 dark:bg-gray-800/80
              backdrop-blur-md
              rounded-2xl shadow-2xl
              p-8
              transform transition-all
            "
          >
            <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">
              Guest Information
            </h2>

            {/* Split name fields side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="
                    border border-gray-300 dark:border-gray-600
                    w-full p-3 rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                    transition
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                  "
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="
                    border border-gray-300 dark:border-gray-600
                    w-full p-3 rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                    transition
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                  "
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="
                  border border-gray-300 dark:border-gray-600
                  w-full p-3 rounded-lg
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                  transition
                  bg-white dark:bg-gray-900
                  text-gray-800 dark:text-gray-100
                "
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="
                  border border-gray-300 dark:border-gray-600
                  w-full p-3 rounded-lg
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                  transition
                  bg-white dark:bg-gray-900
                  text-gray-800 dark:text-gray-100
                "
              />
            </div>

            {/* Address/City/State/Zip in a multi-column layout */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="1234 Main St."
                className="
                  border border-gray-300 dark:border-gray-600
                  w-full p-3 rounded-lg
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                  transition
                  bg-white dark:bg-gray-900
                  text-gray-800 dark:text-gray-100
                "
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* City */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Los Angeles"
                  className="
                    border border-gray-300 dark:border-gray-600
                    w-full p-3 rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                    transition
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                  "
                />
              </div>

              {/* State */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="CA"
                  className="
                    border border-gray-300 dark:border-gray-600
                    w-full p-3 rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                    transition
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                  "
                />
              </div>

              {/* Zip */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Zip
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="90001"
                  className="
                    border border-gray-300 dark:border-gray-600
                    w-full p-3 rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                    transition
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                  "
                />
              </div>
            </div>

            {/* Date Pickers: Check In and Check Out */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Check-In <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  selectsStart
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={new Date()}
                  dateFormat="MMM d, yyyy"
                  placeholderText="Select Check-In Date"
                  className="
                    border border-gray-300 dark:border-gray-600
                    w-full p-3 rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                    transition
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                  "
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Check-Out <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  selectsEnd
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={checkInDate || new Date()}
                  dateFormat="MMM d, yyyy"
                  placeholderText="Select Check-Out Date"
                  className="
                    border border-gray-300 dark:border-gray-600
                    w-full p-3 rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                    transition
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                  "
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Number of Guests
              </label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="
                  border border-gray-300 dark:border-gray-600
                  w-full p-3 rounded-lg
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                  transition
                  bg-white dark:bg-gray-900
                  text-gray-800 dark:text-gray-100
                "
              />
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Special Requests / Notes
              </label>
              <textarea
                rows={4}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Let us know any special requirements..."
                className="
                  border border-gray-300 dark:border-gray-600
                  w-full p-3 rounded-lg
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700
                  transition
                  bg-white dark:bg-gray-900
                  text-gray-800 dark:text-gray-100
                "
              />
            </div>

            {/* Confirm Booking Button */}
            <button
              onClick={handleBooking}
              className="
                w-full
                bg-gradient-to-r from-indigo-500 to-purple-500
                hover:from-indigo-600 hover:to-purple-600
                text-white font-bold
                py-3 px-6 rounded-xl
                shadow-xl
                transform hover:-translate-y-0.5 hover:shadow-2xl
                transition-all duration-300
              "
            >
              Confirm Booking
            </button>
          </div>

          {/* RIGHT COLUMN: Bill Details & Payment - bigger card */}
          <div
            className="
              bg-white/70 dark:bg-gray-800/80
              backdrop-blur-md
              rounded-2xl shadow-2xl
              p-8
              flex flex-col
              transform transition-all
            "
          >
            <div>
              <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">
                Bill Details
              </h2>
              {/* Listing Summary */}
              <div className="space-y-2 mb-8 text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-medium">Listing:</span> {listing.title}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {listing.location}
                </p>
                <p>
                  <span className="font-medium">Price per Night:</span> $
                  {pricePerNight}
                </p>
                <p>
                  <span className="font-medium">Nights:</span> {nights}
                </p>
              </div>

              {/* Additional Price Calculations */}
              <div
                className="
                  bg-gray-100 dark:bg-gray-700
                  p-4 rounded-xl
                  text-gray-800 dark:text-gray-100
                  mb-8
                "
              >
                <p>
                  <span className="font-semibold">Subtotal:</span> ${subtotal}
                </p>
                <p>
                  <span className="font-semibold">Taxes &amp; Fees:</span> $
                  {taxesAndFees}
                </p>
                <hr className="my-3 border-gray-300 dark:border-gray-600" />
                <p className="text-xl font-bold">
                  Total: ${total}
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Payment Method
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8">
                Choose your preferred payment option below:
              </p>
            </div>

            {/* Payment Button(s) */}
            <div className="mt-auto">
              <RazorpayButton amount={total * 100} />
              {/* Add more payment options if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
