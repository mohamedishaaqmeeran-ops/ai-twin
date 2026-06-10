// src/pages/TwinDashboard.jsx

import {
  Bell,
  Sparkles,
  Users,
  ShoppingBag,
  Globe,
  Clock3,
  ArrowUpRight,
  Activity,
  MessageCircle,
  Mic,
  PlayCircle,
} from "lucide-react";
import Logo from "../components/Logo";

export default function TwinDashboard() {
  const stats = [
    {
      Icon: ShoppingBag,
      value: "124",
      label: "Products",
      color: "bg-pink-50 text-[var(--brand-pink)]",
    },
    {
      Icon: Users,
      value: "8.4K",
      label: "Audience",
      color: "bg-orange-50 text-orange-500",
    },
    {
      Icon: Globe,
      value: "12",
      label: "Languages",
      color: "bg-violet-50 text-violet-500",
    },
    {
      Icon: Clock3,
      value: "24/7",
      label: "Availability",
      color: "bg-emerald-50 text-emerald-500",
    },
  ];

  const activities = [
    {
      Icon: MessageCircle,
      title: "Answered 152 customer questions",
      time: "2 mins ago",
    },
    {
      Icon: ShoppingBag,
      title: "Sold 18 products during livestream",
      time: "12 mins ago",
    },
    {
      Icon: Mic,
      title: "Voice interaction completed",
      time: "34 mins ago",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      {/* Hero */}
      <div className="brand-gradient mt-8 overflow-hidden rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold">
              <Sparkles className="h-4 w-4" />
              AI TWIN ACTIVE
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
              Welcome Back,
              <br />
              Ananya AI Twin
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
              Your AI Twin is engaging customers, answering
              questions and selling products around the clock.
            </p>

            <button className="mt-6 flex items-center gap-2 rounded-[5px] bg-white px-6 py-3 font-bold text-[var(--brand-pink)] shadow-lg transition hover:scale-105">
              <PlayCircle className="h-5 w-5" />
              Go Live
            </button>
          </div>

          <img
            src="/images/girl.png"
            alt=""
            className="h-56 rounded-3xl object-cover ring-4 ring-white/20"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ Icon, value, label, color }) => (
          <div
            key={label}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div
              className={`grid h-14 w-14 place-items-center rounded-2xl ${color}`}
            >
              <Icon className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-4xl font-black">
              {value}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics + Activity */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Performance */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Activity className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-black">
                Performance
              </h2>

              <p className="text-sm text-muted-foreground">
                AI Twin growth this week
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Engagement Rate</span>
                <span>92%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-100">
                <div className="brand-gradient h-full w-[92%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Sales Conversion</span>
                <span>81%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-100">
                <div className="brand-gradient h-full w-[81%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Response Accuracy</span>
                <span>97%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-100">
                <div className="brand-gradient h-full w-[97%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Recent Activity
          </h2>

          <div className="mt-8 space-y-6">
            {activities.map(({ Icon, title, time }) => (
              <div key={title} className="flex gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="font-bold leading-6">
                    {title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black">
          Quick Actions
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            "Manage Products",
            "Schedule Live",
            "Train Twin",
            "View Analytics",
          ].map((item) => (
            <button
              key={item}
              className="flex items-center justify-between rounded-2xl border border-border p-5 text-left font-bold transition hover:-translate-y-1 hover:shadow-lg"
            >
              {item}

              <ArrowUpRight className="h-5 w-5 text-[var(--brand-pink)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}