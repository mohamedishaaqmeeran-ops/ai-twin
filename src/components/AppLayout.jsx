import { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
} from "lucide-react";

import { fetchMe, logoutUser } from "../features/auth/authSlice";

const API = "https://twinn-backend.onrender.com/api";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [twin, setTwin] = useState(null);
  const [loadingTwin, setLoadingTwin] = useState(false);

  const { user } = useSelector((state) => state.auth || {});

  const plan = user?.plan || "free";
  const isPro = plan === "pro" || plan === "business";
  const dashboardPath = isPro ? "/app/pro" : "/app";

  const hasTwin = Boolean(twin);
  const twinName = twin?.name || "My AI Twin";
  const twinImage = twin?.image || twin?.avatarImage || "/images/bbb.png";

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const loadTwin = async () => {
      try {
        setLoadingTwin(true);

        const res = await fetch(`${API}/twin/me`, {
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setTwin(null);
          return;
        }

        setTwin(data.twin || data.data || data);
      } catch {
        setTwin(null);
      } finally {
        setLoadingTwin(false);
      }
    };

    loadTwin();
  }, []);

  const handleProtectedNav = (path) => {
    if (!hasTwin) {
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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setMobileMenu(false);
    navigate("/");
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

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 flex-col overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white lg:flex">
        <Link to="/">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center">
              <img
                src="/images/logos.png"
                alt="Twin Logo"
                className="h-13 w-13 rounded-xl object-contain"
              />
            </div>

            <div>
              <h1
                className="tracking-tight text-2xl font-black"
                style={{
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                twinn<span className="brand-text">.</span>live
              </h1>

              <p className="mt-1 text-xs font-medium brand-text">
                Never sleep. Never stop selling.
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white">
          {isPro ? (
            <>
              <Crown className="h-4 w-4 text-pink-300" />
              PRO PLAN ACTIVE
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-pink-300" />
              FREE PLAN
            </>
          )}
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          {loadingTwin ? (
            <div className="py-10 text-center text-sm font-bold text-white/60">
              Loading AI Twin...
            </div>
          ) : hasTwin ? (
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

              <p className="mt-2 text-center text-xs font-black text-pink-300">
                {isPro ? "PRO AI TWIN" : "FREE AI TWIN"}
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

        <nav className="mt-6 flex-1 space-y-1">
          <MenuTitle title="General" />

          <NavLink to={dashboardPath} end className={linkClass}>
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
            {isPro ? "Advanced Training" : "Train Twin"}
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
            {isPro ? "Pro Live" : "Go Live"}
          </NavLink>

          <MenuTitle title="System" />

          <NavLink to="/app/analytics" className={linkClass}>
            <BarChart3 size={18} />
            {isPro ? "Pro Analytics" : "Analytics"}
          </NavLink>

          <NavLink to="/app/settings" className={linkClass}>
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>

        <div className="mt-6 border-t border-white/10 pt-5">
          <button
            onClick={handleLogout}
            className="brand-gradient flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Link to="/">
            <div className="flex h-10 w-10 items-center justify-center">
              <img
                src="/images/logos.png"
                alt="Twin Logo"
                className="h-10 w-10 rounded-xl object-contain"
              />
            </div>
          </Link>

          <div>
            <h1
              className="tracking-tight text-2xl font-black"
              style={{
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              twinn<span className="brand-text">.</span>live
            </h1>

            <p className="text-[10px] text-muted-foreground brand-text">
              {isPro ? "Pro Live Commerce" : "Never Sleep. Never stop selling."}
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
              <Link to="/" onClick={() => setMobileMenu(false)}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center">
                    <img
                      src="/images/logos.png"
                      alt="Twin Logo"
                      className="h-11 w-11 rounded-xl object-contain"
                    />
                  </div>

                  <div>
                    <h1
                      className="tracking-tight text-2xl font-black"
                      style={{
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      twinn<span className="brand-text">.</span>live
                    </h1>

                    <p className="text-xs text-pink-300">
                      {isPro ? "Pro AI Live Commerce" : "AI Live Commerce"}
                    </p>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => setMobileMenu(false)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black">
              {isPro ? (
                <>
                  <Crown className="h-4 w-4 text-pink-300" />
                  PRO PLAN ACTIVE
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-pink-300" />
                  FREE PLAN
                </>
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4">
              {hasTwin ? (
                <>
                  <img
                    src={twinImage}
                    alt="AI Twin"
                    className="mx-auto h-32 w-full rounded-2xl object-contain"
                  />
                  <p className="mt-3 text-center font-black">{twinName}</p>
                  <p className="text-center text-xs text-emerald-400">
                    ● Online
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
                    <Sparkles className="h-7 w-7 text-pink-300" />
                  </div>
                  <p className="mt-3 text-center font-black">No AI Twin Yet</p>
                  <p className="text-center text-xs text-pink-300">
                    Create Required
                  </p>
                </>
              )}
            </div>

            <nav className="mt-6 space-y-2">
              <NavLink
                to={dashboardPath}
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
                <NavLink
                  to="/app/twin/edit"
                  onClick={() => setMobileMenu(false)}
                  className={linkClass}
                >
                  <Sparkles size={18} />
                  Edit AI Twin
                </NavLink>
              ) : (
                <NavLink
                  to="/app/twin/create"
                  onClick={() => setMobileMenu(false)}
                  className={linkClass}
                >
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
                {isPro ? "Advanced Training" : "Train Twin"}
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
  onClick={() => navigate("/app/connect")}
/>

              <SidebarButton
                icon={Calendar}
                text="Schedule Live"
                onClick={() => handleProtectedNav("/app/schedule")}
              />

              <SidebarButton
                icon={Radio}
                text={isPro ? "Pro Live" : "Go Live"}
                onClick={() => handleProtectedNav("/app/golive")}
              />

              <NavLink
                to="/app/analytics"
                onClick={() => setMobileMenu(false)}
                className={linkClass}
              >
                <BarChart3 size={18} />
                {isPro ? "Pro Analytics" : "Analytics"}
              </NavLink>

              <NavLink
                to="/app/settings"
                onClick={() => setMobileMenu(false)}
                className={linkClass}
              >
                <Settings size={18} />
                Settings
              </NavLink>
            </nav>

            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                onClick={handleLogout}
                className="brand-gradient flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="min-h-screen flex-1 pb-24 pt-16 lg:ml-80 lg:pb-0 lg:pt-0">
        <header className="sticky top-0 z-30 hidden h-24 items-center justify-between border-b border-border bg-card/90 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm font-bold text-[var(--brand-pink)]">
              Welcome back
            </p>

            <h2 className="text-3xl font-black">
              {isPro ? "Pro AI Twin" : "AI Twin"}{" "}
              <span className="brand-text">Dashboard</span>
            </h2>

            <p className="text-sm text-muted-foreground">
              {isPro
                ? "Advanced tools, multi-platform live and Pro analytics."
                : "Create, train, sell and go live."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
              <Bell className="h-5 w-5 text-[var(--brand-pink)]" />
            </button>

            <button
              onClick={() => {
                if (!isPro) navigate("/pricing");
              }}
              className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
            >
              {isPro ? "Pro Active" : "Upgrade"}
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 items-center gap-1">
          <NavLink to={dashboardPath} end className={mobileClass}>
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