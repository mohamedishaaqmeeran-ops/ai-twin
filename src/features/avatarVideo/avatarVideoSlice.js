import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  generateAvatarVideo as generateAvatarVideoRequest,
  getAvatarVideoStatus,
  retryAvatarVideo as retryAvatarVideoRequest,
  normalizeAvatarVideoStatus,
  isAvatarVideoProcessing,
  isAvatarVideoCompleted,
  isAvatarVideoFailed,
} from "../../services/avatarVideo.service";

/* =========================================================
   POLLING CONFIGURATION
========================================================= */

const DEFAULT_POLL_INTERVAL = 5000;

const DEFAULT_MAX_POLL_ATTEMPTS = 60;

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  /* Selected generation context */

  twinId: null,

  productId: null,

  twinName: "",

  productName: "",

  posterUrl: "",

  /* Video generation result */

  status: "idle",

  videoUrl: "",

  speech: "",

  generationError: "",

  createdAt: null,

  updatedAt: null,

  /* Async request states */

  generating: false,

  polling: false,

  retrying: false,

  loadingStatus: false,

  /* Polling information */

  pollAttempts: 0,

  maxPollAttempts:
    DEFAULT_MAX_POLL_ATTEMPTS,

  pollInterval:
    DEFAULT_POLL_INTERVAL,

  pollingStopped: false,

  /* UI progress */

  progress: 0,

  currentStep: 0,

  progressMessage:
    "Select an AI Twin and product to begin.",

  /* Request tracking */

  activeRequestId: null,

  lastRequestType: null,

  /* General errors */

  error: null,

  /* Complete backend response */

  rawResponse: null,
};

/* =========================================================
   ERROR NORMALIZER
========================================================= */

const getErrorMessage = (
  error,
  fallbackMessage
) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
};

/* =========================================================
   ABORT ERROR CHECK
========================================================= */

const isAbortError = (error) => {
  return (
    error?.name === "AbortError" ||
    error?.code === "ABORT_ERR"
  );
};

/* =========================================================
   WAIT HELPER
========================================================= */

const wait = (
  duration,
  signal
) => {
  return new Promise(
    (resolve, reject) => {
      const timeoutId =
        window.setTimeout(
          resolve,
          duration
        );

      if (!signal) {
        return;
      }

      const handleAbort = () => {
        window.clearTimeout(
          timeoutId
        );

        const abortError =
          new Error(
            "Polling was cancelled."
          );

        abortError.name =
          "AbortError";

        reject(abortError);
      };

      if (signal.aborted) {
        handleAbort();
        return;
      }

      signal.addEventListener(
        "abort",
        handleAbort,
        {
          once: true,
        }
      );
    }
  );
};

/* =========================================================
   GENERATION PROGRESS CALCULATOR
========================================================= */

const getProgressData = (
  status,
  pollAttempts = 0
) => {
  const normalizedStatus =
    String(status || "")
      .trim()
      .toLowerCase();

  switch (normalizedStatus) {
    case "idle":
      return {
        progress: 0,
        currentStep: 0,
        message:
          "Select an AI Twin and product to begin.",
      };

    case "queued":
    case "pending":
      return {
        progress: 12,
        currentStep: 1,
        message:
          "Preparing your AI Twin...",
      };

    case "processing":
      return {
        progress: Math.min(
          25 + pollAttempts * 2,
          55
        ),
        currentStep: 2,
        message:
          "Understanding the selected product...",
      };

    case "generating":
      return {
        progress: Math.min(
          45 + pollAttempts * 2,
          70
        ),
        currentStep: 3,
        message:
          "Generating product speech...",
      };

    case "rendering":
      return {
        progress: Math.min(
          65 + pollAttempts,
          88
        ),
        currentStep: 4,
        message:
          "Rendering your AI avatar video...",
      };

    case "uploading":
      return {
        progress: 94,
        currentStep: 5,
        message:
          "Uploading and finalizing the video...",
      };

    case "completed":
    case "complete":
    case "ready":
    case "success":
    case "succeeded":
      return {
        progress: 100,
        currentStep: 5,
        message:
          "Your AI avatar video is ready.",
      };

    case "failed":
    case "error":
    case "cancelled":
    case "canceled":
      return {
        progress: 0,
        currentStep: 0,
        message:
          "Video generation failed.",
      };

    default:
      return {
        progress: Math.min(
          15 + pollAttempts * 2,
          90
        ),
        currentStep: 1,
        message:
          "Generating your AI avatar video...",
      };
  }
};

/* =========================================================
   GENERATE AVATAR VIDEO
========================================================= */

