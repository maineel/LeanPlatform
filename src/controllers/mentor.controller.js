import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { Mentor } from '../models/mentor.model.js';


const generatAccessAndRefreshTokens = async(mentorId) => {
    try {
        const mentor = await Mentor.findById(mentorId);
        const accessToken = mentor.generateAccessToken();
        const refreshToken = mentor.generateRefreshToken();

        mentor.refreshToken = refreshToken;
        await mentor.save({validateBeforeSave:false})
        return {accessToken,refreshToken};
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
};

const registerMentor = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password ){
        throw new ApiError(400, 'All fields are required');
    }

    const mentorExists = await Mentor.findOne({email});
    if(mentorExists){
        throw new ApiError(400, 'Mentor with this email already exists');
    }

    const mentor = await Mentor.create({
        name,
        email,
        password,
    });

    const createdMentor = await Mentor.findById(mentor._id).select(
        "-password -refreshToken"
    )

    if(!createdMentor){
        throw new ApiError(500, "Something went wrong while registering the mentor");
    }

    return res.status(201).json(
        new ApiResponse(200, createdMentor, "Mentor registered successfully")
    )
});

const loginMentor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new ApiError(400, 'All fields are required');
    }

    const mentor = await Mentor.findOne({email});
    if(!mentor){
        throw new ApiError(404, 'Mentor with this email does not exist');
    }

    const isPasswordCorrect = await mentor.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generatAccessAndRefreshTokens(mentor._id);
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
                mentor: mentor,
                accessToken: accessToken,
                refreshToken: refreshToken
            }, 
            "Mentor logged in successfully"
        )
    );

});

const logoutMentor = asyncHandler(async (req, res) => {
    const mentor = req.mentor;
    
    if(!mentor){
        throw new ApiError(401, "Mentor not found");
    }

    mentor.refreshToken = "";
    await mentor.save();
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
            "Mentor logged out successfully!!"
        )
    )
});


export { registerMentor, loginMentor, logoutMentor}