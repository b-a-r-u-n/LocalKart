import React, { useEffect, useState } from 'react'
import { Card, CartCard } from '../../components'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { ArrowLeft, IndianRupee, Minus, Plus, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getCartData, handlePrice, removeFromCart } from '../../features/cartSlice'
import toast from 'react-hot-toast'

const CartPage = () => {

  const { loading, cartData, totalPrice, totalSubPrice, shippingPrice } = useSelector(state => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
  if (!cartData.length) return;

  const subTotal = cartData.reduce((acc, item) => {
    return acc + item.quantity * item.productId.discountPrice;
  }, 0);

  const shipping = subTotal < 500 ? 99 : 0;

  dispatch(handlePrice({ subTotal, shipping }));

}, [cartData, dispatch]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await dispatch(getCartData()).unwrap();
  //     } catch (error) {
  //       toast.error(error.message || "Failed to fetch cart data");
  //     }
  //   }
  //   fetchData();
  // }, [])


  if (loading && !cartData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
        <Button
                variant="ghost"
                onClick={() => navigate("/products")}
                className="mb-6 cursor-pointer"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Button>

        <h1 className="text-3xl mb-6 text-[#111827]">Shopping Cart</h1>

        {cartData.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-2xl mb-4 text-[#111827]">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link to="/products">
              <Button
                variant="primary">Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {
                cartData &&
                cartData?.map((item, index) => (
                  <CartCard key={item._id} item={item} />
                ))}
            </div>

            {/* Order Summary */}
            {
              cartData &&
              <div>
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl mb-4 text-[#111827]">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-[#111827]">
                        ₹ {totalSubPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-[#111827]">
                        {shippingPrice === 0 ? 'FREE' : `${shippingPrice?.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-[#e5e7eb] pt-3 flex justify-between">
                      <span className="text-lg text-[#111827]">Total</span>
                      <span className="text-2xl text-[#111827]">
                        ₹ {totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Link to="/checkout">
                    <Button variant="primary" className="w-full mb-3 cursor-pointer">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="ghost" className="w-full cursor-pointer">
                      Continue Shopping
                    </Button>
                  </Link>
                </Card>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
