// src/admin/AdminProducts.jsx

import {
  Package,
  Search,
  Filter,
  Eye,
  Trash2,
  ShoppingBag,
  IndianRupee,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  UserRound,
  Radio,
} from "lucide-react";

const stats = [
  { title: "Total Products", value: "2,845", icon: Package },
  { title: "Active Products", value: "2,420", icon: CheckCircle2 },
  { title: "Low Stock", value: "312", icon: AlertTriangle },
  { title: "Revenue", value: "₹18.4L", icon: IndianRupee },
];

const products = [
  {
    id: 1,
    name: "Vitamin C Glow Serum",
    category: "Beauty",
    owner: "Ishaaq Meeran",
    price: "₹799",
    stock: 520,
    sales: 542,
    revenue: "₹4,32,000",
    status: "Active",
    twin: "Beauty AI",
    image: "/images/6.jpeg",
  },
  {
    id: 2,
    name: "Wireless Headphone",
    category: "Electronics",
    owner: "Rahul Sharma",
    price: "₹1,299",
    stock: 182,
    sales: 382,
    revenue: "₹3,18,000",
    status: "Active",
    twin: "Tech Reviewer",
    image: "/images/5.jpeg",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Gadgets",
    owner: "Ananya",
    price: "₹2,499",
    stock: 40,
    sales: 290,
    revenue: "₹2,64,000",
    status: "Low Stock",
    twin: "Fashion Host",
    image: "/images/7.jpeg",
  },
];

export default function AdminProducts() {
  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Package className="h-4 w-4 text-[var(--brand-pink)]" />
          ADMIN PRODUCTS
        </span>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Product <span className="brand-text">Management</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Manage all products uploaded by users, track inventory, sales,
          revenue and AI Twin selling readiness.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <StatCard key={title} title={title} value={value} icon={Icon} />
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 lg:max-w-md">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />
            <input
              placeholder="Search product, owner, category..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-5 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)]">
            <Filter className="h-4 w-4 text-[var(--brand-pink)]" />
            Filter Products
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5 sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Uploaded Products
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Products added by users and connected with their AI Twins.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-background">
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="p-5 font-bold">Product</th>
                  <th className="p-5 font-bold">Owner</th>
                  <th className="p-5 font-bold">Category</th>
                  <th className="p-5 font-bold">Stock</th>
                  <th className="p-5 font-bold">Sales</th>
                  <th className="p-5 font-bold">Revenue</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5 font-bold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border transition hover:bg-background"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-2xl bg-pink-50 object-contain"
                        />

                        <div>
                          <p className="text-sm font-black tracking-tight text-foreground">
                            {product.name}
                          </p>
                          <p className="text-sm font-black brand-text">
                            {product.price}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">
                            Twin: {product.twin}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-sm font-bold text-foreground">
                      {product.owner}
                    </td>

                    <td className="p-5">
                      <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[var(--brand-pink)] dark:bg-white/10">
                        {product.category}
                      </span>
                    </td>

                    <td className="p-5 text-sm font-bold text-foreground">
                      {product.stock}
                    </td>

                    <td className="p-5 text-sm font-bold text-foreground">
                      {product.sales}
                    </td>

                    <td className="p-5 text-sm font-black brand-text">
                      {product.revenue}
                    </td>

                    <td className="p-5">
                      <StatusBadge status={product.status} />
                    </td>

                    <td className="p-5">
                      <div className="flex gap-2">
                        <ActionButton icon={Eye} color="blue" />
                        <ActionButton icon={Radio} color="pink" />
                        <ActionButton icon={Trash2} color="red" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Product Insights
            </h2>

            <div className="mt-5 space-y-3">
              <Insight icon={ShoppingBag} label="Best Seller" value="Vitamin C Glow Serum" />
              <Insight icon={Boxes} label="Most Stock" value="520 Units" />
              <Insight icon={Radio} label="Most Sold Live" value="Beauty AI" />
              <Insight icon={UserRound} label="Top Owner" value="Ishaaq Meeran" />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Category Split
            </h2>

            <div className="mt-5 space-y-4">
              <Progress label="Beauty" value={45} />
              <Progress label="Electronics" value={30} />
              <Progress label="Gadgets" value={25} />
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight brand-text">
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

function StatusBadge({ status }) {
  const low = status === "Low Stock";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        low
          ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      }`}
    >
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, color }) {
  const classes = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10",
    pink: "bg-pink-50 text-[var(--brand-pink)] hover:bg-pink-100 dark:bg-white/10",
    red: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10",
  };

  return (
    <button className={`rounded-xl p-3 transition ${classes[color]}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Insight({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>

      <span className="text-right text-sm font-black text-foreground">
        {value}
      </span>
    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-bold text-foreground">{label}</span>
        <span className="font-black text-[var(--brand-pink)]">{value}%</span>
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