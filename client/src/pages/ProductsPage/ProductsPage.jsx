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
    <div className="min-h-screen max-w-full bg-gray-50">
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
                <div className="relative w-full max-w-7xl h-[220px] md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden">

                  {/* Image */}
                  <img
                    src={product?.images?.[0]?.url}
                    className="w-full h-full object-contain object-right"
                  />

                  {/* 🔥 Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>

                  {/* 🔥 NEW LAUNCH Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-yellow-400 text-black text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      🚀 NEW LAUNCH
                    </span>

                    <span className="bg-red-500 text-white text-xs md:text-sm px-3 py-1 rounded-full">
                      {Math.round(
                        ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
                      )}% OFF
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute top-[60%] left-8 md:left-16 transform -translate-y-1/2 text-white max-w-lg">

                    {/* Subtitle */}
                    <p className="text-yellow-400 font-semibold mb-2 tracking-wide uppercase text-xs md:text-sm">
                      Just Launched
                    </p>

                    {/* Title */}
                    <h2 className="text-xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                      {product.name}
                    </h2>

                    {/* Price */}
                    <div className="flex items-center gap-3 text-lg md:text-xl mb-5">
                      <span className="font-bold text-2xl text-green-400">
                        ₹{product.discountPrice}
                      </span>
                      <span className="line-through text-gray-300">
                        ₹{product.originalPrice}
                      </span>
                    </div>

                    {/* CTA */}
                    <Link to={`/product/${product._id}`}>
                      <Button
                        variant="primary"
                        className="px-6 py-3 font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all"
                      >
                        Explore Now →
                      </Button>
                    </Link>

                  </div>

                  {/* 🔥 Glow Effect (Premium Feel) */}
                  <div className="absolute left-0 top-0 w-40 h-40 md:w-72 md:h-72 bg-yellow-400/10 md:bg-yellow-400/20 blur-3xl md:blur-3xl rounded-full">
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {
        products.length > 0 ?
          (
            <div className="max-w-7xl mx-auto px-4 pb-6">
              <h1 className="text-3xl mb-4 text-[#111827]">All Products</h1>
              <NavLink
                to="/products"
                className={() => `text-sm md:text-lg lg:text-xl bg-[#0ea5e9] text-white py-1 px-5 rounded-xl font-semibold`}
              >
                All
              </NavLink>

              <div className="flex gap-6 mt-5">
                <div className="flex-1">

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
                </div>
              </div>
            </div>
          )
          :
          (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

              {/* Icon */}
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#e0f2fe] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-[#0ea5e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M9 3v18m6-18v18M4 7h16M4 17h16" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No Products Found
              </h2>

              {/* Subtitle */}
              <p className="text-gray-500 mb-5 max-w-sm">
                Looks like we couldn’t find any products right now. Try refreshing or check back later.
              </p>

              {/* Button */}
              <button
                onClick={() => window.location.reload()}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-lg transition"
              >
                Refresh
              </button>

            </div>

          )
      }
    </div>
  )
}

export default ProductsPage
