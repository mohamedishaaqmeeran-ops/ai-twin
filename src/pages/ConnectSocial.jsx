import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const socialData = [
  {
    id: "instagram",
    name: "Instagram",
    color: "bg-pink-50 dark:bg-white/10",
    icon: Instagram,
    username: "@aitwin",
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "bg-blue-50 dark:bg-white/10",
    icon: Facebook,
    username: "AI Twin Store",
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "bg-red-50 dark:bg-white/10",
    icon: Youtube,
    username: "AITwin Official",
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "bg-gray-100 dark:bg-white/10",
    icon: Music2,
    username: "@aitwinlive",
  },
];

export default function ConnectSocial() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("connectedPlatforms") || "[]"
    );

    setConnected(saved);
  }, []);

  const toggleConnection = (platform) => {
    let updated = [];

    if (connected.includes(platform)) {
      updated = connected.filter((item) => item !== platform);
    } else {
      updated = [...connected, platform];
    }

    setConnected(updated);
    localStorage.setItem("connectedPlatforms", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Hero */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          CONNECT SOCIAL MEDIA
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">Connect</span> Your Platforms
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Connect your social media accounts. Your AI Twin will automatically
          stream and sell products on the selected platforms.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Connected" value={connected.length} icon={CheckCircle2} />
        <Stat title="Available" value="4" icon={ShieldCheck} />
        <Stat
          title="Ready Live"
          value={connected.length > 0 ? "Yes" : "No"}
          icon={Radio}
        />
        <Stat title="AI Status" value="Online" icon={Sparkles} />
      </section>

      {/* Platforms */}
      <section className="grid gap-5 md:grid-cols-2">
        {socialData.map(({ id, name, icon: Icon, color, username }) => {
          const active = connected.includes(id);

          return (
            <div
              key={id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}
                  >
                    <Icon className="h-7 w-7 text-[var(--brand-pink)]" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-black tracking-tight text-foreground">
                      {name}
                    </h2>

                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {username}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
                    active
                      ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                  }`}
                >
                  {active ? "Connected" : "Not Connected"}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleConnection(id)}
                  className={`rounded-[5px] py-3 text-sm font-bold tracking-wide transition ${
                    active
                      ? "border border-red-500 text-red-500 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
                      : "brand-gradient text-white shadow-md hover:opacity-90"
                  }`}
                >
                  {active ? "Disconnect" : "Connect"}
                </button>

                <button className="rounded-[5px] border border-border bg-background py-3 text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-accent">
                  View Account
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight brand-text">
              Ready to Go Live?
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Connect at least one platform before starting your AI Twin live.
            </p>
          </div>

          <button
            disabled={connected.length === 0}
            onClick={() => navigate("/app/golive")}
            className="brand-gradient flex items-center justify-center gap-2 rounded-[5px] px-8 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Live
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