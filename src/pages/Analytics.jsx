
import {
  Bell,
  Eye,
  ShoppingBag,
  IndianRupee,
  Heart,
  Package,
  CalendarDays,
} from "lucide-react";
import Logo from "../components/Logo";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function Analytics() {
  const stats = [
    {
      label: "Total Viewers",
      value: "125.4K",
      change: "+24%",
      icon: Eye,
    },
    {
      label: "Total Sales",
      value: "3,842",
      change: "+18%",
      icon: ShoppingBag,
    },
    {
      label: "Revenue",
      value: "₹12.4L",
      change: "+31%",
      icon: IndianRupee,
    },
    {
      label: "Avg Engagement",
      value: "14.8%",
      change: "+9%",
      icon: Heart,
    },
    {
      label: "Products",
      value: "126",
      change: "+12",
      icon: Package,
    },
    {
      label: "Scheduled Lives",
      value: "18",
      change: "+5",
      icon: CalendarDays,
    },
  ];

  const viewerData = [
    { day: "Mon", viewers: 1200 },
    { day: "Tue", viewers: 1800 },
    { day: "Wed", viewers: 2400 },
    { day: "Thu", viewers: 3200 },
    { day: "Fri", viewers: 2900 },
    { day: "Sat", viewers: 4100 },
    { day: "Sun", viewers: 5200 },
  ];

  const salesData = [
    { day: "Mon", sales: 45 },
    { day: "Tue", sales: 72 },
    { day: "Wed", sales: 58 },
    { day: "Thu", sales: 95 },
    { day: "Fri", sales: 84 },
    { day: "Sat", sales: 120 },
    { day: "Sun", sales: 105 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      {/* Header */}
      <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-5xl">
        Analytics
      </h1>

      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Track your AI twin performance, engagement, sales, and revenue in real
        time.
      </p>

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
                  <Icon className="h-6 w-6" />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  {item.change}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {item.label}
              </p>

              <p className="mt-1 text-3xl font-black">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Viewers Graph */}
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-black">
          Viewers Trend (Last 7 Days)
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={viewerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="viewers"
                stroke="#ec4899"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Graph */}
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-black">
          Sales Trend (Last 7 Days)
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="sales"
                fill="#ec4899"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-black">Performance Summary</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">
              Best Day
            </p>

            <p className="mt-1 text-xl font-black">
              Saturday
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">
              Top Product
            </p>

            <p className="mt-1 text-xl font-black">
              AI Beauty Kit
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">
              Conversion Rate
            </p>

            <p className="mt-1 text-xl font-black">
              8.4%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

