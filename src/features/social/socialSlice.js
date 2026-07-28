import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getConnectionsAPI,
  disconnectSocialAPI,
  saveInstagramRTMPAPI,
  saveRTMPConnectionAPI,
  createYouTubeLiveAPI,
  getCurrentYouTubeLiveAPI,
  getYouTubeStreamStatusAPI,
  startYouTubeBroadcastAPI,
  endYouTubeBroadcastAPI,
  startLiveAPI,
  stopPlatformLiveAPI,
  stopAllLiveAPI,
  getLiveStatusAPI,
  waitForYouTubeStreamAPI,
  normalizePlatform,
} from "./socialAPI";

/* =========================================================
   HELPERS
========================================================= */

const getErrorMessage = (
  error,
  fallback
) => {
  if (
    typeof error ===
    "string"
  ) {
    return error;
  }

  return (
    error?.response?.data
      ?.message ||
    error?.message ||
    fallback
  );
};

const normalizeConnection = (
  connection
) => {
  if (!connection) {
    return connection;
  }

  return {
    ...connection,

    platform:
      normalizePlatform(
        connection.platform
      ),
  };
};

const upsertConnection = (
  connections,
  incomingConnection
) => {
  const normalizedIncoming =
    normalizeConnection(
      incomingConnection
    );

  if (
    !normalizedIncoming
      ?.platform
  ) {
    return connections;
  }

  const existingIndex =
    connections.findIndex(
      (
        connection
      ) =>
        normalizePlatform(
          connection.platform
        ) ===
        normalizedIncoming.platform
    );

  if (
    existingIndex === -1
  ) {
    return [
      normalizedIncoming,
      ...connections,
    ];
  }

  const updated =
    [
      ...connections,
    ];

  updated[
    existingIndex
  ] = {
    ...updated[
      existingIndex
    ],

    ...normalizedIncoming,
  };

  return updated;
};

const updatePlatformStatus = (
  state,
  platform,
  updates
) => {
  const normalizedPlatform =
    normalizePlatform(
      platform
    );

  const connectionIndex =
    state.connections.findIndex(
      (
        connection
      ) =>
        normalizePlatform(
          connection.platform
        ) ===
        normalizedPlatform
    );

  if (
    connectionIndex !== -1
  ) {
    state.connections[
      connectionIndex
    ] = {
      ...state.connections[
        connectionIndex
      ],

      ...updates,
    };
  }
};

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  connections:
    [],

  loading:
    false,

  connectionLoading:
    false,

  rtmpLoading:
    false,

  youtubeLoading:
    false,

  liveLoading:
    false,

  statusLoading:
    false,

  error:
    null,

  successMessage:
    null,

  currentYouTubeLive:
    null,

  youtubeStreamStatus:
    null,

  liveStatus:
    [],

  activePlatforms:
    [],

  lastLiveResult:
    null,
};

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
          getErrorMessage(
            error,
            "Unable to load social connections."
          )
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
        const normalizedPlatform =
          normalizePlatform(
            platform
          );

        const response =
          await disconnectSocialAPI(
            normalizedPlatform
          );

        return {
          platform:
            normalizedPlatform,

          response,
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to disconnect social platform."
          )
        );
      }
    }
  );

/* =========================================================
   SAVE INSTAGRAM RTMP
========================================================= */

export const saveInstagramRTMP =
  createAsyncThunk(
    "social/saveInstagramRTMP",
    async (
      data,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await saveInstagramRTMPAPI(
            data
          );

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to save Instagram RTMP settings."
          )
        );
      }
    }
  );

/* =========================================================
   SAVE MANUAL RTMP CONNECTION
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
        const normalizedPlatform =
          normalizePlatform(
            platform
          );

        const response =
          await saveRTMPConnectionAPI(
            normalizedPlatform,
            data
          );

        return {
          platform:
            normalizedPlatform,

          connection:
            response?.data ||
            response,
        };
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
   CREATE YOUTUBE LIVE
========================================================= */

export const createYouTubeLive =
  createAsyncThunk(
    "social/createYouTubeLive",
    async (
      payload = {},
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await createYouTubeLiveAPI(
            payload
          );

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to create YouTube live stream."
          )
        );
      }
    }
  );

