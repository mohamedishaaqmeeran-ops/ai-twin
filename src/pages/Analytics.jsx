import {
  TrendingUp,
  ShoppingBag,
  Eye,
  Heart,
  IndianRupee,
  Users,
  BarChart3,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  Sparkles,
  Crown,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";

  const twinName = localStorage.getItem("twinName") || "My AI Twin";
  const twinImage = localStorage.getItem("twinImage") || "/images/bb.png";

  const lastLiveSummary = JSON.parse(
    localStorage.getItem("lastLiveSummary") || "{}"
  );

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}
            {isPro ? "PRO AI ANALYTICS" : "AI ANALYTICS"}
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
          <span className="brand-text">
            {isPro ? "Advanced Performance" : "Performance"}
          </span>{" "}
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          {isPro
            ? "Track advanced AI Twin sales, live sessions, product revenue, audience engagement and platform performance."
            : "Track basic AI Twin live sessions, product sales and audience engagement."}
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Advanced analytics locked
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upgrade to Pro for revenue breakdown, platform comparison and conversion insights.
                </p>
              </div>

              <button
                onClick={() => navigate("/pricing")}
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Eye} title="Total Views" value={isPro ? "85.4K" : "25.4K"} growth={isPro ? "+48%" : "+18%"} />
        <Stat icon={ShoppingBag} title="Orders" value={isPro ? "4,245" : "1,245"} growth={isPro ? "+62%" : "+32%"} />
        <Stat icon={IndianRupee} title="Revenue" value={isPro ? "₹24.85L" : "₹9.85L"} growth={isPro ? "+72%" : "+42%"} />
        <Stat icon={Heart} title="Engagement" value={isPro ? "28.6%" : "12.6%"} growth={isPro ? "+35%" : "+15%"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black tracking-tight text-foreground">
                {isPro ? "Advanced Live Performance" : "Live Performance"}
              </h2>

              <BarChart3 className="h-6 w-6 text-[var(--brand-pink)]" />
            </div>

            <div className="mt-6 flex h-72 items-end justify-between rounded-2xl bg-pink-50 p-6 dark:bg-white/10">
              {(isPro ? [55, 78, 62, 90, 70, 100, 88] : [40, 60, 45, 80, 55, 90, 75]).map((v, i) => (
                <div
                  key={i}
                  className="brand-gradient w-8 rounded-t-xl"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Top Selling Products
            </h2>

            <div className="mt-5 space-y-4">
              <Product name="Vitamin C Glow Serum" sales={isPro ? "1,524 Orders" : "524 Orders"} percent={90} />
              <Product name="Wireless Headphone" sales={isPro ? "912 Orders" : "312 Orders"} percent={65} />
              <Product name="Smart Watch" sales={isPro ? "701 Orders" : "201 Orders"} percent={45} />
              {isPro && <Product name="Beauty Bundle Offer" sales="488 Orders" percent={38} />}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Recent Live Sessions
            </h2>

            <div className="mt-5 space-y-4">
              <Live title={lastLiveSummary.product || "Glow Serum Evening Sale"} viewers={lastLiveSummary.viewers ? `${lastLiveSummary.viewers}` : "4.8K"} revenue={lastLiveSummary.revenue ? `₹${lastLiveSummary.revenue.toLocaleString("en-IN")}` : "₹58,900"} date={lastLiveSummary.endedAt || "Today"} time="Live ended" status="Completed" />
              <Live title="Headphone Flash Sale" viewers="3.2K" revenue="₹42,500" date="Yesterday" time="07:30 PM" status="Completed" />
              <Live title="Smart Watch Demo" viewers="2.6K" revenue="₹31,800" date="2 days ago" time="06:00 PM" status="Completed" />
              {isPro && <Live title="Multi Platform Beauty Sale" viewers="12.8K" revenue="₹1,58,900" date="Pro Live" time="Multi-platform" status="Completed" />}
            </div>
          </div>

          {isPro ? (
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black tracking-tight brand-text">
                Pro Conversion Insights
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Insight title="Conversion Rate" value="8.7%" />
                <Insight title="Avg Order Value" value="₹1,420" />
                <Insight title="Best Platform" value="Instagram" />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5 shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-6">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[var(--brand-pink)]" />
                <h2 className="text-xl font-black tracking-tight text-foreground">
                  Pro Conversion Insights
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Upgrade to see conversion rate, best platform, average order value and customer behavior.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              AI Twin Status
            </h2>

            <div className="mt-5 rounded-2xl bg-pink-50 p-5 dark:bg-white/10">
              <img
                src={twinImage}
                alt="AI Twin"
                className="mx-auto h-40 rounded-[5px] object-contain"
              />

              <h3 className="mt-4 text-center text-xl font-black tracking-tight text-foreground">
                {twinName}
              </h3>

              <p className="text-center text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                ● {isPro ? "Pro Online" : "Online"}
              </p>
            </div>

            <Progress label="Avatar Created" value="100%" width="100%" />
            <Progress label={isPro ? "Custom Voice" : "Voice Training"} value={isPro ? "98%" : "90%"} width={isPro ? "98%" : "90%"} />
            <Progress label={isPro ? "Advanced Knowledge" : "Knowledge Base"} value={isPro ? "95%" : "85%"} width={isPro ? "95%" : "85%"} />
            <Progress label="Products Added" value={isPro ? "90%" : "70%"} width={isPro ? "90%" : "70%"} />
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Platform Performance
            </h2>

            <div className="mt-5 space-y-4">
              <Platform icon={Instagram} name="Instagram" value={isPro ? "45%" : "100%"} />
              <Platform icon={Youtube} name="YouTube" value={isPro ? "30%" : "Pro"} locked={!isPro} />
              <Platform icon={Facebook} name="Facebook" value={isPro ? "15%" : "Pro"} locked={!isPro} />
              <Platform icon={Music2} name="TikTok" value={isPro ? "10%" : "Pro"} locked={!isPro} />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, title, value, growth }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight brand-text sm:text-4xl">
            {value}
          </h2>
          <p className="mt-2 text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
            {growth}
          </p>
        </div>

        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function Product({ name, sales, percent }) {
  return (
    <div>
      <div className="flex justify-between gap-4 text-sm font-bold tracking-tight text-foreground">
        <span>{name}</span>
        <span className="text-muted-foreground">{sales}</span>
      </div>

      <div className="mt-2 h-3 rounded-full bg-pink-100 dark:bg-white/10">
        <div className="brand-gradient h-3 rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Live({ title, viewers, revenue, date, time, status = "Live" }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-black tracking-tight text-foreground">
          {title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            status === "Live"
              ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          }`}
        >
          ● {status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Date
          </p>
          <p className="mt-1 text-sm font-black text-foreground">{date}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Time
          </p>
          <p className="mt-1 text-sm font-black text-foreground">{time}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-3">
        <div>
          <p className="text-xs text-muted-foreground">Viewers</p>
          <p className="text-sm font-black text-foreground">{viewers}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-sm font-black brand-text">{revenue}</p>
        </div>
      </div>
    </div>
  );
}

function Progress({ label, value, width }) {
  return (
    <div className="mt-5">
      <div className="flex justify-between gap-4 text-sm font-bold tracking-tight text-foreground">
        <span>{label}</span>
        <span className="text-[var(--brand-pink)]">{value}</span>
      </div>

      <div className="mt-2 h-3 rounded-full bg-pink-100 dark:bg-white/10">
        <div className="brand-gradient h-3 rounded-full" style={{ width }} />
      </div>
    </div>
  );
}

function Platform({ icon: Icon, name, value, locked }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        {locked ? (
          <Lock className="h-5 w-5 text-[var(--brand-pink)]" />
        ) : (
          <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
        )}

        <span className="text-sm font-bold tracking-tight text-foreground">
          {name}
        </span>
      </div>

      <span className="text-sm font-black tracking-tight brand-text">
        {value}
      </span>
    </div>
  );
}

function Insight({ title, value }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-xl font-black brand-text">{value}</p>
    </div>
  );
}