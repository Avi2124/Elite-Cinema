import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { adminLogin, getAllBookings, getAllShows, getDashboardData, isAdmin } from "../controller/adminController.js";


const adminRouter = express.Router();

adminRouter.post("/admin", adminLogin);

adminRouter.get('/is-admin', adminAuth, isAdmin)
adminRouter.get('/dashboard', adminAuth, getDashboardData)
adminRouter.get('/all-shows', adminAuth, getAllShows)
adminRouter.get('/all-bookings', adminAuth, getAllBookings)

export default adminRouter;