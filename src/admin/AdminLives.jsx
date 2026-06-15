// src/admin/AdminLives.jsx

import {
  Radio,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Users,
  IndianRupee,
  Calendar,
  Clock,
  Eye,
  Square,
  Search,
  Filter,
} from "lucide-react";

const stats = [
  { title: "Total Lives", value: "2,842", icon: Radio },
  { title: "Live Now", value: "148", icon: Eye },
  { title: "Today's Viewers", value: "184K", icon: Users },
  { title: "Today's Revenue", value: "₹24.8L", icon: IndianRupee },
];

const lives = [
  {
    twin: "Beauty AI",
    owner: "Ishaaq Meeran",
    product: "Vitamin C Serum",
    platform: "Instagram",
    date: "15 Jun 2026",
    time: "10:30 AM",
    viewers: "4.8K",
    revenue: "₹54,000",
    status: "Live",
  },
  {
    twin: "Tech Reviewer",
    owner: "Rahul",
    product: "Wireless Headphone",
    platform: "YouTube",
    date: "15 Jun 2026",
    time: "02:00 PM",
    viewers: "2.1K",
    revenue: "₹18,200",
    status: "Scheduled",
  },
  {
    twin: "Fashion Host",
    owner: "Ananya",
    product: "Luxury Bag",
    platform: "Facebook",
    date: "14 Jun 2026",
    time: "08:00 PM",
    viewers: "7.3K",
    revenue: "₹92,000",
    status: "Completed",
  },
];

const platforms = [
  { icon: Instagram, name: "Instagram", value: "42%" },
  { icon: Youtube, name: "YouTube", value: "28%" },
  { icon: Facebook, name: "Facebook", value: "18%" },
  { icon: Music2, name: "TikTok", value: "12%" },
];

export default function AdminLives() {
  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Radio className="h-4 w-4 text-[var(--brand-pink)]" />
          ADMIN LIVE SESSIONS
        </span>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Live <span className="brand-text">Sessions</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Monitor Instagram, Facebook, YouTube and TikTok live sessions with
          viewers, revenue, products, date and time.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <StatCard key={title} title={title} value={value} icon={Icon} />
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 lg:max-w-md">
            <Search className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
            <input
              placeholder="Search twin, owner, product..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-5 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)]">
            <Filter className="h-4 w-4 text-[var(--brand-pink)]" />
            Filter Status
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4 sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text sm:text-2xl">
              All Live Sessions
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-background">
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="p-5 font-bold">AI Twin</th>
                  <th className="p-5 font-bold">Owner</th>
                  <th className="p-5 font-bold">Product</th>
                  <th className="p-5 font-bold">Platform</th>
                  <th className="p-5 font-bold">Date</th>
                  <th className="p-5 font-bold">Time</th>
                  <th className="p-5 font-bold">Viewers</th>
                  <th className="p-5 font-bold">Revenue</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5 font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {lives.map((live) => (
                  <tr
                    key={live.twin}
                    className="border-b border-border transition hover:bg-background"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                          <Radio className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-sm font-black text-foreground">
                            {live.twin}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            AI Seller
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-sm font-bold">{live.owner}</td>
                    <td className="p-5 text-sm font-medium">{live.product}</td>
                    <td className="p-5 text-sm font-bold">{live.platform}</td>
                    <td className="p-5 text-sm text-muted-foreground">
                      {live.date}
                    </td>
                    <td className="p-5 text-sm font-bold">{live.time}</td>
                    <td className="p-5 text-sm font-bold">{live.viewers}</td>
                    <td className="p-5 text-sm font-black brand-text">
                      {live.revenue}
                    </td>
                    <td className="p-5">
                      <StatusBadge status={live.status} />
                    </td>
                    <td className="p-5">
                      <button className="rounded-xl bg-red-50 p-3 text-red-600 hover:bg-red-100 dark:bg-red-500/10">
                        <Square className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 p-4 lg:hidden">
            {lives.map((live) => (
              <LiveCard key={live.twin} live={live} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Platform Distribution
            </h2>

            <div className="mt-5 space-y-4">
              {platforms.map(({ icon: Icon, name, value }) => (
                <div
                  key={name}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
                      <span className="text-sm font-bold">{name}</span>
                    </div>

                    <span className="text-sm font-black brand-text">
                      {value}
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-pink-100 dark:bg-white/10">
                    <div
                      className="brand-gradient h-2 rounded-full"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Next Scheduled Live
            </h2>

            <div className="mt-5 rounded-2xl border border-border bg-background p-5">
              <h3 className="text-lg font-black text-foreground">
                Tech Reviewer
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Wireless Headphone Launch
              </p>

              <div className="mt-5 space-y-3">
                <Info icon={Calendar} label="Date" value="15 Jun 2026" />
                <Info icon={Clock} label="Time" value="02:00 PM" />
                <Info icon={Youtube} label="Platform" value="YouTube" />
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-2xl font-black tracking-tight brand-text sm:text-3xl">
            {value}
          </h2>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}

function LiveCard({ live }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-black tracking-tight text-foreground">
            {live.twin}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {live.owner}
          </p>
        </div>

        <StatusBadge status={live.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SmallInfo label="Product" value={live.product} />
        <SmallInfo label="Platform" value={live.platform} />
        <SmallInfo label="Date" value={live.date} />
        <SmallInfo label="Time" value={live.time} />
        <SmallInfo label="Viewers" value={live.viewers} />
        <SmallInfo label="Revenue" value={live.revenue} />
      </div>

      <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[5px] border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10">
        <Square className="h-4 w-4" />
        End / Stop Live
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Live: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    Scheduled:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    Completed:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

function SmallInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-foreground">
        {value}
      </p>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>

      <span className="text-right text-sm font-black text-foreground">
        {value}
      </span>
    </div>
  );
}