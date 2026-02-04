import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature error:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    console.log("Stripe event received:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Session in webhook:", session.id, session.metadata);

        const { bookingId } = session.metadata || {};
        if (!bookingId) {
          console.error("No bookingId found in session metadata");
          break;
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            isPaid: true,
            paymentLink: ""
          },
          { new: true }
        );

        console.log("Booking updated from webhook:", updatedBooking);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    response.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    response.status(500).send("Internal Server Error");
  }
};
