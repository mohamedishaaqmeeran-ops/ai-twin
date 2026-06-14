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
  BookOpen,
  Building2,
  Heart,
  ClipboardList,
  IndianRupee,
} from "lucide-react";
import Logo from "../components/Logo";
import { useState } from "react";

import shopifyLogo from "/images/eee.png";
import wordpressLogo from "/images/ddd.png";
import woocommerceLogo from "/images/fff.png";
import klaviyoLogo from "/images/ggg.png";
import zapierLogo from "/images/hhh.png";
import stripeLogo from "/images/iii.png";

function TopBanner() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="bg-[#0d0d12] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <div className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px]">
            <Activity className="h-4 w-4" />
          </div>

          <p className="truncate text-xs font-bold tracking-wide sm:text-sm">
            Never sleep.{" "}
            <span className="brand-text font-black">Never stop selling.</span>
          </p>
        </div>

        <p className="hidden whitespace-nowrap text-xs font-medium text-gray-300 sm:block">
          24/7 AI digital self
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/waitlist"
            className="brand-gradient inline-flex items-center justify-center rounded-[5px] px-3 py-1.5 text-xs font-bold tracking-wide text-white hover:opacity-90 sm:text-sm"
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

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="shrink-0">
            <Logo />
          </div>

          <nav className="hidden items-center gap-10 text-sm font-bold tracking-wide text-foreground/80 lg:flex">
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

            <div className="group relative">
              <button className="inline-flex items-center gap-1 transition hover:text-foreground">
                Resources
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="absolute left-0 top-full z-50 hidden w-56 rounded-2xl border border-border bg-background p-2 shadow-xl group-hover:block">
                {["Documentation", "Tutorials", "Prompt Templates", "FAQ", "Blog"].map(
                  (item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase().replaceAll(" ", "-")}`}
                      className="block rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-muted"
                    >
                      {item}
                    </Link>
                  )
                )}
              </div>
            </div>
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
              Get Started Free
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
            {[
              ["Features", "#features"],
              ["How It Works", "#how"],
              ["Use Cases", "#cases"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="block text-sm font-bold tracking-wide text-foreground transition hover:text-[var(--brand-pink)]"
              >
                {label}
              </a>
            ))}

            {["Pricing", "Documentation", "Tutorials", "Prompt Templates", "FAQ", "Blog"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replaceAll(" ", "-")}`}
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
  const avatars = ["/images/1.jpeg", "/images/2.jpeg", "/images/3.jpeg", "/images/4.jpeg"];

  return (
    <section className="mx-auto grid max-w-7xl gap-14 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
      <div className="text-center lg:text-left">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          LIVE <span className="brand-text font-black">COMMERCE REVOLUTION</span>
        </span>

        <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          <span className="brand-text">Your AI Twin</span>
          <br />
          Sells for You.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-6 text-muted-foreground lg:mx-0">
          Create your AI sales twin that goes live, talks, answers questions and
          sells 24/7 while you focus on growing your brand.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            to="/signin"
            className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
          >
            Create Your AI Twin
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-pink-500 bg-card px-7 text-sm font-bold tracking-wide text-foreground transition hover:bg-pink-50 dark:hover:bg-white/10">
            <Play className="h-4 w-4 fill-foreground" />
            Watch Demo
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <div className="flex -space-x-3">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`User ${i + 1}`}
                className="h-10 w-10 rounded-full bg-pink-200 object-cover ring-2 ring-background"
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-amber-500" />
            ))}
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Trusted by <span className="font-bold text-foreground">10,000+</span>{" "}
            creators and brands
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl">
        <img
          src="/images/b1.png"
          alt="Live Shopping Dashboard"
          className="hidden w-full object-cover md:block"
        />

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
    [ScanFace, "Clone Yourself", "AI clones your face, voice & personality"],
    [Radio, "Go Live 24/7", "Your AI twin goes live anytime, anywhere"],
    [ShoppingBag, "Sell Products", "Show, explain and sell products like a pro"],
    [MessageSquare, "Engage & Convert", "Answers questions and builds trust in real-time"],
    [Globe, "Multiple Languages", "Talk to your audience in their language"],
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map(([Icon, t, d]) => (
          <div
            key={t}
            className="flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Icon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-base font-bold tracking-tight text-foreground">{t}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    [UserCircle2, "Upload & Train", "Upload your videos and voice. We train your AI twin."],
    [Tag, "Add Products", "Add your products and create your AI twin store."],
    [Radio, "Go Live", "Your AI twin goes live and starts presenting products."],
    [TrendingUp, "Generate Sales", "Engage, answer, and convert viewers into happy customers."],
  ];

  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
        How It Works
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(([Icon, t, d], i) => (
          <div
            key={t}
            className="relative flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Icon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-base font-bold tracking-tight text-foreground">{t}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{d}</p>
            </div>

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
    [UserCircle2, "Creators & Influencers", "Monetize your content and engage fans 24/7"],
    [FileText, "D2C Brands", "Boost sales by showcasing products live"],
    [BadgeCheck, "Coaches & Educators", "Teach, interact and sell courses live"],
    [Home, "Real Estate", "Show properties and close deals live"],
    [Sparkles, "Beauty & Fashion", "Recommend, try-on and sell effortlessly"],
  ];

  return (
    <section id="cases" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
        Perfect For
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map(([Icon, t, d]) => (
          <div
            key={t}
            className="flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Icon className="h-7 w-7" />
            </div>

            <p className="mt-5 text-base font-bold tracking-tight text-foreground">{t}</p>
            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">{d}</p>
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
          Integrations
        </h2>

        <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground md:text-base">
          Works seamlessly with your favorite tools and platforms
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-15 gap-y-8">
        {logos.map(([name, src]) => (
          <div key={name} className="flex h-16 items-center justify-center">
            <img
              src={src}
              alt={name}
              className="h-10 object-contain transition duration-300 hover:scale-105"
            />
          </div>
        ))}

        <span className="text-sm font-medium text-muted-foreground">and more...</span>
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
    <section className="mx-auto max-w-7xl px-4 py-10">
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
              Get Started Free
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
    [Box, "Product", ["Features", "How It Works", "Use Cases", "Pricing"]],
    [BookOpen, "Resources", ["Blog", "Help Center", "Guides", "Webinars"]],
    [Building2, "Company", ["About Us", "Careers", "Privacy Policy", "Terms of Service"]],
  ];

  return (
    <footer className="bg-[#0d0d12] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-1">
          <Logo />

          <p className="mt-5 text-sm font-medium leading-7 text-white/70">
            Never sleep. Never stop selling. Your AI twin that goes live,
            engages, and sells while you grow your brand.
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