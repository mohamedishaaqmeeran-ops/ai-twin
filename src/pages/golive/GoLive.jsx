import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Youtube,
  Facebook,
  Instagram,
  Music2,
  Radio,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Link2,
  Bot,
  ArrowRight,
  Package,
  ScanFace,
  Crown,
  Lock,
} from "lucide-react";

const LIVE_API = "https://twinn-backend.onrender.com/api/live";
const SOCIAL_API = "https://twinn-backend.onrender.com/api/social";

const platforms = [
  { name: "Instagram", icon: Instagram, pro: false },
  { name: "YouTube", icon: Youtube, pro: true },
  { name: "Facebook", icon: Facebook, pro: true },
  { name: "TikTok", icon: Music2, pro: true },
];

const defaultProducts = [
  "Vitamin C Glow Serum",
  "Wireless Headphone",
  "Smart Watch",
];

export default function GoLive() {
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";
  const maxPlatforms = isPro ? 4 : 1;

  const [twinName, setTwinName] = useState("My AI Twin");
  const [product, setProduct] = useState("Vitamin C Glow Serum");
  const [products, setProducts] = useState(defaultProducts);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Instagram"]);

  const [rtmpUrl, setRtmpUrl] = useState(
    "rtmps://live-upload.instagram.com:443/rtmp"
  );
  const [streamKey, setStreamKey] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");

  const [settings, setSettings] = useState({
    liveChat: true,
    productLink: true,
    autoAnswer: true,
    multiPlatformSync: false,
  });

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

  const upgradeToPro = () => navigate("/pricing");

  useEffect(() => {
    const checkInstagram = async () => {
      try {
        const res = await fetch(`${SOCIAL_API}/connections`);
        const data = await res.json();

        const isConnected = data.data?.some(
          (item) => item.platform === "instagram" && item.connected
        );

        setInstagramConnected(Boolean(isConnected));

        if (!isConnected) {
          setLiveStatus("Please connect Instagram before going live.");
        }
      } catch {
        setLiveStatus("Unable to check Instagram connection.");
      } finally {
        setCheckingConnection(false);
      }
    };

    checkInstagram();
  }, []);

  useEffect(() => {
    setTwinName(localStorage.getItem("twinName") || "My AI Twin");

    const selectedProduct = localStorage.getItem("selectedProduct");
    if (selectedProduct) setProduct(selectedProduct);

    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    if (savedProducts.length) {
      const productNames = savedProducts.map((item) => item.name);
      setProducts([...new Set([...defaultProducts, ...productNames])]);
    }

    const connectedPlatforms = JSON.parse(
      localStorage.getItem("connectedPlatforms") || "[]"
    );

    if (connectedPlatforms.length) {
      const formatted = connectedPlatforms.map(
        (item) => item.charAt(0).toUpperCase() + item.slice(1)
      );
      setSelectedPlatforms(isPro ? formatted : formatted.slice(0, 1));
    }
  }, [isPro]);

  const uploadVideo = async () => {
    if (!videoFile) {
      setLiveStatus("Please choose a video file.");
      return null;
    }

    const formData = new FormData();
    formData.append("video", videoFile);

    const res = await fetch(`${LIVE_API}/upload-video`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Video upload failed");
    }

    return data.videoPath;
  };

  const togglePlatform = (name) => {
    const item = platforms.find((p) => p.name === name);
    const active = selectedPlatforms.includes(name);

    if (item?.pro && !isPro && !active) return upgradeToPro();

    if (active) {
      setSelectedPlatforms((prev) => prev.filter((item) => item !== name));
      return;
    }

    if (!isPro && selectedPlatforms.length >= maxPlatforms) return upgradeToPro();

    setSelectedPlatforms((prev) => [...prev, name]);
  };

  const toggleSetting = (key, proOnly = false) => {
    if (proOnly && !isPro) return upgradeToPro();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rtmpUrl,
          streamKey,
          videoPath: uploadedVideoPath,
        }),
      });

      const data = await res.json();

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
      });

      const data = await res.json();

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

  const continuePreview = () => {
    if (!instagramConnected) {
      setLiveStatus("Please connect Instagram before continuing.");
      navigate("/app/connect");
      return;
    }

    const allowedPlatforms = isPro
      ? selectedPlatforms
      : selectedPlatforms.slice(0, 1);

    const liveSetup = {
      twinName,
      product,
      platforms: allowedPlatforms,
      settings,
      rtmpUrl,
      videoPath,
      plan: isPro ? "pro" : "free",
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem("selectedProduct", product);
    localStorage.setItem("selectedPlatforms", JSON.stringify(allowedPlatforms));
    localStorage.setItem("liveSetup", JSON.stringify(liveSetup));

    navigate("/app/golive/preview");
  };

  const canContinue = product && selectedPlatforms.length > 0 && instagramConnected;

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
            {checkingConnection
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

        {!instagramConnected && !checkingConnection && (
          <button
            onClick={() => navigate("/app/connect")}
            className="brand-gradient mt-5 rounded-[5px] px-6 py-3 text-sm font-bold tracking-wide text-white"
          >
            Connect Instagram First
          </button>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={ScanFace} label="Select AI Twin">
              <select
                value={twinName}
                onChange={(e) => setTwinName(e.target.value)}
                className={inputClass}
              >
                <option>{twinName}</option>
              </select>
            </Field>

            <Field icon={Package} label="Select Product">
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className={inputClass}
              >
                {products.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select Platforms
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map(({ name, icon: Icon, pro }) => {
                const active = selectedPlatforms.includes(name);
                const locked = pro && !isPro;

                return (
                  <button
                    key={name}
                    onClick={() => togglePlatform(name)}
                    className={`relative rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      active
                        ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {locked && (
                      <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                        PRO
                      </span>
                    )}

                    {locked ? (
                      <Lock className="h-6 w-6 text-[var(--brand-pink)]" />
                    ) : (
                      <Icon className="h-6 w-6 text-[var(--brand-pink)]" />
                    )}

                    <p className="mt-3 text-base font-black tracking-tight text-foreground">
                      {name}
                    </p>

                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {active ? "Selected" : locked ? "Pro only" : "Click to select"}
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
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className={inputClass}
                />
              </Field>

              {liveStatus && (
                <div className="rounded-2xl border border-border bg-card p-4 text-sm font-bold text-foreground">
                  {liveStatus}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={startInstagramRTMP}
                  disabled={liveLoading || checkingConnection || !instagramConnected}
                  className="brand-gradient rounded-[5px] py-3 text-sm font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkingConnection
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
            <LiveToggle icon={MessageSquare} title="Enable Live Chat" desc="Allow viewers to comment and ask questions." active={settings.liveChat} onClick={() => toggleSetting("liveChat")} />
            <LiveToggle icon={Link2} title="Show Product Link" desc="Display buy link while AI Twin is selling." active={settings.productLink} onClick={() => toggleSetting("productLink")} />
            <LiveToggle icon={Bot} title="Auto Answer Customer Questions" desc="AI Twin answers product questions automatically." active={settings.autoAnswer} onClick={() => toggleSetting("autoAnswer")} />
            <LiveToggle icon={Radio} title="Multi-Platform Sync" desc="Sync AI Twin live flow across all selected platforms." active={settings.multiPlatformSync} proOnly={!isPro} onClick={() => toggleSetting("multiPlatformSync", true)} />
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