/* =========================================================
   GET CURRENT YOUTUBE LIVE
========================================================= */

export const fetchCurrentYouTubeLive =
  createAsyncThunk(
    "social/fetchCurrentYouTubeLive",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await getCurrentYouTubeLiveAPI();

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load YouTube live details."
          )
        );
      }
    }
  );

/* =========================================================
   GET YOUTUBE STREAM STATUS
========================================================= */

export const fetchYouTubeStreamStatus =
  createAsyncThunk(
    "social/fetchYouTubeStreamStatus",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await getYouTubeStreamStatusAPI();

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to check YouTube stream status."
          )
        );
      }
    }
  );

/* =========================================================
   WAIT FOR YOUTUBE STREAM
========================================================= */

export const waitForYouTubeStream =
  createAsyncThunk(
    "social/waitForYouTubeStream",
    async (
      options = {},
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await waitForYouTubeStreamAPI(
            options
          );

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "YouTube is not receiving the stream yet."
          )
        );
      }
    }
  );

/* =========================================================
   START YOUTUBE BROADCAST
========================================================= */

export const startYouTubeBroadcast =
  createAsyncThunk(
    "social/startYouTubeBroadcast",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await startYouTubeBroadcastAPI();

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to start YouTube broadcast."
          )
        );
      }
    }
  );

/* =========================================================
   END YOUTUBE BROADCAST
========================================================= */

export const endYouTubeBroadcast =
  createAsyncThunk(
    "social/endYouTubeBroadcast",
    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await endYouTubeBroadcastAPI();

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to end YouTube broadcast."
          )
        );
      }
    }
  );

/* =========================================================
   START UNIFIED LIVE
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
        const response =
          await startLiveAPI(
            payload
          );

        return (
          response?.data ||
          response
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

/* =========================================================
   STOP ONE LIVE PLATFORM
========================================================= */

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
        const normalizedPlatform =
          normalizePlatform(
            platform
          );

        const response =
          await stopPlatformLiveAPI(
            normalizedPlatform
          );

        return {
          platform:
            normalizedPlatform,

          data:
            response?.data ||
            response,
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to stop platform stream."
          )
        );
      }
    }
  );

/* =========================================================
   STOP ALL LIVE STREAMS
========================================================= */

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
        const response =
          await stopAllLiveAPI();

        return (
          response?.data ||
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to stop active live streams."
          )
        );
      }
    }
  );

/* =========================================================
   FETCH UNIFIED LIVE STATUS
========================================================= */

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

/* =========================================================
   SOCIAL SLICE
========================================================= */

