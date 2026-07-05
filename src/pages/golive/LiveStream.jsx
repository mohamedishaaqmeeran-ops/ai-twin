import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Crown,
  Lock,
  AlertCircle,
} from "lucide-react";

const LIVE_API = "https://twinn-backend.onrender.com/api/live";

const defaultComments = [
  "Does this work for sensitive skin?",
  "Show the ingredients please",
  "How do I order?",
  "Is there any discount today?",
];

const platformLabel = (platform = "") => {
  const value = platform.toString().toLowerCase();

  const labels = {
    instagram: "Instagram",
    youtube: "YouTube",
    facebook: "Facebook",
    tiktok: "TikTok",
  };

  return labels[value] || platform;
};

export default function LiveStream() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [engageOn, setEngageOn] = useState(true);
  const [productVisible, setProductVisible] = useState(true);

  const [comments, setComments] = useState(defaultComments);
  const [message, setMessage] = useState("");

  const [viewers, setViewers] = useState(0);
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [ended, setEnded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(true);
  const [copied, setCopied] = useState(false);

  const isPro = session?.plan === "pro" || session?.plan === "business";

  const platforms = useMemo(() => {
    const list = Array.isArray(session?.platforms) ? session.platforms : [];
    const formatted = list.map(platformLabel);
    return isPro ? formatted : formatted.slice(0, 1);
  }, [session, isPro]);

  const product = session?.product || "Vitamin C Glow Serum";
  const twinName = session?.twinName || "My AI Twin";
  const twinImage = session?.twinImage || "/images/bb.png";
  const liveLink =
    session?.liveUrl || session?.liveLink || `${window.location.origin}/live/${id}`;

  const liveStartedAt =
    session?.startedAtFormatted ||
    (session?.startedAt
      ? new Date(session.startedAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "--");

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${LIVE_API}/${id}`, {
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || "Unable to load live session");
        }

        const live = data.liveSession || data.data || data;

        setSession(live);
        setViewers(live.viewers || (live.plan === "pro" ? 12800 : 4800));
        setOrders(live.orders || (live.plan === "pro" ? 210 : 85));
        setRevenue(live.revenue || (live.plan === "pro" ? 158900 : 58900));

        if (Array.isArray(live.comments) && live.comments.length) {
          setComments(live.comments);
        }
      } catch (err) {
        setError(err.message || "Unable to load live session");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadSession();
  }, [id]);

  useEffect(() => {
    if (!session || ended) return;

    const interval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * (isPro ? 30 : 12)));
      setOrders((prev) => prev + Math.floor(Math.random() * (isPro ? 4 : 2)));
      setRevenue((prev) => prev + Math.floor(Math.random() * (isPro ? 1200 : 500)));
    }, 3000);

    return () => clearInterval(interval);
  }, [session, ended, isPro]);

  const formattedViewers = useMemo(() => {
    if (viewers >= 1000) return `${(viewers / 1000).toFixed(1)}K`;
    return viewers;
  }, [viewers]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = message.trim();

    setComments((prev) => [newMessage, ...prev]);
    setMessage("");

    try {
      await fetch(`${LIVE_API}/${id}/comment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });
    } catch {
      // UI already updated.
    }
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

  const endLive = async () => {
    try {
      setEnding(true);
      setError("");

      const res = await fetch(`${LIVE_API}/${id}/end`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viewers,
          orders,
          revenue,
          comments,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to end live");
      }

      setEnded(true);

      setTimeout(() => {
        navigate("/app/analytics");
      }, 1200);
    } catch (err) {
      setError(err.message || "Unable to end live");
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm font-bold text-muted-foreground">
        Loading live stream...
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm font-bold text-red-600 dark:text-red-400">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>

        <button
          onClick={() => navigate("/app/golive")}
          className="brand-gradient mt-5 rounded-[5px] px-5 py-3 text-sm font-bold text-white"
        >
          Back to Go Live
        </button>
      </div>
    );
  }

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

          {isPro && (
            <span className="rounded-[5px] bg-pink-500 px-4 py-2 text-sm font-black tracking-wide text-white">
              PRO
            </span>
          )}

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
            {isPro
              ? `Pro live selling mode active. Today I’m presenting ${product} with offers, objection handling and instant answers.`
              : `Today I’m showing you why ${product} is perfect for your daily routine. Drop your questions in the chat!`}
          </p>
        </div>

        <div className="absolute left-5 top-56 max-w-md space-y-3">
          {comments.slice(0, isPro ? 5 : 4).map((msg, index) => (
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
                  {session?.price || "₹799"}
                </p>

                <p className="text-xs font-medium leading-5 text-muted-foreground">
                  {isPro
                    ? "Pro live offer: discount + free shipping active"
                    : "Limited live offer available now"}
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
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight brand-text">
            {isPro && <Crown className="h-5 w-5" />}
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
            {isPro ? "Pro Live Stats" : "Live Stats"}
          </h2>

          <div className="mt-5 space-y-3">
            <Stat icon={CheckCircle2} label="Started" value={liveStartedAt} />
            <Stat icon={Eye} label="Viewers" value={formattedViewers} />
            <Stat icon={ShoppingCart} label="Orders" value={orders} />
            <Stat
              icon={IndianRupee}
              label="Revenue"
              value={`₹${revenue.toLocaleString("en-IN")}`}
            />
            <Stat icon={Users} label="Platforms" value={platforms.join(", ")} />
            <Stat icon={Crown} label="Plan" value={isPro ? "Pro" : "Free"} />
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

        {!isPro && platforms.length > 1 && (
          <button
            onClick={() => navigate("/pricing")}
            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
          >
            <Lock className="h-4 w-4" />
            Unlock Multi-Platform Live
          </button>
        )}

        <button
          onClick={endLive}
          disabled={ending}
          className="w-full rounded-[5px] bg-red-600 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {ending ? "Ending..." : "End Live"}
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
          isPro={isPro}
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
  isPro,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight brand-text">
              {isPro ? "Pro Live Started" : "Live Started"}
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