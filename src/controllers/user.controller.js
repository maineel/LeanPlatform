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
        "-password -refreshToken -createdAt -updatedAt -__v -recommendations"
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

    const userObj = await User.findById(user._id,{  password: 0, refreshToken: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, userObj, "User logged in successfully!"));

});

const logoutUser = asyncHandler(async (req, res) => {
    
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {refreshToken:1}
        },
        {
            new:true
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {},"User logged out successfully!"))
});

const rateMentor = asyncHandler(async (req, res) => {
    const { mentorId, userId, rating } = req.body;

    if(!mentorId || !userId || !rating && rating !== 0){
        throw new ApiError(400, 'All fields are required');
    }

    if(rating < 1 || rating > 5){
        throw new ApiError(400, 'Rating should be between 1 and 5');
    }
    
    if(rating%1 !== 0){
        throw new ApiError(400, 'Rating should be an integer between 1 and 5');
    }

    const userExists = await User.findById(userId);
    const mentorExists = await Mentor.findById(mentorId);

    if(!userExists || !mentorExists){
        throw new ApiError(400, 'User or Mentor does not exist');
    }

    const mentor = await Mentor.findById(mentorId);
    const oldRating = mentor.overallRating * mentor.numRatings;
    mentor.numRatings += 1;
    mentor.overallRating = Math.round((oldRating + rating) / mentor.numRatings);

    await mentor.save();

    const mentorRating = await Mentor.findById(mentorId).select("overallRating");

    return res
    .status(200)
    .json(new ApiResponse(200, mentorRating, "Mentor rated successfully"))
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

    const mentorReview = await Mentor.findById(mentorId).select("reviews");

    return res
    .status(200)
    .json(new ApiResponse(200, mentorReview, "Mentor reviewed successfully"))
});

const getMentorDetails = asyncHandler(async (req, res) => {
    const { rating} = req.body;

    if(!rating && rating !== 0){
        throw new ApiError(400, 'Rating is required');
    }

    if(rating < 1 || rating > 5){
        throw new ApiError(400, 'Rating should be between 1 and 5');
    }

    if(rating%1 !== 0){
        throw new ApiError(400, 'Rating should be an integer between 1 and 5');
    }

    const mentor = await Mentor.find({"overallRating":rating},{name:1, email:1, overallRating:1, reviews:1});

    if(!mentor){
        throw new ApiError(404, `Mentors with given ${rating} not found`);
    }

    if(mentor.length === 0){
        return res
        .status(200)
        .json(new ApiResponse(200, mentor, `No mentors with rating: ${rating}`));
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, mentor, "Mentor details fetched successfully"));
});

const getRecommendations = asyncHandler(async (req, res) => {
    const {link} = req.body;
    
    if(!link){
        throw new ApiError(400, 'Recommendation Link is required');
    }
    
    const mentor = await Mentor.findOne({ 'recommendations.shareableLink': link }).select("-password -refreshToken -numRatings -overallRating -createdAt -updatedAt -__v -reviews -id");

    if (!mentor) {
        throw new ApiError(404, 'Recommendation not found');
    }

    const recommendation = mentor.recommendations.find(rec => rec.shareableLink === link);

    return res
    .status(200)
    .json(new ApiResponse(200, {mentor}, "Recommendation fetched successfully"));
});

export { registerUser, loginUser, logoutUser, rateMentor, reviewMentor, getMentorDetails, getRecommendations };