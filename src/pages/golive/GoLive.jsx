import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Youtube,
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  Radio,
  Sparkles,
  MessageSquare,
  Link2,
  Bot,
  ArrowRight,
  Package,
  ScanFace,
  Crown,
  Lock,
  AlertCircle,
  ExternalLink,
  Twitch,
  Twitter,
  RadioTower,
  Zap,
  StopCircle,
  RefreshCw,
  Upload,
  CheckCircle2,
} from "lucide-react";

import {
  fetchMe,
} from "../../features/auth/authSlice";

import {
  fetchConnections,
  fetchLiveStatus,
  startLive,
  stopAllLive,
  stopPlatformLive,
} from "../../features/social/socialSlice";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com/api";

/* =========================================================
   PLATFORM CONFIGURATION
========================================================= */

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    pro: false,
    liveSupported: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    pro: true,
    liveSupported: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    pro: true,
    liveSupported: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    pro: true,
    liveSupported: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    pro: true,
    liveSupported: true,
  },
  {
    id: "rumble",
    name: "Rumble",
    icon: RadioTower,
    pro: true,
    liveSupported: true,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: Twitter,
    pro: true,
    liveSupported: true,
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: Twitch,
    pro: true,
    liveSupported: true,
  },
  {
    id: "kick",
    name: "Kick",
    icon: Zap,
    pro: true,
    liveSupported: true,
  },
];

const livePlatformIds =
  platforms
    .filter(
      (item) =>
        item.liveSupported
    )
    .map(
      (item) =>
        item.id
    );

/* =========================================================
   HELPERS
========================================================= */

const normalizePlatform = (
  platform = ""
) => {
  const value =
    String(platform)
      .trim()
      .toLowerCase();

  return value === "x"
    ? "twitter"
    : value;
};

const getTwinDisplayName = (
  twin
) => {
  return (
    twin?.name ||
    twin?.twinName ||
    twin?.twin_name ||
    twin?.basicInfo?.name ||
    twin?.basicInfo?.twinName ||
    "Unnamed AI Twin"
  );
};

const getProductDisplayName = (
  product
) => {
  return (
    product?.name ||
    product?.productName ||
    product?.title ||
    "Unnamed Product"
  );
};

const extractTwinList = (
  data
) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    Array.isArray(
      data?.twins
    )
  ) {
    return data.twins;
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
      data?.data?.twins
    )
  ) {
    return data.data.twins;
  }

  return [];
};

const extractProductList = (
  data
) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    Array.isArray(
      data?.products
    )
  ) {
    return data.products;
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
      data?.data?.products
    )
  ) {
    return data.data.products;
  }

  return [];
};

const getErrorMessage = (
  error,
  fallback
) => {
  if (
    typeof error ===
    "string"
  ) {
    return error;
  }

  return (
    error?.message ||
    error?.response?.data?.message ||
    fallback
  );
};

/* =========================================================
   GO LIVE PAGE
========================================================= */

