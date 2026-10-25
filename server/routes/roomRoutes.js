import express from 'express';
import {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomAvailability,
} from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/hotel/:hotelId').get(getRoomsByHotel);
router.route('/availability/:id').put(protect, updateRoomAvailability);
router.route('/').post(protect, admin, createRoom);
router.route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

export default router;
