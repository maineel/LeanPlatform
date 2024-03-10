import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    refreshToken:{
        type: String
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            review: {
                type: String,
                required: true
            },
        }
    ],
    recommendations:[
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            recommendation: {
                type: String,
                required: true
            },
            shareableLink: {
                type: String,
                unique: true
            }
        }
    ]
}, {timestamps: true});

mentorSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

mentorSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

mentorSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
};

mentorSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            password: this.password,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
};

export const Mentor = mongoose.model('Mentor', mentorSchema);