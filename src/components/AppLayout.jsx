import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Home,
  UserRound,
  Sparkles,
  Database,
  Package,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Share2,
  Menu,
  X,
  Wifi,
  Radio,
  Bell,
  BadgeCheck,
  Crown,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const role = localStorage.getItem("role") || "user";
  const plan = (localStorage.getItem("plan") || "free").toLowerCase();
  const isPro = role !== "admin" && plan === "pro";

  const hasTwin = localStorage.getItem("hasTwin") === "true";
  const twinName = localStorage.getItem("twinName") || "My AI Twin";
  const twinImage = "/images/bbb.png";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProtectedNav = (path) => {
    if (!isPro && !hasTwin) {
      toast.warning("Please create your AI Twin first to access this section.", {
        toastId: "create-twin-warning",
      });

      navigate("/app/twin/create");
      setMobileMenu(false);
      return;
    }

    navigate(path);
    setMobileMenu(false);
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
        : "text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white"
    }`;

  const mobileClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${
      isActive ? "text-[var(--brand-pink)]" : "text-muted-foreground"
    }`;

  const proLinks = [
    { to: "/app/pro", label: "Pro Dashboard", icon: Crown, end: true },
    { to: "/app/pro/twins", label: "My AI Twins", icon: UserRound },
    { to: "/app/pro/twins/create", label: "Create Twin", icon: PlusCircle },
    { to: "/app/pro/connect", label: "Connect Social", icon: Wifi },
    { to: "/app/pro/products", label: "Products", icon: Package },
    { to: "/app/pro/golive", label: "Go Live", icon: Radio },
    { to: "/app/pro/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/app/pro/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 flex-col overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white lg:flex">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center">
            <img
              src="/images/logo.jpg"
              alt="Twinn Logo"
              className="h-13 w-13 rounded-[5px] object-cover"
            />
          </div>

          <div>
            <h1
              className="text-3xl leading-none tracking-tight"
              style={{ fontWeight: 600, fontFamily: "Poppins, sans-serif" }}
            >
              twinn
            </h1>
            <p className="mt-1 text-xs font-medium text-pink-300">
              {isPro ? "Creator Pro Dashboard" : "Never sleep. Never stop selling."}
            </p>
          </div>
        </div>

        {isPro ? (
          <div className="mt-8 rounded-3xl border border-pink-500/30 bg-white/10 p-5 backdrop-blur">
            <div className="brand-gradient mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white">
              <Crown className="h-8 w-8" />
            </div>

            <h2 className="mt-4 text-center text-xl font-black">Creator Pro</h2>

            <p className="mt-2 text-center text-sm text-white/60">
              3 AI Twins · 100 Products · 4 Platforms
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <Mini label="Twins" value="3" />
              <Mini label="Products" value="100" />
              <Mini label="Lives" value="∞" />
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            {hasTwin ? (
              <>
                <div className="rounded-3xl bg-black/20 p-3">
                  <img
                    src={twinImage}
                    alt="AI Twin"
                    className="mx-auto h-40 w-full rounded-[5px] object-contain"
                  />
                </div>

                <h2 className="mt-4 text-center text-xl font-black">
                  {twinName}
                </h2>

                <p className="mt-1 text-center text-sm font-bold text-emerald-400">
                  ● Online
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
                  <Sparkles className="h-7 w-7 text-pink-300" />
                </div>

                <p className="mt-4 text-lg font-black">No AI Twin Yet</p>
                <p className="mt-1 text-sm text-white/60">
                  Create your selling twin first.
                </p>

                <button
                  onClick={() => navigate("/app/twin/create")}
                  className="brand-gradient mt-5 w-full rounded-[5px] py-3 text-sm font-bold text-white"
                >
                  Create AI Twin
                </button>
              </div>
            )}
          </div>
        )}

        <nav className="mt-6 flex-1 space-y-1">
          {isPro ? (
            <>
              <MenuTitle title="Pro Menu" />

              {proLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={linkClass}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </>
          ) : (
            <>
              <MenuTitle title="General" />

              <NavLink to="/app" end className={linkClass}>
                <Home size={18} />
                Dashboard
              </NavLink>

              <NavLink to="/app/twin" className={linkClass}>
                <UserRound size={18} />
                My AI Twin
              </NavLink>

              <MenuTitle title="AI Management" />

              {hasTwin ? (
                <NavLink to="/app/twin/edit" className={linkClass}>
                  <Sparkles size={18} />
                  Edit AI Twin
                </NavLink>
              ) : (
                <NavLink to="/app/twin/create" className={linkClass}>
                  <Sparkles size={18} />
                  Create AI Twin
                </NavLink>
              )}

              <NavLink to="/app/twin/train" className={linkClass}>
                <Database size={18} />
                Train Twin
              </NavLink>

              <NavLink to="/app/twin/test" className={linkClass}>
                <BadgeCheck size={18} />
                Test Twin
              </NavLink>

              <MenuTitle title="Selling" />

              <NavLink to="/app/products" className={linkClass}>
                <Package size={18} />
                Products
              </NavLink>

              <NavLink to="/app/connect" className={linkClass}>
                <Wifi size={18} />
                Connect Social
              </NavLink>

              <NavLink to="/app/schedule" className={linkClass}>
                <Calendar size={18} />
                Schedule Live
              </NavLink>

              <NavLink to="/app/golive" className={linkClass}>
                <Radio size={18} />
                Go Live
              </NavLink>

              <MenuTitle title="System" />

              <NavLink to="/app/analytics" className={linkClass}>
                <BarChart3 size={18} />
                Analytics
              </NavLink>

              <NavLink to="/app/settings" className={linkClass}>
                <Settings size={18} />
                Settings
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-white transition hover:border-pink-500 hover:bg-pink-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.jpg"
            alt="Twinn Logo"
            className="h-10 w-10 rounded-[5px] object-contain"
          />

          <div>
            <h1
              className="text-xl leading-none"
              style={{ fontWeight: 600, fontFamily: "Poppins, sans-serif" }}
            >
              twinn
            </h1>
            <p className="text-[10px] text-muted-foreground">
              {isPro ? "Creator Pro Dashboard" : "Never Sleep. Never stop selling."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenu(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenu(false)}
          />

          <aside className="relative h-full w-80 max-w-[85%] overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.jpg"
                  alt="Twinn Logo"
                  className="h-11 w-11 rounded-[5px] object-contain"
                />

                <div>
                  <h1
                    className="text-2xl"
                    style={{ fontWeight: 600, fontFamily: "Poppins, sans-serif" }}
                  >
                    twinn
                  </h1>
                  <p className="text-xs text-pink-300">
                    {isPro ? "Creator Pro" : "AI Live Commerce"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenu(false)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!isPro && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4">
                <img
                  src={twinImage}
                  alt="AI Twin"
                  className="mx-auto h-32 w-full rounded-2xl object-contain"
                />
                <p className="mt-3 text-center font-black">{twinName}</p>
                <p className="text-center text-xs text-emerald-400">
                  ● {hasTwin ? "Online" : "Create Required"}
                </p>
              </div>
            )}

            {isPro && (
              <div className="mt-6 rounded-3xl border border-pink-500/30 bg-white/10 p-5 text-center">
                <Crown className="mx-auto h-10 w-10 text-pink-300" />
                <p className="mt-3 font-black">Creator Pro</p>
                <p className="text-xs text-white/60">
                  3 AI Twins · 100 Products · 4 Platforms
                </p>
              </div>
            )}

            <nav className="mt-6 space-y-2">
              {isPro ? (
                proLinks.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))
              ) : (
                <>
                  <NavLink
                    to="/app"
                    end
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <Home size={18} />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/app/twin"
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <UserRound size={18} />
                    My AI Twin
                  </NavLink>

                  {hasTwin ? (
                    <NavLink to="/app/twin/edit" className={linkClass}>
                      <Sparkles size={18} />
                      Edit AI Twin
                    </NavLink>
                  ) : (
                    <NavLink to="/app/twin/create" className={linkClass}>
                      <Sparkles size={18} />
                      Create AI Twin
                    </NavLink>
                  )}

                  <NavLink
                    to="/app/twin/train"
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <Database size={18} />
                    Train Twin
                  </NavLink>

                  <NavLink
                    to="/app/twin/test"
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <BadgeCheck size={18} />
                    Test Twin
                  </NavLink>

                  <NavLink
                    to="/app/products"
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <Package size={18} />
                    Products
                  </NavLink>

                  <SidebarButton
                    icon={Share2}
                    text="Connect Social"
                    onClick={() => handleProtectedNav("/app/connect")}
                  />

                  <SidebarButton
                    icon={Calendar}
                    text="Schedule Live"
                    onClick={() => handleProtectedNav("/app/schedule")}
                  />

                  <SidebarButton
                    icon={Radio}
                    text="Go Live"
                    onClick={() => handleProtectedNav("/app/golive")}
                  />

                  <NavLink
                    to="/app/analytics"
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <BarChart3 size={18} />
                    Analytics
                  </NavLink>

                  <NavLink
                    to="/app/settings"
                    onClick={() => setMobileMenu(false)}
                    className={linkClass}
                  >
                    <Settings size={18} />
                    Settings
                  </NavLink>
                </>
              )}
            </nav>

            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                onClick={() => {
                  setMobileMenu(false);
                  handleLogout();
                }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-white transition hover:border-pink-500 hover:bg-pink-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="min-h-screen flex-1 pt-16 pb-24 lg:ml-80 lg:pt-0 lg:pb-0">
        <header className="sticky top-0 z-30 hidden h-24 items-center justify-between border-b border-border bg-card/90 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm font-bold text-[var(--brand-pink)]">
              {isPro ? "Creator Pro Plan" : "Welcome back"}
            </p>

            <h2 className="text-3xl font-black">
              {isPro ? "Pro" : "AI Twin"}{" "}
              <span className="brand-text">Dashboard</span>
            </h2>

            <p className="text-sm text-muted-foreground">
              {isPro
                ? "Create 3 twins, train voice, connect platforms and sell live."
                : "Create, train, sell and go live."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
              <Bell className="h-5 w-5 text-[var(--brand-pink)]" />
            </button>

            <button
              onClick={() =>
                navigate(isPro ? "/app/pro/twins/create" : "/pricing")
              }
              className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
            >
              {isPro ? "Create Twin" : "Upgrade"}
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        {isPro ? (
          <div className="grid grid-cols-5 items-center gap-1">
            <NavLink to="/app/pro" end className={mobileClass}>
              <Crown size={21} />
              Pro
            </NavLink>

            <NavLink
              to="/app/pro/twins"
              className={() =>
                `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
                  location.pathname.startsWith("/app/pro/twins")
                    ? "text-[var(--brand-pink)]"
                    : "text-muted-foreground"
                }`
              }
            >
              <UserRound size={21} />
              Twins
            </NavLink>

            <NavLink to="/app/pro/products" className={mobileClass}>
              <Package size={21} />
              Products
            </NavLink>

            <NavLink to="/app/pro/golive" className={mobileClass}>
              <Radio size={24} />
              Live
            </NavLink>

            <NavLink to="/app/pro/analytics" className={mobileClass}>
              <BarChart3 size={21} />
              Analytics
            </NavLink>
          </div>
        ) : (
          <div className="grid grid-cols-5 items-center gap-1">
            <NavLink to="/app" end className={mobileClass}>
              <Home size={21} />
              Home
            </NavLink>

            <NavLink
              to="/app/twin"
              className={() =>
                `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
                  location.pathname.startsWith("/app/twin")
                    ? "text-[var(--brand-pink)]"
                    : "text-muted-foreground"
                }`
              }
            >
              <UserRound size={21} />
              Twin
            </NavLink>

            <button
              onClick={() => handleProtectedNav("/app/products")}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
                location.pathname.startsWith("/app/products")
                  ? "text-[var(--brand-pink)]"
                  : "text-muted-foreground"
              }`}
            >
              <Package size={21} />
              Products
            </button>

            <button
              onClick={() => handleProtectedNav("/app/golive")}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
                location.pathname.startsWith("/app/golive")
                  ? "text-[var(--brand-pink)]"
                  : "text-muted-foreground"
              }`}
            >
              <Radio size={24} />
              Live
            </button>

            <button
              onClick={() => handleProtectedNav("/app/schedule")}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
                location.pathname.startsWith("/app/schedule")
                  ? "text-[var(--brand-pink)]"
                  : "text-muted-foreground"
              }`}
            >
              <Calendar size={21} />
              Schedule
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}

function MenuTitle({ title }) {
  return (
    <p className="mb-2 mt-6 px-5 text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
      {title}
    </p>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <p className="text-lg font-black">{value}</p>
      <p className="text-[10px] text-white/50">{label}</p>
    </div>
  );
}

function SidebarButton({ icon: Icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold text-white/70 transition-all duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white"
    >
      <Icon size={18} />
      {text}
    </button>
  );
}