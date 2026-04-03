import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ArrowLeft} from 'lucide-react';
import { Button, Card, Input } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser, updateUser } from '../../features/userSlice';
import toast from 'react-hot-toast';

const UpdateUserProfilePage = () => {

  const { user, loading } = useSelector(state => state.user);

  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState({
    fullName: "",
    email: "",
    phoneNumber: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getSingleUser(id)).unwrap();
      } catch (error) {
        toast.error(error.message || 'Failed to fetch user details. Please try again.');
      }
    }
    if (id)
      fetchData();
  }, [id])

  useEffect(() => {

    if (!user)
      return;

    setInputData({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || ""
    })
  }, [user])

  const handleInput = (e) => {
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

    setIsLoading(true);

    try {
      const result = await dispatch(updateUser({ formData: inputData, userId: id })).unwrap();

      toast.success(result.message || "User updated successfully!");

      setInputData({
        fullName: "",
        email: "",
        phoneNumber: ""
      })

      navigate("/admin/users");
    } catch (error) {
      toast.error(error.message || "Failed to update user. Please try again.");

      setInputData({
        fullName: "",
        email: "",
        phoneNumber: ""
      })

      navigate("/admin/users");
    } finally {
      setIsLoading(false);
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/users')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card className="p-8 max-w-7xl">
          <h3 className="text-xl font-semibold mb-4">User Information</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={inputData.fullName}
              onChange={handleInput}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="email"
              value={inputData.email}
              onChange={handleInput}
              required
            />

            <Input
              label="Phone Number"
              name="phoneNumber"
              type="number"
              placeholder="1234567890"
              value={inputData?.phoneNumber}
              onChange={handleInput}
              required
            />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center"
                disabled={loading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Updating...
                  </span>
                ) : (
                  "Update User"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/users')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Activity Card */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>
              View user account history and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Joined Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(user.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-sm text-gray-600">
                    {new Date(user.lastLogin).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-sm text-gray-600 capitalize">{user.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

export default UpdateUserProfilePage
