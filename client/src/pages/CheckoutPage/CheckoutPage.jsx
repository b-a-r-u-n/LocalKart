import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Input } from '../../components';
import { Edit, Phone, Trash2, Truck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getSingleUser } from '../../features/userSlice';
import { handlePrice } from '../../features/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { userLocal, loading } = useSelector(state => state.user);
  const { user } = useSelector(state => state.auth);
  const { cartData, totalSubPrice, shippingPrice, totalPrice } = useSelector(state => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!cartData.length) return;

    const subTotal = cartData.reduce((acc, item) => {
      return acc + item.quantity * item.productId.discountPrice;
    }, 0);

    const shipping = subTotal < 500 ? 99 : 0;

    dispatch(handlePrice({ subTotal, shipping }));

  }, [cartData, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getSingleUser(user._id)).unwrap();

      } catch (error) {
        toast.error(error?.message || "Please log in to access your profile");
      }
    }

    fetchData();
  }, [])

  const [inputData, setInputData] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    pinCode: ""
  })

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  }

  const handleClick = (address) => {
    setInputData({
      fullName: address.fullName || "",
      phoneNumber: address.phoneNumber || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      pinCode: address.pinCode || ""
    })
  }

  // const generateWhatsAppMessage = () => {
  //   let message = `🛒 *New Order*\n\n`;

  //   cartData?.forEach((item, index) => {
  //     message += `${index + 1}. ${item.productId.name}\n`;
  //     message += `   Qty: ${item.quantity}\n`;
  //     message += `   Price: ₹${item.productId.discountPrice}\n\n`;
  //   });

  //   message += `💰 *Total: ₹${totalSubPrice}*\n\n`;
  //   message += `💰 *Shipping: ₹${shippingPrice}*\n\n`;

  //   message += `📍 *Delivery Address*\n`;
  //   message += `${inputData.fullName}\n`;
  //   message += `${inputData.street}, ${inputData.city}\n`;
  //   message += `${inputData.state} - ${inputData.pinCode}\n`;
  //   message += `📞 ${inputData.phoneNumber}\n`;

  //   return encodeURIComponent(message);
  // };


  const generateWhatsAppMessage = () => {
    let message = `🛍️ *NEW ORDER RECEIVED*\n\n`;
    message += `━━━━━━━━━━━━━━━\n\n`;

    message += `📦 *Order Items*\n\n`;

    cartData.forEach((item, index) => {
      message += `${index + 1}️⃣ *${item.productId.name}*\n`;
      message += `   └ Qty: ${item.quantity} × ₹${item.productId.discountPrice}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━\n\n`;
    message += `💰 *Order Summary*\n`;
    message += `🧾 Subtotal: ₹${totalSubPrice}\n`;
    message += `🚚 Shipping: ₹${shippingPrice}\n`;
    message += `🔸 *Total: ₹${totalPrice}*\n\n`;

    message += `━━━━━━━━━━━━━━━\n\n`;
    message += `📍 *Delivery Details*\n`;
    message += `👤 ${inputData.fullName}\n`;
    message += `🏠 ${inputData.street}\n`;
    message += `📍 ${inputData.city}, ${inputData.state} - ${inputData.pinCode}\n`;
    message += `📞 ${inputData.phoneNumber}\n\n`;

    message += `━━━━━━━━━━━━━━━\n\n`;
    message += `⚡ *Payment Mode*: Cash on Delivery\n\n`;

    return message;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputData.phoneNumber) {
      toast.error("Phone number is required");
      return
    }

    if (!inputData.street.trim()) {
      toast.error("Street is required");
      return
    }

    if (!inputData.city.trim()) {
      toast.error("City is required");
      return
    }

    if (!inputData.state.trim()) {
      toast.error("State is required");
      return
    }

    if (!inputData.pinCode) {
      toast.error("Pin code is required");
      return
    }

    const message = generateWhatsAppMessage();

    const url = `https://api.whatsapp.com/send?phone=${import.meta.env.VITE_NUMBER}&text=${encodeURIComponent(message)}`;

    window.open(url, "_blank"); // opens WhatsApp
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl mb-6 text-[#111827]">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="text-[#0ea5e9]" size={24} />
                <h2 className="text-xl text-[#111827]">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={inputData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  type="number"
                  placeholder="1234567890"
                  value={inputData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Street Address"
                  name="street"
                  type="text"
                  placeholder="123 Main Street"
                  value={inputData.street}
                  onChange={handleInputChange}
                  required className="col-span-2"
                />
                <Input
                  label="City"
                  name="city"
                  type="text"
                  placeholder="Bhubaneswar"
                  value={inputData.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  type="text"
                  placeholder="Odisha"
                  value={inputData.state}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="PIN Code"
                  name="pinCode"
                  type="number"
                  placeholder="751004"
                  value={inputData.pinCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Card>

          </div>

          {/* Order Summary */}
          <div>
            <Card
              className="p-6 sticky top-24">
              <div className='max-h-[50vh] overflow-y-scroll'>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {userLocal.address &&
                    userLocal.address.map((address, index) => (
                      <div
                        onClick={() => handleClick(address)}
                        key={address._id}
                        className="border rounded-lg p-4 hover:border-blue-500 transition-colors relative"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {/* <h3 className="font-semibold text-[#111827]">{address.label}</h3> */}
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <p className="text-[#111827] font-medium">{address.fullName}</p>
                          <p>{address.street}</p>
                          {/* {address.apartment && <p>{address.apartment}</p>} */}
                          <p>
                            {address.city}, {address.state}, {address.pinCode}
                          </p>
                          <p>{address.country}</p>
                          <p className="flex items-center gap-1 mt-2">
                            <Phone size={14} />
                            {address.phoneNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-3">
                Place Order
              </Button>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage
