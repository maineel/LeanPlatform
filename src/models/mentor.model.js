import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        index: true
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    overallRating:{
        type: Number,
        default: 0
    },
    numRatings: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

export const Mentor = mongoose.model('Mentor', mentorSchema);