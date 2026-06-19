import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Radio,
  Pencil,
  Trash2,
  ShoppingBag,
  Sparkles,
  Star,
  CheckCircle2,
  TrendingUp,
  Crown,
  Lock,
  Percent,
  MessageSquare,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";

  const products = JSON.parse(localStorage.getItem("products") || "[]");

  const product =
    products.find((item) => item.id === Number(id)) || {
      id: 1,
      name: "Vitamin C Glow Serum",
      price: "₹799",
      stock: "In Stock",
      category: "Beauty",
      img: "/images/6.jpeg",
      description:
        "Brightens skin, reduces pigmentation and provides natural glow.",
      script:
        "Introduce product, explain benefits, mention ingredients, answer FAQs and provide purchase link.",
      offer: "Today only free shipping.",
      objectionHandling:
        "If customer says price is high, explain product value and results.",
    };

  const sellLive = () => {
    localStorage.setItem("selectedProduct", product.name);
    navigate("/app/golive");
  };

  const deleteProduct = () => {
    const updated = products.filter((item) => item.id !== product.id);
    localStorage.setItem("products", JSON.stringify(updated));
    navigate("/app/products");
  };

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <ShoppingBag className="h-4 w-4 text-[var(--brand-pink)]" />
            )}
            {isPro ? "PRO PRODUCT DETAILS" : "PRODUCT DETAILS"}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
              isPro
                ? "bg-pink-500 text-white"
                : "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
            }`}
          >
            {isPro ? <Crown className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isPro ? "PRO PLAN ACTIVE" : "FREE PLAN"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">{product.name}</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          {isPro
            ? "Complete Pro product information, AI sales script, offers and objection handling for live selling."
            : "Complete product information used by your AI Twin during live selling."}
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Pro Product Selling
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add offers, objection handling, Pro selling scripts and advanced analytics.
                </p>
              </div>

              <button
                onClick={upgradeToPro}
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="relative rounded-3xl bg-pink-50 p-5 dark:bg-white/10">
            {isPro && (
              <span className="absolute right-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                PRO SELLING
              </span>
            )}

            <img
              src={product.img}
              alt={product.name}
              className="h-80 w-full rounded-2xl object-contain sm:h-96"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat
              icon={TrendingUp}
              label={isPro ? "Pro Sales" : "245 Sold"}
              iconClass="text-[var(--brand-pink)]"
            />
            <MiniStat
              icon={Star}
              label={isPro ? "4.9 Rating" : "Basic"}
              iconClass="text-yellow-500"
            />
            <MiniStat
              icon={CheckCircle2}
              label={product.stock}
              iconClass="text-green-500"
            />
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {product.name}
                </h2>

                <p className="mt-2 text-3xl font-black tracking-tight brand-text">
                  {product.price}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {product.stock}
                </span>
              </div>

              <span className="rounded-full bg-[#0d0d12] px-4 py-2 text-sm font-bold tracking-wide text-white">
                {product.category}
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-black tracking-tight text-foreground">
                Description
              </h3>

              <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
                {product.description || "No product description added yet."}
              </p>
            </div>
          </div>

          <InfoBlock
            icon={Sparkles}
            title={isPro ? "Pro AI Twin Selling Script" : "AI Twin Selling Script"}
            text={
              product.script ||
              "No AI selling script added yet. Add a script to help your AI Twin sell this product better during live sessions."
            }
          />

          {isPro ? (
            <>
              <InfoBlock
                icon={Percent}
                title="Pro Discount Offer"
                text={product.offer || "No discount offer added yet."}
              />

              <InfoBlock
                icon={MessageSquare}
                title="Pro Objection Handling"
                text={
                  product.objectionHandling ||
                  "No objection handling script added yet."
                }
              />
            </>
          ) : (
            <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5 shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-6">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[var(--brand-pink)]" />
                <h3 className="text-xl font-black tracking-tight text-foreground">
                  Pro Selling Tools Locked
                </h3>
              </div>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Upgrade to Pro to add discount offers, objection handling and advanced selling scripts.
              </p>

              <button
                onClick={upgradeToPro}
                className="brand-gradient mt-5 rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade to Pro
              </button>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              onClick={sellLive}
              className="brand-gradient flex h-12 items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Radio className="h-4 w-4" />
              {isPro ? "Pro Live" : "Sell Live"}
            </button>

            <Link
              to={`/app/products/edit/${product.id}`}
              className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>

            <button
              onClick={deleteProduct}
              className="flex h-12 items-center justify-center gap-2 rounded-[5px] border border-red-200 text-sm font-bold tracking-wide text-red-500 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[var(--brand-pink)]" />

        <h3 className="text-xl font-black tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-accent p-5">
        <p className="text-sm font-medium leading-7 text-foreground">{text}</p>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, iconClass }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 text-center">
      <Icon className={`mx-auto h-5 w-5 ${iconClass}`} />
      <p className="mt-2 text-xs font-bold tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}