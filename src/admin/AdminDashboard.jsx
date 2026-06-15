import {
  Bell,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Facebook,
  FileText,
  Instagram,
  IndianRupee,
  Mail,
  Music2,
  Package,
  Plus,
  Radio,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Youtube,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "8,952", change: "+18%", icon: Users },
  { label: "AI Twins", value: "1,248", change: "+24%", icon: Bot },
  { label: "Live Sessions", value: "342", change: "+12%", icon: Radio },
  { label: "Revenue", value: "₹12.4L", change: "+35%", icon: IndianRupee },
];

const miniStats = [
  { label: "New Today", value: "185" },
  { label: "Active Now", value: "48" },
  { label: "Orders Today", value: "324" },
  { label: "Conversion", value: "12.8%" },
];

const liveSessions = [
  {
    twin: "Beauty Creator",
    platform: "Instagram",
    start: "15 Jun 2026",
    time: "02:30 PM",
    duration: "01:42:12",
    viewers: "4.8K",
    orders: 245,
    revenue: "₹54,000",
    status: "Live",
  },
  {
    twin: "Tech Reviewer",
    platform: "YouTube",
    start: "15 Jun 2026",
    time: "06:00 PM",
    duration: "00:00:00",
    viewers: "2.4K",
    orders: 132,
    revenue: "₹18,200",
    status: "Scheduled",
  },
  {
    twin: "Fashion Host",
    platform: "TikTok",
    start: "14 Jun 2026",
    time: "08:00 PM",
    duration: "02:10:42",
    viewers: "7.1K",
    orders: 341,
    revenue: "₹92,500",
    status: "Completed",
  },
];

const products = [
  {
    name: "Vitamin C Glow Serum",
    price: "₹799",
    stock: "520",
    orders: 542,
    revenue: "₹4.2L",
    status: "Active",
  },
  {
    name: "Wireless Headphone",
    price: "₹1,299",
    stock: "182",
    orders: 312,
    revenue: "₹2.1L",
    status: "Active",
  },
  {
    name: "Smart Watch",
    price: "₹2,499",
    stock: "50",
    orders: 201,
    revenue: "₹1.8L",
    status: "Low Stock",
  },
];

const platforms = [
  {
    name: "Instagram",
    icon: Instagram,
    value: 45,
    reach: "1.2M",
    revenue: "₹5.2L",
  },
  {
    name: "YouTube",
    icon: Youtube,
    value: 30,
    reach: "840K",
    revenue: "₹3.4L",
  },
  {
    name: "Facebook",
    icon: Facebook,
    value: 15,
    reach: "410K",
    revenue: "₹1.8L",
  },
  {
    name: "TikTok",
    icon: Music2,
    value: 10,
    reach: "290K",
    revenue: "₹1.1L",
  },
];

const topTwins = [
  { name: "Beauty Creator", revenue: "₹2.4L", conversion: "18%", orders: 542 },
  { name: "Fashion Host", revenue: "₹1.8L", conversion: "16%", orders: 421 },
  { name: "Tech Reviewer", revenue: "₹1.4L", conversion: "14%", orders: 298 },
];

const activities = [
  { time: "12:30 PM", text: "New AI Twin created" },
  { time: "12:15 PM", text: "Payment received" },
  { time: "11:58 AM", text: "Instagram live started" },
  { time: "11:22 AM", text: "Product added" },
];

