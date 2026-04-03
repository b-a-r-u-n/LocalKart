import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllUsers = createAsyncThunk("getAllUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/get-users`, { withCredentials: true })

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getSingleUser = createAsyncThunk("getSingleUser", async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/get-user/${userId}`, { withCredentials: true })

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const removeUser = createAsyncThunk("removeUser", async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/user/delete/${userId}`, { withCredentials: true });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const updateUser = createAsyncThunk("updateUser", async ({ formData, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/update-profile/${userId}`, formData, { withCredentials: true });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const addAddress = createAsyncThunk("addAddress", async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/add-address`, formData, { withCredentials: true });
        // console.log(response);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const removeAddress = createAsyncThunk("removeAddress", async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/user/delete-address/${userId}`, { withCredentials: true });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const updateAddress = createAsyncThunk("updateAddress", async ({ formData, addressId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/update-address/${addressId}`, formData, { withCredentials: true });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const initialState = {
    users: [],
    usersLocal: [],
    user: [],
    userLocal: { address: [] }, 
    loading: false,
    error: [],
    success: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        removeLocalUsers: (state, action) => {
            state.usersLocal = state.usersLocal.filter(user => user._id !== action.payload);
        },
        addLocalUsers: (state, action) => {
            const { user, index } = action.payload;

            if (state.usersLocal) {
                state.usersLocal.splice(index, 0, user); // ✅ insert at index
            }
        },
        removeAddressLocal: (state, action) => {

            state.userLocal.address = state.userLocal.address.filter(
                (addr) => addr._id !== action.payload
            );

        },
        addAddressLocal: (state, action) => {
            const { address, index } = action.payload;

            if (state.userLocal.address.length > 0) {
                if(state.userLocal.address)
                    state.userLocal.address.splice(index, 0, address); // ✅ insert at index
            }
        },
    },
    extraReducers: (builder) => {
        //get all users
        builder.addCase(getAllUsers.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload.data;
            state.usersLocal = action.payload.data;
            state.success = true;
        })
        builder.addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })

        // getSingleUser
        builder.addCase(getSingleUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(getSingleUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
            state.userLocal = action.payload.data;
            state.success = true;
        })
        builder.addCase(getSingleUser.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })


        // removeUser
        builder.addCase(removeUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(removeUser.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        builder.addCase(removeUser.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })

        // updateUser
        builder.addCase(updateUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.userLocal = action.payload.data;
        })
        builder.addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })

        // addAddress
        builder.addCase(addAddress.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(addAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        builder.addCase(addAddress.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })

        // removeAddress
        builder.addCase(removeAddress.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(removeAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        builder.addCase(removeAddress.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })

        // updateAddress
        builder.addCase(updateAddress.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
        })
        builder.addCase(updateAddress.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
        })
    }
})

export const { addLocalUsers, removeLocalUsers, removeAddressLocal, addAddressLocal } = userSlice.actions;

export default userSlice.reducer;