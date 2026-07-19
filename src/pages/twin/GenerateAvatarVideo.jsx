import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Sparkles,
  Video,
} from "lucide-react";

import AvatarSelector from "../../components/avatarVideo/AvatarSelector";
import ProductSelector from "../../components/avatarVideo/ProductSelector";
import AvatarPreview from "../../components/avatarVideo/AvatarPreview";
import GenerationProgress from "../../components/avatarVideo/GenerationProgress";
import GeneratedVideoPlayer from "../../components/avatarVideo/GeneratedVideoPlayer";

import {
  clearAvatarVideoError,
  generateAvatarVideo,
  pollAvatarVideoStatus,
  resetAvatarVideoResult,
  retryAvatarVideo,
  selectAvatarVideo,
  setSelectedProduct,
  setSelectedTwin,
  stopAvatarVideoPolling,
} from "../../features/avatarVideo/avatarVideoSlice";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

const normalizeBaseUrl = (url) => {
  return String(url || "")
    .trim()
    .replace(/\/+$/, "");
};

const BASE_URL =
  normalizeBaseUrl(API_URL);

/* =========================================================
   API HELPER
========================================================= */

const parseResponse = async (
  response
) => {
  let data = null;

  try {
    data =
      await response.json();
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
   NORMALIZE LIST RESPONSES
========================================================= */

const normalizeTwins = (
  response
) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(response?.twins)
  ) {
    return response.twins;
  }

  if (
    Array.isArray(
      response?.data?.twins
    )
  ) {
    return response.data.twins;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  return [];
};

const normalizeProducts = (
  response
) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(response?.products)
  ) {
    return response.products;
  }

  if (
    Array.isArray(
      response?.data?.products
    )
  ) {
    return response.data.products;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  return [];
};

/* =========================================================
   FIELD HELPERS
========================================================= */

const getId = (item) => {
  return (
    item?._id ||
    item?.id ||
    null
  );
};

const getTwinName = (twin) => {
  return (
    twin?.name ||
    twin?.twinName ||
    twin?.twin_name ||
    "AI Twin"
  );
};

const getTwinImage = (twin) => {
  return (
    twin?.image ||
    twin?.avatarUrl ||
    twin?.avatar ||
    twin?.appearance?.avatarUrl ||
    twin?.appearance?.image ||
    ""
  );
};

