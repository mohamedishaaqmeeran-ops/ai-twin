import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConnectionsAPI, disconnectAPI } from "./socialAPI";

export const fetchConnections = createAsyncThunk(
  "social/fetchConnections",
  async (_, { rejectWithValue }) => {
    try {
      return await getConnectionsAPI();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const disconnectSocial = createAsyncThunk(
  "social/disconnectSocial",
  async (platform, { rejectWithValue }) => {
    try {
      await disconnectAPI(platform);
      return platform;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const socialSlice = createSlice({
  name: "social",
  initialState: {
    connections: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSocialError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload || [];
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(disconnectSocial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectSocial.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = state.connections.filter(
          (item) => item.platform !== action.payload
        );
      })
      .addCase(disconnectSocial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSocialError } = socialSlice.actions;
export default socialSlice.reducer;