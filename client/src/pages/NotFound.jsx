import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4 pt-20">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-[8rem] font-extrabold text-gray-100 leading-none select-none">404</p>
      <h1 className="text-3xl font-extrabold text-gray-900 -mt-4 mb-4">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved. Head back to explore our luxury hotels.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          to="/"
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-2xl transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/hotels"
          className="border-2 border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-2xl hover:bg-gray-100 transition-colors"
        >
          Browse Hotels
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
