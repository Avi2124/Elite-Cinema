import express from "express";
import { getFavourites, getUserBookings, loginUser, registerUser, updateFavourite } from "../controller/userController.js";
import authUser from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get('/bookings', authUser, getUserBookings)
userRouter.post('/update-favourite', authUser, updateFavourite)
userRouter.get('/favourite', authUser, getFavourites)

export default userRouter;