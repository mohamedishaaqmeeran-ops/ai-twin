import { Link } from "react-router-dom";
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
  Tag,
  TrendingUp,
  UserCircle2,
  FileText,
  BadgeCheck,
  Home,
  Sparkles,
  ChevronDown,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Menu,
  Box,
  Building2,
  Heart,
  Briefcase,
  Store,
  Shirt,
  Wand2,
  Mic,
  BarChart3,
  Users,
  Flame,
  Crown,
  Rocket,
  ShoppingBasket,
  IndianRupee,
  Sparkle
} from "lucide-react";
import Logo from "../components/Logo";
import { useState } from "react";

import shopifyLogo from "/images/eee.png";
import wordpressLogo from "/images/ddd.png";
import woocommerceLogo from "/images/fff.png";
import klaviyoLogo from "/images/ggg.png";
import zapierLogo from "/images/hhh.png";
import stripeLogo from "/images/iii.png";

const exploreMenu = [
  { icon: ShoppingBag, title: "Live Shopping", desc: "Discover live product selling" },
  { icon: Users, title: "AI Creators", desc: "Explore AI-powered creators" },
  { icon: Flame, title: "Trending Lives", desc: "See what is trending now" },
  { icon: ShoppingBasket, title: "Popular Products", desc: "Products selling live" },
  { icon: Crown, title: "Success Stories", desc: "Brands growing with AI Twin" },
];

const createMenu = [
  { icon: ScanFace, title: "Create AI Twin", desc: "Build your digital avatar" },
  { icon: Mic, title: "Train Voice", desc: "Clone or select AI voice" },
  { icon: ShoppingBag, title: "Add Products", desc: "Upload products to sell" },
  { icon: Radio, title: "Go Live", desc: "Launch your AI live session" },
  { icon: BarChart3, title: "Track Analytics", desc: "Measure sales and engagement" },
];

const businessMenu = [
  { icon: Store, title: "For Shops", desc: "Sell products with AI live" },
  { icon: Shirt, title: "For Fashion Brands", desc: "Showcase styles and offers" },
  { icon: Sparkles, title: "For Beauty Brands", desc: "Demo products live" },
  { icon: Users, title: "For Influencers", desc: "Earn with AI selling" },
  { icon: Briefcase, title: "For Agencies", desc: "Manage multiple brands" },
];

function TopBanner() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="bg-[#0d0d12] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        
        {/* Left */}
        <div className="flex flex-1 items-center gap-2">
          <div className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px]">
            <Activity className="h-4 w-4" />
          </div>

          <p className="text-xs font-bold sm:text-sm">
            Never Sleep.{" "}
            <span className="brand-text font-black">
              Never Stop Selling.
            </span>
          </p>
        </div>

        {/* Center */}
        <div className="hidden flex-1 justify-center md:flex">
          <p className="text-xs font-semibold text-gray-300 sm:text-sm">
            24/7 AI Digital Self
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            to="/waitlist"
            className="brand-gradient inline-flex items-center justify-center rounded-[5px] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 sm:text-sm"
          >
            Join Waitlist
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

function DesktopDropdown({ label, items }) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 transition hover:text-[var(--brand-pink)]">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      <div className="absolute left-0 top-full z-50 hidden w-[310px] rounded-3xl border border-border bg-background p-3 shadow-2xl group-hover:block">
        <div className="space-y-1">
          {items.map(({ icon: Icon, title, desc }) => (
            <Link
              key={title}
              to="/signin"
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

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm font-bold tracking-wide text-foreground/80 lg:flex">
            <a href="#" className="transition hover:text-[var(--brand-pink)]">
              Home
            </a>

            <DesktopDropdown label="Explore" items={exploreMenu} />
            <DesktopDropdown label="Create" items={createMenu} />

            <a href="#live" className="transition hover:text-[var(--brand-pink)]">
              Live
            </a>

            <DesktopDropdown label="Business" items={businessMenu} />

            <Link
              to="/pricing"
              className="transition hover:text-[var(--brand-pink)]"
            >
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
              to="/signin"
              className="brand-gradient flex h-11 items-center justify-center rounded-[5px] px-5 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
            Get Started
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-4 space-y-4 rounded-2xl border border-border bg-background p-5 md:hidden">
            {["Home", "Explore", "Create", "Live", "Business", "Pricing"].map(
              (item) => (
                <Link
                  key={item}
                  to={item === "Pricing" ? "/pricing" : "/signin"}
                  className="block text-sm font-bold tracking-wide text-foreground transition hover:text-[var(--brand-pink)]"
                >
                  {item}
                </Link>
              )
            )}

            <div className="flex flex-col gap-3 pt-3">
              <Link
                to="/signin"
                className="flex h-11 items-center justify-center rounded-lg border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)]"
              >
                Log In
              </Link>

              <Link
                to="/signin"
                className="brand-gradient flex h-11 items-center justify-center rounded-lg text-sm font-bold tracking-wide text-white"
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

function Hero() {
  const avatars = ["/images/1.jpeg", "/images/2.jpeg", "/images/3.jpeg"];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_520px] lg:items-center lg:px-8">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center border-2 border-pink-500 gap-2 rounded-full bg-pink-50 px-4 py-2 text-xs font-bold tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
            <Sparkles />
            AI TWIN LIVE COMMERCE PLATFORM
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your AI Twin.
            <br />
            <span className="brand-text">Live. Engage. Sell.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-7 text-muted-foreground lg:mx-0">
            Create your AI Twin, go live across social platforms, engage
            customers 24/7 and grow your business like never before.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to="/signin"
              className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              Create Your AI Twin
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border border-border bg-card px-7 text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10">
              <Play className="h-4 w-4" />
              Watch Demo
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-10 w-10 rounded-full bg-pink-200 object-cover ring-2 ring-background"
                />
              ))}
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              Trusted by{" "}
              <span className="font-bold text-[var(--brand-pink)]">
                10,000+
              </span>{" "}
              creators and brands worldwide
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_190px]">
          <div className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[36px] border-[8px] border-white bg-[#0d0d12] shadow-2xl dark:border-white/10">
            <img
              src="/images/bbb.png"
              alt="Live AI Twin"
              className="h-[560px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            <div className="absolute left-4 top-4 flex gap-2">
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
                LIVE
              </span>
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white">
                👁 4.8K
              </span>
            </div>

            <div className="absolute bottom-20 left-4 right-4 space-y-2 text-white">
              {[
                "Is it good for sensitive skin?",
                "What is the best offer today?",
                "Show ingredients please",
              ].map((x) => (
                <div
                  key={x}
                  className="rounded-2xl bg-black/50 px-3 py-2 text-xs font-medium backdrop-blur"
                >
                  {x}
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-3 shadow-lg dark:bg-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-foreground">
                    Glow Boost Serum
                  </p>
                  <p className="text-xs font-black brand-text">₹799</p>
                </div>

                <button className="brand-gradient rounded-full px-4 py-2 text-xs font-bold text-white">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

     <div className="hidden space-y-6 lg:block">
  <div className="w-[240px] rounded-3xl border border-border bg-card p-5 shadow-xl">
    <h3 className="mb-5 text-xl font-black text-foreground">
      Connected Platforms
    </h3>

    <div className="space-y-4">
      {[
        [Instagram, "Instagram"],
        [Facebook, "Facebook"],
        [Youtube, "YouTube"],
        [Music2, "TikTok"],
      ].map(([Icon, name]) => (
        <div
          key={name}
          className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-foreground">
                {name}
              </p>
             
            </div>
          </div>

          <Link
            to="/app/golive"
            className="shrink-0 rounded-full border border-[var(--brand-pink)] px-3 py-2 text-center text-[11px] font-bold leading-tight text-[var(--brand-pink)] transition hover:bg-[var(--brand-pink)] hover:text-white"
          >
            Go<br />Live
          </Link>
        </div>
      ))}
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow() {
  const items = [
    [UserCircle2, "Create AI Twin", "Build your digital twin that looks, speaks and sells like you."],
    [Mic, "Train Voice", "Clone your voice or choose the perfect AI voice."],
    [ShoppingBag, "Add Products", "Upload products and let AI learn everything about them."],
    [Radio, "Go Live Anywhere", "Go live across multiple social platforms with one click."],
    [TrendingUp, "AI Engages & Sells", "AI answers, engages and converts viewers into customers."],
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
        Everything you need to sell more, live more, worry less.
      </h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map(([Icon, t, d]) => (
          <div
            key={t}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Icon className="h-7 w-7" />
            </div>

            <p className="mt-5 text-base font-black tracking-tight text-foreground">
              {t}
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
              {d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    [ScanFace, "Create AI Twin", "Create avatar, choose appearance and voice."],
    [FileText, "Train AI", "Add product details, FAQs and brand knowledge."],
    [Radio, "Launch Live", "Select platform, product and start live selling."],
    [IndianRupee, "Grow Sales", "AI engages viewers and guides them to buy."],
  ];

  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
        How It Works
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(([Icon, t, d]) => (
          <div
            key={t}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Icon className="h-6 w-6" />
            </div>

            <p className="mt-5 text-base font-black tracking-tight text-foreground">
              {t}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              {d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PerfectFor() {
  const items = [
    [Sparkles, "Beauty Brands", "Demo skincare, makeup and beauty products live."],
    [Shirt, "Fashion Stores", "Show outfits, styling and limited offers."],
    [Store, "Small Shops", "Sell products online with AI assistance."],
    [Users, "Influencers", "Turn followers into live-shopping customers."],
    [Briefcase, "Agencies", "Manage live commerce for multiple brands."],
  ];

  return (
    <section id="cases" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
        Built for Creators, Brands and Businesses
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map(([Icon, t, d]) => (
          <div
            key={t}
            className="flex h-full flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Icon className="h-7 w-7" />
            </div>

            <p className="mt-5 text-base font-black tracking-tight text-foreground">
              {t}
            </p>
            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
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
    ["Shopify", shopifyLogo],
    ["WordPress", wordpressLogo],
    ["WooCommerce", woocommerceLogo],
    ["Klaviyo", klaviyoLogo],
    ["Zapier", zapierLogo],
    ["Stripe", stripeLogo],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight brand-text md:text-4xl">
          Works with Your Business Tools
        </h2>

        <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground md:text-base">
          Connect your store, products and sales tools easily.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
        {logos.map(([name, src]) => (
          <div key={name} className="flex h-16 items-center justify-center">
            <img
              src={src}
              alt={name}
              className="h-10 object-contain transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function SocialProof() {
  const testimonials = [
    ["This AI twin helped me double my engagement in 2 weeks!", "Ananya", "Fashion Creator", "/images/2.jpeg"],
    ["I started getting clients even while I was offline.", "Rahul", "Digital Marketer", "/images/1.jpeg"],
    ["Feels like I have a 24/7 assistant selling for me.", "Meera", "Influencer", "/images/4.jpeg"],
    ["My personal brand became active even when I sleep.", "Arjun", "Content Creator", "/images/3.jpeg"],
  ];

  const stats = [
    ["10K+", "Creators & Brands", "Using Twin"],
    ["1M+", "Live Sessions", "Conducted"],
    ["25M+", "Viewers", "Engaged"],
    ["₹500Cr+", "Revenue Generated", "Through Twin"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="brand-gradient rounded-2xl p-6 text-white">
          <div className="space-y-5">
            {testimonials.map(([q, a, role, img]) => (
              <div key={a} className="flex gap-3">
                <span className="text-3xl font-black leading-none opacity-80">❝</span>

                <div>
                  <p className="text-sm font-medium leading-6">{q}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={img}
                      alt={a}
                      className="h-10 w-10 rounded-full border border-white/20 bg-pink-200 object-cover"
                    />

                    <div>
                      <p className="text-xs font-bold tracking-wide">{a}</p>
                      <p className="text-[10px] font-medium opacity-70">{role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid h-full grid-cols-2">
            {stats.map(([number, line1, line2], index) => (
              <div
                key={number}
                className={`flex flex-col items-center justify-center p-6 text-center ${
                  index === 0 ? "border-b border-r border-border" : ""
                } ${index === 1 ? "border-b border-border" : ""} ${
                  index === 2 ? "border-r border-border" : ""
                }`}
              >
                <p className="text-3xl font-black tracking-tight brand-text">{number}</p>
                <p className="mt-2 text-xs font-bold tracking-wide text-foreground">{line1}</p>
                <p className="text-xs font-medium text-muted-foreground">{line2}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="brand-gradient relative overflow-hidden rounded-2xl p-6 text-white">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="text-2xl font-black leading-tight tracking-tight">
              Ready to let your AI twin sell for you?
            </h3>

            <p className="mt-2 text-sm font-medium leading-6 opacity-90">
              Create your AI twin in minutes.
              <br />
              Go live in hours.
            </p>

            <Link
              to="/signin"
              className="mt-5 inline-flex items-center gap-2 rounded-[5px] bg-white px-5 py-2.5 text-sm font-bold tracking-wide text-gray-900 shadow md:mt-18"
            >
              Get Started
              <ArrowRight className="h-4 w-4 text-[var(--brand-pink)]" />
            </Link>
          </div>

          <img
            src="/images/girl.png"
            alt="AI Twin"
            className="absolute left-12 top-28 hidden h-[90%] object-contain xl:block"
          />
        </div>
      </div>
    </section>
  );
}
function Footer() {
  const cols = [
    [Box, "Product", ["AI Twin", "Live Shopping", "Product Training", "Analytics"]],
    [Rocket, "Explore", ["Trending Lives", "AI Creators", "Popular Products", "Success Stories"]],
    [Building2, "Business", ["For Shops", "For Brands", "For Influencers", "For Agencies"]],
  ];

  return (
    <footer className="bg-[#0d0d12] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-1">
          <Logo />

          <p className="mt-5 text-sm font-medium leading-7 text-white/70">
            Your AI Twin that goes live, engages customers and sells while you
            grow your business.
          </p>

          <div className="mt-6 flex items-center gap-5">
            {[
              [Instagram, "https://www.instagram.com"],
              [Facebook, "https://www.facebook.com"],
              [Youtube, "https://www.youtube.com"],
              [Music2, "https://www.tiktok.com"],
              [Linkedin, "https://www.linkedin.com/company/twinlive/"],
            ].map(([Icon, href], index) => (
              <a key={index} href={href} target="_blank" rel="noopener noreferrer">
                <Icon className="h-5 w-5 cursor-pointer text-white/70 transition hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {cols.map(([Icon, title, items]) => (
          <div key={title}>
            <div className="mb-5 flex items-center gap-2">
              <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
              <h4 className="text-base font-bold tracking-tight">{title}</h4>
            </div>

            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item}
                  className="text-sm font-medium leading-6 text-white/70 transition hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="mb-5 flex items-center gap-2">
            <Mail className="h-4 w-4 text-[var(--brand-pink)]" />
            <h4 className="text-base font-bold tracking-tight">Contact</h4>
          </div>

          <ul className="space-y-4 text-sm font-medium leading-6 text-white/70">
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

      <div className="border-t border-white/10">
        <p className="py-5 text-center text-sm font-medium tracking-wide text-white/50">
          © {new Date().getFullYear()} Twin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <TopBanner />
      <Nav />
      <Hero />
      <FeatureRow />
      <HowItWorks />
      <PerfectFor />
      <Tools />
      <SocialProof />
      <Footer />
    </div>
  );
}