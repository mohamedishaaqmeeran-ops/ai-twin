// src/pages/dashboard/ContentCreatorDashboard.jsx

import {
  ArrowRight,
  BarChart3,
  Calendar,
  Eye,
  Package,
  Radio,
  ScanFace,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

export default function ContentCreatorDashboard() {
  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const twins = Array.isArray(user?.twins)
    ? user.twins
    : user?.twin
      ? [user.twin]
      : [];

  const products = Array.isArray(user?.products)
    ? user.products
    : [];

  const schedules = Array.isArray(user?.schedules)
    ? user.schedules
    : Array.isArray(user?.liveSchedules)
      ? user.liveSchedules
      : [];

  const latestTwin =
    user?.twin ||
    twins[0] ||
    null;

  const actions = [
    {
      title: "View AI Twins",
      description:
        "Review AI Twins assigned to your content workflow.",
      icon: ScanFace,
      to: "/app/twin",
    },
    {
      title: "View Products",
      description:
        "Review products available for upcoming content.",
      icon: Package,
      to: "/app/products",
    },
    {
      title: "View Schedule",
      description:
        "Check upcoming live sessions and content dates.",
      icon: Calendar,
      to: "/app/schedule",
    },
    {
      title: "View Live Activity",
      description:
        "Review available and previously scheduled live activity.",
      icon: Radio,
      to: "/app/golive",
    },
    {
      title: "View Analytics",
      description:
        "Track engagement, reach and live performance.",
      icon: BarChart3,
      to: "/app/analytics",
    },
  ];

  return (
    <div className="min-h-full space-y-6 bg-background text-foreground">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--brand-pink)] bg-pink-50/70 p-6 shadow-sm dark:bg-white/10 sm:p-8">
        <div className="absolute right-6 top-6 hidden rounded-full bg-[var(--brand-pink)] px-4 py-2 text-xs font-black text-white sm:block">
          CONTENT CREATOR
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          CREATOR WORKSPACE
        </span>

        <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
          Create content with{" "}
          <span className="brand-text">
            AI-powered commerce.
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
          Review assigned AI Twins, products, live schedules and
          analytics. Editing and account management remain restricted.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CreatorStat
          icon={ScanFace}
          label="Assigned Twins"
          value={twins.length}
          detail="View access"
        />

        <CreatorStat
          icon={Package}
          label="Products"
          value={products.length}
          detail="Available content"
        />

        <CreatorStat
          icon={Calendar}
          label="Schedules"
          value={schedules.length}
          detail="Upcoming sessions"
        />

        <CreatorStat
          icon={Eye}
          label="Access"
          value="View"
          detail="Restricted editing"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-black brand-text">
            Creator Actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Available tools are based on your content creator role.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {actions.map(
              ({
                title,
                description,
                icon: Icon,
                to,
              }) => (
                <Link
                  key={title}
                  to={to}
                  className="rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-base font-black">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)]">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-black brand-text">
            Assigned AI Twin
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <img
              src={
                latestTwin?.image ||
                latestTwin?.avatarImage ||
                "/images/bbb.png"
              }
              alt="Assigned AI Twin"
              className="h-56 w-full rounded-2xl object-cover"
            />

            <h3 className="mt-4 text-lg font-black">
              {latestTwin?.name || "No AI Twin assigned"}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {latestTwin
                ? latestTwin?.status || "Available"
                : "Contact a manager or brand creator for access."}
            </p>

            <Link
              to="/app/twin"
              className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)]"
            >
              View Twin
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

function CreatorStat({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {label}
          </p>

          <h2 className="mt-2 text-3xl font-black brand-text">
            {value}
          </h2>

          <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {detail}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
