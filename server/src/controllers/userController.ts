
import { User } from "../models/userModel";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUserSchema, registerUserSchema } from "../validation/userValidation";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const registerUser = asyncHandler(async (req, res) => {
    const result = registerUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(
            {
                error: result.error.format()
            }
        )
    }

    let { name, email, password, phone, role } = result.data;
    
    // Convert email to lowercase for consistency
    email = email.toLowerCase().trim();
    
    // Validate required fields
    const requiredFields = { name, email, password };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value?.trim())
      .map(([key]) => key);
      
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate phone if provided
    if (phone && phone.toString().trim() === '') {
      throw new ApiError(400, 'Phone number cannot be empty if provided');
    }

    // Check if user exists with case-insensitive email
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (existingUser) {
      console.log('User already exists with email:', email);
      console.log('Existing user ID:', existingUser._id);
      throw new ApiError(409, `This email is already registered. Please use a different email or try logging in.`);
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create(
        {
            name,
            email: email.toLocaleLowerCase(),
            password: hashPassword,
            role,
            phone
        }
    )

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(404, "something went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )
})



// loginUser
export const loginUser = asyncHandler(async (req, res) => {
    const result = await loginUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(
            {
                error: result.error.format()
            }
        )
    }

    const { email, password } = result.data;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(404, "User doesn't exist with this email")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const accessToken = generateAccessToken(user._id as string);
    const refreshToken = generateRefreshToken(user._id as string);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );

})