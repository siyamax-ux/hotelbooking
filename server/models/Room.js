import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomType: { type: String, required: true },
  description: { type: String },
  capacity: {
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 }
  },
  facilities: [{ type: String }],
  images: [{ type: String }],
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  roomNumbers: [{ number: Number, unavailableDates: [{ type: Date }] }]
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;
