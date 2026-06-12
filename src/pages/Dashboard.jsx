import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Music2,
  Package,
  Radio,
  ScanFace,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Youtube,
  Brain,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const hasTwin = localStorage.getItem("hasTwin") === "true";
  const isTrained = localStorage.getItem("isTwinTrained") === "true";
  const twinName = localStorage.getItem("twinName") || "My AI Twin";
  const twinImage = "/images/bb.png";

  const goLive = () => {
    if (!hasTwin) {
      navigate("/app/twin/create");
      return;
    }

    navigate("/app/golive");
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              AI LIVE COMMERCE DASHBOARD
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              <span className="brand-text">Never sleep.</span>
              <br />
              Never stop selling.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage your AI Twin, train it with your brand knowledge, add
              products, connect social platforms and start live selling.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={goLive}
                className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md hover:opacity-90"
              >
                Go Live Now
                <Radio className="h-4 w-4" />
              </button>

              <Link
                to="/app/products/add"
                className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-6 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
              >
                Add Product
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-pink-50 ">
            <img
              src={twinImage}
              alt="AI Twin"
              className="h-72 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Products" value="24" change="+12%" />
        <StatCard icon={Radio} label="Live Sessions" value="18" change="+8%" />
        <StatCard icon={ShoppingBag} label="Orders" value="420" change="+22%" />
        <StatCard icon={TrendingUp} label="Revenue" value="₹2.4L" change="+35%" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Quick Actions */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black brand-text">Quick Actions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue your AI Twin setup and selling flow.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              icon={ScanFace}
              title="Create AI Twin"
              desc="Create or edit your sales avatar."
              to="/app/twin/create"
            />
            <ActionCard
              icon={Brain}
              title="Train Twin"
              desc="Upload files, links and brand knowledge."
              to="/app/twin/train"
            />
            <ActionCard
              icon={Package}
              title="Products"
              desc="Add products your twin can sell."
              to="/app/products"
            />
            <ActionCard
              icon={Instagram}
              title="Connect Social"
              desc="Connect Instagram, YouTube, TikTok."
              to="/app/connect"
            />
            <ActionCard
              icon={Calendar}
              title="Schedule Live"
              desc="Plan your upcoming live sessions."
              to="/app/schedule"
            />
            <ActionCard
              icon={BarChart3}
              title="Analytics"
              desc="Track views, orders and revenue."
              to="/app/analytics"
            />
          </div>
        </div>

        {/* Twin Status */}
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">AI Twin Status</h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-4">
              <img
                src={twinImage}
                alt="AI Twin"
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <h3 className="font-black">{twinName}</h3>
                <p className="text-sm font-bold text-emerald-600">
                  ● {hasTwin ? "Online" : "Not Created"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Progress label="Avatar Created" value={hasTwin ? 100 : 0} />
              <Progress label="Voice Trained" value={hasTwin ? 80 : 0} />
              <Progress label="Knowledge Added" value={isTrained ? 100 : 35} />
              <Progress label="Products Added" value={70} />
            </div>
          </div>

          {!hasTwin ? (
            <Link
              to="/app/twin/create"
              className="brand-gradient mt-5 flex h-11 items-center justify-center rounded-[5px] text-sm font-bold text-white"
            >
              Create AI Twin
            </Link>
          ) : (
            <Link
              to="/app/twin"
              className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
            >
              View Twin Dashboard
            </Link>
          )}
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {/* Recent Products */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black brand-text">Recent Products</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Products ready for your AI Twin to sell.
              </p>
            </div>

            <Link
              to="/app/products"
              className="text-sm font-bold text-[var(--brand-pink)] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                name: "Vitamin C Glow Serum",
                price: "₹799",
                status: "Ready",
                img: "/images/product1.png",
              },
              {
                name: "Wireless Headphone",
                price: "₹1,299",
                status: "Ready",
                img: "/images/headphone.png",
              },
              {
                name: "Smart Watch",
                price: "₹2,499",
                status: "Needs Script",
                img: "/images/watch.png",
              },
            ].map((product) => (
              <div
                key={product.name}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl bg-pink-50 object-contain"
                  />

                  <div>
                    <h3 className="font-black">{product.name}</h3>
                    <p className="text-sm font-bold brand-text">
                      {product.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.status}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem("selectedProduct", product.name);
                    goLive();
                  }}
                  className="brand-gradient rounded-[5px] px-5 py-2.5 text-sm font-bold text-white"
                >
                  Sell Live
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Live */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Upcoming Live</h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
                <Instagram className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-black">Instagram Live</h3>
                <p className="text-sm text-muted-foreground">
                  Vitamin C Glow Serum
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <Info icon={Calendar} label="Date" value="Today" />
              <Info icon={Clock} label="Time" value="07:30 PM" />
            </div>

            <Link
              to="/app/schedule"
              className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
            >
              Manage Schedule
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {/* Connected Accounts */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Connected Accounts</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SocialCard icon={Instagram} name="Instagram" connected />
            <SocialCard icon={Facebook} name="Facebook" connected />
            <SocialCard icon={Youtube} name="YouTube" connected />
            <SocialCard icon={Music2} name="TikTok" />
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Recent Activity</h2>

          <div className="mt-5 space-y-4">
            <ActivityItem
              title="AI answered 245 customer questions"
              time="10:30 AM"
            />
            <ActivityItem
              title="Product added: Vitamin C Glow Serum"
              time="09:45 AM"
            />
            <ActivityItem
              title="Instagram live completed successfully"
              time="Yesterday"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h2 className="mt-2 text-3xl font-black brand-text">{value}</h2>
          <p className="mt-1 text-sm font-bold text-emerald-600">{change}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
    </Link>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-bold">{label}</span>
        <span className="font-bold text-[var(--brand-pink)]">{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-pink-100">
        <div
          className="brand-gradient h-2 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function SocialCard({ icon: Icon, name, connected }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
        <p className="font-bold">{name}</p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          connected
            ? "bg-emerald-50 text-emerald-600"
            : "bg-orange-50 text-orange-500"
        }`}
      >
        {connected ? "Connected" : "Not Connected"}
      </span>
    </div>
  );
}

function ActivityItem({ title, time }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-background p-4">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}