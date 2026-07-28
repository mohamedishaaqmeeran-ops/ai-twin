import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getConnectionsAPI,
  disconnectSocialAPI,
  saveInstagramRTMPAPI,
  saveRTMPConnectionAPI,
  startLiveAPI,
  stopPlatformLiveAPI,
  stopAllLiveAPI,
  getLiveStatusAPI,
  normalizePlatform,
} from "./socialAPI";

/* =========================================================
   HELPERS
========================================================= */

const getErrorMessage = (
  error,
  fallback
) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    String(error || "") ||
    fallback
  );
};

const extractPayload = (
  payload
) => {
  return (
    payload?.data ||
    payload?.result ||
    payload
  );
};

/* =========================================================
   CONNECTION THUNKS
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
          getErrorMessage(
            error,
            "Unable to load social connections."
          )
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
        await disconnectSocialAPI(
          platform
        );

        return normalizePlatform(
          platform
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to disconnect platform."
          )
        );
      }
    }
  );

export const saveInstagramRTMP =
  createAsyncThunk(
    "social/saveInstagramRTMP",
    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await saveInstagramRTMPAPI(
          payload
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to save Instagram RTMP."
          )
        );
      }
    }
  );

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
        return await saveRTMPConnectionAPI(
          platform,
          data
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to save RTMP connection."
          )
        );
      }
    }
  );

/* =========================================================
   LIVE THUNKS
========================================================= */

export const startLive =
  createAsyncThunk(
    "social/startLive",
    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const result =
          await startLiveAPI({
            ...payload,

            loop:
              payload?.loop !==
              false,

            videoBitrate:
              payload?.videoBitrate ??
              2000,

            audioBitrate:
              payload?.audioBitrate ??
              96,

            width:
              payload?.width ??
              720,

            height:
              payload?.height ??
              1280,

            fps:
              payload?.fps ??
              30,

            keyframeInterval:
              payload?.keyframeInterval ??
              2,

            preset:
              payload?.preset ||
              "ultrafast",

            includeAudio:
              payload?.includeAudio !==
              false,

            reconnect:
              payload?.reconnect !==
              false,

            rollbackOnFailure:
              false,
          });

        return extractPayload(
          result
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to start live stream."
          )
        );
      }
    }
  );

export const fetchLiveStatus =
  createAsyncThunk(
    "social/fetchLiveStatus",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getLiveStatusAPI();
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load live status."
          )
        );
      }
    }
  );

export const stopPlatformLive =
  createAsyncThunk(
    "social/stopPlatformLive",
    async (
      platform,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const result =
          await stopPlatformLiveAPI(
            platform
          );

        return {
          platform:
            normalizePlatform(
              platform
            ),

          result,
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to stop live stream."
          )
        );
      }
    }
  );

export const stopAllLive =
  createAsyncThunk(
    "social/stopAllLive",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await stopAllLiveAPI();
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to stop active streams."
          )
        );
      }
    }
  );

/* =========================================================
   SLICE
========================================================= */

const initialState = {
  connections: [],

  liveStatus: [],

  activePlatforms: [],

  loading: false,

  liveLoading: false,

  statusLoading: false,

  error: null,

  liveResult: null,
};

