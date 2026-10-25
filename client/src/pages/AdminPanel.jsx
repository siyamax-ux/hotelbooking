import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaHotel, FaBed, FaCalendarAlt,
  FaUsers, FaChartBar, FaPlus, FaEdit, FaTrash,
  FaCheck, FaTimes, FaBan, FaArrowUp, FaArrowDown,
  FaMoneyBillWave, FaPercentage, FaStar, FaEye
} from 'react-icons/fa';

// ─── Sample Data ──────────────────────────────────────────────────────────────
const SAMPLE_STATS = {
  totalRevenue: 187540,
  totalBookings: 348,
  totalHotels: 24,
  totalUsers: 1092,
  occupancyRate: 78,
  revenueGrowth: 12.4,
  bookingsGrowth: 8.1,
};

const SAMPLE_HOTELS = [
  { _id: 'h1', name: 'The Grand Imperial', location: { city: 'Paris', country: 'France' }, rating: 4.9, propertyType: 'Luxury Hotel', featured: true, numReviews: 312 },
  { _id: 'h2', name: 'Azure Bay Resort', location: { city: 'Maldives', country: 'Maldives' }, rating: 4.8, propertyType: 'Beach Resort', featured: false, numReviews: 198 },
  { _id: 'h3', name: 'Skyline Suites', location: { city: 'Dubai', country: 'UAE' }, rating: 4.7, propertyType: 'Business Hotel', featured: true, numReviews: 245 },
];

const SAMPLE_BOOKINGS = [
  { _id: 'b1', userId: { name: 'Sarah Mitchell', email: 'sarah@email.com' }, hotelId: { name: 'The Grand Imperial' }, roomId: { roomType: 'Deluxe King' }, checkIn: '2026-07-10', checkOut: '2026-07-14', totalPrice: 1848, paymentStatus: 'completed', status: 'booked' },
  { _id: 'b2', userId: { name: 'James Tanaka', email: 'james@email.com' }, hotelId: { name: 'Azure Bay Resort' }, roomId: { roomType: 'Ocean Villa' }, checkIn: '2026-07-20', checkOut: '2026-07-25', totalPrice: 4450, paymentStatus: 'pending', status: 'booked' },
  { _id: 'b3', userId: { name: 'Elena Rossi', email: 'elena@email.com' }, hotelId: { name: 'Skyline Suites' }, roomId: { roomType: 'Premier Suite' }, checkIn: '2026-06-01', checkOut: '2026-06-03', totalPrice: 840, paymentStatus: 'completed', status: 'completed' },
  { _id: 'b4', userId: { name: 'Raj Patel', email: 'raj@email.com' }, hotelId: { name: 'The Grand Imperial' }, roomId: { roomType: 'Junior Room' }, checkIn: '2026-05-15', checkOut: '2026-05-18', totalPrice: 1260, paymentStatus: 'refunded', status: 'cancelled' },
];

