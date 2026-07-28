import axios from "axios";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com/api";

const SOCIAL_API =
  `${API_BASE_URL}/social`;

/* =========================================================
   AXIOS CLIENT
========================================================= */

const apiClient =
  axios.create({
    baseURL:
      API_BASE_URL,

    withCredentials:
      true,

    timeout:
      60000,

    headers: {
      Accept:
        "application/json",
    },
  });

/* =========================================================
   PLATFORM CONFIGURATION
========================================================= */

export const OAUTH_PLATFORMS = [
  "instagram",
  "facebook",
  "youtube",
  "linkedin",
  "tiktok",
];

export const MANUAL_RTMP_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "rumble",
  "kick",
  "twitch",
  "twitter",
];

export const LIVE_PLATFORMS = [
  "instagram",
  "facebook",
  "youtube",
  "linkedin",
  "tiktok",
  "rumble",
  "kick",
  "twitch",
  "twitter",
];

/* =========================================================
   NORMALIZE PLATFORM
========================================================= */

export const normalizePlatform = (
  platform = ""
) => {
  const normalized =
    String(platform)
      .trim()
      .toLowerCase();

  if (
    normalized === "x" ||
    normalized === "twitter/x" ||
    normalized === "x/twitter"
  ) {
    return "twitter";
  }

  return normalized;
};

/* =========================================================
   NORMALIZE PLATFORM ARRAY
========================================================= */

export const normalizePlatforms = (
  platforms = []
) => {
  const list =
    Array.isArray(platforms)
      ? platforms
      : String(platforms || "")
          .split(",");

  return [
    ...new Set(
      list
        .map(
          normalizePlatform
        )
        .filter(Boolean)
    ),
  ];
};

/* =========================================================
   VALIDATE LIVE PLATFORM
========================================================= */

const validateLivePlatform = (
  platform
) => {
  const normalizedPlatform =
    normalizePlatform(
      platform
    );

  if (
    !LIVE_PLATFORMS.includes(
      normalizedPlatform
    )
  ) {
    throw new Error(
      "Unsupported live platform."
    );
  }

  return normalizedPlatform;
};

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (
  error,
  fallback
) => {
  return (
    error?.response?.data
      ?.message ||
    error?.response?.data
      ?.error ||
    error?.message ||
    fallback
  );
};

/* =========================================================
   EXTRACT RESPONSE DATA
========================================================= */

const extractData = (
  response
) => {
  return (
    response?.data?.data ??
    response?.data ??
    null
  );
};

/* =========================================================
   EXTRACT CONNECTIONS
========================================================= */

const extractConnections = (
  response
) => {
  const payload =
    response?.data;

  if (
    Array.isArray(payload)
  ) {
    return payload;
  }

  if (
    Array.isArray(
      payload?.data
    )
  ) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload?.connections
    )
  ) {
    return payload.connections;
  }

  if (
    Array.isArray(
      payload?.data
        ?.connections
    )
  ) {
    return payload
      .data
      .connections;
  }

  return [];
};

/* =========================================================
   OPEN URL
========================================================= */

const openUrl = (
  url
) => {
  window.location.assign(
    url
  );
};

/* =========================================================
   CONNECT OAUTH PLATFORM
========================================================= */

export const connectAPI = (
  platform
) => {
  const normalizedPlatform =
    normalizePlatform(
      platform
    );

  if (
    !OAUTH_PLATFORMS.includes(
      normalizedPlatform
    )
  ) {
    throw new Error(
      `${normalizedPlatform} does not use OAuth connection.`
    );
  }

  const url =
    `${SOCIAL_API}/connect/` +
    `${encodeURIComponent(
      normalizedPlatform
    )}`;

  openUrl(
    url
  );

  return {
    success:
      true,

    platform:
      normalizedPlatform,

    redirecting:
      true,

    url,
  };
};

/* =========================================================
   GET CONNECTIONS
========================================================= */

export const getConnectionsAPI =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/social/connections"
        );

      return extractConnections(
        response
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load social connections."
        )
      );
    }
  };

