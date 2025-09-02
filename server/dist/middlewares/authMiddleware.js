"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.verifyJWT = void 0;
const userModel_1 = require("../models/userModel");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyJWT = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new apiError_1.ApiError(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel_1.User.findById(decodedToken?.userId).select("-password -refreshToken");
        if (!user) {
            throw new apiError_1.ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new apiError_1.ApiError(401, error?.message || "Invalid access token");
    }
});
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new apiError_1.ApiError(401, "User not authenticated");
        }
        if (!roles.includes(req.user.role)) {
            throw new apiError_1.ApiError(403, "You do not have permission to perform this action");
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
