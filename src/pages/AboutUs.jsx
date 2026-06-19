// src/pages/AboutUs.jsx

import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Users,
  ArrowLeft,
  Eye,
  IndianRupee,
  HeartHandshake,
  ShoppingBag,
  Rocket,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Building2,
} from "lucide-react";
import Logo from "../components/Logo";

export default function AboutUs() {
  const stats = [
    { value: "10K+", label: "Creators & Brands", icon: Users },
    { value: "25M+", label: "Viewers Engaged", icon: Eye },
    { value: "₹500Cr+", label: "Revenue Generated", icon: IndianRupee },
  ];

  const beliefs = [
    {
      icon: HeartHandshake,
      title: "Always-on, never robotic",
      desc: "An AI Twin should sound like you, not like a script. We focus on voice, tone and natural conversation.",
    },
    {
      icon: ShoppingBag,
      title: "Built for sellers, not just streamers",
      desc: "Every feature is built around helping creators and brands sell more, not just go live more.",
    },
    {
      icon: Rocket,
      title: "Simple enough to launch in hours",
      desc: "Creating, training and launching an AI Twin should take minutes, not weeks.",
    },
    {
      icon: ShieldCheck,
      title: "Honest about what AI can and can’t do",
      desc: "AI Twins are powerful, but humans stay in control of pricing, policies and product truth.",
    },
  ];

  const audiences = [
    "Creators and influencers turning followers into customers.",
    "Beauty and fashion brands demoing products live, at scale.",
    "Small shops and D2C businesses that cannot staff a live-selling team.",
    "Agencies managing live commerce for multiple client brands.",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />

          <Link
            to="/"
            className="flex items-center gap-2 rounded-[5px] border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </header>

      <main className="bg-background text-foreground">
        <section className="border-b border-border bg-gradient-to-br from-pink-50/60 via-background to-orange-50/40 px-4 py-16 dark:from-white/5 dark:via-background dark:to-white/5">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
                ABOUT US
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                We're building the future of{" "}
                <span className="brand-text">live commerce</span> — one AI Twin
                at a time.
              </h1>

              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-muted-foreground sm:text-lg">
                Twin started with a simple question: what if your brand could go
                live, answer customers and sell — even when you can't?
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signin"
                  className="brand-gradient flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold text-white shadow-md transition hover:opacity-90"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="mailto:hello@twinn.live"
                  className="flex h-12 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-7 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-3xl font-black tracking-tight brand-text">
                Our Story
              </h2>

              <div className="mt-5 space-y-5 text-sm font-medium leading-8 text-muted-foreground sm:text-base">
                <p>
                  Live commerce works. The problem was never the format — it was
                  the hours. A creator or brand can only go live so many times a
                  week before burning out.
                </p>

                <p>
                  Twin was built to solve that. Instead of replacing the person
                  behind the brand, we built a way to extend them — an AI Twin
                  trained on their voice, products and brand knowledge.
                </p>

                <p>
                  Today, creators, beauty brands, fashion stores, small shops,
                  influencers and agencies use Twin to go live across Instagram,
                  Facebook, YouTube and TikTok.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black tracking-tight brand-text">
                By the Numbers
              </h2>

              <div className="mt-6 space-y-4">
                {stats.map(({ value, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-3xl font-black brand-text">{value}</p>
                      <p className="text-sm font-bold text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-5 text-muted-foreground">
                Note: Confirm actual company figures before publishing.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-black tracking-tight">
              What We <span className="brand-text">Believe</span>
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {beliefs.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-black tracking-tight">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-3xl font-black tracking-tight brand-text">
                Who We Build For
              </h2>

              <div className="mt-6 space-y-4">
                {audiences.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
                    <p className="text-sm font-medium leading-7 text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-3xl font-black tracking-tight brand-text">
                Where We're Based
              </h2>

              <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-[var(--brand-pink)]" />
                  <p className="text-lg font-black">Chennai, India</p>
                </div>

                <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
                  Twin is based in Chennai, India, building for creators and
                  brands selling live — in India and beyond.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-pink-50 p-5 dark:bg-white/10">
                <Building2 className="h-6 w-6 text-[var(--brand-pink)]" />
                <p className="text-sm font-bold leading-6">
                  Company details, founding year and team milestones should be
                  confirmed before publishing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-pink-600 to-orange-500 p-8 text-white shadow-xl sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight">
                  Want your brand to never stop selling?
                </h2>

                <p className="mt-2 text-sm font-medium text-white/90">
                  Create your AI Twin in minutes. Go live in hours.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signin"
                  className="flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black text-[var(--brand-pink)] transition hover:opacity-90"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="mailto:hello@twinn.live"
                  className="flex h-12 items-center justify-center rounded-[5px] border border-white/50 px-7 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Contact Us
                </a>
              </div>
            </div>
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