/* =========================================================
   SAVE INSTAGRAM RTMP
========================================================= */

export const saveInstagramRTMPAPI =
  async ({
    rtmpUrl,
    streamKey,
  }) => {
    try {
      const response =
        await apiClient.patch(
          "/social/connections/instagram/rtmp",
          {
            rtmpUrl:
              String(
                rtmpUrl ||
                ""
              ).trim(),

            streamKey:
              String(
                streamKey ||
                ""
              ).trim(),
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to save Instagram RTMP settings."
        )
      );
    }
  };

/* =========================================================
   SAVE MANUAL RTMP CONNECTION
========================================================= */

export const saveRTMPConnectionAPI =
  async (
    platform,
    data = {}
  ) => {
    const normalizedPlatform =
      normalizePlatform(
        platform
      );

    if (
      !MANUAL_RTMP_PLATFORMS.includes(
        normalizedPlatform
      )
    ) {
      throw new Error(
        "Manual RTMP is not supported for this platform."
      );
    }

    const rtmpUrl =
      String(
        data.rtmpUrl ||
        ""
      ).trim();

    const streamKey =
      String(
        data.streamKey ||
        ""
      ).trim();

    if (
      !rtmpUrl ||
      !streamKey
    ) {
      throw new Error(
        "RTMP URL and stream key are required."
      );
    }

    try {
      const response =
        await apiClient.patch(
          `/social/connections/${encodeURIComponent(
            normalizedPlatform
          )}/rtmp`,
          {
            rtmpUrl,

            streamKey,

            channelUrl:
              String(
                data.channelUrl ||
                ""
              ).trim(),

            username:
              String(
                data.username ||
                ""
              ).trim(),

            channelName:
              String(
                data.channelName ||
                data.username ||
                ""
              ).trim(),
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          `Unable to connect ${normalizedPlatform}.`
        )
      );
    }
  };

/* =========================================================
   OPEN MANUAL PLATFORM DASHBOARD
========================================================= */

export const openManualPlatformAPI = (
  platform
) => {
  const normalizedPlatform =
    normalizePlatform(
      platform
    );

  if (
    !MANUAL_RTMP_PLATFORMS.includes(
      normalizedPlatform
    )
  ) {
    throw new Error(
      "Unsupported manual RTMP platform."
    );
  }

  const url =
    `${SOCIAL_API}/manual/` +
    `${encodeURIComponent(
      normalizedPlatform
    )}/open`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

  return {
    success:
      true,

    platform:
      normalizedPlatform,

    url,
  };
};

/* =========================================================
   DISCONNECT PLATFORM
========================================================= */

export const disconnectSocialAPI =
  async (
    platform
  ) => {
    const normalizedPlatform =
      normalizePlatform(
        platform
      );

    if (!normalizedPlatform) {
      throw new Error(
        "Platform is required."
      );
    }

    try {
      const response =
        await apiClient.delete(
          `/social/connections/${encodeURIComponent(
            normalizedPlatform
          )}`
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          `Unable to disconnect ${normalizedPlatform}.`
        )
      );
    }
  };

/* =========================================================
   CREATE YOUTUBE LIVE
========================================================= */

export const createYouTubeLiveAPI =
  async (
    payload = {}
  ) => {
    try {
      const response =
        await apiClient.post(
          "/social/youtube/live",
          {
            title:
              payload.title ||
              "Twinn AI Live",

            description:
              payload.description ||
              "Live stream powered by Twinn.",

            privacyStatus:
              payload.privacyStatus ||
              "public",

            scheduledStartTime:
              payload
                .scheduledStartTime ||
              new Date(
                Date.now() +
                2 *
                  60 *
                  1000
              ).toISOString(),

            madeForKids:
              Boolean(
                payload
                  .madeForKids
              ),

            enableAutoStart:
              payload
                .enableAutoStart !==
              false,

            enableAutoStop:
              payload
                .enableAutoStop !==
              false,
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to create YouTube live stream."
        )
      );
    }
  };

