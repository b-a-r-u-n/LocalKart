import React, { useEffect, useState } from 'react'
import { Badge, Card, ProfileEditModal } from '../../components'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Edit, Mail, MapPin, Phone, Plus, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressLocal, getSingleUser, removeAddress, removeAddressLocal } from '../../features/userSlice'
import toast from 'react-hot-toast'

const ProfilePage = () => {

  const dispatch = useDispatch();

  const { userLocal, loading } = useSelector(state => state.user);

  const { id } = useParams();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024)
      setIsMobile(true);

    const fetchData = async () => {
      try {
        await dispatch(getSingleUser(id)).unwrap();

      } catch (error) {
        toast.error(error?.message || "Please log in to access your profile");
      }
    }

    fetchData();
  }, [])

  const handleClick = () => {
    if (userLocal.address.length <= 10)
      navigate(`/${id}/profile/address/add`)
    else
      toast.error("You can only add up to 10 addresses");
  }

  const handleRemove = async (address, index) => {
    dispatch(removeAddressLocal(address._id));
    try {
      const result = await dispatch(removeAddress(address._id)).unwrap();
      toast.success(result.message || "Address removed successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to remove address");
      dispatch(addAddressLocal({ address, index }));
    }
  }

  if (loading && !userLocal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl mb-6 text-[#111827]">My Profile</h1>

        {/* Profile Card */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-[#111827]">Personal Information</h2>
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline" size="sm"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </Button>

            <ProfileEditModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              isMobile={isMobile}
            />

          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center text-2xl">
                {userLocal?.fullName?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl text-[#111827]">{userLocal.fullName}</h3>
                <p className="text-gray-600">Member since {
                  userLocal?.createdAt
                    ? new Date(userLocal?.createdAt)?.toISOString()?.split('T')[0]
                    : "Not Available"
                }</p>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb] pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-[#111827]">{userLocal.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-[#111827]">{userLocal?.phoneNumber || "Not Available"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-[#111827]">
                      {userLocal?.address?.[0]
                        ? `${userLocal.address[0].street}, ${userLocal.address[0].city}, ${userLocal.address[0].state} ${userLocal.address[0].pinCode}`
                        : "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8">
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="flex items-center gap-2 text-[#111827]">
                  <MapPin className="h-5 w-5 text-[#111827]" />
                  Saved Addresses
                </h2>
                <p className='text-[#111827]'>
                  Manage your shipping and billing addresses
                </p>
              </div>
              {
                userLocal.address.length > 0 &&
                (<Button onClick={handleClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>)
              }
            </div>
            {userLocal.address.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No addresses saved yet</p>
                <Button onClick={() => navigate(`address/add`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userLocal.address &&
                  userLocal.address.map((address, index) => (
                    <div
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

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`address/${address._id}/edit`)}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleRemove(address, index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {/* </CardContent> */}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
