/* =========================================================
   API CONFIGURATION
========================================================= */

export const API_URL =
  (
    import.meta.env.VITE_API_URL ||
    "https://twinn-backend.onrender.com/api"
  ).replace(/\/+$/, "");

/* =========================================================
   BUILD API URL
========================================================= */

export const buildApiUrl = (
  endpoint = ""
) => {
  const normalizedEndpoint =
    String(endpoint || "").startsWith("/")
      ? String(endpoint)
      : `/${String(endpoint || "")}`;

  return `${API_URL}${normalizedEndpoint}`;
};

/* =========================================================
   API REQUEST
========================================================= */

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const {
    method = "GET",
    body,
    headers = {},
    signal,
    ...remainingOptions
  } = options;

  const isFormData =
    body instanceof FormData;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (
    body !== undefined &&
    body !== null &&
    !isFormData
  ) {
    requestHeaders[
      "Content-Type"
    ] = "application/json";
  }

  const response = await fetch(
    buildApiUrl(endpoint),
    {
      method,

      /*
       Required for cookies between
       twinn.live and the backend.
      */
      credentials: "include",

      headers:
        requestHeaders,

      body:
        body === undefined ||
        body === null
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(
                body
              ),

      signal,

      ...remainingOptions,
    }
  );

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data = null;

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    data =
      await response.json();
  } else {
    const text =
      await response.text();

    data = text
      ? {
          message: text,
        }
      : null;
  }

  if (!response.ok) {
    const error =
      new Error(
        data?.message ||
          `Request failed with status ${response.status}`
      );

    error.status =
      response.status;

    error.code =
      data?.code;

    error.data =
      data;

    throw error;
  }

  return data;
};

/* =========================================================
   WEBSOCKET URL
========================================================= */

export const toWebSocketUrl = (
  value
) => {
  const url =
    String(value || "");

  if (
    url.startsWith(
      "https://"
    )
  ) {
    return url.replace(
      "https://",
      "wss://"
    );
  }

  if (
    url.startsWith(
      "http://"
    )
  ) {
    return url.replace(
      "http://",
      "ws://"
    );
  }

  return url;
};