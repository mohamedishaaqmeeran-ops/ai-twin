const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

export const API_URL =
  RAW_API_URL.replace(/\/$/, "");

export const apiRequest = async (
  path,
  options = {}
) => {
  const isFormData =
    options.body instanceof FormData;

  const response = await fetch(
    `${API_URL}${path}`,
    {
      credentials: "include",

      ...options,

      headers: {
        ...(isFormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),

        ...(options.headers || {}),
      },
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );

    error.status =
      response.status;

    error.data = data;

    throw error;
  }

  return data;
};

export function toWebSocketUrl(url) {
  if (!url) return "";

  return url
    .replace(/^https:/i, "wss:")
    .replace(/^http:/i, "ws:");
}