import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { Mentor } from '../models/mentor.model.js';

const generatAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken};
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password ){
        throw new ApiError(400, 'All fields are required');
    }

    const userExists = await User.findOne({email});
    if(userExists){
        throw new ApiError(400, 'User with this email already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new ApiError(400, 'All fields are required');
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, 'User with this email does not exist');
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generatAccessAndRefreshTokens(user._id);
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, 
            "User logged in successfully"
        )
    );

});

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    
    if(!user){
        throw new ApiError(401, "User not found");
    }

    user.refreshToken = "";
    await user.save();
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200, 
            {},
            "User logged out successfully!!"
        )
    )
});

const rateMentor = asyncHandler(async (req, res) => {
    const { mentorId, userId, rating } = req.body;

    if(!mentorId || !userId || !rating && rating !== 0){
        throw new ApiError(400, 'All fields are required');
    }

    if(rating < 1 || rating > 5){
        throw new ApiError(400, 'Rating should be between 1 and 5');
    }

    const userExists = await User.findById(userId);
    const mentorExists = await Mentor.findById(mentorId);

    if(!userExists || !mentorExists){
        throw new ApiError(400, 'User or Mentor does not exist');
    }

    const mentor = await Mentor.findById(mentorId);
    const oldRating = mentor.overallRating * mentor.numRatings;
    mentor.numRatings += 1;
    mentor.overallRating = (oldRating + rating) / mentor.numRatings;

    await mentor.save();

    return res
    .status(200)
    .json(new ApiResponse(200, mentor, "Mentor rated successfully"))

});

const reviewMentor = asyncHandler(async (req, res) => {
    const { mentorId, userId, review } = req.body;

    if(!mentorId || !userId || !review){
        throw new ApiError(400, 'All fields are required');
    }

    if(review.length > 50){
        throw new ApiError(400, 'Review should be less than 50 characters');
    }

    const userExists = await User.findById(userId);
    const mentorExists = await Mentor.findById(mentorId);

    if(!userExists || !mentorExists){
        throw new ApiError(400, 'User or Mentor does not exist');
    }

    const mentor = await Mentor.findById(mentorId);
    mentor.reviews.push({userId, review});
    await mentor.save();

    return res
    .status(200)
    .json(new ApiResponse(200, mentor, "Mentor reviewed successfully"))
});

const getMentorDetails = asyncHandler(async (req, res) => {
    const {mentorId} = req.body;

    if(!mentorId){
        throw new ApiError(400, 'Mentor ID is required');
    }

    const mentor = await Mentor.findById(mentorId,{name:1, email:1, overallRating:1, numRatings:1, reviews:1});

    if(!mentor){
        throw new ApiError(404, 'Mentor not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, mentor, "Mentor details fetched successfully"));
});

export { registerUser, loginUser, logoutUser, rateMentor, reviewMentor, getMentorDetails };