// src/pages/AITwins.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Bot,
  Eye,
  Filter,
  Radio,
  ScanFace,
  Mic,
  ShoppingBag,
  BadgeCheck,
  Play,
  Heart,
  Wand2,
} from "lucide-react";
import Nav from "../components/Nav";

export default function AITwins() {
  const features = [
    {
      icon: Eye,
      title: "See what's possible first",
      desc: "Explore real AI Twin styles — Beauty Creator, Sales Expert, Fashion Host, Tech Reviewer and more — before deciding how to build yours.",
    },
    {
      icon: Filter,
      title: "Get inspired by your category",
      desc: "Filter by industry — beauty, fashion, electronics and more — to see how AI Twins work in your specific space.",
    },
    {
      icon: BadgeCheck,
      title: "Learn from what's working",
      desc: "See which AI Twins are live now and how they're engaging viewers, as a starting point for your own setup.",
    },
  ];

  const steps = [
    "Browse AI Twins by category or style.",
    "Watch how they engage viewers and present products live.",
    "Use what you like as inspiration for your own AI Twin.",
    "Create your own AI Twin when you're ready.",
  ];

  const twins = [
    {
      name: "Beauty Creator",
      category: "Beauty",
      image: "/images/bb.png",
      voice: "Warm Female",
      status: "Live Now",
    },
    {
      name: "Sales Expert",
      category: "D2C Store",
      image: "/images/dd.png",
      voice: "Professional Male",
      status: "Selling",
    },
    {
      name: "Fashion Host",
      category: "Fashion",
      image: "/images/1.jpeg",
      voice: "Luxury Female",
      status: "Trending",
    },
    {
      name: "Tech Reviewer",
      category: "Electronics",
      image: "/images/2.jpeg",
      voice: "Young Male",
      status: "Live Demo",
    },
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
                AI TWINS
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Meet the AI Twins
                <br />
                <span className="brand-text">already selling live.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Browse AI Twins built by creators, brands and agencies on Twin
                — see different avatar styles, voices and live formats before
                you build your own.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#browse-ai-twins"
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Browse AI Twins
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 p-5 dark:bg-white/10">
                <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black tracking-tight brand-text">
                        AI Twin Gallery
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Browse styles, voices and live formats
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Bot className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {twins.map((twin) => (
                      <div
                        key={twin.name}
                        className="overflow-hidden rounded-2xl border border-border bg-card p-3"
                      >
                        <div className="relative overflow-hidden rounded-xl bg-pink-50 dark:bg-white/10">
                          <img
                            src={twin.image}
                            alt={twin.name}
                            className="h-36 w-full object-cover"
                          />

                          <span className="absolute left-2 top-2 rounded-[5px] bg-red-600 px-2 py-1 text-[10px] font-black tracking-wide text-white">
                            LIVE
                          </span>
                        </div>

                        <p className="mt-3 text-xs font-black tracking-tight text-foreground">
                          {twin.name}
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                          {twin.category}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/app/twin/create"
                    className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
                  >
                    Build Your Own Twin
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
              Why Browse <span className="brand-text">AI Twins</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Get inspiration from live-selling AI Twins before creating your
              own avatar, voice and product flow.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
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

        <section
          id="browse-ai-twins"
          className="bg-pink-50/50 py-16 dark:bg-white/5"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                    Browse By{" "}
                    <span className="brand-text">Style & Category</span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                    See how different AI Twins sell products, answer viewers and
                    present offers live.
                  </p>
                </div>

                <Link
                  to="/app/twin/create"
                  className="inline-flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Create Your Twin
                </Link>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {twins.map((twin) => (
                  <div
                    key={twin.name}
                    className="group rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-pink-50 dark:bg-white/10">
                      <img
                        src={twin.image}
                        alt={twin.name}
                        className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 rounded-[5px] bg-red-600 px-3 py-1 text-xs font-black tracking-wide text-white">
                        {twin.status}
                      </span>

                      <button className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--brand-pink)] shadow-lg">
                        <Play className="h-6 w-6 fill-current" />
                      </button>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-lg font-black tracking-tight text-foreground">
                        {twin.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {twin.category}
                      </p>

                      <div className="mt-4 space-y-3">
                        <Info icon={Mic} label="Voice" value={twin.voice} />
                        <Info
                          icon={Radio}
                          label="Format"
                          value="Live selling"
                        />
                        <Info
                          icon={Heart}
                          label="Engagement"
                          value="High"
                        />
                      </div>
                    </div>
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
            <Wand2 className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to build your own AI Twin?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
              to="/app/twin/create"
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

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2">
      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>

      <span className="text-xs font-black tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}