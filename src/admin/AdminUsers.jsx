import { useEffect, useMemo, useState } from "react";
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
  Bot,
  IndianRupee,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  Building2,
  Clock,
  Package,
  Radio,
} from "lucide-react";

const API = "https://twinn-backend.onrender.com/api";

export default function AdminUsers() {
 const [users, setUsers] = useState([]);
const [waitlistUsers, setWaitlistUsers] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [loading, setLoading] = useState(true);
const [query, setQuery] = useState("");
const [planFilter, setPlanFilter] = useState("All Plans");
const [statusFilter, setStatusFilter] = useState("All Status");
const [selectedUser, setSelectedUser] = useState(null);
const [activeTab, setActiveTab] = useState("users");

const usersPerPage = 10;

// ---------------------------------
// INITIAL DATA LOADING
// ---------------------------------

useEffect(() => {
  loadUsers();
  loadWaitlist();
}, []);

// Reset pagination when filters or tabs change
useEffect(() => {
  setCurrentPage(1);
}, [activeTab, query, planFilter, statusFilter]);

// ---------------------------------
// LOAD REGISTERED USERS
// ---------------------------------

const loadUsers = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/admin/users`, {
      credentials: "include",
    });

    const contentType =
      res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();

      console.error(
        "ADMIN USERS NON-JSON RESPONSE:",
        text
      );

      throw new Error(
        `Admin users route returned ${res.status}. Check backend route mounting.`
      );
    }

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data.message || "Unable to load users"
      );
    }

    setUsers(data.users || []);
  } catch (error) {
    console.error("LOAD USERS ERROR:", error);
    setUsers([]);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

// ---------------------------------
// LOAD WAITLIST USERS
// ---------------------------------

const loadWaitlist = async () => {
  try {
    const res = await fetch(`${API}/waitlist`, {
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Unable to load waitlist users"
      );
    }

    setWaitlistUsers(data.data || []);
  } catch (error) {
    console.error("LOAD WAITLIST ERROR:", error);
    setWaitlistUsers([]);
  }
};

// ---------------------------------
// DELETE REGISTERED USER
// ---------------------------------

const deleteUser = async (id) => {
  if (!window.confirm("Delete this user?")) {
    return;
  }

  try {
    const res = await fetch(
      `${API}/admin/users/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(
        data.message || "Unable to delete user"
      );
    }

    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) => (user._id || user.id) !== id
      )
    );

    if (
      selectedUser &&
      !selectedUser.isWaitlist &&
      selectedUser.id === id
    ) {
      setSelectedUser(null);
    }
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    alert(error.message);
  }
};

// ---------------------------------
// BLOCK / UNBLOCK USER
// ---------------------------------

const toggleBlock = async (id) => {
  try {
    const res = await fetch(
      `${API}/admin/users/${id}/status`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to update user status"
      );
    }

    await loadUsers();

    setSelectedUser(null);
  } catch (error) {
    console.error(
      "UPDATE USER STATUS ERROR:",
      error
    );
    alert(error.message);
  }
};

// ---------------------------------
// UPGRADE USER PLAN
// ---------------------------------

const upgradePlan = async (id) => {
  try {
    const res = await fetch(
      `${API}/admin/users/${id}/plan`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          plan: "pro",
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to update user plan"
      );
    }

    await loadUsers();

    setSelectedUser(null);
  } catch (error) {
    console.error(
      "UPDATE USER PLAN ERROR:",
      error
    );
    alert(error.message);
  }
};

// ---------------------------------
// DELETE WAITLIST USER
// ---------------------------------

