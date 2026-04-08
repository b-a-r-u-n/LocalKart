import React from 'react'
import Card from '../Card/Card';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../features/cartSlice';

const ProductCard = ({ product }) => {

  const { isLoggedIn } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.cart);

  const navigate = useNavigate();

  const dispatch = useDispatch();


  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add items to cart");
      navigate("/login", {
        state: { from: location.pathname }
      });
      return;
    }

    try {
      const result = await dispatch(addToCart({ productId: product._id })).unwrap();
      // console.log(result);      
      toast.success(result.message || "Product added to cart");
    } catch (error) {
      // console.log(error);
      toast.error(error.message || "Failed to add product to cart");
    }
  };

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
            className="w-full h-64 object-contain object-center"
            loading='lazy'
          />
        </div>

      </Link>


      <div className="p-4">

        <Link to={`/product/${product._id}`}>
          <h3 className="mb-2 line-clamp-2 hover:text-[#0ea5e9]">
            {product.name}
          </h3>
        </Link>


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

      </div>

    </Card>
  )
}

export default ProductCard