const SAMPLE_USERS = [
  { _id: 'u1', name: 'Sarah Mitchell', email: 'sarah@email.com', phone: '+1 555-0101', role: 'user', isBlocked: false, createdAt: '2026-01-15' },
  { _id: 'u2', name: 'James Tanaka', email: 'james@email.com', phone: '+81 90-1234-5678', role: 'user', isBlocked: false, createdAt: '2026-02-20' },
  { _id: 'u3', name: 'Elena Rossi', email: 'elena@email.com', phone: '+39 06 1234567', role: 'admin', isBlocked: false, createdAt: '2025-11-01' },
  { _id: 'u4', name: 'Raj Patel', email: 'raj@email.com', phone: '+91 98765 43210', role: 'user', isBlocked: true, createdAt: '2026-03-08' },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, suffix, growth, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-3xl">{icon}</span>
      {growth !== undefined && (
        <span className={`text-xs font-bold flex items-center gap-1 ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {growth >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
          {Math.abs(growth)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-extrabold text-gray-900">{suffix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
    <p className="text-gray-400 text-sm mt-1">{label}</p>
  </motion.div>
);

const statusBadge = {
  booked: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  refunded: 'bg-purple-100 text-purple-700',
};

// ─── Admin Panel ─────────────────────────────────────────────────────────────
const AdminPanel = () => {
  const { userInfo } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [hotelForm, setHotelForm] = useState({ name: '', city: '', country: '', propertyType: '', description: '' });

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, userInfo]);

  if (!userInfo || userInfo.role !== 'admin') {
    return null;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'hotels', label: 'Hotels', icon: <FaHotel /> },
    { id: 'rooms', label: 'Rooms', icon: <FaBed /> },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight">
            Luxe<span className="text-yellow-500">Stay</span>
            <span className="text-xs font-normal text-gray-400 ml-2">Admin</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-yellow-500 text-gray-900'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-gray-900">
              {userInfo.name?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{userInfo.name}</p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
          </div>
          <Link to="/" className="mt-3 w-full block text-center text-xs text-gray-500 hover:text-gray-300 transition">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-extrabold text-white mb-2">Dashboard Overview</h1>
              <p className="text-gray-400 mb-8">Welcome back, {userInfo.name}. Here's what's happening today.</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <StatCard icon="💰" label="Total Revenue" value={SAMPLE_STATS.totalRevenue} suffix="$" growth={SAMPLE_STATS.revenueGrowth} color="border-yellow-500" />
                <StatCard icon="📅" label="Total Bookings" value={SAMPLE_STATS.totalBookings} suffix="" growth={SAMPLE_STATS.bookingsGrowth} color="border-blue-500" />
                <StatCard icon="🏨" label="Hotels Listed" value={SAMPLE_STATS.totalHotels} suffix="" color="border-green-500" />
                <StatCard icon="👥" label="Registered Users" value={SAMPLE_STATS.totalUsers} suffix="" color="border-purple-500" />
              </div>

              {/* Occupancy + Revenue at a glance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-white font-bold text-lg mb-4">Occupancy Rate</h3>
                  <div className="flex items-end gap-4">
                    <p className="text-5xl font-extrabold text-yellow-500">{SAMPLE_STATS.occupancyRate}%</p>
                    <p className="text-gray-400 text-sm pb-2">Average across all properties this month</p>
                  </div>
                  <div className="mt-4 bg-gray-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${SAMPLE_STATS.occupancyRate}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-white font-bold text-lg mb-4">Revenue Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Room Bookings', pct: 72, color: 'bg-yellow-500' },
                      { label: 'Suites & Villas', pct: 18, color: 'bg-blue-500' },
                      { label: 'Extras & Add-ons', pct: 10, color: 'bg-green-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-semibold">{item.pct}%</span>
                        </div>
                        <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                  <h3 className="text-white font-bold text-lg">Recent Bookings</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-yellow-500 text-sm font-medium hover:underline">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        {['Guest', 'Hotel', 'Check-In', 'Amount', 'Status'].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_BOOKINGS.slice(0, 3).map((b) => (
                        <tr key={b._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                          <td className="px-6 py-4 text-white font-medium">{b.userId.name}</td>
                          <td className="px-6 py-4 text-gray-300">{b.hotelId.name}</td>
                          <td className="px-6 py-4 text-gray-400">{new Date(b.checkIn).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-yellow-500 font-bold">${b.totalPrice.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusBadge[b.status]}`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hotels Management */}
          {activeTab === 'hotels' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-1">Hotels</h1>
                  <p className="text-gray-400">Manage all hotel listings</p>
                </div>
                <button
                  onClick={() => setShowAddHotel(true)}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-5 py-3 rounded-xl transition-colors"
                >
                  <FaPlus /> Add Hotel
                </button>
              </div>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        {['Hotel', 'Location', 'Type', 'Rating', 'Reviews', 'Featured', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-6 py-4 text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_HOTELS.map((hotel) => (
                        <tr key={hotel._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                          <td className="px-6 py-4 text-white font-semibold">{hotel.name}</td>
                          <td className="px-6 py-4 text-gray-400">{hotel.location.city}, {hotel.location.country}</td>
                          <td className="px-6 py-4 text-gray-300">{hotel.propertyType}</td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                              <FaStar size={12} /> {hotel.rating}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{hotel.numReviews}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${hotel.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-700 text-gray-400'}`}>
                              {hotel.featured ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition"><FaEdit /></button>
                              <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition"><FaTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Hotel Modal */}
              <AnimatePresence>
                {showAddHotel && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowAddHotel(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-gray-900 rounded-3xl p-8 w-full max-w-lg border border-gray-700"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Add New Hotel</h2>
                        <button onClick={() => setShowAddHotel(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Hotel Name', key: 'name', type: 'text' },
                          { label: 'City', key: 'city', type: 'text' },
                          { label: 'Country', key: 'country', type: 'text' },
                        ].map(({ label, key, type }) => (
                          <div key={key}>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{label}</label>
                            <input type={type} value={hotelForm[key]}
                              onChange={(e) => setHotelForm({ ...hotelForm, [key]: e.target.value })}
                              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Property Type</label>
                          <select value={hotelForm.propertyType}
                            onChange={(e) => setHotelForm({ ...hotelForm, propertyType: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
                            <option value="">Select Type</option>
                            {['Luxury Hotel', 'Beach Resort', 'Business Hotel', 'Boutique Hotel', 'Villa'].map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                          <textarea rows={3} value={hotelForm.description}
                            onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none" />
                        </div>
                        <button
                          onClick={() => { alert('Hotel created! (Connect to API in production)'); setShowAddHotel(false); }}
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition-colors"
                        >
                          Create Hotel
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Bookings Management */}
          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-extrabold text-white mb-2">Bookings</h1>
              <p className="text-gray-400 mb-8">View and manage all reservations</p>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        {['Guest', 'Hotel', 'Room', 'Dates', 'Amount', 'Payment', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-5 py-4 text-gray-400 font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_BOOKINGS.map((b) => (
                        <tr key={b._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                          <td className="px-5 py-4">
                            <p className="text-white font-medium">{b.userId.name}</p>
                            <p className="text-gray-500 text-xs">{b.userId.email}</p>
                          </td>
                          <td className="px-5 py-4 text-gray-300">{b.hotelId.name}</td>
                          <td className="px-5 py-4 text-gray-400">{b.roomId.roomType}</td>
                          <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                            {new Date(b.checkIn).toLocaleDateString()} →<br />{new Date(b.checkOut).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4 text-yellow-500 font-bold">${b.totalPrice.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[b.paymentStatus] || 'bg-gray-700 text-gray-300'}`}>
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge[b.status]}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1">
                              <button className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition" title="View"><FaEye /></button>
                              {b.status === 'booked' && (
                                <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition" title="Cancel"><FaTimes /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-extrabold text-white mb-2">Users</h1>
              <p className="text-gray-400 mb-8">Manage registered users and their roles</p>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        {['User', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-6 py-4 text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_USERS.map((user) => (
                        <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-gray-900 text-sm">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-gray-500 text-xs">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{user.phone}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-700 text-gray-300'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${user.isBlocked ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                              {user.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                className={`p-2 rounded-lg transition text-sm ${user.isBlocked ? 'text-green-400 hover:bg-green-900/30' : 'text-red-400 hover:bg-red-900/30'}`}
                                title={user.isBlocked ? 'Unblock' : 'Block'}
                              >
                                <FaBan />
                              </button>
                              <button className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition" title="Edit Role">
                                <FaEdit />
                              </button>
                              <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition" title="Delete">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rooms Management */}
          {activeTab === 'rooms' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-1">Rooms</h1>
                  <p className="text-gray-400">Manage room inventory and availability</p>
                </div>
                <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-5 py-3 rounded-xl transition-colors">
                  <FaPlus /> Add Room
                </button>
              </div>
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        {['Hotel', 'Room Type', 'Capacity', 'Price/Night', 'Availability', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-6 py-4 text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { hotel: 'The Grand Imperial', type: 'Deluxe King', capacity: '2 Adults', price: 420, available: true },
                        { hotel: 'The Grand Imperial', type: 'Premier Suite', capacity: '2 Adults, 2 Children', price: 720, available: true },
                        { hotel: 'Azure Bay Resort', type: 'Ocean Villa', capacity: '2 Adults', price: 890, available: false },
                        { hotel: 'Skyline Suites', type: 'Standard Twin', capacity: '2 Adults', price: 280, available: true },
                      ].map((room, i) => (
                        <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                          <td className="px-6 py-4 text-white font-medium">{room.hotel}</td>
                          <td className="px-6 py-4 text-gray-300">{room.type}</td>
                          <td className="px-6 py-4 text-gray-400">{room.capacity}</td>
                          <td className="px-6 py-4 text-yellow-500 font-bold">${room.price}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${room.available ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                              {room.available ? 'Available' : 'Sold Out'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition"><FaEdit /></button>
                              <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition"><FaTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
