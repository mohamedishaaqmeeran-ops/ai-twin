import axios from "axios";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env
    .VITE_API_URL ||
  "https://twinn-backend.onrender.com/api";

const SOCIAL_API =
  `${API_BASE_URL}/social`;

const LIVE_API =
  `${API_BASE_URL}/live`;

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
];

export const MANUAL_RTMP_PLATFORMS = [
  "rumble",
  "kick",
  "twitch",
  "twitter",
];

export const LIVE_PLATFORMS = [
  "instagram",
  "youtube",
  "rumble",
  "kick",
  "twitch",
  "twitter",
];

/* =========================================================
   HELPERS
========================================================= */

export const normalizePlatform = (
  platform = ""
) => {
  const normalized =
    String(platform)
      .trim()
      .toLowerCase();

  if (
    normalized === "x"
  ) {
    return "twitter";
  }

  return normalized;
};

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

  return [];
};

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

/*
 * OAuth is handled using a browser redirect.
 *
 * Do not use Axios for OAuth redirect because:
 * - the backend returns res.redirect(...)
 * - Google/Meta login must open in the browser
 * - cookies and redirects work correctly using window.location
 */
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
            rtmpUrl,
            streamKey,
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
    data
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
        "Manual RTMP is supported only for Rumble, Kick, Twitch and X/Twitter."
      );
    }

    try {
      const response =
        await apiClient.patch(
          `/social/connections/${encodeURIComponent(
            normalizedPlatform
          )}/rtmp`,
          {
            rtmpUrl:
              String(
                data?.rtmpUrl ||
                ""
              ).trim(),

            streamKey:
              String(
                data?.streamKey ||
                ""
              ).trim(),

            channelUrl:
              String(
                data?.channelUrl ||
                ""
              ).trim(),

            username:
              String(
                data?.username ||
                ""
              ).trim(),

            channelName:
              String(
                data?.channelName ||
                data?.username ||
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
    videoBitrate = 4500,
    audioBitrate = 128,
    width = 1280,
    height = 720,
    fps = 30,
    preset = "veryfast",
  }) => {
    const normalizedPlatforms =
      [
        ...new Set(
          platforms
            .map(
              normalizePlatform
            )
            .filter(Boolean)
        ),
      ];

    if (
      !normalizedPlatforms.length
    ) {
      throw new Error(
        "Select at least one platform."
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

        formData.append(
          "loop",
          String(
            Boolean(loop)
          )
        );

        formData.append(
          "videoBitrate",
          String(
            videoBitrate
          )
        );

        formData.append(
          "audioBitrate",
          String(
            audioBitrate
          )
        );

        formData.append(
          "width",
          String(width)
        );

        formData.append(
          "height",
          String(height)
        );

        formData.append(
          "fps",
          String(fps)
        );

        formData.append(
          "preset",
          String(preset)
        );

        const response =
          await apiClient.post(
            "/live/start",
            formData,
            {
              timeout:
                120000,

              headers: {
                "Content-Type":
                  "multipart/form-data",
              },

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

            videoBitrate,

            audioBitrate,

            width,

            height,

            fps,

            preset,
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
   STOP ONE PLATFORM
========================================================= */

export const stopPlatformLiveAPI =
  async (
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

    try {
      const response =
        await apiClient.post(
          `/live/stop/${encodeURIComponent(
            normalizedPlatform
          )}`,
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
   STOP ALL LIVE STREAMS
========================================================= */

export const stopAllLiveAPI =
  async () => {
    try {
      const response =
        await apiClient.post(
          "/live/stop",
          {}
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
   GET UNIFIED LIVE STATUS
========================================================= */

export const getLiveStatusAPI =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/live/status"
        );

      return (
        response.data?.data ||
        []
      );
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
        attempt <
        attempts
      ) {
        await new Promise(
          (
            resolve
          ) => {
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
  startLiveAPI,
  stopPlatformLiveAPI,
  stopAllLiveAPI,
  getLiveStatusAPI,
  waitForYouTubeStreamAPI,
};