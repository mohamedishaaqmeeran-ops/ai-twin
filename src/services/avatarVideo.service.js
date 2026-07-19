const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

/* =========================================================
   BUILD REQUEST URL
========================================================= */

const buildUrl = (path) => {
  const normalizedBaseUrl =
    API_URL.endsWith("/")
      ? API_URL.slice(0, -1)
      : API_URL;

  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
};

/* =========================================================
   PARSE API RESPONSE
========================================================= */

const parseResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

/* =========================================================
   REQUEST OPTIONS
========================================================= */

const getRequestOptions = ({
  method = "GET",
  body,
  signal,
} = {}) => {
  const options = {
    method,
    credentials: "include",
    signal,
    headers: {
      Accept: "application/json",
    },
  };

  if (body !== undefined) {
    options.headers["Content-Type"] =
      "application/json";

    options.body =
      JSON.stringify(body);
  }

  return options;
};

/* =========================================================
   GENERATE PRODUCT AVATAR VIDEO
========================================================= */

export const generateAvatarVideo =
  async ({
    twinId,
    productId,
    signal,
  }) => {
    if (!twinId) {
      throw new Error(
        "Twin ID is required."
      );
    }

    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    const response = await fetch(
      buildUrl(
        `/api/twin/${twinId}/avatar-video`
      ),
      getRequestOptions({
        method: "POST",
        signal,
        body: {
          productId,
        },
      })
    );

    return parseResponse(response);
  };

/* =========================================================
   GET AVATAR VIDEO STATUS
========================================================= */

/* =========================================================
   GET AVATAR VIDEO STATUS
========================================================= */

export const getAvatarVideoStatus =
  async ({
    twinId,
    productId,
    signal,
  }) => {
    if (!twinId) {
      throw new Error(
        "Twin ID is required."
      );
    }

    const query = productId
      ? `?productId=${encodeURIComponent(
          productId
        )}`
      : "";

    const response = await fetch(
      buildUrl(
        `/api/twin/${twinId}/avatar-video-status${query}`
      ),
      getRequestOptions({
        method: "GET",
        signal,
      })
    );

    return parseResponse(response);
  };

/* =========================================================
   RETRY AVATAR VIDEO
========================================================= */

export const retryAvatarVideo =
  async ({
    twinId,
    productId,
    signal,
  }) => {
    if (!twinId) {
      throw new Error(
        "Twin ID is required."
      );
    }

    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    const response = await fetch(
      buildUrl(
        `/api/twin/${twinId}/avatar-video/retry`
      ),
      getRequestOptions({
        method: "POST",
        signal,
        body: {
          productId,
        },
      })
    );

    return parseResponse(response);
  };

/* =========================================================
   NORMALIZE VIDEO STATUS RESPONSE
========================================================= */

/* =========================================================
   NORMALIZE VIDEO STATUS RESPONSE
========================================================= */

export const normalizeAvatarVideoStatus = (
  response = {}
) => {
  const video =
    response?.avatarVideo ||
    response?.data?.avatarVideo ||
    response?.twin ||
    response?.data?.twin ||
    response?.data ||
    response;

  return {
    id:
      video?._id ||
      video?.id ||
      null,

    twinId:
      video?.twinId ||
      video?.avatarVideoTwinId ||
      null,

    status:
      video?.status ||
      video?.avatarVideoStatus ||
      "idle",

    videoUrl:
      video?.videoUrl ||
      video?.avatarVideoUrl ||
      "",

    posterUrl:
      video?.posterUrl ||
      video?.avatarVideoPosterUrl ||
      "",

    speech:
      video?.speech ||
      video?.avatarVideoSpeech ||
      "",

    prompt:
      video?.prompt ||
      "",

    productId:
      video?.productId ||
      video?.avatarVideoProductId ||
      null,

    productName:
      video?.productName ||
      video?.avatarVideoProductName ||
      "",

    twinName:
      video?.twinName ||
      video?.name ||
      "",

    progress:
      Number(
        video?.progress ?? 0
      ),

    currentStep:
      Number(
        video?.currentStep ?? 0
      ),

    error:
      video?.error ||
      video?.avatarVideoError ||
      "",

    createdAt:
      video?.createdAt ||
      video?.avatarVideoCreatedAt ||
      null,

    updatedAt:
      video?.updatedAt ||
      video?.avatarVideoUpdatedAt ||
      null,

    completedAt:
      video?.completedAt ||
      null,

    raw: response,
  };
};

/* =========================================================
   STATUS HELPERS
========================================================= */

export const isAvatarVideoProcessing =
  (status) => {
    return [
      "queued",
      "pending",
      "processing",
      "generating",
      "rendering",
      "uploading",
    ].includes(
      String(status || "")
        .trim()
        .toLowerCase()
    );
  };

export const isAvatarVideoCompleted =
  (status) => {
    return [
      "completed",
      "complete",
      "ready",
      "success",
      "succeeded",
    ].includes(
      String(status || "")
        .trim()
        .toLowerCase()
    );
  };

export const isAvatarVideoFailed =
  (status) => {
    return [
      "failed",
      "error",
      "cancelled",
      "canceled",
    ].includes(
      String(status || "")
        .trim()
        .toLowerCase()
    );
  };

/* =========================================================
   SERVICE EXPORT
========================================================= */

const avatarVideoService = {
  generateAvatarVideo,
  getAvatarVideoStatus,
  retryAvatarVideo,
  normalizeAvatarVideoStatus,
  isAvatarVideoProcessing,
  isAvatarVideoCompleted,
  isAvatarVideoFailed,
};

export default avatarVideoService;