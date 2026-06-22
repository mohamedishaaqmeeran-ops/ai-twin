// src/pages/Agency.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Users,
  Eye,
  IndianRupee,
  CheckCircle2,
  Building2,
  LayoutDashboard,
  BadgeCheck,
  BarChart3,
  Headphones,
  HeartHandshake,
  Briefcase,
  Radio,
} from "lucide-react";
import Logo from "../components/Logo";
import Nav from "../components/Nav";

export default function Agency() {
  const stats = [
    { value: "10K+", label: "Creators & Brands using Twin", icon: Users },
    { value: "25M+", label: "Viewers engaged", icon: Eye },
    {
      value: "₹500Cr+",
      label: "Revenue generated through Twin",
      icon: IndianRupee,
    },
  ];

  const audience = [
    "Digital marketing and social media agencies managing multiple brand accounts.",
    "Live commerce agencies offering AI-led selling as a service to clients.",
    "Agencies looking to add a new, recurring-revenue service line for existing clients.",
  ];

  const features = [
    {
      icon: LayoutDashboard,
      title: "One dashboard, every client",
      desc: "Manage AI Twins for all your client brands from a single login — no switching between separate accounts.",
    },
    {
      icon: BadgeCheck,
      title: "White-label ready",
      desc: "Present Twin-powered live selling under your agency's own brand, with reporting your clients can understand at a glance.",
    },
    {
      icon: BarChart3,
      title: "Built-in client reporting",
      desc: "Pull performance data — viewers, engagement, sales — for each client account to show ROI without manual reporting work.",
    },
    {
      icon: Headphones,
      title: "Dedicated support",
      desc: "Agency accounts get a dedicated account manager and priority support to help onboard and scale client brands faster.",
    },
  ];

  const steps = [
    "Set up your Agency account and add your client brands.",
    "Create and train an AI Twin for each client's products and voice.",
    "Launch live sessions across each client's connected platforms.",
    "Track performance per client and report results from one dashboard.",
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
                FOR AGENCIES
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Run live commerce for every client,
                <br />
                <span className="brand-text">from one dashboard.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Manage AI Twins for multiple brands, track performance across
                all of them, and deliver always-on live selling as a service —
                without multiplying your team's workload.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Talk to Sales
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/pricing"
                  className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-7 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  See Agency Plan
                </Link>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 p-5 dark:bg-white/10">
                <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black tracking-tight brand-text">
                        Agency Dashboard
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Multiple brands managed from one place
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Building2 className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      ["Glow Beauty Co.", "Live now", "₹58,900"],
                      ["Urban Fashion Store", "Scheduled", "₹42,500"],
                      ["Tech Deals India", "Training", "₹31,800"],
                    ].map(([brand, status, revenue]) => (
                      <div
                        key={brand}
                        className="rounded-2xl border border-border bg-card p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-black tracking-tight text-foreground">
                              {brand}
                            </p>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                              AI Twin campaign
                            </p>
                          </div>

                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            {status}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-xl bg-background p-3">
                          <span className="text-xs font-medium text-muted-foreground">
                            Revenue
                          </span>
                          <span className="text-sm font-black brand-text">
                            {revenue}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white">
                    Manage Clients
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card py-10">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-3xl border border-border bg-background p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-3xl font-black tracking-tight brand-text">
                      {value}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                      {label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-bold tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
                WHO THIS IS FOR
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Built for agencies that want to
                <span className="brand-text"> scale client results.</span>
              </h2>

              <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                Add AI-led live selling as a new service line and manage client
                growth from one dashboard.
              </p>
            </div>

            <div className="grid gap-4">
              {audience.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Why Agencies Choose <span className="brand-text">Twin</span>
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Offer AI-powered live commerce to every client without adding
                operational complexity.
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
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
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
            <HeartHandshake className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to scale live commerce across every client?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Talk to our team about Agency pricing and onboarding.
            </p>

            <Link
              to="/contact"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black tracking-wide text-[var(--brand-pink)] transition hover:opacity-90"
            >
              Talk to Sales
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