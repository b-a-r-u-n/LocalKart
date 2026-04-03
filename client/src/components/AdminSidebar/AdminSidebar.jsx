import { FolderTree, LayoutDashboard, Package, Plus, ShoppingBag, Users } from 'lucide-react';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {

  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/add-product', label: 'Add Product', icon: Plus },
    { path: '/admin/products', label: 'Manage Products', icon: Package },
    { path: '/admin/users', label: 'Manage Users', icon: Users }
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-[#e5e7eb] min-h-screen flex-shrink-0">
      <div className="p-6">
        <h2 className="text-xl text-[#111827] mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#0ea5e9] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default AdminSidebar
