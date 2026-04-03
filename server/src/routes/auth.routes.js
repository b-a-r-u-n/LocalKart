import express from "express";
import { checkAuth, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//Secured Routes
router.route("/check-auth").get(verifyJWT, checkAuth);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;