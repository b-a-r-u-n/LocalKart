import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addToCart, deleteFromCart, getCart, updateCartItem } from "../controllers/cart.controller.js";

const router = express.Router();

// Secure Routes

router.route("/add-to-cart").post(verifyJWT, addToCart);
router.route("/:productId/remove-from-cart").delete(verifyJWT, deleteFromCart);
router.route("/:productId/update-cart").put(verifyJWT, updateCartItem);
router.route("/get-cart").get(verifyJWT, getCart);

export default router;