import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetMyBookingsQuery, useCancelBookingMutation } from '../slices/hotelsApiSlice';
import { useAuth } from '../AuthContext';
import {
  FaUser,
  FaCalendarAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaHotel,
  FaCompass,
} from 'react-icons/fa';

const statusConfig = {
  booked: { color: 'bg-blue-100 text-blue-700', icon: <FaClock />, label: 'Upcoming' },
  completed: { color: 'bg-green-100 text-green-700', icon: <FaCheckCircle />, label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: <FaTimesCircle />, label: 'Cancelled' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: firebaseUser, loading: authLoading, logout } = useAuth();
  const { userInfo } = useSelector((state) => state.auth);
  const redirectAttemptedRef = useRef(false);

  // Debugging log for auth state
  useEffect(() => {
    console.log('Dashboard Auth State:', { firebaseUser: !!firebaseUser, authLoading });
  }, [firebaseUser, authLoading]);

  const shouldFetchBookings = Boolean(firebaseUser) && !authLoading;
  
  // Removed default array initialization to prevent new references on every render
  const { data: apiBookings, isLoading, error } = useGetMyBookingsQuery(undefined, { skip: !shouldFetchBookings });
  const [cancelBooking] = useCancelBookingMutation();

  const [localBookings, setLocalBookings] = React.useState([]);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('luxeStay_bookings') || '[]');
    const userEmail = userInfo?.email || firebaseUser?.email;
    const userId = userInfo?._id || firebaseUser?.uid;
    const userBookings = savedBookings.filter(b => b.userEmail === userEmail || b.userId === userId);
    setLocalBookings(userBookings);
  }, [userInfo, firebaseUser]);

  // Merge API and local bookings, ensuring no duplicates and stable reference
  const safeBookings = useMemo(() => {
    const api = Array.isArray(apiBookings) ? apiBookings : [];
    const merged = [...localBookings];
    api.forEach(b => {
      if (!merged.find(mb => mb._id === b._id)) merged.push(b);
    });
    return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [apiBookings, localBookings]);

  const upcomingBookings = useMemo(
    () => safeBookings.filter((booking) => {
      if (!booking?.checkIn) return false;
      const checkInDate = new Date(booking.checkIn);
      return !isNaN(checkInDate) && checkInDate > new Date() && booking.status !== 'cancelled';
    }),
    [safeBookings],
  );

  const totalBookings = safeBookings.length;
  const completedBookings = safeBookings.filter((booking) => booking.status === 'completed').length;
  const cancelledBookings = safeBookings.filter((booking) => booking.status === 'cancelled').length;

  useEffect(() => {
    if (error) {
      console.error('Bookings API Error:', error);
      if (error.status === 401 && !redirectAttemptedRef.current) {
        console.warn('Unauthorized (401). Logging out to prevent loop...');
        redirectAttemptedRef.current = true;
        
        // Log out first so Login component doesn't immediately redirect back to Dashboard
        if (logout) {
          logout().then(() => {
            navigate('/login', { replace: true, state: { from: location.pathname } });
          }).catch((err) => {
            console.error('Logout failed:', err);
            navigate('/login', { replace: true, state: { from: location.pathname } });
          });
        } else {
          navigate('/login', { replace: true, state: { from: location.pathname } });
        }
      }
    }
  }, [error, navigate, location.pathname, logout]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Authentication Required</h2>
        <p className="text-slate-600">Please log in to view your dashboard.</p>
        <Link to="/login" className="rounded-full bg-yellow-500 px-6 py-2 font-semibold text-slate-900 shadow-md">Go to Login</Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const displayName = userInfo?.name || firebaseUser?.displayName || 'Traveller';
  const displayEmail = userInfo?.email || firebaseUser?.email || 'your account';
  const userRole = userInfo?.role || 'Guest';

  const handleCancel = async (bookingId) => {
    try {
      if (bookingId.toString().startsWith('BKG-')) {
        const saved = JSON.parse(localStorage.getItem('luxeStay_bookings') || '[]');
        const updated = saved.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b);
        localStorage.setItem('luxeStay_bookings', JSON.stringify(updated));
        
        const userEmail = userInfo?.email || firebaseUser?.email;
        const userId = userInfo?._id || firebaseUser?.uid;
        setLocalBookings(updated.filter(b => b.userEmail === userEmail || b.userId === userId));
      } else {
        await cancelBooking(bookingId).unwrap();
      }
    } catch (error) {
      console.error('Cancel failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-2 mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-black px-8 py-12 text-white shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-yellow-300">Dashboard</p>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">Welcome back, {displayName}</h1>
              <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-2xl">
                Manage your stays, view upcoming reservations, and discover handpicked offers tailored for your next luxury escape.
              </p>
            </div>
            <div className="rounded-[2rem] bg-white/10 border border-white/10 p-6 shadow-xl backdrop-blur-xl w-full sm:w-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-3xl bg-yellow-500 text-slate-900 flex items-center justify-center text-2xl shadow-lg">
                  <FaUser />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Account</p>
                  <p className="text-lg font-semibold">{displayEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Role</p>
                  <p className="mt-2 font-semibold capitalize">{userRole}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Bookings</p>
                  <p className="mt-2 font-semibold">{totalBookings}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="order-3 mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { title: 'Upcoming stays', value: upcomingBookings.length, icon: <FaCalendarAlt size={20} />, color: 'from-yellow-500 to-orange-400' },
            { title: 'Completed stays', value: completedBookings, icon: <FaCheckCircle size={20} />, color: 'from-green-500 to-teal-400' },
            { title: 'Cancelled', value: cancelledBookings, icon: <FaTimesCircle size={20} />, color: 'from-red-500 to-rose-400' },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
                  <p className="mt-4 text-3xl font-extrabold text-slate-900">{item.value}</p>
                </div>
                <div className={`h-14 w-14 rounded-3xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xl`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-1 flex flex-col gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Bookings overview</p>
                <h2 className="mt-2 text-[30px] font-bold leading-tight text-slate-900">Your recent reservations</h2>
              </div>
              <Link
                to="/hotels"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-yellow-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md shadow-yellow-200/30 transition hover:bg-yellow-400"
              >
                Explore hotels
              </Link>
            </div>

            <div className="min-h-[280px] rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
              {error && error.status !== 401 ? (
                 <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                   <FaTimesCircle className="text-red-500 text-4xl" />
                   <p className="text-red-600 font-medium">Failed to load bookings. Please try again later.</p>
                 </div>
              ) : isLoading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <p className="text-slate-500">Loading your bookings…</p>
                </div>
              ) : safeBookings.length === 0 ? (
                <div className="py-20 text-center text-slate-500">
                  No bookings yet. Start exploring luxury stays and reserve your first trip.
                </div>
              ) : (
                <div className="space-y-5">
                  {safeBookings.map((booking) => {
                    const status = statusConfig[booking.status] || statusConfig.booked;
                    return (
                      <div key={booking._id} className="rounded-[1.75rem] border border-slate-200 p-5 sm:p-6 hover:shadow-lg transition">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-slate-500">{booking.hotelId?.name || 'Untitled Hotel'}</p>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">{booking.roomId?.roomType || 'Standard Room'}</h3>
                          </div>
                          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.color}`}>
                            {status.icon} {status.label}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Location</p>
                            <p className="mt-2 text-sm text-slate-700">{booking.hotelId?.location?.city || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Dates</p>
                            <p className="mt-2 text-sm text-slate-700">
                              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Price</p>
                            <p className="mt-2 text-sm text-slate-700">${booking.totalPrice?.toLocaleString() || '0'}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Room</p>
                            <p className="mt-2 text-sm text-slate-700">{booking.roomId?.roomType || 'Room'}</p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-slate-500">Booking ID: {booking._id}</div>
                          {booking.status === 'booked' && (
                            <button
                              onClick={() => handleCancel(booking._id)}
                              className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                            >
                              Cancel booking
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
              <div className="flex items-center gap-3 text-slate-900 mb-5">
                <div className="rounded-3xl bg-yellow-500 p-3 text-white">
                  <FaHotel size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Travel tip</p>
                  <p className="text-lg font-semibold">Plan ahead for peak-season stays</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">Book at least 30 days in advance for top luxury hotels, then use your dashboard to keep all itineraries in one place.</p>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
              <div className="flex items-center gap-3 text-slate-900 mb-5">
                <div className="rounded-3xl bg-slate-900 p-3 text-white">
                  <FaCompass size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
                  <p className="text-lg font-semibold">Navigate your account</p>
                </div>
              </div>
              <div className="grid gap-4">
                <Link to="/hotels" className="block rounded-3xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition">Explore hotels</Link>
                <Link to="/offers" className="block rounded-3xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition">View offers</Link>
                <Link to="/destinations" className="block rounded-3xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition">Browse destinations</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
