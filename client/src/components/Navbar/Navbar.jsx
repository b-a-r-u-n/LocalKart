import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, LogOut, Plus, LayoutDashboard, Package, Users, Icon, User2 } from "lucide-react";
import { Button } from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../features/authSlice";
import toast from "react-hot-toast";

function Navbar() {

  const { isLoggedIn, user } = useSelector(state => state.auth);
  const {cartData} = useSelector(state => state.cart);

  // console.log(cartData);
  
  
  const dispatch = useDispatch();

  const navigate= useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/add-product', label: 'Add Product', icon: Plus },
    { path: '/admin/products', label: 'Manage Products', icon: Package },
    { path: '/admin/users', label: 'Manage Users', icon: Users }
  ];

  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      const result = await dispatch(logOutUser()).unwrap();
      toast.success(result.message || "Logged out successful")
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Log out failed");
    }
  }

  return (
    <nav className="bg-gradient-to-b from-[#101825] to-[#121D30] shadow-md shadow-white/10 sticky top-0 z-40 ">
      <div className="max-w-10xl mx-auto px-4 w-full max-w-7xl">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#0ea5e9] text-white px-3 py-2 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <span className="text-xl text-white ">
              LocalKart
            </span>
          </Link>


          {/* Search */}
          {/* <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">

            <div className="relative">

              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-lg"
              />

              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

            </div>

          </form> */}


          {/* Right */}
          <div className="flex items-center gap-4">

            {isLoggedIn ? (
              <>

                {!user?.isAdmin && (
                  <>

                    <Link to="/cart" className="relative">

                      <ShoppingCart size={24} color="white" />

                      {cartData?.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {cartData.length}
                        </span>
                      )}

                    </Link>
                  </>
                )}


                {/* user */}
                <div className="relative">

                  <button
                    onClick={() =>
                      setShowUserMenu(!showUserMenu)
                    }
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User size={24} color="white" />
                    <span
                      className="hidden sm:block text-white font-medium"
                    >
                      {user?.fullName}
                    </span>
                  </button>


                  {showUserMenu && (

                    <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow">

                      <NavLink
                        onClick={() =>
                          setShowUserMenu(!showUserMenu)
                        }
                        to={`${user?.isAdmin ? `/admin/${user?._id}/profile` : `/${user?._id}/profile`}`}
                        className={({isActive}) => `flex font-semibold items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-[#0ea5e9] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                              }`}
                      >
                        <User size={20} />
                        <span>Profile</span>
                      </NavLink>


                      {
                      user?.isAdmin &&
                      menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            onClick={() =>
                              setShowUserMenu(!showUserMenu)
                            }
                            key={item.path}
                            to={item.path}
                            className={`lg:hidden font-semibold flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-[#0ea5e9] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            <Icon size={20} />
                            <span>{item?.label}</span>
                          </Link>
                        );
                      })}
                      <button
                        onClick={handleLogout}
                        className="w-full flex font-semibold items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-300 hover:cursor-pointer"
                              
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </div>

                  )}

                </div>

              </>
            ) : (

              <div className="flex gap-2">

                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white bg-[#2A3344] hover:text-black"
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>

              </div>

            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;