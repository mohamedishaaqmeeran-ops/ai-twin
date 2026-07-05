import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Bot,
  Package,
  Radio,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

import { logoutUser } from "../features/auth/authSlice";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "AI Twins", path: "/admin/twins", icon: Bot },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Live Sessions", path: "/admin/lives", icon: Radio },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileMenu, setMobileMenu] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
        : "text-white/65 hover:translate-x-1 hover:bg-white/10 hover:text-white"
    }`;

  const closeMobile = () => setMobileMenu(false);

  const logout = async () => {
    await dispatch(logoutUser());
    setMobileMenu(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white lg:flex">
        <Link to="/">
          <AdminBrand />
        </Link>

        <nav className="mt-8 flex-1 space-y-2">
          <MenuTitle title="Admin Control" />

          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/admin"}
              className={navClass}
            >
              <Icon className="h-5 w-5" />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-5">
          <button
            onClick={logout}
            className="brand-gradient flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm lg:hidden">
        <Link to="/">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[5px] bg-white">
              <img
                src="/images/logos.png"
                alt="Twin Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-lg font-black leading-tight tracking-tight">
                Admin
              </h1>
              <p className="text-[10px] font-medium text-muted-foreground">
                Never sleep.{" "}
                <span className="brand-text">Never stop selling.</span>
              </p>
            </div>
          </div>
        </Link>

        <button
          onClick={() => setMobileMenu(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={closeMobile}
          />

          <aside className="relative h-full w-80 max-w-[85%] overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={closeMobile}>
                <AdminBrand compact />
              </Link>

              <button
                onClick={closeMobile}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-black">Platform Admin</p>
                  <p className="text-xs font-medium text-white/60">
                    Full access enabled
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  end={path === "/admin"}
                  onClick={closeMobile}
                  className={navClass}
                >
                  <Icon className="h-5 w-5" />
                  {name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                onClick={logout}
                className="brand-gradient flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="min-h-screen pb-20 pt-16 lg:ml-72 lg:pb-0 lg:pt-0">
        <header className="sticky top-0 z-30 hidden h-24 items-center justify-between border-b border-border bg-card/90 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm font-bold text-[var(--brand-pink)]">
              Welcome back
            </p>

            <h2 className="text-3xl font-black tracking-tight">
              Admin <span className="brand-text">Dashboard</span>
            </h2>

            <p className="text-sm font-medium text-muted-foreground">
              Manage users, AI Twins, products, live sessions and analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-background">
              <Bell className="h-5 w-5 text-[var(--brand-pink)]" />
            </button>

            <button className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90">
              Admin
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-2 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[10px] font-bold transition ${
                  isActive
                    ? "text-[var(--brand-pink)]"
                    : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {name === "Live Sessions" ? "Live" : name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

function AdminBrand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[5px] bg-white ${
          compact ? "h-11 w-11" : "h-13 w-13"
        }`}
      >
        <img
          src="/images/logos.png"
          alt="Twin Logo"
          className="h-full w-full object-contain"
        />
      </div>

      <div>
        <h1
          className={`font-black leading-tight tracking-tight ${
            compact ? "text-xl" : "text-2xl"
          }`}
        >
          Admin
        </h1>
        <p className="text-xs font-medium text-pink-300">
          Never Sleep. Never Stop Selling
        </p>
      </div>
    </div>
  );
}

function MenuTitle({ title }) {
  return (
    <p className="mb-2 mt-4 px-5 text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
      {title}
    </p>
  );
}