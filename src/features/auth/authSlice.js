import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = "https://twinn-backend.onrender.com/api/auth";





export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);





/* ---------------- LOGIN ---------------- */

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------- GOOGLE LOGIN ---------------- */

export const googleLoginUser = createAsyncThunk(
  "auth/googleLoginUser",
  async (credential, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Google login failed");
      }

      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------- GET CURRENT USER ---------------- */

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/me`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Unauthorized");
      }

      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------- LOGOUT ---------------- */

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return rejectWithValue(data.message || "Logout failed");
      }

      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------------- STATE ---------------- */

const initialState = {
  user: null,
  loading: false,
  error: null,
};

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
// REGISTER
.addCase(registerUser.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(registerUser.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  state.user = action.payload.user || action.payload;
})
.addCase(registerUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Registration failed";
})
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GOOGLE LOGIN
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH CURRENT USER
      .addCase(fetchMe.pending, (state) => {
  state.loading = true;
})
.addCase(fetchMe.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload;
})
.addCase(fetchMe.rejected, (state) => {
    state.loading = false;
    state.user = null;
    state.error = null;   // don't show error
})

      // LOGOUT
     // LOGOUT
.addCase(logoutUser.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(logoutUser.fulfilled, (state) => {
  state.loading = false;
  state.user = null;
  state.error = null;
})

.addCase(logoutUser.rejected, (state, action) => {
  state.loading = false;
  state.user = null;
  state.error = action.payload || null;
})
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;