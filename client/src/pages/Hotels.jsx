import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetHotelsQuery } from '../slices/hotelsApiSlice';
import { FaMapMarkerAlt, FaStar, FaFilter, FaSort } from 'react-icons/fa';
import imgGrandImperial from '../assets/hotel_grand_imperial.png';
import imgAzureBay from '../assets/hotel_azure_bay.png';
import imgSkylineDubai from '../assets/hotel_skyline_dubai.png';
import imgLobby from '../assets/hotel_lobby.png';
import imgRoom from '../assets/hotel_room_deluxe.png';

const HotelCard = ({ hotel }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={
          hotel.name.includes('Imperial') ? imgGrandImperial : 
          hotel.name.includes('Azure') ? imgAzureBay : 
          hotel.name.includes('Dubai') ? imgSkylineDubai : 
          (hotel.images?.[0] || imgGrandImperial)
        }
        alt={hotel.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      {hotel.featured && (
        <span className="absolute top-4 left-4 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
          Featured
        </span>
      )}
      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-yellow-600 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
        <FaStar size={12} /> {hotel.rating?.toFixed(1) || '4.8'}
      </span>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{hotel.name}</h3>
      <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
        <FaMapMarkerAlt className="text-yellow-500" size={12} />
        {hotel.location?.city}, {hotel.location?.country}
      </p>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xl font-extrabold text-gray-900">
            From ${hotel.startingPrice || '200'}
          </span>
          <span className="text-gray-400 text-sm">/night</span>
        </div>
        <Link
          to={`/hotel/${hotel.id || hotel._id}`}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  </motion.div>
);

// Static sample data until DB is seeded
const SAMPLE_HOTELS = [
  { _id: '1', name: 'The Grand Imperial', location: { city: 'Paris', country: 'France' }, rating: 4.9, featured: true, images: ['https://images.unsplash.com/photo-1542314831-c6a4d27160c9?q=80&w=800'], startingPrice: 580 },
  { _id: '2', name: 'Azure Bay Resort', location: { city: 'Maldives', country: 'Maldives' }, rating: 4.8, featured: false, images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800'], startingPrice: 890 },
  { _id: '3', name: 'Skyline Suites', location: { city: 'Dubai', country: 'UAE' }, rating: 4.7, featured: true, images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800'], startingPrice: 420 },
  { _id: '4', name: 'Casa Bella Roma', location: { city: 'Rome', country: 'Italy' }, rating: 4.6, featured: false, images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800'], startingPrice: 350 },
  { _id: '5', name: 'Sakura Palace', location: { city: 'Tokyo', country: 'Japan' }, rating: 4.9, featured: true, images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800'], startingPrice: 610 },
  { _id: '6', name: 'The Peninsula NYC', location: { city: 'New York', country: 'USA' }, rating: 4.7, featured: false, images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800'], startingPrice: 740 },
];

const Hotels = () => {
  const [filters, setFilters] = useState({ city: '', minRating: '' });
  const [sortBy, setSortBy] = useState('recommended');
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const destination = query.get('destination') || '';

  // In production this would use useGetHotelsQuery(filters) from RTK Query
  // For now showing sample data
  const hotels = SAMPLE_HOTELS;

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {destination ? `Hotels in ${destination}` : 'Explore Luxury Hotels'}
          </h1>
          <p className="text-gray-500 text-lg">{hotels.length} properties found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-md sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <FaFilter className="text-yellow-500" /> Filters
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    placeholder="City or Country"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    defaultValue={destination}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (per night)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.8">4.8+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                  <div className="space-y-2">
                    {['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Parking', 'Air Conditioning', 'Breakfast Included', 'Pet Friendly', 'Room Service'].map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="accent-yellow-500 w-4 h-4" />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Hotel Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm mb-6 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Showing {hotels.length} results</span>
              <div className="flex items-center gap-2">
                <FaSort className="text-gray-400" />
                <select
                  className="text-sm font-medium text-gray-700 border-none bg-transparent focus:outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
