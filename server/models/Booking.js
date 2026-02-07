import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, required: true, ref: 'Show'},
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean, required: true, default: false},
    paymentLink: {type: String, default: false},
}, {timestamps: true});

bookingSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 300, // 10 minutes
    partialFilterExpression: { isPaid: false }, // only unpaid bookings
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;