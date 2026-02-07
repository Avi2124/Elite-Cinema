import { METHODS } from "http";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from "stripe";

// Function to check availability of selected seats for a movie
export const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const timeCount = new Date(Date.now() - 5 * 60 * 1000); // 10 minutes ago

    const activeBlockingBookings = await Booking.find({
      show: showId,
      bookedSeats: { $in: selectedSeats },
      $or: [
        { isPaid: true },                        // paid bookings always block
        { isPaid: false, createdAt: { $gt: timeCount } }, // unpaid but <10min
      ],
    });

    return activeBlockingBookings.length === 0;
  } catch (error) {
    console.log("checkSeatsAvailability error:", error.message);
    return false;
  }
};

export const creatBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    if (!showId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.json({
        success: false,
        message: "Show ID and selected seats are required.",
      });
    }

    // ✅ Check if the seats are available right now
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected Seats are not available.",
      });
    }

    // Get the show details
    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.json({ success: false, message: "Show not found." });
    }

    // Create a new booking (PENDING / unpaid)
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
      isPaid: false,
    });

    // ❌ IMPORTANT: do NOT lock seats in showData.occupiedSeats here.
    // Pending bookings are handled purely via Booking + createdAt + isPaid.

    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Creating line items for stripe
    const line_items = [
      {
        price_data: {
          currency: "INR",
          product_data: {
            name: showData.movie.title,
          },
          unit_amount: Math.floor(booking.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items,
      mode: "payment",
      metadata: {
        bookingId: booking._id.toString(),
      },
      // Stripe session expires in 30 minutes (independent of our 10-min hold)
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    booking.paymentLink = session.url;
    await booking.save();

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log("creatBooking error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Use Booking + time window to compute currently occupied seats
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    if (!showId) {
      return res.json({ success: false, message: "Show ID is required" });
    }

    const timeCount = new Date(Date.now() - 5 * 60 * 1000); // 10 minutes ago

    // Find all bookings that should currently block seats
    const activeBookings = await Booking.find({
      show: showId,
      $or: [
        { isPaid: true },                        // paid = always blocked
        { isPaid: false, createdAt: { $gt: timeCount } }, // unpaid <10min
      ],
    });

    const occupiedSeatsSet = new Set();
    activeBookings.forEach((booking) => {
      (booking.bookedSeats || []).forEach((seat) =>
        occupiedSeatsSet.add(seat)
      );
    });

    const occupiedSeats = Array.from(occupiedSeatsSet);

    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log("getOccupiedSeats error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
