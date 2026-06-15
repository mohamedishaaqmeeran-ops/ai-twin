// src/admin/AdminUsers.jsx

import { useMemo, useState } from "react";
import {
  Users,
  Crown,
  ShieldCheck,
  UserCheck,
  Search,
  Filter,
  Eye,
  Ban,
  Trash2,
  Pencil,
  CheckCircle2,
  Bot,
  Package,
  Radio,
  IndianRupee,
  X,
  Mail,
  Phone,
  Building2,
  Clock,
} from "lucide-react";

const usersData = [
  {
    id: 1,
    avatar: "/images/1.jpeg",
    name: "Ishaaq Meeran",
    email: "ishaaq@gmail.com",
    phone: "+91 98765 43210",
    brand: "Twin Store",
    plan: "Pro",
    twin: "Created",
    products: 18,
    lives: 42,
    revenue: "₹2,45,000",
    joined: "15 Jun 2026",
    lastLogin: "Today 10:20 AM",
    status: "Active",
  },
  {
    id: 2,
    avatar: "/images/2.jpeg",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 91234 56780",
    brand: "Tech Deals",
    plan: "Free",
    twin: "Pending",
    products: 5,
    lives: 2,
    revenue: "₹0",
    joined: "10 Jun 2026",
    lastLogin: "Yesterday",
    status: "Active",
  },
  {
    id: 3,
    avatar: "/images/3.jpeg",
    name: "Ananya",
    email: "ananya@gmail.com",
    phone: "+91 90000 11111",
    brand: "Fashion Hub",
    plan: "Enterprise",
    twin: "Created",
    products: 35,
    lives: 102,
    revenue: "₹4,20,000",
    joined: "01 Jun 2026",
    lastLogin: "Today 08:15 AM",
    status: "Blocked",
  },
  {
    id: 4,
    avatar: "/images/4.jpeg",
    name: "Meera Joseph",
    email: "meera@gmail.com",
    phone: "+91 98888 77777",
    brand: "Beauty Glow",
    plan: "Pro",
    twin: "Created",
    products: 22,
    lives: 64,
    revenue: "₹3,18,500",
    joined: "28 May 2026",
    lastLogin: "Today 12:00 PM",
    status: "Active",
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(usersData);
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = `${user.name} ${user.email} ${user.phone} ${user.brand}`
        .toLowerCase()
        .trim();

      const matchesSearch = searchText.includes(query.toLowerCase().trim());

      const matchesPlan =
        planFilter === "All Plans" || user.plan === planFilter;

      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [users, query, planFilter, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const freeUsers = users.filter((u) => u.plan === "Free").length;
  const proUsers = users.filter((u) => u.plan === "Pro").length;
  const enterpriseUsers = users.filter((u) => u.plan === "Enterprise").length;
  const blockedUsers = users.filter((u) => u.status === "Blocked").length;

  const toggleBlock = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Blocked" ? "Active" : "Blocked",
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    if (selectedUser?.id === id) setSelectedUser(null);
  };

  const upgradePlan = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              plan:
                user.plan === "Free"
                  ? "Pro"
                  : user.plan === "Pro"
                  ? "Enterprise"
                  : "Enterprise",
            }
          : user
      )
    );
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Users className="h-4 w-4 text-[var(--brand-pink)]" />
          ADMIN USERS
        </span>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Users <span className="brand-text">Management</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Manage users by subscription plan, AI Twin status, live activity,
          revenue and account access.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} title="Total Users" value={totalUsers} />
        <StatCard icon={UserCheck} title="Active Users" value={activeUsers} />
        <StatCard icon={Crown} title="Pro Users" value={proUsers} />
        <StatCard
          icon={ShieldCheck}
          title="Enterprise"
          value={enterpriseUsers}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserCheck} title="Free Users" value={freeUsers} />
        <StatCard icon={Ban} title="Blocked Users" value={blockedUsers} />
        <StatCard icon={Bot} title="AI Twins Created" value="3" />
        <StatCard icon={IndianRupee} title="Revenue" value="₹9.83L" />
      </section>

      {/* Filters */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 xl:max-w-md">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone or brand..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:flex">
            <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3">
              <Filter className="h-4 w-4 text-[var(--brand-pink)]" />
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-foreground outline-none"
              >
                <option>All Plans</option>
                <option>Free</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3">
              <Filter className="h-4 w-4 text-[var(--brand-pink)]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-foreground outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Blocked</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Table */}
      <section className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:block">
        <div className="border-b border-border p-5 sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Registered Users
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Full user list with plan, AI Twin, live sessions and revenue data.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-background">
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="p-5 font-bold">User</th>
                <th className="p-5 font-bold">Plan</th>
                <th className="p-5 font-bold">AI Twin</th>
                <th className="p-5 font-bold">Products</th>
                <th className="p-5 font-bold">Lives</th>
                <th className="p-5 font-bold">Revenue</th>
                <th className="p-5 font-bold">Joined</th>
                <th className="p-5 font-bold">Last Login</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border transition hover:bg-background"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-12 w-12 rounded-2xl object-cover"
                      />

                      <div>
                        <p className="text-sm font-black tracking-tight text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {user.brand}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-5">
                    <PlanBadge plan={user.plan} />
                  </td>

                  <td className="p-5">
                    <TwinBadge twin={user.twin} />
                  </td>

                  <td className="p-5 text-sm font-bold text-foreground">
                    {user.products}
                  </td>

                  <td className="p-5 text-sm font-bold text-foreground">
                    {user.lives}
                  </td>

                  <td className="p-5 text-sm font-black brand-text">
                    {user.revenue}
                  </td>

                  <td className="p-5 text-sm font-medium text-muted-foreground">
                    {user.joined}
                  </td>

                  <td className="p-5 text-sm font-medium text-muted-foreground">
                    {user.lastLogin}
                  </td>

                  <td className="p-5">
                    <StatusBadge status={user.status} />
                  </td>

                  <td className="p-5">
                    <div className="flex gap-2">
                      <ActionButton
                        icon={Eye}
                        color="blue"
                        onClick={() => setSelectedUser(user)}
                      />
                      <ActionButton
                        icon={Pencil}
                        color="pink"
                        onClick={() => upgradePlan(user.id)}
                      />
                      <ActionButton
                        icon={Ban}
                        color="yellow"
                        onClick={() => toggleBlock(user.id)}
                      />
                      <ActionButton
                        icon={Trash2}
                        color="red"
                        onClick={() => deleteUser(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile Cards */}
      <section className="grid gap-4 lg:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-14 w-14 rounded-2xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black tracking-tight text-foreground">
                  {user.name}
                </h3>
                <p className="truncate text-sm font-medium text-muted-foreground">
                  {user.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <PlanBadge plan={user.plan} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MobileInfo label="AI Twin" value={user.twin} />
              <MobileInfo label="Products" value={user.products} />
              <MobileInfo label="Lives" value={user.lives} />
              <MobileInfo label="Revenue" value={user.revenue} />
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              <MobileAction icon={Eye} onClick={() => setSelectedUser(user)} />
              <MobileAction icon={Pencil} onClick={() => upgradePlan(user.id)} />
              <MobileAction icon={Ban} onClick={() => toggleBlock(user.id)} />
              <MobileAction icon={Trash2} onClick={() => deleteUser(user.id)} />
            </div>
          </div>
        ))}
      </section>

      {/* Empty */}
      {filteredUsers.length === 0 && (
        <section className="rounded-3xl border border-border bg-card p-10 text-center">
          <Users className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />
          <p className="mt-3 text-lg font-black">No users found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another search or filter.
          </p>
        </section>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div>
                  <h2 className="text-2xl font-black tracking-tight brand-text">
                    {selectedUser.name}
                  </h2>
                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedUser.brand}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Detail icon={Mail} label="Email" value={selectedUser.email} />
              <Detail icon={Phone} label="Phone" value={selectedUser.phone} />
              <Detail
                icon={Building2}
                label="Brand"
                value={selectedUser.brand}
              />
              <Detail icon={Crown} label="Plan" value={selectedUser.plan} />
              <Detail icon={Bot} label="AI Twin" value={selectedUser.twin} />
              <Detail
                icon={Package}
                label="Products"
                value={selectedUser.products}
              />
              <Detail icon={Radio} label="Live Sessions" value={selectedUser.lives} />
              <Detail
                icon={IndianRupee}
                label="Revenue"
                value={selectedUser.revenue}
              />
              <Detail icon={Clock} label="Joined" value={selectedUser.joined} />
              <Detail
                icon={UserCheck}
                label="Last Login"
                value={selectedUser.lastLogin}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                onClick={() => upgradePlan(selectedUser.id)}
                className="brand-gradient rounded-[5px] py-3 text-sm font-bold text-white"
              >
                Upgrade Plan
              </button>

              <button
                onClick={() => toggleBlock(selectedUser.id)}
                className="rounded-[5px] border-2 border-orange-500 py-3 text-sm font-bold text-orange-500 hover:bg-orange-50"
              >
                {selectedUser.status === "Blocked" ? "Unblock" : "Block"} User
              </button>

              <button
                onClick={() => deleteUser(selectedUser.id)}
                className="rounded-[5px] bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
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

function PlanBadge({ plan }) {
  const styles = {
    Free: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
    Pro: "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10",
    Enterprise:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[plan]}`}>
      {plan}
    </span>
  );
}

function TwinBadge({ twin }) {
  const created = twin === "Created";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        created
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
      }`}
    >
      {twin}
    </span>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, color, onClick }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10",
    pink: "bg-pink-50 text-[var(--brand-pink)] hover:bg-pink-100 dark:bg-white/10",
    yellow:
      "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-500/10",
    red: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10",
  };

  return (
    <button onClick={onClick} className={`rounded-xl p-3 ${styles[color]}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function MobileInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black text-foreground">{value}</p>
    </div>
  );
}

function MobileAction({ icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="grid h-11 place-items-center rounded-[5px] border border-border bg-background text-[var(--brand-pink)]"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </div>

      <p className="mt-2 text-sm font-black tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}