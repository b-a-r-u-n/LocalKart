import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js";

//production
const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}

//local
// const options = {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
// }

const generateAccessRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId);
        if(!user)
            throw new apiError(404, "User not found");
    
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        if(!accessToken)
            throw new apiError(500, 'Access token not generated');
        if(!refreshToken)
            throw new apiError(500, "Refresh token not generated");
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
    
        return {accessToken, refreshToken}
    } catch (error) {
        console.log("🔴 Generate Token Error:",error);
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password} = req.body;

    if(!fullName)
        throw new apiError(400, "Full Name is required");
    if(!email)
        throw new apiError(400, "Email is required");
    if(!password)
        throw new apiError(400, "Password is required");

    const checkUser = await User.findOne({email});
    if(checkUser)
        throw new apiError(400, "User already exist");

    const user = await User.create({
        fullName,
        email,
        password
    })

    if(!user)
        throw new apiError(500, "Something went wrong while creating user");

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    res
    .status(201)
    .json(
        new apiResponse(201, "User registered successfully", createdUser)
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // console.log("Hello");
    

    if(!email || !email.trim())
         throw new apiError(400, 'Email is required');
    if(!password || !password.trim())
        throw new apiError(400, "Password is required");

    const user = await User.findOne({email});
    if(!user)
        throw new apiError(400, "Email does not exist");

    const passwordCorrect = await user.isPasswordCorrect(password);
    if(!passwordCorrect)
        throw new apiError(400, "Password is incorrect");

    const {accessToken, refreshToken} = await generateAccessRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(200, "User logged in successfully", loggedInUser)
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    if(!req?.user)
        throw new apiError(401, "Unauthorized Access");

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    )

    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new apiResponse(200, "User logged out successfully", {})
    )
})

const checkAuth = asyncHandler(async (req, res) => {
    
    const user = req.user;
    if(!user)
        throw new apiError(400, "User is not logged in") 
    
    res
    .status(200)
    .json(
        new apiResponse(200, 'User is logged in', user)
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    checkAuth
}