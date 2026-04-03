import { Package, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../../features/userSlice';
import { getAllProducts } from '../../../features/productSlice';

const DashboardPage = () => {

  const { user } = useSelector(state => state.auth);
  const { products } = useSelector(state => state.product);
  const { users } = useSelector(state => state.user);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getAllUsers()).unwrap(),
          dispatch(getAllProducts()).unwrap()
        ]);
      } catch (error) {
        toast.error(error?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome back, {user.fullName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s a quick overview of your store
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Users */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Users</p>
            <Users className="text-gray-400" size={20} />
          </div>
          <h2 className="text-3xl font-bold mt-4">{users?.length}</h2>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Products</p>
            <Package className="text-gray-400" size={20} />
          </div>
          <h2 className="text-3xl font-bold mt-4">{products?.length}</h2>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage
