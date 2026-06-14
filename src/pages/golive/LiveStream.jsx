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
} from "lucide-react";

const defaultComments = [
  "Does this work for sensitive skin?",
  "Show the ingredients please",
  "How do I order?",
  "Is there any discount today?",
];

export default function LiveStream() {
  const navigate = useNavigate();

  const twinImage =  "/images/bb.png";
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
  const [ended, setEnded] = useState(false);

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

  const endLive = () => {
    const summary = {
      product,
      platforms,
      viewers,
      orders,
      revenue,
      endedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("lastLiveSummary", JSON.stringify(summary));
    setEnded(true);

    setTimeout(() => {
      navigate("/app/analytics");
    }, 1200);
  };

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_380px]">
      {/* Live Preview */}
      <section className="relative min-h-[720px] overflow-hidden rounded-3xl border border-border bg-[#0d0d12] shadow-sm">
        {cameraOn ? (
          <img
            src={twinImage}
            alt="Live Twin"
            className="h-[720px] w-full object-cover opacity-90"
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

        {/* Top Badges */}
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

        {/* Twin Speech */}
        <div className="absolute left-5 top-24 max-w-md rounded-2xl bg-white/90 p-4 backdrop-blur">
          <p className="text-sm font-black tracking-tight brand-text">
            {twinName}
          </p>

          <p className="mt-1 text-sm font-medium leading-6 text-gray-700">
            Today I’m showing you why {product} is perfect for your daily
            routine. Drop your questions in the chat!
          </p>
        </div>

        {/* Comments */}
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

        {/* Product Card */}
        {productVisible && (
          <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-4 dark:bg-white/10 rounded-2xl bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
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
            <div className="rounded-3xl bg-white p-8 text-center">
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

      {/* Controls */}
      <aside className="space-y-6">
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
            <Stat icon={Eye} label="Viewers" value={formattedViewers} />
            <Stat icon={ShoppingCart} label="Orders" value={orders} />
            <Stat
              icon={IndianRupee}
              label="Revenue"
              value={`₹${revenue.toLocaleString("en-IN")}`}
            />
            <Stat icon={Users} label="Platforms" value={platforms.join(", ")} />
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
    </div>
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