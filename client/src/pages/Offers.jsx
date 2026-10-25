import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTag, FaClock, FaCheckCircle } from 'react-icons/fa';

const OFFERS = [
  {
    id: 1,
    title: 'Summer Escapes',
    subtitle: 'Up to 25% off + Complimentary Breakfast',
    description: 'Bask in the sun with our exclusive summer packages. Enjoy luxury accommodations, daily gourmet breakfast, and a $100 resort credit.',
    validUntil: 'Aug 31, 2026',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200',
    color: 'bg-orange-500'
  },
  {
    id: 2,
    title: 'Romantic Getaway',
    subtitle: 'Couples Spa Treatment + Champagne',
    description: 'Celebrate love in unparalleled luxury. Includes a couple’s massage, chilled champagne upon arrival, and late check-out.',
    validUntil: 'Dec 31, 2026',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
    color: 'bg-pink-500'
  },
  {
    id: 3,
    title: 'Business Premium',
    subtitle: 'Executive Lounge Access & Fast WiFi',
    description: 'Travel for work without compromising on luxury. Includes unlimited access to our Executive Lounge and complimentary pressing service.',
    validUntil: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
    color: 'bg-blue-600'
  }
];

const Offers = () => {
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
            Exclusive <span className="gradient-text">Offers</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Elevate your stay with our curated selection of luxury packages and seasonal promotions.
          </motion.p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {OFFERS.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${offer.color}`}>
                  Special Offer
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{offer.title}</h3>
                  <p className="text-yellow-600 font-semibold">{offer.subtitle}</p>
                </div>
                
                <p className="text-gray-500 mb-6 flex-grow leading-relaxed">
                  {offer.description}
                </p>
                
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
                    <span className="flex items-center gap-2"><FaTag /> Limited Time</span>
                    <span className="flex items-center gap-2"><FaClock /> Valid until {offer.validUntil}</span>
                  </div>
                  
                  <Link 
                    to="/hotels" 
                    className="block w-full bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 text-center font-bold py-3.5 rounded-xl transition-colors duration-300"
                  >
                    View Participating Hotels
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loyalty Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif relative z-10">
            Join LuxeStay <span className="text-yellow-500">Rewards</span>
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg relative z-10">
            Unlock secret prices, early access to sales, and earn points on every booking toward free nights.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-2xl transition-colors relative z-10"
          >
            Join for Free
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Offers;
