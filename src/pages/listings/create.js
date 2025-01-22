import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/layout/Header';

export default function CreateListing({ currentTheme, onToggleTheme }) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [guests, setGuests] = useState(1);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [ac, setAc] = useState(false);
  const [pool, setPool] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    const newListing = {
      title,
      description,
      location,
      price: Number(price),
      images: [images],
      hostId: 1, // Hardcoded for now
      propertyType,
      guests,
      bedrooms,
      beds,
      bathrooms,
      wifi,
      parking,
      petFriendly,
      ac,
      pool,
      kitchen
    };
    try {
      await axios.post('http://localhost:5000/listings', newListing);
      alert('Listing created!');
      router.push('/listings');
    } catch (err) {
      console.error(err);
      alert('Error creating listing');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
      <Header currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
      <div className="p-4 md:p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md mt-6 transition-colors duration-300 ease-in-out">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Create Listing</h1>
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium dark:text-gray-200">Title</label>
            <input
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium dark:text-gray-200">Description</label>
            <textarea
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium dark:text-gray-200">Location</label>
            <input
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium dark:text-gray-200">Price per night</label>
            <input
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium dark:text-gray-200">Image URL</label>
            <input
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium dark:text-gray-200">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Cabin">Cabin</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2 font-medium dark:text-gray-200">Guests</label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium dark:text-gray-200">Bedrooms</label>
              <input
                type="number"
                min="1"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium dark:text-gray-200">Beds</label>
              <input
                type="number"
                min="1"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium dark:text-gray-200">Bathrooms</label>
              <input
                type="number"
                min="1"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-airbnb transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            <label className="flex items-center gap-2 dark:text-gray-200">
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-500 transition"
              />
              Wi-Fi
            </label>
            <label className="flex items-center gap-2 dark:text-gray-200">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-500 transition"
              />
              Parking
            </label>
            <label className="flex items-center gap-2 dark:text-gray-200">
              <input
                type="checkbox"
                checked={petFriendly}
                onChange={(e) => setPetFriendly(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-500 transition"
              />
              Pet Friendly
            </label>
            <label className="flex items-center gap-2 dark:text-gray-200">
              <input
                type="checkbox"
                checked={ac}
                onChange={(e) => setAc(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-500 transition"
              />
              Air Conditioning
            </label>
            <label className="flex items-center gap-2 dark:text-gray-200">
              <input
                type="checkbox"
                checked={pool}
                onChange={(e) => setPool(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-500 transition"
              />
              Pool
            </label>
            <label className="flex items-center gap-2 dark:text-gray-200">
              <input
                type="checkbox"
                checked={kitchen}
                onChange={(e) => setKitchen(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-500 transition"
              />
              Kitchen
            </label>
          </div>
          <button
            className="bg-airbnb text-white px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
