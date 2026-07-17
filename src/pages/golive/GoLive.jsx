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
} from "lucide-react";

import {
  fetchMe,
} from "../../features/auth/authSlice";

import {
  fetchConnections,
  startYouTubeLive,
  stopYouTubeLive,
} from "../../features/social/socialSlice";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API =
  "https://twinn-backend.onrender.com/api";

const LIVE_API =
  `${API}/live`;

/* =========================================================
   PLATFORM CONFIGURATION
========================================================= */

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    pro: false,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    pro: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    pro: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    pro: true,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const normalizePlatform = (
  platform = ""
) => {
  return String(platform)
    .trim()
    .toLowerCase();
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

    youtubeLiveLoading = false,
    youtubeLiveStatus = "idle",
    youtubeLiveData = null,
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
    isPro ? 4 : 1;

  const scheduleState =
    location.state?.schedule;

  const productState =
    location.state?.product;

  const platformState =
    location.state?.platforms;

  /* =========================================================
     LOCAL STATE
  ========================================================= */

  const [
    videoFile,
    setVideoFile,
  ] = useState(null);

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
    rtmpUrl,
    setRtmpUrl,
  ] = useState(
    "rtmps://live-upload.instagram.com:443/rtmp"
  );

  const [
    streamKey,
    setStreamKey,
  ] = useState("");

  const [
    videoPath,
    setVideoPath,
  ] = useState("");

  const [
    liveLoading,
    setLiveLoading,
  ] = useState(false);

  const [
    liveStatus,
    setLiveStatus,
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
    multiPlatformSync: false,
  });

  /* =========================================================
     SELECTED TWIN AND PRODUCT
  ========================================================= */

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

  /* =========================================================
     CONNECTED PLATFORMS
  ========================================================= */

  const connectedPlatforms =
    useMemo(() => {
      return connections
        .filter(
          (item) =>
            item?.connected !==
            false
        )
        .map(
          (item) =>
            normalizePlatform(
              item.platform
            )
        )
        .filter(Boolean);
    }, [connections]);

  const instagramConnected =
    connectedPlatforms.includes(
      "instagram"
    );

  const facebookConnected =
    connectedPlatforms.includes(
      "facebook"
    );

  const youtubeConnected =
    connectedPlatforms.includes(
      "youtube"
    );

  /* =========================================================
     INPUT CLASS
  ========================================================= */

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20 disabled:cursor-not-allowed disabled:opacity-60";

  const upgradeToPro =
    () => {
      navigate("/pricing");
    };

  /* =========================================================
     LOAD AI TWINS
  ========================================================= */

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
              method: "GET",
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

        const twinList =
          extractTwinList(
            data
          );

        setTwins(
          twinList
        );

        if (
          !twinList.length
        ) {
          setSelectedTwinId(
            ""
          );

          return;
        }

        const requestedTwinId =
          scheduleState
            ?.twinId ||
          scheduleState
            ?.twin?._id ||
          location.state
            ?.twinId ||
          localStorage.getItem(
            "selectedTwinId"
          );

        const matchingTwin =
          twinList.find(
            (item) =>
              String(
                item?._id
              ) ===
              String(
                requestedTwinId
              )
          );

        const activeTwin =
          twinList.find(
            (item) =>
              item?.isTrained ===
                true ||
              item?.status ===
                "active"
          );

        const initialTwin =
          matchingTwin ||
          activeTwin ||
          twinList[0];

        setSelectedTwinId(
          String(
            initialTwin._id
          )
        );
      } catch (error) {
        console.error(
          "LOAD TWINS ERROR:",
          error
        );

        setLiveStatus(
          error.message ||
            "Unable to load AI Twins."
        );
      } finally {
        setLoadingTwins(
          false
        );
      }
    };

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

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
              method: "GET",
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

        const productList =
          extractProductList(
            data
          );

        setProducts(
          productList
        );

        if (
          !productList.length
        ) {
          setSelectedProductId(
            ""
          );

          return;
        }

        const productStateId =
          typeof productState ===
          "object"
            ? productState?._id ||
              productState?.id
            : "";

        const productStateName =
          typeof productState ===
          "string"
            ? productState
            : getProductDisplayName(
                productState
              );

        const requestedProductId =
          productStateId ||
          scheduleState
            ?.productId ||
          scheduleState
            ?.product?._id ||
          localStorage.getItem(
            "selectedProductId"
          );

        const requestedProductName =
          productStateName ||
          scheduleState
            ?.productName ||
          (typeof scheduleState
            ?.product ===
          "string"
            ? scheduleState.product
            : "");

        const matchingById =
          productList.find(
            (item) =>
              String(
                item?._id
              ) ===
              String(
                requestedProductId
              )
          );

        const matchingByName =
          productList.find(
            (item) =>
              getProductDisplayName(
                item
              )
                .trim()
                .toLowerCase() ===
              String(
                requestedProductName ||
                  ""
              )
                .trim()
                .toLowerCase()
          );

        const initialProduct =
          matchingById ||
          matchingByName ||
          productList[0];

        setSelectedProductId(
          String(
            initialProduct._id
          )
        );
      } catch (error) {
        console.error(
          "LOAD PRODUCTS ERROR:",
          error
        );

        setLiveStatus(
          error.message ||
            "Unable to load products."
        );
      } finally {
        setLoadingProducts(
          false
        );
      }
    };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    if (!user) {
      dispatch(
        fetchMe()
      );
    }

    dispatch(
      fetchConnections()
    );

    loadTwins();
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  /* =========================================================
     SAVE SELECTED IDS
  ========================================================= */

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
    if (
      selectedProductId
    ) {
      localStorage.setItem(
        "selectedProductId",
        selectedProductId
      );
    }
  }, [
    selectedProductId,
  ]);

  /* =========================================================
     INITIAL PLATFORM SELECTION
  ========================================================= */

  useEffect(() => {
    if (
      !connectedPlatforms.length
    ) {
      setSelectedPlatforms(
        []
      );

      setLiveStatus(
        "Please connect a social platform before going live."
      );

      return;
    }

    let preferredPlatforms =
      [];

    if (
      Array.isArray(
        platformState
      ) &&
      platformState.length
    ) {
      preferredPlatforms =
        platformState.map(
          normalizePlatform
        );
    } else if (
      Array.isArray(
        scheduleState
          ?.platforms
      )
    ) {
      preferredPlatforms =
        scheduleState.platforms.map(
          normalizePlatform
        );
    } else {
      preferredPlatforms =
        connectedPlatforms;
    }

    const allowedConnected =
      preferredPlatforms.filter(
        (platform) =>
          connectedPlatforms.includes(
            platform
          )
      );

    setSelectedPlatforms(
      isPro
        ? allowedConnected
        : allowedConnected.slice(
            0,
            1
          )
    );

    setLiveStatus("");
  }, [
    connectedPlatforms,
    isPro,
    platformState,
    scheduleState,
  ]);

  /* =========================================================
     VALIDATE TWIN AND PRODUCT
  ========================================================= */

  const validateTwinAndProduct =
    () => {
      if (!selectedTwinId) {
        setLiveStatus(
          "Please select an AI Twin."
        );

        return false;
      }

      if (
        !selectedProductId
      ) {
        setLiveStatus(
          "Please select a product."
        );

        return false;
      }

      return true;
    };

  /* =========================================================
     UPLOAD VIDEO
  ========================================================= */

  const uploadVideo =
    async () => {
      if (!videoFile) {
        setLiveStatus(
          "Please choose a video file."
        );

        return null;
      }

      const formData =
        new FormData();

      formData.append(
        "video",
        videoFile
      );

      const response =
        await fetch(
          `${LIVE_API}/upload-video`,
          {
            method: "POST",
            credentials:
              "include",
            body: formData,
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
            "Video upload failed."
        );
      }

      const uploadedUrl =
        data.data
          ?.videoUrl ||
        data.videoPath ||
        data.path ||
        data.url;

      if (!uploadedUrl) {
        throw new Error(
          "Backend did not return the uploaded video URL."
        );
      }

      return uploadedUrl;
    };

  /* =========================================================
     PLATFORM TOGGLE
  ========================================================= */

  const togglePlatform = (
    platformId
  ) => {
    const item =
      platforms.find(
        (platform) =>
          platform.id ===
          platformId
      );

    const active =
      selectedPlatforms.includes(
        platformId
      );

    const isConnected =
      connectedPlatforms.includes(
        platformId
      );

    if (!isConnected) {
      alert(
        "Please connect this platform first."
      );

      navigate(
        "/app/connect"
      );

      return;
    }

    if (
      item?.pro &&
      !isPro &&
      !active
    ) {
      upgradeToPro();
      return;
    }

    if (active) {
      setSelectedPlatforms(
        (previous) =>
          previous.filter(
            (item) =>
              item !==
              platformId
          )
      );

      return;
    }

    if (
      !isPro &&
      selectedPlatforms.length >=
        maxPlatforms
    ) {
      upgradeToPro();
      return;
    }

    setSelectedPlatforms(
      (previous) => [
        ...previous,
        platformId,
      ]
    );
  };

  /* =========================================================
     SETTING TOGGLE
  ========================================================= */

  const toggleSetting = (
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

  /* =========================================================
     INSTAGRAM START
  ========================================================= */

  const startInstagramRTMP =
    async () => {
      try {
        setLiveLoading(true);
        setLiveStatus("");

        if (
          !validateTwinAndProduct()
        ) {
          return;
        }

        if (
          !instagramConnected
        ) {
          setLiveStatus(
            "Instagram is not connected. Please connect Instagram first."
          );

          navigate(
            "/app/connect"
          );

          return;
        }

        if (
          !rtmpUrl ||
          !streamKey ||
          !videoFile
        ) {
          setLiveStatus(
            "RTMP URL, Stream Key and Video file are required."
          );

          return;
        }

        const uploadedVideoPath =
          await uploadVideo();

        if (
          !uploadedVideoPath
        ) {
          return;
        }

        setVideoPath(
          uploadedVideoPath
        );

        const response =
          await fetch(
            `${LIVE_API}/start-instagram-rtmp`,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  rtmpUrl,
                  streamKey,

                  videoPath:
                    uploadedVideoPath,

                  twinId:
                    selectedTwinId,

                  twinName,

                  productId:
                    selectedProductId,

                  product:
                    productName,

                  productName,

                  platforms: [
                    "instagram",
                  ],
                }),
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
              "Failed to start Instagram live."
          );
        }

        setLiveStatus(
          "Instagram RTMP stream started successfully."
        );
      } catch (error) {
        setLiveStatus(
          error.message ||
            "Failed to start Instagram live."
        );
      } finally {
        setLiveLoading(
          false
        );
      }
    };

  /* =========================================================
     INSTAGRAM STOP
  ========================================================= */

  const stopInstagramRTMP =
    async () => {
      try {
        setLiveLoading(true);
        setLiveStatus("");

        const response =
          await fetch(
            `${LIVE_API}/stop-instagram-rtmp`,
            {
              method:
                "POST",

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
              "Failed to stop Instagram live."
          );
        }

        setLiveStatus(
          "Instagram RTMP stream stopped."
        );
      } catch (error) {
        setLiveStatus(
          error.message ||
            "Failed to stop Instagram live."
        );
      } finally {
        setLiveLoading(
          false
        );
      }
    };

  /* =========================================================
     FACEBOOK START
  ========================================================= */

  const startFacebookLive =
    async () => {
      try {
        setLiveLoading(true);
        setLiveStatus("");

        if (
          !validateTwinAndProduct()
        ) {
          return;
        }

        if (
          !facebookConnected
        ) {
          setLiveStatus(
            "Facebook is not connected. Please connect Facebook first."
          );

          navigate(
            "/app/connect"
          );

          return;
        }

        if (!videoFile) {
          setLiveStatus(
            "Please choose a video file."
          );

          return;
        }

        const uploadedVideoPath =
          await uploadVideo();

        if (
          !uploadedVideoPath
        ) {
          return;
        }

        setVideoPath(
          uploadedVideoPath
        );

        const response =
          await fetch(
            `${LIVE_API}/start-facebook`,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  videoPath:
                    uploadedVideoPath,

                  twinId:
                    selectedTwinId,

                  twinName,

                  productId:
                    selectedProductId,

                  product:
                    productName,

                  productName,

                  title:
                    `${twinName} Live Selling`,

                  description:
                    `Live selling ${productName}`,
                }),
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
              "Failed to start Facebook live."
          );
        }

        setLiveStatus(
          "Facebook Live started successfully."
        );
      } catch (error) {
        setLiveStatus(
          error.message ||
            "Failed to start Facebook live."
        );
      } finally {
        setLiveLoading(
          false
        );
      }
    };

  /* =========================================================
     FACEBOOK STOP
  ========================================================= */

  const stopFacebookLive =
    async () => {
      try {
        setLiveLoading(true);
        setLiveStatus("");

        const response =
          await fetch(
            `${LIVE_API}/stop-facebook`,
            {
              method:
                "POST",

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
              "Failed to stop Facebook live."
          );
        }

        setLiveStatus(
          "Facebook Live stopped."
        );
      } catch (error) {
        setLiveStatus(
          error.message ||
            "Failed to stop Facebook live."
        );
      } finally {
        setLiveLoading(
          false
        );
      }
    };

  /* =========================================================
     YOUTUBE START
  ========================================================= */

  const handleStartYouTubeLive =
    async () => {
      try {
        setLiveLoading(true);
        setLiveStatus("");

        if (
          !validateTwinAndProduct()
        ) {
          return;
        }

        if (
          !youtubeConnected
        ) {
          setLiveStatus(
            "YouTube is not connected. Please connect YouTube first."
          );

          navigate(
            "/app/connect"
          );

          return;
        }

        if (!isPro) {
          upgradeToPro();
          return;
        }

        if (!videoFile) {
          setLiveStatus(
            "Please choose a video file."
          );

          return;
        }

        setLiveStatus(
          "Uploading video..."
        );

        const uploadedVideoPath =
          await uploadVideo();

        if (
          !uploadedVideoPath
        ) {
          return;
        }

        setVideoPath(
          uploadedVideoPath
        );

        setLiveStatus(
          "Creating YouTube broadcast..."
        );

        const result =
          await dispatch(
            startYouTubeLive({
              videoPath:
                uploadedVideoPath,

              twinId:
                selectedTwinId,

              twinName,

              productId:
                selectedProductId,

              product:
                productName,

              productName,

              title:
                `${twinName} Live Selling`,

              description:
                `Live product presentation for ${productName}.`,

              onWaiting: (
                current,
                total,
                status
              ) => {
                setLiveStatus(
                  `Sending video to YouTube. Stream status: ${
                    status
                      ?.streamStatus ||
                    "inactive"
                  } (${current}/${total})`
                );
              },
            })
          ).unwrap();

        setLiveStatus(
          "You are now live on YouTube."
        );

        console.log(
          "YOUTUBE LIVE RESULT:",
          result
        );
      } catch (error) {
        setLiveStatus(
          typeof error ===
            "string"
            ? error
            : error?.message ||
                "Unable to start YouTube live."
        );
      } finally {
        setLiveLoading(
          false
        );
      }
    };

  /* =========================================================
     YOUTUBE STOP
  ========================================================= */

  const handleStopYouTubeLive =
    async () => {
      try {
        setLiveLoading(true);
        setLiveStatus("");

        await dispatch(
          stopYouTubeLive()
        ).unwrap();

        setLiveStatus(
          "YouTube live stopped successfully."
        );
      } catch (error) {
        setLiveStatus(
          typeof error ===
            "string"
            ? error
            : error?.message ||
                "Unable to stop YouTube live."
        );
      } finally {
        setLiveLoading(
          false
        );
      }
    };

  /* =========================================================
     CONTINUE PREVIEW
  ========================================================= */

  const continuePreview =
    async () => {
      try {
        setLiveLoading(true);
        setLiveStatus("");

        if (
          !validateTwinAndProduct()
        ) {
          return;
        }

        const allowedPlatforms =
          isPro
            ? selectedPlatforms
            : selectedPlatforms.slice(
                0,
                1
              );

        if (
          !allowedPlatforms.length
        ) {
          setLiveStatus(
            "Please select at least one connected platform."
          );

          return;
        }

        const response =
          await fetch(
            `${LIVE_API}/setup`,
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  scheduleId:
                    scheduleState
                      ?._id ||
                    scheduleState
                      ?.id ||
                    null,

                  twinId:
                    selectedTwinId,

                  twinName,

                  productId:
                    selectedProductId,

                  product:
                    productName,

                  productName,

                  platforms:
                    allowedPlatforms,

                  settings,
                  rtmpUrl,
                  videoPath,

                  plan: isPro
                    ? "pro"
                    : "free",
                }),
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
              "Unable to create live setup."
          );
        }

        const liveSessionId =
          data.liveSession
            ?._id ||
          data.data?._id ||
          data._id;

        if (
          !liveSessionId
        ) {
          throw new Error(
            "Live session ID was not returned."
          );
        }

        navigate(
          `/app/golive/preview/${liveSessionId}`
        );
      } catch (error) {
        setLiveStatus(
          error.message ||
            "Unable to continue preview."
        );
      } finally {
        setLiveLoading(
          false
        );
      }
    };

  const canContinue =
    Boolean(
      selectedTwinId &&
      selectedProductId &&
      selectedPlatforms.length
    ) &&
    !socialLoading &&
    !loadingTwins &&
    !loadingProducts;

  /* =========================================================
     UI
  ========================================================= */

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

          <div className="flex flex-wrap gap-2">
            <PlatformBadge
              icon={
                Instagram
              }
              label={
                socialLoading
                  ? "Checking Instagram..."
                  : instagramConnected
                  ? "Instagram Connected"
                  : "Instagram Not Connected"
              }
              active={
                instagramConnected
              }
            />

            <PlatformBadge
              icon={
                Facebook
              }
              label={
                socialLoading
                  ? "Checking Facebook..."
                  : facebookConnected
                  ? "Facebook Connected"
                  : "Facebook Not Connected"
              }
              active={
                facebookConnected
              }
              variant="blue"
            />

            <PlatformBadge
              icon={Youtube}
              label={
                socialLoading
                  ? "Checking YouTube..."
                  : youtubeConnected
                  ? "YouTube Connected"
                  : "YouTube Not Connected"
              }
              active={
                youtubeConnected
              }
              variant="red"
            />
          </div>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">
            Go Live
          </span>{" "}
          With Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Select an AI Twin and product
          from your backend, then stream
          to a connected platform.
        </p>
      </section>

      {liveStatus && (
        <section className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-bold text-foreground shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

          <span>
            {liveStatus}
          </span>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
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
                    event.target
                      .value
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
                    Loading AI
                    Twins...
                  </option>
                )}

                {!loadingTwins &&
                  !twins.length && (
                    <option value="">
                      No AI Twin
                      found
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
                    event.target
                      .value
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
                    Loading
                    products...
                  </option>
                )}

                {!loadingProducts &&
                  !products.length && (
                    <option value="">
                      No product
                      found
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

          <div className="mt-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select Connected
              Platforms
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Free plan allows one
              connected platform. Pro
              can select multiple
              platforms.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map(
                ({
                  id,
                  name,
                  icon: Icon,
                  pro,
                }) => {
                  const active =
                    selectedPlatforms.includes(
                      id
                    );

                  const locked =
                    pro &&
                    !isPro;

                  const isConnected =
                    connectedPlatforms.includes(
                      id
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
                      className={`relative rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                        active
                          ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                          : "border-border bg-background text-foreground"
                      } ${
                        !isConnected
                          ? "opacity-70"
                          : ""
                      }`}
                    >
                      {locked && (
                        <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                          PRO
                        </span>
                      )}

                      {!isConnected ||
                      locked ? (
                        <Lock className="h-6 w-6 text-[var(--brand-pink)]" />
                      ) : (
                        <Icon className="h-6 w-6 text-[var(--brand-pink)]" />
                      )}

                      <p className="mt-3 text-base font-black tracking-tight text-foreground">
                        {name}
                      </p>

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {active
                          ? "Selected"
                          : !isConnected
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
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-background p-5">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight brand-text">
              <Package className="h-5 w-5" />
              Upload Live Video
            </h2>

            <div className="mt-5">
              <Field
                icon={Package}
                label="Choose Video"
              >
                <input
                  type="file"
                  accept="video/*"
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
              </Field>

              {videoFile && (
                <p className="mt-3 text-sm font-bold text-muted-foreground">
                  Selected:{" "}
                  {
                    videoFile.name
                  }
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-background p-5">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight brand-text">
              <Instagram className="h-5 w-5" />
              Instagram RTMP Details
            </h2>

            <div className="mt-5 space-y-4">
              <Field
                icon={Radio}
                label="RTMP URL"
              >
                <input
                  value={
                    rtmpUrl
                  }
                  onChange={(
                    event
                  ) =>
                    setRtmpUrl(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                  placeholder="rtmps://live-upload.instagram.com:443/rtmp"
                />
              </Field>

              <Field
                icon={Lock}
                label="Stream Key"
              >
                <input
                  value={
                    streamKey
                  }
                  onChange={(
                    event
                  ) =>
                    setStreamKey(
                      event.target
                        .value
                    )
                  }
                  className={
                    inputClass
                  }
                  placeholder="Paste Instagram stream key"
                  type="password"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={
                    startInstagramRTMP
                  }
                  disabled={
                    liveLoading ||
                    socialLoading ||
                    !instagramConnected
                  }
                  className="brand-gradient rounded-[5px] py-3 text-sm font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {instagramConnected
                    ? liveLoading
                      ? "Please wait..."
                      : "Start Instagram RTMP"
                    : "Connect Instagram First"}
                </button>

                <button
                  type="button"
                  onClick={
                    stopInstagramRTMP
                  }
                  disabled={
                    liveLoading
                  }
                  className="rounded-[5px] border border-red-500 py-3 text-sm font-bold tracking-wide text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Stop Instagram Live
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-background p-5">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-blue-600">
              <Facebook className="h-5 w-5" />
              Facebook Live
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Facebook Live uses your
              connected Facebook Page
              token. No manual stream
              key is required.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  startFacebookLive
                }
                disabled={
                  liveLoading ||
                  socialLoading ||
                  !facebookConnected
                }
                className="rounded-[5px] bg-blue-600 py-3 text-sm font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {facebookConnected
                  ? liveLoading
                    ? "Please wait..."
                    : "Start Facebook Live"
                  : "Connect Facebook First"}
              </button>

              <button
                type="button"
                onClick={
                  stopFacebookLive
                }
                disabled={
                  liveLoading
                }
                className="rounded-[5px] border border-blue-600 py-3 text-sm font-bold tracking-wide text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Stop Facebook Live
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-background p-5">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-red-600">
              <Youtube className="h-5 w-5" />
              YouTube Live
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Create a YouTube
              broadcast, stream the
              uploaded video using
              FFmpeg and automatically
              start the broadcast when
              YouTube receives the
              video.
            </p>

            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <PreviewItem
                label="Connection"
                value={
                  youtubeConnected
                    ? "YouTube connected"
                    : "YouTube not connected"
                }
              />

              <div className="mt-3">
                <PreviewItem
                  label="Live Status"
                  value={
                    youtubeLiveStatus ||
                    "idle"
                  }
                />
              </div>
            </div>

            {youtubeLiveData
              ?.watchUrl && (
              <a
                href={
                  youtubeLiveData
                    .watchUrl
                }
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-600 underline"
              >
                Open YouTube Live

                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  handleStartYouTubeLive
                }
                disabled={
                  liveLoading ||
                  socialLoading ||
                  youtubeLiveLoading ||
                  !youtubeConnected ||
                  youtubeLiveStatus ===
                    "live"
                }
                className="rounded-[5px] bg-red-600 py-3 text-sm font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {!youtubeConnected
                  ? "Connect YouTube First"
                  : youtubeLiveLoading ||
                    liveLoading
                  ? "Starting YouTube..."
                  : youtubeLiveStatus ===
                    "live"
                  ? "YouTube Live Active"
                  : "Start YouTube Live"}
              </button>

              <button
                type="button"
                onClick={
                  handleStopYouTubeLive
                }
                disabled={
                  liveLoading ||
                  youtubeLiveLoading ||
                  youtubeLiveStatus !==
                    "live"
                }
                className="rounded-[5px] border border-red-600 py-3 text-sm font-bold tracking-wide text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Stop YouTube Live
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <LiveToggle
              icon={
                MessageSquare
              }
              title="Enable Live Chat"
              desc="Allow viewers to comment and ask questions."
              active={
                settings.liveChat
              }
              onClick={() =>
                toggleSetting(
                  "liveChat"
                )
              }
            />

            <LiveToggle
              icon={Link2}
              title="Show Product Link"
              desc="Display buy link while AI Twin is selling."
              active={
                settings.productLink
              }
              onClick={() =>
                toggleSetting(
                  "productLink"
                )
              }
            />

            <LiveToggle
              icon={Bot}
              title="Auto Answer Customer Questions"
              desc="AI Twin answers product questions automatically."
              active={
                settings.autoAnswer
              }
              onClick={() =>
                toggleSetting(
                  "autoAnswer"
                )
              }
            />

            <LiveToggle
              icon={Radio}
              title="Multi-Platform Sync"
              desc="Sync AI Twin live flow across all selected platforms."
              active={
                settings.multiPlatformSync
              }
              proOnly={
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

          <button
            type="button"
            onClick={
              continuePreview
            }
            disabled={
              !canContinue
            }
            className="brand-gradient mt-8 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Preview

            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Live Setup Preview
          </h2>

          <div className="mt-5 space-y-3 rounded-3xl border border-border bg-background p-5">
            <PreviewItem
              label="AI Twin"
              value={
                selectedTwin
                  ? twinName
                  : "No AI Twin selected"
              }
            />

            <PreviewItem
              label="Twin ID"
              value={
                selectedTwinId ||
                "Not selected"
              }
            />

            <PreviewItem
              label="Product"
              value={
                selectedProduct
                  ? productName
                  : "No product selected"
              }
            />

            <PreviewItem
              label="Product ID"
              value={
                selectedProductId ||
                "Not selected"
              }
            />

            <PreviewItem
              label="Platforms"
              value={
                selectedPlatforms.length
                  ? selectedPlatforms
                      .map(
                        (id) =>
                          platforms.find(
                            (
                              item
                            ) =>
                              item.id ===
                              id
                          )?.name ||
                          id
                      )
                      .join(", ")
                  : "No platform selected"
              }
            />

            <PreviewItem
              label="Instagram"
              value={
                instagramConnected
                  ? "Connected"
                  : "Not connected"
              }
            />

            <PreviewItem
              label="Facebook"
              value={
                facebookConnected
                  ? "Connected"
                  : "Not connected"
              }
            />

            <PreviewItem
              label="YouTube"
              value={
                youtubeConnected
                  ? "Connected"
                  : "Not connected"
              }
            />

            <PreviewItem
              label="YouTube Live"
              value={
                youtubeLiveStatus
              }
            />

            <PreviewItem
              label="Video"
              value={
                videoFile
                  ? videoFile.name
                  : "No video selected"
              }
            />
          </div>

          {youtubeLiveData
            ?.watchUrl && (
            <a
              href={
                youtubeLiveData
                  .watchUrl
              }
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[5px] bg-red-600 px-5 py-3 text-sm font-bold text-white"
            >
              Open YouTube Live

              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   PLATFORM BADGE
========================================================= */

function PlatformBadge({
  icon: Icon,
  label,
  active,
  variant,
}) {
  const activeClass =
    variant === "blue"
      ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      : variant === "red"
      ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      : "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
        active
          ? activeClass
          : "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
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
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black tracking-tight text-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   LIVE TOGGLE
========================================================= */

function LiveToggle({
  icon: Icon,
  title,
  desc,
  active,
  onClick,
  proOnly,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          {proOnly ? (
            <Lock className="h-5 w-5" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </div>

        <div>
          <p className="text-sm font-black tracking-tight text-foreground">
            {title}
          </p>

          <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
            {proOnly
              ? "Unlock with Pro plan."
              : desc}
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold tracking-wide text-emerald-600">
        {proOnly
          ? "PRO"
          : active
          ? "ON"
          : "OFF"}
      </span>
    </button>
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
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-bold tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-foreground">
        {String(
          value ??
            "Not available"
        )}
      </p>
    </div>
  );
}