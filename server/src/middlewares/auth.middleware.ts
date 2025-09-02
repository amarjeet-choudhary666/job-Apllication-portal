/// <reference path="../types/express.d.ts" />


import { User } from "../models/userModel";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyAccessToken } from "../utils/jwt";


export const authMiddleware = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decodeToken = verifyAccessToken(token) as {userId: string};
        
        const existingUser = await User.findById(decodeToken.userId).select("-password -refreshToken");

        if(!existingUser) {
            throw new ApiError(401, "Unauthorized");
        }

        req.user = existingUser;

        next();

    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }
})