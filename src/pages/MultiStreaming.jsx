// src/pages/MultiStreaming.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Radio,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Users,
  Settings2,
  MonitorUp,
  BarChart3,
  CheckCircle2,
  Zap,
  Eye,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Nav from "../components/Nav";

export default function MultiStreaming() {
  const features = [
    {
      icon: Users,
      title: "Reach every audience at once",
      desc: "Your followers on Instagram, Facebook, YouTube and TikTok are different people — multistreaming means you don't have to pick just one.",
    },
    {
      icon: Settings2,
      title: "One setup, four destinations",
      desc: "Choose your products and script your session once. Your AI Twin handles the rest, broadcasting identically across every connected platform.",
    },
    {
      icon: MonitorUp,
      title: "No extra equipment",
      desc: "No multi-camera rigs, no separate software per platform — multistreaming is built into how Twin works, not an add-on.",
    },
    {
      icon: BarChart3,
      title: "Track performance per platform",
      desc: "See viewers, engagement and sales broken down by platform, so you know where your audience is actually buying.",
    },
  ];

  const steps = [
    "Connect your social accounts — Instagram, Facebook, YouTube and TikTok.",
    "Choose which platforms to include for this session.",
    "Go live once — your AI Twin streams to all selected platforms simultaneously.",
    "Review combined and per-platform performance after the session.",
  ];

  const platforms = [
    { icon: Instagram, name: "Instagram", stat: "12.4K viewers" },
    { icon: Facebook, name: "Facebook", stat: "8.7K viewers" },
    { icon: Youtube, name: "YouTube", stat: "15.2K viewers" },
    { icon: Music2, name: "TikTok", stat: "21.8K viewers" },
  ];

  const liveStats = [
    { icon: Eye, label: "Total Viewers", value: "58.1K" },
    { icon: Heart, label: "Engagement", value: "18.6%" },
    { icon: ShoppingCart, label: "Orders", value: "1,245" },
    { icon: Radio, label: "Platforms", value: "4 Live" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_460px] lg:items-center lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
                MULTISTREAMING
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                One AI Twin.
                <br />
                Every platform.
                <br />
                <span className="brand-text">Live at the same time.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Stop choosing which platform to go live on. Your AI Twin streams
                to Instagram, Facebook, YouTube and TikTok simultaneously — so
                you reach every audience without splitting your time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/app/golive"
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Go Live Everywhere
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 p-5 dark:bg-white/10">
                <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black tracking-tight brand-text">
                        Multistream Control
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        One setup. Four live destinations.
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Radio className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-border bg-[#0d0d12] p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-[5px] bg-red-600 px-3 py-1 text-xs font-black tracking-wide text-white">
                        LIVE
                      </span>

                      <span className="rounded-[5px] bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-white">
                        4 platforms active
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {platforms.map(({ icon: Icon, name, stat }) => (
                        <div
                          key={name}
                          className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur"
                        >
                          <Icon className="h-6 w-6 text-pink-300" />

                          <p className="mt-3 text-sm font-black tracking-tight">
                            {name}
                          </p>

                          <p className="mt-1 text-xs font-medium text-white/65">
                            {stat}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl bg-white p-4 dark:bg-card">
                      <p className="text-sm font-black tracking-tight text-foreground">
                        Combined Live Reach
                      </p>

                      <p className="mt-2 text-3xl font-black tracking-tight brand-text">
                        58.1K
                      </p>

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Viewers across all connected platforms
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/app/golive"
                    className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
                  >
                    Start Multistream
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Why <span className="brand-text">Multistreaming</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Reach more viewers, sell from more channels and manage every live
              session from one simple dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
                  {title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                    Platform Performance{" "}
                    <span className="brand-text">In One View</span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                    See combined results and platform-specific performance
                    after every live session.
                  </p>
                </div>

                <Link
                  to="/app/analytics"
                  className="inline-flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  View Analytics
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {liveStats.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-border bg-background p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {label}
                        </p>

                        <p className="mt-2 text-2xl font-black tracking-tight brand-text">
                          {value}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {platforms.map(({ icon: Icon, name, stat }) => (
                  <div
                    key={name}
                    className="rounded-3xl border border-border bg-background p-5"
                  >
                    <Icon className="h-6 w-6 text-[var(--brand-pink)]" />

                    <h3 className="mt-4 text-base font-black tracking-tight text-foreground">
                      {name}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                      {stat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              How It <span className="brand-text">Works</span>
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-border bg-background p-5"
                >
                  <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white">
                    {index + 1}
                  </span>

                  <p className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-[40px] p-8 text-center text-white shadow-xl sm:p-12">
            <Zap className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to stream everywhere at once?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
              to="/app/golive"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black tracking-wide text-[var(--brand-pink)] transition hover:opacity-90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-[#0d0d12]">
        <p className="px-4 py-5 text-center text-sm font-medium tracking-wide text-white/50">
          © {new Date().getFullYear()} Twinn. All rights reserved.
        </p>
      </footer>
    </div>
  );
}