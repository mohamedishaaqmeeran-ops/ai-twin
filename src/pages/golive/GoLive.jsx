import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
} from "lucide-react";

import { fetchMe } from "../../features/auth/authSlice";
import { fetchConnections } from "../../features/social/socialSlice";

const API = "https://twinn-backend.onrender.com/api";
const LIVE_API = `${API}/live`;

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, pro: false },
  { id: "youtube", name: "YouTube", icon: Youtube, pro: true },
  { id: "facebook", name: "Facebook", icon: Facebook, pro: true },
  { id: "tiktok", name: "TikTok", icon: Music2, pro: true },
];

const defaultProducts = [
  "Vitamin C Glow Serum",
  "Wireless Headphone",
  "Smart Watch",
];

const normalizePlatform = (platform = "") =>
  platform.toString().trim().toLowerCase();

export default function GoLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const { connections = [], loading: socialLoading } = useSelector(
    (state) => state.social || {}
  );

  const plan = user?.plan || "free";
  const isPro = plan === "pro" || plan === "business";
  const maxPlatforms = isPro ? 4 : 1;

  const scheduleState = location.state?.schedule;
  const productState = location.state?.product;
  const platformState = location.state?.platforms;

  const [videoFile, setVideoFile] = useState(null);
  const [twinName, setTwinName] = useState("My AI Twin");
  const [product, setProduct] = useState(productState || "Vitamin C Glow Serum");
  const [products, setProducts] = useState(defaultProducts);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const [rtmpUrl, setRtmpUrl] = useState(
    "rtmps://live-upload.instagram.com:443/rtmp"
  );
  const [streamKey, setStreamKey] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [settings, setSettings] = useState({
    liveChat: true,
    productLink: true,
    autoAnswer: true,
    multiPlatformSync: false,
  });

  const connectedPlatforms = useMemo(() => {
    return connections
      .filter((item) => item?.connected !== false)
      .map((item) => normalizePlatform(item.platform))
      .filter(Boolean);
  }, [connections]);

  const instagramConnected = connectedPlatforms.includes("instagram");

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

  const upgradeToPro = () => navigate("/pricing");

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);

      const res = await fetch(`${API}/products`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) return;

      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      if (Array.isArray(list) && list.length) {
        const productNames = list.map((item) => item.name).filter(Boolean);
        setProducts([...new Set([...defaultProducts, ...productNames])]);
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }

    dispatch(fetchConnections());
    loadProducts();

    setTwinName(localStorage.getItem("twinName") || "My AI Twin");

    const selectedProduct =
      productState ||
      scheduleState?.product ||
      scheduleState?.productName ||
      localStorage.getItem("selectedProduct");

    if (selectedProduct) {
      setProduct(selectedProduct);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!connectedPlatforms.length) {
      setSelectedPlatforms([]);
      setLiveStatus("Please connect Instagram before going live.");
      return;
    }

    let preferredPlatforms = [];

    if (Array.isArray(platformState) && platformState.length) {
      preferredPlatforms = platformState.map(normalizePlatform);
    } else if (Array.isArray(scheduleState?.platforms)) {
      preferredPlatforms = scheduleState.platforms.map(normalizePlatform);
    } else {
      preferredPlatforms = connectedPlatforms;
    }

    const allowedConnected = preferredPlatforms.filter((platform) =>
      connectedPlatforms.includes(platform)
    );

    setSelectedPlatforms(
      isPro ? allowedConnected : allowedConnected.slice(0, 1)
    );

    if (!connectedPlatforms.includes("instagram")) {
      setLiveStatus("Instagram is not connected. Connect Instagram first.");
    } else {
      setLiveStatus("");
    }
  }, [connectedPlatforms, isPro, platformState, scheduleState]);

  const uploadVideo = async () => {
    if (!videoFile) {
      setLiveStatus("Please choose a video file.");
      return null;
    }

    const formData = new FormData();
    formData.append("video", videoFile);

    const res = await fetch(`${LIVE_API}/upload-video`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Video upload failed");
    }

    return data.videoPath || data.path || data.url;
  };

  const togglePlatform = (platformId) => {
    const item = platforms.find((p) => p.id === platformId);
    const active = selectedPlatforms.includes(platformId);
    const isConnected = connectedPlatforms.includes(platformId);

    if (!isConnected) {
      alert("Please connect this platform first.");
      navigate("/app/connect");
      return;
    }

    if (item?.pro && !isPro && !active) {
      upgradeToPro();
      return;
    }

    if (active) {
      setSelectedPlatforms((prev) => prev.filter((item) => item !== platformId));
      return;
    }

    if (!isPro && selectedPlatforms.length >= maxPlatforms) {
      upgradeToPro();
      return;
    }

    setSelectedPlatforms((prev) => [...prev, platformId]);
  };

  const toggleSetting = (key, proOnly = false) => {
    if (proOnly && !isPro) {
      upgradeToPro();
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const startInstagramRTMP = async () => {
    try {
      setLiveLoading(true);
      setLiveStatus("");

      if (!instagramConnected) {
        setLiveStatus("Instagram is not connected. Please connect Instagram first.");
        navigate("/app/connect");
        return;
      }

      if (!rtmpUrl || !streamKey || !videoFile) {
        setLiveStatus("RTMP URL, Stream Key and Video file are required.");
        return;
      }

      const uploadedVideoPath = await uploadVideo();

      if (!uploadedVideoPath) return;

      setVideoPath(uploadedVideoPath);

      const res = await fetch(`${LIVE_API}/start-instagram-rtmp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rtmpUrl,
          streamKey,
          videoPath: uploadedVideoPath,
          product,
          twinName,
          platforms: ["instagram"],
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to start live");
      }

      setLiveStatus("Instagram RTMP stream started successfully.");
    } catch (error) {
      setLiveStatus(error.message || "Failed to start live.");
    } finally {
      setLiveLoading(false);
    }
  };

  const stopInstagramRTMP = async () => {
    try {
      setLiveLoading(true);
      setLiveStatus("");

      const res = await fetch(`${LIVE_API}/stop-instagram-rtmp`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to stop live");
      }

      setLiveStatus("Instagram RTMP stream stopped.");
    } catch (error) {
      setLiveStatus(error.message || "Failed to stop live.");
    } finally {
      setLiveLoading(false);
    }
  };

  const continuePreview = async () => {
  try {
    setLiveLoading(true);
    setLiveStatus("");

    if (!instagramConnected) {
      setLiveStatus("Please connect Instagram before continuing.");
      navigate("/app/connect");
      return;
    }

    const allowedPlatforms = isPro
      ? selectedPlatforms
      : selectedPlatforms.slice(0, 1);

    const res = await fetch(`${LIVE_API}/setup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheduleId: scheduleState?._id || scheduleState?.id || null,
        twinName,
        product,
        platforms: allowedPlatforms,
        settings,
        rtmpUrl,
        videoPath,
        plan: isPro ? "pro" : "free",
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Unable to create live setup");
    }

    const liveSessionId = data.liveSession?._id || data.data?._id || data._id;

    navigate(`/app/golive/preview/${liveSessionId}`);
  } catch (err) {
    setLiveStatus(err.message || "Unable to continue preview.");
  } finally {
    setLiveLoading(false);
  }
};

  const canContinue =
    product &&
    selectedPlatforms.length > 0 &&
    instagramConnected &&
    !socialLoading;

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
            {isPro ? "PRO GO LIVE SETUP" : "GO LIVE SETUP"}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
              instagramConnected
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            <Instagram className="h-4 w-4" />
            {socialLoading
              ? "Checking Instagram..."
              : instagramConnected
              ? "Instagram Connected"
              : "Instagram Not Connected"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">Instagram RTMP Live</span> With Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Connect Instagram first, then paste Instagram Live Producer RTMP URL and Stream Key.
        </p>

        {!instagramConnected && !socialLoading && (
          <button
            onClick={() => navigate("/app/connect")}
            className="brand-gradient mt-5 rounded-[5px] px-6 py-3 text-sm font-bold tracking-wide text-white"
          >
            Connect Instagram First
          </button>
        )}
      </section>

      {liveStatus && (
        <section className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-bold text-foreground shadow-sm">
          <AlertCircle className="h-5 w-5 text-[var(--brand-pink)]" />
          {liveStatus}
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={ScanFace} label="Select AI Twin">
              <select
                value={twinName}
                onChange={(e) => setTwinName(e.target.value)}
                className={inputClass}
              >
                <option value={twinName}>{twinName}</option>
              </select>
            </Field>

            <Field icon={Package} label="Select Product">
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className={inputClass}
              >
                {loadingProducts ? (
                  <option>Loading products...</option>
                ) : (
                  products.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))
                )}
              </select>
            </Field>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select Connected Platforms
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Free plan allows one connected platform. Pro can select multiple platforms.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map(({ id, name, icon: Icon, pro }) => {
                const active = selectedPlatforms.includes(id);
                const locked = pro && !isPro;
                const isConnected = connectedPlatforms.includes(id);

                return (
                  <button
                    key={id}
                    onClick={() => togglePlatform(id)}
                    className={`relative rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      active
                        ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                        : "border-border bg-background text-foreground"
                    } ${!isConnected ? "opacity-70" : ""}`}
                  >
                    {locked && (
                      <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                        PRO
                      </span>
                    )}

                    {!isConnected || locked ? (
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
              })}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-background p-5">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight brand-text">
              <Instagram className="h-5 w-5" />
              Instagram RTMP Details
            </h2>

            <div className="mt-5 space-y-4">
              <Field icon={Radio} label="RTMP URL">
                <input
                  value={rtmpUrl}
                  onChange={(e) => setRtmpUrl(e.target.value)}
                  className={inputClass}
                  placeholder="rtmps://live-upload.instagram.com:443/rtmp"
                />
              </Field>

              <Field icon={Lock} label="Stream Key">
                <input
                  value={streamKey}
                  onChange={(e) => setStreamKey(e.target.value)}
                  className={inputClass}
                  placeholder="Paste Instagram stream key"
                  type="password"
                />
              </Field>

              <Field icon={Package} label="Choose Video">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={startInstagramRTMP}
                  disabled={liveLoading || socialLoading || !instagramConnected}
                  className="brand-gradient rounded-[5px] py-3 text-sm font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {socialLoading
                    ? "Checking Instagram..."
                    : liveLoading
                    ? "Please wait..."
                    : instagramConnected
                    ? "Start Instagram RTMP"
                    : "Connect Instagram First"}
                </button>

                <button
                  onClick={stopInstagramRTMP}
                  disabled={liveLoading}
                  className="rounded-[5px] border border-red-500 py-3 text-sm font-bold tracking-wide text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Stop Live
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <LiveToggle
              icon={MessageSquare}
              title="Enable Live Chat"
              desc="Allow viewers to comment and ask questions."
              active={settings.liveChat}
              onClick={() => toggleSetting("liveChat")}
            />

            <LiveToggle
              icon={Link2}
              title="Show Product Link"
              desc="Display buy link while AI Twin is selling."
              active={settings.productLink}
              onClick={() => toggleSetting("productLink")}
            />

            <LiveToggle
              icon={Bot}
              title="Auto Answer Customer Questions"
              desc="AI Twin answers product questions automatically."
              active={settings.autoAnswer}
              onClick={() => toggleSetting("autoAnswer")}
            />

            <LiveToggle
              icon={Radio}
              title="Multi-Platform Sync"
              desc="Sync AI Twin live flow across all selected platforms."
              active={settings.multiPlatformSync}
              proOnly={!isPro}
              onClick={() => toggleSetting("multiPlatformSync", true)}
            />
          </div>

          <button
            onClick={continuePreview}
            disabled={!canContinue}
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
            <PreviewItem label="AI Twin" value={twinName} />
            <PreviewItem label="Product" value={product} />
            <PreviewItem
              label="Platforms"
              value={
                selectedPlatforms.length
                  ? selectedPlatforms
                      .map(
                        (id) => platforms.find((item) => item.id === id)?.name || id
                      )
                      .join(", ")
                  : "No platform selected"
              }
            />
            <PreviewItem
              label="Instagram"
              value={instagramConnected ? "Connected" : "Not connected"}
            />
            <PreviewItem
              label="Video"
              value={videoFile ? videoFile.name : "No video selected"}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
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

function LiveToggle({ icon: Icon, title, desc, active, onClick, proOnly }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          {proOnly ? <Lock className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>

        <div>
          <p className="text-sm font-black tracking-tight text-foreground">
            {title}
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
            {proOnly ? "Unlock with Pro plan." : desc}
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold tracking-wide text-emerald-600">
        {proOnly ? "PRO" : active ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function PreviewItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-bold tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-foreground">{value}</p>
    </div>
  );
}