// src/components/GuestRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const GuestRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector(state => state.auth)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (isLoggedIn) return <Navigate to="/" replace />;

  return children;
}

export default GuestRoute;