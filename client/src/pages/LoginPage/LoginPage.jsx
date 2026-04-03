import { ShoppingCart } from 'lucide-react'
import React, { useState } from 'react'
import { Card, Input } from '../../components'
import { Button } from '../../components/Button/Button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast';
import { logInUser } from '../../features/authSlice'

const LoginPage = () => {

  const location = useLocation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const result = await dispatch(logInUser(formData)).unwrap();
      // console.log(result?.data?.isAdmin);
      
      if(result?.data?.isAdmin)
        navigate("/admin");
      else
        navigate(location.state?.from || "/");
      toast.success(result.message || "Logged in successful");
      setFormData({
          email: "",
          password: ""
        })

    } catch (error) {
        console.log(error);
        console.log("Hello");
        
        
        toast.error(error?.message || "Log in failed");
        setFormData({
          email: "",
          password: ""
        })
    } finally {
        setLoading(false); 
    }

  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-[#0ea5e9] text-white px-3 py-2 rounded-lg">
              <ShoppingCart size={32} />
            </div>
            <span className="text-2xl text-[#111827]">
              LocalKart
            </span>
          </div>

          <h1 className="text-3xl mb-2 text-[#111827]">
            Welcome Back
          </h1>

          <p className="text-gray-600">
            Login to continue shopping
          </p>

        </div>


        {/* Card */}
        <Card className="p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            <Input
              name="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />


            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">
                  Remember me
                </span>
              </label>

              <button
                type='button'
                className="text-sm hover:cursor-not-allowed text-[#0ea5e9] hover:text-[#0284c7]"
              >
                Forgot password?
              </button>

            </div>


            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>


            <div className="text-center">

              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup"
                  className="text-[#0ea5e9] hover:text-[#0284c7]"
                >
                  Sign up
                </Link>
              </p>

            </div>

          </form>

        </Card>


        {/* Back */}
        <div className="mt-6 text-center">

          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-[#0ea5e9]"
          >
            Back to Home
          </Link>

        </div>

      </div>
    </div>
  )
}

export default LoginPage
