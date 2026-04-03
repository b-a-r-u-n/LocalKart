import React from 'react'
import { Footer, Navbar } from '../../components'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserLayout = () => {

  const {isLoggedIn, user} = useSelector(state => state.auth);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} cartCount={3} userName={user?.fullName} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout
