import React, { useEffect, useState } from 'react'
import Card from '../Card/Card';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../features/cartSlice';
import BargainModal from '../BargainModal/BargainModal';

const ProductCard = ({ product }) => {

  const { isLoggedIn } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.cart);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sizeOrder = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (window.innerWidth < 1024)
      setIsMobile(true);
  }, [])


  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to cart");
      navigate("/login", {
        state: { from: location.pathname }
      });
      return;
    }

    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      const result = await dispatch(addToCart({ productId: product._id, size: selectedSize })).unwrap();
      // console.log(result);      
      toast.success(result.message || "Product added to cart");
    } catch (error) {
      // console.log(error);
      toast.error(error.message || "Failed to add product to cart");
    }
  };

  const handleBargaining = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to add items to cart");
      navigate("/login", {
        state: { from: location.pathname }
      });
      return;
    }

    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before bargaining");
      return;
    }

    setModalOpen(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <Card className="overflow-hidden">

      <Link to={`/product/${product._id}`}>

        <div className="relative">
          <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded">
            {Math.round(
              ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
            )}% OFF

          </span>

          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-32 md:h-64 object-contain object-center"
            loading='lazy'
          />
        </div>

      </Link>


      <div className="p-4">

        <Link to={`/product/${product._id}`}>
          <h3 className="mb-2 text-md sm:leading-5 md:text-lg lg:text-xl line-clamp-2 hover:text-[#0ea5e9]">
            {product.name}
          </h3>
        </Link>

        {product.sizes.length > 0 && (
          <div className="flex gap-1 md:gap-2 mb-3 flex-wrap">
            {[...product.sizes]
              .sort((a, b) => {
                const sizeA = (a.size || a).toUpperCase();
                const sizeB = (b.size || b).toUpperCase();

                return sizeOrder.indexOf(sizeA) - sizeOrder.indexOf(sizeB);
              })
              .map((sizeObj, index) => {
                const size = sizeObj.size || sizeObj;
                const isOutOfStock = sizeObj.stock === 0;

                return (
                  <button
                    key={index}
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSize(size);
                    }}
                    className={`px-2 py-0.5 md:px-3 md:py-1 border rounded-md text-xs font-semibold md:text-md lg:text-lg transition cursor-pointer ${selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 hover:border-black"
                      } ${isOutOfStock
                        ? "opacity-40 cursor-not-allowed line-through"
                        : ""
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
          </div>
        )}


        {/* <div className="flex items-center gap-1 mb-2">

          <div className="flex items-center gap-1 text-[#f59e0b]">
            <Star size={16} fill="currentColor" />
            <span className="text-sm">{rating}</span>
          </div>

          <span className="text-sm text-gray-500">
            ({reviews})
          </span>

        </div> */}


        <div className="flex items-center gap-2 mb-3">

          <span className="text-xl text-[#111827]">
            ₹ {product.discountPrice}
          </span>

          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹ {product.originalPrice}
            </span>
          )}

        </div>


        <Button
          variant="primary"
          size="sm"
          className="w-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>

        <button
          size="sm"
          className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-lg font-bold py-2.5 rounded-lg shadow-md cursor-pointer "
          onClick={handleBargaining}
        >

          <span>📢</span> Bargain
        </button>

        <BargainModal 
          product={product}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          isMobile={isMobile}
          selectedSize={selectedSize}
        />

      </div>

    </Card>
  )
}

export default ProductCard
