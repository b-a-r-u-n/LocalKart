import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const registerUser = createAsyncThunk("registerUser", async (formData, { rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData, { withCredentials: true })
        
        return response.data;
    } catch (error) {
        // console.log(error.response?.data || error.message);
        
        return  rejectWithValue(error.response?.data || error.message);
    }
})

export const logInUser = createAsyncThunk("logInUser", async (formData, {rejectWithValue}) => {
    try {
        // const response = await axios.post(`/api/v1/auth/login`, formData);
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, formData, { withCredentials: true });

        return response.data
    } catch (error) {
        // console.log(error.response?.data || error.message);
        
        return  rejectWithValue(error.response?.data || error.message);
    }
})

export const logOutUser = createAsyncThunk("logOutUser", async (_ ,{rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/logout`,{}, { withCredentials: true });

        return response.data;
    } catch (error) {
        // console.log(error.response?.data || error.message);
        
        return  rejectWithValue(error.response?.data || error.message);
    }
})

export const checkAuth = createAsyncThunk("checkAuth", async (_,{rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/check-auth`, { withCredentials: true })

        return response.data;
    } catch (error) {
        // console.log(error.response?.data || error.message);
        
        return  rejectWithValue(error.response?.data || error.message);
    }
})


const initialState = {
    loading: true,
    error: null,
    success: false,
    user: [],
    isLoggedIn: false,
}

const homeSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Register
        builder.addCase(registerUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Login
        builder.addCase(logInUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(logInUser.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.isLoggedIn = true
            state.user = action.payload.data;
        })
        builder.addCase(logInUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
            
        })

        //check auth
        builder.addCase(checkAuth.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.loading = false
            state.isLoggedIn = true
            state.user = action.payload.data;
            // console.log("auth completed");
            
        })
        builder.addCase(checkAuth.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
            state.isLoggedIn = false;
            state.success = false;
        })

        //Logout
        builder.addCase(logOutUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(logOutUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = null;
            state.isLoggedIn = false;
            state.error = action.payload;
        })
        builder.addCase(logOutUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})

export const {} = homeSlice.actions;

export default homeSlice.reducer;