/* =========================================================
   GET CURRENT YOUTUBE LIVE
========================================================= */

export const getCurrentYouTubeLiveAPI =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/social/youtube/live"
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load the current YouTube live stream."
        )
      );
    }
  };

/* =========================================================
   GET YOUTUBE STREAM STATUS
========================================================= */

export const getYouTubeStreamStatusAPI =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/social/youtube/live/status"
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to check YouTube stream status."
        )
      );
    }
  };

/* =========================================================
   START YOUTUBE BROADCAST
========================================================= */

export const startYouTubeBroadcastAPI =
  async () => {
    try {
      const response =
        await apiClient.post(
          "/social/youtube/live/start",
          {}
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to start YouTube broadcast."
        )
      );
    }
  };

/* =========================================================
   END YOUTUBE BROADCAST
========================================================= */

export const endYouTubeBroadcastAPI =
  async () => {
    try {
      const response =
        await apiClient.post(
          "/social/youtube/live/end",
          {}
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to end YouTube broadcast."
        )
      );
    }
  };

/* =========================================================
   APPEND FORM DATA FIELD
========================================================= */

const appendFormField = (
  formData,
  name,
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  formData.append(
    name,
    String(value)
  );
};

/* =========================================================
   START UNIFIED LIVE STREAM
========================================================= */

export const startLiveAPI =
  async ({
    platforms = [],

    video = null,

    inputUrl = "",

    sourceUrl = "",

    sourceType = "",

    loop = false,

    includeAudio = true,

    reconnect = true,

    rollbackOnFailure = true,

    videoBitrate = 4500,

    audioBitrate = 128,

    width = 1280,

    height = 720,

    fps = 30,

    keyframeInterval = 2,

    preset = "veryfast",

    sessionId = "",

    twinId = "",

    productId = "",

    liveId = "",

    metadata = {},
  } = {}) => {
    const normalizedPlatforms =
      normalizePlatforms(
        platforms
      );

    if (
      !normalizedPlatforms.length
    ) {
      throw new Error(
        "Select at least one platform."
      );
    }

    const unsupportedPlatforms =
      normalizedPlatforms.filter(
        (platform) =>
          !LIVE_PLATFORMS.includes(
            platform
          )
      );

    if (
      unsupportedPlatforms.length
    ) {
      throw new Error(
        `Unsupported live platforms: ${unsupportedPlatforms.join(
          ", "
        )}`
      );
    }

    try {
      if (video) {
        const formData =
          new FormData();

        formData.append(
          "video",
          video
        );

        formData.append(
          "platforms",
          JSON.stringify(
            normalizedPlatforms
          )
        );

        appendFormField(
          formData,
          "loop",
          Boolean(loop)
        );

        appendFormField(
          formData,
          "includeAudio",
          Boolean(
            includeAudio
          )
        );

        appendFormField(
          formData,
          "reconnect",
          Boolean(reconnect)
        );

        appendFormField(
          formData,
          "rollbackOnFailure",
          Boolean(
            rollbackOnFailure
          )
        );

        appendFormField(
          formData,
          "videoBitrate",
          videoBitrate
        );

        appendFormField(
          formData,
          "audioBitrate",
          audioBitrate
        );

        appendFormField(
          formData,
          "width",
          width
        );

        appendFormField(
          formData,
          "height",
          height
        );

        appendFormField(
          formData,
          "fps",
          fps
        );

        appendFormField(
          formData,
          "keyframeInterval",
          keyframeInterval
        );

        appendFormField(
          formData,
          "preset",
          preset
        );

        appendFormField(
          formData,
          "sessionId",
          sessionId
        );

        appendFormField(
          formData,
          "twinId",
          twinId
        );

        appendFormField(
          formData,
          "productId",
          productId
        );

        appendFormField(
          formData,
          "liveId",
          liveId
        );

        if (
          metadata &&
          typeof metadata ===
            "object"
        ) {
          formData.append(
            "metadata",
            JSON.stringify(
              metadata
            )
          );
        }

        const response =
          await apiClient.post(
            "/live/start",
            formData,
            {
              timeout:
                120000,

              onUploadProgress:
                (
                  progressEvent
                ) => {
                  if (
                    import.meta.env
                      .DEV
                  ) {
                    const total =
                      progressEvent
                        .total ||
                      0;

                    if (total) {
                      const percent =
                        Math.round(
                          (
                            progressEvent
                              .loaded /
                            total
                          ) *
                            100
                        );

                      console.log(
                        `Live video upload: ${percent}%`
                      );
                    }
                  }
                },
            }
          );

        return response.data;
      }

      const finalInputUrl =
        String(
          inputUrl ||
          sourceUrl ||
          ""
        ).trim();

      if (!finalInputUrl) {
        throw new Error(
          "Upload a video or provide an input URL."
        );
      }

      const response =
        await apiClient.post(
          "/live/start",
          {
            platforms:
              normalizedPlatforms,

            inputUrl:
              finalInputUrl,

            sourceType:
              sourceType ||
              "url",

            loop:
              Boolean(loop),

            includeAudio:
              Boolean(
                includeAudio
              ),

            reconnect:
              Boolean(reconnect),

            rollbackOnFailure:
              Boolean(
                rollbackOnFailure
              ),

            videoBitrate,

            audioBitrate,

            width,

            height,

            fps,

            keyframeInterval,

            preset,

            sessionId:
              sessionId ||
              undefined,

            twinId:
              twinId ||
              undefined,

            productId:
              productId ||
              undefined,

            liveId:
              liveId ||
              undefined,

            metadata,
          },
          {
            timeout:
              120000,
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to start live stream."
        )
      );
    }
  };

