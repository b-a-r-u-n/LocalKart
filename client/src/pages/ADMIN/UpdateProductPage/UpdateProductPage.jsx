import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card, Input, Button } from '../../../components';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getSingleProduct, updateProduct } from '../../../features/productSlice';

const UpdateProductPage = () => {

    const { loading, product } = useSelector(state => state.product);

    const dispatch = useDispatch();

    const { id } = useParams();

    const navigate = useNavigate();

    const imageRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getSingleProduct(id)).unwrap()
            } catch (error) {
                toast.error(error.message || 'Failed to fetch product details. Please try again.');
            }
        }
        if (id)
            fetchData();
    }, [])

    const [inputData, setInputData] = useState({
        name: "",
        description: "",
        discountPrice: 0,
        originalPrice: 0,
        stock: 0
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setInputData({
                name: product.name || "",
                description: product.description || "",
                discountPrice: product.discountPrice || 0,
                originalPrice: product.originalPrice || 0,
                stock: product.stock || 0
            });

            // setPreviewImages(product.images || []);
            setPreviewImages(
                product.images.map((img) => ({
                    type: "old",
                    url: img.url,
                    publicId: img.publicId
                }))
            );
        }
    }, [product]);

    const handleInputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }

    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files);

    //     if (!files.length) return;

    //     // ✅ limit max 5 images
    //     if (previewImages.length + files.length > 5) {
    //         toast.error("You can upload maximum 5 images");
    //         return;
    //     }

    //     // ✅ update original images
    //     setImages((prev) => [...prev, ...files]);

    //     // ✅ create preview URLs
    //     const previewUrls = files.map((file) => URL.createObjectURL(file));

    //     setPreviewImages((prev) => [...prev, ...previewUrls]);

    //     e.target.value = null;
    // }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (previewImages.length + files.length > 5) {
            toast.error("You can upload maximum 5 images");
            return;
        }

        const newImages = files.map((file) => ({
            type: "new",
            file,
            url: URL.createObjectURL(file)
        }));

        setImages((prev) => [...prev, ...files]);
        setPreviewImages((prev) => [...prev, ...newImages]);

        e.target.value = null;
    };

    // const removeImage = (index, image) => {
    //     // console.log("image", image);
    //     setRemovedImages([...removedImages, image]);

    //     if (!image.publicId) {
    //         setImages((prev) => prev.filter((_, i) => i !== index));
    //     }

    //     setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    // }

    const removeImage = (index, image) => {
        // ✅ remove old image (track for backend)
        if (image.type === "old") {
            setRemovedImages((prev) => [...prev, image]);
        }

        // ✅ remove new image (remove from images array)
        if (image.type === "new") {
            setImages((prev) => prev.filter((file) => file !== image.file));
        }

        // ✅ always remove from preview
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (previewImages.length === 0 && images.length === 0) {
            toast.error("At least one image is required");
            return;
        }

        if (!inputData.name.trim()) {
            toast.error("Product name is required");
            return;
        }

        if (!inputData.description.trim()) {
            toast.error("Product description is required");
            return;
        }

        if (!inputData.discountPrice || inputData.discountPrice <= 0) {
            toast.error("Discount price must be greater than zero");
            return;
        }

        if (!inputData.originalPrice || inputData.originalPrice <= 0) {
            toast.error("Original price must be greater than zero")
            return;
        }

        if (!inputData.stock || inputData.stock <= 0) {
            toast.error("Stock must be greater than zero");
            return;
        }

        const formData = new FormData();
        formData.append("inputData", JSON.stringify(inputData));
        images.forEach((img) => {
            formData.append("images", img);
        });
        formData.append("removedImages", JSON.stringify(removedImages));

        setIsLoading(true);

        try {
            const result = await dispatch(updateProduct({ formData, productId: id })).unwrap();
            toast.success(result.message || "Product updated successfully!");

            setInputData({
                name: "",
                description: "",
                discountPrice: 0,
                originalPrice: 0,
                stock: 0
            })
            setImages([]);
            setPreviewImages([]);
            setRemovedImages([]);

            navigate("/admin/products")
        } catch (error) {
            toast.error(error.message || "Failed to update product. Please try again.");

            setInputData({
                name: "",
                description: "",
                discountPrice: 0,
                originalPrice: 0,
                stock: 0
            })
            setImages([]);
            setPreviewImages([]);
            setRemovedImages([]);

            navigate("/admin/products")
        } finally {
            setIsLoading(false);
        }
    }

    if (loading && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/admin/products')}
                className="mb-6 flex-1"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Button>

            <Card className="p-8 max-w-7xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block mb-2 text-sm text-[#111827]">Product Image</label>
                        <div
                            onClick={() => imageRef.current.click()}
                            className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-12 text-center hover:border-[#0ea5e9] transition-colors cursor-pointer">
                            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">PNG, JPG</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {
                            previewImages &&
                            previewImages.map((image, index) => (
                                <div
                                    key={nanoid()}
                                    className="relative group border rounded-xl overflow-hidden bg-white shadow-sm"
                                >
                                    {/* Image */}
                                    <img
                                        src={image.url || image}
                                        className="w-full h-80 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading='lazy'
                                    />

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index, image)}
                                        className="absolute top-0 right-0 bg-black/60 text-white text-xs px-2 py-1 rounded lg:opacity-0 lg:group-hover:opacity-100 transition"
                                    >
                                        <X size={20} color='red' />
                                    </button>
                                </div>
                            ))}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        name="images"
                        ref={imageRef}
                        className='hidden'
                        multiple
                        onChange={handleImageChange}
                    />

                    <Input
                        label="Product Name"
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        required
                        value={inputData?.name}
                        onChange={handleInputChange}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Discount Price ($)"
                            type="number"
                            name="discountPrice"
                            placeholder="0.00"
                            step="0.01"
                            required
                            value={inputData?.discountPrice}
                            onChange={handleInputChange}
                        />

                        <Input
                            label="Original Price ($)"
                            type="number"
                            name="originalPrice"
                            placeholder="0.00"
                            step="0.01"
                            value={inputData?.originalPrice}
                            onChange={handleInputChange}
                        />
                    </div>

                    <Input
                        label="Stock Quantity"
                        type="number"
                        name="stock"
                        placeholder="0"
                        required
                        value={inputData?.stock}
                        onChange={handleInputChange}
                    />

                    <div>
                        <label className="block mb-2 text-sm text-[#111827]">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Enter product description"
                            className="w-full px-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                            required
                            value={inputData?.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full flex items-center justify-center"
                            disabled={loading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Updating...
                                </span>
                            ) : (
                                "Update Product"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => navigate('/admin/products')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default UpdateProductPage