export const generateAvatarVideo =
  createAsyncThunk(
    "avatarVideo/generateAvatarVideo",

    async (
      {
        twinId,
        productId,
        twinName = "",
        productName = "",
        posterUrl = "",
      },
      {
        rejectWithValue,
        signal,
      }
    ) => {
      try {
        if (!twinId) {
          return rejectWithValue(
            "Please select an AI Twin."
          );
        }

        if (!productId) {
          return rejectWithValue(
            "Please select a product."
          );
        }

        const response =
          await generateAvatarVideoRequest({
            twinId,
            productId,
            signal,
          });

        const normalized =
          normalizeAvatarVideoStatus(
            response
          );

        return {
          ...normalized,

          twinId,

          productId:
            normalized.productId ||
            productId,

          twinName,

          productName:
            normalized.productName ||
            productName,

          posterUrl,

          rawResponse: response,
        };
      } catch (error) {
        if (isAbortError(error)) {
          return rejectWithValue(
            "Video generation request was cancelled."
          );
        }

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to start avatar video generation."
          )
        );
      }
    }
  );

/* =========================================================
   GET SINGLE STATUS UPDATE
========================================================= */

export const fetchAvatarVideoStatus =
  createAsyncThunk(
    "avatarVideo/fetchAvatarVideoStatus",

    async (
      {
        twinId,
        productId,
      },
      {
        rejectWithValue,
        signal,
      }
    ) => {
      try {
        if (!twinId) {
          return rejectWithValue(
            "Twin ID is required to check video status."
          );
        }

        const response =
          await getAvatarVideoStatus({
            twinId,
            productId,
            signal,
          });

        const normalized =
          normalizeAvatarVideoStatus(
            response
          );

        return {
          ...normalized,

          twinId:
            normalized.twinId ||
            twinId,

          productId:
            normalized.productId ||
            productId ||
            null,

          rawResponse: response,
        };
      } catch (error) {
        if (isAbortError(error)) {
          return rejectWithValue(
            "Status request was cancelled."
          );
        }

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch avatar video status."
          )
        );
      }
    }
  );

/* =========================================================
   POLL AVATAR VIDEO STATUS
========================================================= */

export const pollAvatarVideoStatus =
  createAsyncThunk(
    "avatarVideo/pollAvatarVideoStatus",

    async (
      {
        twinId,
        productId,
        pollInterval =
          DEFAULT_POLL_INTERVAL,
        maxAttempts =
          DEFAULT_MAX_POLL_ATTEMPTS,
      },
      {
        rejectWithValue,
        signal,
        dispatch,
      }
    ) => {
      try {
        if (!twinId) {
          return rejectWithValue(
            "Twin ID is required to poll video status."
          );
        }

        let latestStatus = null;

        for (
          let attempt = 1;
          attempt <= maxAttempts;
          attempt += 1
        ) {
          if (signal.aborted) {
            const abortError =
              new Error(
                "Polling was cancelled."
              );

            abortError.name =
              "AbortError";

            throw abortError;
          }

          dispatch(
            avatarVideoSlice.actions
              .setPollAttempt(
                attempt
              )
          );

          const response =
            await getAvatarVideoStatus({
              twinId,
              productId,
              signal,
            });

          latestStatus =
            normalizeAvatarVideoStatus(
              response
            );

          dispatch(
            avatarVideoSlice.actions
              .applyPollingUpdate({
                ...latestStatus,

                twinId:
                  latestStatus.twinId ||
                  twinId,

                productId:
                  latestStatus.productId ||
                  productId ||
                  null,

                rawResponse:
                  response,
              })
          );

          if (
            isAvatarVideoCompleted(
              latestStatus.status
            )
          ) {
            return {
              ...latestStatus,

              twinId:
                latestStatus.twinId ||
                twinId,

              productId:
                latestStatus.productId ||
                productId ||
                null,

              pollAttempts:
                attempt,

              rawResponse:
                response,
            };
          }

          if (
            isAvatarVideoFailed(
              latestStatus.status
            )
          ) {
            return rejectWithValue({
              message:
                latestStatus.error ||
                "Avatar video generation failed.",

              status:
                latestStatus.status,

              pollAttempts:
                attempt,

              rawResponse:
                response,
            });
          }

          if (
            !isAvatarVideoProcessing(
              latestStatus.status
            )
          ) {
            return {
              ...latestStatus,

              twinId:
                latestStatus.twinId ||
                twinId,

              productId:
                latestStatus.productId ||
                productId ||
                null,

              pollAttempts:
                attempt,

              rawResponse:
                response,
            };
          }

          if (
            attempt < maxAttempts
          ) {
            await wait(
              pollInterval,
              signal
            );
          }
        }

        return rejectWithValue({
          message:
            "Video generation is taking longer than expected. Please check again shortly.",

          status:
            latestStatus?.status ||
            "processing",

          pollAttempts:
            maxAttempts,

          rawResponse:
            latestStatus?.raw ||
            null,
        });
      } catch (error) {
        if (isAbortError(error)) {
          return rejectWithValue({
            message:
              "Avatar video polling was cancelled.",

            cancelled: true,
          });
        }

        return rejectWithValue({
          message:
            getErrorMessage(
              error,
              "Unable to monitor avatar video generation."
            ),

          cancelled: false,
        });
      }
    }
  );

