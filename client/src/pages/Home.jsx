import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { FaStar, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import imgGrandImperial from '../assets/hotel_grand_imperial.png';
import imgAzureBay from '../assets/hotel_azure_bay.png';
import imgSkylineDubai from '../assets/hotel_skyline_dubai.png';

const FEATURED = [
  { id: '1', name: 'The Grand Imperial', city: 'Paris, France', rating: 4.9, price: 580, img: imgGrandImperial },
  { id: '2', name: 'Azure Bay Resort', city: 'Maldives', rating: 4.8, price: 890, img: imgAzureBay },
  { id: '3', name: 'Skyline Suites Dubai', city: 'Dubai, UAE', rating: 4.7, price: 420, img: imgSkylineDubai },
];

const WHY_US = [
  { icon: '🏷️', title: 'Best Price Guarantee', desc: 'We match any lower price you find, guaranteed.' },
  { icon: '🔒', title: 'Secure Booking', desc: 'Your data is protected with bank-grade encryption.' },
  { icon: '❌', title: 'Free Cancellation', desc: 'Cancel up to 24 hours before check-in, no charge.' },
  { icon: '🕐', title: '24/7 Support', desc: 'Round-the-clock concierge support, every day.' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Featured Hotels</h2>
            <p className="text-gray-500 text-lg">Handpicked luxury properties across the globe</p>
          </div>
          <Link to="/hotels" className="hidden sm:flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-500 transition">
            View All <FaArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED.map((hotel, i) => (
            <div key={hotel.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-yellow-600 flex items-center gap-1">
                  <FaStar size={12} /> {hotel.rating}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                  <p className="text-lg font-bold text-yellow-600">${hotel.price}<span className="text-sm text-gray-400 font-normal">/night</span></p>
                </div>
                <p className="text-gray-400 mb-4 flex items-center gap-1 text-sm">
                  <FaMapMarkerAlt className="text-yellow-500" size={12} /> {hotel.city}
                </p>
                <Link to={`/hotel/${hotel.id}`} className="block w-full py-3 text-center rounded-xl border-2 border-gray-200 font-semibold text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-white text-center mb-3">Why Choose LuxeStay?</h2>
          <p className="text-gray-400 text-center mb-12">We make luxury travel effortless and affordable</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Exclusive Deals, Right to You</h2>
        <p className="text-gray-500 mb-8">Subscribe to get the best hotel offers, travel tips, and luxury deals delivered to your inbox.</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-2xl transition-colors whitespace-nowrap">
            Subscribe Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