const deleteWaitlist = async (id) => {
  if (
    !window.confirm("Delete this waitlist user?")
  ) {
    return;
  }

  try {
    const res = await fetch(
      `${API}/waitlist/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Unable to delete waitlist user"
      );
    }

    setWaitlistUsers((currentUsers) =>
      currentUsers.filter(
        (user) => (user._id || user.id) !== id
      )
    );

    if (
      selectedUser?.isWaitlist &&
      selectedUser?.id === id
    ) {
      setSelectedUser(null);
    }
  } catch (error) {
    console.error(
      "DELETE WAITLIST ERROR:",
      error
    );
    alert(error.message);
  }
};

// ---------------------------------
// FILTER REGISTERED USERS
// Must be declared before pagination
// ---------------------------------
// ---------------------------------
// FILTER REGISTERED USERS
// ---------------------------------

const registeredUsersResult = useMemo(() => {
  const searchText = query.toLowerCase().trim();

  return users.filter((user) => {
    const searchableText = `
      ${user.name || ""}
      ${user.fullName || ""}
      ${user.username || ""}
      ${user.email || ""}
      ${user.phone || ""}
      ${user.mobile || ""}
      ${user.phoneNumber || ""}
      ${user.brand || ""}
      ${user.brandName || ""}
    `.toLowerCase();

    const userPlan = String(
      user.plan || "free"
    ).toLowerCase();

    const userStatus = String(
      user.status ||
        (user.isBlocked ? "Blocked" : "Active")
    ).toLowerCase();

    const matchesSearch =
      searchableText.includes(searchText);

    const matchesPlan =
      planFilter === "All Plans" ||
      userPlan === planFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All Status" ||
      userStatus === statusFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesPlan &&
      matchesStatus
    );
  });
}, [users, query, planFilter, statusFilter]);

// ---------------------------------
// FILTER WAITLIST USERS
// ---------------------------------

const waitlistUsersResult = useMemo(() => {
  const searchText = query.toLowerCase().trim();

  return waitlistUsers.filter((user) => {
    const searchableText = `
      ${user.name || ""}
      ${user.fullName || ""}
      ${user.username || ""}
      ${user.email || ""}
      ${user.phone || ""}
      ${user.mobile || ""}
      ${user.phoneNumber || ""}
      ${user.brand || ""}
      ${user.brandName || ""}
    `.toLowerCase();

    return searchableText.includes(searchText);
  });
}, [waitlistUsers, query]);

// ---------------------------------
// PAGINATION
// ---------------------------------

const activeResult =
  activeTab === "users"
    ? registeredUsersResult
    : waitlistUsersResult;

const totalPages = Math.max(
  1,
  Math.ceil(activeResult.length / usersPerPage)
);

const startIndex =
  (currentPage - 1) * usersPerPage;

const endIndex = startIndex + usersPerPage;

const paginatedRegisteredUsers =
  registeredUsersResult.slice(
    startIndex,
    endIndex
  );

const paginatedWaitlistUsers =
  waitlistUsersResult.slice(
    startIndex,
    endIndex
  );

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

// ---------------------------------
// CSV EXPORT
// ---------------------------------

const escapeCSVValue = (value) => {
  const normalizedValue =
    value === null || value === undefined
      ? ""
      : String(value);

  return `"${normalizedValue.replace(
    /"/g,
    '""'
  )}"`;
};