/* =========================================================
   RETRY AVATAR VIDEO GENERATION
========================================================= */

export const retryAvatarVideo =
  createAsyncThunk(
    "avatarVideo/retryAvatarVideo",

    async (
      {
        twinId,
        productId,
        twinName = "",
        productName = "",
        posterUrl = "",
      },
      {
        rejectWithValue,
        signal,
      }
    ) => {
      try {
        if (!twinId) {
          return rejectWithValue(
            "Twin ID is required."
          );
        }

        if (!productId) {
          return rejectWithValue(
            "Product ID is required."
          );
        }

        const response =
          await retryAvatarVideoRequest({
            twinId,
            productId,
            signal,
          });

        const normalized =
          normalizeAvatarVideoStatus(
            response
          );

        return {
          ...normalized,

          twinId,

          productId:
            normalized.productId ||
            productId,

          twinName,

          productName:
            normalized.productName ||
            productName,

          posterUrl,

          rawResponse: response,
        };
      } catch (error) {
        if (isAbortError(error)) {
          return rejectWithValue(
            "Retry request was cancelled."
          );
        }

        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to retry avatar video generation."
          )
        );
      }
    }
  );


  /* =========================================================
   AVATAR VIDEO SLICE
========================================================= */

const avatarVideoSlice = createSlice({
  name: "avatarVideo",

  initialState,

  reducers: {
    /* =====================================================
       SELECT TWIN
    ====================================================== */

    setSelectedTwin: (
      state,
      action
    ) => {
      const twin =
        action.payload || {};

      state.twinId =
        twin._id ||
        twin.id ||
        twin.twinId ||
        null;

      state.twinName =
        twin.name ||
        twin.twinName ||
        twin.twin_name ||
        "";

      state.posterUrl =
        twin.image ||
        twin.avatarUrl ||
        twin.avatar ||
        twin.appearance?.avatarUrl ||
        "";

      state.error = null;
      state.generationError = "";
    },

    /* =====================================================
       SELECT PRODUCT
    ====================================================== */

    setSelectedProduct: (
      state,
      action
    ) => {
      const product =
        action.payload || {};

      state.productId =
        product._id ||
        product.id ||
        product.productId ||
        null;

      state.productName =
        product.name ||
        product.productName ||
        product.title ||
        "";

      state.error = null;
      state.generationError = "";
    },

    /* =====================================================
       SET GENERATION CONTEXT
    ====================================================== */

    setAvatarVideoContext: (
      state,
      action
    ) => {
      const {
        twinId = null,
        productId = null,
        twinName = "",
        productName = "",
        posterUrl = "",
      } = action.payload || {};

      state.twinId = twinId;
      state.productId = productId;
      state.twinName = twinName;
      state.productName = productName;
      state.posterUrl = posterUrl;

      state.error = null;
      state.generationError = "";
    },

    /* =====================================================
       CLEAR SELECTED PRODUCT
    ====================================================== */

    clearSelectedProduct: (
      state
    ) => {
      state.productId = null;
      state.productName = "";

      state.status = "idle";
      state.videoUrl = "";
      state.speech = "";
      state.generationError = "";

      state.progress = 0;
      state.currentStep = 0;
      state.progressMessage =
        "Select a product to generate an AI video.";

      state.pollAttempts = 0;
      state.pollingStopped = false;

      state.rawResponse = null;
      state.error = null;
    },

    /* =====================================================
       CLEAR SELECTED TWIN
    ====================================================== */

    clearSelectedTwin: (
      state
    ) => {
      state.twinId = null;
      state.twinName = "";
      state.posterUrl = "";

      state.productId = null;
      state.productName = "";

      state.status = "idle";
      state.videoUrl = "";
      state.speech = "";
      state.generationError = "";

      state.progress = 0;
      state.currentStep = 0;
      state.progressMessage =
        "Select an AI Twin and product to begin.";

      state.pollAttempts = 0;
      state.pollingStopped = false;

      state.rawResponse = null;
      state.error = null;
    },

    /* =====================================================
       SET POLLING CONFIGURATION
    ====================================================== */

    setPollingConfiguration: (
      state,
      action
    ) => {
      const {
        pollInterval,
        maxPollAttempts,
      } = action.payload || {};

      if (
        Number.isFinite(
          pollInterval
        ) &&
        pollInterval >= 1000
      ) {
        state.pollInterval =
          pollInterval;
      }

      if (
        Number.isInteger(
          maxPollAttempts
        ) &&
        maxPollAttempts > 0
      ) {
        state.maxPollAttempts =
          maxPollAttempts;
      }
    },

    /* =====================================================
       SET POLL ATTEMPT
    ====================================================== */

    setPollAttempt: (
      state,
      action
    ) => {
      const attempt =
        Number(action.payload) || 0;

      state.pollAttempts =
        attempt;

      const progressData =
        getProgressData(
          state.status,
          attempt
        );

      state.progress =
        progressData.progress;

      state.currentStep =
        progressData.currentStep;

      state.progressMessage =
        progressData.message;
    },

    /* =====================================================
       APPLY POLLING UPDATE
    ====================================================== */

    applyPollingUpdate: (
      state,
      action
    ) => {
      const payload =
        action.payload || {};

      const nextStatus =
        payload.status ||
        state.status ||
        "processing";

      state.status =
        nextStatus;

      state.videoUrl =
        payload.videoUrl ||
        state.videoUrl;

      state.speech =
        payload.speech ||
        state.speech;

      state.productId =
        payload.productId ||
        state.productId;

      state.productName =
        payload.productName ||
        state.productName;

      state.generationError =
        payload.error || "";

      state.createdAt =
        payload.createdAt ||
        state.createdAt;

      state.updatedAt =
        payload.updatedAt ||
        state.updatedAt;

      state.rawResponse =
        payload.rawResponse ||
        payload.raw ||
        state.rawResponse;

      const progressData =
        getProgressData(
          nextStatus,
          state.pollAttempts
        );

      state.progress =
        progressData.progress;

      state.currentStep =
        progressData.currentStep;

      state.progressMessage =
        progressData.message;

      if (
        isAvatarVideoCompleted(
          nextStatus
        )
      ) {
        state.polling = false;
        state.pollingStopped = true;
        state.progress = 100;
        state.currentStep = 5;
      }

      if (
        isAvatarVideoFailed(
          nextStatus
        )
      ) {
        state.polling = false;
        state.pollingStopped = true;

        state.error =
          payload.error ||
          "Avatar video generation failed.";
      }
    },

    /* =====================================================
       SET VIDEO RESULT MANUALLY
    ====================================================== */

    setGeneratedAvatarVideo: (
      state,
      action
    ) => {
      const payload =
        action.payload || {};

      state.status =
        payload.status ||
        "completed";

      state.videoUrl =
        payload.videoUrl || "";

      state.speech =
        payload.speech || "";

      state.productId =
        payload.productId ||
        state.productId;

      state.productName =
        payload.productName ||
        state.productName;

      state.createdAt =
        payload.createdAt ||
        state.createdAt;

      state.updatedAt =
        payload.updatedAt ||
        state.updatedAt;

      state.generationError = "";
      state.error = null;

      state.generating = false;
      state.polling = false;
      state.retrying = false;
      state.loadingStatus = false;

      state.progress = 100;
      state.currentStep = 5;
      state.progressMessage =
        "Your AI avatar video is ready.";

      state.pollingStopped = true;

      state.rawResponse =
        payload.rawResponse ||
        payload.raw ||
        state.rawResponse;
    },

    /* =====================================================
       SET ERROR
    ====================================================== */

    setAvatarVideoError: (
      state,
      action
    ) => {
      const message =
        typeof action.payload ===
        "string"
          ? action.payload
          : action.payload?.message ||
            "An unexpected error occurred.";

      state.error = message;
      state.generationError =
        message;

      state.generating = false;
      state.polling = false;
      state.retrying = false;
      state.loadingStatus = false;

      state.pollingStopped = true;

      state.progress = 0;
      state.currentStep = 0;
      state.progressMessage =
        "Video generation failed.";
    },

    /* =====================================================
       CLEAR ERROR
    ====================================================== */

    clearAvatarVideoError: (
      state
    ) => {
      state.error = null;
      state.generationError = "";
    },

    /* =====================================================
       STOP POLLING
    ====================================================== */

    stopAvatarVideoPolling: (
      state
    ) => {
      state.polling = false;
      state.pollingStopped = true;

      if (
        isAvatarVideoProcessing(
          state.status
        )
      ) {
        state.progressMessage =
          "Video status monitoring stopped.";
      }
    },

    /* =====================================================
       RESUME POLLING STATE
    ====================================================== */

    resumeAvatarVideoPolling: (
      state
    ) => {
      state.pollingStopped = false;
      state.error = null;

      if (
        isAvatarVideoProcessing(
          state.status
        )
      ) {
        state.progressMessage =
          "Monitoring avatar video generation...";
      }
    },

    /* =====================================================
       RESET RESULT ONLY
    ====================================================== */

    resetAvatarVideoResult: (
      state
    ) => {
      state.status = "idle";

      state.videoUrl = "";
      state.speech = "";
      state.generationError = "";

      state.createdAt = null;
      state.updatedAt = null;

      state.generating = false;
      state.polling = false;
      state.retrying = false;
      state.loadingStatus = false;

      state.pollAttempts = 0;
      state.pollingStopped = false;

      state.progress = 0;
      state.currentStep = 0;
      state.progressMessage =
        state.twinId &&
        state.productId
          ? "Ready to generate your AI avatar video."
          : "Select an AI Twin and product to begin.";

      state.activeRequestId = null;
      state.lastRequestType = null;

      state.error = null;
      state.rawResponse = null;
    },

    /* =====================================================
       RESET COMPLETE STATE
    ====================================================== */

    resetAvatarVideoState:
      () => {
        return {
          ...initialState,
        };
      },
  },

  /* =======================================================
     ASYNC THUNK REDUCERS
  ======================================================== */

  extraReducers: (
    builder
  ) => {
    builder

      /* ===================================================
         GENERATE VIDEO — PENDING
      ==================================================== */

      .addCase(
        generateAvatarVideo.pending,
        (
          state,
          action
        ) => {
          const {
            twinId,
            productId,
            twinName = "",
            productName = "",
            posterUrl = "",
          } =
            action.meta.arg || {};

          state.twinId =
            twinId ||
            state.twinId;

          state.productId =
            productId ||
            state.productId;

          state.twinName =
            twinName ||
            state.twinName;

          state.productName =
            productName ||
            state.productName;

          state.posterUrl =
            posterUrl ||
            state.posterUrl;

          state.status = "queued";

          state.videoUrl = "";
          state.speech = "";
          state.generationError = "";

          state.generating = true;
          state.polling = false;
          state.retrying = false;
          state.loadingStatus = false;

          state.pollAttempts = 0;
          state.pollingStopped = false;

          state.progress = 8;
          state.currentStep = 1;
          state.progressMessage =
            "Starting avatar video generation...";

          state.activeRequestId =
            action.meta.requestId;

          state.lastRequestType =
            "generate";

          state.error = null;
          state.rawResponse = null;
        }
      )

      /* ===================================================
         GENERATE VIDEO — FULFILLED
      ==================================================== */

      .addCase(
        generateAvatarVideo.fulfilled,
        (
          state,
          action
        ) => {
          const payload =
            action.payload || {};

          state.twinId =
            payload.twinId ||
            state.twinId;

          state.productId =
            payload.productId ||
            state.productId;

          state.twinName =
            payload.twinName ||
            state.twinName;

          state.productName =
            payload.productName ||
            state.productName;

          state.posterUrl =
            payload.posterUrl ||
            state.posterUrl;

          state.status =
            payload.status ||
            "processing";

          state.videoUrl =
            payload.videoUrl || "";

          state.speech =
            payload.speech || "";

          state.generationError =
            payload.error || "";

          state.createdAt =
            payload.createdAt ||
            state.createdAt;

          state.updatedAt =
            payload.updatedAt ||
            state.updatedAt;

          state.generating = false;
          state.error = null;

          state.rawResponse =
            payload.rawResponse ||
            payload.raw ||
            null;

          state.activeRequestId = null;

          const progressData =
            getProgressData(
              state.status,
              state.pollAttempts
            );

          state.progress =
            progressData.progress;

          state.currentStep =
            progressData.currentStep;

          state.progressMessage =
            progressData.message;

          if (
            isAvatarVideoCompleted(
              state.status
            )
          ) {
            state.progress = 100;
            state.currentStep = 5;
            state.pollingStopped = true;
          } else if (
            isAvatarVideoFailed(
              state.status
            )
          ) {
            state.pollingStopped = true;

            state.error =
              payload.error ||
              "Avatar video generation failed.";
          }
        }
      )

      /* ===================================================
         GENERATE VIDEO — REJECTED
      ==================================================== */

      .addCase(
        generateAvatarVideo.rejected,
        (
          state,
          action
        ) => {
          const message =
            typeof action.payload ===
            "string"
              ? action.payload
              : action.payload?.message ||
                action.error?.message ||
                "Unable to start avatar video generation.";

          state.status = "failed";

          state.generating = false;
          state.polling = false;
          state.retrying = false;

          state.generationError =
            message;

          state.error = message;

          state.progress = 0;
          state.currentStep = 0;
          state.progressMessage =
            "Unable to start video generation.";

          state.pollingStopped = true;
          state.activeRequestId = null;
        }
      )

      /* ===================================================
         FETCH STATUS — PENDING
      ==================================================== */

      .addCase(
        fetchAvatarVideoStatus.pending,
        (
          state,
          action
        ) => {
          state.loadingStatus = true;
          state.lastRequestType =
            "status";

          state.activeRequestId =
            action.meta.requestId;

          state.error = null;
        }
      )

      /* ===================================================
         FETCH STATUS — FULFILLED
      ==================================================== */

      .addCase(
        fetchAvatarVideoStatus.fulfilled,
        (
          state,
          action
        ) => {
          const payload =
            action.payload || {};

          state.loadingStatus = false;

          state.status =
            payload.status ||
            state.status;

          state.videoUrl =
            payload.videoUrl ||
            state.videoUrl;

          state.speech =
            payload.speech ||
            state.speech;

          state.productId =
            payload.productId ||
            state.productId;

          state.productName =
            payload.productName ||
            state.productName;

          state.generationError =
            payload.error || "";

          state.createdAt =
            payload.createdAt ||
            state.createdAt;

          state.updatedAt =
            payload.updatedAt ||
            state.updatedAt;

          state.rawResponse =
            payload.rawResponse ||
            payload.raw ||
            state.rawResponse;

          state.error = null;
          state.activeRequestId = null;

          const progressData =
            getProgressData(
              state.status,
              state.pollAttempts
            );

          state.progress =
            progressData.progress;

          state.currentStep =
            progressData.currentStep;

          state.progressMessage =
            progressData.message;

          if (
            isAvatarVideoCompleted(
              state.status
            )
          ) {
            state.progress = 100;
            state.currentStep = 5;
            state.pollingStopped = true;
          }

          if (
            isAvatarVideoFailed(
              state.status
            )
          ) {
            state.pollingStopped = true;

            state.error =
              payload.error ||
              "Avatar video generation failed.";
          }
        }
      )

      /* ===================================================
         FETCH STATUS — REJECTED
      ==================================================== */

      .addCase(
        fetchAvatarVideoStatus.rejected,
        (
          state,
          action
        ) => {
          const message =
            typeof action.payload ===
            "string"
              ? action.payload
              : action.payload?.message ||
                action.error?.message ||
                "Unable to fetch avatar video status.";

          state.loadingStatus = false;
          state.error = message;
          state.activeRequestId = null;
        }
      )

      /* ===================================================
         POLL STATUS — PENDING
      ==================================================== */

      .addCase(
        pollAvatarVideoStatus.pending,
        (
          state,
          action
        ) => {
          const {
            pollInterval,
            maxAttempts,
          } =
            action.meta.arg || {};

          state.polling = true;
          state.pollingStopped = false;

          state.lastRequestType =
            "poll";

          state.activeRequestId =
            action.meta.requestId;

          state.error = null;

          if (
            Number.isFinite(
              pollInterval
            )
          ) {
            state.pollInterval =
              pollInterval;
          }

          if (
            Number.isInteger(
              maxAttempts
            )
          ) {
            state.maxPollAttempts =
              maxAttempts;
          }

          state.progressMessage =
            "Monitoring avatar video generation...";
        }
      )

      /* ===================================================
         POLL STATUS — FULFILLED
      ==================================================== */

      .addCase(
        pollAvatarVideoStatus.fulfilled,
        (
          state,
          action
        ) => {
          const payload =
            action.payload || {};

          state.polling = false;
          state.pollingStopped = true;

          state.status =
            payload.status ||
            state.status;

          state.videoUrl =
            payload.videoUrl ||
            state.videoUrl;

          state.speech =
            payload.speech ||
            state.speech;

          state.productId =
            payload.productId ||
            state.productId;

          state.productName =
            payload.productName ||
            state.productName;

          state.createdAt =
            payload.createdAt ||
            state.createdAt;

          state.updatedAt =
            payload.updatedAt ||
            state.updatedAt;

          state.pollAttempts =
            payload.pollAttempts ||
            state.pollAttempts;

          state.generationError =
            payload.error || "";

          state.rawResponse =
            payload.rawResponse ||
            payload.raw ||
            state.rawResponse;

          state.activeRequestId = null;
          state.error = null;

          const progressData =
            getProgressData(
              state.status,
              state.pollAttempts
            );

          state.progress =
            progressData.progress;

          state.currentStep =
            progressData.currentStep;

          state.progressMessage =
            progressData.message;

          if (
            isAvatarVideoCompleted(
              state.status
            )
          ) {
            state.progress = 100;
            state.currentStep = 5;
            state.progressMessage =
              "Your AI avatar video is ready.";
          }
        }
      )

      /* ===================================================
         POLL STATUS — REJECTED
      ==================================================== */

      .addCase(
        pollAvatarVideoStatus.rejected,
        (
          state,
          action
        ) => {
          const payload =
            action.payload || {};

          const message =
            typeof payload ===
            "string"
              ? payload
              : payload.message ||
                action.error?.message ||
                "Unable to monitor avatar video generation.";

          state.polling = false;
          state.pollingStopped = true;

          state.activeRequestId = null;

          if (payload.cancelled) {
            state.error = null;

            state.progressMessage =
              "Video status monitoring was cancelled.";

            return;
          }

          state.status =
            payload.status ||
            state.status ||
            "failed";

          state.pollAttempts =
            payload.pollAttempts ||
            state.pollAttempts;

          state.error = message;
          state.generationError =
            message;

          if (
            isAvatarVideoFailed(
              state.status
            )
          ) {
            state.progress = 0;
            state.currentStep = 0;
            state.progressMessage =
              "Video generation failed.";
          } else {
            state.progressMessage =
              "Video generation is taking longer than expected.";
          }

          state.rawResponse =
            payload.rawResponse ||
            state.rawResponse;
        }
      )

      /* ===================================================
         RETRY VIDEO — PENDING
      ==================================================== */

      .addCase(
        retryAvatarVideo.pending,
        (
          state,
          action
        ) => {
          const {
            twinId,
            productId,
            twinName = "",
            productName = "",
            posterUrl = "",
          } =
            action.meta.arg || {};

          state.twinId =
            twinId ||
            state.twinId;

          state.productId =
            productId ||
            state.productId;

          state.twinName =
            twinName ||
            state.twinName;

          state.productName =
            productName ||
            state.productName;

          state.posterUrl =
            posterUrl ||
            state.posterUrl;

          state.status = "queued";

          state.videoUrl = "";
          state.speech = "";
          state.generationError = "";

          state.generating = false;
          state.polling = false;
          state.retrying = true;
          state.loadingStatus = false;

          state.pollAttempts = 0;
          state.pollingStopped = false;

          state.progress = 8;
          state.currentStep = 1;
          state.progressMessage =
            "Restarting avatar video generation...";

          state.activeRequestId =
            action.meta.requestId;

          state.lastRequestType =
            "retry";

          state.error = null;
        }
      )

      /* ===================================================
         RETRY VIDEO — FULFILLED
      ==================================================== */

      .addCase(
        retryAvatarVideo.fulfilled,
        (
          state,
          action
        ) => {
          const payload =
            action.payload || {};

          state.retrying = false;

          state.status =
            payload.status ||
            "processing";

          state.videoUrl =
            payload.videoUrl || "";

          state.speech =
            payload.speech || "";

          state.productId =
            payload.productId ||
            state.productId;

          state.productName =
            payload.productName ||
            state.productName;

          state.twinName =
            payload.twinName ||
            state.twinName;

          state.posterUrl =
            payload.posterUrl ||
            state.posterUrl;

          state.generationError =
            payload.error || "";

          state.createdAt =
            payload.createdAt ||
            state.createdAt;

          state.updatedAt =
            payload.updatedAt ||
            state.updatedAt;

          state.rawResponse =
            payload.rawResponse ||
            payload.raw ||
            null;

          state.error = null;
          state.activeRequestId = null;

          const progressData =
            getProgressData(
              state.status,
              state.pollAttempts
            );

          state.progress =
            progressData.progress;

          state.currentStep =
            progressData.currentStep;

          state.progressMessage =
            progressData.message;

          if (
            isAvatarVideoCompleted(
              state.status
            )
          ) {
            state.progress = 100;
            state.currentStep = 5;
            state.pollingStopped = true;
          }
        }
      )

      /* ===================================================
         RETRY VIDEO — REJECTED
      ==================================================== */

      .addCase(
        retryAvatarVideo.rejected,
        (
          state,
          action
        ) => {
          const message =
            typeof action.payload ===
            "string"
              ? action.payload
              : action.payload?.message ||
                action.error?.message ||
                "Unable to retry avatar video generation.";

          state.status = "failed";

          state.retrying = false;
          state.polling = false;

          state.error = message;
          state.generationError =
            message;

          state.progress = 0;
          state.currentStep = 0;
          state.progressMessage =
            "Video regeneration failed.";

          state.pollingStopped = true;
          state.activeRequestId = null;
        }
      );
  },
});



