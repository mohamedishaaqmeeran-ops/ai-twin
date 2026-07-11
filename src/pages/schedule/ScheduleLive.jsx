import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useNavigate,
} from "react-router-dom";

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
  RefreshCw,
  Eye,
} from "lucide-react";

import {
  fetchConnections,
} from "../../features/social/socialSlice";

import {
  fetchMe,
} from "../../features/auth/authSlice";

const API =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "https://twinn-backend.onrender.com/api";

const normalizePlatform = (
  platform = ""
) =>
  String(platform)
    .trim()
    .toLowerCase();

const platformLabel = (
  platform = ""
) => {
  const normalized =
    normalizePlatform(platform);

  const labels = {
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
  };

  return labels[normalized] || platform;
};

const getScheduleDateTime = (
  schedule
) => {
  if (schedule?.scheduledAt) {
    return schedule.scheduledAt;
  }

  if (
    schedule?.date &&
    schedule?.time
  ) {
    const normalizedTime =
      String(schedule.time).length === 5
        ? `${schedule.time}:00`
        : schedule.time;

    return `${schedule.date}T${normalizedTime}`;
  }

  return schedule?.date || null;
};

const getScheduleTimestamp = (
  schedule
) => {
  const value =
    getScheduleDateTime(schedule);

  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
};

const getNextUpcomingSchedule = (
  schedules = []
) => {
  const now = Date.now();

  return [...schedules]
    .filter((schedule) => {
      const status = String(
        schedule.status || "Upcoming"
      ).toLowerCase();

      const timestamp =
        getScheduleTimestamp(schedule);

      return (
        status === "upcoming" &&
        timestamp >= now
      );
    })
    .sort(
      (first, second) =>
        getScheduleTimestamp(first) -
        getScheduleTimestamp(second)
    )[0];
};