const socialSlice =
  createSlice({
    name:
      "social",

    initialState,

    reducers: {
      clearSocialError: (
        state
      ) => {
        state.error =
          null;
      },

      clearSocialSuccess: (
        state
      ) => {
        state.successMessage =
          null;
      },

      clearCurrentYouTubeLive: (
        state
      ) => {
        state.currentYouTubeLive =
          null;

        state.youtubeStreamStatus =
          null;
      },

      clearLiveResult: (
        state
      ) => {
        state.lastLiveResult =
          null;
      },

      resetSocialState: (
        state
      ) => {
        Object.assign(
          state,
          initialState
        );
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        /* =====================================================
           FETCH CONNECTIONS
        ===================================================== */

        .addCase(
          fetchConnections.pending,
          (
            state
          ) => {
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
                ? action.payload.map(
                    normalizeConnection
                  )
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
              action.payload ||
              "Unable to load social connections.";
          }
        )

        /* =====================================================
           DISCONNECT
        ===================================================== */

        .addCase(
          disconnectSocial.pending,
          (
            state
          ) => {
            state.connectionLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          disconnectSocial.fulfilled,
          (
            state,
            action
          ) => {
            state.connectionLoading =
              false;

            const platform =
              action.payload
                .platform;

            state.connections =
              state.connections.filter(
                (
                  connection
                ) =>
                  normalizePlatform(
                    connection.platform
                  ) !==
                  platform
              );

            state.activePlatforms =
              state.activePlatforms.filter(
                (
                  item
                ) =>
                  item !==
                  platform
              );

            state.liveStatus =
              state.liveStatus.filter(
                (
                  item
                ) =>
                  normalizePlatform(
                    item.platform
                  ) !==
                  platform
              );

            state.successMessage =
              `${platform} disconnected successfully.`;
          }
        )

        .addCase(
          disconnectSocial.rejected,
          (
            state,
            action
          ) => {
            state.connectionLoading =
              false;

            state.error =
              action.payload ||
              "Unable to disconnect platform.";
          }
        )

        /* =====================================================
           INSTAGRAM RTMP
        ===================================================== */

        .addCase(
          saveInstagramRTMP.pending,
          (
            state
          ) => {
            state.rtmpLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          saveInstagramRTMP.fulfilled,
          (
            state,
            action
          ) => {
            state.rtmpLoading =
              false;

            updatePlatformStatus(
              state,
              "instagram",
              {
                instagramRtmpConfigured:
                  true,

                rtmpConfigured:
                  true,

                ...action.payload,
              }
            );

            state.successMessage =
              "Instagram RTMP settings saved successfully.";
          }
        )

        .addCase(
          saveInstagramRTMP.rejected,
          (
            state,
            action
          ) => {
            state.rtmpLoading =
              false;

            state.error =
              action.payload ||
              "Unable to save Instagram RTMP settings.";
          }
        )

        /* =====================================================
           MANUAL RTMP CONNECTION
        ===================================================== */

        .addCase(
          saveRTMPConnection.pending,
          (
            state
          ) => {
            state.rtmpLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          saveRTMPConnection.fulfilled,
          (
            state,
            action
          ) => {
            state.rtmpLoading =
              false;

            const {
              platform,
              connection,
            } =
              action.payload;

            const normalizedConnection =
              {
                ...connection,

                platform,

                connected:
                  true,

                rtmpConfigured:
                  true,

                [`${platform}RtmpConfigured`]:
                  true,
              };

            state.connections =
              upsertConnection(
                state.connections,
                normalizedConnection
              );

            state.successMessage =
              `${platform} connected successfully.`;
          }
        )

        .addCase(
          saveRTMPConnection.rejected,
          (
            state,
            action
          ) => {
            state.rtmpLoading =
              false;

            state.error =
              action.payload ||
              "Unable to save RTMP connection.";
          }
        )

        /* =====================================================
           CREATE YOUTUBE LIVE
        ===================================================== */

        .addCase(
          createYouTubeLive.pending,
          (
            state
          ) => {
            state.youtubeLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          createYouTubeLive.fulfilled,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.currentYouTubeLive =
              action.payload;

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeBroadcastId:
                  action.payload
                    ?.broadcastId ||
                  "",

                youtubeStreamId:
                  action.payload
                    ?.streamId ||
                  "",

                youtubeStreamUrl:
                  action.payload
                    ?.rtmpUrl ||
                  "",

                youtubeWatchUrl:
                  action.payload
                    ?.watchUrl ||
                  "",

                youtubeLiveStatus:
                  action.payload
                    ?.liveStatus ||
                  "created",
              }
            );

            state.successMessage =
              "YouTube live stream created successfully.";
          }
        )

        .addCase(
          createYouTubeLive.rejected,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.error =
              action.payload ||
              "Unable to create YouTube live stream.";
          }
        )

        /* =====================================================
           GET CURRENT YOUTUBE LIVE
        ===================================================== */

        .addCase(
          fetchCurrentYouTubeLive.pending,
          (
            state
          ) => {
            state.youtubeLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchCurrentYouTubeLive.fulfilled,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.currentYouTubeLive =
              action.payload;
          }
        )

        .addCase(
          fetchCurrentYouTubeLive.rejected,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.error =
              action.payload ||
              "Unable to load YouTube live details.";
          }
        )

        /* =====================================================
           YOUTUBE STREAM STATUS
        ===================================================== */

        .addCase(
          fetchYouTubeStreamStatus.pending,
          (
            state
          ) => {
            state.statusLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchYouTubeStreamStatus.fulfilled,
          (
            state,
            action
          ) => {
            state.statusLoading =
              false;

            state.youtubeStreamStatus =
              action.payload;

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeLiveStatus:
                  action.payload
                    ?.liveStatus ||
                  action.payload
                    ?.lifecycleStatus ||
                  "idle",
              }
            );
          }
        )

        .addCase(
          fetchYouTubeStreamStatus.rejected,
          (
            state,
            action
          ) => {
            state.statusLoading =
              false;

            state.error =
              action.payload ||
              "Unable to check YouTube status.";
          }
        )

        /* =====================================================
           WAIT FOR YOUTUBE STREAM
        ===================================================== */

        .addCase(
          waitForYouTubeStream.pending,
          (
            state
          ) => {
            state.statusLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          waitForYouTubeStream.fulfilled,
          (
            state,
            action
          ) => {
            state.statusLoading =
              false;

            state.youtubeStreamStatus =
              action.payload;
          }
        )

        .addCase(
          waitForYouTubeStream.rejected,
          (
            state,
            action
          ) => {
            state.statusLoading =
              false;

            state.error =
              action.payload ||
              "YouTube did not receive the stream.";
          }
        )

        /* =====================================================
           START YOUTUBE BROADCAST
        ===================================================== */

        .addCase(
          startYouTubeBroadcast.pending,
          (
            state
          ) => {
            state.youtubeLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          startYouTubeBroadcast.fulfilled,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.currentYouTubeLive =
              {
                ...state
                  .currentYouTubeLive,

                ...action.payload,

                liveStatus:
                  "live",
              };

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeLiveStatus:
                  "live",

                liveStatus:
                  "live",
              }
            );

            state.successMessage =
              "YouTube broadcast started successfully.";
          }
        )

        .addCase(
          startYouTubeBroadcast.rejected,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.error =
              action.payload ||
              "Unable to start YouTube broadcast.";
          }
        )

        /* =====================================================
           END YOUTUBE BROADCAST
        ===================================================== */

        .addCase(
          endYouTubeBroadcast.pending,
          (
            state
          ) => {
            state.youtubeLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          endYouTubeBroadcast.fulfilled,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.currentYouTubeLive =
              {
                ...state
                  .currentYouTubeLive,

                ...action.payload,

                liveStatus:
                  "complete",
              };

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeLiveStatus:
                  "complete",

                liveStatus:
                  "complete",
              }
            );

            state.activePlatforms =
              state.activePlatforms.filter(
                (
                  platform
                ) =>
                  platform !==
                  "youtube"
              );

            state.successMessage =
              "YouTube broadcast ended successfully.";
          }
        )

        .addCase(
          endYouTubeBroadcast.rejected,
          (
            state,
            action
          ) => {
            state.youtubeLoading =
              false;

            state.error =
              action.payload ||
              "Unable to end YouTube broadcast.";
          }
        )

        /* =====================================================
           START UNIFIED LIVE
        ===================================================== */

        .addCase(
          startLive.pending,
          (
            state
          ) => {
            state.liveLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;

            state.lastLiveResult =
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

            state.lastLiveResult =
              action.payload;

            const started =
              Array.isArray(
                action.payload
                  ?.started
              )
                ? action.payload
                    .started
                : [];

            const failed =
              Array.isArray(
                action.payload
                  ?.failed
              )
                ? action.payload
                    .failed
                : [];

            const startedPlatforms =
              started
                .map(
                  (
                    item
                  ) =>
                    normalizePlatform(
                      item.platform
                    )
                )
                .filter(Boolean);

            state.activePlatforms =
              [
                ...new Set([
                  ...state
                    .activePlatforms,
                  ...startedPlatforms,
                ]),
              ];

            startedPlatforms.forEach(
              (
                platform
              ) => {
                updatePlatformStatus(
                  state,
                  platform,
                  {
                    liveStatus:
                      "streaming",

                    [`${platform}LiveStatus`]:
                      "streaming",
                  }
                );
              }
            );

            state.successMessage =
              failed.length
                ? "Live stream started on some platforms."
                : "Live stream started successfully.";
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
              action.payload ||
              "Unable to start live stream.";
          }
        )

        /* =====================================================
           STOP ONE PLATFORM
        ===================================================== */

        .addCase(
          stopPlatformLive.pending,
          (
            state
          ) => {
            state.liveLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          stopPlatformLive.fulfilled,
          (
            state,
            action
          ) => {
            state.liveLoading =
              false;

            const platform =
              action.payload
                .platform;

            state.activePlatforms =
              state.activePlatforms.filter(
                (
                  item
                ) =>
                  item !==
                  platform
              );

            updatePlatformStatus(
              state,
              platform,
              {
                liveStatus:
                  "complete",

                [`${platform}LiveStatus`]:
                  "complete",
              }
            );

            state.successMessage =
              `${platform} stream stopped successfully.`;
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
              action.payload ||
              "Unable to stop platform stream.";
          }
        )

        /* =====================================================
           STOP ALL
        ===================================================== */

        .addCase(
          stopAllLive.pending,
          (
            state
          ) => {
            state.liveLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          stopAllLive.fulfilled,
          (
            state,
            action
          ) => {
            state.liveLoading =
              false;

            state.lastLiveResult =
              action.payload;

            state.activePlatforms =
              [];

            state.connections =
              state.connections.map(
                (
                  connection
                ) => {
                  const platform =
                    normalizePlatform(
                      connection.platform
                    );

                  return {
                    ...connection,

                    liveStatus:
                      "complete",

                    [`${platform}LiveStatus`]:
                      "complete",
                  };
                }
              );

            state.successMessage =
              "All active live streams were stopped.";
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
              action.payload ||
              "Unable to stop active live streams.";
          }
        )

        /* =====================================================
           LIVE STATUS
        ===================================================== */

        .addCase(
          fetchLiveStatus.pending,
          (
            state
          ) => {
            state.statusLoading =
              true;

            state.error =
              null;
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
                  (
                    item
                  ) =>
                    item.processActive
                )
                .map(
                  (
                    item
                  ) =>
                    normalizePlatform(
                      item.platform
                    )
                );

            state.liveStatus.forEach(
              (
                item
              ) => {
                const platform =
                  normalizePlatform(
                    item.platform
                  );

                updatePlatformStatus(
                  state,
                  platform,
                  {
                    liveStatus:
                      item.databaseStatus ||
                      "idle",

                    [`${platform}LiveStatus`]:
                      item.databaseStatus ||
                      "idle",

                    processActive:
                      Boolean(
                        item.processActive
                      ),

                    processId:
                      item.pid ||
                      null,

                    lastLiveStartedAt:
                      item.lastLiveStartedAt ||
                      null,

                    lastLiveStoppedAt:
                      item.lastLiveStoppedAt ||
                      null,
                  }
                );
              }
            );
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
              action.payload ||
              "Unable to load live status.";
          }
        );
    },
  });

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearSocialError,
  clearSocialSuccess,
  clearCurrentYouTubeLive,
  clearLiveResult,
  resetSocialState,
} =
  socialSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectSocialState = (
  state
) =>
  state.social;

