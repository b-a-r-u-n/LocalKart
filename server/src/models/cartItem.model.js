import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
            max: 100
        }
    }, {timestamps: true}
)

export const CartItem = mongoose.model("CartItem", cartItemSchema);