const notifications = [
  "Payment failed for Pro user",
  "Server CPU usage high",
  "AI training completed",
  "Subscription expiring soon",
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          ADMIN DASHBOARD
        </span>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              AI Twin <span className="brand-text">Admin Overview</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Monitor users, AI Twins, live sessions, revenue, products, orders
              and platform health.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 lg:max-w-md">
            <Search className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
            <input
              placeholder="Search users, twins, products..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Main stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            change={change}
            icon={Icon}
          />
        ))}
      </section>

      {/* Mini stats */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {miniStats.map((item) => (
          <MiniStat key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left / Main */}
        <div className="space-y-6 xl:col-span-2">
          <Card title="Revenue Overview" icon={TrendingUp}>
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
              {[45, 70, 50, 85, 65, 95, 78, 90, 72, 100].map((height, i) => (
                <div
                  key={i}
                  className="brand-gradient w-3 rounded-t-xl sm:w-5 lg:w-8"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <MiniStat label="Today" value="₹1.2L" />
              <MiniStat label="This Week" value="₹6.8L" />
              <MiniStat label="This Month" value="₹12.4L" />
            </div>
          </Card>

          <Card title="Live Sessions" icon={Radio}>
            {/* Desktop Table */}
            <div className="mt-5 hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-border text-sm text-muted-foreground">
                    <th className="py-3 font-bold">AI Twin</th>
                    <th className="py-3 font-bold">Platform</th>
                    <th className="py-3 font-bold">Date</th>
                    <th className="py-3 font-bold">Time</th>
                    <th className="py-3 font-bold">Duration</th>
                    <th className="py-3 font-bold">Viewers</th>
                    <th className="py-3 font-bold">Revenue</th>
                    <th className="py-3 font-bold">Orders</th>
                    <th className="py-3 font-bold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {liveSessions.map((item) => (
                    <tr key={item.twin} className="border-b border-border">
                      <td className="py-4 text-sm font-black text-foreground">
                        {item.twin}
                      </td>
                      <td className="py-4 text-sm font-medium">
                        {item.platform}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {item.start}
                      </td>
                      <td className="py-4 text-sm font-bold">{item.time}</td>
                      <td className="py-4 text-sm font-bold">
                        {item.duration}
                      </td>
                      <td className="py-4 text-sm font-bold">
                        {item.viewers}
                      </td>
                      <td className="py-4 text-sm font-black brand-text">
                        {item.revenue}
                      </td>
                      <td className="py-4 text-sm font-bold">{item.orders}</td>
                      <td className="py-4">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mt-5 grid gap-4 lg:hidden">
              {liveSessions.map((item) => (
                <LiveCard key={item.twin} item={item} />
              ))}
            </div>
          </Card>

          <Card title="Top Selling Products" icon={Package}>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right */}
        <aside className="space-y-6">
          <Card title="AI Performance" icon={Bot}>
            <div className="mt-5 space-y-4">
              <Progress label="Questions Answered" value={98} />
              <Progress label="Response Accuracy" value={94} />
              <Progress label="Conversion Rate" value={82} />
              <Progress label="Customer Satisfaction" value={96} />
            </div>
          </Card>

          <Card title="Top AI Twins" icon={Bot}>
            <div className="mt-5 space-y-3">
              {topTwins.map((item, index) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex justify-between gap-4">
                    <p className="font-black text-foreground">
                      {index + 1}. {item.name}
                    </p>
                    <p className="font-black brand-text">{item.revenue}</p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SmallBox label="Conversion" value={item.conversion} />
                    <SmallBox label="Orders" value={item.orders} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Platform Performance" icon={Eye}>
            <div className="mt-5 space-y-4">
              {platforms.map(({ name, icon: Icon, value, reach, revenue }) => (
                <div
                  key={name}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
                      <p className="text-sm font-black">{name}</p>
                    </div>
                    <p className="text-sm font-black brand-text">{value}%</p>
                  </div>

                  <div className="h-2 rounded-full bg-pink-100 dark:bg-white/10">
                    <div
                      className="brand-gradient h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SmallBox label="Reach" value={reach} />
                    <SmallBox label="Revenue" value={revenue} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="System Health" icon={ShieldCheck}>
            <div className="mt-5 space-y-3">
              <Health label="AI Engine" value="98%" />
              <Health label="GPU Usage" value="65%" />
              <Health label="Training Queue" value="12 Jobs" />
              <Health label="Inference" value="42 ms" />
              <Health label="Server" value="Healthy" />
              <Health label="API" value="Online" />
            </div>
          </Card>

          <Card title="Recent Activity" icon={Clock}>
            <div className="mt-5 space-y-3">
              {activities.map((item) => (
                <div
                  key={item.text}
                  className="flex gap-3 rounded-2xl border border-border bg-background p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
                  <div>
                    <p className="text-sm font-black">{item.time}</p>
                    <p className="text-sm font-medium leading-6 text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Notifications" icon={Bell}>
            <div className="mt-5 space-y-3">
              {notifications.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-background p-4 text-sm font-bold"
                >
                  🔔 {item}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quick Actions" icon={Plus}>
            <div className="mt-5 grid gap-3">
              {[
                ["Add User", Users],
                ["Create Admin", ShieldCheck],
                ["Add Product", Package],
                ["Broadcast Notification", Mail],
                ["Generate Report", FileText],
                ["Export Users", Download],
              ].map(([label, Icon]) => (
                <button
                  key={label}
                  className="flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold transition hover:border-[var(--brand-pink)]"
                >
                  <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
                  {label}
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight brand-text sm:text-3xl">
            {value}
          </h2>
          <p className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {change}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-black tracking-tight brand-text sm:text-xl">
          {title}
        </h2>
        <Icon className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
      </div>

      {children}
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        {label}
      </p>
      <p className="mt-2 text-base font-black tracking-tight text-foreground sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function LiveCard({ item }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black tracking-tight text-foreground">
            {item.twin}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {item.platform}
          </p>
        </div>

        <StatusBadge status={item.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SmallBox label="Date" value={item.start} />
        <SmallBox label="Time" value={item.time} />
        <SmallBox label="Duration" value={item.duration} />
        <SmallBox label="Viewers" value={item.viewers} />
        <SmallBox label="Revenue" value={item.revenue} />
        <SmallBox label="Orders" value={item.orders} />
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <ShoppingBag className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-black tracking-tight text-foreground">
        {product.name}
      </h3>

      <p className="mt-2 text-xl font-black brand-text">{product.price}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <SmallBox label="Orders" value={product.orders} />
        <SmallBox label="Revenue" value={product.revenue} />
        <SmallBox label="Stock" value={product.stock} />
      </div>

      <p
        className={`mt-3 text-xs font-bold ${
          product.status === "Low Stock"
            ? "text-orange-500"
            : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        ● {product.status}
      </p>
    </div>
  );
}

function SmallBox({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-2">
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className="break-words text-xs font-black text-foreground">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Live: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    Scheduled:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    Completed:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || styles.Scheduled
      }`}
    >
      {status}
    </span>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-4 text-sm">
        <span className="font-bold text-foreground">{label}</span>
        <span className="font-bold text-[var(--brand-pink)]">{value}%</span>
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

function Health({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-black text-emerald-600 dark:text-emerald-400">
        ● {value}
      </span>
    </div>
  );
}