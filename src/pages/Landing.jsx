import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  X,
  Star,
  Play,
  ArrowRight,
  ScanFace,
  Radio,
  ShoppingBag,
  MessageSquare,
  Globe,
  Instagram,
  Facebook,
  Music2,
  Youtube,
  Calendar,
  LayoutTemplate,
  Megaphone,
  BarChart3,
  Tag,
  TrendingUp,
  UserCircle2,
  FileText,
  BadgeCheck,
  Home,
  Sparkles,
  ChevronDown,
  Linkedin, Mail,
  
  Phone,
  MapPin,
} from "lucide-react";
import Logo from "../components/Logo";
import { useState } from "react";
import {
  Mic,
  Video,
  Shield,
  ShoppingCart,
  Menu,
  Wifi,
  Box,
  BookOpen,
  Building2,

} from "lucide-react";

import shopifyLogo from "/images/eee.png";
import wordpressLogo from "/images/ddd.png";
import woocommerceLogo from "/images/fff.png";
import klaviyoLogo from "/images/ggg.png";
import zapierLogo from "/images/hhh.png";
import stripeLogo from "/images/iii.png";
import { Heart, ClipboardList, IndianRupee } from "lucide-react";

const stats = [
  {
    icon: Play,
    color: "text-orange-500 bg-orange-100",
    label: "Total Views",
    value: "25,430",
    change: "+32%",
  },
  {
    icon: Heart,
    color: "text-amber-500 bg-amber-100",
    label: "Engagement Rate",
    value: "12.6%",
    change: "+18%",
  },
  {
    icon: ClipboardList,
    color: "text-blue-500 bg-blue-100",
    label: "Orders",
    value: "1,245",
    change: "+22%",
  },
  {
    icon: IndianRupee,
    color: "text-green-600 bg-green-100",
    label: "Revenue",
    value: "₹9,85,000",
    change: "+35%",
  },
];


function TopBanner() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="bg-[#0d0d12] text-white">
   <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px]">
            <Activity className="h-4 w-4" />
          </div>

          <p className="text-xs sm:text-sm font-bold truncate">
            Never sleep.{" "}
            <span className="brand-text font-black">
              Never stop selling.
            </span>
          </p>
        </div>

        {/* Middle */}
        <p className="hidden sm:block text-xs text-gray-300 whitespace-nowrap">
          24/7 AI digital self
        </p>

        {/* Right Group (CTA + Close together on desktop) */}
        <div className="flex items-center gap-2 shrink-0">

        <Link
  to="/waitlist"
  className="brand-gradient rounded-[5px] px-3 py-1.5 text-xs sm:text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center"
>
  Join Waitlist
</Link>

          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

      </div>
    </div>
  );
}