/* =========================================================
   ACTION EXPORTS
========================================================= */

export const {
  setSelectedTwin,
  setSelectedProduct,
  setAvatarVideoContext,
  clearSelectedProduct,
  clearSelectedTwin,
  setPollingConfiguration,
  setPollAttempt,
  applyPollingUpdate,
  setGeneratedAvatarVideo,
  setAvatarVideoError,
  clearAvatarVideoError,
  stopAvatarVideoPolling,
  resumeAvatarVideoPolling,
  resetAvatarVideoResult,
  resetAvatarVideoState,
} = avatarVideoSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectAvatarVideo = (state) =>
  state.avatarVideo;

export const selectAvatarVideoStatus = (state) =>
  state.avatarVideo.status;

export const selectAvatarVideoUrl = (state) =>
  state.avatarVideo.videoUrl;

export const selectAvatarVideoSpeech = (state) =>
  state.avatarVideo.speech;

export const selectAvatarVideoError = (state) =>
  state.avatarVideo.error;

export const selectAvatarVideoProgress = (state) =>
  state.avatarVideo.progress;

export const selectAvatarVideoCurrentStep = (
  state
) => state.avatarVideo.currentStep;

export const selectAvatarVideoProgressMessage = (
  state
) => state.avatarVideo.progressMessage;

