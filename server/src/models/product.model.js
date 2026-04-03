import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        originalPrice: {
            type: Number,
            default: 0
        },
        discountPrice: {
            type: Number,
            default: 0
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        images: [
            {
                url: {
                    type: String
                },
                publicId: {
                    type: String
                }
            }
        ]
    }, 
    {timestamps: true}
)

export const Product = mongoose.model("Product", productSchema)