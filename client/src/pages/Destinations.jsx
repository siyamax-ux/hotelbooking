import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import imgDubai from '../assets/hotel_skyline_dubai.png';
import imgParis from '../assets/hotel_grand_imperial.png';
import imgMaldives from '../assets/hotel_azure_bay.png';

const DESTINATIONS = [
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', properties: 12, img: imgDubai },
  { id: 'paris', name: 'Paris', country: 'France', properties: 8, img: imgParis },
  { id: 'maldives', name: 'Maldives', country: 'Maldives', properties: 5, img: imgMaldives },
  { id: 'new-york', name: 'New York', country: 'United States', properties: 15, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', properties: 9, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800' },
  { id: 'rome', name: 'Rome', country: 'Italy', properties: 6, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800' },
];

const Destinations = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-gray-900 mb-4 font-serif"
          >
            Popular <span className="gradient-text">Destinations</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Discover our handpicked collection of luxury properties in the world's most sought-after locations.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-3xl overflow-hidden h-80 group cursor-pointer"
            >
              <img 
                src={dest.img} 
                alt={dest.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">{dest.name}</h3>
                  <p className="text-gray-300 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-yellow-500" size={14} /> {dest.country}
                  </p>
                </div>
                
                <Link 
                  to={`/hotels?destination=${dest.name}`}
                  className="bg-white/20 backdrop-blur-md hover:bg-yellow-500 hover:text-gray-900 text-white p-3 rounded-full transition-colors"
                >
                  <FaArrowRight />
                </Link>
              </div>
              
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {dest.properties} Properties
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Destinations;
