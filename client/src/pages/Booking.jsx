import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaHotel, FaBed, FaUsers, FaCalendarCheck, FaShieldAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const STEPS = ['Review', 'Guest Info', 'Payment', 'Confirmation'];

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth);
  const { user: firebaseUser } = useAuth();

  const [step, setStep] = useState(0);
  const [guestInfo, setGuestInfo] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: '',
    specialRequests: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  if (!state) {
    navigate('/hotels');
    return null;
  }

  const { hotel, room, checkIn, checkOut, guests, nights } = state;
  const subtotal = room.price * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleConfirm = () => {
    const newBooking = {
      _id: `BKG-${Date.now()}`,
      userId: userInfo?._id || firebaseUser?.uid || 'guest',
      userEmail: guestInfo.email,
      hotelId: {
        _id: hotel._id || hotel.id,
        name: hotel.name,
        location: hotel.location,
        images: hotel.images
      },
      roomId: {
        _id: room._id,
        roomType: room.roomType,
        price: room.price,
        images: room.images
      },
      checkIn,
      checkOut,
      guests,
      totalPrice: total,
      status: 'booked',
      createdAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem('luxeStay_bookings') || '[]');
    localStorage.setItem('luxeStay_bookings', JSON.stringify([newBooking, ...existingBookings]));

    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                i === step ? 'bg-yellow-500 text-gray-900' :
                i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? <FaCheckCircle size={14} /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 3 ? (
          /* Confirmation */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto bg-white rounded-3xl p-10 shadow-xl text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your reservation at <strong>{hotel.name}</strong> has been confirmed. A confirmation email will be sent to <strong>{guestInfo.email}</strong>.</p>
            <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Booking ID</span><span className="font-bold text-gray-900">#LXST{Date.now().toString().slice(-6)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Hotel</span><span className="font-bold text-gray-900">{hotel.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Room</span><span className="font-bold text-gray-900">{room.roomType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Check-In</span><span className="font-bold text-gray-900">{new Date(checkIn).toDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Check-Out</span><span className="font-bold text-gray-900">{new Date(checkOut).toDateString()}</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-700 font-semibold">Total Paid</span><span className="font-extrabold text-yellow-600 text-base">${total.toLocaleString()}</span></div>
            </div>
            <button onClick={() => navigate('/dashboard')} className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition-colors">
              View My Bookings
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FaHotel className="text-yellow-500" /> Review Your Booking</h2>
                  <div className="flex gap-5 items-start p-5 bg-gray-50 rounded-2xl mb-5">
                    <img src={room.images?.[0]} alt="" className="w-28 h-20 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{room.roomType}</h3>
                      <p className="text-gray-500 text-sm">{hotel.name} · {hotel.location.city}, {hotel.location.country}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><FaCalendarCheck size={12} className="text-yellow-500" /> {new Date(checkIn).toLocaleDateString()} – {new Date(checkOut).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><FaUsers size={12} className="text-yellow-500" /> {guests} Guests</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {room.facilities.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-gray-600"><FaCheckCircle size={12} className="text-green-500" />{f}</div>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-2xl transition-colors">
                    Continue to Guest Info
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FaUsers className="text-yellow-500" /> Guest Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text' },
                      { label: 'Email', key: 'email', type: 'email' },
                      { label: 'Phone', key: 'phone', type: 'tel' },
                    ].map(({ label, key, type }) => (
                      <div key={key}>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{label}</label>
                        <input type={type} value={guestInfo[key]} onChange={(e) => setGuestInfo({ ...guestInfo, [key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Special Requests (optional)</label>
                      <textarea rows={3} value={guestInfo.specialRequests} onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={() => setStep(2)} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-2xl transition-colors">Proceed to Payment</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FaCreditCard className="text-yellow-500" /> Secure Payment</h2>
                  <div className="flex gap-3 mb-6">
                    {['card', 'upi'].map((m) => (
                      <button key={m} onClick={() => setPaymentMethod(m)}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${paymentMethod === m ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 text-gray-500'}`}>
                        {m === 'card' ? '💳 Credit / Debit Card' : '📱 UPI / Razorpay'}
                      </button>
                    ))}
                  </div>
                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Card Number</label>
                        <input type="text" maxLength={19} placeholder="1234 5678 9012 3456" value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Expiry Date</label>
                          <input type="text" placeholder="MM / YY" maxLength={7} value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">CVV</label>
                          <input type="text" placeholder="•••" maxLength={3} value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Cardholder Name</label>
                        <input type="text" placeholder="As on card" value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl">
                      <p className="text-4xl mb-3">📱</p>
                      <p className="text-gray-600 font-medium">UPI / Razorpay integration</p>
                      <p className="text-xs text-gray-400 mt-1">Connect your Razorpay API keys in .env to enable</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">
                    <FaShieldAlt /> <span>Your payment is secured with 256-bit SSL encryption</span>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={handleConfirm} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-2xl transition-colors">
                      Pay ${total.toLocaleString()}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-28">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>
                <img src={room.images?.[0]} alt="" className="w-full h-36 object-cover rounded-2xl mb-5" />
                <div className="space-y-2 text-sm text-gray-600 mb-5">
                  <div className="flex justify-between"><span>Room</span><span className="font-semibold text-gray-900">{room.roomType}</span></div>
                  <div className="flex justify-between"><span>Nights</span><span className="font-semibold text-gray-900">{nights}</span></div>
                  <div className="flex justify-between"><span>Rate/night</span><span className="font-semibold text-gray-900">${room.price}</span></div>
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-gray-900">${subtotal}</span></div>
                  <div className="flex justify-between"><span>Taxes (12%)</span><span className="font-semibold text-gray-900">${taxes}</span></div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 mt-2">
                    <span className="font-bold text-gray-900 text-base">Total</span>
                    <span className="font-extrabold text-yellow-600 text-base">${total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>✅ Free cancellation</p>
                  <p>✅ Best price guarantee</p>
                  <p>✅ No hidden fees</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
