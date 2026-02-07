import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";


// API to check if user is admin
export const isAdmin = async (req, res) => {
    res.json({success: true, isAdmin: true})
}

//Route for Admin login
export const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            // const token = jwt.sign(email+password, process.env.JWT_SECRET);
            const token = jwt.sign({isAdmin: true}, process.env.JWT_SECRET, {expiresIn:"1d"});
            return res.json({success:true, token})
        } else {
            return res.json({success:false, message:"Admin Credentials Invalid"})
        }        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})        
    }
};

// API to get dashboard data

export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');
        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        }
        res.json({success: true, dashboardData})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}

// API to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime:1})
        res.json({success:true, shows})
    } 
    catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})        
    }
}

// API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createAt: -1})
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})        
    }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")       // do not send password
      .sort({ createdAt: -1 });  // newest first

    return res.status(200).json({
      success: true,
      users,                     // 👈 MUST be "users"
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Booking.findByIdAndDelete(id);

        if(!deleted){
            return res.json({success: false, message:"Booking not found"});
        }
        return res.json({success: true, message: "Booking Deleted Successfully"});
    } catch (error) {
        console.error("deleteBooking error:", error);
        return res.json({success: false, message: error.message});
    }
};