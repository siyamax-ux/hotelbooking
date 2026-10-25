import express from 'express';
import { getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user profile (requires Firebase-authenticated user)
router.get('/profile', protect, getUserProfile);

export default router;
