import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const getCartData = createAsyncThunk("getCartData", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cart/get-cart`, { withCredentials: true });
        // console.log(response);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const addToCart = createAsyncThunk("addToCart", async ({ productId, quantity, size }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add-to-cart`, { productId, quantity, size }, { withCredentials: true });
        // console.log("productId", productId);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const removeFromCart = createAsyncThunk("removeFromCart", async ({ productId, size }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/cart/${productId}/remove-from-cart`, {
            data: { size },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const updateCartItem = createAsyncThunk("updateCartItem", async ({ productId, quantity, size }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/cart/${productId}/update-cart`, { quantity, size }, { withCredentials: true });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const clearCart = createAsyncThunk("clearCart", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/cart/clear-cart`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

const initialState = {
    cartData: [],
    cartDataLocal: null,
    buyItem: null,
    loading: false,
    success: false,
    totalPrice: 0,
    totalSubPrice: 0,
    shippingPrice: 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        handlePrice: (state, action) => {
            const { subTotal, shipping } = action.payload;
            state.totalPrice = subTotal + shipping;
            state.shippingPrice = shipping;
            state.totalSubPrice = subTotal;
        },
        handleBuy: (state, action) => {
            const {product, quantity, size} = action.payload;
            state.buyItem = {...product, quantity, size}
        },
        clearBuy: (state, _) => {
            state.buyItem = null;
        }
    },
    extraReducers: (builder) => {
        //get cart
        builder.addCase(getCartData.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(getCartData.fulfilled, (state, action) => {
            state.loading = false;
            state.cartData = action.payload.data;
            state.cartDataLocal = action.payload.data;
            state.success = true;

            // console.log(state.cartData);
            // console.log("Cart completed");
        })
        builder.addCase(getCartData.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })

        //add to cart
        builder.addCase(addToCart.pending, (state, _) => {
            state.loading = true;
        })
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            // console.log(action.payload.data);

            const newItem = action.payload.data;

            const existingItem = state.cartData.find(
                (item) => item.productId._id === newItem.productId._id && item.size === newItem.size
            );

            if (existingItem) {
                // update quantity (or replace)
                existingItem.quantity = newItem.quantity;

            } else {
                // add new item
                state.cartData.push(newItem);
                // console.log("New");
                // console.log(JSON.parse(JSON.stringify(state.cartData)));


            }
        })
        builder.addCase(addToCart.rejected, (state, _) => {
            state.loading = false;
            state.success = false;
        })

        // remove from cart
        builder.addCase(removeFromCart.pending, (state, _) => {
            state.loading = true;
        })
        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            const removedProductId = action.payload.data;
            state.cartData = state.cartData.filter(
                (item) => !(
                    item.productId._id === removedProductId.productId._id &&
                    item.size === removedProductId.size
                )
            );
        })
        builder.addCase(removeFromCart.rejected, (state, _) => {
            state.loading = false;
            state.success = false;
        })

        // update cart
        builder.addCase(updateCartItem.pending, (state, _) => {
            state.loading = true;
        })
        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            const { productId, quantity, size } = action.meta.arg;

            const item = state.cartData.find(
                (item) => item.productId._id === productId && item.size === size
            );

            if (item) {
                item.quantity = quantity; // 🔥 THIS LINE FIXES EVERYTHING
            }
        })
        builder.addCase(updateCartItem.rejected, (state, _) => {
            state.loading = false;
            state.success = false;
        })

        // clear cart
        builder.addCase(clearCart.pending, (state, _) => {
            state.loading = true;
        })
        builder.addCase(clearCart.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.cartData = [];
            state.totalPrice = 0;
            state.totalSubPrice = 0;
            state.shippingPrice = 0;
        })
        builder.addCase(clearCart.rejected, (state, _) => {
            state.loading = false;
            state.success = false;
        })

    }
})

export const { handlePrice, handleBuy, clearBuy } = cartSlice.actions;

export default cartSlice.reducer;