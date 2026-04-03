import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useNavigate } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './app/store.js'
import { MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css";
import AdminLayout from './layouts/AdminLayout/AdminLayout.jsx'
import AddProductPage from './pages/ADMIN/AddProductPage/AddProductPage.jsx'
import { DashboardPage, ManageProductsPage, ManageUsersPage, UpdateProductPage } from './pages/ADMIN/index.js'
import PublicLayout from './layouts/PublicLayout/PublicLayout.jsx'
import { CartPage, CheckoutPage, EditAndAddAddress, HomePage, LoginPage, NotFoundPage, ProductsPage, ProfilePage, SignupPage, UpdateUserProfilePage } from './pages/index.js'
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage.jsx'
import { Toaster } from 'react-hot-toast'
import GuestRoute from './components/GuestRoute/GuestRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import { checkAuth } from './features/authSlice.js'
import ProfileLayout from './layouts/ProfileLayout/ProfileLayout.jsx'
import { getCartData } from './features/cartSlice.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
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
        <Route path="cart" element={<CartPage />} />
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
    if(isLoggedIn)
      dispatch(getCartData());
  }, [isLoggedIn])

  return <RouterProvider router={router} />;
}


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MantineProvider>
      <Toaster />
      <AppWrapper />
    </MantineProvider>
  </Provider>
)
