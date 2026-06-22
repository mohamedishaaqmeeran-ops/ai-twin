import { Link } from "react-router-dom";
import { useState } from "react";
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
} from "lucide-react";
import Logo from "./Logo";


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

export default function Nav() {
  const [open, setOpen] = useState(false);

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

            <Link to="/pricing" className="transition hover:text-[var(--brand-pink)]">
              Pricing
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
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
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-[5px] border border-border md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-4 space-y-4 rounded-2xl border border-border bg-background p-5 md:hidden">
            <Link to="/" className="block text-sm font-bold">Home</Link>
            <Link to="/#discover" className="block text-sm font-bold">Discover</Link>
            <Link to="/createai" className="block text-sm font-bold">Create AI Twin</Link>
            <Link to="/trainvoice" className="block text-sm font-bold">Train Your Voice</Link>
            <Link to="/add-products" className="block text-sm font-bold">Add Products</Link>
            <Link to="/go-live" className="block text-sm font-bold">Go Live</Link>
            <Link to="/pricing" className="block text-sm font-bold">Pricing</Link>
            <div className="flex flex-col gap-3 border-t border-border pt-4">
  <Link
    to="/signin"
    onClick={() => setOpen(false)}
    className="flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
  >
    Log In
  </Link>

  <Link
    to="/signup"
    onClick={() => setOpen(false)}
    className="brand-gradient flex h-11 items-center justify-center rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
  >
    Get Started
  </Link>
</div>
          </div>
        )}
      </div>
    </header>
  );
}