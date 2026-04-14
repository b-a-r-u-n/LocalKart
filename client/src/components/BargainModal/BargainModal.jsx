import { Modal } from '@mantine/core'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const BargainModal = ({ product, modalOpen, setModalOpen, isMobile, selectedSize }) => {

  const { user } = useSelector(state => state.auth)

  const [offerPrice, setOfferPrice] = useState("");
  const [selectedPercent, setSelectedPercent] = useState(null);

  const generateBargainMessage = () => {
    let message = `🤝 *PRICE NEGOTIATION REQUEST*\n\n`;
    message += `━━━━━━━━━━━━━━━\n\n`;

    message += `📦 *Product Details*\n\n`;

    message += `🛍️ *${product?.name}*\n`;

    if (selectedSize) {
      message += `   └ Size: ${selectedSize}\n`;
    }

    message += `   └ Original Price: ₹${product?.originalPrice}\n`;
    message += `   └ Discount Price: ₹${product?.discountPrice}\n\n`;

    message += `━━━━━━━━━━━━━━━\n\n`;

    message += `💰 *My Offer*\n`;
    message += `👉 Proposed Price: *₹${offerPrice}*\n\n`;

    // Optional % calculation
    const discountPercent = Math.floor(
      ((product.discountPrice - offerPrice) / product.discountPrice) * 100
    );

    message += `📉 Discount Asked: ${discountPercent}%\n\n`;

    message += `━━━━━━━━━━━━━━━\n\n`;

    message += `🙋 *Customer Details*\n`;
    message += `👤 ${user?.fullName}\n`;
    message += `📞 ${user?.phoneNumber}\n\n`;

    message += `━━━━━━━━━━━━━━━\n\n`;

    message += `💬 *Message*\n`;
    message += `Hi, I'm interested in this product. Can you accept my offer? 😊\n\n`;

    message += `⚡ Waiting for your response!\n`;

    return message;
  };

  const handleSubmit = () => {
    if (!offerPrice || offerPrice <= 0) {
      toast.error("Please enter a valid offer price");
      return;
    }

    if (offerPrice > product.discountPrice) {
      toast.error("Offer price cannot be greater than actual price");
      return;
    }

    if (offerPrice < product.discountPrice * 0.4) {
      toast.error("Offer price is too low, try a higher price");
      return;
    }

    if (offerPrice === product.discountPrice) {
      toast.error("Offer price cannot be same as actual price, try a lower price");
      return;
    }

    const message = generateBargainMessage();

    const url = `https://api.whatsapp.com/send?phone=${import.meta.env.VITE_NUMBER}&text=${encodeURIComponent(message)}`;

    window.open(url, "_blank")
    
    setModalOpen(false);

    // console.log(message);


  }

  const handlePrice = (num) => {
    let discountPrice = Math.floor(product.discountPrice * (num / 100));
    setOfferPrice(discountPrice);
    setSelectedPercent(num);
  }

  return (
    <Modal
      centered
      opened={modalOpen}
      onClose={() => setModalOpen(false)}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size={`${isMobile ? "100%" : "50%"}`}
      radius="lg"
      withCloseButton={false}
    >
      <div className="p-2">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            📢 Bargain Deal
          </h2>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Product Card */}
        <div className="flex gap-3 bg-gray-50 p-3 rounded-xl">
          <img
            src={product?.images[0]?.url}
            className="w-16 h-16 rounded-lg object-contain object-center"
          />
          <div className="flex-1">
            <p className="font-medium text-sm line-clamp-2">
              {product.name}
            </p>
            <p className="text-lg font-semibold text-[#0ea5e9]">
              ₹{product.discountPrice}
            </p>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-500 mt-3">
          Try your luck 🤞 — seller may accept or counter your offer
        </p>

        {/* Input */}
        <div className="mt-3">
          <label className="text-sm font-medium">
            Your Offer Price
          </label>

          <div className="flex items-center border rounded-lg mt-1 px-3">
            <span className="text-gray-500">₹</span>
            <input
              type="number"
              className="w-full p-2 outline-none"
              placeholder="Enter amount"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Smart Suggestion */}
        <div className="flex gap-2 mt-3">
          {[80, 70, 60].map((percent) => (
            <button
              key={percent}
              onClick={() => handlePrice(percent)}
              className={`text-xs px-3 py-1 rounded-full cursor-pointer transition ${selectedPercent === percent
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
            >
              {percent}% Price
            </button>
          ))}
        </div>

        {/* Buttons */}
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg mt-4 font-medium cursor-pointer"
          onClick={handleSubmit}
        >
          Submit Offer
        </button>

        <button
          onClick={() => setModalOpen(false)}
          className="w-full bg-gray-100 py-2.5 rounded-lg mt-2 cursor-pointer"
        >
          Cancel
        </button>

      </div>
    </Modal>
  )
}

export default BargainModal
