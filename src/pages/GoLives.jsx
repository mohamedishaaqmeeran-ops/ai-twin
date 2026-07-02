// src/pages/GoLives.jsx

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Sparkles,
  Radio,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  MessageSquareText,
  ShoppingCart,
  BarChart3,
  Clock,
  CheckCircle2,
  Eye,
  Package,
  Users,
  Zap,
} from "lucide-react";
import Logo from "../components/Logo";
import Nav from "../components/Nav";

export default function GoLives() {
  const features = [
    {
      icon: Radio,
      title: "Stream everywhere at once",
      desc: "Go live across Instagram, Facebook, YouTube and TikTok simultaneously from a single dashboard.",
    },
    {
      icon: MessageSquareText,
      title: "Your AI Twin handles the room",
      desc: "It answers viewer questions, recommends products and guides viewers to buy — all in real time, all on its own.",
    },
    {
      icon: BarChart3,
      title: "Watch it sell, live",
      desc: "See viewer count, live questions and live sales update in real time while your session runs.",
    },
    {
      icon: Clock,
      title: "No scheduling conflicts",
      desc: "Run sessions whenever makes sense for your business — your AI Twin doesn't need sleep, breaks or a call sheet.",
    },
  ];

  const steps = [
    "Select which platforms to go live on.",
    "Choose which products to feature in this session.",
    "Launch — your AI Twin starts engaging viewers immediately.",
    "Track performance live, then review full analytics once the session ends.",
  ];

  const platforms = [
    { icon: Instagram, name: "Instagram", desc: "Vertical shopping lives" },
    { icon: Facebook, name: "Facebook", desc: "Community commerce" },
    { icon: Youtube, name: "YouTube", desc: "Long-form live selling" },
    { icon: Music2, name: "TikTok", desc: "Short-form live commerce" },
  ];

  const liveStats = [
    { icon: Eye, label: "Viewers", value: "4.8K" },
    { icon: ShoppingCart, label: "Orders", value: "85" },
    { icon: Users, label: "Platforms", value: "4" },
    { icon: Package, label: "Product", value: "Live" },
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
                GO LIVE
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                One click. Every platform.
                <br />
                <span className="brand-text">Live in minutes.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Launch your AI Twin across Instagram, Facebook, YouTube and
                TikTok at once — no extra equipment, no extra hours, no missed
                sales while you're offline.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/app/golive"
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Launch a Live Session
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 p-5 dark:bg-white/10">
                <div className="overflow-hidden rounded-3xl border border-border bg-[#0d0d12] shadow-sm">
                  <div className="relative min-h-[520px]">
                    <img
                      src="/images/bbb.png"
                      alt="AI Twin Live Session"
                      className="absolute inset-0 h-full w-full object-cover opacity-90"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/40" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-[5px] bg-red-600 px-3 py-1 text-xs font-black tracking-wide text-white">
                        LIVE
                      </span>

                      <span className="rounded-[5px] bg-black/60 px-3 py-1 text-xs font-black tracking-wide text-white backdrop-blur">
                        👁 4.8K
                      </span>
                    </div>

                    <div className="absolute right-4 top-4 flex gap-2">
                      {[Instagram, Facebook, Youtube, Music2].map((Icon, i) => (
                        <span
                          key={i}
                          className="grid h-8 w-8 place-items-center rounded-[5px] bg-white/15 text-white backdrop-blur"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                      ))}
                    </div>

                    <div className="absolute left-4 top-20 max-w-[260px] rounded-2xl bg-white/90 p-4 backdrop-blur dark:bg-card/90">
                      <p className="text-sm font-black tracking-tight brand-text">
                        AI Twin is live
                      </p>

                      <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                        Answering questions, recommending products and guiding
                        viewers to buy.
                      </p>
                    </div>

                    <div className="absolute left-4 top-44 max-w-[260px] space-y-2">
                      {[
                        "What is the price?",
                        "Is delivery available?",
                        "How do I order?",
                      ].map((msg) => (
                        <div
                          key={msg}
                          className="rounded-2xl bg-black/60 px-3 py-2 text-xs font-medium leading-5 text-white backdrop-blur"
                        >
                          <span className="font-bold text-pink-300">
                            Viewer:
                          </span>{" "}
                          {msg}
                        </div>
                      ))}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-lg dark:bg-card">
                      <div className="flex items-center gap-4">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                          <Package className="h-7 w-7" />
                        </div>

                        <div className="flex-1">
                          <p className="text-base font-black tracking-tight text-foreground">
                            Live Product Offer
                          </p>
                          <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                            Limited live offer available now
                          </p>
                        </div>
                      </div>

                      <button className="brand-gradient mt-4 w-full rounded-[5px] py-2 text-sm font-bold tracking-wide text-white">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

                <Link
                  to="/app/golive"
                  className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
                >
                  Start Live Setup
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Why Go Live With <span className="brand-text">Twin</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Launch live commerce without needing a full production team,
              support team or selling team on standby.
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
                    Launch Across{" "}
                    <span className="brand-text">Every Platform</span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                    Choose where your AI Twin should go live and manage the
                    session from one dashboard.
                  </p>
                </div>

                <Link
                  to="/app/golive"
                  className="inline-flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Open Go Live
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {platforms.map(({ icon: Icon, name, desc }) => (
                  <div
                    key={name}
                    className="rounded-3xl border border-border bg-background p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-5 text-base font-black tracking-tight text-foreground">
                      {name}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                      {desc}
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
              Live Selling <span className="brand-text">Metrics</span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Track the numbers that matter while your AI Twin is live and
              selling.
            </p>

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
              Ready to go live?
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