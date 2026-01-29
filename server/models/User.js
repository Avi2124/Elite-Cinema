import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password : {type:String, required:true},
    phone: {type: String, required: true, match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],},
    image: {type: String, required: true, default: "https://i.pravatar.cc/150?img=12"},
    favourites: { type: [String], ref: "Movie", default: [] }
});

const User = mongoose.model('User', userSchema)

export default User;