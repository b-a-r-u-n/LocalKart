import React, { useState } from 'react'
import { Modal } from '@mantine/core';
import Card from '../Card/Card';
import Input from '../Input/Input';
import { Button } from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updateUser } from '../../features/userSlice';

const ProfileEditModal = ({ modalOpen, setModalOpen, isMobile }) => {

  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth)
  const { loading } = useSelector(state => state.user);

  const [inputData, setInputData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || ""
  })

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputData.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!inputData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!inputData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    try {
      const result = await dispatch(updateUser({formData: inputData, userId: user._id})).unwrap();
      setModalOpen(false);
      
      toast.success(result.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    }
  }

  return (
    <Modal
      opened={modalOpen}
      onClose={() => setModalOpen(false)}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size={`${isMobile ? "100%" : "50%"}`}
    >
      <div className="bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl mb-6 text-[#111827]">Edit Profile</h1>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={inputData.fullName}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="abc@gmail.com"
                value={inputData.email}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Phone Number"
                type="number"
                name="phoneNumber"
                placeholder="1234567890"
                value={inputData.phoneNumber}
                onChange={handleInputChange}
                required
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Updating...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  onClick={() => setModalOpen(false)}
                  type="button" variant="ghost" className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileEditModal
