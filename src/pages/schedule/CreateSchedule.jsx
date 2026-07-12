
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
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
  Calendar,
  Clock,
  Radio,
  Sparkles,
  Save,
  CheckCircle2,
  ArrowLeft,
  UserRound,
  Package,
  Crown,
  Lock,
  AlertCircle,
  Video,
  Timer,
  Link2,
} from "lucide-react";

import {
  fetchMe,
} from "../../features/auth/authSlice";

import {
  fetchConnections,
} from "../../features/social/socialSlice";

const API =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "https://twinn-backend.onrender.com/api";

const PLATFORM_PRIORITY = [
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
];

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    pro: false,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    pro: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    pro: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    pro: true,
  },
];

const normalizePlatform = (
  platform = ""
) =>
  String(platform)
    .trim()
    .toLowerCase();

const sortPlatformsByPriority = (
  selectedPlatforms = []
) => {
  return [...selectedPlatforms].sort(
    (first, second) => {
      const firstPriority =
        PLATFORM_PRIORITY.indexOf(
          normalizePlatform(first)
        );

      const secondPriority =
        PLATFORM_PRIORITY.indexOf(
          normalizePlatform(second)
        );

      return firstPriority - secondPriority;
    }
  );
};

const getConnection = (
  connections,
  platform
) => {
  return connections.find(
    (connection) =>
      normalizePlatform(
        connection?.platform
      ) === platform &&
      connection?.connected !== false
  );
};

export default function CreateSchedule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const {
    connections = [],
    loading: socialLoading,
  } = useSelector(
    (state) => state.social || {}
  );

  const plan = String(
    user?.plan || "free"
  ).toLowerCase();

  const isPro =
    plan === "pro" ||
    plan === "business" ||
    plan === "agency";

  const maxSchedules =
    isPro ? 50 : 1;

  const maxPlatforms =
    isPro ? 4 : 1;

  const [
    existingCount,
    setExistingCount,
  ] = useState(0);

  const [
    loadingCount,
    setLoadingCount,
  ] = useState(false);

  const [twin, setTwin] = useState({
    id: 1,
    name: "My AI Twin",
    image: "/images/bb.png",
    voice: "Warm Female",
    status: "Active",
  });

  const [products, setProducts] =
    useState([]);

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(false);

  const [title, setTitle] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [
    selectedPlatforms,
    setSelectedPlatforms,
  ] = useState([]);

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    videoPath,
    setVideoPath,
  ] = useState("");


  const [videoFile, setVideoFile] = useState(null);

const [uploadingVideo, setUploadingVideo] =
  useState(false);

const [videoUploadProgress, setVideoUploadProgress] =
  useState(0);
  const [
    durationMinutes,
    setDurationMinutes,
  ] = useState(30);

  const [saved, setSaved] = useState(false);

const [saving, setSaving] = useState(false);

const [error, setError] = useState("");

const [instagramRtmpUrl, setInstagramRtmpUrl] = useState(
  "rtmps://live-upload.instagram.com:443/rtmp"
);

