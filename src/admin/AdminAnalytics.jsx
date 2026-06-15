import {
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  Eye,
  Users,
  Radio,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  Bot,
  Search,
  Calendar,
  Download,
  Package,
  Target,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹12,45,600",
    icon: IndianRupee,
    color: "text-emerald-500",
  },
  {
    title: "Orders",
    value: "2,845",
    icon: ShoppingCart,
    color: "text-blue-500",
  },
  {
    title: "Live Views",
    value: "84.5K",
    icon: Eye,
    color: "text-pink-500",
  },
  {
    title: "Users",
    value: "9,540",
    icon: Users,
    color: "text-orange-500",
  },
];

const products = [
  {
    name: "Vitamin C Glow Serum",
    sales: 542,
    revenue: "₹4,32,000",
    conversion: "18%",
  },
  {
    name: "Wireless Headphone",
    sales: 382,
    revenue: "₹3,18,000",
    conversion: "14%",
  },
  {
    name: "Smart Watch",
    sales: 290,
    revenue: "₹2,64,000",
    conversion: "11%",
  },
];

const platforms = [
  {
    icon: Instagram,
    name: "Instagram",
    views: "35K",
    percent: 42,
  },
  {
    icon: Youtube,
    name: "YouTube",
    views: "28K",
    percent: 28,
  },
  {
    icon: Facebook,
    name: "Facebook",
    views: "12K",
    percent: 18,
  },
  {
    icon: Music2,
    name: "TikTok",
    views: "9K",
    percent: 12,
  },
];

const liveSummary = [
  {
    title: "Active Live Sessions",
    value: "24",
    icon: Radio,
  },
  {
    title: "Conversion Rate",
    value: "18.4%",
    icon: TrendingUp,
  },
  {
    title: "Total AI Twins",
    value: "1,248",
    icon: Bot,
  },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <BarChart3 className="h-4 w-4 text-[var(--brand-pink)]" />
          ADMIN ANALYTICS
        </span>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Analytics <span className="brand-text">Dashboard</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Revenue, orders, AI performance, live commerce and conversion
              insights.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-4 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)]">
              <Calendar className="h-4 w-4 text-[var(--brand-pink)]" />
              This Month
            </button>

            <button className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-bold text-white">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex w-full items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 lg:max-w-md">
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
          <input
            placeholder="Search reports, product, platform..."
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                    {item.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 dark:bg-white/10">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Revenue Chart */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-black tracking-tight brand-text sm:text-2xl">
            Revenue Overview
          </h2>

          <TrendingUp className="h-6 w-6 text-[var(--brand-pink)]" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {["Daily", "Weekly", "Monthly", "Yearly"].map((item, index) => (
            <button
              key={item}
              className={`rounded-full px-4 py-2 text-xs font-bold ${
                index === 2
                  ? "brand-gradient text-white"
                  : "border border-border bg-background text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 flex h-44 items-end justify-between rounded-2xl bg-pink-50 p-4 dark:bg-white/10 sm:h-56 lg:h-72 lg:p-6">
          {[20, 40, 55, 38, 62, 80, 55, 90, 75, 100].map((item, index) => (
            <div
              key={index}
              className="brand-gradient w-3 rounded-t-xl sm:w-5 lg:w-8"
              style={{ height: `${item}%` }}
            />
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniStat label="Today" value="₹1.2L" />
          <MiniStat label="This Week" value="₹6.8L" />
          <MiniStat label="This Month" value="₹12.4L" />
        </div>
      </section>

      {/* Middle Grid */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Platform Views */}
        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text sm:text-2xl">
            Platform Views
          </h2>

          <div className="mt-6 space-y-4">
            {platforms.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[var(--brand-pink)]" />

                      <span className="text-sm font-black text-foreground">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-sm font-black brand-text">
                      {item.views}
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-pink-100 dark:bg-white/10">
                    <div
                      className="brand-gradient h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Performance */}
        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black tracking-tight brand-text sm:text-2xl">
              AI Twin Performance
            </h2>

            <Bot className="h-6 w-6 text-[var(--brand-pink)]" />
          </div>

          <div className="mt-6 space-y-5">
            <Progress title="Response Accuracy" value={98} />
            <Progress title="Conversion Rate" value={84} />
            <Progress title="Customer Satisfaction" value={96} />
            <Progress title="Live Engagement" value={88} />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 className="text-xl font-black tracking-tight brand-text sm:text-2xl">
          Top Selling Products
        </h2>

        {/* Desktop Table */}
        <div className="mt-6 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="py-4 font-bold">Product</th>
                <th className="py-4 font-bold">Sales</th>
                <th className="py-4 font-bold">Revenue</th>
                <th className="py-4 font-bold">Conversion</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr key={item.name} className="border-b border-border">
                  <td className="py-5 font-black text-foreground">
                    {item.name}
                  </td>

                  <td className="py-5 font-bold">{item.sales}</td>

                  <td className="py-5 font-black brand-text">
                    {item.revenue}
                  </td>

                  <td className="py-5 font-bold text-emerald-600 dark:text-emerald-400">
                    {item.conversion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mt-5 grid gap-4 md:hidden">
          {products.map((item) => (
            <ProductCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {liveSummary.map(({ title, value, icon: Icon }) => (
          <Summary key={title} title={title} value={value} icon={Icon} />
        ))}
      </section>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        {label}
      </p>
      <p className="mt-2 text-base font-black tracking-tight text-foreground sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function ProductCard({ item }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Package className="h-6 w-6" />
      </div>

      <h3 className="text-base font-black tracking-tight text-foreground">
        {item.name}
      </h3>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <SmallInfo label="Sales" value={item.sales} />
        <SmallInfo label="Revenue" value={item.revenue} />
        <SmallInfo label="Conv." value={item.conversion} />
      </div>
    </div>
  );
}

function SmallInfo({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-foreground">
        {value}
      </p>
    </div>
  );
}

function Progress({ title, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-4">
        <span className="text-sm font-bold text-foreground">{title}</span>

        <span className="text-sm font-black brand-text">{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-pink-100 dark:bg-white/10">
        <div
          className="brand-gradient h-2 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Summary({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {value}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}