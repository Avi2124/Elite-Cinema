import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
};

//Route for user login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: "User does not exists"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = createToken(user._id);
            res.json({success: true, token});
        } else {
            return res.json({success: false, message: "Invalid credentials"});
        }
    } catch (error) {
        console.log(error);
        res.json({succcess: false, message: error.message});        
    }
};

// Route for user registration
const registerUser = async (req, res) => {    
  try {
    const { name, email, password, phone, image} = req.body;

    //Checking user already exists or not
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    //Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: "Please enter a valid email",});
    }
    if (!password || password.length < 8) {
      return res.json({success: false, message: "Password must be at least 8 characters",});
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.json({ success: false, message: "Please enter a valid 10-digit phone number" });
    }

    //Hashing User Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create custom string id
    const userId = `user_${Date.now()}`;

    const newUser = new User({
      _id: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      image: image || "https://t4.ftcdn.net/jpg/07/03/86/11/360_F_703861114_7YxIPnoH8NfmbyEffOziaXy0EO1NpRHD.jpg",
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API Controller Function to get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    // const user = req.userId;
    const userId = req.userId;

    const bookings = await Booking.find({user: userId}).populate({
      path: "show",
      populate: {path: "movie"}
    }).sort({createdAt: -1})
    res.json({success: true, bookings})
  } catch (error) {
    console.error(error.message);
    res.json({success: false, message: error.message});
  }
}

// API Controller Function to update Favourite Movie
export const updateFavourite = async (req, res) => {
    try {
        const {movieId} = req.body;
        const userId = req.userId;
        if(!movieId){
          return res.json({success: false, message: "Movie Id is Required"});
        }
        const user = await User.findById(userId);
        if(!user) return res.json({succcess: false, message: "User not found"});
        if(!user.favourites){
          user.favourites = [];
        }
        const alreadyFav = user.favourites.includes(movieId);
        if(!alreadyFav){
          user.favourites.push(movieId);
        } else {
          user.favourites = user.favourites.filter((id) => id !== movieId);
        }

        await user.save();
        return res.json({success: true, message: "Favourite Movies Updated", favourites: user.favourites});
    } catch (error) {
      console.error(error.message);
      res.json({success: false, message: error.message});
    }
};

export const getFavourites = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const favourites = user.favourites || [];

    // If no favourites yet
    if (!user.favourites || user.favourites.length === 0) {
      return res.json({ success: true, movies: [] });
    }

    // Get movies from DB using the stored ids
    const movies = await Movie.find({ _id: { $in: user.favourites } });

    return res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};


export { loginUser, registerUser };