/* =========================================================
   ADD PLATFORM TO SESSION
========================================================= */

export const addPlatformToSessionAPI =
  async ({
    sessionId,

    platform,

    inputUrl = "",

    sourceUrl = "",

    sourceType = "url",

    loop = false,

    includeAudio = true,

    reconnect = true,

    videoBitrate = 4500,

    audioBitrate = 128,

    width = 1280,

    height = 720,

    fps = 30,

    keyframeInterval = 2,

    preset = "veryfast",

    metadata = {},
  }) => {
    const normalizedPlatform =
      validateLivePlatform(
        platform
      );

    const normalizedSessionId =
      String(
        sessionId ||
        ""
      ).trim();

    const input =
      String(
        inputUrl ||
        sourceUrl ||
        ""
      ).trim();

    if (!normalizedSessionId) {
      throw new Error(
        "Session ID is required."
      );
    }

    if (!input) {
      throw new Error(
        "Video input URL is required."
      );
    }

    try {
      const response =
        await apiClient.post(
          `/live/sessions/${encodeURIComponent(
            normalizedSessionId
          )}/platforms/${encodeURIComponent(
            normalizedPlatform
          )}`,
          {
            inputUrl:
              input,

            sourceType,

            loop:
              Boolean(loop),

            includeAudio:
              Boolean(
                includeAudio
              ),

            reconnect:
              Boolean(reconnect),

            videoBitrate,

            audioBitrate,

            width,

            height,

            fps,

            keyframeInterval,

            preset,

            metadata,
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          `Unable to add ${normalizedPlatform} to the live session.`
        )
      );
    }
  };

/* =========================================================
   STOP ONE PLATFORM
========================================================= */

export const stopPlatformLiveAPI =
  async (
    platform,
    sessionId = ""
  ) => {
    const normalizedPlatform =
      validateLivePlatform(
        platform
      );

    const normalizedSessionId =
      String(
        sessionId ||
        ""
      ).trim();

    const endpoint =
      normalizedSessionId
        ? `/live/sessions/${encodeURIComponent(
            normalizedSessionId
          )}/stop/${encodeURIComponent(
            normalizedPlatform
          )}`
        : `/live/stop/${encodeURIComponent(
            normalizedPlatform
          )}`;

    try {
      const response =
        await apiClient.post(
          endpoint,
          {}
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          `Unable to stop ${normalizedPlatform} stream.`
        )
      );
    }
  };