export const selectConnections = (
  state
) =>
  state.social
    ?.connections ||
  [];

export const selectConnectedPlatforms = (
  state
) => {
  const connections =
    selectConnections(
      state
    );

  return connections
    .filter(
      (
        connection
      ) =>
        connection.connected !==
        false
    )
    .map(
      (
        connection
      ) =>
        normalizePlatform(
          connection.platform
        )
    )
    .filter(Boolean);
};

export const selectConnectionByPlatform =
  (
    platform
  ) =>
  (
    state
  ) => {
    const normalizedPlatform =
      normalizePlatform(
        platform
      );

    return (
      selectConnections(
        state
      ).find(
        (
          connection
        ) =>
          normalizePlatform(
            connection.platform
          ) ===
          normalizedPlatform
      ) ||
      null
    );
  };

export const selectActivePlatforms = (
  state
) =>
  state.social
    ?.activePlatforms ||
  [];

export const selectLiveStatus = (
  state
) =>
  state.social
    ?.liveStatus ||
  [];

export const selectCurrentYouTubeLive = (
  state
) =>
  state.social
    ?.currentYouTubeLive ||
  null;

export const selectSocialLoading = (
  state
) =>
  Boolean(
    state.social
      ?.loading ||
    state.social
      ?.connectionLoading ||
    state.social
      ?.rtmpLoading ||
    state.social
      ?.youtubeLoading ||
    state.social
      ?.liveLoading
  );

/* =========================================================
   REDUCER
========================================================= */

export default socialSlice.reducer;