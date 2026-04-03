import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    if(!users)
        throw new apiError(400, "No users found");

    res
    .status(200)
    .json(
        new apiResponse(200, "Users fetched successfully", users)
    )
})

const getSingleUser= asyncHandler(async (req, res) => { 
    const {userId} = req.params;
    if(!userId)
        throw new apiError(400, "User id is required");

    const user = await User.findById(userId).select("-password -refreshToken");

    if(!user)
        throw new apiError(400, "No user found");

    res
    .status(200)
    .json(
        new apiResponse(200, "User fetched successfully", user)
    )
})

const addAddress = asyncHandler(async (req, res) => {
    const { fullName, phoneNumber, street, city, state, pinCode } = req.body;
    if(!phoneNumber || !phoneNumber.trim())
        throw new apiError(400, "Phone Number is required");
    if(!street || !street.trim())
        throw new apiError(400, "Street is required");
    if(!city || !city.trim())
        throw new apiError(400, "City is required");
    if(!state || !state.trim())
        throw new apiError(400, "State is required");
    if(!pinCode || !pinCode.trim())
        throw new apiError(400, "Pin code is required");

    const currentUser = req.user;

    const isFirstAddress = currentUser.address.length === 0

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $push: {
                address: {
                        fullName: fullName || req.user?.fullName || "",
                        phoneNumber,
                        street,
                        city,
                        state,
                        pinCode,
                        isDefault: isFirstAddress
                }
            }
        },
        {
            returnDocument: 'after'
        }
    ).select("-password -refreshToken")

    if(!user)
        throw new apiError(400, "Failed to update address");

    // console.log(user);
    

    res
    .status(200)
    .json(
        new apiResponse(200, "Address added successfully", user)
    )
})

const deleteAddress = asyncHandler(async (req, res) => {
    const {addressId} = req.params;

    if(!addressId)
        new apiError(400, "Address id is required");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $pull: {
                address: {_id: addressId}
            }
        },
        {
            returnDocument: 'after'
        }
    ).select("-password -refreshToken")

    if(!user)
        throw new apiError(400, "Error while deleting address");

    res
    .status(200)
    .json(
        new apiResponse(200, "Address deleted successfully", user)
    )

})

const updateAddress = asyncHandler(async (req, res) => {
    const {addressId} = req.params;
    if(!addressId)
        throw new apiError(400, "Address id is required");

    const { fullName, phoneNumber, street, city, state, pinCode } = req.body;
    if(!phoneNumber || !phoneNumber.trim())
        throw new apiError(400, "Phone Number is required");
    if(!street || !street.trim())
        throw new apiError(400, "Street is required");
    if(!city || !city.trim())
        throw new apiError(400, "City is required");
    if(!state || !state.trim())
        throw new apiError(400, "State is required");
    if(!pinCode || !pinCode.trim())
        throw new apiError(400, "Pin code is required");

    const user = await User.findOneAndUpdate(
        {
            _id: req.user._id,
            "address._id": addressId
        },
        {
            $set: {
                "address.$.fullName": fullName,
                "address.$.phoneNumber": phoneNumber,
                "address.$.street": street,
                "address.$.city": city,
                "address.$.state": state,
                "address.$.pinCode": pinCode
            }
        },
        {
            returnDocument: "after"
        }
    ).select("-password -refreshToken");

    if(!user)
        throw new apiError(400, "Error while updating address");

    res
    .status(200)
    .json(
        new apiError(200, "Address update successfully", user)
    )

})

const updateProfile = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if(!userId)
        throw new apiError(400, "User id is required");

    const {fullName, email, phoneNumber} = req.body;
    if(!fullName)
        throw new apiError(400, "Full name is required");
    if(!email)
        throw new apiError(400, "Email is required");

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                fullName,
                email,
                phoneNumber: phoneNumber ? Number(phoneNumber) : undefined
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    if(!user)
        throw new apiError(400, "Error while updating profile");

    res
    .status(200)
    .json(
        new apiResponse(200, "Profile updated successfully", user)
    )
})

const accountDelete = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if(!userId)
        throw new apiError(400, "User id is required");

    const deletedUser = await User.findByIdAndDelete(userId);
    if(!deletedUser)
        throw new apiError(400, "Error while deleting account");

    res
    .status(200)
    .json(
        new apiResponse(200, "Account deleted successfully")
    )
})

// Update Password

export {
        addAddress,
        deleteAddress,
        updateAddress,
        getSingleUser,
        getAllUsers,
        updateProfile,
        accountDelete
    }