export const selectAvatarVideoGenerating = (
  state
) => state.avatarVideo.generating;

export const selectAvatarVideoPolling = (
  state
) => state.avatarVideo.polling;

export const selectAvatarVideoRetrying = (
  state
) => state.avatarVideo.retrying;

export const selectAvatarVideoLoadingStatus = (
  state
) => state.avatarVideo.loadingStatus;

export const selectAvatarVideoPoster = (
  state
) => state.avatarVideo.posterUrl;

export const selectAvatarVideoTwinId = (
  state
) => state.avatarVideo.twinId;

export const selectAvatarVideoProductId = (
  state
) => state.avatarVideo.productId;

export const selectAvatarVideoTwinName = (
  state
) => state.avatarVideo.twinName;

export const selectAvatarVideoProductName = (
  state
) => state.avatarVideo.productName;

export const selectAvatarVideoCreatedAt = (
  state
) => state.avatarVideo.createdAt;

export const selectAvatarVideoUpdatedAt = (
  state
) => state.avatarVideo.updatedAt;

export const selectAvatarVideoRawResponse = (
  state
) => state.avatarVideo.rawResponse;

export const selectAvatarVideoGenerationError = (
  state
) => state.avatarVideo.generationError;

export const selectAvatarVideoPollAttempts = (
  state
) => state.avatarVideo.pollAttempts;

export const selectAvatarVideoCanGenerate = (
  state
) =>
  Boolean(
    state.avatarVideo.twinId &&
      state.avatarVideo.productId
  );

export const selectAvatarVideoIsBusy = (
  state
) =>
  state.avatarVideo.generating ||
  state.avatarVideo.polling ||
  state.avatarVideo.retrying ||
  state.avatarVideo.loadingStatus;

export const selectAvatarVideoCompleted = (
  state
) =>
  isAvatarVideoCompleted(
    state.avatarVideo.status
  );

export const selectAvatarVideoFailed = (
  state
) =>
  isAvatarVideoFailed(
    state.avatarVideo.status
  );

export const selectAvatarVideoProcessing = (
  state
) =>
  isAvatarVideoProcessing(
    state.avatarVideo.status
  );

export const selectAvatarVideoReadyForLive = (
  state
) =>
  Boolean(
    state.avatarVideo.videoUrl &&
      isAvatarVideoCompleted(
        state.avatarVideo.status
      )
  );

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default avatarVideoSlice.reducer;