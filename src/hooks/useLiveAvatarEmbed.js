import {
  useCallback,
  useRef,
  useState,
} from "react";

const API_BASE = String(
  import.meta.env.VITE_API_URL ||
    "https://twinn-backend.onrender.com"
).replace(/\/+$/, "");

/* =========================================================
   HELPERS
========================================================= */

const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") ||
    "";

  const data = contentType.includes(
    "application/json"
  )
    ? await response.json().catch(() => ({}))
    : {
        message: await response
          .text()
          .catch(() => ""),
      };

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `LiveAvatar request failed (${response.status}).`
    );
  }

  return data;
};

/* =========================================================
   HOOK
========================================================= */

export default function useLiveAvatarEmbed() {
  const requestControllerRef =
    useRef(null);

  const [embedUrl, setEmbedUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState("");

  const [iframeLoaded, setIframeLoaded] =
    useState(false);

  /* =======================================================
     START
  ======================================================= */

  const start = useCallback(
    async ({
      avatarId,
      contextId,
      sandbox,
    } = {}) => {
      if (
        requestControllerRef.current
      ) {
        requestControllerRef.current.abort();
      }

      const controller =
        new AbortController();

      requestControllerRef.current =
        controller;

      setLoading(true);
      setConnected(false);
      setIframeLoaded(false);
      setError("");
      setEmbedUrl("");

      try {
        const response = await fetch(
          `${API_BASE}/api/live-avatar/embeddings`,
          {
            method: "POST",

            credentials: "include",

            signal: controller.signal,

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              avatarId:
                avatarId || undefined,

              contextId:
                contextId || undefined,

              sandbox:
                typeof sandbox ===
                "boolean"
                  ? sandbox
                  : undefined,
            }),
          }
        );

        const data =
          await parseResponse(response);

        const url =
          data?.embedUrl ||
          data?.data?.embedUrl ||
          "";

        if (!url) {
          throw new Error(
            "LiveAvatar embed URL was not returned."
          );
        }

        setEmbedUrl(url);
        setConnected(true);

        return {
          embedUrl: url,
          data,
        };
      } catch (requestError) {
        if (
          requestError?.name ===
          "AbortError"
        ) {
          return null;
        }

        console.error(
          "LIVEAVATAR START ERROR:",
          requestError
        );

        setConnected(false);

        setError(
          requestError?.message ||
            "Unable to start LiveAvatar."
        );

        throw requestError;
      } finally {
        if (
          requestControllerRef.current ===
          controller
        ) {
          requestControllerRef.current =
            null;
        }

        setLoading(false);
      }
    },
    []
  );

  /* =======================================================
     IFRAME EVENTS
  ======================================================= */

  const markIframeLoaded =
    useCallback(() => {
      setIframeLoaded(true);
      setConnected(true);
      setError("");
    }, []);

  const markIframeError =
    useCallback(() => {
      setIframeLoaded(false);
      setConnected(false);

      setError(
        "The LiveAvatar iframe could not be loaded."
      );
    }, []);

  /* =======================================================
     STOP
  ======================================================= */

  const stop = useCallback(() => {
    if (
      requestControllerRef.current
    ) {
      requestControllerRef.current.abort();

      requestControllerRef.current =
        null;
    }

    /*
     * Removing the iframe closes the
     * microphone and embedded session.
     */
    setEmbedUrl("");
    setLoading(false);
    setConnected(false);
    setIframeLoaded(false);
    setError("");
  }, []);

  return {
    embedUrl,
    loading,
    connected,
    iframeLoaded,
    error,

    start,
    stop,
    markIframeLoaded,
    markIframeError,
  };
}