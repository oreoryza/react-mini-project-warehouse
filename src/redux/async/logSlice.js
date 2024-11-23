import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_LOGS = "http://localhost:3000/logs";

//async actions for logs
export const fetchLogs = createAsyncThunk("logs/fetchLogs", async () => {
  const response = await axios.get(API_LOGS);
  return response.data;
});

export const addLogs = createAsyncThunk("logs/addLog", async (log) => {
  const response = await axios.post(API_LOGS, log);
  return response.data;
});

//initial state
const initialState = {
  logs: [],
  loading: false,
  error: null,
  isSuccess: false,
};

//slice
const logSlice = createSlice({
  name: "logs",
  initialState,
  extraReducers: (builder) => {
    builder
      // Fetch logs
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdate = false;
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add logs
      .addCase(addLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs.push(action.payload);
        state.isSuccess = true;
      })
      .addCase(addLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default logSlice.reducer;