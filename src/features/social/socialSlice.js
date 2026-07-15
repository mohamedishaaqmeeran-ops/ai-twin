import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getConnectionsAPI,
  disconnectAPI,
} from "./socialAPI";

import {
  createYouTubeLiveAPI,
  startYouTubeRtmpAPI,
  waitForYouTubeStreamAPI,
  startYouTubeBroadcastAPI,
  endYouTubeBroadcastAPI,
  stopYouTubeRtmpAPI,
} from "./youtubeLiveAPI";

/* =========================================================
   CONNECTIONS
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
          error.message
        );
      }
    }
  );

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
        await disconnectAPI(
          platform
        );

        return platform;
      } catch (error) {
        return rejectWithValue(
          error.message
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
      {
        videoPath,
        title,
        description,
        onWaiting,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const created =
          await createYouTubeLiveAPI({
            title,
            description,
            privacyStatus:
              "unlisted",
          });

        await startYouTubeRtmpAPI({
          videoPath,
        });

        await waitForYouTubeStreamAPI({
          onWaiting,
        });

        const started =
          await startYouTubeBroadcastAPI();

        return {
          ...created,
          ...started,
        };
      } catch (error) {
        /*
         * Stop FFmpeg if any later
         * operation failed.
         */
        await stopYouTubeRtmpAPI()
          .catch(() => {});

        return rejectWithValue(
          error.message
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
        /*
         * Complete YouTube first,
         * then stop FFmpeg.
         */
        const result =
          await endYouTubeBroadcastAPI();

        await stopYouTubeRtmpAPI();

        return result;
      } catch (error) {
        await stopYouTubeRtmpAPI()
          .catch(() => {});

        return rejectWithValue(
          error.message
        );
      }
    }
  );

/* =========================================================
   SLICE
========================================================= */

const socialSlice =
  createSlice({
    name: "social",

    initialState: {
      connections: [],
      loading: false,
      error: null,

      youtubeLiveLoading:
        false,

      youtubeLiveStatus:
        "idle",

      youtubeLiveData: null,
    },

    reducers: {
      clearSocialError: (
        state
      ) => {
        state.error = null;
      },

      resetYouTubeLive: (
        state
      ) => {
        state.youtubeLiveStatus =
          "idle";

        state.youtubeLiveData =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder
        .addCase(
          fetchConnections.pending,
          (state) => {
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
              action.payload || [];
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

        .addCase(
          disconnectSocial.pending,
          (state) => {
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
                (item) =>
                  item.platform !==
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

        .addCase(
          startYouTubeLive.pending,
          (state) => {
            state.youtubeLiveLoading =
              true;

            state.youtubeLiveStatus =
              "starting";

            state.error = null;
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
              "live";

            state.youtubeLiveData =
              action.payload;
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

            state.error =
              action.payload;
          }
        )

        .addCase(
          stopYouTubeLive.pending,
          (state) => {
            state.youtubeLiveLoading =
              true;

            state.error = null;
          }
        )

        .addCase(
          stopYouTubeLive.fulfilled,
          (state) => {
            state.youtubeLiveLoading =
              false;

            state.youtubeLiveStatus =
              "stopped";
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

            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  clearSocialError,
  resetYouTubeLive,
} = socialSlice.actions;

export default socialSlice.reducer;