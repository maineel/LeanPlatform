import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    mentorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviewContent:{
        type: String,
        required: true,
        maxLength: 50
    }
}, {timestamps: true});

export const Review = mongoose.model('Review', reviewSchema);