export default function ScheduleLive() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) =>
      state.auth || {}
  );

  const {
    connections = [],
    loading: socialLoading,
  } = useSelector(
    (state) =>
      state.social || {}
  );

  const plan = String(
    user?.plan || "free"
  ).toLowerCase();

  const isPro =
    plan === "pro" ||
    plan === "business" ||
    plan === "agency";

  const maxSchedules =
    isPro ? 50 : 1;

  const maxPlatforms =
    isPro ? 4 : 1;

  const [schedules, setSchedules] =
    useState([]);

  const [
    loadingSchedules,
    setLoadingSchedules,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [query, setQuery] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [deleted, setDeleted] =
    useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const connectedPlatforms =
    useMemo(() => {
      return connections
        .filter(
          (item) =>
            item?.connected !== false
        )
        .map((item) =>
          normalizePlatform(
            item.platform
          )
        )
        .filter(Boolean);
    }, [connections]);

  const connectedPlatformSet =
    useMemo(() => {
      return new Set(
        connectedPlatforms
      );
    }, [connectedPlatforms]);

  const loadSchedules =
    useCallback(
      async ({
        silent = false,
      } = {}) => {
        try {
          if (!silent) {
            setLoadingSchedules(true);
          }

          setError("");

          const res = await fetch(
            `${API}/schedules`,
            {
              method: "GET",
              credentials:
                "include",
            }
          );

          const data = await res
            .json()
            .catch(() => ({}));

          if (
            !res.ok ||
            data.success === false
          ) {
            throw new Error(
              data.message ||
                "Unable to load schedules"
            );
          }

          const list =
            Array.isArray(data)
              ? data
              : data.schedules ||
                data.data ||
                [];

          const normalizedList =
            Array.isArray(list)
              ? [...list].sort(
                  (
                    first,
                    second
                  ) =>
                    getScheduleTimestamp(
                      first
                    ) -
                    getScheduleTimestamp(
                      second
                    )
                )
              : [];

          setSchedules(
            normalizedList
          );
        } catch (err) {
          setError(
            err.message ||
              "Unable to load schedules"
          );
        } finally {
          if (!silent) {
            setLoadingSchedules(
              false
            );
          }
        }
      },
      []
    );

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }

    dispatch(
      fetchConnections()
    );

    loadSchedules();
  }, [
    dispatch,
    user,
    loadSchedules,
  ]);

  useEffect(() => {
    const intervalId =
      window.setInterval(() => {
        loadSchedules({
          silent: true,
        });
      }, 30000);

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, [loadSchedules]);

  const refreshSchedules =
    async () => {
      try {
        setRefreshing(true);

        await Promise.all([
          loadSchedules(),
          dispatch(
            fetchConnections()
          ),
        ]);
      } finally {
        setRefreshing(false);
      }
    };

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const getSchedulePlatforms = (
    schedule
  ) => {
    const rawPlatforms =
      Array.isArray(
        schedule?.platforms
      )
        ? schedule.platforms
        : schedule?.platform
        ? [schedule.platform]
        : [];

    return rawPlatforms
      .map(platformLabel)
      .filter(Boolean);
  };

  const getConnectedSchedulePlatforms =
    (schedule) => {
      const schedulePlatforms =
        getSchedulePlatforms(
          schedule
        );

      const connected =
        schedulePlatforms.filter(
          (platform) =>
            connectedPlatformSet.has(
              normalizePlatform(
                platform
              )
            )
        );

      return isPro
        ? connected
        : connected.slice(0, 1);
    };

  const filteredSchedules =
    useMemo(() => {
      const normalizedQuery =
        query
          .toLowerCase()
          .trim();

      return schedules.filter(
        (item) => {
          const platforms =
            getSchedulePlatforms(
              item
            );

          const searchText = `
            ${item.title || ""}
            ${item.product || ""}
            ${item.productName || ""}
            ${platforms.join(" ")}
          `.toLowerCase();

          const matchesSearch =
            searchText.includes(
              normalizedQuery
            );

          const currentStatus =
            String(
              item.status ||
                "Upcoming"
            ).toLowerCase();

          const matchesStatus =
            statusFilter ===
              "All" ||
            currentStatus ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      schedules,
      query,
      statusFilter,
      connectedPlatformSet,
      isPro,
    ]);

  const deleteSchedule =
    async (
      id,
      scheduleStatus
    ) => {
      try {
        if (!id) {
          return;
        }

        const normalizedStatus =
          String(
            scheduleStatus || ""
          ).toLowerCase();

        if (
          normalizedStatus ===
            "live" ||
          normalizedStatus ===
            "starting"
        ) {
          alert(
            "Stop the live session before deleting this schedule."
          );

          return;
        }

        const confirmDelete =
          window.confirm(
            "Are you sure you want to delete this schedule?"
          );

        if (!confirmDelete) {
          return;
        }

        const res = await fetch(
          `${API}/schedules/${id}`,
          {
            method: "DELETE",
            credentials:
              "include",
          }
        );

        const data = await res
          .json()
          .catch(() => ({}));

        if (
          !res.ok ||
          data.success === false
        ) {
          throw new Error(
            data.message ||
              "Unable to delete schedule"
          );
        }

        setSchedules(
          (previous) =>
            previous.filter(
              (item) =>
                (item._id ||
                  item.id) !== id
            )
        );

        setDeleted(true);

        window.setTimeout(
          () => {
            setDeleted(false);
          },
          2000
        );
      } catch (err) {
        alert(
          err.message ||
            "Unable to delete schedule"
        );
      }
    };

  const startLive = (
    schedule
  ) => {
    const status = String(
      schedule.status ||
        "Upcoming"
    ).toLowerCase();

    const allowedPlatforms =
      getConnectedSchedulePlatforms(
        schedule
      );

    if (status === "live") {
      navigate(
        "/app/golive/live",
        {
          state: {
            schedule,

            product:
              schedule.product ||
              schedule.productName,

            platforms:
              allowedPlatforms,
          },
        }
      );

      return;
    }

    if (
      status === "completed" ||
      status === "cancelled" ||
      status === "failed"
    ) {
      alert(
        `This schedule is ${status} and cannot be started.`
      );

      return;
    }

    if (
      !allowedPlatforms.length
    ) {
      alert(
        "No connected platform found for this schedule. Please connect the platform first."
      );

      navigate("/app/connect");

      return;
    }

    navigate("/app/golive", {
      state: {
        schedule,

        product:
          schedule.product ||
          schedule.productName,

        platforms:
          allowedPlatforms,
      },
    });
  };

  const totalPlatforms =
    useMemo(() => {
      const allPlatforms =
        schedules.flatMap(
          (item) =>
            getConnectedSchedulePlatforms(
              item
            )
        );

      return new Set(
        allPlatforms.map(
          (platform) =>
            normalizePlatform(
              platform
            )
        )
      ).size;
    }, [
      schedules,
      connectedPlatformSet,
      isPro,
    ]);

  const upcomingCount =
    schedules.filter(
      (item) =>
        String(
          item.status ||
            "Upcoming"
        ).toLowerCase() ===
        "upcoming"
    ).length;

  const activeScheduleCount =
    schedules.filter((item) =>
      [
        "upcoming",
        "starting",
        "live",
      ].includes(
        String(
          item.status ||
            "Upcoming"
        ).toLowerCase()
      )
    ).length;

  const canCreateSchedule =
    activeScheduleCount <
    maxSchedules;

  const nextUpcomingSchedule =
    useMemo(
      () =>
        getNextUpcomingSchedule(
          schedules
        ),
      [schedules]
    );

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

                {isPro
                  ? "PRO LIVE SCHEDULE"
                  : "LIVE SCHEDULE"}
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

                {isPro
                  ? `${plan.toUpperCase()} PLAN ACTIVE`
                  : "FREE PLAN"}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              <span className="brand-text">
                {isPro
                  ? "Schedule Pro"
                  : "Schedule"}
              </span>{" "}
              Live
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              {isPro
                ? "Plan multiple AI Twin live sessions with multi-platform scheduling. Instagram is started first when selected."
                : "Free plan supports 1 active scheduled live and 1 connected platform. Upgrade for multiple schedules and platforms."}
            </p>

            {!connectedPlatforms.length &&
              !socialLoading && (
                <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-orange-600 dark:text-orange-400">
                        No social platform connected
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Connect Instagram, Facebook, YouTube or TikTok before scheduling a live session.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/app/connect"
                        )
                      }
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
                      Schedule Limit:{" "}
                      {activeScheduleCount}/
                      {maxSchedules}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Upgrade to Pro for up to 50 active scheduled lives and multiple connected platforms.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      upgradeToPro
                    }
                    className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={
                refreshSchedules
              }
              disabled={refreshing}
              className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/10"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

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
                type="button"
                onClick={
                  upgradeToPro
                }
                className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
              >
                <Lock size={18} />
                Add More - Pro
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Active Scheduled"
          value={
            loadingSchedules
              ? "..."
              : `${activeScheduleCount}/${maxSchedules}`
          }
        />

        <StatCard
          icon={Radio}
          label="Upcoming"
          value={
            loadingSchedules
              ? "..."
              : upcomingCount
          }
        />

        <StatCard
          icon={Instagram}
          label="Connected Platforms"
          value={`${Math.min(
            totalPlatforms,
            maxPlatforms
          )}/${maxPlatforms}`}
        />

        <StatCard
          icon={Clock}
          label="Next Live"
          value={
            nextUpcomingSchedule
              ? formatScheduleTime(
                  getScheduleDateTime(
                    nextUpcomingSchedule
                  )
                )
              : "--"
          }
        />
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search schedule by product, title or platform..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Filter className="h-5 w-5 text-[var(--brand-pink)]" />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="bg-transparent text-sm font-bold text-foreground outline-none"
            >
              <option>All</option>
              <option>Upcoming</option>
              <option>Starting</option>
              <option>Live</option>
              <option>Completed</option>
              <option>Cancelled</option>
              <option>Failed</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-xl font-black tracking-tight brand-text">
            {isPro
              ? "Pro Live Sessions"
              : "Live Sessions"}
          </h2>

          <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
            View, start, manage or delete your scheduled live selling sessions.
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {loadingSchedules ? (
            <div className="rounded-2xl border border-border bg-background p-8 text-center text-sm font-bold text-muted-foreground">
              Loading schedules...
            </div>
          ) : filteredSchedules.length ===
            0 ? (
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
                  type="button"
                  onClick={
                    upgradeToPro
                  }
                  className="brand-gradient mt-5 inline-flex rounded-[5px] px-5 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Upgrade to Create More
                </button>
              )}
            </div>
          ) : (
            filteredSchedules.map(
              (schedule) => {
                const scheduleId =
                  schedule._id ||
                  schedule.id;

                const schedulePlatforms =
                  getSchedulePlatforms(
                    schedule
                  );

                const connectedVisiblePlatforms =
                  getConnectedSchedulePlatforms(
                    schedule
                  );

                const disconnectedPlatforms =
                  schedulePlatforms.filter(
                    (platform) =>
                      !connectedPlatformSet.has(
                        normalizePlatform(
                          platform
                        )
                      )
                  );

                const scheduleStatus =
                  String(
                    schedule.status ||
                      "Upcoming"
                  ).toLowerCase();

                const canStartLive =
                  connectedVisiblePlatforms.length >
                    0 &&
                  ![
                    "completed",
                    "cancelled",
                    "failed",
                  ].includes(
                    scheduleStatus
                  );

                const isStarting =
                  scheduleStatus ===
                  "starting";

                const isLive =
                  scheduleStatus ===
                  "live";

                const liveButtonLabel =
                  isLive
                    ? "View Live"
                    : isStarting
                    ? "Starting..."
                    : canStartLive
                    ? "Start Live"
                    : "Connect First";

                const canDelete =
                  ![
                    "live",
                    "starting",
                  ].includes(
                    scheduleStatus
                  );

                return (
                  <div
                    key={scheduleId}
                    className="rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black tracking-tight text-foreground">
                          {schedule.title ||
                            "Untitled Live"}
                        </h3>

                        <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                          {schedule.product ||
                            schedule.productName ||
                            "No product selected"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <Info
                            icon={
                              Calendar
                            }
                            text={formatScheduleDate(
                              getScheduleDateTime(
                                schedule
                              )
                            )}
                          />

                          <Info
                            icon={Clock}
                            text={formatScheduleTime(
                              getScheduleDateTime(
                                schedule
                              )
                            )}
                          />

                          <Info
                            icon={Radio}
                            text={
                              connectedVisiblePlatforms.length
                                ? connectedVisiblePlatforms.join(
                                    ", "
                                  )
                                : "No connected platform"
                            }
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <ScheduleStatusBadge
                          status={
                            schedule.status ||
                            "Upcoming"
                          }
                        />

                        {isPro && (
                          <span className="rounded-full bg-pink-500 px-4 py-2 text-xs font-black tracking-wide text-white">
                            PRO
                          </span>
                        )}

                        <button
                          type="button"
                          disabled={
                            !canStartLive ||
                            isStarting
                          }
                          onClick={() =>
                            startLive(
                              schedule
                            )
                          }
                          className="brand-gradient flex h-10 items-center gap-2 rounded-[5px] px-4 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLive ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}

                          {
                            liveButtonLabel
                          }
                        </button>

                        <button
                          type="button"
                          disabled={
                            !canDelete
                          }
                          onClick={() =>
                            deleteSchedule(
                              scheduleId,
                              schedule.status
                            )
                          }
                          className="grid h-10 w-10 place-items-center rounded-[5px] border border-border text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-500/10"
                          title={
                            canDelete
                              ? "Delete schedule"
                              : "Stop live before deleting"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {connectedVisiblePlatforms.map(
                        (platform) => (
                          <PlatformBadge
                            key={
                              platform
                            }
                            platform={
                              platform
                            }
                            connected
                          />
                        )
                      )}

                      {disconnectedPlatforms.map(
                        (platform) => (
                          <PlatformBadge
                            key={
                              platform
                            }
                            platform={
                              platform
                            }
                            connected={
                              false
                            }
                          />
                        )
                      )}
                    </div>

                    {Array.isArray(
                      schedule.platformResults
                    ) &&
                      schedule
                        .platformResults
                        .length > 0 && (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {schedule.platformResults.map(
                            (
                              result,
                              index
                            ) => (
                              <PlatformResultCard
                                key={`${result.platform}-${index}`}
                                result={
                                  result
                                }
                              />
                            )
                          )}
                        </div>
                      )}

                    {schedule.lastError && (
                      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400">
                        {
                          schedule.lastError
                        }
                      </div>
                    )}
                  </div>
                );
              }
            )
          )}
        </div>
      </section>

      {deleted && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold tracking-wide text-foreground shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Schedule deleted successfully
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="truncate text-2xl font-black tracking-tight brand-text">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  text,
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold tracking-wide text-foreground">
      <Icon className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
      {text}
    </span>
  );
}

function PlatformBadge({
  platform,
  connected = true,
}) {
  const icons = {
    Instagram,
    YouTube: Youtube,
    Facebook,
    TikTok: Music2,
  };

  const label =
    platformLabel(platform);

  const Icon =
    icons[label] || Radio;

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

      {!connected && (
        <span className="text-xs">
          Not connected
        </span>
      )}
    </span>
  );
}

