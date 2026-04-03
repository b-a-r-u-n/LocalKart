import express from "express";
import { accountDelete, addAddress, deleteAddress, getAllUsers, getSingleUser, updateAddress, updateProfile } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

// Secure Routes

router.route("/add-address").post(verifyJWT, addAddress);
router.route("/update-address/:addressId").post(verifyJWT, updateAddress);
router.route("/delete-address/:addressId").delete(verifyJWT, deleteAddress);
router.route("/get-users").get(verifyJWT, getAllUsers);
router.route("/get-user/:userId").get(verifyJWT, getSingleUser);
router.route("/update-profile/:userId").post(verifyJWT, updateProfile);
router.route("/delete/:userId").delete(verifyJWT, accountDelete);

export default router;