import express from "express";
import { creatBooking, getOccupiedSeats } from "../controller/bookingController.js";
import authUser from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/create', authUser, creatBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;