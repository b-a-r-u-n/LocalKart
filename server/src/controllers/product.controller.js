import { Product } from "../models/product.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import apiResponse from "../utils/apiResponse.js";


const addProduct = asyncHandler(async (req, res) => {

    const parsedData = JSON.parse(req.body.inputData);

    const { name, description, originalPrice, discountPrice, size, stock } = parsedData;

    // console.log(parsedData);
    

    if(!name || !name.trim())
        throw new apiError(400, "Product name is required");
    if(!description || !description.trim())
        throw new apiError(400, "Product description is required");


    let cloudinaryURLs;
    // console.log(req.files);
    
    if(req.files){
        const filesLocalPath = req.files?.map((file) => {
            return file.path;
        })
        // console.log("filesLocalPath",filesLocalPath);
        
        cloudinaryURLs = await uploadOnCloudinary(filesLocalPath);
        // console.log(cloudinaryURLs);
        
        if(!cloudinaryURLs || cloudinaryURLs.length === 0)
            throw new apiError(400, "Error while uploading image");
    }
    

    const product = await Product.create({
        name,
        description,
        originalPrice,
        discountPrice,
        stock,
        sizes: size ? [{size, stock}] : [],
        images: cloudinaryURLs
    })
    
    const createdProduct = await Product.findById(product._id).select("-createdAt -updatedAt")

    if(!createdProduct)
        throw new apiError(400, "Product add failed");

    res
    .status(200)
    .json(
        new apiResponse(200, "Product added successfully", createdProduct)
    )
    
})

const removeProduct = asyncHandler(async (req, res) => {
    const {productId} = req.params;

    if(!productId)
        throw new apiError(400, "Product id is required");

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if(!deletedProduct)
        throw new apiError(404, "Product not found");

    res
    .status(200)
    .json(
        new apiResponse(200, "Product deleted successfully")
    )
})

const updateProduct = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    if(!productId)
        throw new apiError(400, "Product id is required");
    // console.log("req.body", req.body);
    
    const parsedInputData = JSON.parse(req.body.inputData);

    const removedImages = JSON.parse(req.body.removedImages || "[]");

    const {name, description, originalPrice, discountPrice, stock, size} = parsedInputData;

    // console.log("removedImages", removedImages);
    
    if(!name || !name.trim())
        throw new apiError(400, "Name is required");
    if(!description || !description.trim())
        throw new apiError(400, "Description is required");
    if(originalPrice === undefined)
        throw new apiError(400, "Original price is required");
    if(discountPrice === undefined)
        throw new apiError(400, "Discount Price is required");
    if(stock === undefined)
        throw new apiError(400, "Stock is required");

    let cloudinaryURLs = [];
    if(req?.files && req.files.length > 0){
        const filesLocalPath = req.files.map((file) => {
            return file.path;
        })

        cloudinaryURLs = await uploadOnCloudinary(filesLocalPath)

        if(!cloudinaryURLs || cloudinaryURLs.length === 0)
            throw new apiError(400, "Error while uploading image");
    }

    if(removedImages && removedImages.length > 0){
        let publicIDs = removedImages.map((image) => image.publicId)

        await Product.findByIdAndUpdate(
            productId,
            {
                $pull: {
                    images: {
                        publicId: {$in: publicIDs}
                    }
                }
            }
        )

        await deleteFromCloudinary(publicIDs);
    }

    if(cloudinaryURLs && cloudinaryURLs.length > 0){
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    name,
                    description,
                    originalPrice,
                    discountPrice,
                    stock
                },
                $push: {
                    images: {
                        $each: cloudinaryURLs   // for maintain types
                    }
                }
            },
            {
                new: true
            }
        )

        if(!updatedProduct)
            throw new apiError(400, "Error while updating product")

        return res
        .status(200)
        .json(
            new apiResponse(200, "Product updated", updatedProduct)
        )
    }

    if(size){
        const product = await Product.findById(productId);
        const isSizeExist = product.sizes.find((s) => s.size === size)
        if(isSizeExist){
            await Product.findOneAndUpdate(
                {_id: productId, "sizes.size": size},
                {
                    $set: {
                        "sizes.$.stock": stock
                    }
                }
            )
        } else {
            await Product.findByIdAndUpdate(
                productId,
                {
                    $push: {
                        sizes: {size, stock}
                    }
                }
            )
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                name,
                description,
                originalPrice,
                discountPrice,
                stock
            }
        },
        {
            new: true
        }
    ).select("-createdAt -updatedAt")

    if(!updatedProduct)
        throw new apiError(400, "Error while updating product")

    return res
    .status(200)
    .json(
        new apiResponse(200, "Product updated", updatedProduct)
    )
})

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();

    if(!products)
        throw new apiError(404, "No products found");

    res
    .status(200)
    .json(
        new apiResponse(200, "Products fetched successfully", products)
    )
})

const getSingleProduct = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    
    if(!productId)
        throw new apiError(400, "Product id not found");

    const product = await Product.findById(productId);

    if(!product)
        throw new apiError(400, "Product not found");

    res
    .status(200)
    .json(
        new apiResponse(200, "Product fetched successfully", product)
    )
})

export {
    addProduct,
    removeProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct
}