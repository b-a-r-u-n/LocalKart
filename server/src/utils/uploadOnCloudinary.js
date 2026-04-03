import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (fileLocalPaths) => {
    try {
        if(!fileLocalPaths || fileLocalPaths.length === 0)
            return [];

        const filesUrl = [];

        for(const fileLocalPath of fileLocalPaths){
            const result = await cloudinary.uploader.upload(fileLocalPath,{
                folder: "localkart",
                resource_type: 'auto',
                quality: "auto:low",  // Automatically reduces quality to a low level
                format: "webp",       // Converts the image to WebP for better compression
                transformation: [
                    { fetch_format: "auto", quality: "auto:low" }  // Ensures better optimization
                ]
            })

            fs.unlinkSync(fileLocalPath); // Delete the local file after uploading
            // return result.secure_url;
            filesUrl.push({
                url: result.secure_url,
                publicId: result.public_id
            });
            // console.log(result);
            
        }

        return filesUrl;
        
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(fileLocalPaths); // Ensure local file is deleted even if upload fails
        return [];
    }
}

// const deleteFromCloudinary = async (url) => {
//     try {
//         if(!url)
//             throw new apiError(400, 'No file found');
//         const publicId = url.split('/').pop().split('.')[0];
//         const res = await cloudinary.uploader.destroy(`localkart/${publicId}`);
//         // console.log(publicId);
//         console.log(res);
//         return res;
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }

const deleteFromCloudinary = async (imagesData) => {
    try {
        if(!imagesData || imagesData.length === 0)
            throw new apiError(400, 'No file found');

        for(const id of imagesData){
            const res = await cloudinary.uploader.destroy(`${id}`);
            // console.log("res", res);
            
        }
        return;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}