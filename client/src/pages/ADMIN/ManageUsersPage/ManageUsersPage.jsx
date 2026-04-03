import React, { useEffect } from 'react'
import { Badge, Card } from '../../../components'
import { Edit, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addLocalUsers, getAllUsers, removeLocalUsers, removeUser } from '../../../features/userSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ManageUsersPage = () => {

  const { usersLocal, loading } = useSelector(state => state.user);
  const authUser = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllUsers()).unwrap();
      } catch (error) {
        toast.error(error?.message || "Failed to fetch users");
      }
    }

    fetchData();
  }, [dispatch])

  const handleEdit = async (user) => {
    navigate(`/admin/users/${user._id}/edit`);
  }

  const handleRemove = async (user, index) => {
    dispatch(removeLocalUsers(user._id));
    try {
      const result = await dispatch(removeUser(user._id)).unwrap();
      toast.success(result.message || "User removed successfully!");
    } catch (error) {
      dispatch(addLocalUsers(user, index));
      toast.error(error.data || "Failed to remove user. Please try again.");
    }
  }

  if (loading && !usersLocal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-8 text-[#111827]">Manage Users</h1>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#e5e7eb]">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {usersLocal &&
                usersLocal.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center">
                          {user?.fullName?.toUpperCase().split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-[#111827]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.isAdmin ? 'warning' : 'default'}>
                        {
                          user.isAdmin
                            ? `Admin ${user?._id === authUser?._id ? "(Self)" : ""}`
                            : "Customer"
                        }
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(user.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={user.isAdmin}
                          className={`transition-colors ${user.isAdmin ? "text-[#0ea4e970] hover:cursor-not-allowed" : "text-[#0ea5e9] hover:text-[#0284c7] hover:cursor-pointer"}`}>
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleRemove(user, index)}
                          disabled={user.isAdmin}
                          className={`transition-colors ${user.isAdmin ? "text-red-300 hover:cursor-not-allowed" : "text-red-500 hover:text-red-600 hover:cursor-pointer "}`}>
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

export default ManageUsersPage
