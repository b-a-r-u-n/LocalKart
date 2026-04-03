import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";


const verifyJWT = async (req, _, next) => {
    try {

        const token = req?.cookies?.accessToken || req.header?.("Authorization")?.replaces("Bearer ", "");

        if (!token)
            throw new apiError(401, "Unauthorized Access");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken)
            throw new apiError(401, "Unauthorized Access");

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user)
            throw new apiError(404, "User not found");

        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error.message || "Unauthorized Access");
    }
}

export default verifyJWT;