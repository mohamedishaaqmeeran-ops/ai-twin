import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Facebook,
  Instagram,
  Music2,
  Package,
  Radio,
  ScanFace,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Youtube,
  Brain,
} from "lucide-react";
import { useSelector } from "react-redux";


export default function Dashboard() {
  const navigate = useNavigate();

 const { user } = useSelector((state) => state.auth);

const plan = user?.plan || "free";
const isPro = plan === "pro" || plan === "business";

const twin = user?.twin || null;
const hasTwin = Boolean(twin);
const isTrained = Boolean(twin?.isTrained);
const twinName = twin?.name || "My AI Twin";

const twinImage =
  twin?.image ||
  twin?.avatarImage ||
  twin?.twinImage ||
  "/images/bbb.png";

const maxProducts = isPro ? 100 : 3;
const maxPlatforms = isPro ? 4 : 1;
const maxTwins = isPro ? 5 : 1;

const products = user?.products || [];
const schedules = user?.liveSchedules || [];
  const goLive = () => {
    if (!hasTwin) {
      navigate("/app/twin/create");
      return;
    }

    navigate("/app/golive");
  };

  const recentProducts = products.length
    ? products.slice(0, 3)
    : [
        {
          name: "Vitamin C Glow Serum",
          price: "₹799",
          status: "Ready to sell",
          img: "/images/6.jpeg",
        },
        {
          name: "Wireless Headphone",
          price: "₹1,299",
          status: "Ready to sell",
          img: "/images/5.jpeg",
        },
        {
          name: "Smart Watch",
          price: "₹2,499",
          status: "Needs script",
          img: "/images/7.jpeg",
        },
      ];

  const live = schedules[0] || {
    title: "Instagram Live",
    product: "Vitamin C Glow Serum",
    date: "Today",
    time: "07:30 PM",
    platforms: ["Instagram"],
  };

  const platform = Array.isArray(live.platforms)
    ? live.platforms[0]
    : live.platform || "Instagram";

  const PlatformIcon =
    platform === "YouTube"
      ? Youtube
      : platform === "Facebook"
      ? Facebook
      : platform === "TikTok"
      ? Music2
      : Instagram;

  return (
    <div className="min-h-full space-y-6 bg-background text-foreground transition-colors duration-300">
      <section
        className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-6 ${
          isPro
            ? "border-[var(--brand-pink)] bg-pink-50/70 dark:bg-white/10"
            : "border-border bg-card"
        }`}
      >
        {isPro && (
          <div className="absolute right-5 top-5 hidden rounded-full bg-[var(--brand-pink)] px-4 py-2 text-xs font-black text-white sm:flex sm:items-center sm:gap-2">
            <Crown className="h-4 w-4" />
            PRO PLAN ACTIVE
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
              {isPro ? (
                <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
              ) : (
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              )}
              {isPro ? "PRO LIVE COMMERCE DASHBOARD" : "AI LIVE COMMERCE DASHBOARD"}
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              <span className="brand-text">
                {isPro ? "Scale your lives." : "Never sleep."}
              </span>
              <br />
              {isPro ? "Sell without limits." : "Never stop selling."}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {isPro
                ? "Your Pro plan unlocks more AI Twins, more platforms, unlimited AI replies, analytics and advanced selling tools."
                : "Manage your AI Twin, train it with your brand knowledge, add products, connect social platforms and start live selling."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={goLive}
                className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
              >
                {isPro ? "Start Pro Live" : "Go Live Now"}
                <Radio className="h-4 w-4" />
              </button>

              <Link
                to="/app/products/add"
                className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-6 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
              >
                Add Product
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-pink-50 p-3 dark:bg-white/10">
            <img
              src={twinImage}
              alt="AI Twin"
              className="h-80 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label="Products"
          value={`${products.length}/${maxProducts}`}
          change={isPro ? "Pro limit" : "Free limit"}
        />
        <StatCard
          icon={Radio}
          label="Live Platforms"
          value={isPro ? `${maxPlatforms}` : "1"}
          change={isPro ? "Multi-platform" : "Free access"}
        />
        <StatCard
          icon={ShoppingBag}
          label="AI Replies"
          value={isPro ? "Unlimited" : "100"}
          change={isPro ? "Unlocked" : "Monthly"}
        />
        <StatCard
          icon={TrendingUp}
          label="Analytics"
          value={isPro ? "Advanced" : "Basic"}
          change={isPro ? "Live sales" : "Limited"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue your AI Twin setup and selling flow.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              icon={ScanFace}
              title={isPro ? "Manage AI Twins" : "Create AI Twin"}
              desc={isPro ? `Create up to ${maxTwins} AI Twins.` : "Create or edit your sales avatar."}
              to="/app/twin/create"
            />
            <ActionCard
              icon={Brain}
              title={isPro ? "Advanced Training" : "Train Twin"}
              desc={isPro ? "Use brand knowledge and custom voice." : "Upload files, links and brand knowledge."}
              to="/app/twin/train"
            />
            <ActionCard
              icon={Package}
              title="Products"
              desc={`Add up to ${maxProducts} products.`}
              to="/app/products"
            />
            <ActionCard
              icon={Instagram}
              title="Connect Social"
              desc={isPro ? "Connect up to 4 platforms." : "Connect 1 live platform."}
              to="/app/connect"
            />
            <ActionCard
              icon={Calendar}
              title="Schedule Live"
              desc="Plan your upcoming live sessions."
              to="/app/schedule"
            />
            <ActionCard
              icon={BarChart3}
              title={isPro ? "Pro Analytics" : "Analytics"}
              desc={isPro ? "Track sales, revenue and live performance." : "Track basic views and activity."}
              to="/app/analytics"
            />
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            AI Twin Status
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-4">
              <img
                src={twinImage}
                alt="AI Twin"
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <h3 className="text-base font-black tracking-tight text-foreground">
                  {twinName}
                </h3>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ● {hasTwin ? "Online" : "Not Created"}
                </p>
                <p className="mt-1 text-xs font-black text-[var(--brand-pink)]">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Progress label="Avatar Created" value={hasTwin ? 100 : 0} />
              <Progress label={isPro ? "Custom Voice" : "Standard Voice"} value={hasTwin ? 80 : 0} />
              <Progress label="Knowledge Added" value={isTrained ? 100 : 35} />
              <Progress label="Products Added" value={Math.min((products.length / maxProducts) * 100, 100)} />
            </div>
          </div>

          {!hasTwin ? (
            <Link
              to="/app/twin/create"
              className="brand-gradient mt-5 flex h-11 items-center justify-center rounded-[5px] text-sm font-bold text-white"
            >
              Create AI Twin
            </Link>
          ) : (
            <Link
              to="/app/twin"
              className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
            >
              View Twin Dashboard
            </Link>
          )}
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight brand-text">
                Recent Products
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Products ready for your AI Twin to sell.
              </p>
            </div>

            <Link
              to="/app/products"
              className="shrink-0 text-sm font-bold text-[var(--brand-pink)] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentProducts.map((product) => (
              <div
                key={product.id || product.name}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.img || "/images/6.jpeg"}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl bg-pink-50 object-contain dark:bg-white/10"
                  />

                  <div>
                    <h3 className="text-base font-black tracking-tight text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold brand-text">
                      {product.price || "₹0"}
                    </p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {product.status || "Ready to sell"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate(`/app/golive?product=${encodeURIComponent(product.name)}`);
                  }}
                  className="brand-gradient rounded-[5px] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
                >
                  Sell Live
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Upcoming Live
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                <PlatformIcon className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-black tracking-tight text-foreground">
                  {platform} Live
                </h3>
                <p className="text-sm text-muted-foreground">{live.product}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <Info icon={Calendar} label="Date" value={live.date || "Not set"} />
              <Info icon={Clock} label="Time" value={live.time || "Not set"} />
            </div>

            <button
              onClick={() => {
              navigate(
  `/app/golive?product=${encodeURIComponent(live.product)}&platform=${encodeURIComponent(platform)}`
);
              }}
              className="brand-gradient mt-5 h-11 w-full rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
            >
              Start This Live
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Connected Accounts
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SocialCard icon={Instagram} name="Instagram" connected />
            <SocialCard icon={Facebook} name="Facebook" connected={isPro} />
            <SocialCard icon={Youtube} name="YouTube" connected={isPro} />
            <SocialCard icon={Music2} name="TikTok" connected={isPro} />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Recent Activity
          </h2>

          <div className="mt-5 space-y-4">
            <ActivityItem
              title={isPro ? "Unlimited AI replies enabled" : "AI answered 45 customer questions"}
              time="10:30 AM"
            />
            <ActivityItem
              title={isPro ? "Advanced analytics unlocked" : "Product added: Vitamin C Glow Serum"}
              time="09:45 AM"
            />
            <ActivityItem
              title={isPro ? "Multi-platform live ready" : "Instagram live completed successfully"}
              time="Yesterday"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight brand-text sm:text-3xl">
            {value}
          </h2>
          <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {change}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-base font-black tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
    </Link>
  );
}

function Progress({ label, value }) {
  const safeValue = Math.round(Number(value) || 0);

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-sm font-bold text-foreground">{label}</span>
        <span className="text-sm font-bold text-[var(--brand-pink)]">
          {safeValue}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-pink-100 dark:bg-white/10">
        <div
          className="brand-gradient h-2 rounded-full"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>
      <span className="text-sm font-black text-foreground">{value}</span>
    </div>
  );
}

function SocialCard({ icon: Icon, name, connected }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
        <p className="text-sm font-black text-foreground">{name}</p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          connected
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
        }`}
      >
        {connected ? "Connected" : "Upgrade"}
      </span>
    </div>
  );
}

function ActivityItem({ title, time }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-background p-4">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

      <div>
        <p className="text-sm font-bold leading-6 text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}