/* =========================================================
   STOP SESSION
========================================================= */

export const stopLiveSessionAPI =
  async (
    sessionId,
    {
      temporaryFilePath = "",
    } = {}
  ) => {
    const normalizedSessionId =
      String(
        sessionId ||
        ""
      ).trim();

    if (!normalizedSessionId) {
      throw new Error(
        "Session ID is required."
      );
    }

    try {
      const response =
        await apiClient.post(
          `/live/sessions/${encodeURIComponent(
            normalizedSessionId
          )}/stop`,
          {
            temporaryFilePath:
              temporaryFilePath ||
              undefined,
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to stop the live session."
        )
      );
    }
  };

/* =========================================================
   STOP ALL LIVE STREAMS
========================================================= */

export const stopAllLiveAPI =
  async (
    temporaryFilePaths = []
  ) => {
    try {
      const response =
        await apiClient.post(
          "/live/stop",
          {
            temporaryFilePaths:
              Array.isArray(
                temporaryFilePaths
              )
                ? temporaryFilePaths
                : [],
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to stop active live streams."
        )
      );
    }
  };

/* =========================================================
   RESTART PLATFORM STREAM
========================================================= */

export const restartPlatformLiveAPI =
  async ({
    platform,

    inputUrl = "",

    sourceUrl = "",

    sourceType = "url",

    sessionId = "",

    loop = false,

    includeAudio = true,

    reconnect = true,

    videoBitrate = 4500,

    audioBitrate = 128,

    width = 1280,

    height = 720,

    fps = 30,

    keyframeInterval = 2,

    preset = "veryfast",

    metadata = {},
  }) => {
    const normalizedPlatform =
      validateLivePlatform(
        platform
      );

    const input =
      String(
        inputUrl ||
        sourceUrl ||
        ""
      ).trim();

    if (!input) {
      throw new Error(
        "Video input URL is required."
      );
    }

    try {
      const response =
        await apiClient.post(
          `/live/restart/${encodeURIComponent(
            normalizedPlatform
          )}`,
          {
            inputUrl:
              input,

            sourceType,

            sessionId:
              sessionId ||
              undefined,

            loop:
              Boolean(loop),

            includeAudio:
              Boolean(
                includeAudio
              ),

            reconnect:
              Boolean(reconnect),

            videoBitrate,

            audioBitrate,

            width,

            height,

            fps,

            keyframeInterval,

            preset,

            metadata,
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          `Unable to restart ${normalizedPlatform} stream.`
        )
      );
    }
  };

/* =========================================================
   GET UNIFIED LIVE STATUS
========================================================= */

export const getLiveStatusAPI =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/live/status"
        );

      const data =
        extractData(
          response
        );

      return Array.isArray(data)
        ? data
        : [];
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load live status."
        )
      );
    }
  };

/* =========================================================
   GET SESSION STATUS
========================================================= */

export const getLiveSessionStatusAPI =
  async (
    sessionId
  ) => {
    const normalizedSessionId =
      String(
        sessionId ||
        ""
      ).trim();

    if (!normalizedSessionId) {
      throw new Error(
        "Session ID is required."
      );
    }

    try {
      const response =
        await apiClient.get(
          `/live/sessions/${encodeURIComponent(
            normalizedSessionId
          )}/status`
        );

      return extractData(
        response
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load live session status."
        )
      );
    }
  };

/* =========================================================
   GET USER LIVE SESSIONS
========================================================= */

export const getLiveSessionsAPI =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/live/sessions"
        );

      const data =
        extractData(
          response
        );

      return Array.isArray(data)
        ? data
        : [];
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load live sessions."
        )
      );
    }
  };

/* =========================================================
   GET PLATFORM HEALTH
========================================================= */

export const getPlatformHealthAPI =
  async (
    platform
  ) => {
    const normalizedPlatform =
      validateLivePlatform(
        platform
      );

    try {
      const response =
        await apiClient.get(
          `/live/health/${encodeURIComponent(
            normalizedPlatform
          )}`
        );

      return extractData(
        response
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          `Unable to load ${normalizedPlatform} stream health.`
        )
      );
    }
  };

