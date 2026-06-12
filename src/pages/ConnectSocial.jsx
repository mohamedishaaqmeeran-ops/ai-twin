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
    color: "bg-pink-50",
    icon: Instagram,
    username: "@aitwin",
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "bg-blue-50",
    icon: Facebook,
    username: "AI Twin Store",
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "bg-red-50",
    icon: Youtube,
    username: "AITwin Official",
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "bg-gray-100",
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

    localStorage.setItem(
      "connectedPlatforms",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero */}

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          CONNECT SOCIAL MEDIA
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">Connect</span> Your Platforms
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Connect your social media accounts. Your AI Twin will automatically
          stream and sell products on the selected platforms.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Connected"
          value={connected.length}
          icon={CheckCircle2}
        />

        <Stat title="Available" value="4" icon={ShieldCheck} />

        <Stat title="Ready Live" value={connected.length > 0 ? "Yes" : "No"} icon={Radio} />

        <Stat title="AI Status" value="Online" icon={Sparkles} />
      </div>

      {/* Platforms */}

      <div className="grid gap-5 md:grid-cols-2">
        {socialData.map(({ id, name, icon: Icon, color, username }) => {
          const active = connected.includes(id);

          return (
            <div
              key={id}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
                  >
                    <Icon className="h-7 w-7 text-[var(--brand-pink)]" />
                  </div>

                  <div>
                    <h2 className="font-black">{name}</h2>

                    <p className="text-sm text-muted-foreground">
                      {username}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    active
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {active ? "Connected" : "Not Connected"}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleConnection(id)}
                  className={`rounded-[5px] py-3 text-sm font-bold ${
                    active
                      ? "border border-red-500 text-red-500 hover:bg-red-50"
                      : "brand-gradient text-white"
                  }`}
                >
                  {active ? "Disconnect" : "Connect"}
                </button>

                <button className="rounded-[5px] border border-border py-3 text-sm font-bold hover:border-[var(--brand-pink)]">
                  View Account
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom */}

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black brand-text">
              Ready to Go Live?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Connect at least one platform before starting your AI Twin live.
            </p>
          </div>

          <button
            disabled={connected.length === 0}
            onClick={() => navigate("/app/golive")}
            className="brand-gradient flex items-center justify-center gap-2 rounded-[5px] px-8 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Live

            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="text-2xl font-black brand-text">{value}</h2>
        </div>
      </div>
    </div>
  );
}