export default function GoLive() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const dispatch =
    useDispatch();

  const {
    user,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  const {
    connections = [],
    loading: socialLoading = false,
    liveLoading = false,
    statusLoading = false,
    liveStatus: platformStatuses = [],
    activePlatforms = [],
    error: socialError = null,
  } = useSelector(
    (state) =>
      state.social || {}
  );

  const plan =
    user?.plan || "free";

  const isPro =
    plan === "pro" ||
    plan === "business";

  const maxPlatforms =
    isPro ? livePlatformIds.length : 1;

  const totalPlatformCount =
    platforms.length;

  const scheduleState =
    location.state?.schedule;

  const productState =
    location.state?.product;

  const platformState =
    location.state?.platforms;

  const [
    twins,
    setTwins,
  ] = useState([]);

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    selectedTwinId,
    setSelectedTwinId,
  ] = useState("");

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");

  const [
    selectedPlatforms,
    setSelectedPlatforms,
  ] = useState([]);

  const [
    videoFile,
    setVideoFile,
  ] = useState(null);

  const [
    inputUrl,
    setInputUrl,
  ] = useState("");

  const [
    sourceMode,
    setSourceMode,
  ] = useState("file");

  const [
    loopVideo,
    setLoopVideo,
  ] = useState(true);

  const [
    localStatus,
    setLocalStatus,
  ] = useState("");

  const [
    loadingTwins,
    setLoadingTwins,
  ] = useState(false);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(false);

  const [
    settings,
    setSettings,
  ] = useState({
    liveChat: true,
    productLink: true,
    autoAnswer: true,
    multiPlatformSync: true,
  });

  const busy =
    socialLoading ||
    liveLoading ||
    statusLoading ||
    loadingTwins ||
    loadingProducts;

  const selectedTwin =
    useMemo(() => {
      return twins.find(
        (item) =>
          String(item?._id) ===
          String(
            selectedTwinId
          )
      );
    }, [
      twins,
      selectedTwinId,
    ]);

  const selectedProduct =
    useMemo(() => {
      return products.find(
        (item) =>
          String(item?._id) ===
          String(
            selectedProductId
          )
      );
    }, [
      products,
      selectedProductId,
    ]);

  const twinName =
    getTwinDisplayName(
      selectedTwin
    );

  const productName =
    getProductDisplayName(
      selectedProduct
    );

  const normalizedConnections =
    useMemo(() => {
      return connections.map(
        (item) => ({
          ...item,
          platform:
            normalizePlatform(
              item?.platform
            ),
        })
      );
    }, [
      connections,
    ]);

  const connectedPlatforms =
    useMemo(() => {
      return normalizedConnections
        .filter(
          (item) =>
            item?.connected !==
            false
        )
        .map(
          (item) =>
            item.platform
        )
        .filter(Boolean);
    }, [
      normalizedConnections,
    ]);

  const connectedLivePlatforms =
    useMemo(() => {
      return connectedPlatforms.filter(
        (platform) =>
          livePlatformIds.includes(
            platform
          )
      );
    }, [
      connectedPlatforms,
    ]);

  const statusMap =
    useMemo(() => {
      return new Map(
        platformStatuses.map(
          (item) => [
            normalizePlatform(
              item.platform
            ),
            item,
          ]
        )
      );
    }, [
      platformStatuses,
    ]);

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20 disabled:cursor-not-allowed disabled:opacity-60";

  const upgradeToPro =
    () => {
      navigate("/pricing");
    };

  const loadTwins =
    async () => {
      try {
        setLoadingTwins(
          true
        );

        const response =
          await fetch(
            `${API}/twin`,
            {
              method:
                "GET",

              credentials:
                "include",
            }
          );

        const data =
          await response
            .json()
            .catch(
              () => ({})
            );

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Unable to load AI Twins."
          );
        }

        const list =
          extractTwinList(
            data
          );

        setTwins(
          list
        );

        if (!list.length) {
          setSelectedTwinId(
            ""
          );

          return;
        }

        const requestedTwinId =
          scheduleState?.twinId ||
          scheduleState?.twin?._id ||
          location.state?.twinId ||
          localStorage.getItem(
            "selectedTwinId"
          );

        const matchingTwin =
          list.find(
            (item) =>
              String(item?._id) ===
              String(
                requestedTwinId
              )
          );

        const activeTwin =
          list.find(
            (item) =>
              item?.isTrained ===
                true ||
              item?.status ===
                "active"
          );

        setSelectedTwinId(
          String(
            (
              matchingTwin ||
              activeTwin ||
              list[0]
            )._id
          )
        );
      } catch (error) {
        setLocalStatus(
          getErrorMessage(
            error,
            "Unable to load AI Twins."
          )
        );
      } finally {
        setLoadingTwins(
          false
        );
      }
    };

  const loadProducts =
    async () => {
      try {
        setLoadingProducts(
          true
        );

        const response =
          await fetch(
            `${API}/products`,
            {
              method:
                "GET",

              credentials:
                "include",
            }
          );

        const data =
          await response
            .json()
            .catch(
              () => ({})
            );

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Unable to load products."
          );
        }

        const list =
          extractProductList(
            data
          );

        setProducts(
          list
        );

        if (!list.length) {
          setSelectedProductId(
            ""
          );

          return;
        }

        const requestedProductId =
          (
            typeof productState ===
            "object"
              ? productState?._id ||
                productState?.id
              : ""
          ) ||
          scheduleState?.productId ||
          scheduleState?.product?._id ||
          localStorage.getItem(
            "selectedProductId"
          );

        const requestedProductName =
          typeof productState ===
          "string"
            ? productState
            : getProductDisplayName(
                productState
              );

        const matchingById =
          list.find(
            (item) =>
              String(item?._id) ===
              String(
                requestedProductId
              )
          );

        const matchingByName =
          list.find(
            (item) =>
              getProductDisplayName(
                item
              )
                .trim()
                .toLowerCase() ===
              String(
                requestedProductName ||
                scheduleState?.productName ||
                ""
              )
                .trim()
                .toLowerCase()
          );

        setSelectedProductId(
          String(
            (
              matchingById ||
              matchingByName ||
              list[0]
            )._id
          )
        );
      } catch (error) {
        setLocalStatus(
          getErrorMessage(
            error,
            "Unable to load products."
          )
        );
      } finally {
        setLoadingProducts(
          false
        );
      }
    };

  useEffect(() => {
    if (!user) {
      dispatch(
        fetchMe()
      );
    }

    dispatch(
      fetchConnections()
    );

    dispatch(
      fetchLiveStatus()
    );

    loadTwins();
    loadProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
  ]);

  useEffect(() => {
    if (selectedTwinId) {
      localStorage.setItem(
        "selectedTwinId",
        selectedTwinId
      );
    }
  }, [
    selectedTwinId,
  ]);

  useEffect(() => {
    if (selectedProductId) {
      localStorage.setItem(
        "selectedProductId",
        selectedProductId
      );
    }
  }, [
    selectedProductId,
  ]);

  useEffect(() => {
    if (
      !connectedLivePlatforms.length
    ) {
      setSelectedPlatforms(
        []
      );

      return;
    }

    let preferredPlatforms = [];

    if (
      Array.isArray(
        platformState
      )
    ) {
      preferredPlatforms =
        platformState.map(
          normalizePlatform
        );
    } else if (
      Array.isArray(
        scheduleState?.platforms
      )
    ) {
      preferredPlatforms =
        scheduleState.platforms.map(
          normalizePlatform
        );
    } else {
      preferredPlatforms =
        connectedLivePlatforms;
    }

    const allowed =
      preferredPlatforms.filter(
        (platform) =>
          connectedLivePlatforms.includes(
            platform
          )
      );

    setSelectedPlatforms(
      isPro
        ? allowed.slice(
            0,
            maxPlatforms
          )
        : allowed.slice(
            0,
            1
          )
    );
  }, [
    connectedLivePlatforms,
    isPro,
    maxPlatforms,
    platformState,
    scheduleState,
  ]);

  const validateStart =
    () => {
      if (!selectedTwinId) {
        setLocalStatus(
          "Please select an AI Twin."
        );

        return false;
      }

      if (!selectedProductId) {
        setLocalStatus(
          "Please select a product."
        );

        return false;
      }

      if (
        !selectedPlatforms.length
      ) {
        setLocalStatus(
          "Please select at least one connected platform."
        );

        return false;
      }

      if (
        sourceMode ===
          "file" &&
        !videoFile
      ) {
        setLocalStatus(
          "Please select a video file."
        );

        return false;
      }

      if (
        sourceMode ===
          "url" &&
        !inputUrl.trim()
      ) {
        setLocalStatus(
          "Please enter a public video URL."
        );

        return false;
      }

      return true;
    };

  const togglePlatform =
    (
      platformId
    ) => {
      const item =
        platforms.find(
          (platform) =>
            platform.id ===
            platformId
        );

      if (
        !item?.liveSupported
      ) {
        alert(
          `${item?.name || platformId} live streaming is not configured in the current backend.`
        );

        return;
      }

      if (
        !connectedPlatforms.includes(
          platformId
        )
      ) {
        alert(
          "Connect this platform first."
        );

        navigate(
          "/app/connect"
        );

        return;
      }

      if (
        item.pro &&
        !isPro
      ) {
        upgradeToPro();

        return;
      }

      const active =
        selectedPlatforms.includes(
          platformId
        );

      if (active) {
        setSelectedPlatforms(
          (previous) =>
            previous.filter(
              (itemId) =>
                itemId !==
                platformId
            )
        );

        return;
      }

      if (
        selectedPlatforms.length >=
        maxPlatforms
      ) {
        if (!isPro) {
          upgradeToPro();
        } else {
          alert(
            `You can select up to ${maxPlatforms} platforms.`
          );
        }

        return;
      }

      setSelectedPlatforms(
        (previous) => [
          ...previous,
          platformId,
        ]
      );
    };

  const toggleSetting =
    (
      key,
      proOnly = false
    ) => {
      if (
        proOnly &&
        !isPro
      ) {
        upgradeToPro();

        return;
      }

      setSettings(
        (previous) => ({
          ...previous,
          [key]:
            !previous[key],
        })
      );
    };

  const handleStartLive =
    async () => {
      if (
        !validateStart()
      ) {
        return;
      }

      try {
        setLocalStatus(
          "Preparing live stream..."
        );

        setLocalStatus(
          "Starting FFmpeg stream..."
        );

        const startResult =
          await dispatch(
            startLive({
              platforms:
                selectedPlatforms,

              video:
                sourceMode ===
                "file"
                  ? videoFile
                  : null,

              inputUrl:
                sourceMode ===
                "url"
                  ? inputUrl.trim()
                  : "",

              sourceType:
                sourceMode ===
                "url"
                  ? "url"
                  : "file",

              loop:
                loopVideo,
      rollbackOnFailure: false,
              

              fps:
                30,

              preset:
                "veryfast",

              twinId:
                selectedTwinId,

              productId:
                selectedProductId,

              twinName,

              productName,

              settings,
            })
          ).unwrap();

        await dispatch(
          fetchLiveStatus()
        );

        const startedCount =
          Number(
            startResult?.started
          ) || 0;

        const failedCount =
          Number(
            startResult?.failed
          ) || 0;

        if (
          startedCount > 0 &&
          failedCount > 0
        ) {
          setLocalStatus(
            `${startedCount} platform(s) started. ${failedCount} platform(s) failed.`
          );
        } else if (
          startedCount > 0
        ) {
          setLocalStatus(
            `${startedCount} platform(s) are live.`
          );
        } else {
          setLocalStatus(
            "No platform could be started."
          );
        }
      } catch (error) {
        setLocalStatus(
          getErrorMessage(
            error,
            "Unable to start live stream."
          )
        );
      }
    };

  const handleStopPlatform =
    async (
      platform
    ) => {
      try {
        setLocalStatus(
          `Stopping ${platform}...`
        );

        await dispatch(
          stopPlatformLive(
            platform
          )
        ).unwrap();


        await dispatch(
          fetchLiveStatus()
        );

        setLocalStatus(
          `${platform} stream stopped successfully.`
        );
      } catch (error) {
        setLocalStatus(
          getErrorMessage(
            error,
            `Unable to stop ${platform}.`
          )
        );
      }
    };

  const handleStopAll =
    async () => {
      try {
        setLocalStatus(
          "Stopping all active streams..."
        );

        await dispatch(
          stopAllLive()
        ).unwrap();


        await dispatch(
          fetchLiveStatus()
        );

        setLocalStatus(
          "All active streams stopped."
        );
      } catch (error) {
        setLocalStatus(
          getErrorMessage(
            error,
            "Unable to stop all streams."
          )
        );
      }
    };

  const refreshStatus =
    async () => {
      try {
        setLocalStatus(
          "Refreshing live status..."
        );

        await Promise.all([
          dispatch(
            fetchConnections()
          ).unwrap(),

          dispatch(
            fetchLiveStatus()
          ).unwrap(),
        ]);

        setLocalStatus(
          "Live status refreshed."
        );
      } catch (error) {
        setLocalStatus(
          getErrorMessage(
            error,
            "Unable to refresh status."
          )
        );
      }
    };

  const canStart =
    Boolean(
      selectedTwinId &&
      selectedProductId &&
      selectedPlatforms.length &&
      (
        (
          sourceMode ===
          "file" &&
          videoFile
        ) ||
        (
          sourceMode ===
          "url" &&
          inputUrl.trim()
        )
      )
    ) &&
    !busy;

  return (
    <div className="mx-auto max-w-6xl space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}

            {isPro
              ? "PRO GO LIVE SETUP"
              : "GO LIVE SETUP"}
          </span>

          <button
            type="button"
            onClick={
              refreshStatus
            }
            disabled={
              busy
            }
            className="inline-flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-2 text-xs font-black transition hover:border-[var(--brand-pink)] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${statusLoading ? "animate-spin" : ""}`} />

            Refresh
          </button>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          <span className="brand-text">
            Go Live
          </span>{" "}
          With Your AI Twin
        </h1>

        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
          Select a trained AI Twin, product, connected platforms and a video source. Your backend will create one FFmpeg process per selected platform using the saved RTMP URL and stream key.
        </p>
      </section>

      {(localStatus || socialError) && (
        <section className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-bold shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

          <span>
            {localStatus ||
              socialError}
          </span>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Connected Platforms"
          value={`${connectedPlatforms.length}/${totalPlatformCount}`}
          icon={CheckCircle2}
        />

        <Stat
          title="Selected"
          value={String(
            selectedPlatforms.length
          )}
          icon={Radio}
        />

        <Stat
          title="Active"
          value={String(
            activePlatforms.length
          )}
          icon={Zap}
        />

        <Stat
          title="Plan"
          value={
            isPro
              ? "Pro"
              : "Free"
          }
          icon={
            isPro
              ? Crown
              : Lock
          }
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                icon={ScanFace}
                label="Select AI Twin"
              >
                <select
                  value={
                    selectedTwinId
                  }
                  onChange={(
                    event
                  ) =>
                    setSelectedTwinId(
                      event.target.value
                    )
                  }
                  className={
                    inputClass
                  }
                  disabled={
                    loadingTwins ||
                    !twins.length
                  }
                >
                  {loadingTwins && (
                    <option value="">
                      Loading AI Twins...
                    </option>
                  )}

                  {!loadingTwins &&
                    !twins.length && (
                      <option value="">
                        No AI Twin found
                      </option>
                    )}

                  {twins.map(
                    (item) => (
                      <option
                        key={
                          item._id
                        }
                        value={
                          item._id
                        }
                      >
                        {getTwinDisplayName(
                          item
                        )}

                        {item.status
                          ? ` - ${item.status}`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field
                icon={Package}
                label="Select Product"
              >
                <select
                  value={
                    selectedProductId
                  }
                  onChange={(
                    event
                  ) =>
                    setSelectedProductId(
                      event.target.value
                    )
                  }
                  className={
                    inputClass
                  }
                  disabled={
                    loadingProducts ||
                    !products.length
                  }
                >
                  {loadingProducts && (
                    <option value="">
                      Loading products...
                    </option>
                  )}

                  {!loadingProducts &&
                    !products.length && (
                      <option value="">
                        No product found
                      </option>
                    )}

                  {products.map(
                    (item) => (
                      <option
                        key={
                          item._id
                        }
                        value={
                          item._id
                        }
                      >
                        {getProductDisplayName(
                          item
                        )}
                      </option>
                    )
                  )}
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select Connected Platforms
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              The Free plan supports one live platform. Pro and Business plans can select all nine backend-supported live destinations.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map(
                ({
                  id,
                  name,
                  icon: Icon,
                  pro,
                  liveSupported,
                }) => {
                  const selected =
                    selectedPlatforms.includes(
                      id
                    );

                  const connected =
                    connectedPlatforms.includes(
                      id
                    );

                  const locked =
                    pro &&
                    !isPro;

                  const runtimeStatus =
                    statusMap.get(
                      id
                    );

                  const processActive =
                    Boolean(
                      runtimeStatus
                        ?.processActive
                    );

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        togglePlatform(
                          id
                        )
                      }
                      disabled={
                        busy ||
                        processActive
                      }
                      className={`relative rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md disabled:cursor-not-allowed ${
                        selected
                          ? "border-[var(--brand-pink)] bg-pink-50 dark:bg-white/10"
                          : "border-border bg-background"
                      } ${
                        !connected ||
                        !liveSupported
                          ? "opacity-65"
                          : ""
                      }`}
                    >
                      {locked && (
                        <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                          PRO
                        </span>
                      )}

                      {processActive ? (
                        <Radio className="h-6 w-6 animate-pulse text-red-500" />
                      ) : !connected ||
                        locked ||
                        !liveSupported ? (
                        <Lock className="h-6 w-6 text-[var(--brand-pink)]" />
                      ) : (
                        <Icon className="h-6 w-6 text-[var(--brand-pink)]" />
                      )}

                      <p className="mt-3 text-base font-black">
                        {name}
                      </p>

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {processActive
                          ? "Live now"
                          : selected
                          ? "Selected"
                          : !liveSupported
                          ? "Backend not configured"
                          : !connected
                          ? "Connect first"
                          : locked
                          ? "Pro only"
                          : "Click to select"}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight brand-text">
              <Upload className="h-5 w-5" />
              Video Source
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setSourceMode(
                    "file"
                  )
                }
                className={`rounded-[5px] border px-4 py-3 text-sm font-black transition ${
                  sourceMode ===
                  "file"
                    ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                    : "border-border bg-background"
                }`}
              >
                Upload Video
              </button>

              <button
                type="button"
                onClick={() =>
                  setSourceMode(
                    "url"
                  )
                }
                className={`rounded-[5px] border px-4 py-3 text-sm font-black transition ${
                  sourceMode ===
                  "url"
                    ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                    : "border-border bg-background"
                }`}
              >
                Public Video URL
              </button>
            </div>

            <div className="mt-5">
              {sourceMode ===
              "file" ? (
                <Field
                  icon={Package}
                  label="Choose Video"
                >
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/avi"
                    onChange={(
                      event
                    ) =>
                      setVideoFile(
                        event.target
                          .files?.[0] ||
                        null
                      )
                    }
                    className={
                      inputClass
                    }
                  />

                  {videoFile && (
                    <p className="mt-3 text-sm font-bold text-muted-foreground">
                      Selected:{" "}
                      {videoFile.name}
                    </p>
                  )}
                </Field>
              ) : (
                <Field
                  icon={Link2}
                  label="Public Video URL"
                >
                  <input
                    type="url"
                    value={
                      inputUrl
                    }
                    onChange={(
                      event
                    ) =>
                      setInputUrl(
                        event.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                    placeholder="https://example.com/product-video.mp4"
                  />
                </Field>
              )}
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
              <div>
                <p className="font-black">
                  Loop video
                </p>

                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  Restart the video automatically when it reaches the end.
                </p>
              </div>

              <input
                type="checkbox"
                checked={
                  loopVideo
                }
                onChange={(
                  event
                ) =>
                  setLoopVideo(
                    event.target.checked
                  )
                }
                className="h-5 w-5 accent-pink-500"
              />
            </label>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Live Controls
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  handleStartLive
                }
                disabled={
                  !canStart
                }
                className="brand-gradient flex items-center justify-center gap-2 rounded-[5px] px-6 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Radio className="h-4 w-4" />

                {busy
                  ? "Please wait..."
                  : "Start Selected Live"}
              </button>

              <button
                type="button"
                onClick={
                  handleStopAll
                }
                disabled={
                  busy ||
                  !activePlatforms.length
                }
                className="flex items-center justify-center gap-2 rounded-[5px] border border-red-500 px-6 py-3 text-sm font-black text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10"
              >
                <StopCircle className="h-4 w-4" />

                Stop All Live
              </button>
            </div>
          </section>

          {activePlatforms.length >
            0 && (
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black tracking-tight brand-text">
                Active Streams
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activePlatforms.map(
                  (platformId) => {
                    const item =
                      platforms.find(
                        (platform) =>
                          platform.id ===
                          platformId
                      );

                    const Icon =
                      item?.icon ||
                      Radio;

                    return (
                      <div
                        key={
                          platformId
                        }
                        className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-red-500" />

                          <div>
                            <p className="font-black">
                              {item?.name ||
                                platformId}
                            </p>

                            <p className="text-xs font-medium text-red-500">
                              Streaming
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleStopPlatform(
                              platformId
                            )
                          }
                          disabled={
                            busy
                          }
                          className="rounded-[5px] border border-red-500 px-3 py-2 text-xs font-black text-red-500 disabled:opacity-50"
                        >
                          Stop Shared Live
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}
        </main>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Live Preview
            </h2>

            <div className="mt-5 space-y-3">
              <PreviewItem
                label="AI Twin"
                value={
                  selectedTwin
                    ? twinName
                    : "Not selected"
                }
              />

              <PreviewItem
                label="Product"
                value={
                  selectedProduct
                    ? productName
                    : "Not selected"
                }
              />

              <PreviewItem
                label="Platforms"
                value={
                  selectedPlatforms.length
                    ? selectedPlatforms
                        .join(", ")
                    : "None"
                }
              />

              <PreviewItem
                label="Video Source"
                value={
                  sourceMode ===
                  "file"
                    ? videoFile?.name ||
                      "No file"
                    : inputUrl ||
                      "No URL"
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xl font-black tracking-tight brand-text">
              AI Live Settings
            </h2>

            <div className="mt-4 space-y-3">
              <SettingRow
                icon={MessageSquare}
                label="Live Chat"
                active={
                  settings.liveChat
                }
                onClick={() =>
                  toggleSetting(
                    "liveChat"
                  )
                }
              />

              <SettingRow
                icon={Link2}
                label="Product Link"
                active={
                  settings.productLink
                }
                onClick={() =>
                  toggleSetting(
                    "productLink"
                  )
                }
              />

              <SettingRow
                icon={Bot}
                label="Auto Answer"
                active={
                  settings.autoAnswer
                }
                onClick={() =>
                  toggleSetting(
                    "autoAnswer"
                  )
                }
              />

              <SettingRow
                icon={Sparkles}
                label="Multi-platform Sync"
                active={
                  settings.multiPlatformSync
                }
                locked={
                  !isPro
                }
                onClick={() =>
                  toggleSetting(
                    "multiPlatformSync",
                    true
                  )
                }
              />
            </div>
          </section>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/app/connect"
              )
            }
            className="flex w-full items-center justify-center gap-2 rounded-[5px] border border-border bg-card px-5 py-3 text-sm font-black transition hover:border-[var(--brand-pink)]"
          >
            Manage Connections

            <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  icon: Icon,
  label,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-black">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

        {label}
      </span>

      {children}
    </label>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="text-2xl font-black tracking-tight brand-text">
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PREVIEW ITEM
========================================================= */

function PreviewItem({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold">
        {String(
          value ??
          "Not available"
        )}
      </p>
    </div>
  );
}

/* =========================================================
   SETTING ROW
========================================================= */

function SettingRow({
  icon: Icon,
  label,
  active,
  locked = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[var(--brand-pink)]" />

        <div>
          <p className="text-sm font-black">
            {label}
          </p>

          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {locked
              ? "Pro only"
              : active
              ? "Enabled"
              : "Disabled"}
          </p>
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-[10px] font-black ${
          locked
            ? "bg-pink-100 text-[var(--brand-pink)] dark:bg-white/10"
            : active
            ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {locked
          ? "PRO"
          : active
          ? "ON"
          : "OFF"}
      </span>
    </button>
  );
}