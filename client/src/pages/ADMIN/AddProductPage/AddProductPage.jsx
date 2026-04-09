import React, { useRef, useState } from 'react'
import { Button } from '../../../components/Button/Button'
import { Card, Input } from '../../../components'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct } from '../../../features/productSlice'
import { nanoid } from '@reduxjs/toolkit'

const AddProductPage = () => {

  const { loading } = useSelector(state => state.product);

  const dispatch = useDispatch();

  const imageRef = useRef();

  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [inputData, setInputData] = useState({
    name: "",
    description: "",
    discountPrice: 0,
    originalPrice: 0,
    stock: 0,
    size: ""

  })

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    // ✅ limit max 5 images
    if (images.length + files.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    // ✅ update original images
    setImages((prev) => [...prev, ...files]);

    // ✅ create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...previewUrls]);

    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(inputData);
    // return;    

    if (!images || images.length === 0) {
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

    if (Number(inputData.discountPrice) > Number(inputData.originalPrice)) {
      toast.error("Discount price cannot be greater than original price");
      return;
    }

    if (!Number(inputData.stock) || Number(inputData.stock) <= 0) {
      toast.error("Stock must be greater than zero");
      return;
    }

    const formData = new FormData();
    formData.append("inputData", JSON.stringify(inputData));
    images.forEach((img) => {
      formData.append("images", img);
    });

    // console.log(formData);


    try {
      const result = await dispatch(addProduct(formData)).unwrap();
      toast.success(result.message || "Product added successfully!");

      setImages([]);
      setPreviewImages([]);
      setInputData({
        name: "",
        description: "",
        discountPrice: 0,
        originalPrice: 0,
        stock: 0,
        size: ""

      })
    } catch (error) {
      toast.error(error?.message || "Failed to add product. Please try again.");
      setImages([]);
      setPreviewImages([]);
      setInputData({
        name: "",
        description: "",
        discountPrice: 0,
        originalPrice: 0,
        stock: 0,
        size: ""
      })
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-8 text-[#111827]">Add New Product</h1>

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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {
              previewImages &&
              previewImages.map((src, index) => (
                <div
                  key={nanoid()}
                  className="relative group border rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  {/* Image */}
                  <img
                    src={src}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading='lazy'
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
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
            value={inputData.name}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Discount Price (₹)"
              type="number"
              name="discountPrice"
              placeholder="0.00"
              step="0.01"
              required
              value={inputData.discountPrice}
              onChange={handleInputChange}
            />

            <Input
              label="Original Price (₹)"
              type="number"
              name="originalPrice"
              placeholder="0.00"
              step="0.01"
              value={inputData.originalPrice}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              name="stock"
              placeholder="0"
              required
              value={inputData.stock}
              onChange={handleInputChange}
            />

             <div
              className='flex flex-col'
             >
              <label className="block mb-2 text-sm text-[#111827]">
                Size
              </label>
              <select
                name="size" id=""
                className={`w-full px-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all`}
                value={inputData.size}
                onChange={handleInputChange}
                
              >
                <option value="">Select Size</option> 
                {
                  sizeOptions.map((size) => (
                    <option value={size} key={size}>
                      {size}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-[#111827]">Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Enter product description"
              className="w-full px-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
              required
              value={inputData.description}
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
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Uploading...
                </span>
              ) : (
                "Add Product"
              )}
            </Button>
            {/* <Button type="submit" variant="primary" className="flex-1">
              Add Product
            </Button> */}
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
  )
}

export default AddProductPage;

