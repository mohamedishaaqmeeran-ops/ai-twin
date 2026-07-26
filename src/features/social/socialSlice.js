import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getConnectionsAPI,
  disconnectSocialAPI,
  saveRTMPConnectionAPI,
} from "./socialAPI";

/* =========================================================
   FETCH CONNECTIONS
========================================================= */

export const fetchConnections =
  createAsyncThunk(
    "social/fetchConnections",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getConnectionsAPI();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Unable to load social connections."
        );
      }
    }
  );

/* =========================================================
   DISCONNECT
========================================================= */

export const disconnectSocial =
  createAsyncThunk(
    "social/disconnectSocial",
    async (
      platform,
      {
        rejectWithValue,
      }
    ) => {
      try {
        await disconnectSocialAPI(
          platform
        );

        return platform;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Unable to disconnect platform."
        );
      }
    }
  );

/* =========================================================
   SAVE RTMP CONNECTION
========================================================= */

export const saveRTMPConnection =
  createAsyncThunk(
    "social/saveRTMPConnection",
    async (
      {
        platform,
        data,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        await saveRTMPConnectionAPI(
          platform,
          data
        );

        return {
          platform,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Unable to save RTMP connection."
        );
      }
    }
  );

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  connections: [],
  loading: false,
  error: null,
};

/* =========================================================
   SLICE
========================================================= */

const socialSlice =
  createSlice({
    name: "social",

    initialState,

    reducers: {
      clearSocialError:
        (
          state
        ) => {
          state.error = null;
        },
    },

    extraReducers:
      (
        builder
      ) => {
        builder
          /* FETCH */

          .addCase(
            fetchConnections.pending,
            (
              state
            ) => {
              state.loading = true;
              state.error = null;
            }
          )

          .addCase(
            fetchConnections.fulfilled,
            (
              state,
              action
            ) => {
              state.loading = false;

              state.connections =
                Array.isArray(
                  action.payload
                )
                  ? action.payload
                  : [];
            }
          )

          .addCase(
            fetchConnections.rejected,
            (
              state,
              action
            ) => {
              state.loading = false;

              state.error =
                action.payload;
            }
          )

          /* DISCONNECT */

          .addCase(
            disconnectSocial.pending,
            (
              state
            ) => {
              state.loading = true;
              state.error = null;
            }
          )

          .addCase(
            disconnectSocial.fulfilled,
            (
              state,
              action
            ) => {
              state.loading = false;

              state.connections =
                state.connections.filter(
                  (
                    connection
                  ) =>
                    connection.platform !==
                    action.payload
                );
            }
          )

          .addCase(
            disconnectSocial.rejected,
            (
              state,
              action
            ) => {
              state.loading = false;

              state.error =
                action.payload;
            }
          )

          /* SAVE RTMP */

          .addCase(
            saveRTMPConnection.pending,
            (
              state
            ) => {
              state.loading = true;
              state.error = null;
            }
          )

          .addCase(
            saveRTMPConnection.fulfilled,
            (
              state
            ) => {
              state.loading = false;
            }
          )

          .addCase(
            saveRTMPConnection.rejected,
            (
              state,
              action
            ) => {
              state.loading = false;

              state.error =
                action.payload;
            }
          );
      },
  });

export const {
  clearSocialError,
} = socialSlice.actions;

export default socialSlice.reducer;