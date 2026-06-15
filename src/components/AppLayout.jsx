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
} from "lucide-react";
import { useState } from "react";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const hasTwin = localStorage.getItem("hasTwin") === "true";
  const twinName = localStorage.getItem("twinName") || "My AI Twin";
  const twinImage =  "/images/bbb.png";

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

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
        : "text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white"
    }`;

  const mobileClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${
    isActive
      ? "text-[var(--brand-pink)]"
      : "text-muted-foreground"
  }`;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 flex-col overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-4">
         <div className="flex h-14 w-14 items-center justify-center">
  <img
    src="/images/logo.jpg"
    alt="Twin Logo"
    className="h-13 w-13 rounded-[5px] object-cover"
  />
</div>

          <div>
            <h1 className="text-3xl font-black leading-none tracking-tight">
              twin
            </h1>
            <p className="mt-1 text-xs font-medium text-pink-300">
              Never sleep. Never stop selling.
            </p>
          </div>
        </div>

        {/* Twin Card */}
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

        {/* Navigation */}
        <nav className="mt-6 flex-1 space-y-1">
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

          <NavLink
  to="/app/products"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`
  }
>
  <Package size={18} />
  Products
</NavLink>



        <NavLink
  to="/app/connect"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`
  }
>
  <Wifi size={18} />
  Connect Social
</NavLink>
<NavLink
  to="/app/schedule"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`
  }
>
  <Calendar size={18} />
  Schedule Live
</NavLink>

        <NavLink
  to="/app/golive"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`
  }
>
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
        </nav>

        {/* Logout */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-white transition hover:border-pink-500 hover:bg-pink-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
  <img
    src="/images/logo.jpg"
    alt="Twin Logo"
    className="h-10 w-10 rounded-[5px] object-contain"
  />
</div>

          <div>
            <h1 className="text-xl font-black leading-none">twin</h1>
           <p className="text-[10px] text-muted-foreground">Never Sleep. Never stop selling.</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenu(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenu(false)}
          />

          <aside className="relative h-full w-80 max-w-[85%] overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
       <div className="flex h-11 w-11 items-center justify-center">
  <img
    src="/images/logo.jpg"
    alt="Twin Logo"
    className="h-11 w-11 rounded-[5px] object-contain"
  />
</div>

                <div>
                  <h1 className="text-2xl font-black">twin</h1>
                  <p className="text-xs text-pink-300">AI Live Commerce</p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenu(false)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

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

            <nav className="mt-6 space-y-2">
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
  <NavLink
    to="/app/twin/edit"
    className={linkClass}
  >
    <Sparkles size={18} />
    Edit AI Twin
  </NavLink>
) : (
  <NavLink
    to="/app/twin/create"
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
            </nav>
            <div className="mt-8 border-t border-white/10 pt-5">
  <button
    onClick={() => {
      setMobileMenu(false);
      navigate("/");
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

      {/* Main */}
      <main className="min-h-screen flex-1 pt-16 pb-24 lg:ml-80 lg:pt-0 lg:pb-0">
        {/* Desktop Header */}
       <header className="sticky top-0 z-30 hidden h-24 items-center justify-between border-b border-border bg-card/90 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm font-bold text-[var(--brand-pink)]">
              Welcome back
            </p>

            <h2 className="text-3xl font-black">
              AI Twin <span className="brand-text">Dashboard</span>
            </h2>

            <p className="text-sm text-muted-foreground">
              Create, train, sell and go live.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
              <Bell className="h-5 w-5 text-[var(--brand-pink)]" />
            </button>

            <button className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90">
              Upgrade
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
     <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
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
          :  "text-muted-foreground"
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
          :  "text-muted-foreground"
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
          :  "text-muted-foreground"
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