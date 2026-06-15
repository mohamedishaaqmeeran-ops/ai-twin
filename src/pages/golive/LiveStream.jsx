import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  Video,
  ShoppingCart,
  Heart,
  Eye,
  Package,
  IndianRupee,
  Users,
  Send,
  VolumeX,
  VideoOff,
  CheckCircle2,
  Copy,
  Share2,
  X,
  Facebook,
  Music2,
  Youtube,
  Instagram,
  MessageCircle,
} from "lucide-react";

const defaultComments = [
  "Does this work for sensitive skin?",
  "Show the ingredients please",
  "How do I order?",
  "Is there any discount today?",
];

export default function LiveStream() {
  const navigate = useNavigate();

  const twinImage = "/images/bb.png";
  const twinName = localStorage.getItem("twinName") || "My AI Twin";

  const liveSetup = JSON.parse(localStorage.getItem("liveSetup") || "{}");

  const product =
    liveSetup.product ||
    localStorage.getItem("selectedProduct") ||
    "Vitamin C Glow Serum";

  const platforms =
    liveSetup.platforms ||
    JSON.parse(localStorage.getItem("selectedPlatforms") || '["Instagram"]');

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [engageOn, setEngageOn] = useState(true);
  const [productVisible, setProductVisible] = useState(true);

  const [comments, setComments] = useState(defaultComments);
  const [message, setMessage] = useState("");

  const [viewers, setViewers] = useState(4800);
  const [orders, setOrders] = useState(85);
  const [revenue, setRevenue] = useState(58900);
   const [liveStartedAt, setLiveStartedAt] = useState("");
  const [ended, setEnded] = useState(false);
  const [liveLink, setLiveLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const oldSession = JSON.parse(localStorage.getItem("liveSession") || "{}");

   if (oldSession.url) {
  setLiveLink(oldSession.url);
  setLiveStartedAt(oldSession.startedAt);
} else {
      const liveId = crypto.randomUUID().slice(0, 8).toUpperCase();
      const url = `${window.location.origin}/live/${liveId}`;

     const startTime = new Date().toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const session = {
  id: liveId,
  url,
  twinName,
  product,
  platforms,
  startedAt: startTime,
  status: "live",
};

localStorage.setItem("liveSession", JSON.stringify(session));

setLiveLink(url);
setLiveStartedAt(startTime);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 12));
      setOrders((prev) => prev + Math.floor(Math.random() * 2));
      setRevenue((prev) => prev + Math.floor(Math.random() * 500));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formattedViewers = useMemo(() => {
    if (viewers >= 1000) return `${(viewers / 1000).toFixed(1)}K`;
    return viewers;
  }, [viewers]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setComments((prev) => [message, ...prev]);
    setMessage("");
  };

  const copyLiveLink = async () => {
    await navigator.clipboard.writeText(liveLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareLive = (platform) => {
    const encodedUrl = encodeURIComponent(liveLink);

    const text = encodeURIComponent(
      `🔴 I'm LIVE now!\nWatch my AI Twin selling ${product}.\n${liveLink}`
    );

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        "_blank"
      );
      return;
    }

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${text}`, "_blank");
      return;
    }

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
      return;
    }

    if (platform === "youtube") {
      window.open("https://www.youtube.com/", "_blank");
      return;
    }

    if (platform === "instagram") {
      copyLiveLink();
      window.open("https://www.instagram.com/", "_blank");
      return;
    }

    if (platform === "tiktok") {
      copyLiveLink();
      window.open("https://www.tiktok.com/", "_blank");
      return;
    }

    copyLiveLink();
  };

  const endLive = () => {
    const summary = {
      product,
      platforms,
      viewers,
      orders,
      revenue,
      liveLink,
      endedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("lastLiveSummary", JSON.stringify(summary));
    localStorage.removeItem("liveSession");

    setEnded(true);

    setTimeout(() => {
      navigate("/app/analytics");
    }, 1200);
  };

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_380px]">
      <section className="relative min-h-[720px] overflow-hidden rounded-3xl border border-border bg-[#0d0d12] shadow-sm">
        {cameraOn ? (
          <img
            src={twinImage}
            alt="Live Twin"
            className="h-full w-full object-cover opacity-90"
          />
        ) : (
          <div className="grid h-[720px] place-items-center text-white">
            <div className="text-center">
              <VideoOff className="mx-auto h-12 w-12 text-white/70" />
              <p className="mt-3 text-lg font-black tracking-tight">
                Camera Off
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/50" />

        <div className="absolute left-5 top-5 flex flex-wrap gap-3">
          <span className="rounded-[5px] bg-red-600 px-4 py-2 text-sm font-black tracking-wide text-white">
            LIVE
          </span>

          <span className="rounded-[5px] bg-black/60 px-4 py-2 text-sm font-black tracking-wide text-white backdrop-blur">
            👁 {formattedViewers}
          </span>

          {platforms.map((item) => (
            <span
              key={item}
              className="rounded-[5px] bg-white/15 px-4 py-2 text-sm font-bold tracking-wide text-white backdrop-blur"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="absolute left-5 top-24 max-w-md rounded-2xl bg-white/90 p-4 backdrop-blur">
          <p className="text-sm font-black tracking-tight brand-text">
            {twinName}
          </p>

          <p className="mt-1 text-sm font-medium leading-6 text-gray-700">
            Today I’m showing you why {product} is perfect for your daily
            routine. Drop your questions in the chat!
          </p>
        </div>

        <div className="absolute left-5 top-56 max-w-md space-y-3">
          {comments.slice(0, 4).map((msg, index) => (
            <div
              key={`${msg}-${index}`}
              className="rounded-2xl bg-black/60 px-4 py-3 text-sm font-medium leading-6 text-white backdrop-blur"
            >
              <span className="font-bold text-pink-300">Viewer:</span> {msg}
            </div>
          ))}
        </div>

        {productVisible && (
          <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-xl dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                <Package className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-lg font-black tracking-tight text-foreground">
                  {product}
                </h3>

                <p className="text-lg font-black tracking-tight brand-text">
                  ₹799
                </p>

                <p className="text-xs font-medium leading-5 text-muted-foreground">
                  Limited live offer available now
                </p>
              </div>
            </div>

            <button className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:opacity-90">
              Buy Now
            </button>
          </div>
        )}

        {ended && (
          <div className="absolute inset-0 grid place-items-center bg-black/70">
            <div className="rounded-3xl bg-white p-8 text-center dark:bg-card">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />

              <h2 className="mt-4 text-2xl font-black tracking-tight brand-text">
                Live Ended
              </h2>

              <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                Redirecting to analytics...
              </p>
            </div>
          </div>
        )}
      </section>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Live Link
          </h2>

          <div className="mt-4 rounded-2xl border border-border bg-background p-4">
            <p className="break-all text-sm font-medium text-muted-foreground">
              {liveLink}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={copyLiveLink}
                className="flex items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="brand-gradient flex items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Live Controls
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Control
              icon={micOn ? Mic : VolumeX}
              text={micOn ? "Mic On" : "Mic Off"}
              active={micOn}
              onClick={() => setMicOn(!micOn)}
            />

            <Control
              icon={cameraOn ? Video : VideoOff}
              text={cameraOn ? "Camera On" : "Camera Off"}
              active={cameraOn}
              onClick={() => setCameraOn(!cameraOn)}
            />

            <Control
              icon={ShoppingCart}
              text={productVisible ? "Product On" : "Product Off"}
              active={productVisible}
              onClick={() => setProductVisible(!productVisible)}
            />

            <Control
              icon={Heart}
              text={engageOn ? "Engage On" : "Engage Off"}
              active={engageOn}
              onClick={() => setEngageOn(!engageOn)}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Live Stats
          </h2>

         <div className="mt-5 space-y-3">
  <Stat
    icon={CheckCircle2}
    label="Started"
    value={liveStartedAt}
  />

  <Stat
    icon={Eye}
    label="Viewers"
    value={formattedViewers}
  />

  <Stat
    icon={ShoppingCart}
    label="Orders"
    value={orders}
  />

  <Stat
    icon={IndianRupee}
    label="Revenue"
    value={`₹${revenue.toLocaleString("en-IN")}`}
  />

  <Stat
    icon={Users}
    label="Platforms"
    value={platforms.join(", ")}
  />
</div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Send Chat Prompt
          </h2>

          <div className="mt-4 flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add live chat message..."
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
            />

            <button
              onClick={sendMessage}
              className="brand-gradient grid h-12 w-12 shrink-0 place-items-center rounded-[5px] text-white shadow-md transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={endLive}
          className="w-full rounded-[5px] bg-red-600 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-red-700"
        >
          End Live
        </button>
      </aside>

      {showShareModal && (
       <ShareLiveModal
  liveLink={liveLink}
  product={product}
  platforms={platforms}
  liveStartedAt={liveStartedAt}
  copied={copied}
  onCopy={copyLiveLink}
  onClose={() => setShowShareModal(false)}
  onShare={shareLive}
/>
      )}
    </div>
  );
}

function ShareLiveModal({
  liveLink,
  product,
  platforms,
  liveStartedAt,
  copied,
  onCopy,
  onClose,
  onShare,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight brand-text">
              Live Started
            </h2>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Share this live link with your audience.
            </p>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <p className="text-sm font-bold tracking-tight text-foreground">
            Product
          </p>

          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {product}
          </p>
<div className="mt-4 rounded-xl border border-border bg-background p-3">
  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
    Live Started
  </p>

  <p className="mt-1 text-sm font-black text-foreground">
    {liveStartedAt}
  </p>
</div>
          <div className="mt-4 rounded-xl bg-card p-3">
            <p className="break-all text-sm font-medium text-foreground">
              {liveLink}
            </p>
          </div>

          <button
            onClick={onCopy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied Link" : "Copy Live Link"}
          </button>
        </div>

        <div className="mt-5">
          <h3 className="text-base font-black tracking-tight text-foreground">
            Share to selected platforms
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {platforms.includes("Instagram") && (
              <ShareButton
                icon={Instagram}
                label="Instagram"
                onClick={() => onShare("instagram")}
              />
            )}

            {platforms.includes("Facebook") && (
              <ShareButton
                icon={Facebook}
                label="Facebook"
                onClick={() => onShare("facebook")}
              />
            )}

            {platforms.includes("YouTube") && (
              <ShareButton
                icon={Youtube}
                label="YouTube"
                onClick={() => onShare("youtube")}
              />
            )}

            {platforms.includes("TikTok") && (
              <ShareButton
                icon={Music2}
                label="TikTok"
                onClick={() => onShare("tiktok")}
              />
            )}

            <ShareButton
              icon={MessageCircle}
              label="WhatsApp"
              onClick={() => onShare("whatsapp")}
            />

            <ShareButton
              icon={Share2}
              label="X / Twitter"
              onClick={() => onShare("twitter")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-3 rounded-[5px] border border-border bg-background text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10"
    >
      <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
      {label}
    </button>
  );
}

function Control({ icon: Icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 text-center text-sm font-bold tracking-wide transition hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
          : "border-border bg-background text-muted-foreground"
      }`}
    >
      <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-white text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      {text}
    </button>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>

      <p className="text-sm font-black tracking-tight brand-text">{value}</p>
    </div>
  );
}