const [instagramStreamKey, setInstagramStreamKey] = useState("");



    const uploadLiveVideo = async () => {
  try {
    setError("");

    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    setUploadingVideo(true);
    setVideoUploadProgress(0);

    const formData = new FormData();

    formData.append("video", videoFile);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `${API}/live/upload-video`
    );

    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round(
        (event.loaded / event.total) * 100
      );

      setVideoUploadProgress(progress);
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(
          xhr.responseText || "{}"
        );

        if (
          xhr.status < 200 ||
          xhr.status >= 300 ||
          data.success === false
        ) {
          throw new Error(
            data.message || "Video upload failed."
          );
        }

        const uploadedUrl =
          data.data?.videoUrl ||
          data.videoUrl ||
          data.videoPath;

        if (!uploadedUrl) {
          throw new Error(
            "Uploaded video URL was not returned."
          );
        }

        setVideoPath(uploadedUrl);

        localStorage.setItem(
          "selectedVideoUrl",
          uploadedUrl
        );

        setVideoUploadProgress(100);
      } catch (uploadError) {
        setError(
          uploadError.message ||
            "Video upload failed."
        );
      } finally {
        setUploadingVideo(false);
      }
    };

    xhr.onerror = () => {
      setUploadingVideo(false);

      setError(
        "Unable to upload video. Check your connection."
      );
    };

    xhr.send(formData);
  } catch (uploadError) {
    setUploadingVideo(false);

    setError(
      uploadError.message ||
        "Unable to upload video."
    );
  }
};

  const selectedProduct =
    useMemo(() => {
      return products.find(
        (item) =>
          String(
            item._id || item.id
          ) ===
          String(selectedProductId)
      );
    }, [
      products,
      selectedProductId,
    ]);

  const connectedPlatforms =
    useMemo(() => {
      return connections
        .filter(
          (connection) =>
            connection?.connected !==
            false
        )
        .map((connection) =>
          normalizePlatform(
            connection.platform
          )
        )
        .filter(Boolean);
    }, [connections]);

  const activeScheduleCount =
    existingCount;

  const reachedLimit =
    activeScheduleCount >=
    maxSchedules;

  const instagramConnection =
    useMemo(
      () =>
        getConnection(
          connections,
          "instagram"
        ),
      [connections]
    );

  

    const saveInstagramRtmp = async () => {
  try {
    setError("");
    setInstagramRtmpSaved(false);

    if (!instagramRtmpUrl.trim()) {
      setError("Instagram RTMP URL is required.");
      return;
    }

    if (!instagramStreamKey.trim()) {
      setError("Instagram stream key is required.");
      return;
    }

    setSavingInstagramRtmp(true);

    const res = await fetch(
      `${API}/social/connections/instagram/rtmp`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rtmpUrl: instagramRtmpUrl.trim(),
          streamKey: instagramStreamKey.trim(),
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      throw new Error(
        data.message || "Unable to save Instagram RTMP settings."
      );
    }

    setInstagramRtmpSaved(true);

    await dispatch(fetchConnections());

    setInstagramStreamKey("");
  } catch (saveError) {
    setError(
      saveError.message ||
        "Unable to save Instagram RTMP settings."
    );
  } finally {
    setSavingInstagramRtmp(false);
  }
};

  const minimumDate = new Date()
    .toISOString()
    .split("T")[0];

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const loadScheduleCount =
    async () => {
      try {
        setLoadingCount(true);

        const res = await fetch(
          `${API}/schedules`,
          {
            credentials:
              "include",
          }
        );

        const data = await res
          .json()
          .catch(() => ({}));

        if (
          !res.ok ||
          data.success === false
        ) {
          return;
        }

        const list =
          Array.isArray(data)
            ? data
            : data.schedules ||
              data.data ||
              [];

        const activeSchedules =
          Array.isArray(list)
            ? list.filter(
                (schedule) =>
                  [
                    "upcoming",
                    "starting",
                    "live",
                  ].includes(
                    String(
                      schedule.status ||
                        "Upcoming"
                    ).toLowerCase()
                  )
              )
            : [];

        setExistingCount(
          activeSchedules.length
        );
      } catch (loadError) {
        console.error(
          "LOAD SCHEDULE COUNT ERROR:",
          loadError
        );
      } finally {
        setLoadingCount(false);
      }
    };

  const loadProducts =
    async () => {
      try {
        setLoadingProducts(true);
        setError("");

        const res = await fetch(
          `${API}/products`,
          {
            method: "GET",
            credentials:
              "include",
          }
        );

        const data = await res
          .json()
          .catch(() => ({}));

        if (
          !res.ok ||
          data.success === false
        ) {
          throw new Error(
            data.message ||
              "Unable to load products"
          );
        }

        const productList =
          Array.isArray(data)
            ? data
            : data.products ||
              data.data ||
              [];

        const normalizedProducts =
          Array.isArray(
            productList
          )
            ? productList
            : [];

        setProducts(
          normalizedProducts
        );

        const savedProduct =
          localStorage.getItem(
            "selectedProduct"
          );

        let savedProductId = "";

        if (savedProduct) {
          try {
            const parsed =
              JSON.parse(
                savedProduct
              );

            savedProductId =
              parsed?._id ||
              parsed?.id ||
              "";
          } catch {
            savedProductId = "";
          }
        }

        const savedProductExists =
          normalizedProducts.some(
            (item) =>
              String(
                item._id ||
                  item.id
              ) ===
              String(
                savedProductId
              )
          );

        if (savedProductExists) {
          setSelectedProductId(
            savedProductId
          );
        } else if (
          normalizedProducts.length >
          0
        ) {
          setSelectedProductId(
            normalizedProducts[0]
              ._id ||
              normalizedProducts[0]
                .id
          );
        } else {
          setSelectedProductId(
            ""
          );
        }
      } catch (loadError) {
        console.error(
          "LOAD PRODUCTS ERROR:",
          loadError
        );

        setProducts([]);
        setSelectedProductId(
          ""
        );

        setError(
          loadError.message ||
            "Unable to load products"
        );
      } finally {
        setLoadingProducts(false);
      }
    };

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }

    dispatch(
      fetchConnections()
    );

    loadScheduleCount();
    loadProducts();

    const savedTwin =
      JSON.parse(
        localStorage.getItem(
          "aiTwin"
        ) || "{}"
      );

    const twinName =
      localStorage.getItem(
        "twinName"
      ) || "My AI Twin";

    const twinImage =
      localStorage.getItem(
        "twinImage"
      ) || "/images/bb.png";

    const voiceStyle =
      localStorage.getItem(
        "voiceStyle"
      ) || "Warm Female";

    setTwin({
      id:
        savedTwin._id ||
        savedTwin.id ||
        1,

      name:
        savedTwin.name ||
        twinName,

      image:
        savedTwin.image ||
        savedTwin.imageUrl ||
        twinImage,

      voice:
        savedTwin.voice ||
        voiceStyle,

      status:
        savedTwin.status ||
        "Active",
    });

    const storedVideoPath =
      localStorage.getItem(
        "selectedVideoUrl"
      ) ||
      localStorage.getItem(
        "videoPath"
      ) ||
      "";

    if (storedVideoPath) {
      setVideoPath(
        storedVideoPath
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (
      !connectedPlatforms.length
    ) {
      setSelectedPlatforms(
        []
      );

      return;
    }

    const sorted =
      sortPlatformsByPriority(
        connectedPlatforms
      );

    setSelectedPlatforms(
      isPro
        ? sorted
        : sorted.slice(0, 1)
    );
  }, [
    connectedPlatforms,
    isPro,
  ]);

  const togglePlatform = (
    platformId
  ) => {
    setError("");

    const platformItem =
      platforms.find(
        (item) =>
          item.id === platformId
      );

    const isSelected =
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

      navigate("/app/connect");

      return;
    }

    if (
      platformItem?.pro &&
      !isPro &&
      !isSelected
    ) {
      upgradeToPro();
      return;
    }

    if (isSelected) {
      setSelectedPlatforms(
        (current) =>
          current.filter(
            (item) =>
              item !== platformId
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
        setError(
          `You can select up to ${maxPlatforms} platforms.`
        );
      }

      return;
    }

    setSelectedPlatforms(
      (current) =>
        sortPlatformsByPriority([
          ...current,
          platformId,
        ])
    );
  };

  const validateSchedule = () => {
    if (reachedLimit) {
      return isPro
        ? `You have reached the limit of ${maxSchedules} active schedules.`
        : "Free schedule limit reached. Upgrade to Pro to create more schedules.";
    }

    if (
      !selectedProductId ||
      !selectedProduct
    ) {
      return "Please select a product.";
    }

    if (!date || !time) {
      return "Please select a date and time.";
    }

    if (
      !selectedPlatforms.length
    ) {
      return "Please select at least one connected platform.";
    }

    if (!videoPath) {
  return "Please upload a video.";
}

    const scheduledDate =
      new Date(
        `${date}T${time}:00`
      );

    if (
      Number.isNaN(
        scheduledDate.getTime()
      )
    ) {
      return "Please select a valid date and time.";
    }

    if (
      scheduledDate.getTime() <=
      Date.now()
    ) {
      return "Scheduled date and time must be in the future.";
    }

    if (
      selectedPlatforms.includes(
        "instagram"
      ) &&
      !instagramRtmpConfigured
    ) {
      return "Configure the Instagram RTMP URL and stream key before scheduling Instagram Live.";
    }

    const invalidConnection =
      selectedPlatforms.find(
        (platformId) =>
          !connectedPlatforms.includes(
            platformId
          )
      );

    if (invalidConnection) {
      return `Connect ${invalidConnection} before creating this schedule.`;
    }

    const duration =
      Number(durationMinutes);

    if (
      Number.isNaN(duration) ||
      duration < 1 ||
      duration > 480
    ) {
      return "Duration must be between 1 and 480 minutes.";
    }

    return "";
  };

  const saveSchedule =
    async () => {
      try {
        setError("");
        setSaved(false);

        const validationError =
          validateSchedule();

        if (validationError) {
          setError(
            validationError
          );

          if (reachedLimit) {
            upgradeToPro();
          }

          return;
        }

        setSaving(true);

        const localDateTime =
          new Date(
            `${date}T${time}:00`
          );

        const orderedPlatforms =
          sortPlatformsByPriority(
            isPro
              ? selectedPlatforms
              : selectedPlatforms.slice(
                  0,
                  1
                )
          );

        const productName =
          selectedProduct.name ||
          selectedProduct
            .productName ||
          "Unnamed Product";

        const payload = {
          twinId:
            twin._id ||
            twin.id,

          twinName:
            twin.name,

          twinImage:
            twin.image,

          twinVoice:
            twin.voice,

          productId:
            selectedProduct._id ||
            selectedProduct.id,

          product:
            productName,

          productName,

          title:
            title.trim() ||
            `${productName} Live Sale`,

          description:
            description.trim(),

          videoPath:
            videoPath.trim(),

          platforms:
            orderedPlatforms,

          scheduledAt:
            localDateTime.toISOString(),

          timezone:
            Intl.DateTimeFormat()
              .resolvedOptions()
              .timeZone ||
            "Asia/Kolkata",

          durationMinutes:
            Number(
              durationMinutes
            ),

          plan,
        };

        const res = await fetch(
          `${API}/schedules`,
          {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

        const data = await res
          .json()
          .catch(() => ({}));

        if (
          !res.ok ||
          data.success === false
        ) {
          throw new Error(
            data.message ||
              "Unable to save schedule"
          );
        }

        localStorage.setItem(
          "selectedProduct",
          JSON.stringify(
            selectedProduct
          )
        );

        localStorage.setItem(
          "selectedPlatforms",
          JSON.stringify(
            orderedPlatforms
          )
        );

        localStorage.setItem(
          "selectedTwin",
          JSON.stringify({
            id:
              twin._id ||
              twin.id,

            name:
              twin.name,

            image:
              twin.image,

            voice:
              twin.voice,
          })
        );

        localStorage.setItem(
          "selectedVideoUrl",
          videoPath.trim()
        );

        setSaved(true);

        window.setTimeout(
          () => {
            navigate(
              "/app/schedule"
            );
          },
          1000
        );
      } catch (saveError) {
        setError(
          saveError.message ||
            "Unable to save schedule"
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="mx-auto max-w-5xl space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/schedule"
            )
          }
          className="mb-5 flex items-center gap-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}

            {isPro
              ? "CREATE PRO LIVE SCHEDULE"
              : "CREATE LIVE SCHEDULE"}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
              isPro
                ? "bg-pink-500 text-white"
                : "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
            }`}
          >
            {isPro ? (
              <Crown className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}

            {isPro
              ? `${plan.toUpperCase()} PLAN ACTIVE`
              : `FREE ${
                  loadingCount
                    ? "..."
                    : activeScheduleCount
                }/${maxSchedules}`}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">
            {isPro
              ? "Schedule Pro"
              : "Schedule"}
          </span>{" "}
          Your AI Twin Live
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          {isPro
            ? "Choose your AI Twin, product, connected platforms, video and schedule time. Instagram starts first when selected."
            : "Free plan supports one active schedule and one connected platform."}
        </p>

        {!connectedPlatforms.length &&
          !socialLoading && (
            <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-white/10 dark:bg-white/10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-orange-600 dark:text-orange-400">
                    No connected platform found
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect Instagram, YouTube, Facebook or TikTok before scheduling.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/app/connect"
                    )
                  }
                  className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
                >
                  Connect Platform
                </button>
              </div>
            </div>
          )}

      {selectedPlatforms.includes("instagram") && (
  <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/10">
    <div>
      <p className="text-sm font-black text-orange-600 dark:text-orange-400">
        Instagram RTMP details for this live
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Every user must enter the RTMP URL and stream key for this scheduled
        Instagram live.
      </p>
    </div>

    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-black text-foreground">
          Instagram RTMP URL
        </label>

        <input
          type="text"
          value={instagramRtmpUrl}
          onChange={(event) =>
            setInstagramRtmpUrl(event.target.value)
          }
          className={`${inputClass} mt-2`}
          placeholder="rtmps://live-upload.instagram.com:443/rtmp"
        />
      </div>

      <div>
        <label className="text-sm font-black text-foreground">
          Instagram Stream Key
        </label>

        <input
          type="password"
          value={instagramStreamKey}
          onChange={(event) =>
            setInstagramStreamKey(event.target.value)
          }
          className={`${inputClass} mt-2`}
          placeholder="Paste stream key for this live"
          autoComplete="off"
        />
      </div>
    </div>

    <button
      type="button"
      onClick={() =>
        window.open(
          "https://www.instagram.com/live/producer/",
          "_blank",
          "noopener,noreferrer"
        )
      }
      className="mt-4 rounded-[5px] border-2 border-orange-500 px-5 py-3 text-sm font-bold text-orange-600"
    >
      Open Instagram Live Producer
    </button>
  </div>
)}

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Schedule Limit:{" "}
                  {loadingCount
                    ? "..."
                    : activeScheduleCount}
                  /{maxSchedules}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Upgrade to Pro for up to 50 active schedules and multiple platforms.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  upgradeToPro
                }
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {reachedLimit && (
          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
            {isPro
              ? `You have reached your limit of ${maxSchedules} active schedules.`
              : "Free schedule limit reached. Upgrade to Pro to create more schedules."}
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select AI Twin
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Your scheduled live session will use this AI Twin.
            </p>

            <div className="mt-4 rounded-2xl border-2 border-[var(--brand-pink)] bg-pink-50 p-5 dark:bg-white/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={twin.image}
                  alt={twin.name}
                  className="h-24 w-24 rounded-2xl bg-background object-cover"
                  onError={(event) => {
                    event.currentTarget.src =
                      "/images/bb.png";
                  }}
                />

                <div className="flex-1">
                  <h3 className="text-lg font-black tracking-tight text-foreground">
                    {twin.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    Voice:{" "}
                    {twin.voice}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      ✓ Active Twin
                    </span>

                    <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-bold tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
                      {isPro
                        ? "Paid Twin Account"
                        : "Free Twin Account"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/app/twin"
                    )
                  }
                  className="rounded-[5px] border-2 border-[var(--brand-pink)] px-4 py-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-100 dark:hover:bg-white/10"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Select Product">
              <select
                value={
                  selectedProductId
                }
                onChange={(event) =>
                  setSelectedProductId(
                    event.target.value
                  )
                }
                disabled={
                  loadingProducts ||
                  products.length === 0
                }
                className={
                  inputClass
                }
              >
                {loadingProducts ? (
                  <option value="">
                    Loading products...
                  </option>
                ) : products.length ===
                  0 ? (
                  <option value="">
                    No products found
                  </option>
                ) : (
                  <>
                    <option
                      value=""
                      disabled
                    >
                      Select a product
                    </option>

                    {products.map(
                      (item) => {
                        const productId =
                          item._id ||
                          item.id;

                        const productName =
                          item.name ||
                          item.productName ||
                          "Unnamed Product";

                        const productPrice =
                          Number(
                            item.price
                          );

                        return (
                          <option
                            key={
                              productId
                            }
                            value={
                              productId
                            }
                          >
                            {
                              productName
                            }
                            {!Number.isNaN(
                              productPrice
                            )
                              ? ` - ₹${productPrice.toLocaleString(
                                  "en-IN"
                                )}`
                              : ""}
                          </option>
                        );
                      }
                    )}
                  </>
                )}
              </select>

              {!loadingProducts &&
                products.length ===
                  0 && (
                  <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm font-medium text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
                    You have not added any products yet.

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/app/products/add"
                        )
                      }
                      className="ml-2 font-black underline"
                    >
                      Add Product
                    </button>
                  </div>
                )}
            </Field>

            <Field label="Live Title">
              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
                placeholder="Ex: Glow Serum Evening Sale"
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                min={minimumDate}
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Live Duration">
              <div className="relative">
                <Timer className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-pink)]" />

                <input
                  type="number"
                  min="1"
                  max="480"
                  value={
                    durationMinutes
                  }
                  onChange={(event) =>
                    setDurationMinutes(
                      event.target.value
                    )
                  }
                  className={`${inputClass} pl-12`}
                  placeholder="30"
                />
              </div>

              <p className="mt-2 text-xs font-medium text-muted-foreground">
                The live stream will automatically stop after this duration.
              </p>
            </Field>

           <Field label="Upload Live Video">
  <div className="rounded-2xl border border-border bg-background p-4">
    <input
      type="file"
      accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
      onChange={(event) => {
        const file =
          event.target.files?.[0] || null;

        setVideoFile(file);
        setVideoPath("");
        setVideoUploadProgress(0);
        setError("");
      }}
      className="block w-full text-sm font-medium text-foreground file:mr-4 file:rounded-[5px] file:border-0 file:bg-pink-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-[var(--brand-pink)]"
    />

    {videoFile && (
      <div className="mt-4">
        <p className="truncate text-sm font-bold text-foreground">
          {videoFile.name}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {(
            videoFile.size /
            (1024 * 1024)
          ).toFixed(2)}{" "}
          MB
        </p>
      </div>
    )}

    {uploadingVideo && (
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="brand-gradient h-full transition-all"
            style={{
              width: `${videoUploadProgress}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs font-bold text-muted-foreground">
          Uploading {videoUploadProgress}%
        </p>
      </div>
    )}

    {videoPath && (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-600">
        <CheckCircle2 className="h-5 w-5" />
        Video uploaded successfully
      </div>
    )}

    <button
      type="button"
      onClick={uploadLiveVideo}
      disabled={
        !videoFile ||
        uploadingVideo ||
        Boolean(videoPath)
      }
      className="brand-gradient mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Video className="h-4 w-4" />

      {uploadingVideo
        ? `Uploading ${videoUploadProgress}%`
        : videoPath
        ? "Video Uploaded"
        : "Upload Video"}
    </button>
  </div>

  <p className="mt-2 text-xs font-medium text-muted-foreground">
    Supported formats: MP4, MOV, WebM and MKV.
  </p>
