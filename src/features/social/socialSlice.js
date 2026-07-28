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
  waitForYouTubeStreamAPI,

  startLiveAPI,
  addPlatformToSessionAPI,
  stopPlatformLiveAPI,
  stopLiveSessionAPI,
  stopAllLiveAPI,
  restartPlatformLiveAPI,

  getLiveStatusAPI,
  getLiveSessionStatusAPI,
  getLiveSessionsAPI,
  getPlatformHealthAPI,
  getUserStreamHealthAPI,
  resetStaleLiveStatusesAPI,
  waitForLiveSessionAPI,

  normalizePlatform,
  normalizePlatforms,
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
    error?.response?.data
      ?.error ||
    error?.message ||
    fallback
  );
};

const extractPayloadData = (
  response
) => {
  return (
    response?.data?.data ??
    response?.data ??
    response ??
    null
  );
};

const normalizeConnection = (
  connection
) => {
  if (!connection) {
    return connection;
  }

  const platform =
    normalizePlatform(
      connection.platform
    );

  return {
    ...connection,

    platform,

    connected:
      connection.connected !==
      false,

    rtmpConfigured:
      Boolean(
        connection.rtmpConfigured ||
        connection[
          `${platform}RtmpConfigured`
        ] ||
        connection.streamKeyConfigured
      ),

    liveStatus:
      connection.liveStatus ||
      connection[
        `${platform}LiveStatus`
      ] ||
      "idle",

    processActive:
      Boolean(
        connection.processActive
      ),
  };
};

const normalizeLiveStatusItem = (
  item
) => {
  if (!item) {
    return item;
  }

  const platform =
    normalizePlatform(
      item.platform
    );

  return {
    ...item,

    platform,

    databaseStatus:
      item.databaseStatus ||
      item.liveStatus ||
      "idle",

    runtimeStatus:
      item.runtimeStatus ||
      (
        item.processActive
          ? "streaming"
          : "stopped"
      ),

    processActive:
      Boolean(
        item.processActive
      ),

    sessionId:
      item.sessionId ||
      null,

    pid:
      item.pid ||
      item.processId ||
      null,
  };
};

const normalizeSession = (
  session
) => {
  if (!session) {
    return session;
  }

  const processes =
    Array.isArray(
      session.processes
    )
      ? session.processes
          .map(
            normalizeLiveStatusItem
          )
          .filter(Boolean)
      : Array.isArray(
          session.platforms
        )
      ? session.platforms
          .map(
            normalizeLiveStatusItem
          )
          .filter(Boolean)
      : Array.isArray(
          session.streams
        )
      ? session.streams
          .map(
            normalizeLiveStatusItem
          )
          .filter(Boolean)
      : [];

  return {
    ...session,

    sessionId:
      session.sessionId ||
      session.id ||
      null,

    processes,

    total:
      Number(
        session.total ??
        processes.length
      ),

    activeCount:
      Number(
        session.activeCount ??
        processes.filter(
          (item) =>
            item.processActive ||
            item.runtimeStatus ===
              "streaming"
        ).length
      ),

    streaming:
      Boolean(
        session.streaming ||
        processes.some(
          (item) =>
            item.processActive ||
            item.runtimeStatus ===
              "streaming"
        )
      ),
  };
};

