// src/pages/dashboard/ManagerDashboard.jsx

import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  Package,
  Radio,
  ScanFace,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

export default function ManagerDashboard() {
  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const twins = Array.isArray(user?.twins)
    ? user.twins
    : [];

  const products = Array.isArray(user?.products)
    ? user.products
    : [];

  const schedules = Array.isArray(user?.schedules)
    ? user.schedules
    : Array.isArray(user?.liveSchedules)
      ? user.liveSchedules
      : [];

  const teamMembers = Array.isArray(user?.teamMembers)
    ? user.teamMembers
    : [];

  const actions = [
    {
      title: "Manage AI Twins",
      description:
        "Review, create, edit and train AI Twins.",
      icon: ScanFace,
      to: "/app/twin",
    },
    {
      title: "Manage Products",
      description:
        "Review products used in live commerce sessions.",
      icon: Package,
      to: "/app/products",
    },
    {
      title: "Manage Schedules",
      description:
        "Create and review upcoming live sessions.",
      icon: Calendar,
      to: "/app/schedule",
    },
    {
      title: "Start Live Session",
      description:
        "Launch a trained AI Twin on connected platforms.",
      icon: Radio,
      to: "/app/golive",
    },
    {
      title: "View Analytics",
      description:
        "Track platform activity and live performance.",
      icon: BarChart3,
      to: "/app/analytics",
    },
    {
      title: "Platform Settings",
      description:
        "Manage operational and account settings.",
      icon: Settings,
      to: "/app/settings",
    },
  ];

  return (
    <div className="min-h-full space-y-6 bg-background text-foreground">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--brand-pink)] bg-pink-50/70 p-6 shadow-sm dark:bg-white/10 sm:p-8">
        <div className="absolute right-6 top-6 hidden items-center gap-2 rounded-full bg-[var(--brand-pink)] px-4 py-2 text-xs font-black text-white sm:flex">
          <ShieldCheck className="h-4 w-4" />
          MANAGER ACCESS
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold">
          <Activity className="h-4 w-4 text-[var(--brand-pink)]" />
          PLATFORM OPERATIONS
        </span>

        <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
          Operate the{" "}
          <span className="brand-text">
            live commerce platform.
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
          Manage AI Twins, products, schedules, live sessions and
          platform performance without customer subscription limits.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStat
          icon={ScanFace}
          label="AI Twins"
          value={twins.length}
          detail="Managed twins"
        />

        <ManagerStat
          icon={Package}
          label="Products"
          value={products.length}
          detail="Available products"
        />

        <ManagerStat
          icon={Calendar}
          label="Schedules"
          value={schedules.length}
          detail="Live schedules"
        />

        <ManagerStat
          icon={Users}
          label="Team Members"
          value={teamMembers.length}
          detail="Operational users"
        />
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black brand-text">
          Manager Actions
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Internal access is controlled by role permissions.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
      </section>
    </div>
  );
}

function ManagerStat({
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
