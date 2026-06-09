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
} from "lucide-react";
import Logo from "../components/Logo";
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
  Mail,
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
  return (
    <div className="bg-[#0d0d12] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-7 px-4 py-3 text-sm">
        <span className="brand-gradient grid h-8 w-8 place-items-center rounded-[5px]">
          {" "}
          <Activity className="h-4 w-4" />{" "}
        </span>
        <span className="font-bold">
          Never sleep. <span className="brand-text font-extrabold">Never stop selling.</span>
        </span>
        <span className="font-bold text-gray-500">|</span>
        <span className="hidden text-white md:block">
          Your digital self works 24/7 <br />
          <span className="text-gray-400">so you can grow without limits.</span>
        </span>
        <button className="brand-gradient rounded-[5px] px-4 py-2 text-xs font-bold">
          Join Waitlist
        </button>
        <button aria-label="dismiss" className="text-white/60 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex flex-col">
          <Logo />
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-foreground/80 lg:flex">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#cases">Use Cases</a>

          <Link to="/pricing">Pricing</Link>

          <div className="relative group">
            <button className="inline-flex items-center gap-1">
              Resources
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-56 rounded-xl border border-border bg-background p-2 shadow-xl group-hover:block">
              <Link to="/docs" className="block rounded-lg px-4 py-2 hover:bg-muted">
                Documentation
              </Link>

              <Link to="/tutorials" className="block rounded-lg px-4 py-2 hover:bg-muted">
                Tutorials
              </Link>

              <Link to="/templates" className="block rounded-lg px-4 py-2 hover:bg-muted">
                Prompt Templates
              </Link>

              <Link to="/faq" className="block rounded-lg px-4 py-2 hover:bg-muted">
                FAQ
              </Link>

              <Link to="/blog" className="block rounded-lg px-4 py-2 hover:bg-muted">
                Blog
              </Link>
            </div>
          </div>
        </nav>
       <div className="flex flex-col gap-3 sm:flex-row">
  <Link
    to="/signin"
    className="w-full sm:w-auto flex items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 py-2 text-sm font-bold text-[var(--brand-pink)]"
  >
    Log in
  </Link>

  <Link
    to="/signin"
    className="brand-gradient w-full sm:w-auto flex items-center justify-center rounded-[5px] px-5 py-2 text-sm font-bold text-white shadow-md"
  >
    Get Started Free
  </Link>
</div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-3 py-1.5 text-xs font-bold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand-pink)]" /> LIVE{" "}
          <span className="brand-text">COMMERCE REVOLUTION</span>
        </span>
        <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
          <span className="brand-text">Your AI Twin</span>
          <br />
          Sells for You.
        </h1>
        <p className="mt-5 max-w-md ">
          Create your AI sales twin that goes live, talks, answers questions and sells 24/7 while
          you focus on growing your brand.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/app/wizard"
            className="brand-gradient glow-pink inline-flex items-center gap-2 rounded-[5px] px-6 py-3.5 font-bold text-white"
          >
            Create Your AI Twin <ArrowRight className="h-4 w-4" />
          </Link>
          <button className="inline-flex items-center gap-2 rounded-[5px] border-2 border-pink-500 bg-card px-6 py-3.5 font-bold text-foreground">
            <Play className="h-4 w-4 fill-foreground" /> Watch Demo
          </button>
        </div>
        <div className="mt-6 flex items-center gap-3">
         <div className="flex -space-x-2">
  {[1, 2, 3, 4].map((i) => (
    <img
      key={i}
      src="/images/girl.png"
      alt="User"
      className="h-8 w-8 rounded-full object-cover ring-2 ring-background bg-pink-500"
    />
  ))}
</div>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-amber-500" />
            ))}
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            Trusted by 10,000+ creators and brands
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Desktop Image */}
        <img
          src="/images/b1.png"
          alt="Live Shopping Dashboard"
          className="hidden w-full md:block"
        />

        {/* Mobile Image */}
        <img
          src="/images/b2.png"
          alt="Live Shopping Dashboard Mobile"
          className="block w-full md:hidden"
        />
      </div>
    </section>
  );
}

