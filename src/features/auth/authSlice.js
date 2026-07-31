import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL =
  String(
    import.meta.env
      .VITE_API_URL ||
      "https://twinn-backend.onrender.com/api"
  )
    .trim()
    .replace(/\/+$/, "");

const ACCESS_TOKEN_KEY =
  "twinn_access_token";

/* =========================================================
   TOKEN HELPERS
========================================================= */

const getStoredAccessToken =
  () => {
    try {
      return (
        localStorage.getItem(
          ACCESS_TOKEN_KEY
        ) || ""
      );
    } catch {
      return "";
    }
  };

const storeAccessToken = (
  token
) => {
  try {
    if (token) {
      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        token
      );
    }
  } catch (error) {
    console.error(
      "Unable to store access token:",
      error
    );
  }
};

const removeAccessToken =
  () => {
    try {
      localStorage.removeItem(
        ACCESS_TOKEN_KEY
      );
    } catch (error) {
      console.error(
        "Unable to remove access token:",
        error
      );
    }
  };

/* =========================================================
   AXIOS INSTANCE
========================================================= */

export const authApi =
  axios.create({
    baseURL:
      API_URL,

    /*
     Use the HttpOnly cookie whenever the
     browser allows it.
    */
    withCredentials:
      true,

    timeout:
      30000,

    headers: {
      Accept:
        "application/json",

      "Content-Type":
        "application/json",
    },
  });

/* =========================================================
   AUTHORIZATION INTERCEPTOR
========================================================= */

authApi.interceptors
  .request.use(
    (config) => {
      const accessToken =
        getStoredAccessToken();

      if (accessToken) {
        config.headers =
          config.headers || {};

        config.headers
          .Authorization =
          `Bearer ${accessToken}`;
      }

      return config;
    },

    (error) =>
      Promise.reject(
        error
      )
  );

/* =========================================================
   ERROR NORMALIZER
========================================================= */

const getErrorPayload = (
  error,
  fallbackMessage
) => {
  if (
    error?.code ===
    "ECONNABORTED"
  ) {
    return {
      success: false,

      code:
        "REQUEST_TIMEOUT",

      message:
        "The request took too long. Please try again.",
    };
  }

  if (!error?.response) {
    return {
      success: false,

      code:
        "NETWORK_ERROR",

      message:
        "Unable to connect to the server. Please check your internet connection.",
    };
  }

  const data =
    error.response?.data;

  if (
    typeof data ===
    "string"
  ) {
    return {
      success: false,

      status:
        error.response
          ?.status ||
        null,

      code:
        "REQUEST_FAILED",

      message:
        data ||
        fallbackMessage,
    };
  }

  return {
    success: false,

    status:
      error.response?.status ||
      null,

    code:
      data?.code ||
      "REQUEST_FAILED",

    message:
      data?.message ||
      fallbackMessage,

    errors:
      data?.errors ||
      null,

    details:
      data?.details ||
      null,

    email:
      data?.email ||
      null,

    requiresVerification:
      Boolean(
        data?.requiresVerification
      ),

    requiresUpgrade:
      Boolean(
        data?.requiresUpgrade
      ),

    plan:
      data?.plan ||
      null,

    subscriptionStatus:
      data?.subscriptionStatus ||
      null,
  };
};

/* =========================================================
   SAVE AUTH RESPONSE
========================================================= */

const saveAuthentication =
  (data) => {
    const accessToken =
      data?.accessToken ||
      data?.token;

    if (accessToken) {
      storeAccessToken(
        accessToken
      );
    }

    return data;
  };

/* =========================================================
   REGISTER WITH EMAIL
========================================================= */

export const registerUser =
  createAsyncThunk(
    "auth/registerUser",

    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.post(
            "/auth/register",
            payload
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            "Registration failed."
          )
        );
      }
    }
  );

/* =========================================================
   LOGIN WITH EMAIL
========================================================= */

export const loginUser =
  createAsyncThunk(
    "auth/loginUser",

    async (
      {
        email,
        password,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.post(
            "/auth/login",
            {
              email:
                String(
                  email || ""
                )
                  .trim()
                  .toLowerCase(),

              password,
            }
          );

        return saveAuthentication(
          response.data
        );
      } catch (error) {
        removeAccessToken();

        return rejectWithValue(
          getErrorPayload(
            error,
            "Login failed."
          )
        );
      }
    }
  );

/* =========================================================
   GOOGLE AUTHENTICATION
========================================================= */

