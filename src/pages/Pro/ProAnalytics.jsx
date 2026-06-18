// src/pages/pro/ProAnalytics.jsx

import {
  Crown,
  BarChart3,
  Eye,
  ShoppingCart,
  IndianRupee,
  MessageCircle,
  Radio,
} from "lucide-react";

export default function ProAnalytics() {
  const sessions = JSON.parse(localStorage.getItem("proLiveSessions") || "[]");

  const totalViews = sessions.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalSales = sessions.reduce((sum, item) => sum + (item.sales || 0), 0);
  const revenue = totalSales * 799;

  const stats = [
    {
      label: "Live Views",
      value: totalViews || "24.8K",
      icon: Eye,
    },
    {
      label: "Orders",
      value: totalSales || "186",
      icon: ShoppingCart,
    },
    {
      label: "Revenue",
      value: `₹${revenue || "82,450"}`,
      icon: IndianRupee,
    },
    {
      label: "AI Replies",
      value: "Unlimited",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          PRO ANALYTICS
        </span>

        <h1 className="mt-5 text-4xl font-black">
          Live Sales <span className="brand-text">Analytics</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Track live views, sales, AI replies and performance insights.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <h2 className="mt-2 text-3xl font-black brand-text">
                  {value}
                </h2>
              </div>

              <div className="rounded-2xl bg-pink-50 p-4 text-[var(--brand-pink)] dark:bg-white/10">
                <Icon className="h-7 w-7" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black brand-text">
            Weekly Performance
          </h2>
          <BarChart3 className="h-7 w-7 text-[var(--brand-pink)]" />
        </div>

        <div className="mt-8 flex h-72 items-end gap-4 rounded-3xl bg-background p-6">
          {[35, 60, 45, 80, 70, 100, 88].map((h, index) => (
            <div
              key={index}
              className="brand-gradient w-full rounded-t-2xl"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black brand-text">Recent Live Sessions</h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-4">Platform</th>
                <th className="py-4">Views</th>
                <th className="py-4">Sales</th>
                <th className="py-4">AI Replies</th>
                <th className="py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {(sessions.length ? sessions : demoSessions).map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-5 font-bold">{item.platform}</td>
                  <td>{item.views}</td>
                  <td>{item.sales}</td>
                  <td>{item.replies}</td>
                  <td>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10">
                      <Radio className="h-3 w-3" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const demoSessions = [
  {
    id: "1",
    platform: "Instagram",
    views: "8.4K",
    sales: 48,
    replies: "Unlimited",
  },
  {
    id: "2",
    platform: "YouTube",
    views: "6.8K",
    sales: 36,
    replies: "Unlimited",
  },
  {
    id: "3",
    platform: "Facebook",
    views: "4.1K",
    sales: 22,
    replies: "Unlimited",
  },
];