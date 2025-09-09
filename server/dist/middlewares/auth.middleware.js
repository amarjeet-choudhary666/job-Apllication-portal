"use strict";
/// <reference path="../types/express.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const userModel_1 = require("../models/userModel");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const jwt_1 = require("../utils/jwt");
exports.authMiddleware = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new apiError_1.ApiError(401, "Unauthorized");
    }
    const token = authHeader.split("Bearer ")[1];
    try {
        const decodeToken = (0, jwt_1.verifyAccessToken)(token);
        const existingUser = await userModel_1.User.findById(decodeToken.userId).select("-password -refreshToken");
        if (!existingUser) {
            throw new apiError_1.ApiError(401, "Unauthorized");
        }
        req.user = existingUser;
        next();
    }
    catch (error) {
        throw new apiError_1.ApiError(401, "Unauthorized");
    }
});
