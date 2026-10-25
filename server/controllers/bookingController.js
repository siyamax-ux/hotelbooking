import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { hotelId, roomId, roomNumber, checkIn, checkOut, guests, totalPrice } = req.body;

    // Verify room exists and is available
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const booking = new Booking({
      userId: req.user._id,
      hotelId,
      roomId,
      roomNumber,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      paymentStatus: 'pending',
    });

    const createdBooking = await booking.save();

    // Mark room dates unavailable
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const datesToBlock = [];
    let currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      datesToBlock.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    await Room.updateOne(
      { _id: roomId, 'roomNumbers.number': roomNumber },
      { $push: { 'roomNumbers.$.unavailableDates': { $each: datesToBlock } } }
    );

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name location images')
      .populate('roomId', 'roomType price images')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotelId')
      .populate('roomId')
      .populate('userId', 'name email');

    if (booking && booking.userId._id.toString() === req.user._id.toString()) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('hotelId', 'name')
      .populate('roomId', 'roomType')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