const normalizeHealthResult = (
  health
) => {
  if (!health) {
    return health;
  }

  if (
    Array.isArray(health)
  ) {
    return health.map(
      (item) => ({
        ...item,

        platform:
          normalizePlatform(
            item.platform
          ),
      })
    );
  }

  return {
    ...health,

    platform:
      health.platform
        ? normalizePlatform(
            health.platform
          )
        : undefined,
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
      (connection) =>
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

  const updated = [
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
      (connection) =>
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

const upsertLiveStatus = (
  liveStatus,
  incomingItem
) => {
  const normalizedIncoming =
    normalizeLiveStatusItem(
      incomingItem
    );

  if (
    !normalizedIncoming
      ?.platform
  ) {
    return liveStatus;
  }

  const existingIndex =
    liveStatus.findIndex(
      (item) =>
        normalizePlatform(
          item.platform
        ) ===
        normalizedIncoming.platform
    );

  if (
    existingIndex === -1
  ) {
    return [
      ...liveStatus,
      normalizedIncoming,
    ];
  }

  const updated = [
    ...liveStatus,
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

const upsertSession = (
  sessions,
  incomingSession
) => {
  const normalizedIncoming =
    normalizeSession(
      incomingSession
    );

  if (
    !normalizedIncoming
      ?.sessionId
  ) {
    return sessions;
  }

  const existingIndex =
    sessions.findIndex(
      (session) =>
        String(
          session.sessionId ||
          session.id ||
          ""
        ) ===
        String(
          normalizedIncoming
            .sessionId
        )
    );

  if (
    existingIndex === -1
  ) {
    return [
      normalizedIncoming,
      ...sessions,
    ];
  }

  const updated = [
    ...sessions,
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

const getStartedItems = (
  payload
) => {
  if (
    Array.isArray(
      payload?.started
    )
  ) {
    return payload.started;
  }

  if (
    Array.isArray(
      payload?.results
    )
  ) {
    return payload.results.filter(
      (item) =>
        item.success !== false &&
        item.started !== false
    );
  }

  return [];
};

const getFailedItems = (
  payload
) => {
  if (
    Array.isArray(
      payload?.failed
    )
  ) {
    return payload.failed;
  }

  if (
    Array.isArray(
      payload?.results
    )
  ) {
    return payload.results.filter(
      (item) =>
        item.success === false ||
        item.failed === true
    );
  }

  return [];
};

const getStartedPlatforms = (
  payload
) => {
  const started =
    getStartedItems(
      payload
    );

  if (
    started.length
  ) {
    return [
      ...new Set(
        started
          .map(
            (item) =>
              normalizePlatform(
                typeof item ===
                  "string"
                  ? item
                  : item.platform
              )
          )
          .filter(Boolean)
      ),
    ];
  }

  if (
    Array.isArray(
      payload?.platforms
    )
  ) {
    return normalizePlatforms(
      payload.platforms
    );
  }

  return [];
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

  sessionLoading:
    false,

  statusLoading:
    false,

  healthLoading:
    false,

  restartLoading:
    false,

  resetLoading:
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

  currentSessionId:
    null,

  currentSession:
    null,

  sessions:
    [],

  sessionStatusById:
    {},

  platformHealth:
    {},

  userStreamHealth:
    null,

  lastStoppedPlatform:
    null,

  lastRestartedPlatform:
    null,

  staleStatusResult:
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
        const response =
          await getConnectionsAPI();

        return Array.isArray(
          response
        )
          ? response.map(
              normalizeConnection
            )
          : [];
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

          response:
            extractPayloadData(
              response
            ),
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
          extractPayloadData(
            response
          ) || {
            platform:
              "instagram",

            connected:
              true,

            rtmpConfigured:
              true,
          }
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

        const connection =
          extractPayloadData(
            response
          );

        return {
          platform:
            normalizedPlatform,

          connection:
            connection || {
              platform:
                normalizedPlatform,

              connected:
                true,

              rtmpConfigured:
                true,
            },
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

        return extractPayloadData(
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

        return extractPayloadData(
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

        return extractPayloadData(
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

        return extractPayloadData(
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

        return extractPayloadData(
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

        return extractPayloadData(
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

        return extractPayloadData(
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
   ADD PLATFORM TO SESSION
========================================================= */

export const addPlatformToSession =
  createAsyncThunk(
    "social/addPlatformToSession",

    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const normalizedPlatform =
          normalizePlatform(
            payload?.platform
          );

        const response =
          await addPlatformToSessionAPI({
            ...payload,

            platform:
              normalizedPlatform,
          });

        return {
          platform:
            normalizedPlatform,

          sessionId:
            payload?.sessionId ||
            response?.data
              ?.sessionId ||
            response?.sessionId ||
            null,

          data:
            extractPayloadData(
              response
            ),
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to add platform to the live session."
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
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const isObject =
          payload &&
          typeof payload ===
            "object";

        const platform =
          isObject
            ? payload.platform
            : payload;

        const sessionId =
          isObject
            ? payload.sessionId ||
              ""
            : "";

        const normalizedPlatform =
          normalizePlatform(
            platform
          );

        const response =
          await stopPlatformLiveAPI(
            normalizedPlatform,
            sessionId
          );

        return {
          platform:
            normalizedPlatform,

          sessionId:
            sessionId ||
            null,

          data:
            extractPayloadData(
              response
            ),
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
   STOP LIVE SESSION
========================================================= */

export const stopLiveSession =
  createAsyncThunk(
    "social/stopLiveSession",

    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const isObject =
          payload &&
          typeof payload ===
            "object";

        const sessionId =
          isObject
            ? payload.sessionId
            : payload;

        const temporaryFilePath =
          isObject
            ? payload
                .temporaryFilePath ||
              ""
            : "";

        const response =
          await stopLiveSessionAPI(
            sessionId,
            {
              temporaryFilePath,
            }
          );

        return {
          sessionId,

          data:
            extractPayloadData(
              response
            ),
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to stop live session."
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
      temporaryFilePaths = [],
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await stopAllLiveAPI(
            temporaryFilePaths
          );

        return extractPayloadData(
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
   RESTART PLATFORM STREAM
========================================================= */

export const restartPlatformLive =
  createAsyncThunk(
    "social/restartPlatformLive",

    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const normalizedPlatform =
          normalizePlatform(
            payload?.platform
          );

        const response =
          await restartPlatformLiveAPI({
            ...payload,

            platform:
              normalizedPlatform,
          });

        return {
          platform:
            normalizedPlatform,

          sessionId:
            payload?.sessionId ||
            response?.data
              ?.sessionId ||
            response?.sessionId ||
            null,

          data:
            extractPayloadData(
              response
            ),
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to restart platform stream."
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
        const response =
          await getLiveStatusAPI();

        return Array.isArray(
          response
        )
          ? response.map(
              normalizeLiveStatusItem
            )
          : [];
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
   FETCH LIVE SESSION STATUS
========================================================= */

export const fetchLiveSessionStatus =
  createAsyncThunk(
    "social/fetchLiveSessionStatus",

    async (
      sessionId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await getLiveSessionStatusAPI(
            sessionId
          );

        return normalizeSession({
          ...response,

          sessionId:
            response?.sessionId ||
            sessionId,
        });
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load live session status."
          )
        );
      }
    }
  );

/* =========================================================
   FETCH USER LIVE SESSIONS
========================================================= */

export const fetchLiveSessions =
  createAsyncThunk(
    "social/fetchLiveSessions",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await getLiveSessionsAPI();

        return Array.isArray(
          response
        )
          ? response
              .map(
                normalizeSession
              )
              .filter(Boolean)
          : [];
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load live sessions."
          )
        );
      }
    }
  );

/* =========================================================
   WAIT FOR LIVE SESSION
========================================================= */

export const waitForLiveSession =
  createAsyncThunk(
    "social/waitForLiveSession",

    async (
      options,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await waitForLiveSessionAPI(
            options
          );

        return normalizeSession({
          ...response,

          sessionId:
            response?.sessionId ||
            options?.sessionId ||
            null,
        });
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "The live session did not become active."
          )
        );
      }
    }
  );

/* =========================================================
   FETCH PLATFORM HEALTH
========================================================= */

export const fetchPlatformHealth =
  createAsyncThunk(
    "social/fetchPlatformHealth",

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
          await getPlatformHealthAPI(
            normalizedPlatform
          );

        return {
          platform:
            normalizedPlatform,

          health:
            normalizeHealthResult(
              response
            ),
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load platform stream health."
          )
        );
      }
    }
  );

/* =========================================================
   FETCH USER STREAM HEALTH
========================================================= */

export const fetchUserStreamHealth =
  createAsyncThunk(
    "social/fetchUserStreamHealth",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await getUserStreamHealthAPI();

        return normalizeHealthResult(
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load stream health."
          )
        );
      }
    }
  );

/* =========================================================
   RESET STALE LIVE STATUSES
========================================================= */

export const resetStaleLiveStatuses =
  createAsyncThunk(
    "social/resetStaleLiveStatuses",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await resetStaleLiveStatusesAPI();

        return extractPayloadData(
          response
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to reset stale live statuses."
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
      /* =====================================================
         CLEAR ERROR
      ===================================================== */

      clearSocialError: (
        state
      ) => {
        state.error =
          null;
      },

      /* =====================================================
         CLEAR SUCCESS MESSAGE
      ===================================================== */

      clearSocialSuccess: (
        state
      ) => {
        state.successMessage =
          null;
      },

      /* =====================================================
         CLEAR YOUTUBE LIVE
      ===================================================== */

      clearCurrentYouTubeLive: (
        state
      ) => {
        state.currentYouTubeLive =
          null;

        state.youtubeStreamStatus =
          null;
      },

      /* =====================================================
         CLEAR LIVE RESULT
      ===================================================== */

      clearLiveResult: (
        state
      ) => {
        state.lastLiveResult =
          null;
      },

      /* =====================================================
         CLEAR CURRENT SESSION
      ===================================================== */

      clearCurrentSession: (
        state
      ) => {
        state.currentSessionId =
          null;

        state.currentSession =
          null;
      },

      /* =====================================================
         SET CURRENT SESSION
      ===================================================== */

      setCurrentSession: (
        state,
        action
      ) => {
        const payload =
          action.payload;

        if (!payload) {
          state.currentSessionId =
            null;

          state.currentSession =
            null;

          return;
        }

        if (
          typeof payload ===
          "string"
        ) {
          state.currentSessionId =
            payload;

          state.currentSession =
            state.sessions.find(
              (session) =>
                String(
                  session.sessionId ||
                  session.id ||
                  ""
                ) ===
                String(payload)
            ) ||
            state
              .sessionStatusById[
                payload
              ] ||
            null;

          return;
        }

        const session =
          normalizeSession(
            payload
          );

        state.currentSession =
          session;

        state.currentSessionId =
          session?.sessionId ||
          null;

        if (
          session?.sessionId
        ) {
          state.sessions =
            upsertSession(
              state.sessions,
              session
            );

          state
            .sessionStatusById[
              session.sessionId
            ] =
            session;
        }
      },

      /* =====================================================
         REMOVE SESSION
      ===================================================== */

      removeSession: (
        state,
        action
      ) => {
        const sessionId =
          String(
            action.payload ||
            ""
          );

        state.sessions =
          state.sessions.filter(
            (session) =>
              String(
                session.sessionId ||
                session.id ||
                ""
              ) !==
              sessionId
          );

        delete state
          .sessionStatusById[
            sessionId
          ];

        if (
          String(
            state.currentSessionId ||
            ""
          ) ===
          sessionId
        ) {
          state.currentSessionId =
            null;

          state.currentSession =
            null;
        }
      },

      /* =====================================================
         SET ACTIVE PLATFORMS
      ===================================================== */

      setActivePlatforms: (
        state,
        action
      ) => {
        state.activePlatforms =
          normalizePlatforms(
            action.payload ||
            []
          );
      },

      /* =====================================================
         ADD ACTIVE PLATFORM
      ===================================================== */

      addActivePlatform: (
        state,
        action
      ) => {
        const platform =
          normalizePlatform(
            action.payload
          );

        if (!platform) {
          return;
        }

        state.activePlatforms = [
          ...new Set([
            ...state
              .activePlatforms,

            platform,
          ]),
        ];

        updatePlatformStatus(
          state,
          platform,
          {
            liveStatus:
              "streaming",

            [`${platform}LiveStatus`]:
              "streaming",

            processActive:
              true,
          }
        );

        state.liveStatus =
          upsertLiveStatus(
            state.liveStatus,
            {
              platform,

              databaseStatus:
                "streaming",

              runtimeStatus:
                "streaming",

              processActive:
                true,
            }
          );
      },

      /* =====================================================
         REMOVE ACTIVE PLATFORM
      ===================================================== */

      removeActivePlatform: (
        state,
        action
      ) => {
        const platform =
          normalizePlatform(
            action.payload
          );

        state.activePlatforms =
          state.activePlatforms.filter(
            (item) =>
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

            processActive:
              false,

            processId:
              null,

            pid:
              null,
          }
        );

        state.liveStatus =
          upsertLiveStatus(
            state.liveStatus,
            {
              platform,

              databaseStatus:
                "complete",

              runtimeStatus:
                "stopped",

              processActive:
                false,

              pid:
                null,
            }
          );
      },

      /* =====================================================
         UPDATE LOCAL PLATFORM STATUS
      ===================================================== */

      updateLocalPlatformStatus: (
        state,
        action
      ) => {
        const {
          platform,
          ...updates
        } =
          action.payload ||
          {};

        const normalizedPlatform =
          normalizePlatform(
            platform
          );

        if (
          !normalizedPlatform
        ) {
          return;
        }

        updatePlatformStatus(
          state,
          normalizedPlatform,
          updates
        );

        state.liveStatus =
          upsertLiveStatus(
            state.liveStatus,
            {
              platform:
                normalizedPlatform,

              ...updates,
            }
          );

        const isActive =
          updates.processActive ===
            true ||
          updates.runtimeStatus ===
            "streaming" ||
          updates.liveStatus ===
            "streaming" ||
          updates.databaseStatus ===
            "streaming";

        const isStopped =
          updates.processActive ===
            false ||
          [
            "idle",
            "complete",
            "completed",
            "stopped",
            "failed",
          ].includes(
            String(
              updates.runtimeStatus ||
              updates.liveStatus ||
              updates.databaseStatus ||
              ""
            ).toLowerCase()
          );

        if (isActive) {
          state.activePlatforms = [
            ...new Set([
              ...state
                .activePlatforms,

              normalizedPlatform,
            ]),
          ];
        }

        if (isStopped) {
          state.activePlatforms =
            state.activePlatforms.filter(
              (item) =>
                item !==
                normalizedPlatform
            );
        }
      },

      /* =====================================================
         SET LIVE STATUS
      ===================================================== */

      setLiveStatus: (
        state,
        action
      ) => {
        const status =
          Array.isArray(
            action.payload
          )
            ? action.payload
                .map(
                  normalizeLiveStatusItem
                )
                .filter(Boolean)
            : [];

        state.liveStatus =
          status;

        state.activePlatforms =
          status
            .filter(
              (item) =>
                item.processActive ||
                item.runtimeStatus ===
                  "streaming"
            )
            .map(
              (item) =>
                normalizePlatform(
                  item.platform
                )
            )
            .filter(Boolean);
      },

      /* =====================================================
         UPSERT SESSION STATUS
      ===================================================== */

      upsertLocalSession: (
        state,
        action
      ) => {
        const session =
          normalizeSession(
            action.payload
          );

        if (
          !session?.sessionId
        ) {
          return;
        }

        state.sessions =
          upsertSession(
            state.sessions,
            session
          );

        state
          .sessionStatusById[
            session.sessionId
          ] =
          session;

        if (
          String(
            state.currentSessionId ||
            ""
          ) ===
          String(
            session.sessionId
          )
        ) {
          state.currentSession =
            session;
        }
      },

      /* =====================================================
         CLEAR SESSION STATUS CACHE
      ===================================================== */

      clearSessionStatuses: (
        state
      ) => {
        state.sessionStatusById =
          {};
      },

      /* =====================================================
         CLEAR PLATFORM HEALTH
      ===================================================== */

      clearPlatformHealth: (
        state,
        action
      ) => {
        const platform =
          action.payload
            ? normalizePlatform(
                action.payload
              )
            : "";

        if (platform) {
          delete state
            .platformHealth[
              platform
            ];

          return;
        }

        state.platformHealth =
          {};
      },

      /* =====================================================
         CLEAR USER STREAM HEALTH
      ===================================================== */

      clearUserStreamHealth: (
        state
      ) => {
        state.userStreamHealth =
          null;
      },

      /* =====================================================
         CLEAR LAST STOPPED PLATFORM
      ===================================================== */

      clearLastStoppedPlatform: (
        state
      ) => {
        state.lastStoppedPlatform =
          null;
      },

      /* =====================================================
         CLEAR LAST RESTARTED PLATFORM
      ===================================================== */

      clearLastRestartedPlatform: (
        state
      ) => {
        state.lastRestartedPlatform =
          null;
      },

      /* =====================================================
         RESET LIVE STATE ONLY
      ===================================================== */

      resetLiveState: (
        state
      ) => {
        state.liveLoading =
          false;

        state.sessionLoading =
          false;

        state.statusLoading =
          false;

        state.healthLoading =
          false;

        state.restartLoading =
          false;

        state.liveStatus =
          [];

        state.activePlatforms =
          [];

        state.lastLiveResult =
          null;

        state.currentSessionId =
          null;

        state.currentSession =
          null;

        state.sessions =
          [];

        state.sessionStatusById =
          {};

        state.platformHealth =
          {};

        state.userStreamHealth =
          null;

        state.lastStoppedPlatform =
          null;

        state.lastRestartedPlatform =
          null;

        state.staleStatusResult =
          null;

        state.error =
          null;

        state.successMessage =
          null;
      },

      /* =====================================================
         RESET FULL SOCIAL STATE
      ===================================================== */

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
                ? action.payload
                    .map(
                      normalizeConnection
                    )
                    .filter(Boolean)
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
           DISCONNECT SOCIAL PLATFORM
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
              normalizePlatform(
                action.payload
                  ?.platform
              );

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

            delete state
              .platformHealth[
                platform
              ];

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
           SAVE INSTAGRAM RTMP
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

            const connection =
              normalizeConnection({
                ...action.payload,

                platform:
                  "instagram",

                connected:
                  true,

                instagramRtmpConfigured:
                  true,

                rtmpConfigured:
                  true,
              });

            state.connections =
              upsertConnection(
                state.connections,
                connection
              );

            updatePlatformStatus(
              state,
              "instagram",
              {
                connected:
                  true,

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
           SAVE MANUAL RTMP CONNECTION
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
              action.payload ||
              {};

            const normalizedPlatform =
              normalizePlatform(
                platform
              );

            const normalizedConnection =
              normalizeConnection({
                ...connection,

                platform:
                  normalizedPlatform,

                connected:
                  true,

                rtmpConfigured:
                  true,

                [`${normalizedPlatform}RtmpConfigured`]:
                  true,
              });

            state.connections =
              upsertConnection(
                state.connections,
                normalizedConnection
              );

            state.successMessage =
              `${normalizedPlatform} connected successfully.`;
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

            const youtubeConnection =
              normalizeConnection({
                platform:
                  "youtube",

                connected:
                  true,

                ...state.connections.find(
                  (
                    item
                  ) =>
                    normalizePlatform(
                      item.platform
                    ) ===
                    "youtube"
                ),

                youtubeBroadcastId:
                  action.payload
                    ?.broadcastId ||
                  action.payload
                    ?.youtubeBroadcastId ||
                  "",

                youtubeStreamId:
                  action.payload
                    ?.streamId ||
                  action.payload
                    ?.youtubeStreamId ||
                  "",

                youtubeStreamUrl:
                  action.payload
                    ?.rtmpUrl ||
                  action.payload
                    ?.streamUrl ||
                  "",

                youtubeWatchUrl:
                  action.payload
                    ?.watchUrl ||
                  "",

                youtubeLiveStatus:
                  action.payload
                    ?.liveStatus ||
                  action.payload
                    ?.lifecycleStatus ||
                  "created",

                liveStatus:
                  action.payload
                    ?.liveStatus ||
                  "created",
              });

            state.connections =
              upsertConnection(
                state.connections,
                youtubeConnection
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
           FETCH CURRENT YOUTUBE LIVE
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
           FETCH YOUTUBE STREAM STATUS
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

            const status =
              action.payload
                ?.liveStatus ||
              action.payload
                ?.lifecycleStatus ||
              action.payload
                ?.ingestionStatus ||
              action.payload
                ?.streamStatus ||
              "idle";

            const normalizedStatus =
              String(status)
                .trim()
                .toLowerCase();

            const processActive =
              [
                "active",
                "ready",
                "live",
                "streaming",
                "testing",
              ].includes(
                normalizedStatus
              );

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeLiveStatus:
                  status,

                liveStatus:
                  processActive
                    ? "streaming"
                    : status,

                processActive,
              }
            );

            state.liveStatus =
              upsertLiveStatus(
                state.liveStatus,
                {
                  platform:
                    "youtube",

                  databaseStatus:
                    processActive
                      ? "streaming"
                      : status,

                  runtimeStatus:
                    processActive
                      ? "streaming"
                      : normalizedStatus,

                  processActive,
                }
              );

            if (
              processActive
            ) {
              state.activePlatforms = [
                ...new Set([
                  ...state
                    .activePlatforms,

                  "youtube",
                ]),
              ];
            }
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

            state.activePlatforms = [
              ...new Set([
                ...state
                  .activePlatforms,

                "youtube",
              ]),
            ];

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeLiveStatus:
                  "active",

                liveStatus:
                  "streaming",

                processActive:
                  true,
              }
            );

            state.liveStatus =
              upsertLiveStatus(
                state.liveStatus,
                {
                  platform:
                    "youtube",

                  databaseStatus:
                    "streaming",

                  runtimeStatus:
                    "streaming",

                  processActive:
                    true,
                }
              );
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

            state.successMessage =
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

            state.currentYouTubeLive = {
              ...state
                .currentYouTubeLive,

              ...action.payload,

              liveStatus:
                "live",
            };

            state.activePlatforms = [
              ...new Set([
                ...state
                  .activePlatforms,

                "youtube",
              ]),
            ];

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeLiveStatus:
                  "live",

                liveStatus:
                  "streaming",

                processActive:
                  true,
              }
            );

            state.liveStatus =
              upsertLiveStatus(
                state.liveStatus,
                {
                  platform:
                    "youtube",

                  databaseStatus:
                    "streaming",

                  runtimeStatus:
                    "streaming",

                  processActive:
                    true,
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

            state.successMessage =
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

            state.currentYouTubeLive = {
              ...state
                .currentYouTubeLive,

              ...action.payload,

              liveStatus:
                "complete",
            };

            state.activePlatforms =
              state.activePlatforms.filter(
                (
                  platform
                ) =>
                  platform !==
                  "youtube"
              );

            updatePlatformStatus(
              state,
              "youtube",
              {
                youtubeLiveStatus:
                  "complete",

                liveStatus:
                  "complete",

                processActive:
                  false,

                processId:
                  null,

                pid:
                  null,
              }
            );

            state.liveStatus =
              upsertLiveStatus(
                state.liveStatus,
                {
                  platform:
                    "youtube",

                  databaseStatus:
                    "complete",

                  runtimeStatus:
                    "stopped",

                  processActive:
                    false,

                  pid:
                    null,
                }
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

            const startedItems =
              getStartedItems(
                action.payload
              );

            const failedItems =
              getFailedItems(
                action.payload
              );

            const startedPlatforms =
              getStartedPlatforms(
                action.payload
              );

            const sessionId =
              action.payload
                ?.sessionId ||
              action.payload
                ?.session
                ?.sessionId ||
              action.payload
                ?.session
                ?.id ||
              null;

            if (sessionId) {
              state.currentSessionId =
                sessionId;
            }

            startedPlatforms.forEach(
              (
                platform
              ) => {
                state.activePlatforms = [
                  ...new Set([
                    ...state
                      .activePlatforms,

                    platform,
                  ]),
                ];

                updatePlatformStatus(
                  state,
                  platform,
                  {
                    liveStatus:
                      "streaming",

                    [`${platform}LiveStatus`]:
                      "streaming",

                    processActive:
                      true,

                    sessionId:
                      sessionId ||
                      undefined,
                  }
                );

                const startedItem =
                  startedItems.find(
                    (
                      item
                    ) =>
                      normalizePlatform(
                        typeof item ===
                          "string"
                          ? item
                          : item.platform
                      ) ===
                      platform
                  );

                state.liveStatus =
                  upsertLiveStatus(
                    state.liveStatus,
                    {
                      ...(typeof startedItem ===
                      "object"
                        ? startedItem
                        : {}),

                      platform,

                      sessionId:
                        sessionId ||
                        startedItem
                          ?.sessionId ||
                        null,

                      databaseStatus:
                        "streaming",

                      runtimeStatus:
                        "streaming",

                      processActive:
                        true,

                      pid:
                        startedItem
                          ?.pid ||
                        startedItem
                          ?.processId ||
                        null,
                    }
                  );
              }
            );

            if (
              action.payload
                ?.session
            ) {
              const session =
                normalizeSession({
                  ...action.payload
                    .session,

                  sessionId:
                    sessionId ||
                    action.payload
                      .session
                      ?.sessionId,
                });

              if (
                session?.sessionId
              ) {
                state.currentSession =
                  session;

                state.sessions =
                  upsertSession(
                    state.sessions,
                    session
                  );

                state
                  .sessionStatusById[
                    session.sessionId
                  ] =
                  session;
              }
            } else if (
              sessionId
            ) {
              const session =
                normalizeSession({
                  sessionId,

                  processes:
                    startedItems,

                  streaming:
                    startedPlatforms
                      .length > 0,

                  activeCount:
                    startedPlatforms
                      .length,

                  total:
                    startedPlatforms
                      .length +
                    failedItems.length,
                });

              state.currentSession =
                session;

              state.sessions =
                upsertSession(
                  state.sessions,
                  session
                );

              state
                .sessionStatusById[
                  sessionId
                ] =
                session;
            }

            const failedCount =
              Array.isArray(
                action.payload
                  ?.failed
              )
                ? action.payload
                    .failed.length
                : Number(
                    action.payload
                      ?.failed ||
                    failedItems.length ||
                    0
                  );

            const startedCount =
              Array.isArray(
                action.payload
                  ?.started
              )
                ? action.payload
                    .started.length
                : Number(
                    action.payload
                      ?.started ||
                    startedPlatforms
                      .length ||
                    0
                  );

            if (
              startedCount > 0 &&
              failedCount > 0
            ) {
              state.successMessage =
                "Live stream started on some platforms, but one or more platforms failed.";
            } else if (
              startedCount > 0
            ) {
              state.successMessage =
                "Live stream started successfully.";
            } else {
              state.successMessage =
                null;
            }
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
           ADD PLATFORM TO SESSION
        ===================================================== */

        .addCase(
          addPlatformToSession.pending,
          (
            state
          ) => {
            state.liveLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          addPlatformToSession.fulfilled,
          (
            state,
            action
          ) => {
            state.liveLoading =
              false;

            const platform =
              normalizePlatform(
                action.payload
                  ?.platform
              );

            const sessionId =
              action.payload
                ?.sessionId ||
              action.payload
                ?.data
                ?.sessionId ||
              state.currentSessionId ||
              null;

            const result =
              action.payload
                ?.data ||
              {};

            state.activePlatforms = [
              ...new Set([
                ...state
                  .activePlatforms,

                platform,
              ]),
            ];

            updatePlatformStatus(
              state,
              platform,
              {
                liveStatus:
                  "streaming",

                [`${platform}LiveStatus`]:
                  "streaming",

                processActive:
                  true,

                sessionId,

                processId:
                  result?.pid ||
                  result
                    ?.processId ||
                  null,
              }
            );

            state.liveStatus =
              upsertLiveStatus(
                state.liveStatus,
                {
                  ...result,

                  platform,

                  sessionId,

                  databaseStatus:
                    "streaming",

                  runtimeStatus:
                    "streaming",

                  processActive:
                    true,

                  pid:
                    result?.pid ||
                    result
                      ?.processId ||
                    null,
                }
              );

            if (sessionId) {
              state.currentSessionId =
                sessionId;

              const existingSession =
                state
                  .sessionStatusById[
                    sessionId
                  ] ||
                state.sessions.find(
                  (
                    item
                  ) =>
                    String(
                      item.sessionId ||
                      item.id ||
                      ""
                    ) ===
                    String(
                      sessionId
                    )
                ) ||
                {
                  sessionId,
                  processes:
                    [],
                };

              const processes =
                Array.isArray(
                  existingSession
                    .processes
                )
                  ? existingSession
                      .processes
                  : [];

              const updatedProcesses =
                upsertLiveStatus(
                  processes,
                  {
                    ...result,

                    platform,

                    sessionId,

                    databaseStatus:
                      "streaming",

                    runtimeStatus:
                      "streaming",

                    processActive:
                      true,
                  }
                );

              const session =
                normalizeSession({
                  ...existingSession,

                  sessionId,

                  processes:
                    updatedProcesses,

                  streaming:
                    true,
                });

              state.sessions =
                upsertSession(
                  state.sessions,
                  session
                );

              state
                .sessionStatusById[
                  sessionId
                ] =
                session;

              state.currentSession =
                session;
            }

            state.successMessage =
              `${platform} added to the live session successfully.`;
          }
        )

        .addCase(
          addPlatformToSession.rejected,
          (
            state,
            action
          ) => {
            state.liveLoading =
              false;

            state.error =
              action.payload ||
              "Unable to add platform to the live session.";
          }
        )

        /* =====================================================
           STOP ONE LIVE PLATFORM
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

            state.successMessage =
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
              normalizePlatform(
                action.payload
                  ?.platform
              );

            const sessionId =
              action.payload
                ?.sessionId ||
              action.payload
                ?.data
                ?.sessionId ||
              null;

            state.lastStoppedPlatform =
              platform;

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

                processActive:
                  false,

                processId:
                  null,

                pid:
                  null,

                lastLiveStoppedAt:
                  new Date()
                    .toISOString(),
              }
            );

            state.liveStatus =
              upsertLiveStatus(
                state.liveStatus,
                {
                  platform,

                  sessionId,

                  databaseStatus:
                    "complete",

                  runtimeStatus:
                    "stopped",

                  processActive:
                    false,

                  pid:
                    null,

                  lastLiveStoppedAt:
                    new Date()
                      .toISOString(),
                }
              );

            if (sessionId) {
              const existingSession =
                state
                  .sessionStatusById[
                    sessionId
                  ];

              if (existingSession) {
                const updatedProcesses =
                  existingSession
                    .processes
                    .map(
                      (
                        process
                      ) =>
                        normalizePlatform(
                          process.platform
                        ) ===
                        platform
                          ? {
                              ...process,

                              databaseStatus:
                                "complete",

                              runtimeStatus:
                                "stopped",

                              processActive:
                                false,

                              pid:
                                null,
                            }
                          : process
                    );

                const session =
                  normalizeSession({
                    ...existingSession,

                    processes:
                      updatedProcesses,
                  });

                state
                  .sessionStatusById[
                    sessionId
                  ] =
                  session;

                state.sessions =
                  upsertSession(
                    state.sessions,
                    session
                  );

                if (
                  String(
                    state.currentSessionId ||
                    ""
                  ) ===
                  String(sessionId)
                ) {
                  state.currentSession =
                    session;
                }
              }
            }

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
           STOP LIVE SESSION
        ===================================================== */

        .addCase(
          stopLiveSession.pending,
          (
            state
          ) => {
            state.sessionLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          stopLiveSession.fulfilled,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            const sessionId =
              action.payload
                ?.sessionId;

            const existingSession =
              state
                .sessionStatusById[
                  sessionId
                ] ||
              state.sessions.find(
                (
                  session
                ) =>
                  String(
                    session.sessionId ||
                    session.id ||
                    ""
                  ) ===
                  String(
                    sessionId
                  )
              );

            const stoppedPlatforms =
              existingSession
                ?.processes
                ?.map(
                  (
                    process
                  ) =>
                    normalizePlatform(
                      process.platform
                    )
                )
                .filter(Boolean) ||
              [];

            state.activePlatforms =
              state.activePlatforms.filter(
                (
                  platform
                ) =>
                  !stoppedPlatforms.includes(
                    platform
                  )
              );

            stoppedPlatforms.forEach(
              (
                platform
              ) => {
                updatePlatformStatus(
                  state,
                  platform,
                  {
                    liveStatus:
                      "complete",

                    [`${platform}LiveStatus`]:
                      "complete",

                    processActive:
                      false,

                    processId:
                      null,

                    pid:
                      null,
                  }
                );

                state.liveStatus =
                  upsertLiveStatus(
                    state.liveStatus,
                    {
                      platform,

                      sessionId,

                      databaseStatus:
                        "complete",

                      runtimeStatus:
                        "stopped",

                      processActive:
                        false,

                      pid:
                        null,
                    }
                  );
              }
            );

            const stoppedSession =
              normalizeSession({
                ...existingSession,

                ...action.payload
                  ?.data,

                sessionId,

                status:
                  "stopped",

                streaming:
                  false,

                processes:
                  existingSession
                    ?.processes
                    ?.map(
                      (
                        process
                      ) => ({
                        ...process,

                        databaseStatus:
                          "complete",

                        runtimeStatus:
                          "stopped",

                        processActive:
                          false,

                        pid:
                          null,
                      })
                    ) ||
                  [],
              });

            if (sessionId) {
              state
                .sessionStatusById[
                  sessionId
                ] =
                stoppedSession;

              state.sessions =
                upsertSession(
                  state.sessions,
                  stoppedSession
                );
            }

            if (
              String(
                state.currentSessionId ||
                ""
              ) ===
              String(
                sessionId
              )
            ) {
              state.currentSession =
                stoppedSession;

              state.currentSessionId =
                null;
            }

            state.lastLiveResult =
              action.payload
                ?.data ||
              action.payload;

            state.successMessage =
              "Live session stopped successfully.";
          }
        )

        .addCase(
          stopLiveSession.rejected,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            state.error =
              action.payload ||
              "Unable to stop live session.";
          }
        )

        /* =====================================================
           STOP ALL LIVE STREAMS
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

            state.successMessage =
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

                    processActive:
                      false,

                    processId:
                      null,

                    pid:
                      null,
                  };
                }
              );

            state.liveStatus =
              state.liveStatus.map(
                (
                  item
                ) => ({
                  ...item,

                  databaseStatus:
                    "complete",

                  runtimeStatus:
                    "stopped",

                  processActive:
                    false,

                  pid:
                    null,
                })
              );

            state.sessions =
              state.sessions.map(
                (
                  session
                ) =>
                  normalizeSession({
                    ...session,

                    status:
                      "stopped",

                    streaming:
                      false,

                    processes:
                      session
                        .processes
                        ?.map(
                          (
                            process
                          ) => ({
                            ...process,

                            databaseStatus:
                              "complete",

                            runtimeStatus:
                              "stopped",

                            processActive:
                              false,

                            pid:
                              null,
                          })
                        ) ||
                      [],
                  })
              );

            state.sessionStatusById =
              state.sessions.reduce(
                (
                  accumulator,
                  session
                ) => {
                  if (
                    session.sessionId
                  ) {
                    accumulator[
                      session.sessionId
                    ] =
                      session;
                  }

                  return accumulator;
                },
                {}
              );

            state.currentSessionId =
              null;

            state.currentSession =
              null;

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
           RESTART PLATFORM STREAM
        ===================================================== */

        .addCase(
          restartPlatformLive.pending,
          (
            state
          ) => {
            state.restartLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          restartPlatformLive.fulfilled,
          (
            state,
            action
          ) => {
            state.restartLoading =
              false;

            const platform =
              normalizePlatform(
                action.payload
                  ?.platform
              );

            const sessionId =
              action.payload
                ?.sessionId ||
              action.payload
                ?.data
                ?.sessionId ||
              state.currentSessionId ||
              null;

            const result =
              action.payload
                ?.data ||
              {};

            state.lastRestartedPlatform =
              platform;

            state.activePlatforms = [
              ...new Set([
                ...state
                  .activePlatforms,

                platform,
              ]),
            ];

            updatePlatformStatus(
              state,
              platform,
              {
                liveStatus:
                  "streaming",

                [`${platform}LiveStatus`]:
                  "streaming",

                processActive:
                  true,

                sessionId,

                processId:
                  result?.pid ||
                  result
                    ?.processId ||
                  null,

                lastLiveStartedAt:
                  new Date()
                    .toISOString(),
              }
            );

            state.liveStatus =
              upsertLiveStatus(
                state.liveStatus,
                {
                  ...result,

                  platform,

                  sessionId,

                  databaseStatus:
                    "streaming",

                  runtimeStatus:
                    "streaming",

                  processActive:
                    true,

                  pid:
                    result?.pid ||
                    result
                      ?.processId ||
                    null,

                  lastLiveStartedAt:
                    new Date()
                      .toISOString(),
                }
              );

            state.successMessage =
              `${platform} stream restarted successfully.`;
          }
        )

        .addCase(
          restartPlatformLive.rejected,
          (
            state,
            action
          ) => {
            state.restartLoading =
              false;

            state.error =
              action.payload ||
              "Unable to restart platform stream.";
          }
        )

        /* =====================================================
           FETCH LIVE STATUS
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
                    .map(
                      normalizeLiveStatusItem
                    )
                    .filter(Boolean)
                : [];

            state.activePlatforms =
              state.liveStatus
                .filter(
                  (
                    item
                  ) =>
                    item.processActive ||
                    item.runtimeStatus ===
                      "streaming"
                )
                .map(
                  (
                    item
                  ) =>
                    normalizePlatform(
                      item.platform
                    )
                )
                .filter(Boolean);

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
                      item.liveStatus ||
                      "idle",

                    [`${platform}LiveStatus`]:
                      item.databaseStatus ||
                      item.liveStatus ||
                      "idle",

                    processActive:
                      Boolean(
                        item.processActive
                      ),

                    processId:
                      item.pid ||
                      item.processId ||
                      null,

                    pid:
                      item.pid ||
                      item.processId ||
                      null,

                    sessionId:
                      item.sessionId ||
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
        )

        /* =====================================================
           FETCH LIVE SESSION STATUS
        ===================================================== */

        .addCase(
          fetchLiveSessionStatus.pending,
          (
            state
          ) => {
            state.sessionLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchLiveSessionStatus.fulfilled,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            const session =
              normalizeSession(
                action.payload
              );

            if (
              !session?.sessionId
            ) {
              return;
            }

            state.sessions =
              upsertSession(
                state.sessions,
                session
              );

            state
              .sessionStatusById[
                session.sessionId
              ] =
              session;

            if (
              String(
                state.currentSessionId ||
                ""
              ) ===
                String(
                  session.sessionId
                ) ||
              !state.currentSessionId
            ) {
              state.currentSessionId =
                session.sessionId;

              state.currentSession =
                session;
            }

            session.processes.forEach(
              (
                process
              ) => {
                const platform =
                  normalizePlatform(
                    process.platform
                  );

                state.liveStatus =
                  upsertLiveStatus(
                    state.liveStatus,
                    process
                  );

                updatePlatformStatus(
                  state,
                  platform,
                  {
                    liveStatus:
                      process
                        .databaseStatus ||
                      "idle",

                    [`${platform}LiveStatus`]:
                      process
                        .databaseStatus ||
                      "idle",

                    processActive:
                      Boolean(
                        process
                          .processActive
                      ),

                    processId:
                      process.pid ||
                      null,

                    pid:
                      process.pid ||
                      null,

                    sessionId:
                      session.sessionId,
                  }
                );
              }
            );

            state.activePlatforms =
              state.liveStatus
                .filter(
                  (
                    item
                  ) =>
                    item.processActive ||
                    item.runtimeStatus ===
                      "streaming"
                )
                .map(
                  (
                    item
                  ) =>
                    normalizePlatform(
                      item.platform
                    )
                )
                .filter(Boolean);
          }
        )

        .addCase(
          fetchLiveSessionStatus.rejected,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            state.error =
              action.payload ||
              "Unable to load live session status.";
          }
        )

        /* =====================================================
           FETCH LIVE SESSIONS
        ===================================================== */

        .addCase(
          fetchLiveSessions.pending,
          (
            state
          ) => {
            state.sessionLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchLiveSessions.fulfilled,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            state.sessions =
              Array.isArray(
                action.payload
              )
                ? action.payload
                    .map(
                      normalizeSession
                    )
                    .filter(Boolean)
                : [];

            state.sessionStatusById =
              state.sessions.reduce(
                (
                  accumulator,
                  session
                ) => {
                  if (
                    session.sessionId
                  ) {
                    accumulator[
                      session.sessionId
                    ] =
                      session;
                  }

                  return accumulator;
                },
                {}
              );

            if (
              state.currentSessionId
            ) {
              state.currentSession =
                state
                  .sessionStatusById[
                    state.currentSessionId
                  ] ||
                null;
            }
          }
        )

        .addCase(
          fetchLiveSessions.rejected,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            state.error =
              action.payload ||
              "Unable to load live sessions.";
          }
        )

        /* =====================================================
           WAIT FOR LIVE SESSION
        ===================================================== */

        .addCase(
          waitForLiveSession.pending,
          (
            state
          ) => {
            state.sessionLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          waitForLiveSession.fulfilled,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            const session =
              normalizeSession(
                action.payload
              );

            if (
              !session?.sessionId
            ) {
              return;
            }

            state.currentSessionId =
              session.sessionId;

            state.currentSession =
              session;

            state.sessions =
              upsertSession(
                state.sessions,
                session
              );

            state
              .sessionStatusById[
                session.sessionId
              ] =
              session;

            session.processes.forEach(
              (
                process
              ) => {
                state.liveStatus =
                  upsertLiveStatus(
                    state.liveStatus,
                    process
                  );
              }
            );

            state.activePlatforms =
              session.processes
                .filter(
                  (
                    process
                  ) =>
                    process
                      .processActive ||
                    process
                      .runtimeStatus ===
                      "streaming"
                )
                .map(
                  (
                    process
                  ) =>
                    normalizePlatform(
                      process.platform
                    )
                )
                .filter(Boolean);
          }
        )

        .addCase(
          waitForLiveSession.rejected,
          (
            state,
            action
          ) => {
            state.sessionLoading =
              false;

            state.error =
              action.payload ||
              "The live session did not become active.";
          }
        )

        /* =====================================================
           FETCH PLATFORM HEALTH
        ===================================================== */

        .addCase(
          fetchPlatformHealth.pending,
          (
            state
          ) => {
            state.healthLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchPlatformHealth.fulfilled,
          (
            state,
            action
          ) => {
            state.healthLoading =
              false;

            const platform =
              normalizePlatform(
                action.payload
                  ?.platform
              );

            state.platformHealth[
              platform
            ] =
              action.payload
                ?.health ||
              null;
          }
        )

        .addCase(
          fetchPlatformHealth.rejected,
          (
            state,
            action
          ) => {
            state.healthLoading =
              false;

            state.error =
              action.payload ||
              "Unable to load platform stream health.";
          }
        )

        /* =====================================================
           FETCH USER STREAM HEALTH
        ===================================================== */

        .addCase(
          fetchUserStreamHealth.pending,
          (
            state
          ) => {
            state.healthLoading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchUserStreamHealth.fulfilled,
          (
            state,
            action
          ) => {
            state.healthLoading =
              false;

            state.userStreamHealth =
              action.payload;
          }
        )

        .addCase(
          fetchUserStreamHealth.rejected,
          (
            state,
            action
          ) => {
            state.healthLoading =
              false;

            state.error =
              action.payload ||
              "Unable to load stream health.";
          }
        )

        /* =====================================================
           RESET STALE LIVE STATUSES
        ===================================================== */

        .addCase(
          resetStaleLiveStatuses.pending,
          (
            state
          ) => {
            state.resetLoading =
              true;

            state.error =
              null;

            state.successMessage =
              null;
          }
        )

        .addCase(
          resetStaleLiveStatuses.fulfilled,
          (
            state,
            action
          ) => {
            state.resetLoading =
              false;

            state.staleStatusResult =
              action.payload;

            const resetPlatforms =
              Array.isArray(
                action.payload
                  ?.platforms
              )
                ? action.payload
                    .platforms
                    .map(
                      normalizePlatform
                    )
                    .filter(Boolean)
                : [];

            resetPlatforms.forEach(
              (
                platform
              ) => {
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
                      "idle",

                    [`${platform}LiveStatus`]:
                      "idle",

                    processActive:
                      false,

                    processId:
                      null,

                    pid:
                      null,
                  }
                );

                state.liveStatus =
                  upsertLiveStatus(
                    state.liveStatus,
                    {
                      platform,

                      databaseStatus:
                        "idle",

                      runtimeStatus:
                        "stopped",

                      processActive:
                        false,

                      pid:
                        null,
                    }
                  );
              }
            );

            state.successMessage =
              "Stale live statuses reset successfully.";
          }
        )

        .addCase(
          resetStaleLiveStatuses.rejected,
          (
            state,
            action
          ) => {
            state.resetLoading =
              false;

            state.error =
              action.payload ||
              "Unable to reset stale live statuses.";
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

  clearCurrentSession,
  setCurrentSession,
  removeSession,

  setActivePlatforms,
  addActivePlatform,
  removeActivePlatform,

  updateLocalPlatformStatus,
  setLiveStatus,
  upsertLocalSession,

  clearSessionStatuses,
  clearPlatformHealth,
  clearUserStreamHealth,

  clearLastStoppedPlatform,
  clearLastRestartedPlatform,

  resetLiveState,
  resetSocialState,
} =
  socialSlice.actions;

/* =========================================================
   BASE SOCIAL SELECTOR
========================================================= */

export const selectSocialState = (
  state
) =>
  state.social;

/* =========================================================
   CONNECTION SELECTORS
========================================================= */

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

  return [
    ...new Set(
      connections
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
        .filter(Boolean)
    ),
  ];
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

export const selectIsPlatformConnected =
  (
    platform
  ) =>
  (
    state
  ) => {
    const connection =
      selectConnectionByPlatform(
        platform
      )(
        state
      );

    return Boolean(
      connection &&
      connection.connected !==
        false
    );
  };

export const selectIsRTMPConfigured =
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

    const connection =
      selectConnectionByPlatform(
        normalizedPlatform
      )(
        state
      );

    if (!connection) {
      return false;
    }

    return Boolean(
      connection.rtmpConfigured ||
      connection[
        `${normalizedPlatform}RtmpConfigured`
      ] ||
      connection.streamKeyConfigured
    );
  };

/* =========================================================
   ACTIVE PLATFORM SELECTORS
========================================================= */

export const selectActivePlatforms = (
  state
) =>
  state.social
    ?.activePlatforms ||
  [];

export const selectIsPlatformLive =
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

    return selectActivePlatforms(
      state
    ).includes(
      normalizedPlatform
    );
  };

export const selectActivePlatformCount = (
  state
) =>
  selectActivePlatforms(
    state
  ).length;

export const selectHasActiveLive = (
  state
) =>
  selectActivePlatformCount(
    state
  ) > 0;

/* =========================================================
   LIVE STATUS SELECTORS
========================================================= */

export const selectLiveStatus = (
  state
) =>
  state.social
    ?.liveStatus ||
  [];

export const selectLiveStatusByPlatform =
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
      selectLiveStatus(
        state
      ).find(
        (
          item
        ) =>
          normalizePlatform(
            item.platform
          ) ===
          normalizedPlatform
      ) ||
      null
    );
  };

export const selectPlatformLiveState =
  (
    platform
  ) =>
  (
    state
  ) => {
    const status =
      selectLiveStatusByPlatform(
        platform
      )(
        state
      );

    return (
      status?.databaseStatus ||
      status?.liveStatus ||
      "idle"
    );
  };

export const selectPlatformRuntimeState =
  (
    platform
  ) =>
  (
    state
  ) => {
    const status =
      selectLiveStatusByPlatform(
        platform
      )(
        state
      );

    return (
      status?.runtimeStatus ||
      (
        status?.processActive
          ? "streaming"
          : "stopped"
      )
    );
  };

export const selectPlatformProcessActive =
  (
    platform
  ) =>
  (
    state
  ) => {
    const status =
      selectLiveStatusByPlatform(
        platform
      )(
        state
      );

    return Boolean(
      status?.processActive
    );
  };

export const selectStreamingStatuses = (
  state
) =>
  selectLiveStatus(
    state
  ).filter(
    (
      item
    ) =>
      item.processActive ||
      item.runtimeStatus ===
        "streaming" ||
      item.databaseStatus ===
        "streaming"
  );

/* =========================================================
   YOUTUBE SELECTORS
========================================================= */

export const selectCurrentYouTubeLive = (
  state
) =>
  state.social
    ?.currentYouTubeLive ||
  null;

export const selectYouTubeStreamStatus = (
  state
) =>
  state.social
    ?.youtubeStreamStatus ||
  null;

export const selectYouTubeBroadcastId = (
  state
) =>
  selectCurrentYouTubeLive(
    state
  )?.broadcastId ||
  selectCurrentYouTubeLive(
    state
  )?.youtubeBroadcastId ||
  "";

export const selectYouTubeStreamId = (
  state
) =>
  selectCurrentYouTubeLive(
    state
  )?.streamId ||
  selectCurrentYouTubeLive(
    state
  )?.youtubeStreamId ||
  "";

export const selectYouTubeWatchUrl = (
  state
) =>
  selectCurrentYouTubeLive(
    state
  )?.watchUrl ||
  "";

/* =========================================================
   SESSION SELECTORS
========================================================= */

export const selectCurrentSessionId = (
  state
) =>
  state.social
    ?.currentSessionId ||
  null;

export const selectCurrentSession = (
  state
) =>
  state.social
    ?.currentSession ||
  null;

export const selectLiveSessions = (
  state
) =>
  state.social
    ?.sessions ||
  [];

export const selectSessionStatusMap = (
  state
) =>
  state.social
    ?.sessionStatusById ||
  {};

export const selectSessionById =
  (
    sessionId
  ) =>
  (
    state
  ) => {
    if (!sessionId) {
      return null;
    }

    const statusMap =
      selectSessionStatusMap(
        state
      );

    return (
      statusMap[
        sessionId
      ] ||
      selectLiveSessions(
        state
      ).find(
        (
          session
        ) =>
          String(
            session.sessionId ||
            session.id ||
            ""
          ) ===
          String(
            sessionId
          )
      ) ||
      null
    );
  };

export const selectCurrentSessionProcesses = (
  state
) =>
  selectCurrentSession(
    state
  )?.processes ||
  [];

export const selectSessionProcesses =
  (
    sessionId
  ) =>
  (
    state
  ) =>
    selectSessionById(
      sessionId
    )(
      state
    )?.processes ||
    [];

export const selectSessionPlatform =
  (
    sessionId,
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
      selectSessionProcesses(
        sessionId
      )(
        state
      ).find(
        (
          process
        ) =>
          normalizePlatform(
            process.platform
          ) ===
          normalizedPlatform
      ) ||
      null
    );
  };

export const selectCurrentSessionActivePlatforms = (
  state
) =>
  selectCurrentSessionProcesses(
    state
  )
    .filter(
      (
        process
      ) =>
        process.processActive ||
        process.runtimeStatus ===
          "streaming"
    )
    .map(
      (
        process
      ) =>
        normalizePlatform(
          process.platform
        )
    )
    .filter(Boolean);

export const selectCurrentSessionStreaming = (
  state
) => {
  const session =
    selectCurrentSession(
      state
    );

  return Boolean(
    session?.streaming ||
    session?.processes?.some(
      (
        process
      ) =>
        process.processActive ||
        process.runtimeStatus ===
          "streaming"
    )
  );
};

export const selectCurrentSessionActiveCount = (
  state
) => {
  const session =
    selectCurrentSession(
      state
    );

  return Number(
    session?.activeCount ??
    session?.processes?.filter(
      (
        process
      ) =>
        process.processActive ||
        process.runtimeStatus ===
          "streaming"
    ).length ??
    0
  );
};

/* =========================================================
   HEALTH SELECTORS
========================================================= */

export const selectPlatformHealthMap = (
  state
) =>
  state.social
    ?.platformHealth ||
  {};

export const selectPlatformHealth =
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
      selectPlatformHealthMap(
        state
      )[
        normalizedPlatform
      ] ||
      null
    );
  };

export const selectUserStreamHealth = (
  state
) =>
  state.social
    ?.userStreamHealth ||
  null;

export const selectPlatformIsHealthy =
  (
    platform
  ) =>
  (
    state
  ) => {
    const health =
      selectPlatformHealth(
        platform
      )(
        state
      );

    if (!health) {
      return false;
    }

    if (
      typeof health.healthy ===
      "boolean"
    ) {
      return health.healthy;
    }

    const status =
      String(
        health.status ||
        health.health ||
        health.runtimeStatus ||
        ""
      )
        .trim()
        .toLowerCase();

    return [
      "healthy",
      "active",
      "running",
      "streaming",
      "ok",
    ].includes(
      status
    );
  };

/* =========================================================
   RESULT SELECTORS
========================================================= */

export const selectLastLiveResult = (
  state
) =>
  state.social
    ?.lastLiveResult ||
  null;

export const selectLastStoppedPlatform = (
  state
) =>
  state.social
    ?.lastStoppedPlatform ||
  null;

export const selectLastRestartedPlatform = (
  state
) =>
  state.social
    ?.lastRestartedPlatform ||
  null;

export const selectStaleStatusResult = (
  state
) =>
  state.social
    ?.staleStatusResult ||
  null;

/* =========================================================
   MESSAGE SELECTORS
========================================================= */

export const selectSocialError = (
  state
) =>
  state.social
    ?.error ||
  null;

export const selectSocialSuccessMessage = (
  state
) =>
  state.social
    ?.successMessage ||
  null;

/* =========================================================
   INDIVIDUAL LOADING SELECTORS
========================================================= */

export const selectConnectionsLoading = (
  state
) =>
  Boolean(
    state.social
      ?.loading
  );

export const selectConnectionLoading = (
  state
) =>
  Boolean(
    state.social
      ?.connectionLoading
  );

export const selectRTMPLoading = (
  state
) =>
  Boolean(
    state.social
      ?.rtmpLoading
  );

export const selectYouTubeLoading = (
  state
) =>
  Boolean(
    state.social
      ?.youtubeLoading
  );

export const selectLiveLoading = (
  state
) =>
  Boolean(
    state.social
      ?.liveLoading
  );

export const selectSessionLoading = (
  state
) =>
  Boolean(
    state.social
      ?.sessionLoading
  );

export const selectStatusLoading = (
  state
) =>
  Boolean(
    state.social
      ?.statusLoading
  );

export const selectHealthLoading = (
  state
) =>
  Boolean(
    state.social
      ?.healthLoading
  );

export const selectRestartLoading = (
  state
) =>
  Boolean(
    state.social
      ?.restartLoading
  );

export const selectResetLoading = (
  state
) =>
  Boolean(
    state.social
      ?.resetLoading
  );

/* =========================================================
   COMBINED LOADING SELECTORS
========================================================= */

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
      ?.liveLoading ||
    state.social
      ?.sessionLoading ||
    state.social
      ?.statusLoading ||
    state.social
      ?.healthLoading ||
    state.social
      ?.restartLoading ||
    state.social
      ?.resetLoading
  );

export const selectLiveOperationLoading = (
  state
) =>
  Boolean(
    state.social
      ?.liveLoading ||
    state.social
      ?.sessionLoading ||
    state.social
      ?.restartLoading
  );

export const selectLiveMonitoringLoading = (
  state
) =>
  Boolean(
    state.social
      ?.statusLoading ||
    state.social
      ?.healthLoading
  );

/* =========================================================
   REDUCER
========================================================= */

export default socialSlice.reducer;