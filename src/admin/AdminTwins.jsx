// src/admin/AdminTwins.jsx

import { useMemo, useState } from "react";
import {
  Bot,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Radio,
  Brain,
  CheckCircle2,
  X,
  User,
  Crown,
  Package,
  IndianRupee,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";

const stats = [
  { title: "Total Twins", value: "8,456", status: "All", icon: Bot },
  { title: "Active", value: "7,902", status: "Active", icon: CheckCircle2 },
  { title: "Training", value: "321", status: "Training", icon: Brain },
  { title: "Live Now", value: "233", status: "Live", icon: Radio },
];

const twinsData = [
  {
    id: 1,
    avatar: "/images/bb.png",
    twin: "Beauty AI",
    owner: "Ishaaq Meeran",
    email: "ishaaq@gmail.com",
    plan: "Pro",
    status: "Active",
    training: "Completed",
    trainingProgress: 100,
    products: 18,
    lives: 42,
    revenue: "₹1,25,000",
    language: "English, Tamil",
    lastUpdated: "Today 10:30 AM",
  },
  {
    id: 2,
    avatar: "/images/dd.png",
    twin: "Fashion Host",
    owner: "Ananya",
    email: "ananya@gmail.com",
    plan: "Enterprise",
    status: "Live",
    training: "Completed",
    trainingProgress: 100,
    products: 35,
    lives: 120,
    revenue: "₹5,60,000",
    language: "English, Hindi",
    lastUpdated: "Today 09:15 AM",
  },
  {
    id: 3,
    avatar: "/images/2.jpeg",
    twin: "Tech Reviewer",
    owner: "Rahul",
    email: "rahul@gmail.com",
    plan: "Free",
    status: "Training",
    training: "Pending",
    trainingProgress: 45,
    products: 5,
    lives: 3,
    revenue: "₹0",
    language: "English",
    lastUpdated: "Yesterday",
  },
];

const liveTwins = [
  {
    twin: "Beauty AI",
    owner: "Ishaaq Meeran",
    platform: "Instagram",
    viewers: "4.8K",
    revenue: "₹45,200",
  },
  {
    twin: "Fashion Host",
    owner: "Ananya",
    platform: "TikTok",
    viewers: "2.3K",
    revenue: "₹21,500",
  },
  {
    twin: "Tech Reviewer",
    owner: "Rahul",
    platform: "YouTube",
    viewers: "1.1K",
    revenue: "₹8,200",
  },
];

export default function AdminTwins() {
  const [twins, setTwins] = useState(twinsData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedTwin, setSelectedTwin] = useState(null);

  const filteredTwins = useMemo(() => {
    return twins.filter((item) => {
      const text = `${item.twin} ${item.owner} ${item.email} ${item.plan} ${item.status}`
        .toLowerCase()
        .trim();

      const matchesSearch = text.includes(query.toLowerCase().trim());

      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [twins, query, statusFilter]);

  const deleteTwin = (id) => {
    setTwins((prev) => prev.filter((item) => item.id !== id));

    if (selectedTwin?.id === id) {
      setSelectedTwin(null);
    }
  };

  const changeStatus = (id) => {
    setTwins((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Active" ? "Training" : "Active",
              training:
                item.status === "Active" ? "Pending" : "Completed",
              trainingProgress: item.status === "Active" ? 45 : 100,
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Bot className="h-4 w-4 text-[var(--brand-pink)]" />
          ADMIN AI TWINS
        </span>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          AI Twins <span className="brand-text">Management</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Manage all user AI Twins, training progress, live sessions, languages,
          products and revenue performance.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <StatCard key={title} title={title} value={value} icon={Icon} />
        ))}
      </section>

      {/* Search + Filter */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 lg:max-w-md">
            <Search className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search twin, owner, email or plan..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3">
            <Filter className="h-4 w-4 text-[var(--brand-pink)]" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-foreground outline-none"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Training</option>
              <option>Live</option>
            </select>
          </div>
        </div>
      </section>

      {/* Desktop Table */}
      <section className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:block">
        <div className="border-b border-border p-5 sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            All AI Twins
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Desktop view with owner, plan, training, products, lives and revenue.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-background">
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="p-5 font-bold">AI Twin</th>
                <th className="p-5 font-bold">Owner</th>
                <th className="p-5 font-bold">Plan</th>
                <th className="p-5 font-bold">Training</th>
                <th className="p-5 font-bold">Products</th>
                <th className="p-5 font-bold">Lives</th>
                <th className="p-5 font-bold">Revenue</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTwins.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border transition hover:bg-background"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.avatar}
                        alt={item.twin}
                        className="h-12 w-12 rounded-2xl bg-pink-50 object-cover"
                      />

                      <div>
                        <p className="text-sm font-black tracking-tight text-foreground">
                          {item.twin}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {item.language}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-5">
                    <p className="text-sm font-black text-foreground">
                      {item.owner}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.email}
                    </p>
                  </td>

                  <td className="p-5">
                    <PlanBadge plan={item.plan} />
                  </td>

                  <td className="p-5">
                    <TrainingBadge training={item.training} />
                  </td>

                  <td className="p-5 text-sm font-bold text-foreground">
                    {item.products}
                  </td>

                  <td className="p-5 text-sm font-bold text-foreground">
                    {item.lives}
                  </td>

                  <td className="p-5 text-sm font-black brand-text">
                    {item.revenue}
                  </td>

                  <td className="p-5">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="p-5">
                    <div className="flex gap-2">
                      <ActionButton
                        icon={Eye}
                        color="blue"
                        onClick={() => setSelectedTwin(item)}
                      />
                      <ActionButton
                        icon={Edit}
                        color="yellow"
                        onClick={() => changeStatus(item.id)}
                      />
                      <ActionButton
                        icon={Trash2}
                        color="red"
                        onClick={() => deleteTwin(item.id)}
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
        {filteredTwins.map((item) => (
          <TwinMobileCard
            key={item.id}
            item={item}
            onView={() => setSelectedTwin(item)}
            onStatus={() => changeStatus(item.id)}
            onDelete={() => deleteTwin(item.id)}
          />
        ))}
      </section>

      {filteredTwins.length === 0 && (
        <section className="rounded-3xl border border-border bg-card p-10 text-center">
          <Bot className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />
          <p className="mt-3 text-lg font-black">No AI Twins found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another search or filter.
          </p>
        </section>
      )}

      {/* Currently Live */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <Radio className="h-5 w-5 text-[var(--brand-pink)]" />

          <h2 className="text-xl font-black tracking-tight brand-text sm:text-2xl">
            Currently Live AI Twins
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {liveTwins.map((item) => (
            <LiveCard key={item.twin} {...item} />
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedTwin && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTwin.avatar}
                  alt={selectedTwin.twin}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div>
                  <h2 className="text-2xl font-black tracking-tight brand-text">
                    {selectedTwin.twin}
                  </h2>
                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedTwin.owner}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTwin(null)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Detail icon={User} label="Owner" value={selectedTwin.owner} />
              <Detail icon={Crown} label="Plan" value={selectedTwin.plan} />
              <Detail icon={Brain} label="Training" value={selectedTwin.training} />
              <Detail icon={TrendingUp} label="Progress" value={`${selectedTwin.trainingProgress}%`} />
              <Detail icon={Package} label="Products" value={selectedTwin.products} />
              <Detail icon={Radio} label="Live Sessions" value={selectedTwin.lives} />
              <Detail icon={IndianRupee} label="Revenue" value={selectedTwin.revenue} />
              <Detail icon={Calendar} label="Updated" value={selectedTwin.lastUpdated} />
            </div>

            <div className="mt-6">
              <Progress
                label="Training Progress"
                value={selectedTwin.trainingProgress}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                onClick={() => changeStatus(selectedTwin.id)}
                className="brand-gradient rounded-[5px] py-3 text-sm font-bold text-white"
              >
                Change Status
              </button>

              <button
                onClick={() => setSelectedTwin(null)}
                className="rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10"
              >
                Close
              </button>

              <button
                onClick={() => deleteTwin(selectedTwin.id)}
                className="rounded-[5px] bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Delete Twin
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

function TwinMobileCard({ item, onView, onStatus, onDelete }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <img
          src={item.avatar}
          alt={item.twin}
          className="h-14 w-14 rounded-2xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black tracking-tight text-foreground">
            {item.twin}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            {item.owner}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <PlanBadge plan={item.plan} />
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MobileInfo label="Training" value={item.training} />
        <MobileInfo label="Products" value={item.products} />
        <MobileInfo label="Lives" value={item.lives} />
        <MobileInfo label="Revenue" value={item.revenue} />
      </div>

      <div className="mt-4">
        <Progress label="Training Progress" value={item.trainingProgress} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MobileAction icon={Eye} onClick={onView} />
        <MobileAction icon={Edit} onClick={onStatus} />
        <MobileAction icon={Trash2} onClick={onDelete} />
      </div>
    </div>
  );
}

function LiveCard({ twin, owner, platform, viewers, revenue }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black tracking-tight text-foreground">
            {twin}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Owner: {owner}</p>
          <p className="mt-1 text-sm font-bold text-[var(--brand-pink)]">
            {platform}
          </p>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
          LIVE
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MobileInfo label="Viewers" value={viewers} />
        <MobileInfo label="Revenue" value={revenue} />
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

function TrainingBadge({ training }) {
  const completed = training === "Completed";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
        completed
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
      }`}
    >
      {completed ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Brain className="h-3.5 w-3.5" />
      )}
      {training}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    Training:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    Live:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || styles.Active
      }`}
    >
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, color, onClick }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10",
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
      <p className="mt-1 break-words text-sm font-black text-foreground">
        {value}
      </p>
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