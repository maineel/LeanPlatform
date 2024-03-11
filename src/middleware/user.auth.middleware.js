import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if(!accessToken){
            throw new ApiError(401, "Please login to access this functionality");
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "User Unauthorized");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Unauthorized");
    }
    
});

export { verifyJWT };