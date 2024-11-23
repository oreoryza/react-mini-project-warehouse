import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_PRODUCTS = "http://localhost:3000/products";

// Async actions for products
export const fetchData = createAsyncThunk("products/fetchData", async () => {
  const response = await axios.get(API_PRODUCTS);
  return response.data;
});

export const addData = createAsyncThunk("products/addData", async (product) => {
  const response = await axios.post(API_PRODUCTS, product);
  return response.data;
});

export const deleteData = createAsyncThunk("products/deleteData", async (id) => {
  await axios.delete(`${API_PRODUCTS}/${id}`);
  return id;
});

export const updateData = createAsyncThunk("products/updateData", async (product) => {
  const response = await axios.put(`${API_PRODUCTS}/${product.id}`, product);
  return response.data;
});

export const toggleUpdate = createAsyncThunk("products/toggleUpdate", async (id) => {
  return id;
});

export const detailData = createAsyncThunk("products/detailData", async (id) => {
  const response = await axios.get(`${API_PRODUCTS}/${id}`);
  return response.data;
});

export const stockChange = createAsyncThunk("products/stockChange", async (product) => {
  const response = await axios.patch(`${API_PRODUCTS}/${product.id}`, { stock: product.stock });
  return response.data;
});

export const resetProduct = createAsyncThunk("products/resetProduct", async () => {
  return {};
});

// Initial state
const initialState = {
  products: [],
  loading: false,
  error: null,
  product: {},
  isSuccess: false,
  isUpdate: false,
};

// Slice
const dataSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdate = false;
        state.products = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Data
      .addCase(addData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addData.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.isSuccess = true;
      })
      .addCase(addData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Data
      .addCase(deleteData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((product) => product.id !== action.payload);
        state.isSuccess = true;
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Toggle Update
      .addCase(toggleUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleUpdate.fulfilled, (state) => {
        state.loading = false;
        state.isUpdate = true;
      })
      .addCase(toggleUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Data
      .addCase(updateData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.isSuccess = true;
      })
      .addCase(updateData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Detail Data
      .addCase(detailData.pending, (state) => {
        state.loading = true;
      })
      .addCase(detailData.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(detailData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //stock change
      .addCase(stockChange.pending, (state) => {
        state.loading = true;
      })
      .addCase(stockChange.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index].stock = action.payload.stock; // Update the stock in state
        }
        state.isSuccess = true;
      })
      .addCase(stockChange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      /// Reset Product
      .addCase(resetProduct.fulfilled, (state) => {
        state.product = {};
      }); 
  },
});

export default dataSlice.reducer;