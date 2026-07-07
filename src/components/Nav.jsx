import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Menu,
  ChevronDown,
  ScanFace,
  Mic,
  ShoppingBag,
  Radio,
  Users,
  UploadCloud,
  Scissors,
  Bot,
  Store,
  Briefcase,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import Logo from "./Logo";
import { fetchMe, logoutUser } from "../features/auth/authSlice";

const discoverMenu = [
  { icon: Radio, title: "Multistreaming", desc: "Go Live Everywhere", link: "/multistreaming" },
  { icon: UploadCloud, title: "Upload and Stream", desc: "Upload Your First Video", link: "/uploadandstream" },
  { icon: Scissors, title: "Short Clips", desc: "See Your Clips", link: "/shortclips" },
  { icon: Bot, title: "AI Twins", desc: "Browse AI Twins", link: "/aitwins" },
];

const createMenu = [
  { icon: ScanFace, title: "Create AI Twin", desc: "Build your digital avatar", link: "/createai" },
  { icon: Mic, title: "Train Your Voice", desc: "Clone or select AI voice", link: "/trainvoice" },
  { icon: ShoppingBag, title: "Add Products", desc: "Upload products to sell", link: "/add-products" },
  { icon: Radio, title: "Go Live", desc: "Launch your AI live session", link: "/go-live" },
];

const solutionMenu = [
  { icon: Users, title: "For Creators and Influencers", desc: "Earn with AI selling", link: "/creators" },
  { icon: Store, title: "For Brands and Shops", desc: "Sell products with AI live", link: "/brand" },
  { icon: Briefcase, title: "For Agencies", desc: "Manage multiple brands", link: "/agency" },
];

function DesktopDropdown({ label, items }) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 transition hover:text-[var(--brand-pink)]">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      <div className="absolute left-0 top-full z-50 hidden w-[310px] rounded-3xl border border-border bg-background p-3 shadow-2xl group-hover:block">
        <div className="space-y-1">
          {items.map(({ icon: Icon, title, desc, link }) => (
            <Link
              key={title}
              to={link}
              className="flex gap-3 rounded-2xl p-3 transition hover:bg-pink-50 dark:hover:bg-white/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black tracking-tight text-foreground">
                  {title}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileSection({ label, items, closeMenu }) {
  const [sectionOpen, setSectionOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setSectionOpen(!sectionOpen)}
        className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-bold text-foreground"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition ${sectionOpen ? "rotate-180" : ""}`}
        />
      </button>

      {sectionOpen && (
        <div className="mt-2 space-y-1 rounded-2xl bg-pink-50 p-2 dark:bg-white/10">
          {items.map(({ icon: Icon, title, desc, link }) => (
            <Link
              key={title}
              to={link}
              onClick={closeMenu}
              className="flex gap-3 rounded-xl p-3 transition hover:bg-white dark:hover:bg-white/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--brand-pink)] dark:bg-black/20">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black text-foreground">{title}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const { user, loading } = useSelector((state) => state.auth || {});
  const isLoggedIn = Boolean(user);

  const userName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const dashboardPath = user?.role === "admin" ? "/admin" : "/app";

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  const closeMenu = () => setOpen(false);

const handleLogout = async () => {
  await dispatch(logoutUser()).unwrap().catch(() => {});
  setOpen(false);
  navigate("/");
};

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm font-bold tracking-wide text-foreground/80 lg:flex">
            <Link to="/" className="transition hover:text-[var(--brand-pink)]">
              Home
            </Link>

            <DesktopDropdown label="Discover" items={discoverMenu} />
            <DesktopDropdown label="Create" items={createMenu} />
            <DesktopDropdown label="Solution" items={solutionMenu} />
<Link to="/live-shop" className="transition hover:text-[var(--brand-pink)]">
              Live Shop
            </Link>
            <Link to="/pricing" className="transition hover:text-[var(--brand-pink)]">
              Pricing
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <>
               

                <Link
                  to={dashboardPath}
                  className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex h-11 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="brand-gradient flex h-11 items-center justify-center rounded-[5px] px-5 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-[5px] border border-border md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-4 rounded-2xl border border-border bg-background p-4 shadow-xl md:hidden">
           

            <div className="space-y-2">
              <Link
                to="/"
                onClick={closeMenu}
                className="block rounded-xl px-2 py-2 text-sm font-bold text-foreground"
              >
                Home
              </Link>

              <MobileSection label="Discover" items={discoverMenu} closeMenu={closeMenu} />
              <MobileSection label="Create" items={createMenu} closeMenu={closeMenu} />
              <MobileSection label="Solution" items={solutionMenu} closeMenu={closeMenu} />
<Link
                to="/live-shop"
                onClick={closeMenu}
                className="block rounded-xl px-2 py-2 text-sm font-bold text-foreground"
              >
                Live Shop
              </Link>
              <Link
                to="/pricing"
                onClick={closeMenu}
                className="block rounded-xl px-2 py-2 text-sm font-bold text-foreground"
              >
                Pricing
              </Link>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex h-11 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 disabled:opacity-60 dark:hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={closeMenu}
                    className="flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="brand-gradient flex h-11 items-center justify-center rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}