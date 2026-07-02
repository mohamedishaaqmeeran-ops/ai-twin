import { useEffect } from "react";
import {
  Youtube,
  Facebook,
  Instagram,
  Music2,
  CheckCircle2,
  Radio,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Crown,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchConnections,
  disconnectSocial,
  addLocalConnection,
} from "../features/social/socialSlice";

import { connectAPI } from "../features/social/socialAPI";

const socialData = [
  {
    id: "instagram",
    name: "Instagram",
    color: "bg-pink-50 dark:bg-white/10",
    icon: Instagram,
    defaultUsername: "@instagram",
    pro: false,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "bg-blue-50 dark:bg-white/10",
    icon: Facebook,
    defaultUsername: "Facebook Account",
    pro: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "bg-red-50 dark:bg-white/10",
    icon: Youtube,
    defaultUsername: "YouTube Channel",
    pro: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "bg-gray-100 dark:bg-white/10",
    icon: Music2,
    defaultUsername: "@tiktok",
    pro: true,
  },
];

export default function ConnectSocial() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { connections, loading } = useSelector((state) => state.social);

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";
  const maxPlatforms = isPro ? 4 : 1;

  const connected = connections.map((item) => item.platform);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const platform = params.get("platform");
  const message = params.get("message");

  if (status === "connected" && platform) {
    alert(`${platform} connected successfully`);
    window.history.replaceState({}, "", "/app/connect");
  }

  if (status === "failed") {
    alert(message || "Social connection failed");
    window.history.replaceState({}, "", "/app/connect");
  }
}, []);

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const toggleConnection = async (platform) => {
    const item = socialData.find((x) => x.id === platform);
    const alreadyConnected = connected.includes(platform);

    if (item?.pro && !isPro && !alreadyConnected) {
      upgradeToPro();
      return;
    }

    if (alreadyConnected) {
      dispatch(disconnectSocial(platform));
      return;
    }

    if (!isPro && connected.length >= maxPlatforms) {
      upgradeToPro();
      return;
    }

    connectAPI(platform);
  };

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
            {isPro ? "PRO SOCIAL CONNECTIONS" : "CONNECT SOCIAL MEDIA"}
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
          <span className="brand-text">{isPro ? "Connect All" : "Connect"}</span>{" "}
          Your Platforms
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          {isPro
            ? "Connect Instagram, Facebook, YouTube and TikTok for multi-platform AI Twin live selling."
            : "Free plan allows only 1 platform. Upgrade to Pro to connect all platforms."}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Connected"
          value={loading ? "..." : `${connected.length}/${maxPlatforms}`}
          icon={CheckCircle2}
        />
        <Stat title="Available" value={isPro ? "4" : "1"} icon={ShieldCheck} />
        <Stat
          title="Ready Live"
          value={connected.length > 0 ? "Yes" : "No"}
          icon={Radio}
        />
        <Stat
          title="AI Status"
          value={isPro ? "Pro Online" : "Online"}
          icon={Sparkles}
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {socialData.map(
          ({ id, name, icon: Icon, color, defaultUsername, pro }) => {
            const active = connected.includes(id);
            const locked = pro && !isPro;

            const account = connections.find((item) => item.platform === id);

            const accountName =
              account?.username || account?.name
                ? account.username
                  ? `@${account.username}`
                  : account.name
                : active
                ? "Connected Account"
                : defaultUsername;

            return (
              <div
                key={id}
                className={`relative rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
                  locked
                    ? "border-pink-200 dark:border-white/10"
                    : "border-border"
                }`}
              >
                {locked && (
                  <span className="absolute right-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                    PRO
                  </span>
                )}

                <div className={locked ? "opacity-70" : ""}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}
                      >
                        {locked ? (
                          <Lock className="h-7 w-7 text-[var(--brand-pink)]" />
                        ) : (
                          <Icon className="h-7 w-7 text-[var(--brand-pink)]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-lg font-black tracking-tight text-foreground">
                          {name}
                        </h2>

                        <p className="truncate text-sm font-medium text-muted-foreground">
                          {locked ? "Unlock with Pro" : accountName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
                        active
                          ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : locked
                          ? "bg-pink-100 text-[var(--brand-pink)] dark:bg-white/10"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                      }`}
                    >
                      {active
                        ? "Connected"
                        : locked
                        ? "Pro Only"
                        : "Not Connected"}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toggleConnection(id)}
                      disabled={loading}
                      className={`rounded-[5px] py-3 text-sm font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        active
                          ? "border border-red-500 text-red-500 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
                          : "brand-gradient text-white shadow-md hover:opacity-90"
                      }`}
                    >
                      {loading
                        ? "Please wait..."
                        : active
                        ? "Disconnect"
                        : locked
                        ? "Upgrade"
                        : "Connect"}
                    </button>

                    <button
                      onClick={() => {
                        if (locked) upgradeToPro();
                      }}
                      className="rounded-[5px] border border-border bg-background py-3 text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-accent"
                    >
                      {locked ? "Pro Account" : "View Account"}
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight brand-text">
              {isPro ? "Ready for Multi-Platform Live?" : "Ready to Go Live?"}
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              {isPro
                ? "Start your AI Twin live on selected connected platforms."
                : "Connect at least one platform before starting your AI Twin live."}
            </p>
          </div>

          <button
            disabled={connected.length === 0}
            onClick={() => navigate("/app/golive")}
            className="brand-gradient flex items-center justify-center gap-2 rounded-[5px] px-8 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPro ? "Start Pro Live" : "Start Live"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function Stat({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-2xl font-black tracking-tight brand-text">
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}