export const googleLoginUser =
  createAsyncThunk(
    "auth/googleLoginUser",

    async (
      {
        credential,
        role,
        mode,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const body = {
          credential,
        };

        if (role) {
          body.role =
            role;
        }

        if (mode) {
          body.mode =
            mode;
        }

        const response =
          await authApi.post(
            "/auth/google",
            body
          );

        return saveAuthentication(
          response.data
        );
      } catch (error) {
        removeAccessToken();

        return rejectWithValue(
          getErrorPayload(
            error,
            "Google authentication failed."
          )
        );
      }
    }
  );

/* =========================================================
   FETCH CURRENT USER
========================================================= */

export const fetchMe =
  createAsyncThunk(
    "auth/fetchMe",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.get(
            "/auth/me"
          );

        return response.data;
      } catch (error) {
        const status =
          error.response?.status;

        if (
          status === 401 ||
          status === 403
        ) {
          removeAccessToken();
        }

        return rejectWithValue(
          getErrorPayload(
            error,
            "Unable to fetch user."
          )
        );
      }
    }
  );

/* =========================================================
   UPDATE PROFILE
========================================================= */

export const updateProfile =
  createAsyncThunk(
    "auth/updateProfile",

    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.patch(
            "/auth/me",
            payload
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            "Unable to update profile."
          )
        );
      }
    }
  );

/* =========================================================
   RESEND VERIFICATION
========================================================= */

export const resendVerificationEmail =
  createAsyncThunk(
    "auth/resendVerificationEmail",

    async (
      {
        email,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.post(
            "/auth/resend-verification",
            {
              email:
                String(
                  email || ""
                )
                  .trim()
                  .toLowerCase(),
            }
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            "Unable to resend verification email."
          )
        );
      }
    }
  );

/* =========================================================
   VERIFY EMAIL
========================================================= */

export const verifyEmail =
  createAsyncThunk(
    "auth/verifyEmail",

    async (
      token,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.get(
            `/auth/verify-email/${encodeURIComponent(
              token
            )}`
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            "Email verification failed."
          )
        );
      }
    }
  );

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export const forgotPassword =
  createAsyncThunk(
    "auth/forgotPassword",

    async (
      {
        email,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.post(
            "/auth/forgot-password",
            {
              email:
                String(
                  email || ""
                )
                  .trim()
                  .toLowerCase(),
            }
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            "Unable to send password reset email."
          )
        );
      }
    }
  );

/* =========================================================
   RESET PASSWORD
========================================================= */

export const resetPassword =
  createAsyncThunk(
    "auth/resetPassword",

    async (
      {
        token,
        password,
        confirmPassword,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.post(
            `/auth/reset-password/${encodeURIComponent(
              token
            )}`,
            {
              password,
              confirmPassword,
            }
          );

        removeAccessToken();

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getErrorPayload(
            error,
            "Unable to reset password."
          )
        );
      }
    }
  );

/* =========================================================
   LOGOUT
========================================================= */

export const logoutUser =
  createAsyncThunk(
    "auth/logoutUser",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await authApi.post(
            "/auth/logout"
          );

        removeAccessToken();

        return response.data;
      } catch (error) {
        removeAccessToken();

        if (
          error.response
            ?.status === 401 ||
          error.response
            ?.status === 403
        ) {
          return {
            success: true,

            message:
              "Logged out successfully.",
          };
        }

        return rejectWithValue(
          getErrorPayload(
            error,
            "Logout failed."
          )
        );
      }
    }
  );

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  user: null,

  isAuthenticated:
    false,

  authChecked:
    false,

  loading:
    false,

  registerLoading:
    false,

  loginLoading:
    false,

  googleLoading:
    false,

  profileLoading:
    false,

  logoutLoading:
    false,

  verificationLoading:
    false,

  passwordLoading:
    false,

  error:
    null,

  errorCode:
    null,

  fieldErrors:
    null,

  message:
    null,
};

/* =========================================================
   SHARED HELPERS
========================================================= */

const clearRequestError = (
  state
) => {
  state.error =
    null;

  state.errorCode =
    null;

  state.fieldErrors =
    null;

  state.message =
    null;
};

const applyRejectedState = (
  state,
  action,
  fallbackMessage
) => {
  const payload =
    action.payload;

  state.error =
    payload?.message ||
    action.error?.message ||
    fallbackMessage;

  state.errorCode =
    payload?.code ||
    null;

  state.fieldErrors =
    payload?.errors ||
    null;
};