function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 ">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 text-sm font-semibold text-foreground/80 lg:flex">
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>

            <a href="#how" className="transition hover:text-foreground">
              How It Works
            </a>

            <a href="#cases" className="transition hover:text-foreground">
              Use Cases
            </a>

            <Link to="/pricing" className="transition hover:text-foreground">
              Pricing
            </Link>

            {/* Resources */}
            <div className="group relative">
              <button className="inline-flex items-center gap-1 transition hover:text-foreground">
                Resources
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="absolute left-0 top-full z-50 hidden w-56 rounded-2xl border border-border bg-background p-2 shadow-xl group-hover:block">
                <Link
                  to="/docs"
                  className="block rounded-lg px-4 py-2 hover:bg-muted"
                >
                  Documentation
                </Link>

                <Link
                  to="/tutorials"
                  className="block rounded-lg px-4 py-2 hover:bg-muted"
                >
                  Tutorials
                </Link>

                <Link
                  to="/templates"
                  className="block rounded-lg px-4 py-2 hover:bg-muted"
                >
                  Prompt Templates
                </Link>

                <Link
                  to="/faq"
                  className="block rounded-lg px-4 py-2 hover:bg-muted"
                >
                  FAQ
                </Link>

                <Link
                  to="/blog"
                  className="block rounded-lg px-4 py-2 hover:bg-muted"
                >
                  Blog
                </Link>
              </div>
            </div>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/signin"
              className="flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-semibold text-[var(--brand-pink)] hover:bg-pink-50"
            >
              Log In
            </Link>

            <Link
              to="/signin"
              className="brand-gradient flex h-11 items-center justify-center rounded-[5px] px-5 text-sm font-semibold text-white shadow-md hover:opacity-90"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-4 space-y-4 rounded-2xl border border-border bg-background p-5 md:hidden">
            <a
              href="#features"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              Features
            </a>

            <a
              href="#how"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              How It Works
            </a>

            <a
              href="#cases"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              Use Cases
            </a>

            <Link
              to="/pricing"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              Pricing
            </Link>

            <Link
              to="/docs"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              Documentation
            </Link>

            <Link
              to="/tutorials"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              Tutorials
            </Link>

            <Link
              to="/templates"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              Prompt Templates
            </Link>

            <Link
              to="/faq"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              FAQ
            </Link>

            <Link
              to="/blog"
              className="block font-medium hover:text-[var(--brand-pink)]"
            >
              Blog
            </Link>

            {/* Mobile Buttons */}
            <div className="flex flex-col gap-3 pt-3">
              <Link
                to="/signin"
                className="flex h-11 items-center justify-center rounded-lg border-2 border-[var(--brand-pink)] font-semibold text-[var(--brand-pink)]"
              >
                Log In
              </Link>

              <Link
                to="/signin"
                className="brand-gradient flex h-11 items-center justify-center rounded-lg font-semibold text-white"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
     const avatars = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
];
  return (
    <section className="mx-auto grid max-w-7xl gap-14 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
      {/* Left Side */}
      <div className="text-center lg:text-left">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border-3 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          LIVE
          <span className="brand-text font-bold">
            COMMERCE REVOLUTION
          </span>
        </span>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <span className="brand-text">Your AI Twin</span>
          <br />
          Sells for You.
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-xl text-base leading-6 text-muted-foreground lg:mx-0">
          Create your AI sales twin that goes live, talks, answers questions
          and sells 24/7 while you focus on growing your brand.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            to="/app/wizard"
            className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            Create Your AI Twin
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-pink-500 bg-card px-7 text-sm font-semibold text-foreground transition hover:bg-pink-50">
            <Play className="h-4 w-4 fill-foreground" />
            Watch Demo
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
          {/* Avatars */}
       

<div className="flex -space-x-3">
  {avatars.map((src, i) => (
    <img
      key={i}
      src={src}
      alt={`User ${i + 1}`}
      className="h-10 w-10 rounded-full object-cover ring-2 ring-background bg-pink-200"
    />
  ))}
</div>

          {/* Stars */}
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-amber-500" />
            ))}
          </div>

          {/* Text */}
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by <span className="font-semibold">10,000+</span> creators
            and brands
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Desktop */}
        <img
          src="/images/b1.png"
          alt="Live Shopping Dashboard"
          className="hidden w-full object-cover md:block"
        />

        {/* Mobile */}
        <img
          src="/images/b2.png"
          alt="Live Shopping Dashboard Mobile"
          className="block w-full object-cover md:hidden"
        />
      </div>
    </section>
  );
}

