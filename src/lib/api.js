// src/lib/api.js

const API_URL =
  import.meta.env
    .VITE_API_URL ||
  "https://twinn-backend.onrender.com";

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
      body instanceof
      FormData;

    const requestHeaders = {
      ...headers,
    };

    if (
      body &&
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
        `${API_URL}${endpoint}`,
        {
          method,

          credentials:
            "include",

          headers:
            requestHeaders,

          body:
            body
              ? isFormData
                ? body
                : JSON.stringify(
                    body
                  )
              : undefined,

          ...restOptions,
        }
      );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    const data =
      contentType.includes(
        "application/json"
      )
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const message =
        typeof data ===
        "object"
          ? data?.message ||
            data?.error
          : data;

      const error =
        new Error(
          message ||
            "Request failed."
        );

      error.status =
        response.status;

      error.data =
        data;

      throw error;
    }

    return data;
  };