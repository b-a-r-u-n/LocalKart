import React from 'react'
import { AdminSidebar, Navbar } from '../../components'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
