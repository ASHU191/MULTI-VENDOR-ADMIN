import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('image', image);
            const { data } = await api.post('/category-add', formData, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_category = createAsyncThunk(
    'category/get_category',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const delete_category = createAsyncThunk(
    'category/delete_category',
    async (category_Id, { rejectWithValue }) => {
        try {
            console.log('Category ID to delete:', category_Id); // Debug log
            const { data } = await api.delete(`/category-delete/${category_Id}`, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        loader: false,
        successMessage: '',
        errorMessage: '',
        categorys: [],
    },
    reducers: {
        messageClear: (state) => {
            state.successMessage = '';
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(categoryAdd.pending, (state) => {
                state.loader = true;
            })
            .addCase(categoryAdd.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message;
                state.categorys.push(action.payload.category); 
            })
            .addCase(categoryAdd.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.message;
            })
            .addCase(get_category.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_category.fulfilled, (state, action) => {
                state.loader = false;
                state.categorys = action.payload.categorys;
            })
            .addCase(get_category.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.message;
            })
            .addCase(delete_category.pending, (state) => {
                state.loader = true;
            })
            .addCase(delete_category.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.message;
                console.log('Deleted category with ID:', action.meta.arg);
                state.categorys = state.categorys.filter(category => category._id !== action.meta.arg);

            })
            .addCase(delete_category.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.message;
            });
    }
});

export const { messageClear } = categorySlice.actions;
export default categorySlice.reducer;