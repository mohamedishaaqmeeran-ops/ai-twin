import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  Clock,
  Radio,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  Trash2,
  Play,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Crown,
  Lock,
} from "lucide-react";

const defaultSchedules = [
  {
    id: 1,
    product: "Vitamin C Glow Serum",
    title: "Glow Serum Evening Sale",
    date: "2026-05-25",
    time: "19:30",
    platforms: ["Instagram"],
    status: "Upcoming",
  },
  {
    id: 2,
    product: "Wireless Headphone",
    title: "Headphone Live Offer",
    date: "2026-05-26",
    time: "16:00",
    platforms: ["YouTube"],
    status: "Upcoming",
  },
];

export default function ScheduleLive() {
  const navigate = useNavigate();

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";
  const maxSchedules = isPro ? 50 : 1;
  const maxPlatforms = isPro ? 4 : 1;

  const [schedules, setSchedules] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("liveSchedules") || "[]");

    if (saved.length) {
      setSchedules(saved);
    } else {
      const initial = isPro ? defaultSchedules : defaultSchedules.slice(0, 1);
      setSchedules(initial);
      localStorage.setItem("liveSchedules", JSON.stringify(initial));
    }
  }, [isPro]);

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const text = `${item.title} ${item.product} ${
        Array.isArray(item.platforms)
          ? item.platforms.join(" ")
          : item.platform || ""
      }`.toLowerCase();

      const matchesSearch = text.includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [schedules, query, statusFilter]);

  const deleteSchedule = (id) => {
    const updated = schedules.filter((item) => item.id !== id);

    setSchedules(updated);
    localStorage.setItem("liveSchedules", JSON.stringify(updated));

    setDeleted(true);
    setTimeout(() => setDeleted(false), 2000);
  };

  const startLive = (schedule) => {
    const platforms = schedule.platforms || [schedule.platform];
    const allowedPlatforms = isPro ? platforms : platforms.slice(0, 1);

    localStorage.setItem("selectedProduct", schedule.product);
    localStorage.setItem("selectedPlatforms", JSON.stringify(allowedPlatforms));
    localStorage.setItem("currentLiveSchedule", JSON.stringify(schedule));

    navigate("/app/golive");
  };

  const allPlatforms = schedules.flatMap((item) => item.platforms || [item.platform]);
  const totalPlatforms = new Set(allPlatforms).size;
  const canCreateSchedule = schedules.length < maxSchedules;

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                {isPro ? (
                  <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
                ) : (
                  <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
                )}
                {isPro ? "PRO LIVE SCHEDULE" : "LIVE SCHEDULE"}
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
                {isPro ? "Schedule Pro" : "Schedule"}
              </span>{" "}
              Live
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              {isPro
                ? "Plan multiple AI Twin live sessions with multi-platform scheduling and advanced selling flow."
                : "Free plan supports 1 scheduled live and 1 platform. Upgrade for multiple schedules and platforms."}
            </p>

            {!isPro && (
              <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-[var(--brand-pink)]">
                      Schedule Limit: {schedules.length}/{maxSchedules}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upgrade to Pro for 50 scheduled lives and all platforms.
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
          </div>

          {canCreateSchedule ? (
            <Link
              to="/app/schedule/create"
              className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Plus size={18} />
              Schedule Live
            </Link>
          ) : (
            <button
              onClick={upgradeToPro}
              className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Lock size={18} />
              Add More - Pro
            </button>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Total Scheduled"
          value={`${schedules.length}/${maxSchedules}`}
        />

        <StatCard
          icon={Radio}
          label="Upcoming"
          value={schedules.filter((item) => item.status === "Upcoming").length}
        />

        <StatCard
          icon={Instagram}
          label="Platforms"
          value={`${Math.min(totalPlatforms, maxPlatforms)}/${maxPlatforms}`}
        />

        <StatCard
          icon={Clock}
          label="Next Live"
          value={schedules[0]?.time || "--"}
        />
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search schedule by product, title or platform..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Filter className="h-5 w-5 text-[var(--brand-pink)]" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-bold text-foreground outline-none"
            >
              <option>All</option>
              <option>Upcoming</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight brand-text">
              {isPro ? "Pro Upcoming Sessions" : "Upcoming Sessions"}
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Start, manage or delete your live selling sessions.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredSchedules.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-8 text-center">
              <Calendar className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

              <p className="mt-3 text-lg font-black tracking-tight text-foreground">
                No matching live sessions
              </p>

              <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                Try another search or create a new schedule.
              </p>

              {canCreateSchedule ? (
                <Link
                  to="/app/schedule/create"
                  className="brand-gradient mt-5 inline-flex rounded-[5px] px-5 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Create Schedule
                </Link>
              ) : (
                <button
                  onClick={upgradeToPro}
                  className="brand-gradient mt-5 inline-flex rounded-[5px] px-5 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Upgrade to Create More
                </button>
              )}
            </div>
          ) : (
            filteredSchedules.map((s) => {
              const platforms = s.platforms || [s.platform];
              const visiblePlatforms = isPro ? platforms : platforms.slice(0, 1);
              const hasLockedPlatforms = !isPro && platforms.length > 1;

              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-foreground">
                        {s.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                        {s.product}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Info icon={Calendar} text={formatDate(s.date)} />
                        <Info icon={Clock} text={formatTime(s.time)} />
                        <Info icon={Radio} text={visiblePlatforms.join(", ")} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold tracking-wide text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {s.status || "Upcoming"}
                      </span>

                      {isPro && (
                        <span className="rounded-full bg-pink-500 px-4 py-2 text-xs font-black tracking-wide text-white">
                          PRO SCHEDULE
                        </span>
                      )}

                      <button
                        onClick={() => startLive(s)}
                        className="brand-gradient flex h-10 items-center gap-2 rounded-[5px] px-4 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                      >
                        <Play className="h-4 w-4" />
                        {isPro ? "Start Pro Live" : "Start Live"}
                      </button>

                      <button
                        onClick={() => deleteSchedule(s.id)}
                        className="grid h-10 w-10 place-items-center rounded-[5px] border border-border text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {visiblePlatforms.map((platform) => (
                      <PlatformBadge key={platform} platform={platform} />
                    ))}

                    {hasLockedPlatforms && (
                      <button
                        onClick={upgradeToPro}
                        className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] dark:border-white/10 dark:bg-white/10"
                      >
                        <Lock className="h-4 w-4" />
                        More Platforms - Pro
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {deleted && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold tracking-wide text-foreground shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          Schedule deleted successfully
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>

          <p className="text-2xl font-black tracking-tight brand-text">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold tracking-wide text-foreground">
      <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
      {text}
    </span>
  );
}

function PlatformBadge({ platform }) {
  const icons = {
    Instagram,
    YouTube: Youtube,
    Facebook,
    TikTok: Music2,
  };

  const Icon = icons[platform] || Radio;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold tracking-wide text-foreground">
      <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
      {platform}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "No time";

  const [hour, minute] = time.split(":");
  const date = new Date();

  date.setHours(hour, minute);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}