const exportUsers = () => {
  const isRegisteredUsers =
    activeTab === "users";

  const rows = isRegisteredUsers
    ? registeredUsersResult.map((user) => {
        const hasTwin =
          user.twinCreated ||
          user.hasTwin ||
          (Array.isArray(user.twins) &&
            user.twins.length > 0);

        return {
          Name:
            user.name ||
            user.fullName ||
            user.username ||
            user.email?.split("@")[0] ||
            "Unnamed User",

          Email: user.email || "",

          Phone:
            user.phone ||
            user.mobile ||
            user.phoneNumber ||
            "",

          Brand:
            user.brand ||
            user.brandName ||
            "",

          Plan: user.plan || "Free",

          Status:
            user.status ||
            (user.isBlocked
              ? "Blocked"
              : "Active"),

          "AI Twin": hasTwin
            ? "Created"
            : "Pending",

          Products:
            user.productsCount ??
            user.productCount ??
            (Array.isArray(user.products)
              ? user.products.length
              : 0),

          Lives:
            user.livesCount ??
            user.liveCount ??
            user.totalLives ??
            (Array.isArray(user.lives)
              ? user.lives.length
              : 0),

          Revenue:
            user.totalRevenue ??
            user.revenue ??
            user.salesRevenue ??
            0,

          Joined: user.createdAt
            ? new Date(
                user.createdAt
              ).toLocaleDateString("en-IN")
            : "",

          "Last Login": user.lastLogin
            ? new Date(
                user.lastLogin
              ).toLocaleString("en-IN")
            : "Never",
        };
      })
    : waitlistUsersResult.map((user) => ({
        Name:
          user.name ||
          user.fullName ||
          user.username ||
          "Unnamed User",

        Email: user.email || "",

        Phone:
          user.phone ||
          user.mobile ||
          user.phoneNumber ||
          "",

        Brand:
          user.brand ||
          user.brandName ||
          "",

        Joined: user.createdAt
          ? new Date(
              user.createdAt
            ).toLocaleDateString("en-IN")
          : "",
      }));

  if (rows.length === 0) {
    alert("No users available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csvContent = [
    headers.map(escapeCSVValue).join(","),

    ...rows.map((row) =>
      headers
        .map((header) =>
          escapeCSVValue(row[header])
        )
        .join(",")
    ),
  ].join("\n");

  const csvBlob = new Blob(
    [`\uFEFF${csvContent}`],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const downloadUrl =
    URL.createObjectURL(csvBlob);

  const downloadLink =
    document.createElement("a");

  downloadLink.href = downloadUrl;

  downloadLink.download =
    isRegisteredUsers
      ? `registered-users-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`
      : `waitlist-users-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;

  document.body.appendChild(downloadLink);

  downloadLink.click();

  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(downloadUrl);
};

// ---------------------------------
// DASHBOARD STATS
// ---------------------------------

const totalUsers = users.length;

const activeUsers = users.filter((user) => {
  const status =
    user.status ||
    (user.isBlocked ? "Blocked" : "Active");

  return status.toLowerCase() === "active";
}).length;

const blockedUsers = users.filter((user) => {
  const status =
    user.status ||
    (user.isBlocked ? "Blocked" : "Active");

  return status.toLowerCase() === "blocked";
}).length;

const freeUsers = users.filter(
  (user) =>
    (user.plan || "free").toLowerCase() ===
    "free"
).length;

const proUsers = users.filter(
  (user) =>
    (user.plan || "").toLowerCase() ===
    "pro"
).length;

const businessUsers = users.filter(
  (user) =>
    (user.plan || "").toLowerCase() ===
    "business"
).length;

const twinsCreated = users.filter(
  (user) =>
    user.twinCreated ||
    user.hasTwin ||
    (Array.isArray(user.twins) &&
      user.twins.length > 0)
).length;

const totalRevenue = users.reduce(
  (sum, user) => {
    const revenue = Number(
      user.totalRevenue ??
        user.revenue ??
        user.salesRevenue ??
        0
    );

    return sum + (Number.isNaN(revenue) ? 0 : revenue);
  },
  0
);

// ---------------------------------
// LOADING UI
// ---------------------------------

if (loading) {
  return (
    <div className="grid min-h-[500px] place-items-center">
      <div className="text-lg font-bold">
        Loading users...
      </div>
    </div>
  );
}

  // ==============================
  // PART 2 STARTS HERE
  // ==============================

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

      <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
        Manage registered users, waitlist users, subscription plans, account
        access, AI Twins and user activity.
      </p>
    </section>

    {/* Stats row 1 */}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Users}
        title="Total Users"
        value={totalUsers}
      />

      <StatCard
        icon={UserCheck}
        title="Active Users"
        value={activeUsers}
      />

      <StatCard
        icon={Crown}
        title="Pro Users"
        value={proUsers}
      />

      <StatCard
        icon={ShieldCheck}
        title="Business Users"
        value={businessUsers}
      />
    </section>

    {/* Stats row 2 */}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={UserCheck}
        title="Free Users"
        value={freeUsers}
      />

      <StatCard
        icon={Ban}
        title="Blocked Users"
        value={blockedUsers}
      />

      <StatCard
        icon={Bot}
        title="AI Twins Created"
        value={twinsCreated}
      />

      <StatCard
        icon={Users}
        title="Waitlist Users"
        value={waitlistUsers.length}
      />
    </section>

    {/* Tabs */}
    <section className="rounded-3xl border border-border bg-card p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
            activeTab === "users"
              ? "brand-gradient text-white shadow-md"
              : "text-muted-foreground hover:bg-background hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Registered Users
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "users"
                ? "bg-white/20 text-white"
                : "bg-background text-muted-foreground"
            }`}
          >
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("waitlist")}
          className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
            activeTab === "waitlist"
              ? "brand-gradient text-white shadow-md"
              : "text-muted-foreground hover:bg-background hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          Waitlist Users
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "waitlist"
                ? "bg-white/20 text-white"
                : "bg-background text-muted-foreground"
            }`}
          >
            {waitlistUsers.length}
          </span>
        </button>
      </div>
    </section>

    {/* Filters */}
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 xl:max-w-md">
          <Search className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === "users"
                ? "Search name, email, phone or brand..."
                : "Search waitlist name, email, phone or brand..."
            }
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-card hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
  {activeTab === "users" && (
    <>
      <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3">
        <Filter className="h-4 w-4 text-[var(--brand-pink)]" />

        <select
          value={planFilter}
          onChange={(e) =>
            setPlanFilter(e.target.value)
          }
          className="w-full bg-transparent text-sm font-bold text-foreground outline-none"
        >
          <option>All Plans</option>
          <option>Free</option>
          <option>Pro</option>
          <option>Business</option>
        </select>
      </div>

      <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3">
        <Filter className="h-4 w-4 text-[var(--brand-pink)]" />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="w-full bg-transparent text-sm font-bold text-foreground outline-none"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Blocked</option>
        </select>
      </div>
    </>
  )}

  <button
    type="button"
    onClick={exportUsers}
    disabled={activeResult.length === 0}
    className="brand-gradient flex items-center justify-center gap-2 rounded-[5px] px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Download className="h-4 w-4" />
    Export CSV
  </button>
</div>
      </div>
    </section>

    {/* Registered Users: Desktop Table */}
{activeTab === "users" && (
  <section className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:block">
    <div className="flex items-center justify-between gap-4 border-b border-border p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-black tracking-tight brand-text">
          Registered Users
        </h2>

        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Showing {paginatedRegisteredUsers.length} of{" "}
          {registeredUsersResult.length} users.
        </p>
      </div>

      <button
        type="button"
        onClick={loadUsers}
        className="rounded-[5px] border-2 border-[var(--brand-pink)] px-4 py-2 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
      >
        Refresh
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-background">
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="p-5 font-bold">
              User Details
            </th>

            <th className="p-5 font-bold">
              Account
            </th>

            <th className="p-5 text-right font-bold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedRegisteredUsers.map((user) => {
            const userId = user._id || user.id;

            const displayName =
              user.name ||
              user.fullName ||
              user.username ||
              user.email?.split("@")[0] ||
              "Unnamed User";

            const avatar =
              user.avatarUrl ||
              user.avatar ||
              user.profilePicture ||
              "/images/default-user.png";

            const normalizedPlan =
              typeof user.plan === "string"
                ? user.plan.charAt(0).toUpperCase() +
                  user.plan.slice(1).toLowerCase()
                : "Free";

            const normalizedStatus =
              user.status ||
              (user.isBlocked
                ? "Blocked"
                : "Active");

            const twinStatus =
              user.twin ||
              (user.twinCreated ||
              user.hasTwin ||
              (Array.isArray(user.twins) &&
                user.twins.length > 0)
                ? "Created"
                : "Pending");

            const productCount =
              user.productsCount ??
              user.productCount ??
              (Array.isArray(user.products)
                ? user.products.length
                : 0);

            const liveCount =
              user.livesCount ??
              user.liveCount ??
              user.totalLives ??
              (Array.isArray(user.lives)
                ? user.lives.length
                : 0);

            const revenueValue =
              user.totalRevenue ??
              user.revenue ??
              user.salesRevenue ??
              0;

            const formattedRevenue =
              typeof revenueValue === "number"
                ? `₹${revenueValue.toLocaleString(
                    "en-IN"
                  )}`
                : revenueValue || "₹0";

            const joinedDate = user.createdAt
              ? new Date(
                  user.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : user.joined || "—";

            const lastLogin = user.lastLogin
              ? new Date(
                  user.lastLogin
                ).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Never";

            const normalizedUser = {
              ...user,
              id: userId,
              name: displayName,
              avatar,
              plan: normalizedPlan,
              status: normalizedStatus,
              twin: twinStatus,
              products: productCount,
              lives: liveCount,
              revenue: formattedRevenue,
              joined: joinedDate,
              lastLogin,
            };

            return (
              <tr
                key={userId}
                className="border-b border-border transition hover:bg-background"
              >
                {/* Column 1 */}
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={avatar}
                      alt={displayName}
                      className="h-12 w-12 rounded-2xl object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          "/images/default-user.png";
                      }}
                    />

                    <div className="min-w-0">
                      <p className="max-w-[300px] truncate text-sm font-black text-foreground">
                        {displayName}
                      </p>

                      <p className="max-w-[300px] truncate text-xs font-medium text-muted-foreground">
                        {user.email || "No email"}
                      </p>

                      <p className="mt-1 max-w-[300px] truncate text-xs font-medium text-muted-foreground">
                        {user.phone ||
                          user.mobile ||
                          user.brand ||
                          "No phone or brand"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Column 2 */}
                <td className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <PlanBadge
                      plan={normalizedPlan}
                    />

                    <StatusBadge
                      status={normalizedStatus}
                    />

                    <TwinBadge twin={twinStatus} />
                  </div>

                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Joined: {joinedDate}
                  </p>
                </td>

                {/* Column 3 */}
                <td className="p-5">
                  <div className="flex justify-end gap-2">
                    <ActionButton
                      icon={Eye}
                      color="blue"
                      title="View user"
                      onClick={() =>
                        setSelectedUser(
                          normalizedUser
                        )
                      }
                    />

                    <ActionButton
                      icon={Pencil}
                      color="pink"
                      title="Upgrade plan"
                      onClick={() =>
                        upgradePlan(userId)
                      }
                    />

                    <ActionButton
                      icon={Ban}
                      color="yellow"
                      title={
                        normalizedStatus ===
                        "Blocked"
                          ? "Unblock user"
                          : "Block user"
                      }
                      onClick={() =>
                        toggleBlock(userId)
                      }
                    />

                    <ActionButton
                      icon={Trash2}
                      color="red"
                      title="Delete user"
                      onClick={() =>
                        deleteUser(userId)
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {registeredUsersResult.length === 0 ? (
      <EmptyUsers />
    ) : (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={registeredUsersResult.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPrevious={() =>
          setCurrentPage((page) =>
            Math.max(page - 1, 1)
          )
        }
        onNext={() =>
          setCurrentPage((page) =>
            Math.min(page + 1, totalPages)
          )
        }
      />
    )}
  </section>
)}
{/* Registered Users: Mobile Cards */}
{activeTab === "users" && (
  <section className="grid gap-4 lg:hidden">
    {paginatedRegisteredUsers.map((user) => {
      const userId = user._id || user.id;

      const displayName =
        user.name ||
        user.fullName ||
        user.username ||
        user.email?.split("@")[0] ||
        "Unnamed User";

      const avatar =
        user.avatarUrl ||
        user.avatar ||
        user.profilePicture ||
        "/images/default-user.png";

      const normalizedPlan =
        typeof user.plan === "string"
          ? user.plan.charAt(0).toUpperCase() +
            user.plan.slice(1).toLowerCase()
          : "Free";

      const normalizedStatus =
        user.status || (user.isBlocked ? "Blocked" : "Active");

      const twinStatus =
        user.twin ||
        (user.twinCreated ||
        user.hasTwin ||
        (Array.isArray(user.twins) && user.twins.length > 0)
          ? "Created"
          : "Pending");

      const productCount =
        user.productsCount ??
        user.productCount ??
        (Array.isArray(user.products) ? user.products.length : 0);

      const liveCount =
        user.livesCount ??
        user.liveCount ??
        user.totalLives ??
        (Array.isArray(user.lives) ? user.lives.length : 0);

      const revenueValue =
        user.totalRevenue ??
        user.revenue ??
        user.salesRevenue ??
        0;

      const formattedRevenue =
        typeof revenueValue === "number"
          ? `₹${revenueValue.toLocaleString("en-IN")}`
          : revenueValue || "₹0";

      const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : user.joined || "—";

      const lastLogin = user.lastLogin
        ? new Date(user.lastLogin).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Never";

      const normalizedUser = {
        ...user,
        id: userId,
        name: displayName,
        avatar,
        plan: normalizedPlan,
        status: normalizedStatus,
        twin: twinStatus,
        products: productCount,
        lives: liveCount,
        revenue: formattedRevenue,
        joined: joinedDate,
        lastLogin,
      };

      return (
        <article
          key={userId}
          className="rounded-3xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <img
              src={avatar}
              alt={displayName}
              className="h-14 w-14 shrink-0 rounded-2xl object-cover"
              onError={(event) => {
                event.currentTarget.src = "/images/default-user.png";
              }}
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-black tracking-tight text-foreground">
                {displayName}
              </h3>

              <p className="truncate text-sm font-medium text-muted-foreground">
                {user.email || "No email"}
              </p>

              <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
                {user.brand ||  "No brand"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <PlanBadge plan={normalizedPlan} />
                <StatusBadge status={normalizedStatus} />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MobileInfo label="AI Twin" value={twinStatus} />
            <MobileInfo label="Products" value={productCount} />
            <MobileInfo label="Lives" value={liveCount} />
            <MobileInfo label="Revenue" value={formattedRevenue} />
            <MobileInfo label="Joined" value={joinedDate} />
            <MobileInfo label="Last Login" value={lastLogin} />
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            <MobileAction
              icon={Eye}
              title="View user"
              onClick={() => setSelectedUser(normalizedUser)}
            />

            <MobileAction
              icon={Pencil}
              title="Upgrade plan"
              onClick={() => upgradePlan(userId)}
            />

            <MobileAction
              icon={Ban}
              title={
                normalizedStatus === "Blocked"
                  ? "Unblock user"
                  : "Block user"
              }
              onClick={() => toggleBlock(userId)}
            />

            <MobileAction
              icon={Trash2}
              title="Delete user"
              danger
              onClick={() => deleteUser(userId)}
            />
          </div>
        </article>
      );
    })}



    {registeredUsersResult.length > 0 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    totalItems={registeredUsersResult.length}
    startIndex={startIndex}
    endIndex={endIndex}
    onPrevious={() =>
      setCurrentPage((page) =>
        Math.max(page - 1, 1)
      )
    }
    onNext={() =>
      setCurrentPage((page) =>
        Math.min(page + 1, totalPages)
      )
    }
  />
)}

    {registeredUsersResult.length === 0 && (
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <Users className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

        <p className="mt-3 text-lg font-black text-foreground">
          No registered users found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try another search, plan or status filter.
        </p>
      </div>
    )}
  </section>
)}

{/* Waitlist Users: Desktop Table */}
{activeTab === "waitlist" && (
  <section className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:block">
    <div className="flex items-center justify-between gap-4 border-b border-border p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-black tracking-tight brand-text">
          Waitlist Users
        </h2>

        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Showing {paginatedWaitlistUsers.length} of{" "}
          {waitlistUsersResult.length} users.
        </p>
      </div>

      <button
        type="button"
        onClick={loadWaitlist}
        className="rounded-[5px] border-2 border-[var(--brand-pink)] px-4 py-2 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
      >
        Refresh
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-background">
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="p-5 font-bold">
              User
            </th>

            <th className="p-5 font-bold">
              Contact Details
            </th>

            <th className="p-5 text-right font-bold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedWaitlistUsers.map(
            (waitlistUser) => {
              const waitlistId =
                waitlistUser._id ||
                waitlistUser.id;

              const displayName =
                waitlistUser.name ||
                waitlistUser.fullName ||
                waitlistUser.username ||
                "Unnamed User";

              const email =
                waitlistUser.email ||
                "No email";

              const phone =
                waitlistUser.phone ||
                waitlistUser.mobile ||
                waitlistUser.phoneNumber ||
                "—";

              const brand =
                waitlistUser.brand ||
                waitlistUser.brandName ||
                "—";

              const joinedDate =
                waitlistUser.createdAt
                  ? new Date(
                      waitlistUser.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : waitlistUser.joined || "—";

              const normalizedWaitlistUser = {
                ...waitlistUser,
                id: waitlistId,
                name: displayName,
                email,
                phone,
                brand,
                joined: joinedDate,
                isWaitlist: true,
              };

              return (
                <tr
                  key={waitlistId}
                  className="border-b border-border transition hover:bg-background"
                >
                  {/* Column 1 */}
                  <td className="p-5">
                    <p className="text-sm font-black text-foreground">
                      {displayName}
                    </p>

                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {brand}
                    </p>
                  </td>

                  {/* Column 2 */}
                  <td className="p-5">
                    <p className="text-sm font-medium text-foreground">
                      {email}
                    </p>

                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {phone}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Joined: {joinedDate}
                    </p>
                  </td>

                  {/* Column 3 */}
                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        icon={Eye}
                        color="blue"
                        title="View waitlist user"
                        onClick={() =>
                          setSelectedUser(
                            normalizedWaitlistUser
                          )
                        }
                      />

                      <ActionButton
                        icon={Trash2}
                        color="red"
                        title="Delete waitlist user"
                        onClick={() =>
                          deleteWaitlist(
                            waitlistId
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>

    {waitlistUsersResult.length === 0 ? (
      <div className="p-12 text-center">
        <Clock className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

        <p className="mt-3 text-lg font-black">
          No waitlist users found
        </p>
      </div>
    ) : (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={waitlistUsersResult.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPrevious={() =>
          setCurrentPage((page) =>
            Math.max(page - 1, 1)
          )
        }
        onNext={() =>
          setCurrentPage((page) =>
            Math.min(page + 1, totalPages)
          )
        }
      />
    )}
  </section>
)}


{/* Waitlist Users: Mobile Cards */}
{activeTab === "waitlist" && (
  <section className="grid gap-4 lg:hidden">
    {paginatedWaitlistUsers.map((waitlistUser) => {
      const waitlistId = waitlistUser._id || waitlistUser.id;

      const displayName =
        waitlistUser.name ||
        waitlistUser.fullName ||
        waitlistUser.username ||
        waitlistUser.email?.split("@")[0] ||
        "Unnamed User";

      const email = waitlistUser.email || "No email";

      const phone =
        waitlistUser.phone ||
        waitlistUser.mobile ||
        waitlistUser.phoneNumber ||
        "—";

      const brand =
        waitlistUser.brand ||
        waitlistUser.brandName ||
        "—";

      

      const joinedDate = waitlistUser.createdAt
        ? new Date(waitlistUser.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : waitlistUser.joined || "—";

      const normalizedWaitlistUser = {
        ...waitlistUser,
        id: waitlistId,
        name: displayName,
        email,
        phone,
        brand,
     
        joined: joinedDate,
        isWaitlist: true,
      };

      return (
        <article
          key={waitlistId}
          className="rounded-3xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <UserCheck className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-black tracking-tight text-foreground">
                {displayName}
              </h3>

              <p className="truncate text-sm font-medium text-muted-foreground">
                {email}
              </p>

              <div className="mt-3">
                <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  Waitlist
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MobileInfo label="Phone" value={phone} />
            <MobileInfo label="Brand" value={brand} />

            <MobileInfo label="Joined" value={joinedDate} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedUser(normalizedWaitlistUser)}
              className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border bg-background text-sm font-bold text-[var(--brand-pink)] transition hover:border-[var(--brand-pink)]"
            >
              <Eye className="h-4 w-4" />
              View
            </button>

            <button
              type="button"
              onClick={() => deleteWaitlist(waitlistId)}
              className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </article>
      );
    })}

    {waitlistUsersResult.length > 0 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    totalItems={waitlistUsersResult.length}
    startIndex={startIndex}
    endIndex={endIndex}
    onPrevious={() =>
      setCurrentPage((page) =>
        Math.max(page - 1, 1)
      )
    }
    onNext={() =>
      setCurrentPage((page) =>
        Math.min(page + 1, totalPages)
      )
    }
  />
)}

    {waitlistUsersResult.length === 0 && (
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <Clock className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

        <p className="mt-3 text-lg font-black text-foreground">
          No waitlist users found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term.
        </p>
      </div>
    )}
  </section>
)}


{/* User / Waitlist Details Modal */}
{selectedUser && (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {selectedUser.isWaitlist ? (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <UserCheck className="h-7 w-7" />
            </div>
          ) : (
            <img
              src={
                selectedUser.avatar ||
                selectedUser.avatarUrl ||
                selectedUser.profilePicture ||
                "/images/default-user.png"
              }
              alt={selectedUser.name || "User"}
              className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              onError={(event) => {
                event.currentTarget.src = "/images/default-user.png";
              }}
            />
          )}

          <div className="min-w-0">
            <h2 className="truncate text-2xl font-black tracking-tight brand-text">
              {selectedUser.name || "Unnamed User"}
            </h2>

            <p className="truncate text-sm font-medium text-muted-foreground">
              {selectedUser.isWaitlist
                ? "Waitlist User"
                : selectedUser.brand ||
                  
                  "Registered User"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelectedUser(null)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background transition hover:border-[var(--brand-pink)]"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {selectedUser.isWaitlist ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Detail
            icon={Mail}
            label="Email"
            value={selectedUser.email || "No email"}
          />

          <Detail
            icon={Phone}
            label="Phone"
            value={selectedUser.phone || "—"}
          />

          <Detail
            icon={Building2}
            label="Brand"
            value={selectedUser.brand || "—"}
          />

         

          <Detail
            icon={Clock}
            label="Joined Waitlist"
            value={selectedUser.joined || "—"}
          />

          <Detail
            icon={UserCheck}
            label="Status"
            value="Waitlist"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Detail
            icon={Mail}
            label="Email"
            value={selectedUser.email || "No email"}
          />

          <Detail
            icon={Phone}
            label="Phone"
            value={selectedUser.phone || "—"}
          />

          <Detail
            icon={Building2}
            label="Brand"
            value={
              selectedUser.brand ||   
              "—"
            }
          />

          <Detail
            icon={Crown}
            label="Plan"
            value={selectedUser.plan || "Free"}
          />

          <Detail
            icon={Bot}
            label="AI Twin"
            value={selectedUser.twin || "Pending"}
          />

          <Detail
            icon={Package}
            label="Products"
            value={selectedUser.products ?? 0}
          />

          <Detail
            icon={Radio}
            label="Live Sessions"
            value={selectedUser.lives ?? 0}
          />

          <Detail
            icon={IndianRupee}
            label="Revenue"
            value={selectedUser.revenue || "₹0"}
          />

          <Detail
            icon={Clock}
            label="Joined"
            value={selectedUser.joined || "—"}
          />

          <Detail
            icon={UserCheck}
            label="Last Login"
            value={selectedUser.lastLogin || "Never"}
          />

          <Detail
            icon={ShieldCheck}
            label="Account Status"
            value={selectedUser.status || "Active"}
          />

          <Detail
            icon={Mail}
            label="Email Verified"
            value={
              selectedUser.isVerified === true
                ? "Verified"
                : selectedUser.isVerified === false
                ? "Not verified"
                : "—"
            }
          />
        </div>
      )}

      <div
        className={`mt-6 grid gap-3 ${
          selectedUser.isWaitlist
            ? "sm:grid-cols-2"
            : "sm:grid-cols-3"
        }`}
      >
        {selectedUser.isWaitlist ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => deleteWaitlist(selectedUser.id)}
              className="rounded-[5px] bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Delete Waitlist User
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => upgradePlan(selectedUser.id)}
              className="brand-gradient rounded-[5px] py-3 text-sm font-bold text-white"
            >
              Upgrade Plan
            </button>

            <button
              type="button"
              onClick={() => toggleBlock(selectedUser.id)}
              className="rounded-[5px] border-2 border-orange-500 py-3 text-sm font-bold text-orange-500 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
            >
              {selectedUser.status === "Blocked"
                ? "Unblock User"
                : "Block User"}
            </button>

            <button
              type="button"
              onClick={() => deleteUser(selectedUser.id)}
              className="rounded-[5px] bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Delete User
            </button>
          </>
        )}
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
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 truncate text-3xl font-black tracking-tight brand-text">
            {value}
          </h2>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function PlanBadge({ plan = "Free" }) {
  const normalizedPlan =
    plan.charAt(0).toUpperCase() +
    plan.slice(1).toLowerCase();

  const styles = {
    Free:
      "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",

    Pro:
      "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10",

    Business:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",

    Enterprise:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[normalizedPlan] || styles.Free
      }`}
    >
      {normalizedPlan}
    </span>
  );
}