const socialSlice =
  createSlice({
    name:
      "social",

    initialState,

    reducers: {
      clearSocialError:
        (state) => {
          state.error =
            null;
        },

      clearLiveResult:
        (state) => {
          state.liveResult =
            null;
        },
    },

    extraReducers:
      (builder) => {
        builder
          .addCase(
            fetchConnections.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )
          .addCase(
            fetchConnections.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

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
              state.loading =
                false;

              state.error =
                action.payload;
            }
          )

          .addCase(
            disconnectSocial.fulfilled,
            (
              state,
              action
            ) => {
              state.connections =
                state.connections.filter(
                  (connection) =>
                    normalizePlatform(
                      connection?.platform
                    ) !==
                    action.payload
                );
            }
          )

          .addCase(
            saveInstagramRTMP.fulfilled,
            (state) => {
              state.error =
                null;
            }
          )
          .addCase(
            saveRTMPConnection.fulfilled,
            (state) => {
              state.error =
                null;
            }
          )

          .addCase(
            startLive.pending,
            (state) => {
              state.liveLoading =
                true;

              state.error =
                null;

              state.liveResult =
                null;
            }
          )
          .addCase(
            startLive.fulfilled,
            (
              state,
              action
            ) => {
              state.liveLoading =
                false;

              state.liveResult =
                action.payload;

              const results =
                Array.isArray(
                  action.payload?.results
                )
                  ? action.payload.results
                  : [];

              state.activePlatforms =
                results
                  .filter(
                    (item) =>
                      item?.success !==
                      false
                  )
                  .map(
                    (item) =>
                      normalizePlatform(
                        item?.platform
                      )
                  )
                  .filter(Boolean);
            }
          )
          .addCase(
            startLive.rejected,
            (
              state,
              action
            ) => {
              state.liveLoading =
                false;

              state.error =
                action.payload;
            }
          )

          .addCase(
            fetchLiveStatus.pending,
            (state) => {
              state.statusLoading =
                true;
            }
          )
          .addCase(
            fetchLiveStatus.fulfilled,
            (
              state,
              action
            ) => {
              state.statusLoading =
                false;

              state.liveStatus =
                Array.isArray(
                  action.payload
                )
                  ? action.payload
                  : [];

              state.activePlatforms =
                state.liveStatus
                  .filter(
                    (item) =>
                      item?.processActive ===
                        true ||
                      [
                        "starting",
                        "started",
                        "streaming",
                        "live",
                      ].includes(
                        String(
                          item?.runtimeStatus ||
                          item?.databaseStatus ||
                          ""
                        ).toLowerCase()
                      )
                  )
                  .map(
                    (item) =>
                      normalizePlatform(
                        item?.platform
                      )
                  )
                  .filter(Boolean);
            }
          )
          .addCase(
            fetchLiveStatus.rejected,
            (
              state,
              action
            ) => {
              state.statusLoading =
                false;

              state.error =
                action.payload;
            }
          )

          .addCase(
            stopPlatformLive.pending,
            (state) => {
              state.liveLoading =
                true;

              state.error =
                null;
            }
          )
          .addCase(
            stopPlatformLive.fulfilled,
            (state) => {
              /*
               * A shared-encoder session uses one FFmpeg
               * process for every selected destination.
               * Stopping one alias normally stops the
               * complete shared process.
               */
              state.liveLoading =
                false;

              state.activePlatforms =
                [];

              state.liveStatus =
                state.liveStatus.map(
                  (item) => ({
                    ...item,

                    processActive:
                      false,

                    runtimeStatus:
                      "stopped",
                  })
                );
            }
          )
          .addCase(
            stopPlatformLive.rejected,
            (
              state,
              action
            ) => {
              state.liveLoading =
                false;

              state.error =
                action.payload;
            }
          )

          .addCase(
            stopAllLive.pending,
            (state) => {
              state.liveLoading =
                true;

              state.error =
                null;
            }
          )
          .addCase(
            stopAllLive.fulfilled,
            (state) => {
              state.liveLoading =
                false;

              state.activePlatforms =
                [];

              state.liveStatus =
                state.liveStatus.map(
                  (item) => ({
                    ...item,

                    processActive:
                      false,

                    runtimeStatus:
                      "stopped",
                  })
                );
            }
          )
          .addCase(
            stopAllLive.rejected,
            (
              state,
              action
            ) => {
              state.liveLoading =
                false;

              state.error =
                action.payload;
            }
          )

          .addMatcher(
            (
              action
            ) =>
              action.type.startsWith(
                "social/"
              ) &&
              action.type.endsWith(
                "/rejected"
              ),
            (
              state,
              action
            ) => {
              if (
                !state.error
              ) {
                state.error =
                  action.payload ||
                  "Social request failed.";
              }
            }
          );
      },
  });

export const {
  clearSocialError,
  clearLiveResult,
} =
  socialSlice.actions;

export default socialSlice.reducer;