/* =========================================================
   GET USER STREAM HEALTH
========================================================= */

export const getUserStreamHealthAPI =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/live/health"
        );

      return extractData(
        response
      );
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to load stream health."
        )
      );
    }
  };

/* =========================================================
   RESET STALE LIVE STATUSES
========================================================= */

export const resetStaleLiveStatusesAPI =
  async () => {
    try {
      const response =
        await apiClient.post(
          "/live/reset-stale-statuses",
          {}
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to reset stale live statuses."
        )
      );
    }
  };

/* =========================================================
   WAIT FOR SESSION STREAMING
========================================================= */

export const waitForLiveSessionAPI =
  async ({
    sessionId,

    attempts = 30,

    interval = 2000,

    requireAll = false,
  }) => {
    let latestStatus =
      null;

    for (
      let attempt = 1;
      attempt <= attempts;
      attempt += 1
    ) {
      latestStatus =
        await getLiveSessionStatusAPI(
          sessionId
        );

      const processes =
        latestStatus
          ?.processes ||
        latestStatus
          ?.platforms ||
        latestStatus
          ?.streams ||
        [];

      const activeProcesses =
        Array.isArray(processes)
          ? processes.filter(
              (item) =>
                item.active ===
                  true ||
                item.status ===
                  "streaming"
            )
          : [];

      const expectedTotal =
        Number(
          latestStatus
            ?.total ||
          processes.length ||
          0
        );

      const ready =
        requireAll
          ? expectedTotal > 0 &&
            activeProcesses
              .length >=
              expectedTotal
          : activeProcesses
              .length > 0 ||
            latestStatus
              ?.streaming ===
              true;

      if (ready) {
        return latestStatus;
      }

      if (
        attempt < attempts
      ) {
        await new Promise(
          (resolve) => {
            setTimeout(
              resolve,
              interval
            );
          }
        );
      }
    }

    throw new Error(
      "The live session did not become active in time."
    );
  };

/* =========================================================
   WAIT FOR YOUTUBE INGESTION
========================================================= */

export const waitForYouTubeStreamAPI =
  async ({
    attempts = 30,
    interval = 4000,
  } = {}) => {
    let latestStatus =
      null;

    for (
      let attempt = 1;
      attempt <= attempts;
      attempt += 1
    ) {
      latestStatus =
        await getYouTubeStreamStatusAPI();

      const data =
        latestStatus?.data ||
        latestStatus;

      const ingestionStatus =
        String(
          data?.ingestionStatus ||
          data?.streamStatus
            ?.streamStatus ||
          ""
        )
          .trim()
          .toLowerCase();

      if (
        ingestionStatus ===
          "active" ||
        ingestionStatus ===
          "ready"
      ) {
        return latestStatus;
      }

      if (
        attempt < attempts
      ) {
        await new Promise(
          (resolve) => {
            setTimeout(
              resolve,
              interval
            );
          }
        );
      }
    }

    throw new Error(
      "YouTube is not receiving the stream yet. Check FFmpeg and try again."
    );
  };

/* =========================================================
   COMPATIBILITY EXPORTS
========================================================= */

export const startYouTubeLiveAPI =
  createYouTubeLiveAPI;

export const stopYouTubeLiveAPI =
  endYouTubeBroadcastAPI;

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  connectAPI,

  getConnectionsAPI,

  saveInstagramRTMPAPI,

  saveRTMPConnectionAPI,

  openManualPlatformAPI,

  disconnectSocialAPI,

  createYouTubeLiveAPI,

  getCurrentYouTubeLiveAPI,

  getYouTubeStreamStatusAPI,

  startYouTubeBroadcastAPI,

  endYouTubeBroadcastAPI,

  startYouTubeLiveAPI,

  stopYouTubeLiveAPI,

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

  waitForYouTubeStreamAPI,
};