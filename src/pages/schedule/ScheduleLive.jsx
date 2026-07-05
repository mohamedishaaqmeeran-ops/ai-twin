import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  AlertCircle,
} from "lucide-react";

import { fetchConnections } from "../../features/social/socialSlice";
import { fetchMe } from "../../features/auth/authSlice";

const API = "https://twinn-backend.onrender.com/api";

const normalizePlatform = (platform = "") =>
  platform.toString().trim().toLowerCase();

const platformLabel = (platform = "") => {
  const p = normalizePlatform(platform);

  const labels = {
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
  };

  return labels[p] || platform;
};

export default function ScheduleLive() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const { connections = [], loading: socialLoading } = useSelector(
    (state) => state.social || {}
  );

  const plan = user?.plan || "free";
  const isPro = plan === "pro" || plan === "business";

  const maxSchedules = isPro ? 50 : 1;
  const maxPlatforms = isPro ? 4 : 1;

  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleted, setDeleted] = useState(false);

  const connectedPlatforms = useMemo(() => {
    return connections
      .filter((item) => item?.connected !== false)
      .map((item) => normalizePlatform(item.platform))
      .filter(Boolean);
  }, [connections]);

  const connectedPlatformSet = useMemo(() => {
    return new Set(connectedPlatforms);
  }, [connectedPlatforms]);

  const loadSchedules = async () => {
    try {
      setLoadingSchedules(true);
      setError("");

      const res = await fetch(`${API}/schedules`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to load schedules");
      }

      const list = Array.isArray(data)
        ? data
        : data.schedules || data.data || [];

      setSchedules(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Unable to load schedules");
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }

    dispatch(fetchConnections());
    loadSchedules();
  }, [dispatch]);

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const getSchedulePlatforms = (schedule) => {
    const rawPlatforms = Array.isArray(schedule?.platforms)
      ? schedule.platforms
      : schedule?.platform
      ? [schedule.platform]
      : [];

    return rawPlatforms.map(platformLabel).filter(Boolean);
  };

  const getConnectedSchedulePlatforms = (schedule) => {
    const schedulePlatforms = getSchedulePlatforms(schedule);

    const connected = schedulePlatforms.filter((platform) =>
      connectedPlatformSet.has(normalizePlatform(platform))
    );

    return isPro ? connected : connected.slice(0, 1);
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const platforms = getSchedulePlatforms(item);

      const searchText = `
        ${item.title || ""}
        ${item.product || ""}
        ${item.productName || ""}
        ${platforms.join(" ")}
      `.toLowerCase();

      const matchesSearch = searchText.includes(query.toLowerCase());

      const currentStatus = item.status || "Upcoming";
      const matchesStatus =
        statusFilter === "All" || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [schedules, query, statusFilter]);

  const deleteSchedule = async (id) => {
    try {
      if (!id) return;

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this schedule?"
      );

      if (!confirmDelete) return;

      const res = await fetch(`${API}/schedules/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to delete schedule");
      }

      setSchedules((prev) =>
        prev.filter((item) => (item._id || item.id) !== id)
      );

      setDeleted(true);
      setTimeout(() => setDeleted(false), 2000);
    } catch (err) {
      alert(err.message || "Unable to delete schedule");
    }
  };

  const startLive = (schedule) => {
    const allowedPlatforms = getConnectedSchedulePlatforms(schedule);

    if (!allowedPlatforms.length) {
      alert(
        "No connected platform found for this schedule. Please connect the platform first."
      );
      navigate("/app/connect");
      return;
    }

    navigate("/app/golive", {
      state: {
        schedule,
        product: schedule.product || schedule.productName,
        platforms: allowedPlatforms,
      },
    });
  };

  const totalPlatforms = useMemo(() => {
    const allPlatforms = schedules.flatMap((item) =>
      getConnectedSchedulePlatforms(item)
    );

    return new Set(allPlatforms.map((platform) => normalizePlatform(platform)))
      .size;
  }, [schedules, connectedPlatformSet, isPro]);

  const upcomingCount = schedules.filter(
    (item) => (item.status || "Upcoming") === "Upcoming"
  ).length;

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
                {isPro ? (
                  <Crown className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
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
                ? "Plan multiple AI Twin live sessions with multi-platform scheduling. Only connected platforms can go live."
                : "Free plan supports 1 scheduled live and 1 connected platform. Upgrade for multiple schedules and platforms."}
            </p>

            {!connectedPlatforms.length && !socialLoading && (
              <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-white/10 dark:bg-white/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-orange-600 dark:text-orange-400">
                      No social platform connected
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Connect Instagram, Facebook, YouTube or TikTok before
                      starting a live session.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/app/connect")}
                    className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
                  >
                    Connect Platform
                  </button>
                </div>
              </div>
            )}

            {!isPro && (
              <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-[var(--brand-pink)]">
                      Schedule Limit: {schedules.length}/{maxSchedules}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upgrade to Pro for 50 scheduled lives and all connected
                      platforms.
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
          value={loadingSchedules ? "..." : `${schedules.length}/${maxSchedules}`}
        />

        <StatCard
          icon={Radio}
          label="Upcoming"
          value={loadingSchedules ? "..." : upcomingCount}
        />

        <StatCard
          icon={Instagram}
          label="Connected Platforms"
          value={`${Math.min(totalPlatforms, maxPlatforms)}/${maxPlatforms}`}
        />

        <StatCard
          icon={Clock}
          label="Next Live"
          value={schedules[0]?.time ? formatTime(schedules[0].time) : "--"}
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
        <div>
          <h2 className="text-xl font-black tracking-tight brand-text">
            {isPro ? "Pro Upcoming Sessions" : "Upcoming Sessions"}
          </h2>

          <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
            Start, manage or delete your live selling sessions.
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {loadingSchedules ? (
            <div className="rounded-2xl border border-border bg-background p-8 text-center text-sm font-bold text-muted-foreground">
              Loading schedules...
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-8 text-center">
              <Calendar className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

              <p className="mt-3 text-lg font-black tracking-tight text-foreground">
                No live sessions found
              </p>

              <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                Create a schedule to start your AI Twin live selling session.
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
              const schedulePlatforms = getSchedulePlatforms(s);
              const connectedVisiblePlatforms = getConnectedSchedulePlatforms(s);

              const disconnectedPlatforms = schedulePlatforms.filter(
                (platform) =>
                  !connectedPlatformSet.has(normalizePlatform(platform))
              );

              const canStartLive = connectedVisiblePlatforms.length > 0;

              return (
                <div
                  key={s._id || s.id}
                  className="rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-foreground">
                        {s.title || "Untitled Live"}
                      </h3>

                      <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                        {s.product || s.productName || "No product selected"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Info icon={Calendar} text={formatDate(s.date)} />
                        <Info icon={Clock} text={formatTime(s.time)} />
                        <Info
                          icon={Radio}
                          text={
                            connectedVisiblePlatforms.length
                              ? connectedVisiblePlatforms.join(", ")
                              : "No connected platform"
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold tracking-wide text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {s.status || "Upcoming"}
                      </span>

                      {isPro && (
                        <span className="rounded-full bg-pink-500 px-4 py-2 text-xs font-black tracking-wide text-white">
                          PRO
                        </span>
                      )}

                      <button
                        disabled={!canStartLive}
                        onClick={() => startLive(s)}
                        className="brand-gradient flex h-10 items-center gap-2 rounded-[5px] px-4 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Play className="h-4 w-4" />
                        {canStartLive ? "Start Live" : "Connect First"}
                      </button>

                      <button
                        onClick={() => deleteSchedule(s._id || s.id)}
                        className="grid h-10 w-10 place-items-center rounded-[5px] border border-border text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {connectedVisiblePlatforms.map((platform) => (
                      <PlatformBadge
                        key={platform}
                        platform={platform}
                        connected
                      />
                    ))}

                    {disconnectedPlatforms.map((platform) => (
                      <PlatformBadge
                        key={platform}
                        platform={platform}
                        connected={false}
                      />
                    ))}
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

function PlatformBadge({ platform, connected = true }) {
  const icons = {
    Instagram,
    YouTube: Youtube,
    Facebook,
    TikTok: Music2,
  };

  const label = platformLabel(platform);
  const Icon = icons[label] || Radio;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold tracking-wide ${
        connected
          ? "border-border bg-card text-foreground"
          : "border-orange-200 bg-orange-50 text-orange-600 dark:border-white/10 dark:bg-white/10 dark:text-orange-400"
      }`}
    >
      <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
      {label}
      {!connected && <span className="text-xs">Not connected</span>}
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

  date.setHours(Number(hour), Number(minute));

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}