import React, { useEffect } from 'react'
import { Button, ProductCard } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../features/productSlice';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import { Autoplay } from "swiper/modules";
import { Link, NavLink } from 'react-router-dom';

const ProductsPage = () => {

  const { products, loading } = useSelector(state => state.product);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllProducts()).unwrap();
      } catch (error) {
        toast.error(error || "Failed to fetch products");
      }
    }
    fetchData();
  }, [])

  if (loading && !products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white py-6">

        {/* <h1 className="text-3xl mb-6 px-6 lg:px-16 text-[#111827]">
          Trending Products
        </h1> */}

        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop
          speed={900}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
          {products.slice(-5).reverse().map((product) => (
            <SwiperSlide key={product._id}>

              <div className="flex justify-center w-full">
                <div className="relative w-full max-w-7xl h-[200px] md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden">

                  {/* 🔥 Image (IMPORTANT FIX) */}
                  <img
                    src={product?.images?.[0]?.url}
                    className="w-full h-full object-contain object-right"
                  />

                  {/* 🔥 Stronger Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

                  {/* 🔥 Content */}
                  <div className="absolute top-[60%] left-8 md:left-16 transform -translate-y-1/2 text-white max-w-lg">

                    {/* Title (BIG on large screens) */}
                    <h2 className="text-xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                      {product.name}
                    </h2>

                    {/* Price */}
                    <div className="flex items-center gap-3 text-lg md:text-xl mb-4">
                      <span className="font-bold text-2xl">
                        ₹{product.discountPrice}
                      </span>
                      <span className="line-through text-gray-300">
                        ₹{product.originalPrice}
                      </span>
                    </div>

                    {/* 🔥 CTA BUTTON (THIS FIXES EMPTY SPACE FEEL) */}
                    <Link>
                      <Button
                        variant="primary" className="flex-1 cursor-pointer font-semibold hover:scale-105 transition">
                        Shop Now
                      </Button>
                    </Link>

                  </div>

                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded">
                    {Math.round(
                      ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
                    )}% OFF

                  </span>

                </div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <h1 className="text-3xl mb-6 text-[#111827]">All Products</h1>
        <NavLink
          to="/products"
          className={() => `text-xl bg-[#0ea5e9] text-white py-1 px-5 rounded-xl font-semibold`}
        >
          All
        </NavLink>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600"></p>
            </div>

            {/* <div className="w-full flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                products &&
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
            </div>

            {/* <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible">
  {products &&
    products.map((product) => (
      <div key={product._id} className="min-w-[75%] sm:min-w-[45%] md:min-w-0">
        <ProductCard product={product} />
      </div>
    ))}
</div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
