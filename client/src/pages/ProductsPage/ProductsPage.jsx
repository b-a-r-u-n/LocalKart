import React, { useEffect } from 'react'
import { ProductCard } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../features/productSlice';
import toast from 'react-hot-toast';

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl mb-6 text-[#111827]">All Products</h1>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600"></p>
            </div>

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
    </div>
  )
}

export default ProductsPage
