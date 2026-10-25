import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  FaMapMarkerAlt, FaStar, FaWifi, FaSwimmingPool,
  FaSpa, FaDumbbell, FaParking, FaUtensils, FaCoffee,
  FaConciergeBell, FaChevronLeft, FaChevronRight,
  FaUsers, FaBed, FaArrowRight, FaHeart
} from 'react-icons/fa';

import imgGrandImperial from '../assets/hotel_grand_imperial.png';
import imgAzureBay from '../assets/hotel_azure_bay.png';
import imgSkylineDubai from '../assets/hotel_skyline_dubai.png';
import imgRoomDeluxe from '../assets/hotel_room_deluxe.png';
import imgLobby from '../assets/hotel_lobby.png';

// === Sample data ===
const SAMPLE_HOTEL = {
  _id: '1',
  name: 'The Grand Imperial',
  description: 'Nestled in the heart of Paris, The Grand Imperial is the epitome of luxury and sophistication. Our hotel offers breathtaking views of the Eiffel Tower, world-class dining experiences, and an award-winning spa. Each room is meticulously designed with handcrafted furniture, premium linens, and state-of-the-art amenities to ensure an unforgettable stay.',
  location: { address: '15 Rue de Rivoli', city: 'Paris', country: 'France', state: 'Île-de-France' },
  rating: 4.9,
  numReviews: 312,
  propertyType: 'Luxury Hotel',
  amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Parking', 'Room Service', 'Concierge'],
  images: [
    imgGrandImperial,
    imgLobby,
    imgRoomDeluxe,
    imgSkylineDubai,
  ],
};

