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
            totalBokings: bookings.length,
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