import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import heroBg from '../assets/hero_hotel_bg.png';

const Hero = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/hotels?destination=${searchParams.destination}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image / Video Simulation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          src={heroBg}
          alt="Luxury Hotel"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
            Discover Your Next <br/> <span className="text-yellow-500 font-serif italic">Luxury Experience</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
            Book exclusive hotels and resorts worldwide with premium service guaranteed.
          </p>
        </motion.div>

        {/* Search Widget - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-6 rounded-3xl shadow-2xl"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            
            <div className="flex-1 bg-white rounded-2xl p-3 md:p-4 flex items-center gap-3 shadow-inner">
              <FaMapMarkerAlt className="text-yellow-500 text-xl" />
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Destination</label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full outline-none text-gray-900 font-medium bg-transparent"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-3 md:p-4 flex items-center gap-3 shadow-inner">
              <FaCalendarAlt className="text-yellow-500 text-xl" />
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Check In - Out</label>
                <input
                  type="text"
                  placeholder="Add dates"
                  className="w-full outline-none text-gray-900 font-medium bg-transparent cursor-pointer"
                  onFocus={(e) => e.target.type = 'date'}
                />
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-3 md:p-4 flex items-center gap-3 shadow-inner">
              <FaUser className="text-yellow-500 text-xl" />
              <div className="flex flex-col w-full">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Guests</label>
                <select 
                  className="w-full outline-none text-gray-900 font-medium bg-transparent appearance-none cursor-pointer"
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
                >
                  <option value="1">1 Guest, 1 Room</option>
                  <option value="2">2 Guests, 1 Room</option>
                  <option value="3">3 Guests, 2 Rooms</option>
                  <option value="4">4 Guests, 2 Rooms</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-yellow-500/30 flex items-center justify-center gap-2"
            >
              <FaSearch />
              <span className="md:hidden lg:inline">Search</span>
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
