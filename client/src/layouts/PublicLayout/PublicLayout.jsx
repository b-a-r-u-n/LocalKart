import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminRedirect, Footer, Navbar } from '../../components'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '../../features/authSlice'
import { getCartData } from '../../features/cartSlice'
import toast from 'react-hot-toast'

const PublicLayout = () => {

  // const {isLoggedIn, user} = useSelector(state => state.auth);

  const {loading} = useSelector(state => state.cart);
  // console.log(cartDataLocal.length);

  
  const {loading: authLoading } = useSelector(state => state.auth)

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await dispatch(getCartData()).unwrap();        
  //     } catch (error) {
  //       console.log(error.message || "Failed to fetch cart data");
  //       // toast.error(error.message || "Failed to fetch cart data");
  //     }
  //   }
  //   fetchData();
  // }, [dispatch])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await dispatch(checkAuth()).unwrap();
  //     } catch (error) {
        
  //       console.log(error?.message || "Authentication failed");
        
  //       // toast.error(error.message || "Authentication failed");
  //     }
  //   }
  //   fetchData();
  //   console.log("Hyy");
    
  // }, [])
  
  
  if (authLoading || loading) return (    
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen">
      <AdminRedirect />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
