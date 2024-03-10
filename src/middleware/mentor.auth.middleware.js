import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Mentor } from "../models/mentor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!accessToken){
            throw new ApiError(401, "No Access Token Found");
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
        const mentor = await Mentor.findById(decoded?._id).select("-password -refreshToken");
    
        if(!mentor){
            throw new ApiError(401, "Unauthorized");
        }
    
        req.user = mentor;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Unauthorized");
    }
    
});

export { verifyJWT };