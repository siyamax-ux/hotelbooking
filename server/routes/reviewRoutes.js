import express from 'express';
import { getReviewsByHotel, createReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/hotel/:hotelId').get(getReviewsByHotel);

export default router;
