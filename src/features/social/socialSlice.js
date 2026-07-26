import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getConnectionsAPI,
  disconnectSocialAPI,
  saveRTMPConnectionAPI,
  startYouTubeLiveAPI,
  stopYouTubeLiveAPI,
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
   DISCONNECT SOCIAL PLATFORM
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
        const response =
          await saveRTMPConnectionAPI(
            platform,
            data
          );

        return {
          platform,
          connection:
            response?.connection ||
            response?.data ||
            response,
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
   START YOUTUBE LIVE
========================================================= */

export const startYouTubeLive =
  createAsyncThunk(
    "social/startYouTubeLive",
    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const {
          onWaiting,
          ...requestData
        } = payload || {};

        return await startYouTubeLiveAPI(
          requestData,
          onWaiting
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Unable to start YouTube live."
        );
      }
    }
  );

/* =========================================================
   STOP YOUTUBE LIVE
========================================================= */

export const stopYouTubeLive =
  createAsyncThunk(
    "social/stopYouTubeLive",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await stopYouTubeLiveAPI();
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Unable to stop YouTube live."
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

  youtubeLiveLoading: false,
  youtubeLiveStatus: "idle",
  youtubeLiveData: null,
  youtubeLiveError: null,
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
          state.youtubeLiveError =
            null;
        },

      resetYouTubeLive:
        (
          state
        ) => {
          state.youtubeLiveLoading =
            false;

          state.youtubeLiveStatus =
            "idle";

          state.youtubeLiveData =
            null;

          state.youtubeLiveError =
            null;
        },
    },

    extraReducers:
      (
        builder
      ) => {
        builder

          /* =================================================
             FETCH CONNECTIONS
          ================================================= */

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

              const payload =
                action.payload;

              state.connections =
                Array.isArray(payload)
                  ? payload
                  : Array.isArray(
                      payload?.connections
                    )
                  ? payload.connections
                  : Array.isArray(
                      payload?.data
                    )
                  ? payload.data
                  : Array.isArray(
                      payload?.data
                        ?.connections
                    )
                  ? payload.data
                      .connections
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
                action.payload ||
                "Unable to load social connections.";
            }
          )

          /* =================================================
             DISCONNECT
          ================================================= */

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

              const platform =
                String(
                  action.payload || ""
                ).toLowerCase();

              state.connections =
                state.connections.filter(
                  (
                    connection
                  ) =>
                    String(
                      connection
                        ?.platform || ""
                    ).toLowerCase() !==
                    platform
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
                action.payload ||
                "Unable to disconnect platform.";
            }
          )

          /* =================================================
             SAVE RTMP
          ================================================= */

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
              state,
              action
            ) => {
              state.loading = false;

              const platform =
                String(
                  action.payload
                    ?.platform || ""
                ).toLowerCase();

              const returnedConnection =
                action.payload
                  ?.connection;

              const connection =
                returnedConnection &&
                typeof returnedConnection ===
                  "object"
                  ? {
                      ...returnedConnection,
                      platform,
                      connected: true,
                    }
                  : {
                      platform,
                      connected: true,
                    };

              const existingIndex =
                state.connections.findIndex(
                  (
                    item
                  ) =>
                    String(
                      item?.platform ||
                        ""
                    ).toLowerCase() ===
                    platform
                );

              if (
                existingIndex >= 0
              ) {
                state.connections[
                  existingIndex
                ] = {
                  ...state.connections[
                    existingIndex
                  ],
                  ...connection,
                };
              } else {
                state.connections.push(
                  connection
                );
              }
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
                action.payload ||
                "Unable to save RTMP connection.";
            }
          )

          /* =================================================
             START YOUTUBE LIVE
          ================================================= */

          .addCase(
            startYouTubeLive.pending,
            (
              state
            ) => {
              state.youtubeLiveLoading =
                true;

              state.youtubeLiveStatus =
                "starting";

              state.youtubeLiveError =
                null;
            }
          )

          .addCase(
            startYouTubeLive.fulfilled,
            (
              state,
              action
            ) => {
              state.youtubeLiveLoading =
                false;

              state.youtubeLiveStatus =
                action.payload
                  ?.status ||
                action.payload?.data
                  ?.status ||
                "live";

              state.youtubeLiveData =
                action.payload?.data ||
                action.payload ||
                null;
            }
          )

          .addCase(
            startYouTubeLive.rejected,
            (
              state,
              action
            ) => {
              state.youtubeLiveLoading =
                false;

              state.youtubeLiveStatus =
                "failed";

              state.youtubeLiveError =
                action.payload ||
                "Unable to start YouTube live.";
            }
          )

          /* =================================================
             STOP YOUTUBE LIVE
          ================================================= */

          .addCase(
            stopYouTubeLive.pending,
            (
              state
            ) => {
              state.youtubeLiveLoading =
                true;

              state.youtubeLiveStatus =
                "stopping";

              state.youtubeLiveError =
                null;
            }
          )

          .addCase(
            stopYouTubeLive.fulfilled,
            (
              state,
              action
            ) => {
              state.youtubeLiveLoading =
                false;

              state.youtubeLiveStatus =
                "stopped";

              state.youtubeLiveData =
                action.payload?.data ||
                action.payload ||
                null;
            }
          )

          .addCase(
            stopYouTubeLive.rejected,
            (
              state,
              action
            ) => {
              state.youtubeLiveLoading =
                false;

              state.youtubeLiveStatus =
                "failed";

              state.youtubeLiveError =
                action.payload ||
                "Unable to stop YouTube live.";
            }
          );
      },
  });

export const {
  clearSocialError,
  resetYouTubeLive,
} = socialSlice.actions;

export default socialSlice.reducer;