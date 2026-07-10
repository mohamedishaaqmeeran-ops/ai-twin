import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Coins,
  Crown,
  Eye,
  Loader2,
  Lock,
  Play,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { fetchMe } from "../features/auth/authSlice";
import { loadRazorpay } from "../utils/loadRazorpay";

const API = "https://twinn-backend.onrender.com/api";

const categories = [
  "All",
  "Business",
  "Fashion",
  "Fitness",
  "Technology",
  "Education",
  "Lifestyle",
  "Gaming",
  "Luxury",
];

export default function AvatarMarketplace() {
  const dispatch = useDispatch();

  const [avatars, setAvatars] = useState([]);
  const [credits, setCredits] = useState(0);
  const [packages, setPackages] = useState([]);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const [loading, setLoading] = useState(true);
  const [unlockingId, setUnlockingId] = useState("");
  const [buyingPackage, setBuyingPackage] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showCredits, setShowCredits] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (category !== "All") {
      params.set("category", category);
    }

    if (search.trim()) {
      params.set("search", search.trim());
    }

    params.set("sort", sort);

    return params.toString();
  }, [category, search, sort]);

  const loadAvatars = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/avatars?${query}`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to load avatars");
      }

      setAvatars(data.avatars || []);
      setCredits(data.credits || 0);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPackages = async () => {
    try {
      const res = await fetch(`${API}/credits/packages`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setPackages(data.packages || []);
      }
    } catch {
      setPackages([]);
    }
  };

  useEffect(() => {
    loadAvatars();
  }, [query]);

  useEffect(() => {
    loadPackages();
  }, []);

  const unlockAvatar = async (avatar) => {
    if (avatar.unlocked) {
      toast.info("This avatar is already unlocked.");
      return;
    }

    if (credits < avatar.credits) {
      setShowCredits(true);
      toast.warning("You need more credits to unlock this avatar.");
      return;
    }

    const confirmed = window.confirm(
      `Unlock ${avatar.name} for ${avatar.credits} credits?`
    );

    if (!confirmed) return;

    try {
      setUnlockingId(avatar._id);

      const res = await fetch(
        `${API}/avatars/${avatar._id}/unlock`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to unlock avatar");
      }

      setCredits(data.credits);

      setAvatars((current) =>
        current.map((item) =>
          item._id === avatar._id
            ? {
                ...item,
                unlocked: true,
              }
            : item
        )
      );

      await dispatch(fetchMe());

      toast.success(`${avatar.name} added to your avatars.`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUnlockingId("");
    }
  };

  const buyCredits = async (creditPackage) => {
    try {
      setBuyingPackage(creditPackage.id);

      const orderRes = await fetch(
        `${API}/credits/create-order`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageId: creditPackage.id,
          }),
        }
      );

      const orderData = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok) {
        throw new Error(
          orderData.message || "Unable to create credit order"
        );
      }

      await loadRazorpay();

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,

        name: "Twinn.live",

        description: `${creditPackage.credits} Avatar Credits`,

        image: "/images/logos.png",

        theme: {
          color: "#ec4899",
        },

        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              `${API}/credits/verify`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyRes
              .json()
              .catch(() => ({}));

            if (!verifyRes.ok) {
              throw new Error(
                verifyData.message ||
                  "Credit payment verification failed"
              );
            }

            setCredits(verifyData.credits || 0);
            setShowCredits(false);

            await dispatch(fetchMe());

            toast.success(verifyData.message);
          } catch (error) {
            toast.error(error.message);
          }
        },

        modal: {
          ondismiss: () => {
            setBuyingPackage("");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBuyingPackage("");
    }
  };

  return (
    <div className="space-y-6 bg-background text-foreground">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 px-4 py-2 text-xs font-black">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              AVATAR MARKETPLACE
            </span>

            <h1 className="mt-5 text-3xl font-black sm:text-5xl">
              Choose your{" "}
              <span className="brand-text">
                AI Live Host
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Unlock original and licensed AI avatars using credits.
              Each avatar can be trained and used for live selling.
            </p>
          </div>

          <button
            onClick={() => setShowCredits(true)}
            className="brand-gradient flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-black text-white"
          >
            <Coins className="h-5 w-5" />
            {credits.toLocaleString()} Credits
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
              Buy
            </span>
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4">
            <Search className="h-5 w-5 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search business, fashion, fitness..."
              className="h-12 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-12 rounded-2xl border border-border bg-background px-4 text-sm font-bold outline-none"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-12 rounded-2xl border border-border bg-background px-4 text-sm font-bold outline-none"
          >
            <option value="featured">Featured</option>
            <option value="credits-low">Credits: Low to High</option>
            <option value="credits-high">Credits: High to Low</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="grid min-h-[400px] place-items-center">
          <Loader2 className="h-9 w-9 animate-spin text-[var(--brand-pink)]" />
        </div>
      ) : avatars.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-black">
            No avatars found
          </h2>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {avatars.map((avatar) => (
            <article
              key={avatar._id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={avatar.image}
                  alt={`${avatar.name} AI avatar`}
                  loading="lazy"
                  className="h-80 w-full object-cover"
                />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {avatar.featured && (
                    <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                      FEATURED
                    </span>
                  )}

                  {avatar.premium && (
                    <span className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white">
                      <Crown className="h-3 w-3" />
                      PREMIUM
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedAvatar(avatar)}
                  className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-lg"
                >
                  {avatar.previewVideo ? (
                    <Play className="h-5 w-5 fill-current" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--brand-pink)]">
                  {avatar.category}
                </p>

                <h2 className="mt-2 text-xl font-black">
                  {avatar.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {avatar.description}
                </p>

                <p className="mt-3 text-xs font-bold text-muted-foreground">
                  Voice: {avatar.voice}
                </p>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">
                      Unlock price
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-xl font-black brand-text">
                      <Coins className="h-5 w-5" />
                      {avatar.credits} Credits
                    </p>
                  </div>

                  <button
                    onClick={() => unlockAvatar(avatar)}
                    disabled={
                      avatar.unlocked ||
                      unlockingId === avatar._id
                    }
                    className={`flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-black ${
                      avatar.unlocked
                        ? "bg-emerald-100 text-emerald-600"
                        : "brand-gradient text-white"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {unlockingId === avatar._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : avatar.unlocked ? (
                      <>
                        <Check className="h-4 w-4" />
                        Unlocked
                      </>
                    ) : credits >= avatar.credits ? (
                      <>
                        <Lock className="h-4 w-4" />
                        Unlock
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4" />
                        Buy Credits
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedAvatar && (
        <AvatarPreviewModal
          avatar={selectedAvatar}
          onClose={() => setSelectedAvatar(null)}
          onUnlock={() => {
            unlockAvatar(selectedAvatar);
            setSelectedAvatar(null);
          }}
        />
      )}

      {showCredits && (
        <CreditPackagesModal
          packages={packages}
          loadingId={buyingPackage}
          onBuy={buyCredits}
          onClose={() => setShowCredits(false)}
        />
      )}
    </div>
  );
}