function FeatureRow() {
  const items = [
    {
      Icon: ScanFace,
      t: "Clone Yourself",
      d: "AI clones your face, voice & personality",
    },
    {
      Icon: Radio,
      t: "Go Live 24/7",
      d: "Your AI twin goes live anytime, anywhere",
    },
    {
      Icon: ShoppingBag,
      t: "Sell Products",
      d: "Show, explain and sell products like a pro",
    },
    {
      Icon: MessageSquare,
      t: "Engage & Convert",
      d: "Answers questions and builds trust in real-time",
    },
    {
      Icon: Globe,
      t: "Multiple Languages",
      d: "Talk to your audience in their language",
    },
  ];

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map(({ Icon, t, d }) => (
          <div
            key={t}
            className="flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <p className="text-base font-bold text-foreground">
                {t}
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {d}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolCards() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto grid max-w-7xl auto-rows-fr grid-cols-1 gap-6 px-4 py-6 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {/* Connect Social Accounts */}
      <div className="flex h-full min-h-[430px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <p className="flex items-center gap-2 text-base font-black">
            <Wifi className="h-5 w-5 text-[var(--brand-pink)]" />
            Connect Social Accounts
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Auto-post & go live across platforms
          </p>
        </div>

        <ul className="mt-5 space-y-3">
          {[
            { Icon: Instagram, n: "Instagram", h: "@yourbrand" },
            { Icon: Facebook, n: "Facebook", h: "Your Brand" },
            { Icon: Music2, n: "TikTok", h: "@yourbrand" },
            { Icon: Youtube, n: "YouTube", h: "Your Channel" },
          ].map(({ Icon, n, h }) => (
            <li key={n} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

              <div className="min-w-0 flex-1">
                <p className="font-bold">{n}</p>
                <p className="truncate text-sm text-muted-foreground">{h}</p>
              </div>

              <button
                onClick={() => navigate("/app/connect")}
                className="shrink-0 cursor-pointer text-sm font-bold text-[var(--brand-pink)] hover:underline cursor-pointer"
              >
                Connect
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate("/")}
          className="mt-auto rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] cursor-pointer"
        >
          Manage Accounts
        </button>
      </div>

      {/* Schedule Live */}
      <div className="flex h-full min-h-[430px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <p className="flex items-center gap-2 text-base font-black">
            <Calendar className="h-5 w-5 text-[var(--brand-pink)]" />
            Schedule Live
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan your live sessions
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className="w-full rounded-[5px] border border-border px-3 py-2 text-sm"
            defaultValue="May 25, 2025"
          />
          <input
            className="w-full rounded-[5px] border border-border px-3 py-2 text-sm"
            defaultValue="07:30 PM"
          />
        </div>

        <p className="mt-5 text-sm font-bold">Repeat</p>

        <select className="mt-2 w-full rounded-[5px] border border-border px-3 py-2 text-sm">
          <option>Does not repeat</option>
        </select>

        <button
          onClick={() => navigate("/app/schedule")}
          className="brand-gradient mt-auto rounded-[5px] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Schedule Live
        </button>
      </div>

      {/* Create Web Template */}
      <div className="flex h-full min-h-[430px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <p className="flex items-center gap-2 text-base font-black">
            <LayoutTemplate className="h-5 w-5 text-[var(--brand-pink)]" />
            Create Web Template
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Launch your AI twin on your website
          </p>
        </div>

        <div className="mt-5 flex flex-1 items-center overflow-hidden rounded-2xl">
          <img
            src="/images/ccc.png"
            alt="Live Commerce Demo"
            className="w-full object-contain"
          />
        </div>

        <button
          onClick={() => navigate("/app/wizard")}
          className="brand-gradient mt-6 rounded-[5px] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Create Template
        </button>
      </div>

      {/* Run Ads */}
      <div className="flex h-full min-h-[430px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <p className="flex items-center gap-2 text-base font-black">
            <Megaphone className="h-5 w-5 text-[var(--brand-pink)]" />
            Run Ads (Meta)
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Promote your AI twin live sessions
          </p>
        </div>

        <p className="mt-5 text-sm font-bold">Platform</p>
        <select className="mt-2 w-full rounded-[5px] border border-border px-3 py-2 text-sm">
          <option>Facebook & Instagram</option>
        </select>

        <p className="mt-4 text-sm font-bold">Objective</p>
        <select className="mt-2 w-full rounded-[5px] border border-border px-3 py-2 text-sm">
          <option>Conversions</option>
        </select>

        <p className="mt-4 text-sm font-bold">Budget</p>
        <input
          defaultValue="₹1,000 / day"
          className="mt-2 w-full rounded-[5px] border border-border px-3 py-2 text-sm"
        />

        <button
          onClick={() => navigate("/")}
          className="brand-gradient mt-auto rounded-[5px] py-3 text-sm font-bold text-white cursor-pointer"
        >
          Launch Ad
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="flex h-full min-h-[430px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 md:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[var(--brand-pink)]" />
          <p className="text-base font-black">Analytics Overview</p>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Track performance in real-time
        </p>

        <div className="mt-6 flex-1 space-y-5">
          {stats.map(({ icon: Icon, color, label, value, change }) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-lg font-black">{value}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span className="text-sm font-bold text-emerald-600">
                  {change}
                </span>
                <TrendingUp className="h-4 w-4 text-pink-500" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/app/analytics")}
          className="brand-gradient mt-6 rounded-[5px] py-3 text-sm font-bold text-white cursor-pointer"
        >
          View Analytics
        </button>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      Icon: UserCircle2,
      t: "Upload & Train",
      d: "Upload your videos and voice. We train your AI twin.",
    },
    {
      Icon: Tag,
      t: "Add Products",
      d: "Add your products and create your AI twin store.",
    },
    {
      Icon: Radio,
      t: "Go Live",
      d: "Your AI twin goes live and starts presenting products.",
    },
    {
      Icon: TrendingUp,
      t: "Generate Sales",
      d: "Engage, answer, and convert viewers into happy customers.",
    },
  ];

  return (
    <section
      id="how"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Heading */}
      <h2 className="text-center text-3xl font-black brand-text md:text-4xl">
        How It Works
      </h2>

      {/* Cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(({ Icon, t, d }, i) => (
          <div
            key={t}
            className="relative flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <p className="text-base font-bold text-foreground">
                {t}
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {d}
              </p>
            </div>

            {/* Arrow */}
            {i < steps.length - 1 && (
              <ArrowRight className="absolute -right-6 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-[var(--brand-pink)] xl:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function PerfectFor() {
  const items = [
    {
      Icon: UserCircle2,
      t: "Creators & Influencers",
      d: "Monetize your content and engage fans 24/7",
    },
    {
      Icon: FileText,
      t: "D2C Brands",
      d: "Boost sales by showcasing products live",
    },
    {
      Icon: BadgeCheck,
      t: "Coaches & Educators",
      d: "Teach, interact and sell courses live",
    },
    {
      Icon: Home,
      t: "Real Estate",
      d: "Show properties and close deals live",
    },
    {
      Icon: Sparkles,
      t: "Beauty & Fashion",
      d: "Recommend, try-on and sell effortlessly",
    },
  ];

  return (
    <section
      id="cases"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Heading */}
      <h2 className="text-center text-3xl font-black brand-text md:text-4xl">
        Perfect For
      </h2>

      {/* Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map(({ Icon, t, d }) => (
          <div
            key={t}
            className="flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-7 w-7" />
            </div>

            {/* Title */}
            <p className="mt-5 text-base font-bold text-foreground">
              {t}
            </p>

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tools() {
  const logos = [
    { name: "Shopify", src: shopifyLogo },
    { name: "WordPress", src: wordpressLogo },
    { name: "WooCommerce", src: woocommerceLogo },
    { name: "Klaviyo", src: klaviyoLogo },
    { name: "Zapier", src: zapierLogo },
    { name: "Stripe", src: stripeLogo },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-black brand-text md:text-4xl">
          Integrations
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
          Works seamlessly with your favorite tools and platforms
        </p>
      </div>

      {/* Logos */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-15 gap-y-8">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="flex h-16 items-center justify-center"
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="h-10 object-contain transition duration-300 hover:scale-105"
            />
          </div>
        ))}

        <span className="text-sm font-medium text-muted-foreground">
          and more...
        </span>
      </div>
    </section>
  );
}

function SocialProof() {
 const testimonials = [
  {
    q: "This AI twin helped me double my engagement in 2 weeks!",
    a: "Ananya",
    role: "Fashion Creator",
    img: "/images/2.jpeg",
  },
  {
    q: "I started getting clients even while I was offline.",
    a: "Rahul",
    role: "Digital Marketer",
    img: "/images/1.jpeg",
  },
  {
    q: "Feels like I have a 24/7 assistant selling for me.",
    a: "Meera",
    role: "Influencer",
    img: "/images/4.jpeg",
  },
  {
    q: "My personal brand became active even when I sleep.",
    a: "Arjun",
    role: "Content Creator",
    img: "/images/3.jpeg",
  },
];

  const stats = [
    ["10K+", "Creators & Brands", "Using Twin"],
    ["1M+", "Live Sessions", "Conducted"],
    ["25M+", "Viewers", "Engaged"],
    ["₹500Cr+", "Revenue Generated", "Through Twin"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        {/* Testimonials */}
       <div className="brand-gradient rounded-2xl p-6 text-white">
  <div className="space-y-5">
    {testimonials.map((t) => (
      <div key={t.a} className="flex gap-3">
        <span className="text-3xl font-black leading-none opacity-80">
          ❝
        </span>

        <div>
          <p className="text-sm leading-relaxed">{t.q}</p>

          <div className="mt-3 flex items-center gap-3">
            <img
              src={t.img}
              alt={t.a}
              className="h-10 w-10 rounded-full object-cover border border-white/20 bg-pink-200"
            />

            <div>
              <p className="text-xs font-semibold">{t.a}</p>
              <p className="text-[10px] opacity-70">{t.role}</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Stats */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid h-full grid-cols-2">
            {stats.map(([number, line1, line2], index) => (
              <div
                key={number}
                className={`
                  flex flex-col items-center justify-center p-6 text-center
                  ${index === 0 ? "border-b border-r border-border" : ""}
                  ${index === 1 ? "border-b border-border" : ""}
                  ${index === 2 ? "border-r border-border" : ""}
                `}
              >
                <p className="text-3xl font-black brand-text">{number}</p>

                <p className="mt-2 text-xs font-bold">{line1}</p>

                <p className="text-xs text-muted-foreground">{line2}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="brand-gradient relative overflow-hidden rounded-2xl p-6 text-white">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="text-2xl font-black leading-tight">
              Ready to let your AI twin sell for you?
            </h3>

            <p className="mt-2 text-sm opacity-90">
              Create your AI twin in minutes.
              <br />
              Go live in hours.
            </p>

            <Link
              to="/signin"
              className="mt-5 md:mt-18 inline-flex items-center gap-2 rounded-[5px] bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 text-[var(--brand-pink)]" />
            </Link>
          </div>

          {/* Girl Image */}
          <img
            src="/images/girl.png"
            alt="AI Twin"
            className="absolute top-28 left-12 h-[90%] object-contain hidden xl:block"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
  [Box, "Product", ["Features", "How It Works", "Use Cases", "Pricing"]],
  [BookOpen, "Resources", ["Blog", "Help Center", "Guides", "Webinars"]],
  [
    Building2,
    "Company",
    ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
  ],
];

  return (
    <footer className="bg-[#0d0d12] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* Logo Section */}
        <div className="lg:col-span-1">
          <Logo />

          <p className="mt-5 text-sm leading-7 text-white/70">
            Never sleep. Never stop selling. Your AI twin that goes live,
            engages, and sells while you grow your brand.
          </p>

       <div className="mt-6 flex items-center gap-5">

  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <Instagram className="h-5 w-5 cursor-pointer text-white/70 transition hover:text-white" />
  </a>

  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <Facebook className="h-5 w-5 cursor-pointer text-white/70 transition hover:text-white" />
  </a>

  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
    <Youtube className="h-5 w-5 cursor-pointer text-white/70 transition hover:text-white" />
  </a>

  <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
    <Music2 className="h-5 w-5 cursor-pointer text-white/70 transition hover:text-white" />
  </a>

  <a href="https://www.linkedin.com/company/twinlive/" target="_blank" rel="noopener noreferrer">
    <Linkedin className="h-5 w-5 cursor-pointer text-white/70 transition hover:text-white" />
  </a>

</div>
        </div>

        {/* Footer Columns */}
        {cols.map(([Icon, title, items]) => (
          <div key={title}>
            <div className="mb-5 flex items-center gap-2">
              <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

              <h4 className="text-base font-bold">
                {title}
              </h4>
            </div>

            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}{/* Contact */}
<div>
  <div className="mb-5 flex items-center gap-2">
    <Mail className="h-4 w-4 text-[var(--brand-pink)]" />
    <h4 className="text-base font-bold">
      Contact
    </h4>
  </div>

  <ul className="space-y-4 text-sm text-white/70">
    <li className="flex items-center gap-3">
      <Mail className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
      hello@twinn.live
    </li>

    <li className="flex items-center gap-3">
      <Globe className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
      www.twinn.live
    </li>

    <li className="flex items-center gap-3">
      <Phone className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
      +91 84285 27015
    </li>

    <li className="flex items-center gap-3">
      <MapPin className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
      Chennai, India
    </li>
  </ul>
</div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <p className="py-5 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Twin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div>
      <TopBanner />
      <Nav />
      <Hero />
      <FeatureRow />
      <ToolCards />
      <HowItWorks />
      <PerfectFor />
      <Tools />
      <SocialProof />
      <Footer />
    </div>
  );
}
