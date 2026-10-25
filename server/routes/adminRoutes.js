import express from 'express';
import {
  getAllUsers,
  toggleBlockUser,
  changeUserRole,
  deleteUser,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected
router.use(protect, admin);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);

export default router;