const SAMPLE_ROOMS = [
  { _id: 'r1', roomType: 'Deluxe King Room', capacity: { adults: 2, children: 1 }, price: 420, facilities: ['King Bed', 'City View', 'Mini Bar', 'Bathtub', 'Free WiFi'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800'], availability: true },
  { _id: 'r2', roomType: 'Premier Suite', capacity: { adults: 2, children: 2 }, price: 720, facilities: ['King Bed', 'Eiffel Tower View', 'Living Room', 'Jacuzzi', 'Butler Service'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800'], availability: true },
  { _id: 'r3', roomType: 'Junior Twin Room', capacity: { adults: 2, children: 0 }, price: 280, facilities: ['2 Twin Beds', 'Garden View', 'Work Desk', 'Free WiFi'], images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800'], availability: false },
];

const SAMPLE_REVIEWS = [
  { _id: 'rv1', userId: { name: 'Sarah Mitchell', avatar: '' }, rating: 5, comment: 'An absolutely phenomenal experience! The staff went above and beyond.', createdAt: '2026-05-01' },
  { _id: 'rv2', userId: { name: 'James Tanaka', avatar: '' }, rating: 5, comment: 'The suite had the most stunning view of the Eiffel Tower. Will definitely return!', createdAt: '2026-04-20' },
  { _id: 'rv3', userId: { name: 'Elena Rossi', avatar: '' }, rating: 4, comment: 'Exceptional service and beautiful rooms. The spa was absolutely divine.', createdAt: '2026-03-15' },
];

const amenityIcons = {
  'Free WiFi': <FaWifi />, 'Pool': <FaSwimmingPool />, 'Spa': <FaSpa />,
  'Gym': <FaDumbbell />, 'Parking': <FaParking />, 'Restaurant': <FaUtensils />,
  'Room Service': <FaCoffee />, 'Concierge': <FaConciergeBell />,
};

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar key={s} size={14} className={s <= rating ? 'text-yellow-500' : 'text-gray-200'} />
    ))}
  </div>
);

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [wishlist, setWishlist] = useState(false);

  // In production: useGetHotelByIdQuery(id), useGetRoomsByHotelQuery(id), useGetReviewsByHotelQuery(id)
  const hotel = SAMPLE_HOTEL;
  const rooms = SAMPLE_ROOMS;
  const reviews = SAMPLE_REVIEWS;

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleBookNow = () => {
    if (!selectedRoom) { alert('Please select a room first.'); return; }
    if (!checkIn || !checkOut) { alert('Please select check-in and check-out dates.'); return; }
    navigate('/booking', {
      state: { hotel, room: selectedRoom, checkIn, checkOut, guests, nights: getNights() }
    });
  };

  // Removed manual auth check here to rely on ProtectedRoute

  if (!hotel) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Hotel Not Found</h1>
        <p className="text-xl text-gray-500 mb-8">We couldn't find the hotel you were looking for.</p>
        <Link to="/hotels" className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors">
          Browse All Hotels
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 pt-24 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/hotels" className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-600 transition-colors font-semibold">
            <FaChevronLeft size={12} /> Back to Hotels
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="relative h-72 md:h-[500px] rounded-3xl overflow-hidden mb-10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={hotel.images[activeImage]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <button onClick={() => setActiveImage((p) => (p - 1 + hotel.images.length) % hotel.images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition">
            <FaChevronLeft />
          </button>
          <button onClick={() => setActiveImage((p) => (p + 1) % hotel.images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition">
            <FaChevronRight />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {hotel.images.map((_, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImage ? 'bg-white scale-125' : 'bg-white/50'}`} />
            ))}
          </div>
          {/* Thumbnail strip */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {hotel.images.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-yellow-500' : 'border-white/30'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Hotel Header */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                    {hotel.propertyType}
                  </span>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{hotel.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1 mb-3">
                    <FaMapMarkerAlt className="text-yellow-500" />
                    {hotel.location.address}, {hotel.location.city}, {hotel.location.country}
                  </p>
                  <div className="flex items-center gap-3">
                    <StarRating rating={Math.round(hotel.rating)} />
                    <span className="font-bold text-gray-900">{hotel.rating}</span>
                    <span className="text-gray-400 text-sm">({hotel.numReviews} reviews)</span>
                  </div>
                </div>
                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`p-3 rounded-full border-2 transition-all ${wishlist ? 'bg-red-50 border-red-400 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'}`}
                >
                  <FaHeart size={20} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About This Property</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {hotel.amenities.map((a) => (
                  <div key={a} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-yellow-50 transition group">
                    <span className="text-xl text-gray-500 group-hover:text-yellow-500 transition">{amenityIcons[a] || <FaConciergeBell />}</span>
                    <span className="text-xs font-medium text-gray-600 text-center">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Available Rooms</h2>
              <div className="space-y-5">
                {rooms.map((room) => (
                  <motion.div
                    key={room._id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => room.availability && setSelectedRoom(room)}
                    className={`border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${
                      !room.availability ? 'opacity-50 cursor-not-allowed border-gray-100' :
                      selectedRoom?._id === room._id ? 'border-yellow-500 shadow-lg' : 'border-gray-100 hover:border-yellow-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-36 shrink-0">
                        <img src={room.images?.[0]} alt={room.roomType} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900">{room.roomType}</h3>
                            {!room.availability && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Sold Out</span>}
                            {selectedRoom?._id === room._id && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Selected</span>}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1"><FaUsers size={12} /> {room.capacity.adults} Adults</span>
                            <span className="flex items-center gap-1"><FaBed size={12} /> {room.roomType.split(' ')[0]}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {room.facilities.slice(0, 4).map((f) => (
                              <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div>
                            <span className="text-2xl font-extrabold text-gray-900">${room.price}</span>
                            <span className="text-gray-400 text-sm">/night</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Guest Reviews</h2>
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700">
                        {review.userId.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.userId.name}</p>
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm pl-13">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Book Your Stay</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Check In</label>
                  <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Check Out</label>
                  <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Guests</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>

                {selectedRoom && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm">
                    <p className="font-semibold text-gray-900 mb-1">{selectedRoom.roomType}</p>
                    <p className="text-gray-500">${selectedRoom.price}/night × {getNights()} nights</p>
                    {getNights() > 0 && (
                      <div className="mt-2 pt-2 border-t border-yellow-200">
                        <div className="flex justify-between font-bold text-gray-900">
                          <span>Total</span>
                          <span>${(selectedRoom.price * getNights()).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">+taxes & fees</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleBookNow}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/40 text-base"
                >
                  {selectedRoom ? 'Book Now' : 'Select a Room'} <FaArrowRight />
                </button>

                <p className="text-xs text-center text-gray-400">No cancellation fee · Best price guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelDetails;
