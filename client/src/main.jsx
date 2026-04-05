import { lazy, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './app/store.js'
import { MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css";
import { Toaster } from 'react-hot-toast'


import GuestRoute from './components/GuestRoute/GuestRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'


import { checkAuth } from './features/authSlice.js'
import { getCartData } from './features/cartSlice.js'

// layouts
const AdminLayout = lazy(() => import("./layouts/AdminLayout/AdminLayout.jsx"));
const ProfileLayout = lazy(() => import("./layouts/ProfileLayout/ProfileLayout.jsx"));
const PublicLayout = lazy(() => import("./layouts/PublicLayout/PublicLayout.jsx"));

// public pages
const ProductsPage = lazy(() => import("./pages/ProductsPage/ProductsPage.jsx"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage/ProductDetailsPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage.jsx"));
const EditAndAddAddress = lazy(() => import("./pages/EditAndAddAddress/EditAndAddAddress.jsx"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage/CheckoutPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage/SignupPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage.jsx"));
const UpdateUserProfilePage = lazy(() => import("./pages/UpdateUserProfilePage/UpdateUserProfilePage.jsx"));

// Admin
const DashboardPage = lazy(() => import("./pages/ADMIN/DashboardPage/DashboardPage.jsx"));
const AddProductPage = lazy(() => import("./pages/ADMIN/AddProductPage/AddProductPage.jsx"));
const ManageProductsPage = lazy(() => import("./pages/ADMIN/ManageProductsPage/ManageProductsPage.jsx"));
const ManageUsersPage = lazy(() => import("./pages/ADMIN/ManageUsersPage/ManageUsersPage.jsx"));
const UpdateProductPage = lazy(() => import("./pages/ADMIN/UpdateProductPage/UpdateProductPage.jsx"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PublicLayout />}>
        {/* <Route index element={<HomePage />} /> */}
        <Route index element={<ProductsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path=":id/profile" element={
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        } >
          <Route index element={<ProfilePage />} />
          <Route path="address/add" element={<EditAndAddAddress />} />
          <Route path="address/:addressId/edit" element={<EditAndAddAddress />} />
        </Route>
        <Route path="cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={<ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>} />
      </Route>

      <Route path="/signup" element={
        <GuestRoute>
          <SignupPage />
        </GuestRoute>
      } />
      <Route path="/login" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="products" element={<ManageProductsPage />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="users/:id/edit" element={<UpdateUserProfilePage />} />
        <Route path=":id/profile" element={<ProfilePage />} />
        <Route path="product/:id/edit" element={<UpdateProductPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />

    </>
  )
)

const AppWrapper = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { isLoggedIn, user } = useSelector(state => state.auth);

  useEffect(() => {

    dispatch(checkAuth()); // ✅ runs on every route
    // dispatch(getCartData()); // ✅ runs on every route
  }, []);

  useEffect(() => {
    if (isLoggedIn)
      dispatch(getCartData());
  }, [isLoggedIn])

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MantineProvider>
      <Toaster />
      <AppWrapper />
    </MantineProvider>
  </Provider>
)