function TwinBadge({ twin = "Pending" }) {
  const created =
    twin === "Created" ||
    twin === true;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        created
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
      }`}
    >
      {created ? "Created" : "Pending"}
    </span>
  );
}

function StatusBadge({ status = "Active" }) {
  const active =
    status === "Active" ||
    status === "active";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      }`}
    >
      {active ? "Active" : "Blocked"}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  color,
  onClick,
  title,
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10",

    pink:
      "bg-pink-50 text-[var(--brand-pink)] hover:bg-pink-100 dark:bg-white/10",

    yellow:
      "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-500/10",

    red:
      "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`rounded-xl p-3 transition ${
        styles[color] || styles.blue
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function MobileInfo({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-background p-3">
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-foreground">
        {value ?? "—"}
      </p>
    </div>
  );
}

function MobileAction({
  icon: Icon,
  onClick,
  title,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`grid h-11 place-items-center rounded-[5px] border transition ${
        danger
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10"
          : "border-border bg-background text-[var(--brand-pink)] hover:border-[var(--brand-pink)]"
      }`}
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

      <p className="mt-2 break-words text-sm font-black tracking-tight text-foreground">
        {value ?? "—"}
      </p>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPrevious,
  onNext,
}) {
  const firstVisibleItem = totalItems === 0 ? 0 : startIndex + 1;
  const lastVisibleItem = Math.min(endIndex, totalItems);

  return (
    <div className="flex flex-col gap-4 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-muted-foreground">
        Showing{" "}
        <span className="font-black text-foreground">{firstVisibleItem}</span>{" "}
        to{" "}
        <span className="font-black text-foreground">{lastVisibleItem}</span>{" "}
        of{" "}
        <span className="font-black text-foreground">{totalItems}</span>{" "}
        users
      </p>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <span className="min-w-[90px] text-center text-sm font-black text-foreground">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyUsers() {
  return (
    <div className="p-12 text-center">
      <Users className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />
      <p className="mt-3 text-lg font-black">No registered users found</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try changing the search, plan or status filter.
      </p>
    </div>
  );
}
