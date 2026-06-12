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

  const [schedules, setSchedules] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("liveSchedules") || "[]");

    if (saved.length) {
      setSchedules(saved);
    } else {
      setSchedules(defaultSchedules);
      localStorage.setItem("liveSchedules", JSON.stringify(defaultSchedules));
    }
  }, []);

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

    setTimeout(() => {
      setDeleted(false);
    }, 2000);
  };

  const startLive = (schedule) => {
    localStorage.setItem("selectedProduct", schedule.product);
    localStorage.setItem(
      "selectedPlatforms",
      JSON.stringify(schedule.platforms || [schedule.platform])
    );
    localStorage.setItem("currentLiveSchedule", JSON.stringify(schedule));

    navigate("/app/golive");
  };

  const totalPlatforms = new Set(
    schedules.flatMap((item) => item.platforms || [item.platform])
  ).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              LIVE SCHEDULE
            </span>

            <h1 className="mt-5 text-3xl font-black sm:text-4xl">
              <span className="brand-text">Schedule</span> Live
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Plan upcoming AI Twin live selling sessions. Select product,
              platform and timing before going live.
            </p>
          </div>

          <Link
            to="/app/schedule/create"
            className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md hover:opacity-90"
          >
            <Plus size={18} />
            Schedule Live
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Total Scheduled"
          value={schedules.length}
        />
        <StatCard
          icon={Radio}
          label="Upcoming"
          value={schedules.filter((item) => item.status === "Upcoming").length}
        />
        <StatCard icon={Instagram} label="Platforms" value={totalPlatforms} />
        <StatCard
          icon={Clock}
          label="Next Live"
          value={schedules[0]?.time || "--"}
        />
      </div>

      {/* Search + Filter */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search schedule by product, title or platform..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Filter className="h-5 w-5 text-[var(--brand-pink)]" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none"
            >
              <option>All</option>
              <option>Upcoming</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black brand-text">
              Upcoming Sessions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start, manage or delete your live selling sessions.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredSchedules.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-8 text-center">
              <Calendar className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />
              <p className="mt-3 font-black">No matching live sessions</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another search or create a new schedule.
              </p>

              <Link
                to="/app/schedule/create"
                className="brand-gradient mt-5 inline-flex rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Create Schedule
              </Link>
            </div>
          ) : (
            filteredSchedules.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-black">{s.title}</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.product}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <Info icon={Calendar} text={formatDate(s.date)} />
                      <Info icon={Clock} text={formatTime(s.time)} />
                      <Info
                        icon={Radio}
                        text={
                          Array.isArray(s.platforms)
                            ? s.platforms.join(", ")
                            : s.platform
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">
                      {s.status || "Upcoming"}
                    </span>

                    <button
                      onClick={() => startLive(s)}
                      className="brand-gradient flex h-10 items-center gap-2 rounded-[5px] px-4 text-sm font-bold text-white hover:opacity-90"
                    >
                      <Play className="h-4 w-4" />
                      Start Live
                    </button>

                    <button
                      onClick={() => deleteSchedule(s.id)}
                      className="grid h-10 w-10 place-items-center rounded-[5px] border border-border text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {(s.platforms || [s.platform]).map((platform) => (
                    <PlatformBadge key={platform} platform={platform} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleted && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0d0d12] px-5 py-4 text-sm font-bold text-white shadow-xl">
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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-black brand-text">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 font-bold text-foreground">
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
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold">
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