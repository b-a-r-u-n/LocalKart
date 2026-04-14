import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Badge, BargainModal, Card, ProductCarousel } from '../../components';
import { Heart, Minus, Plus, RotateCcw, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleProduct } from '../../features/productSlice';
import toast from 'react-hot-toast';
import { addToCart, handleBuy } from '../../features/cartSlice';

const ProductDetailsPage = () => {

  const location = useLocation();

  const { product, loading } = useSelector(state => state.product);
  const { isLoggedIn } = useSelector(state => state.auth);

  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sizeOrder = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getSingleProduct(id)).unwrap();
      } catch (error) {
        toast.error(error.message || "Failed to fetch product details");
      }
    }

    if (id)
      fetchData();
  }, [id])

  // useEffect(() => {
  //     if (window.innerWidth < 1024)
  //       setIsMobile(true);
  //   }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [rating] = useState((Math.random() * 1.5 + 3.5).toFixed(1));

  const handleQuantity = (num) => {
    const newQuantity = quantity + num;

    if (newQuantity < 1) {
      toast.error("Minimum quantity is 1");
      setQuantity(1);
      return;
    }

    if (newQuantity > 100) {
      toast.error("Maximum quantity is 100");
      setQuantity(100);
      return;
    }

    setQuantity(newQuantity);
  };

  const handleAdd = async () => {
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
      const result = await dispatch(addToCart({ productId: product?._id, quantity, size: selectedSize })).unwrap();
      // console.log(result);      
      toast.success(result.message || "Product added to cart");
    } catch (error) {
      // console.log(error);

      toast.error(error.message || "Failed to add product to cart");
    }
  }

  const handleBargaining = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to add items to cart");
      navigate("/login", {
        state: { from: location.pathname }
      });
      return;
    }

    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size before bargaining");
      return;
    }

    setModalOpen(true);
  }

  const handleBuyNow = () => {
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

    dispatch(handleBuy({ product, quantity, size: selectedSize }));
    navigate("/checkout");
  }

  const getDisplayStock = () => {
    if (!product?.sizes || product?.sizes?.length === 0) {
      return product?.stock; // no sizes → normal stock
    }

    if (!selectedSize) {
      // no size selected → show total stock
      return product?.stock;
    }

    // find selected size stock
    const selected = product?.sizes?.find(
      (s) => (s.size || s) === selectedSize
    );

    return selected?.stock ?? 0;
  };

  const displayStock = getDisplayStock();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <ProductCarousel images={product?.images} />

          {/* Product Details */}
          <div>
            <h1 className="text-3xl mb-4 text-[#111827]">{product?.name}</h1>

            <div className="flex items-center mb-3 gap-1 text-[#f59e0b]">
              {Array.from({ length: 5 }).map((_, i) => {
                if (i < Math.floor(rating)) {
                  return <Star key={i} size={20} fill="currentColor" />;
                }

                if (i < rating) {
                  return <Star key={i} size={20} fill="currentColor" className="opacity-50" />;
                }

                return <Star key={i} size={20} />;
              })}

              <span className="ml-2 text-[#111827]">{rating}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl text-[#111827]">₹{product?.discountPrice}</span>
              {product?.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product?.originalPrice}</span>
                  <Badge variant="warning">
                    {Math.round(((product?.originalPrice - product?.discountPrice) / product?.originalPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product?.description}</p>

            {product?.sizes?.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
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
                        className={`px-3 py-1 border rounded-md text-sm transition cursor-pointer ${selectedSize === size
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

            <div className="mb-6">
              {/* <Badge variant={product.stock && product.stock > 0 ? 'success' : 'error'}>
                {product.stock && product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </Badge> */}
              <Badge variant={displayStock > 0 ? 'success' : 'error'}>
                {displayStock > 0
                  ? selectedSize
                    ? `${displayStock} available`
                    : `In Stock (${displayStock} available)`
                  : selectedSize
                    ? `${selectedSize} Size: Out of Stock`
                    : 'Out of Stock'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-[#e5e7eb] rounded-lg">
                <button
                  className="px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleQuantity(-1)}
                >
                  <Minus />
                </button>
                <span className="px-4 py-2 border-x border-[#e5e7eb]">{quantity}</span>
                <button
                  className="px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleQuantity(1)}
                >
                  <Plus />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                variant="primary" className="flex-1 cursor-pointer">
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </Button>
            </div>


            <Button
              variant="accent"
              className="w-full cursor-pointer"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>

            <button
              size="sm"
              className="mt-2 mb-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-lg font-bold py-2.5 rounded-lg shadow-md cursor-pointer "
              onClick={handleBargaining}
            >

              <span>📢</span> Bargain
            </button>

            {
              product && (
                <BargainModal
              product={product}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              isMobile={isMobile}
              selectedSize={selectedSize}
            />
              )
            }


            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Truck className="mx-auto mb-2 text-[#0ea5e9]" size={24} />
                <p className="text-sm">Free Shipping</p>
              </Card>
              <Card className="p-4 text-center">
                <RotateCcw className="mx-auto mb-2 text-[#0ea5e9]" size={24} />
                <p className="text-sm">Easy Returns</p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="mx-auto mb-2 text-[#0ea5e9]" size={24} />
                <p className="text-sm">Secure Payment</p>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetailsPage
