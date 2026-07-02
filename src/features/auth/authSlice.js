import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = "https://twinn-backend.onrender.com/api/auth";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      return data.user;
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLoginUser",
  async (credential, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Google login failed");
      }

      return data.user;
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.error = null;
      localStorage.clear();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("role", action.payload.role || "user");
        localStorage.setItem("plan", action.payload.plan || "free");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("role", action.payload.role || "user");
        localStorage.setItem("plan", action.payload.plan || "free");
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutLocal, clearAuthError } = authSlice.actions;
export default authSlice.reducer;