import {
  TrendingUp,
  ShoppingBag,
  Eye,
  Heart,
  Radio,
  IndianRupee,
  Users,
  Package,
  BarChart3,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  Sparkles,
} from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Hero */}

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 px-4 py-2 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          AI ANALYTICS
        </span>

        <h1 className="mt-5 text-4xl font-black">
          <span className="brand-text">Performance</span> Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Track your AI Twin live sessions, product sales and audience
          engagement.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={Eye}
          title="Total Views"
          value="25.4K"
          growth="+18%"
        />

        <Stat
          icon={ShoppingBag}
          title="Orders"
          value="1,245"
          growth="+32%"
        />

        <Stat
          icon={IndianRupee}
          title="Revenue"
          value="₹9.85L"
          growth="+42%"
        />

        <Stat
          icon={Heart}
          title="Engagement"
          value="12.6%"
          growth="+15%"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left */}

        <div className="space-y-6">
          {/* Chart */}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                Live Performance
              </h2>

              <BarChart3 className="text-[var(--brand-pink)]" />
            </div>

            <div className="mt-6 flex h-72 items-end justify-between rounded-2xl bg-pink-50 p-6">
              {[40, 60, 45, 80, 55, 90, 75].map((v, i) => (
                <div
                  key={i}
                  className="brand-gradient w-8 rounded-t-xl"
                  style={{
                    height: `${v}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Products */}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Top Selling Products
            </h2>

            <div className="mt-5 space-y-4">
              <Product
                name="Vitamin C Glow Serum"
                sales="524 Orders"
                percent={90}
              />

              <Product
                name="Wireless Headphone"
                sales="312 Orders"
                percent={65}
              />

              <Product
                name="Smart Watch"
                sales="201 Orders"
                percent={45}
              />
            </div>
          </div>

          {/* Recent Lives */}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Recent Live Sessions
            </h2>

            <div className="mt-5 space-y-4">
              <Live
                title="Glow Serum Evening Sale"
                viewers="4.8K"
                revenue="₹58,900"
              />

              <Live
                title="Headphone Flash Sale"
                viewers="3.2K"
                revenue="₹42,500"
              />

              <Live
                title="Smart Watch Demo"
                viewers="2.6K"
                revenue="₹31,800"
              />
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black brand-text">
              AI Twin Status
            </h2>

            <div className="mt-5 rounded-2xl bg-pink-50 p-5">
              <img
                src="/images/bb.png"
                className="mx-auto h-40 rounded-[5px] object-contain"
              />

              <h3 className="mt-4 text-center text-xl font-black">
                My AI Twin
              </h3>

              <p className="text-center text-green-600 font-bold">
                ● Online
              </p>
            </div>

            <Progress label="Avatar Created" value="100%" width="100%" />
            <Progress label="Voice Training" value="90%" width="90%" />
            <Progress label="Knowledge Base" value="85%" width="85%" />
            <Progress label="Products Added" value="70%" width="70%" />
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Platform Performance
            </h2>

            <div className="mt-5 space-y-4">
              <Platform icon={Instagram} name="Instagram" value="45%" />
              <Platform icon={Youtube} name="YouTube" value="30%" />
              <Platform icon={Facebook} name="Facebook" value="15%" />
              <Platform icon={Music2} name="TikTok" value="10%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, title, value, growth }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-black brand-text">
            {value}
          </h2>

          <p className="mt-2 font-bold text-green-600">
            {growth}
          </p>
        </div>

        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Product({ name, sales, percent }) {
  return (
    <div>
      <div className="flex justify-between font-bold">
        <span>{name}</span>
        <span>{sales}</span>
      </div>

      <div className="mt-2 h-3 rounded-full bg-pink-100">
        <div
          className="brand-gradient h-3 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Live({ title, viewers, revenue }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <h3 className="font-black">{title}</h3>

      <div className="mt-2 flex justify-between text-sm">
        <span>{viewers} Viewers</span>

        <span className="brand-text font-bold">
          {revenue}
        </span>
      </div>
    </div>
  );
}

function Progress({ label, value, width }) {
  return (
    <div className="mt-5">
      <div className="flex justify-between font-bold">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="mt-2 h-3 rounded-full bg-pink-100">
        <div
          className="brand-gradient h-3 rounded-full"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function Platform({ icon: Icon, name, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border p-4">
      <div className="flex items-center gap-3">
        <Icon className="text-[var(--brand-pink)]" />
        <span className="font-bold">{name}</span>
      </div>

      <span className="brand-text font-black">
        {value}
      </span>
    </div>
  );
}