function AvatarPreviewModal({
  avatar,
  onClose,
  onUnlock,
}) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-card p-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {avatar.previewVideo ? (
          <video
            controls
            autoPlay
            playsInline
            poster={avatar.image}
            className="max-h-[500px] w-full rounded-2xl bg-black object-contain"
          >
            <source
              src={avatar.previewVideo}
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            src={avatar.image}
            alt={avatar.name}
            className="max-h-[500px] w-full rounded-2xl object-contain"
          />
        )}

        <h2 className="mt-5 text-2xl font-black">
          {avatar.name}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {avatar.description}
        </p>

        <button
          onClick={onUnlock}
          disabled={avatar.unlocked}
          className="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] font-black text-white disabled:opacity-60"
        >
          {avatar.unlocked
            ? "Already Unlocked"
            : `Unlock for ${avatar.credits} Credits`}
        </button>
      </div>
    </div>
  );
}

function CreditPackagesModal({
  packages,
  loadingId,
  onBuy,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-black/75 p-4">
      <div className="relative w-full max-w-4xl rounded-3xl bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-3xl font-black">
          Buy <span className="brand-text">Avatar Credits</span>
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Credits can be used to unlock premium AI avatars.
        </p>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {packages.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border bg-background p-6"
            >
              <Coins className="h-9 w-9 text-[var(--brand-pink)]" />

              <h3 className="mt-5 text-xl font-black">
                {item.name}
              </h3>

              <p className="mt-3 text-3xl font-black brand-text">
                {item.credits.toLocaleString()}
              </p>

              <p className="text-sm font-bold text-muted-foreground">
                Credits
              </p>

              <p className="mt-4 text-lg font-black">
                ₹{item.amount.toLocaleString()}
              </p>

              <button
                onClick={() => onBuy(item)}
                disabled={loadingId === item.id}
                className="brand-gradient mt-5 flex h-11 w-full items-center justify-center rounded-[5px] text-sm font-black text-white disabled:opacity-60"
              >
                {loadingId === item.id
                  ? "Processing..."
                  : "Buy Credits"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}