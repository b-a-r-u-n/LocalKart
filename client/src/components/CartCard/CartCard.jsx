import React, { useState } from 'react'
import Card from '../Card/Card'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { removeFromCart, updateCartItem } from '../../features/cartSlice'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

const CartCard = ({ item }) => {

    const { loading } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantity = async (num) => {
        
        let netQuantity = quantity + num;
        // console.log(quantity);
        if(netQuantity === 0){
            toast.error("Quantity cannot be less than 1");
            setQuantity(1);
            return;
        } else if(netQuantity === 101){
            toast.error("Quantity cannot be more than 100");
            setQuantity(100);
            return;
        }
        setQuantity(netQuantity);
        // console.log("quantity after", quantity);
        
        try {
            await dispatch(updateCartItem({productId: item.productId._id, quantity: netQuantity})).unwrap();
        } catch (error) {
            toast.error(error.message || "Failed to update cart item");
        }
    }

    const handleRemove = async (productId) => {

        try {
            const result = await dispatch(removeFromCart(productId)).unwrap();
            toast.success(result.message || "Product removed from cart");
        } catch (error) {
            toast.error(error.message || "Failed to remove product from cart");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (

        <Card className="p-2 md:p-6">
            <div className="flex flex-wrap gap-4">
                <img
                    src={item?.productId?.images[0]?.url}
                    alt={item?.productId?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                    <Link
                        to={`/product/${item?.productId?._id}`}
                        className="hover:text-[#0ea5e9]">
                        <h3 className="mb-2">{item?.productId?.name}</h3>
                    </Link>
                    <p className="text-2xl text-[#111827] mb-2">₹ {item?.productId?.discountPrice}</p>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center border border-[#e5e7eb] rounded-lg">
                            <button
                                className="px-3 py-1 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => handleQuantity(-1)}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="px-4 py-1 border-x border-[#e5e7eb]">{quantity}</span>
                            <button
                                className="px-3 py-1 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => handleQuantity(1)}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <button
                            onClick={() => handleRemove(item.productId._id)}
                            className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xl text-[#111827]">
                       ₹{item.productId.discountPrice * quantity}
                    </p>
                </div>
            </div>
        </Card>
    )
}

export default CartCard
