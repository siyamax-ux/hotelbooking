import Review from '../models/Review.js';
import Hotel from '../models/Hotel.js';

// @desc    Get all reviews for a hotel
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
export const getReviewsByHotel = async (req, res) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId }).populate('userId', 'name avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { hotelId, rating, comment } = req.body;

    const alreadyReviewed = await Review.findOne({
      userId: req.user._id,
      hotelId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this hotel' });
    }

    const review = await Review.create({
      userId: req.user._id,
      hotelId,
      rating,
      comment,
    });

    // Update hotel rating
    const reviews = await Review.find({ hotelId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Hotel.findByIdAndUpdate(hotelId, {
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
