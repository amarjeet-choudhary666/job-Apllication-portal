"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const userValidation_1 = require("../validation/userValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = userValidation_1.registerUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const { name, email, password, phone, role } = result.data;
    if ([name, email, password, phone].some((field) => field?.trim() === "")) {
        throw new apiError_1.ApiError(400, "All fields are required");
    }
    const existingUser = await userModel_1.User.findOne({ email });
    if (existingUser) {
        throw new apiError_1.ApiError(409, "User already exists with this email");
    }
    const hashPassword = await bcrypt_1.default.hash(password, 10);
    const user = await userModel_1.User.create({
        name,
        email: email.toLocaleLowerCase(),
        password: hashPassword,
        role,
        phone
    });
    const createdUser = await userModel_1.User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError_1.ApiError(404, "something went wrong while creating user");
    }
    return res.status(201).json(new apiResponse_1.ApiResponse(201, createdUser, "User created successfully"));
});
// loginUser
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await userValidation_1.loginUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const { email, password } = result.data;
    if (!email || !password) {
        throw new apiError_1.ApiError(400, "All fields are required");
    }
    const user = await userModel_1.User.findOne({ email }).select("+password");
    if (!user) {
        throw new apiError_1.ApiError(404, "User doesn't exist with this email");
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError(401, "Invalid credentials");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user._id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    const loggedInUser = await userModel_1.User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse_1.ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken
    }, "User logged in successfully"));
});
