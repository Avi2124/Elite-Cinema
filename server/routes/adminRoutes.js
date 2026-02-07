import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { adminLogin, deleteBooking, deleteUser, getAllBookings, getAllShows, getAllUsers, getDashboardData, isAdmin } from "../controller/adminController.js";
import { deleteShow } from "../controller/showController.js";


const adminRouter = express.Router();

adminRouter.post("/admin", adminLogin);

adminRouter.get('/is-admin', adminAuth, isAdmin)
adminRouter.get('/dashboard', adminAuth, getDashboardData)
adminRouter.get('/all-shows', adminAuth, getAllShows)
adminRouter.get('/all-bookings', adminAuth, getAllBookings)
adminRouter.get('/all-users', adminAuth, getAllUsers)
adminRouter.delete("/users/:id", adminAuth, deleteUser);   
adminRouter.delete("/bookings/:id", adminAuth, deleteBooking);   
adminRouter.delete("/shows/:id", adminAuth, deleteShow);   

export default adminRouter;