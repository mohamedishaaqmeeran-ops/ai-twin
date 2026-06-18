// src/pages/pro/ProConnectSocial.jsx

import {
  Crown,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";
import {
  getConnectedPlatforms,
  saveConnectedPlatforms,
  PRO_LIMITS,
} from "./proData";

const platformList = [
  {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    desc: "Connect Instagram Live commerce.",
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    desc: "Sell using Facebook live sessions.",
  },
  {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    desc: "Launch YouTube live product selling.",
  },
  {
    name: "TikTok",
    icon: Music2,
    color: "text-black dark:text-white",
    desc: "Engage TikTok audience with AI Twin.",
  },
];

export default function ProConnectSocial() {
  const connected = getConnectedPlatforms();

  const togglePlatform = (name) => {
    const exists = connected.includes(name);

    if (!exists && connected.length >= PRO_LIMITS.maxPlatforms) {
      alert("Pro plan allows maximum 4 connected platforms.");
      return;
    }

    const updated = exists
      ? connected.filter((item) => item !== name)
      : [...connected, name];

    saveConnectedPlatforms(updated);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          PRO SOCIAL CONNECT
        </span>

        <h1 className="mt-5 text-4xl font-black">
          Connect <span className="brand-text">Social Platforms</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Pro plan allows up to {PRO_LIMITS.maxPlatforms} connected platforms.
          Connected: {connected.length} / {PRO_LIMITS.maxPlatforms}
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {platformList.map(({ name, icon: Icon, color, desc }) => {
          const isConnected = connected.includes(name);

          return (
            <div
              key={name}
              className={`rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isConnected
                  ? "border-[var(--brand-pink)] bg-pink-50 dark:bg-white/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background">
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>

                {isConnected && (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                )}
              </div>

              <h2 className="mt-5 text-xl font-black">{name}</h2>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted-foreground">
                {desc}
              </p>

              <button
                onClick={() => togglePlatform(name)}
                className={`mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold transition ${
                  isConnected
                    ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "brand-gradient text-white"
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                {isConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}