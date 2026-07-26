import axios from "axios";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API =
  "https://twinn-backend.onrender.com/api";

const SOCIAL_API =
  `${API}/social`;

const LIVE_API =
  `${API}/live`;

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (
  error,
  fallbackMessage
) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallbackMessage
  );
};

/* =========================================================
   CONNECT SOCIAL PLATFORM
========================================================= */

export const connectAPI =
  async (
    platform
  ) => {
    try {
      const normalizedPlatform =
        String(
          platform || ""
        )
          .trim()
          .toLowerCase();

      if (
        !normalizedPlatform
      ) {
        throw new Error(
          "Platform is required."
        );
      }

      const response =
        await axios.get(
          `${SOCIAL_API}/connect/${normalizedPlatform}`,
          {
            withCredentials: true,
          }
        );

      const data =
        response.data;

      const oauthUrl =
        data?.url ||
        data?.authUrl ||
        data?.oauthUrl ||
        data?.redirectUrl ||
        data?.data?.url ||
        data?.data?.authUrl ||
        data?.data?.oauthUrl ||
        data?.data?.redirectUrl;

      if (!oauthUrl) {
        throw new Error(
          "OAuth URL was not returned by the backend."
        );
      }

      return {
        ...data,
        url: oauthUrl,
      };
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to connect social platform."
        )
      );
    }
  };

/* =========================================================
   GET SOCIAL CONNECTIONS
========================================================= */

export const getConnectionsAPI =
  async () => {
    try {
      const response =
        await axios.get(
          `${SOCIAL_API}/connections`,
          {
            withCredentials: true,
          }
        );

      const data =
        response.data;

      if (
        Array.isArray(data)
      ) {
        return data;
      }

      if (
        Array.isArray(
          data?.connections
        )
      ) {
        return data.connections;
      }

      if (
        Array.isArray(
          data?.data
        )
      ) {
        return data.data;
      }

      if (
        Array.isArray(
          data?.data?.connections
        )
      ) {
        return data.data
          .connections;
      }

      return [];
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
   DISCONNECT SOCIAL PLATFORM
========================================================= */

export const disconnectSocialAPI =
  async (
    platform
  ) => {
    try {
      const normalizedPlatform =
        String(
          platform || ""
        )
          .trim()
          .toLowerCase();

      if (
        !normalizedPlatform
      ) {
        throw new Error(
          "Platform is required."
        );
      }

      const response =
        await axios.delete(
          `${SOCIAL_API}/connections/${normalizedPlatform}`,
          {
            withCredentials: true,
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to disconnect platform."
        )
      );
    }
  };

/* =========================================================
   SAVE RTMP CONNECTION
========================================================= */

export const saveRTMPConnectionAPI =
  async (
    platform,
    data
  ) => {
    try {
      const normalizedPlatform =
        String(
          platform || ""
        )
          .trim()
          .toLowerCase();

      if (
        !normalizedPlatform
      ) {
        throw new Error(
          "Platform is required."
        );
      }

      const response =
        await axios.patch(
          `${SOCIAL_API}/connections/${normalizedPlatform}/rtmp`,
          data,
          {
            withCredentials: true,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to save RTMP connection."
        )
      );
    }
  };

/* =========================================================
   START YOUTUBE LIVE
========================================================= */

export const startYouTubeLiveAPI =
  async (
    payload = {},
    onWaiting
  ) => {
    try {
      const response =
        await axios.post(
          `${LIVE_API}/start-youtube`,
          payload,
          {
            withCredentials: true,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const data =
        response.data;

      if (
        typeof onWaiting ===
        "function"
      ) {
        onWaiting(
          1,
          1,
          {
            streamStatus:
              data?.streamStatus ||
              data?.status ||
              data?.data
                ?.streamStatus ||
              data?.data?.status ||
              "active",
          }
        );
      }

      return data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to start YouTube live."
        )
      );
    }
  };

/* =========================================================
   STOP YOUTUBE LIVE
========================================================= */

export const stopYouTubeLiveAPI =
  async () => {
    try {
      const response =
        await axios.post(
          `${LIVE_API}/stop-youtube`,
          {},
          {
            withCredentials: true,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(
          error,
          "Unable to stop YouTube live."
        )
      );
    }
  };