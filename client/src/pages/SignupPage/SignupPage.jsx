import { ShoppingCart } from 'lucide-react'
import React, { useState } from 'react'
import { Card, Input } from '../../components'
import { Button } from '../../components/Button/Button'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../features/authSlice'

const SignupPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (formData.password.trim().length < 6) {
      toast.error("Password at least 6 character");
      return;
    }

    if (!formData.confirmPassword.trim()) {
      toast.error("Confirm password is required");
      return;
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      toast.error("Password and confirm password must be same");
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(registerUser(formData)).unwrap();

      navigate("/login");
      toast.success(response.message || "Sign up successful");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
    } catch (error) {
      toast.error(error?.message || "Sign up failed");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-[#0ea5e9] text-white px-3 py-2 rounded-lg">
              <ShoppingCart size={32} />
            </div>
            <span className="text-2xl text-[#111827]">LocalKart</span>
          </div>
          <h1 className="text-3xl mb-2 text-[#111827]">Create Account</h1>
          <p className="text-gray-600">Sign up to start shopping</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 mt-1 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]" required />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#0ea5e9] hover:text-[#0284c7]">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#0ea5e9] hover:text-[#0284c7]">
                    Privacy Policy
                  </a>
                </span>
              </label>
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
                  Signing up...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0ea5e9] hover:text-[#0284c7]">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-[#0ea5e9]">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
