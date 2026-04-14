import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addProduct = createAsyncThunk("addProduct", async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/product/add-product`, formData, { withCredentials: true });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const removeProduct = createAsyncThunk("removeProduct", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/product/remove-product/${id}`, { withCredentials: true });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getAllProducts = createAsyncThunk("getAllProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/product/get-all-products`, { withCredentials: true })

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getSingleProduct = createAsyncThunk("getSingleProduct", async (productId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/product/get-product/${productId}`, { withCredentials: true })

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const updateProduct = createAsyncThunk("updateProduct", async ({ formData, productId }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/product/update-product/${productId}`, formData, { withCredentials: true })

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const initialState = {
    products: [],
    productsLocal: [],
    product: null,
    loading: false,
    error: null,
    success: false
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        removeLocalProduct: (state, action) => {
            // console.log(state.productsLocal);
            
            state.productsLocal = state.productsLocal.filter((product) => product._id !== action.payload)
        },
        addLocalProduct: (state, action) => {
            const { product, index } = action.payload;

            if (state.productsLocal) {
                state.productsLocal.splice(index, 0, product); // ✅ insert at index
            }
        }
    },
    extraReducers: (builder) => {

        //Add product
        builder.addCase(addProduct.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(addProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        builder.addCase(addProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false
        })

        //Remove product
        builder.addCase(removeProduct.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(removeProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true
        })
        builder.addCase(removeProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        })

        //get all product
        builder.addCase(getAllProducts.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.data;
            state.productsLocal = action.payload.data;
            state.success = true;
        })
        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        })

        //get single product
        builder.addCase(getSingleProduct.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(getSingleProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload.data;
            state.success = true;
        })
        builder.addCase(getSingleProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        })

        //update product
        builder.addCase(updateProduct.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        })
    }
})

export const { removeLocalProduct, addLocalProduct } = productSlice.actions;

export default productSlice.reducer;