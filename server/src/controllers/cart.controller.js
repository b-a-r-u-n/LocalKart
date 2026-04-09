import { Cart } from "../models/cart.model.js";
import { CartItem } from "../models/cartItem.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const {productId, quantity, size} = req.body;
    if(!productId)
        throw new apiError(400, "Product id is required");

    let cart = await Cart.findOne({userId});

    if(!cart){
        cart = await Cart.create({userId});
        if(!cart)
            throw new apiError(400, "Error while creating cart");
    }

    let item = await CartItem.findOne({
        cartId: cart._id,
        productId,
        size: size
    })
    console.log(item);
    

    if(item){
        item.quantity += quantity || 1;
        await item.save({validateBeforeSave: false})
    }else {
        item = await CartItem.create({
            cartId: cart._id,
            productId,
            quantity: quantity || 1,
            size: size || null
        })
    }

    item = await item.populate("productId");

    if(!item)
        throw new apiError(400, "Error while creating cart item");

    res
    .status(200)
    .json(
        new apiResponse(200, "Item added successfully", item)
    )
})

const deleteFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const {productId} = req.params;
    const {size} = req.body;
    if(!productId)
        throw new apiError(400, "Product id is required");

    const cart = await Cart.findOne({
        userId
    })

    if(!cart)
        throw new apiError(404, "Cart not found"); 

    const item = await CartItem.findOneAndDelete({
        cartId: cart._id,
        productId,
        size
    }).populate("productId")
    console.log(item);
    

    if(!item)
        throw new apiError(404, "Item not found in cart");

    res
    .status(200)
    .json(
        new apiResponse(200, "Item deleted successfully", item)
    )
})

const updateCartItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const {productId} = req.params;
    if(!productId)
        throw new apiError(400, "Product id is required");

    // console.log(req.body);
    const {quantity, size} = req.body;
    
    if(!quantity || quantity < 1)
        throw new apiError(400, "Quantity must be at least 1");
    if(quantity > 100)
        throw new apiError(400, "Max quantity is 100");

    const cart = await Cart.findOne({userId});
    if(!cart)
        throw new apiError(404, "Cart not found");

    const item = await CartItem.findOneAndUpdate(
        {
            cartId: cart._id,
            productId,
            size
        },
        {
            $set: {
                quantity
            }
        },
        {
            returnDocument: 'after'
        }
    )
    if(!item)
        throw new apiError(404, "Item not found");

    res
    .status(200)
    .json(
        new apiResponse(200, "Quantity update successfully", item)
    )
})

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({userId});
    if(!cart)
        throw new apiError(404, "Cart not found");

    const items = await CartItem.find({
        cartId: cart._id
    }).populate("productId");
    if(!items)
        throw new apiError(400, "Items not found");

    // console.log(items);
    

    res
    .status(200)
    .json(
        new apiResponse(200, "Cart items fetched successfully", items)
    )
})

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart)
        throw new apiError(404, "Cart not found");

    const result = await CartItem.deleteMany({ cartId: cart._id });
    if (!result)
        throw new apiError(400, "Error while clearing cart");

    res
    .status(200)
    .json(
        new apiResponse(200, "Cart cleared successfully", result)
    )
})



export {
    addToCart,
    deleteFromCart,
    updateCartItem,
    getCart,
    clearCart
}