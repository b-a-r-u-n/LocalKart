import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Input } from '../../components';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addAddress, updateAddress } from '../../features/userSlice';

const EditAndAddAddress = () => {

    const dispatch = useDispatch();
    const { id, addressId } = useParams();
    const navigate = useNavigate();
    const { loading, userLocal } = useSelector(state => state.user);


    const [inputData, setInputData] = useState({
        fullName: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        pinCode: ""
    })

    useEffect(() => {

        const address = userLocal.address.find((add) => add._id === addressId)

        if (addressId && address)
            setInputData({
                fullName: address.fullName || "",
                phoneNumber: address.phoneNumber || "",
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                pinCode: address.pinCode || ""
            })
    }, [addressId])

    const handleInputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    const handleUpdate = async () => {
            try {
            const result = await dispatch(updateAddress({formData: inputData, addressId})).unwrap();
            // console.log(result);

            toast.success(result?.message || "Address added successfully");
            setInputData({
                fullName: "",
                phoneNumber: "",
                street: "",
                city: "",
                state: "",
                pinCode: ""
            })
            navigate(`/${id}/profile`);
        } catch (error) {
            // console.log(error);

            toast.error(error?.data?.message || error?.message || "Failed to update address");
            setInputData({
                fullName: "",
                phoneNumber: "",
                street: "",
                city: "",
                state: "",
                pinCode: ""
            })
        }    
    }

    const handleAdd = async () => {
        try {
            const result = await dispatch(addAddress(inputData)).unwrap();
            // console.log(result);

            toast.success(result?.message || "Address added successfully");
            setInputData({
                fullName: "",
                phoneNumber: "",
                street: "",
                city: "",
                state: "",
                pinCode: ""
            })
            navigate(`/${id}/profile`);
        } catch (error) {
            // console.log(error);

            toast.error(error?.data?.message || error?.message || "Failed to add address");
            setInputData({
                fullName: "",
                phoneNumber: "",
                street: "",
                city: "",
                state: "",
                pinCode: ""
            })
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(inputData);


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


        if (addressId)
            handleUpdate();
        else
            handleAdd();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Button
                variant="ghost"
                onClick={() => navigate(`/${id}/profile`)}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
            </Button>

            <Card className="p-6 md:col-span-2">
                <div
                    className='mb-4'
                >
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Edit Address
                    </div>
                    <p>
                        Update your shipping or billing address information
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                label="Full Name"
                                name="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={inputData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                type="number"
                                placeholder="1234567890"
                                value={inputData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Input
                            label="Street Address"
                            name="street"
                            type="text"
                            placeholder="123 Main Street"
                            value={inputData.street}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* <div className="space-y-2">
              <Input
                label="Apartment, Suite, etc. (Optional)"
                id="apartment"
                placeholder="Apt 4B"
                value={address.apartment}
                onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
              />
            </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Input
                                label="City"
                                name="city"
                                type="text"
                                placeholder="Bhubaneswar"
                                value={inputData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                label="State"
                                name="state"
                                type="text"
                                placeholder="Odisha"
                                value={inputData.state}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
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
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    {loading ? "Saving..." : addressId ? "Update address" : "Add address"}
                                </span>
                            ) : (
                                addressId ? "Update address" : "Add address"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/${id}/profile`)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
                {/* </CardContent> */}
            </Card>
        </div>
    );
}

export default EditAndAddAddress
