import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password : {type:String, required:true},
    phone: {type: String, required: true, match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],},
    image: {type: String, required: true, default: "https://t4.ftcdn.net/jpg/07/03/86/11/360_F_703861114_7YxIPnoH8NfmbyEffOziaXy0EO1NpRHD.jpg"},
    favourites: { type: [String], ref: "Movie", default: [] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

export default User;