function FeatureRow() {
  const items = [
    { Icon: ScanFace, t: "Clone Yourself", d: "AI clones your face, voice & personality" },
    { Icon: Radio, t: "Go Live 24/7", d: "Your AI twin goes live anytime, anywhere" },
    { Icon: ShoppingBag, t: "Sell Products", d: "Show, explain and sell products like a pro" },
    {
      Icon: MessageSquare,
      t: "Engage & Convert",
      d: "Answers questions and builds trust in real-time",
    },
    { Icon: Globe, t: "Multiple Languages", d: "Talk to your audience in their language" },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.map(({ Icon, t, d }) => (
          <div
            key={t}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-extrabold">{t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
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
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-2 lg:grid-cols-5">
      {/* Connect Social Accounts */}
      <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col">
        <p className="text-sm font-extrabold">
          <Wifi className="mr-1 inline h-4 w-4 text-[var(--brand-pink)]" />
          Connect Social Accounts
        </p>

        <p className="mt-1 text-xs text-muted-foreground">Auto-post & go live across platforms</p>

        <ul className="mt-3 space-y-2 text-xs">
          {[
            { Icon: Instagram, n: "Instagram", h: "@yourbrand" },
            { Icon: Facebook, n: "Facebook", h: "Your Brand" },
            { Icon: Music2, n: "TikTok", h: "@yourbrand" },
            { Icon: Youtube, n: "YouTube", h: "Your Channel" },
          ].map(({ Icon, n, h }) => (
            <li key={n} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{n}</p>
                <p className="text-muted-foreground truncate">{h}</p>
              </div>

              <span className="text-[10px] font-semibold text-emerald-600">Connected</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate("/")}
          className="mt-auto w-full rounded-[5px] border-2 border-[var(--brand-pink)] py-1.5 text-xs font-bold text-[var(--brand-pink)] cursor-pointer"
        >
          Manage Accounts
        </button>
      </div>

      {/* Schedule Live */}
      <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col">
        <p className="text-sm font-extrabold">
          <Calendar className="mr-1 inline h-4 w-4 text-[var(--brand-pink)]" />
          Schedule Live
        </p>

        <p className="mt-1 text-xs text-muted-foreground">Plan your live sessions</p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            className="rounded-[5px] border border-border px-2 py-1.5 text-xs"
            defaultValue="May 25, 2025"
          />
          <input
            className="rounded-[5px] border border-border px-2 py-1.5 text-xs"
            defaultValue="07:30 PM"
          />
        </div>

        <p className="mt-3 text-xs font-bold">Repeat</p>

        <select className="mt-1 w-full rounded-[5px] border border-border px-2 py-1.5 text-xs">
          <option>Does not repeat</option>
        </select>

        <button
          onClick={() => navigate("/app/schedule")}
          className="brand-gradient mt-auto w-full rounded-[5px] py-2 text-xs font-bold text-white cursor-pointer"
        >
          Schedule Live
        </button>
      </div>

      {/* Create Template */}
      <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col">
        <p className="text-sm font-extrabold">
          <LayoutTemplate className="mr-1 inline h-4 w-4 text-[var(--brand-pink)]" />
          Create Web Template
        </p>

        <p className="mt-1 text-xs text-muted-foreground">Launch your AI twin on your website</p>

        <div className="mt-3 overflow-hidden rounded-[11px]">
          <img
            src="/images/ccc.png"
            alt="Live Commerce Demo"
            className="w-full h-auto rounded-[11px] object-contain"
          />
        </div>

        <button
          onClick={() => navigate("/app/wizard")}
          className="brand-gradient mt-auto w-full rounded-[5px] py-2 text-xs font-bold text-white cursor-pointer"
        >
          Create Template
        </button>
      </div>

      {/* Run Ads */}
      <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col">
        <p className="text-sm font-extrabold">
          <Megaphone className="mr-1 inline h-4 w-4 text-[var(--brand-pink)]" />
          Run Ads (Meta)
        </p>

        <p className="mt-1 text-xs text-muted-foreground">Promote your AI twin live sessions</p>

        <p className="mt-2 text-[11px] font-bold">Platform</p>
        <select className="mt-1 w-full rounded-[5px] border border-border px-2 py-1 text-xs">
          <option>Facebook & Instagram</option>
        </select>

        <p className="mt-2 text-[11px] font-bold">Objective</p>
        <select className="mt-1 w-full rounded-[5px] border border-border px-2 py-1 text-xs">
          <option>Conversions</option>
        </select>

        <p className="mt-2 text-[11px] font-bold">Budget</p>
        <input
          defaultValue="₹1,000 / day"
          className="mt-1 w-full rounded-[5px] border border-border px-2 py-1 text-xs"
        />

        <button
          onClick={() => navigate("/")}
          className="brand-gradient mt-auto w-full rounded-[5px] py-2 text-xs font-bold text-white cursor-pointer"
        >
          Launch Ad
        </button>
      </div>

      {/* Analytics */}
      <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[var(--brand-pink)]" />
          <p className="text-sm font-extrabold">Analytics Overview</p>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">Track performance in real-time</p>

        <div className="mt-5 space-y-4">
          {stats.map(({ icon: Icon, color, label, value, change }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-extrabold">{value}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-emerald-600">{change}</span>

                <TrendingUp className="h-4 w-4 text-pink-500" />
              </div>
            </div>
          ))}
        </div>
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
    <section id="how" className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-center text-3xl font-black brand-text">How It Works</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(({ Icon, t, d }, i) => (
          <div
            key={t}
            className="relative flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-6 w-6" />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="text-sm font-extrabold">{t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </div>

            {/* Arrow */}
            {i < steps.length - 1 && (
              <ArrowRight className="absolute -right-4.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-[var(--brand-pink)] xl:block" />
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
    { Icon: FileText, t: "D2C Brands", d: "Boost sales by showcasing products live" },
    { Icon: BadgeCheck, t: "Coaches & Educators", d: "Teach, interact and sell courses live" },
    { Icon: Home, t: "Real Estate", d: "Show properties and close deals live" },
    { Icon: Sparkles, t: "Beauty & Fashion", d: "Recommend, try-on and sell effortlessly" },
  ];
  return (
    <section id="cases" className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="text-center text-3xl font-black brand-text">Perfect For</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.map(({ Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-extrabold">{t}</p>
            <p className="mt-1 text-xs text-muted-foreground">{d}</p>
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
    <section className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-center text-sm font-bold text-foreground">
        Works with your favorite tools
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {logos.map((logo) => (
          <img key={logo.name} src={logo.src} alt={logo.name} className="h-10 object-contain" />
        ))}

        <span className="text-sm font-semibold text-muted-foreground">and more...</span>
      </div>
    </section>
  );
}

function SocialProof() {
  const testimonials = [
    {
      q: "My AI twin goes live every day while I focus on creating content. Sales have increased by 33%",
      a: "Aansha M., Fashion Creator",
    },
    {
      q: "Setting up was so easy. Now my AI twin handles customer questions and closes sales beautifully.",
      a: "Rohit S., D2C Brand Owner",
    },
    {
      q: "We launched our AI twin and our conversions jumped by 40% in just two weeks.",
      a: "Priya K., Skincare Brand Founder",
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
                <span className="text-3xl font-black leading-none opacity-80">❝</span>

                <div>
                  <p className="text-sm leading-relaxed">{t.q}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src="/images/girl.png"
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border border-white/20"
                    />

                    <div>
                      <p className="text-xs font-semibold">{t.a}</p>
                      <p className="text-[10px] opacity-70">Fashion Creator</p>
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
              className="mt-5 inline-flex items-center gap-2 rounded-[5px] bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 text-[var(--brand-pink)]" />
            </Link>
          </div>

          {/* Girl Image */}
          <img
            src="/images/girl.png"
            alt="AI Twin"
            className="absolute top-23 left-12 h-[90%] object-contain"
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
    [Mail, "Contact", ["hello@twin.live", "+91 123 456 7890", "Bangalore, India"]],
  ];
  return (
    <footer className="bg-[#0d0d12] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-5">
        <div>
          <Logo />
          <p className="mt-3 text-xs opacity-80">
            Never sleep. Never stop selling. Your AI twin that goes live, engages, and sells while
            you grow your brand.
          </p>
          <div className="mt-4 flex items-center gap-6">
            <Instagram className="h-5 w-5 cursor-pointer opacity-80 transition hover:opacity-100" />
            <Facebook className="h-5 w-5 cursor-pointer opacity-80 transition hover:opacity-100" />
            <Youtube className="h-5 w-5 cursor-pointer opacity-80 transition hover:opacity-100" />
            <Music2 className="h-5 w-5 cursor-pointer opacity-80 transition hover:opacity-100" />
          </div>
        </div>
        {cols.map(([Icon, title, items]) => (
          <div key={title}>
            <div className="mb-3 flex items-center gap-2">
              <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
              <h4 className="font-bold">{title}</h4>
            </div>

            <ul className="space-y-2 text-sm opacity-80">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Twin. All rights reserved.
      </p>
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
