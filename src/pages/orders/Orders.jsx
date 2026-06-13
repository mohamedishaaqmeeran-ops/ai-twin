import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Search,
  IndianRupee,
  Package,
  Truck,
  CheckCircle2,
  Eye,
  Trash2,
  Sparkles,
} from "lucide-react";

const defaultOrders = [
  {
    id: "ORD-1001",
    customer: "Arun Kumar",
    product: "Vitamin C Glow Serum",
    amount: "₹799",
    status: "Paid",
    delivery: "Processing",
    date: "Today",
  },
  {
    id: "ORD-1002",
    customer: "Meera S",
    product: "Wireless Headphone",
    amount: "₹1,299",
    status: "Paid",
    delivery: "Shipped",
    date: "Yesterday",
  },
  {
    id: "ORD-1003",
    customer: "Rahul M",
    product: "Smart Watch",
    amount: "₹2,499",
    status: "Pending",
    delivery: "Waiting",
    date: "May 26, 2026",
  },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders") || "[]");

    if (saved.length) {
      setOrders(saved);
    } else {
      setOrders(defaultOrders);
      localStorage.setItem("orders", JSON.stringify(defaultOrders));
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = `${order.id} ${order.customer} ${order.product}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchFilter = filter === "All" || order.status === filter;

      return matchSearch && matchFilter;
    });
  }, [orders, query, filter]);

  const deleteOrder = (id) => {
    const updated = orders.filter((order) => order.id !== id);
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          ORDER MANAGEMENT
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">Orders</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Track customer orders, payment status, delivery status and live sales.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={ShoppingBag} label="Total Orders" value={orders.length} />
        <Stat
          icon={CheckCircle2}
          label="Paid Orders"
          value={orders.filter((o) => o.status === "Paid").length}
        />
        <Stat icon={IndianRupee} label="Revenue" value="₹4.6L" />
        <Stat icon={Truck} label="Shipped" value="12" />
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-semibold outline-none"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black brand-text">Recent Orders</h2>

        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-black">{order.id}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.customer}
                  </p>
                  <p className="mt-2 text-sm font-bold">{order.product}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-black brand-text">{order.amount}</span>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      order.status === "Paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-orange-50 text-orange-500"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">
                    {order.delivery}
                  </span>

                  <button className="grid h-10 w-10 place-items-center rounded-[5px] border border-border text-[var(--brand-pink)] hover:bg-pink-50">
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="grid h-10 w-10 place-items-center rounded-[5px] border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Ordered: {order.date}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-black brand-text">{value}</p>
        </div>
      </div>
    </div>
  );
}