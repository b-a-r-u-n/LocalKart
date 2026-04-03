import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct, getAllProducts, getSingleProduct, removeProduct, updateProduct } from "../controllers/product.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"

const router = express.Router();

router.route("/get-all-products").get(getAllProducts);
router.route("/get-product/:productId").get(getSingleProduct);

//Secure Routes

router.route("/add-product").post(
    upload.array("images", 5),
    verifyJWT,
    addProduct
);

router.route("/remove-product/:productId").delete(verifyJWT, removeProduct);

router.route("/update-product/:productId").put(
    verifyJWT,
    upload.array("images", 5),
    updateProduct
);

export default router;