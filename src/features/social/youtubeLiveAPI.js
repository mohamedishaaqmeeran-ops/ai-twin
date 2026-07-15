const API =
  "https://twinn-backend.onrender.com/api";

const SOCIAL_API =
  `${API}/social/youtube/live`;

const LIVE_API =
  `${API}/live`;

const parseResponse = async (
  response
) => {
  const result = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message ||
        "YouTube request failed."
    );
  }

  return result.data;
};

/* =========================================================
   CREATE YOUTUBE BROADCAST
========================================================= */

export const createYouTubeLiveAPI =
  async ({
    title,
    description,
    privacyStatus =
      "unlisted",
  }) => {
    const response = await fetch(
      SOCIAL_API,
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          title,
          description,
          privacyStatus,

          scheduledStartTime:
            new Date(
              Date.now() +
                2 * 60 * 1000
            ).toISOString(),

          madeForKids: false,

          /*
           * We manually transition
           * after checking status.
           */
          enableAutoStart: false,
          enableAutoStop: false,
        }),
      }
    );

    return parseResponse(
      response
    );
  };

/* =========================================================
   START FFMPEG
========================================================= */

export const startYouTubeRtmpAPI =
  async ({
    videoPath,
  }) => {
    const response = await fetch(
      `${LIVE_API}/start-youtube-rtmp`,
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          videoPath,
        }),
      }
    );

    return parseResponse(
      response
    );
  };

/* =========================================================
   GET STREAM STATUS
========================================================= */

export const getYouTubeStatusAPI =
  async () => {
    const response = await fetch(
      `${SOCIAL_API}/status`,
      {
        credentials: "include",
      }
    );

    return parseResponse(
      response
    );
  };

/* =========================================================
   WAIT FOR ACTIVE STREAM
========================================================= */

export const waitForYouTubeStreamAPI =
  async ({
    maxAttempts = 30,
    interval = 5000,
    onWaiting,
  } = {}) => {
    for (
      let attempt = 1;
      attempt <= maxAttempts;
      attempt += 1
    ) {
      const status =
        await getYouTubeStatusAPI();

      if (
        status?.readyToGoLive
      ) {
        return status;
      }

      onWaiting?.(
        attempt,
        maxAttempts,
        status
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            interval
          )
      );
    }

    throw new Error(
      "YouTube did not receive the video stream."
    );
  };

/* =========================================================
   TRANSITION TO LIVE
========================================================= */

export const startYouTubeBroadcastAPI =
  async () => {
    const response = await fetch(
      `${SOCIAL_API}/start`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    return parseResponse(
      response
    );
  };

/* =========================================================
   END BROADCAST
========================================================= */

export const endYouTubeBroadcastAPI =
  async () => {
    const response = await fetch(
      `${SOCIAL_API}/end`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    return parseResponse(
      response
    );
  };

/* =========================================================
   STOP FFMPEG
========================================================= */

export const stopYouTubeRtmpAPI =
  async () => {
    const response = await fetch(
      `${LIVE_API}/stop-youtube-rtmp`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    return parseResponse(
      response
    );
  };