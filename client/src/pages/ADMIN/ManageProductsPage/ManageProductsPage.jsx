import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/Button/Button'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { Badge, Card } from '../../../components'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getAllProducts, removeProduct, removeLocalProduct, addLocalProduct } from '../../../features/productSlice'

const ManageProductsPage = () => {

  const navigate = useNavigate();

  const {productsLocal} = useSelector(state => state.product);
  // console.log(products);
  

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
      await dispatch(getAllProducts()).unwrap()
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products. Please try again.');
    }
    }
    
    fetchData();
  }, [])

  const handleEdit = async (product) => {
    navigate(`/admin/product/${product._id}/edit`);
  }

  const handleRemove = async (product, index) => {

    dispatch(removeLocalProduct(product._id));
    try {
      const result = await dispatch(removeProduct(product._id)).unwrap();
      toast.success(result.message || 'Product removed successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to remove product. Please try again.');
      dispatch(addLocalProduct({product, index}));
      // console.log(productsLocal);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl text-[#111827]">Manage Products</h1>
        <Link to="/admin/add-product">
          <Button variant="primary">
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e5e7eb]">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Discount Price
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Original Price
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {
                productsLocal &&
              productsLocal?.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        loading='lazy'
                      />
                      <div>
                        <p className="text-sm text-[#111827]">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.discountPrice}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#111827]">
                    {product.originalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={product.stock && product.stock > 20 ? 'success' : 'warning'}>
                      {product.stock} in stock
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[#0ea5e9] hover:text-[#0284c7] transition-colors cursor-pointer">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleRemove(product, index)} 
                        className="text-red-500 hover:text-red-600 transition-colors cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ManageProductsPage
