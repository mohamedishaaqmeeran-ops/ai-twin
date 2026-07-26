import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com/api";

const socialAxios = axios.create({
  baseURL: `${API}/social`,
  withCredentials: true,
});

/* =========================================================
   START OAUTH CONNECTION
========================================================= */

export const connectAPI = (
  platform
) => {
  window.location.href =
    `${API}/social/connect/${platform}`;
};

/* =========================================================
   FETCH CONNECTIONS
========================================================= */

export const getConnectionsAPI =
  async () => {
    const response =
      await socialAxios.get(
        "/connections"
      );

    return (
      response.data?.data || []
    );
  };

/* =========================================================
   SAVE MANUAL RTMP CONNECTION
========================================================= */

export const saveRTMPConnectionAPI =
  async (
    platform,
    payload
  ) => {
    const response =
      await socialAxios.patch(
        `/connections/${platform}/rtmp`,
        payload
      );

    return response.data;
  };

/* =========================================================
   DISCONNECT PLATFORM
========================================================= */

export const disconnectSocialAPI =
  async (
    platform
  ) => {
    const response =
      await socialAxios.delete(
        `/connections/${platform}`
      );

    return response.data;
  };