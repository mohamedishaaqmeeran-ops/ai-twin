// src/lib/api.js

export const API_URL =
  String(
    import.meta.env.VITE_API_URL ||
      "https://twinn-backend.onrender.com"
  ).replace(/\/+$/, "");

/* =========================================================
   CONVERT HTTP URL TO WEBSOCKET URL
========================================================= */

export const toWebSocketUrl = (
  value
) => {
  if (!value) {
    return "";
  }

  const url =
    String(value).trim();

  if (
    url.startsWith("ws://") ||
    url.startsWith("wss://")
  ) {
    return url;
  }

  if (
    url.startsWith("https://")
  ) {
    return url.replace(
      /^https:\/\//,
      "wss://"
    );
  }

  if (
    url.startsWith("http://")
  ) {
    return url.replace(
      /^http:\/\//,
      "ws://"
    );
  }

  return url;
};

/* =========================================================
   BUILD API ENDPOINT
========================================================= */

const buildApiUrl = (
  endpoint = ""
) => {
  const normalizedEndpoint =
    String(endpoint || "");

  if (
    normalizedEndpoint.startsWith(
      "http://"
    ) ||
    normalizedEndpoint.startsWith(
      "https://"
    )
  ) {
    return normalizedEndpoint;
  }

  return `${API_URL}${
    normalizedEndpoint.startsWith("/")
      ? normalizedEndpoint
      : `/${normalizedEndpoint}`
  }`;
};

/* =========================================================
   API REQUEST
========================================================= */

export const apiRequest =
  async (
    endpoint,
    options = {}
  ) => {
    const {
      method = "GET",
      body,
      headers = {},
      ...restOptions
    } = options;

    const isFormData =
      typeof FormData !==
        "undefined" &&
      body instanceof FormData;

    const requestHeaders = {
      ...headers,
    };

    if (
      body !== undefined &&
      body !== null &&
      !isFormData
    ) {
      requestHeaders[
        "Content-Type"
      ] =
        requestHeaders[
          "Content-Type"
        ] ||
        "application/json";
    }

    const response =
      await fetch(
        buildApiUrl(endpoint),
        {
          method,

          credentials:
            "include",

          headers:
            requestHeaders,

          body:
            body === undefined ||
            body === null
              ? undefined
              : isFormData
                ? body
                : typeof body ===
                    "string"
                  ? body
                  : JSON.stringify(
                      body
                    ),

          ...restOptions,
        }
      );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    let data;

    if (
      response.status === 204
    ) {
      data = null;
    } else if (
      contentType.includes(
        "application/json"
      )
    ) {
      data =
        await response.json();
    } else {
      data =
        await response.text();
    }

    if (!response.ok) {
      const message =
        data &&
        typeof data ===
          "object"
          ? data.message ||
            data.error
          : data;

      const error =
        new Error(
          message ||
            `Request failed with status ${response.status}.`
        );

      error.status =
        response.status;

      error.data =
        data;

      throw error;
    }

    return data;
  };