import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Radio,
  Eye,
  ShoppingBag,
  User,
  Search,
  Sparkles,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  Play,
} from "lucide-react";
import Nav from "../components/Nav";

const API = "https://twinn-backend.onrender.com/api";

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music2,
};

export default function LiveShop() {
  const navigate = useNavigate();

const { user } = useSelector((state) => state.auth);
  const [lives, setLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchLives();
  }, []);

  const fetchLives = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/lives/public`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch live sessions");
      }

      setLives(data.data || data.lives || []);
    } catch (error) {
      console.log("LIVE SHOP ERROR:", error.message);
      setLives([]);
    } finally {
      setLoading(false);
    }
  };

const handleStartLive = () => {
  if (user) {
    navigate("/app/golive");
  } else {
    navigate("/signin");
  }
};

  const filteredLives = lives.filter((live) => {
    const text = `${live.title || ""} ${live.product?.name || ""} ${
      live.user?.email || ""
    } ${live.twin?.name || ""}`.toLowerCase();

    return text.includes(keyword.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main>
        <section className="bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:via-white/5 dark:to-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              LIVE SHOP
            </span>

            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Watch AI Twins{" "}
                  <span className="brand-text">Selling Live</span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                  Discover live sessions from creators, brands and shops using
                  AI Twins.
                </p>
              </div>

              <div className="flex h-12 w-full max-w-md items-center gap-3 rounded-[5px] border border-border bg-card px-4">
                <Search className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search live sessions..."
                  className="w-full bg-transparent text-sm font-medium outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <Radio className="mx-auto h-10 w-10 animate-pulse text-[var(--brand-pink)]" />
              <p className="mt-4 text-sm font-bold text-muted-foreground">
                Loading live sessions...
              </p>
            </div>
          ) : filteredLives.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLives.map((live) => (
                <LiveCard
                  key={live._id || live.id}
                  live={live}
                  onWatch={() =>
                    navigate(`/live/${live._id || live.id}`, {
                      state: { live },
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <Radio className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />
              <h2 className="mt-4 text-xl font-black">
                No live sessions found
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Live sessions from users will appear here.
              </p>

            <button
  onClick={handleStartLive}
  className="brand-gradient mt-6 inline-flex h-11 items-center cursor-pointer justify-center rounded-[5px] px-6 text-sm font-bold text-white transition hover:opacity-90"
>
  Start Live
</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function LiveCard({ live, onWatch }) {
  const platform = live.platform || live.platforms?.[0] || "instagram";
  const PlatformIcon = platformIcons[String(platform).toLowerCase()] || Radio;

  const productImage =
    live.product?.images?.[0] ||
    live.product?.image ||
    live.productImage ||
    "/images/6.jpeg";

  const twinImage =
    live.twin?.image ||
    live.twin?.avatarImage ||
    live.twinImage ||
    "/images/bbb.png";

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-[420px] bg-[#0d0d12]">
        {live.videoUrl ? (
          <video
            src={live.videoUrl}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <img
            src={twinImage}
            alt={live.twin?.name || "AI Twin"}
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
            <Radio className="h-3 w-3" />
            LIVE
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white">
            <Eye className="h-3 w-3" />
            {live.viewers || live.views || 0}
          </span>
        </div>

        <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
          <PlatformIcon className="h-5 w-5" />
        </div>

        <button
          onClick={onWatch}
          className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--brand-pink)] shadow-xl"
        >
          <Play className="h-7 w-7 fill-current" />
        </button>

        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 dark:bg-card/95">
          <div className="flex items-center gap-3">
            <img
              src={productImage}
              alt={live.product?.name || "Product"}
              className="h-14 w-14 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-black text-foreground">
                {live.product?.name || live.title || "Live Product"}
              </h3>

              <p className="text-sm font-black text-[var(--brand-pink)]">
                ₹
                {Number(
                  live.product?.salePrice || live.product?.price || 0
                ).toLocaleString("en-IN")}
              </p>
            </div>

            <ShoppingBag className="h-5 w-5 text-[var(--brand-pink)]" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-lg font-black tracking-tight text-foreground">
          {live.title || "AI Twin Live Selling"}
        </h2>

        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
            <User className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-black">
              {live.twin?.name || "AI Twin"}
            </p>
            <p className="text-xs text-muted-foreground">
              {live.user?.email || "Creator"}
            </p>
          </div>
        </div>

        <button
          onClick={onWatch}
          className="brand-gradient mt-5 flex h-11 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white"
        >
          Watch Live
        </button>
      </div>
    </div>
  );
}