function ScheduleStatusBadge({
  status,
}) {
  const normalized =
    String(status || "Upcoming")
      .toLowerCase();

  const styles = {
    upcoming:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    starting:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",

    live:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",

    completed:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",

    cancelled:
      "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",

    failed:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  };

  const label =
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1);

  return (
    <span
      className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
        styles[normalized] ||
        styles.upcoming
      }`}
    >
      {label}
    </span>
  );
}

function PlatformResultCard({
  result,
}) {
  const status =
    String(
      result?.status || "pending"
    ).toLowerCase();

  const statusStyles = {
    pending:
      "text-muted-foreground",

    starting:
      "text-orange-500",

    live:
      "text-red-500",

    completed:
      "text-emerald-500",

    failed:
      "text-red-500",

    skipped:
      "text-gray-500",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs font-black capitalize text-foreground">
        {platformLabel(
          result?.platform ||
            "Platform"
        )}
      </p>

      <p
        className={`mt-1 text-xs font-bold capitalize ${
          statusStyles[status] ||
          statusStyles.pending
        }`}
      >
        {status}
      </p>

      {result?.startedAt && (
        <p className="mt-1 text-xs text-muted-foreground">
          Started:{" "}
          {formatScheduleTime(
            result.startedAt
          )}
        </p>
      )}

      {result?.error && (
        <p className="mt-2 line-clamp-2 text-xs text-red-500">
          {result.error}
        </p>
      )}
    </div>
  );
}

function formatScheduleDate(
  value
) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Invalid date";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatScheduleTime(
  value
) {
  if (!value) {
    return "No time";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Invalid time";
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}