</Field>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select Connected Platforms
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              {isPro
                ? "Choose one or more connected platforms. Instagram will start first when selected."
                : "Free plan allows only one connected platform."}
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
                    pro && !isPro;

                  const isConnected =
                    connectedPlatforms.includes(
                      id
                    );

                  const needsInstagramRtmp =
                    id ===
                      "instagram" &&
                    isConnected &&
                    !instagramRtmpConfigured;

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

                      {id ===
                        "instagram" &&
                        active && (
                          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-[9px] font-black text-white">
                            FIRST
                          </span>
                        )}

                      {!isConnected ||
                      locked ? (
                        <Lock className="mt-5 h-6 w-6 text-[var(--brand-pink)]" />
                      ) : (
                        <Icon className="mt-5 h-6 w-6 text-[var(--brand-pink)]" />
                      )}

                      <p className="mt-3 text-base font-black tracking-tight text-foreground">
                        {name}
                      </p>

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {needsInstagramRtmp
                          ? "Configure RTMP"
                          : active
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

          <Field label="Live Description">
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              className="mt-3 w-full rounded-2xl border border-border bg-background p-4 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
              rows="5"
              placeholder="Describe what your AI Twin should talk about during this live..."
            />
          </Field>

          <button
            type="button"
            onClick={
              saveSchedule
            }
            disabled={
  saving ||
  uploadingVideo ||
  loadingProducts ||
  !selectedProductId ||
  !selectedProduct ||
  !date ||
  !time ||
  !videoPath ||
  selectedPlatforms.length === 0 ||
  reachedLimit
}
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {saving
              ? "Saving..."
              : reachedLimit
              ? "Upgrade Required"
              : "Save Schedule"}
          </button>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Live Preview
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-4">
              <img
                src={twin.image}
                alt={twin.name}
                className="h-16 w-16 rounded-2xl object-cover"
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/bb.png";
                }}
              />

              <div>
                <h3 className="font-black tracking-tight text-foreground">
                  {twin.name}
                </h3>

                <p className="text-xs font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                  ● Active
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Info
                icon={UserRound}
                label="AI Twin"
                value={twin.name}
              />

              <Info
                icon={Package}
                label="Product"
                value={
                  selectedProduct
                    ?.name ||
                  selectedProduct
                    ?.productName ||
                  "Not selected"
                }
              />

              <Info
                icon={Calendar}
                label="Date"
                value={
                  date ||
                  "Not selected"
                }
              />

              <Info
                icon={Clock}
                label="Time"
                value={
                  time ||
                  "Not selected"
                }
              />

              <Info
                icon={Timer}
                label="Duration"
                value={`${durationMinutes || 0} minutes`}
              />

              <Info
                icon={Radio}
                label="Platforms"
                value={
                  selectedPlatforms.length
                    ? sortPlatformsByPriority(
                        selectedPlatforms
                      )
                        .map(
                          (id) =>
                            platforms.find(
                              (item) =>
                                item.id ===
                                id
                            )?.name ||
                            id
                        )
                        .join(", ")
                    : "Not selected"
                }
              />

              <Info
                icon={Link2}
                label="Video"
                value={
                  videoPath
                    ? "Video URL added"
                    : "Not added"
                }
              />
            </div>
          </div>

          {selectedPlatforms.includes(
            "instagram"
          ) && (
            <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm font-medium text-muted-foreground dark:border-white/10 dark:bg-white/10">
              <p className="font-black text-[var(--brand-pink)]">
                Instagram Priority
              </p>

              <p className="mt-1">
                Instagram will be started before the other selected platforms.
              </p>
            </div>
          )}

          {saved && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Schedule saved successfully
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <div>
      <label className="text-sm font-black tracking-tight text-foreground">
        {label}
      </label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
        {label}
      </div>

      <p className="mt-2 break-words text-sm font-black tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