const applyAuthenticatedUser = (
  state,
  payload
) => {
  const user =
    payload?.user ||
    null;

  state.user =
    user;

  state.isAuthenticated =
    Boolean(user);

  state.authChecked =
    true;

  state.message =
    payload?.message ||
    null;
};

/* =========================================================
   AUTH SLICE
========================================================= */

const authSlice =
  createSlice({
    name:
      "auth",

    initialState,

    reducers: {
      clearAuthError:
        (state) => {
          state.error =
            null;

          state.errorCode =
            null;

          state.fieldErrors =
            null;
        },

      clearAuthMessage:
        (state) => {
          state.message =
            null;
        },

      clearAuthState:
        (state) => {
          removeAccessToken();

          state.user =
            null;

          state.isAuthenticated =
            false;

          state.authChecked =
            true;

          state.loading =
            false;

          state.error =
            null;

          state.errorCode =
            null;

          state.fieldErrors =
            null;

          state.message =
            null;
        },

      setAuthUser:
        (
          state,
          action
        ) => {
          state.user =
            action.payload ||
            null;

          state.isAuthenticated =
            Boolean(
              action.payload
            );

          state.authChecked =
            true;
        },

      updateUserLocally:
        (
          state,
          action
        ) => {
          if (
            !state.user ||
            !action.payload
          ) {
            return;
          }

          state.user = {
            ...state.user,
            ...action.payload,
          };
        },
    },

    extraReducers:
      (builder) => {
        builder

          /* REGISTER */

          .addCase(
            registerUser.pending,
            (state) => {
              clearRequestError(
                state
              );

              state.loading =
                true;

              state.registerLoading =
                true;
            }
          )

          .addCase(
            registerUser.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.registerLoading =
                false;

              state.user =
                action.payload
                  ?.user ||
                null;

              state.isAuthenticated =
                Boolean(
                  action.payload
                    ?.authenticated
                );

              state.message =
                action.payload
                  ?.message ||
                "Registration successful.";
            }
          )

          .addCase(
            registerUser.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.registerLoading =
                false;

              applyRejectedState(
                state,
                action,
                "Registration failed."
              );
            }
          )

          /* EMAIL LOGIN */

          .addCase(
            loginUser.pending,
            (state) => {
              clearRequestError(
                state
              );

              state.loading =
                true;

              state.loginLoading =
                true;
            }
          )

          .addCase(
            loginUser.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.loginLoading =
                false;

              applyAuthenticatedUser(
                state,
                action.payload
              );
            }
          )

          .addCase(
            loginUser.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.loginLoading =
                false;

              state.user =
                null;

              state.isAuthenticated =
                false;

              applyRejectedState(
                state,
                action,
                "Login failed."
              );
            }
          )

          /* GOOGLE LOGIN */

          .addCase(
            googleLoginUser.pending,
            (state) => {
              clearRequestError(
                state
              );

              state.loading =
                true;

              state.googleLoading =
                true;
            }
          )

          .addCase(
            googleLoginUser.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.googleLoading =
                false;

              applyAuthenticatedUser(
                state,
                action.payload
              );
            }
          )

          .addCase(
            googleLoginUser.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.googleLoading =
                false;

              state.user =
                null;

              state.isAuthenticated =
                false;

              applyRejectedState(
                state,
                action,
                "Google authentication failed."
              );
            }
          )

          /* FETCH ME */

          .addCase(
            fetchMe.pending,
            (state) => {
              state.loading =
                true;

              state.authChecked =
                false;
            }
          )

          .addCase(
            fetchMe.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              applyAuthenticatedUser(
                state,
                action.payload
              );
            }
          )

          .addCase(
            fetchMe.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.user =
                null;

              state.isAuthenticated =
                false;

              state.authChecked =
                true;

              const status =
                action.payload
                  ?.status;

              if (
                status !== 401 &&
                status !== 403
              ) {
                applyRejectedState(
                  state,
                  action,
                  "Unable to fetch user."
                );
              }
            }
          )

          /* UPDATE PROFILE */

          .addCase(
            updateProfile.pending,
            (state) => {
              clearRequestError(
                state
              );

              state.profileLoading =
                true;
            }
          )

          .addCase(
            updateProfile.fulfilled,
            (
              state,
              action
            ) => {
              state.profileLoading =
                false;

              const updatedUser =
                action.payload
                  ?.user;

              if (updatedUser) {
                state.user =
                  updatedUser;

                state.isAuthenticated =
                  true;
              }

              state.message =
                action.payload
                  ?.message ||
                "Profile updated successfully.";
            }
          )

          .addCase(
            updateProfile.rejected,
            (
              state,
              action
            ) => {
              state.profileLoading =
                false;

              applyRejectedState(
                state,
                action,
                "Unable to update profile."
              );
            }
          )

          /* RESEND VERIFICATION */

          .addCase(
            resendVerificationEmail
              .pending,
            (state) => {
              clearRequestError(
                state
              );

              state.verificationLoading =
                true;
            }
          )

          .addCase(
            resendVerificationEmail
              .fulfilled,
            (
              state,
              action
            ) => {
              state.verificationLoading =
                false;

              state.message =
                action.payload
                  ?.message ||
                "Verification email sent.";
            }
          )

          .addCase(
            resendVerificationEmail
              .rejected,
            (
              state,
              action
            ) => {
              state.verificationLoading =
                false;

              applyRejectedState(
                state,
                action,
                "Unable to resend verification email."
              );
            }
          )

          /* VERIFY EMAIL */

          .addCase(
            verifyEmail.pending,
            (state) => {
              clearRequestError(
                state
              );

              state.verificationLoading =
                true;
            }
          )

          .addCase(
            verifyEmail.fulfilled,
            (
              state,
              action
            ) => {
              state.verificationLoading =
                false;

              if (
                action.payload
                  ?.user
              ) {
                state.user =
                  action.payload.user;
              }

              state.message =
                action.payload
                  ?.message ||
                "Email verified successfully.";
            }
          )

          .addCase(
            verifyEmail.rejected,
            (
              state,
              action
            ) => {
              state.verificationLoading =
                false;

              applyRejectedState(
                state,
                action,
                "Email verification failed."
              );
            }
          )

          /* FORGOT PASSWORD */

          .addCase(
            forgotPassword.pending,
            (state) => {
              clearRequestError(
                state
              );

              state.passwordLoading =
                true;
            }
          )

          .addCase(
            forgotPassword.fulfilled,
            (
              state,
              action
            ) => {
              state.passwordLoading =
                false;

              state.message =
                action.payload
                  ?.message ||
                "Password reset email sent.";
            }
          )

          .addCase(
            forgotPassword.rejected,
            (
              state,
              action
            ) => {
              state.passwordLoading =
                false;

              applyRejectedState(
                state,
                action,
                "Unable to send password reset email."
              );
            }
          )

          /* RESET PASSWORD */

          .addCase(
            resetPassword.pending,
            (state) => {
              clearRequestError(
                state
              );

              state.passwordLoading =
                true;
            }
          )

          .addCase(
            resetPassword.fulfilled,
            (
              state,
              action
            ) => {
              state.passwordLoading =
                false;

              state.message =
                action.payload
                  ?.message ||
                "Password reset successfully.";
            }
          )

          .addCase(
            resetPassword.rejected,
            (
              state,
              action
            ) => {
              state.passwordLoading =
                false;

              applyRejectedState(
                state,
                action,
                "Unable to reset password."
              );
            }
          )

          /* LOGOUT */

          .addCase(
            logoutUser.pending,
            (state) => {
              state.logoutLoading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            logoutUser.fulfilled,
            (state) => {
              state.user =
                null;

              state.isAuthenticated =
                false;

              state.authChecked =
                true;

              state.loading =
                false;

              state.logoutLoading =
                false;

              state.error =
                null;

              state.errorCode =
                null;

              state.fieldErrors =
                null;

              state.message =
                "Logged out successfully.";
            }
          )

          .addCase(
            logoutUser.rejected,
            (
              state,
              action
            ) => {
              state.logoutLoading =
                false;

              applyRejectedState(
                state,
                action,
                "Logout failed."
              );
            }
          );
      },
  });

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearAuthError,
  clearAuthMessage,
  clearAuthState,
  setAuthUser,
  updateUserLocally,
} = authSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectAuth = (
  state
) =>
  state.auth;

export const selectAuthUser = (
  state
) =>
  state.auth?.user ||
  null;

export const selectIsAuthenticated = (
  state
) =>
  Boolean(
    state.auth
      ?.isAuthenticated
  );

export const selectAuthChecked = (
  state
) =>
  Boolean(
    state.auth
      ?.authChecked
  );

export const selectAuthLoading = (
  state
) =>
  Boolean(
    state.auth?.loading
  );

export const selectAuthError = (
  state
) =>
  state.auth?.error ||
  null;

export default authSlice.reducer;