const getProductName = (
  product
) => {
  return (
    product?.name ||
    product?.productName ||
    product?.title ||
    "Selected Product"
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function GenerateAvatarVideo() {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const avatarVideo =
    useSelector(
      selectAvatarVideo
    );

  const {
    twinId,
    productId,
    twinName,
    productName,
    posterUrl,

    status,
    videoUrl,
    speech,

    progress,
    currentStep,
    progressMessage,

    generating,
    polling,
    retrying,
    loadingStatus,

    error,
    generationError,

    pollInterval,
    maxPollAttempts,
  } = avatarVideo;

  /* =======================================================
     LOCAL DATA STATE
  ======================================================== */

  const [twins, setTwins] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [loadingTwins, setLoadingTwins] =
    useState(true);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  const [pageError, setPageError] =
    useState("");

  const [initialLoaded, setInitialLoaded] =
    useState(false);

  /* =======================================================
     POLLING REQUEST REFERENCE
  ======================================================== */

  const pollingPromiseRef =
    useRef(null);

  /* =======================================================
     SELECTED OBJECTS
  ======================================================== */

  const selectedTwin =
    useMemo(() => {
      return twins.find(
        (twin) =>
          String(getId(twin)) ===
          String(twinId)
      );
    }, [twins, twinId]);

  const selectedProduct =
    useMemo(() => {
      return products.find(
        (product) =>
          String(getId(product)) ===
          String(productId)
      );
    }, [
      products,
      productId,
    ]);

  /* =======================================================
     STATUS HELPERS
  ======================================================== */

  const normalizedStatus =
    String(status || "idle")
      .trim()
      .toLowerCase();

  const isCompleted = [
    "completed",
    "complete",
    "ready",
    "success",
    "succeeded",
  ].includes(normalizedStatus);

  const isProcessing = [
    "queued",
    "pending",
    "processing",
    "generating",
    "rendering",
    "uploading",
  ].includes(normalizedStatus);

  const isFailed = [
    "failed",
    "error",
    "cancelled",
    "canceled",
  ].includes(normalizedStatus);

  const isBusy =
    generating ||
    polling ||
    retrying ||
    loadingStatus;

  const canGenerate =
    Boolean(
      twinId &&
        productId
    ) &&
    !isBusy;

  /* =======================================================
     FETCH TWINS
  ======================================================== */

  const fetchTwins =
    useCallback(async () => {
      try {
        setLoadingTwins(true);
        setPageError("");

        const response =
          await fetch(
            `${BASE_URL}/api/twin`,
            {
              method: "GET",

              credentials:
                "include",

              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const data =
          await parseResponse(
            response
          );

        const twinList =
          normalizeTwins(data);

        setTwins(twinList);
      } catch (requestError) {
        console.error(
          "FETCH TWINS ERROR:",
          requestError
        );

        setPageError(
          requestError?.message ||
            "Unable to load your AI Twins."
        );
      } finally {
        setLoadingTwins(false);
      }
    }, []);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================== */

  const fetchProducts =
    useCallback(async () => {
      try {
        setLoadingProducts(true);
        setPageError("");

        const response =
          await fetch(
            `${BASE_URL}/api/products`,
            {
              method: "GET",

              credentials:
                "include",

              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const data =
          await parseResponse(
            response
          );

        const productList =
          normalizeProducts(data);

        setProducts(productList);
      } catch (requestError) {
        console.error(
          "FETCH PRODUCTS ERROR:",
          requestError
        );

        setPageError(
          requestError?.message ||
            "Unable to load your products."
        );
      } finally {
        setLoadingProducts(false);
      }
    }, []);

  /* =======================================================
     INITIAL FETCH
  ======================================================== */

  useEffect(() => {
    let mounted = true;

    const loadPageData =
      async () => {
        await Promise.allSettled([
          fetchTwins(),
          fetchProducts(),
        ]);

        if (mounted) {
          setInitialLoaded(true);
        }
      };

    loadPageData();

    return () => {
      mounted = false;
    };
  }, [
    fetchTwins,
    fetchProducts,
  ]);

  /* =======================================================
     CLEANUP POLLING
  ======================================================== */

  useEffect(() => {
    return () => {
      if (
        pollingPromiseRef.current
      ) {
        pollingPromiseRef.current.abort();

        pollingPromiseRef.current =
          null;
      }

      dispatch(
        stopAvatarVideoPolling()
      );
    };
  }, [dispatch]);

  /* =======================================================
     START POLLING
  ======================================================== */

 const startPolling =
  useCallback(
    async (
      selectedTwinId,
      selectedProductId
    ) => {
      if (!selectedTwinId) {
        return null;
      }

      if (
        pollingPromiseRef.current
      ) {
        pollingPromiseRef.current.abort();

        pollingPromiseRef.current =
          null;
      }

      const pollingPromise =
        dispatch(
          pollAvatarVideoStatus({
            twinId:
              selectedTwinId,

            productId:
              selectedProductId,

            pollInterval:
              pollInterval ||
              5000,

            maxAttempts:
              maxPollAttempts ||
              60,
          })
        );

      pollingPromiseRef.current =
        pollingPromise;

      try {
        const result =
          await pollingPromise.unwrap();

        return result;
      } catch (pollError) {
        const cancelled =
          pollError?.cancelled ||
          String(
            pollError?.message ||
              pollError ||
              ""
          )
            .toLowerCase()
            .includes(
              "cancelled"
            );

        if (!cancelled) {
          console.error(
            "VIDEO POLLING ERROR:",
            pollError
          );
        }

        return null;
      } finally {
        if (
          pollingPromiseRef.current ===
          pollingPromise
        ) {
          pollingPromiseRef.current =
            null;
        }
      }
    },
    [
      dispatch,
      pollInterval,
      maxPollAttempts,
    ]
  );
  /* =======================================================
     SELECT TWIN
  ======================================================== */

  const handleSelectTwin = (
    twin
  ) => {
    if (isBusy) {
      return;
    }

    const nextTwinId =
      getId(twin);

    if (
      String(nextTwinId) ===
      String(twinId)
    ) {
      return;
    }

    if (
      pollingPromiseRef.current
    ) {
      pollingPromiseRef.current.abort();

      pollingPromiseRef.current =
        null;
    }

    dispatch(
      resetAvatarVideoResult()
    );

    dispatch(
      setSelectedTwin(twin)
    );
  };

  /* =======================================================
     SELECT PRODUCT
  ======================================================== */

  const handleSelectProduct = (
    product
  ) => {
    if (isBusy) {
      return;
    }

    const nextProductId =
      getId(product);

    if (
      String(nextProductId) ===
      String(productId)
    ) {
      return;
    }

    if (
      pollingPromiseRef.current
    ) {
      pollingPromiseRef.current.abort();

      pollingPromiseRef.current =
        null;
    }

    dispatch(
      resetAvatarVideoResult()
    );

    dispatch(
      setSelectedProduct(
        product
      )
    );
  };

  /* =======================================================
     GENERATE VIDEO
  ======================================================== */

  const handleGenerate =
    async () => {
      if (!selectedTwin) {
        dispatch(
          clearAvatarVideoError()
        );

        setPageError(
          "Please select an AI Twin."
        );

        return;
      }

      if (!selectedProduct) {
        dispatch(
          clearAvatarVideoError()
        );

        setPageError(
          "Please select a product."
        );

        return;
      }

      const selectedTwinId =
        getId(selectedTwin);

      const selectedProductId =
        getId(selectedProduct);

      setPageError("");

      dispatch(
        clearAvatarVideoError()
      );

      try {
        const result =
          await dispatch(
            generateAvatarVideo({
              twinId:
                selectedTwinId,

              productId:
                selectedProductId,

              twinName:
                getTwinName(
                  selectedTwin
                ),

              productName:
                getProductName(
                  selectedProduct
                ),

              posterUrl:
                getTwinImage(
                  selectedTwin
                ),
            })
          ).unwrap();

        const resultStatus =
          String(
            result?.status ||
              "processing"
          ).toLowerCase();

        const completedStatuses = [
          "completed",
          "complete",
          "ready",
          "success",
          "succeeded",
        ];

        const failedStatuses = [
          "failed",
          "error",
          "cancelled",
          "canceled",
        ];

        if (
          completedStatuses.includes(
            resultStatus
          )
        ) {
          return;
        }

        if (
          failedStatuses.includes(
            resultStatus
          )
        ) {
          return;
        }

       await startPolling(
  selectedTwinId,
  selectedProductId
);
      } catch (requestError) {
        console.error(
          "GENERATE VIDEO ERROR:",
          requestError
        );
      }
    };

  /* =======================================================
     RETRY VIDEO
  ======================================================== */

  const handleRegenerate =
    async () => {
      if (
        !twinId ||
        !productId
      ) {
        setPageError(
          "Please select an AI Twin and product before regenerating."
        );

        return;
      }

      if (
        pollingPromiseRef.current
      ) {
        pollingPromiseRef.current.abort();

        pollingPromiseRef.current =
          null;
      }

      setPageError("");

      dispatch(
        clearAvatarVideoError()
      );

      try {
        const result =
          await dispatch(
            retryAvatarVideo({
              twinId,
              productId,
              twinName:
                twinName ||
                getTwinName(
                  selectedTwin
                ),

              productName:
                productName ||
                getProductName(
                  selectedProduct
                ),

              posterUrl:
                posterUrl ||
                getTwinImage(
                  selectedTwin
                ),
            })
          ).unwrap();

        const resultStatus =
          String(
            result?.status ||
              "processing"
          ).toLowerCase();

        const terminalStatuses = [
          "completed",
          "complete",
          "ready",
          "success",
          "succeeded",
          "failed",
          "error",
          "cancelled",
          "canceled",
        ];

        if (
          !terminalStatuses.includes(
            resultStatus
          )
        ) {
          await startPolling(
  twinId,
  productId
);
        }
      } catch (requestError) {
        console.error(
          "REGENERATE VIDEO ERROR:",
          requestError
        );
      }
    };

  /* =======================================================
     GO LIVE
  ======================================================== */

  const handleGoLive = () => {
    if (!videoUrl) {
      setPageError(
        "Generate a video before continuing to Go Live."
      );

      return;
    }

    navigate(
      "/app/live",
      {
        state: {
          twinId,
          productId,
          twinName,
          productName,
          avatarVideoUrl:
            videoUrl,
          avatarVideoSpeech:
            speech,
        },
      }
    );
  };

  /* =======================================================
     RELOAD PAGE DATA
  ======================================================== */

  const handleReloadData =
    async () => {
      setPageError("");

      await Promise.allSettled([
        fetchTwins(),
        fetchProducts(),
      ]);
    };

  /* =======================================================
     INITIAL LOADING
  ======================================================== */

  if (
    !initialLoaded &&
    loadingTwins &&
    loadingProducts
  ) {
    return (
      <div className="flex min-h-[600px] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>

          <h2 className="mt-5 text-xl font-black">
            Loading AI video studio
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Loading your AI Twins and products...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================== */

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ===============================================
            PAGE HEADER
        ================================================ */}

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate(-1)
                  }
                  aria-label="Go back"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border bg-background transition hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
                    <Sparkles className="h-4 w-4" />
                    AI VIDEO GENERATOR
                  </span>

                  <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                    Generate AI Product Video
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Select an AI Twin and product to generate a product-specific talking avatar video.
                  </p>
                </div>
              </div>

              <StatusSummary
                status={
                  normalizedStatus
                }
                busy={isBusy}
                completed={
                  isCompleted
                }
                failed={isFailed}
              />
            </div>
          </div>
        </section>

        {/* ===============================================
            PAGE ERROR
        ================================================ */}

        {(pageError ||
          error ||
          generationError) && (
          <section className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-900/10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                <div>
                  <h2 className="font-black text-red-800 dark:text-red-300">
                    Video generation issue
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-red-700 dark:text-red-400">
                    {pageError ||
                      error ||
                      generationError}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPageError("");

                  dispatch(
                    clearAvatarVideoError()
                  );
                }}
                className="h-10 rounded-[5px] border border-red-300 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Dismiss
              </button>
            </div>
          </section>
        )}

        {/* ===============================================
            LOAD DATA ERROR ACTION
        ================================================ */}

        {pageError &&
          twins.length === 0 &&
          products.length === 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={
                  handleReloadData
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border bg-card px-5 text-sm font-bold transition hover:border-[var(--brand-pink)]"
              >
                <RefreshCcw className="h-4 w-4" />
                Reload Data
              </button>
            </div>
          )}

        {/* ===============================================
            SELECTION GRID
        ================================================ */}

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <AvatarSelector
            twins={twins}
            selectedTwinId={
              twinId
            }
            selectedTwin={
              selectedTwin
            }
            loading={
              loadingTwins
            }
            disabled={isBusy}
            onSelect={
              handleSelectTwin
            }
          />

          <ProductSelector
            products={products}
            selectedProductId={
              productId
            }
            selectedProduct={
              selectedProduct
            }
            loading={
              loadingProducts
            }
            disabled={isBusy}
            onSelect={
              handleSelectProduct
            }
          />
        </div>

        {/* ===============================================
            PREVIEW
        ================================================ */}

        <div className="mt-6">
          <AvatarPreview
            twin={
              selectedTwin
            }
            product={
              selectedProduct
            }
            speech={speech}
            status={status}
          />
        </div>

        {/* ===============================================
            GENERATE BUTTON
        ================================================ */}

        {!isProcessing &&
          !isCompleted && (
            <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-xl font-black">
                    Ready to generate?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The generated speech will use the selected Twin’s language, voice, personality and the selected product details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    isFailed
                      ? handleRegenerate
                      : handleGenerate
                  }
                  disabled={
                    !canGenerate
                  }
                  className="brand-gradient inline-flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-black text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generating ||
                  retrying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isFailed ? (
                    <RefreshCcw className="h-5 w-5" />
                  ) : (
                    <Video className="h-5 w-5" />
                  )}

                  {retrying
                    ? "Restarting..."
                    : generating
                      ? "Starting Generation..."
                      : isFailed
                        ? "Retry Generation"
                        : "Generate AI Video"}
                </button>
              </div>

              {!twinId && (
                <p className="mt-4 text-xs font-bold text-amber-600">
                  Select an AI Twin before generating.
                </p>
              )}

              {twinId &&
                !productId && (
                  <p className="mt-4 text-xs font-bold text-amber-600">
                    Select a product before generating.
                  </p>
                )}
            </section>
          )}

        {/* ===============================================
            GENERATION PROGRESS
        ================================================ */}

        {(isProcessing ||
          generating ||
          polling ||
          retrying) && (
          <div className="mt-6">
            <GenerationProgress
              status={status}
              progress={progress}
              currentStep={
                currentStep
              }
              message={
                progressMessage
              }
              twin={
                selectedTwin
              }
              product={
                selectedProduct
              }
              polling={polling}
              generating={
                generating
              }
              retrying={retrying}
            />
          </div>
        )}

        {/* ===============================================
            GENERATED VIDEO
        ================================================ */}

        {isCompleted && (
          <div className="mt-6">
            <GeneratedVideoPlayer
              videoUrl={videoUrl}
              posterUrl={
                posterUrl ||
                getTwinImage(
                  selectedTwin
                )
              }
              twinName={
                twinName ||
                getTwinName(
                  selectedTwin
                )
              }
              productName={
                productName ||
                getProductName(
                  selectedProduct
                )
              }
              speech={speech}
              regenerating={
                retrying
              }
              onRegenerate={
                handleRegenerate
              }
              onGoLive={
                handleGoLive
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   STATUS SUMMARY
========================================================= */

function StatusSummary({
  status,
  busy,
  completed,
  failed,
}) {
  if (completed) {
    return (
      <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5" />

        <div>
          <p className="text-xs font-black uppercase tracking-wide">
            Video Status
          </p>

          <p className="text-sm font-black">
            Generation completed
          </p>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
        <AlertCircle className="h-5 w-5" />

        <div>
          <p className="text-xs font-black uppercase tracking-wide">
            Video Status
          </p>

          <p className="text-sm font-black">
            Generation failed
          </p>
        </div>
      </div>
    );
  }

  if (busy) {
    return (
      <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-[var(--brand-pink)] dark:border-pink-900/30 dark:bg-pink-900/10">
        <Loader2 className="h-5 w-5 animate-spin" />

        <div>
          <p className="text-xs font-black uppercase tracking-wide">
            Video Status
          </p>

          <p className="text-sm font-black">
            Generating video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-muted-foreground">
      <Video className="h-5 w-5" />

      <div>
        <p className="text-xs font-black uppercase tracking-wide">
          Video Status
        </p>

        <p className="text-sm font-black">
          {status === "idle"
            ? "Waiting for selection"
            : status}
        </p>
      </div>
    </div>
  );
}