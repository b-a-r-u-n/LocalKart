import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import productReducer from "../features/productSlice";
import userReducer from "../features/userSlice";
import cartReducer from "../features/cartSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        user: userReducer,
        cart: cartReducer
    }
})

export default store;