import { Link } from "react-router-dom";
import {
  Activity,
  X,
  Megaphone,
  Target,
  Twitter,
 MessageCircle,
  
  ShoppingCart,
  
  BadgeIndianRupee,
  CheckCircle2,
  CalendarDays,
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
import Nav from "../components/Nav";
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

<Nav/>

function Hero() {
  const avatars = ["/images/1.jpeg", "/images/2.jpeg", "/images/3.jpeg"];
  const platforms = [
  {
    name: "Instagram",
    username: "@twinnlive",
    icon: Instagram,
    color: "text-pink-500",
    href: "https://www.instagram.com/",
  },
  {
    name: "Facebook",
    username: "@twinnlive",
    icon: Facebook,
    color: "text-blue-600",
    href: "https://www.facebook.com/",
  },
  {
    name: "TikTok",
    username: "@twinnlive",
    icon: Music2,
    color: "text-black dark:text-white",
    href: "https://www.tiktok.com/",
  },
  {
    name: "YouTube",
    username: "@twinn-live",
    icon: Youtube,
    color: "text-red-600",
    href: "/sigin",
  },
   {
    name: "X",
    username: "@twinn-live",
    icon: X,
    color: "text-black-600",
    href: "/sigin",
  },
  
];

const [platform, setPlatform] = useState("Facebook & Instagram");
const [objective, setObjective] = useState("Conversions");
const [budget, setBudget] = useState("₹1,000 / day");
const [showVideo, setShowVideo] = useState(false);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_520px] lg:items-center lg:px-8">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center border-2 border-pink-500 gap-2 rounded-full bg-pink-50 px-4 py-2 text-xs font-bold tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
            <Sparkles />
            AI TWIN LIVE COMMERCE PLATFORM
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your AI Twin
            <br />
            <span className="brand-text">Live Engage Sell</span>
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

            <button
  onClick={() => setShowVideo(true)}
  className="flex h-12 items-center cursor-pointer justify-center gap-2 rounded-[5px] border border-border bg-card px-7 text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10"
>
  <Play className="h-4 w-4 fill-current" />
  Watch Demo
</button>
          </div>
{showVideo && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
    <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl">

      <button
        onClick={() => setShowVideo(false)}
        className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-black hover:bg-gray-200"
      >
        <X className="h-5 w-5" />
      </button>

      <video
        controls
        autoPlay
        className="w-full rounded-2xl"
      >
        <source src="/videos/Demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    </div>
  </div>
)}
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

       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[280px_260px] xl:grid-cols-[300px_270px] items-start justify-center">
         <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[430px] lg:max-w-[450px] xl:max-w-[480px] overflow-hidden rounded-[40px] border-[8px] border-white bg-[#0d0d12] shadow-2xl dark:border-white/10">
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

    <div className="w-full space-y-6  lg:block">
   <div className="mx-auto w-full max-w-[400px] md:max-w-[235px] rounded-[32px] border border-border bg-card p-4 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">

  <h3 className="text-xl font-black text-foreground">
    Connect Social Accounts
  </h3>

  <p className="mt-1 text-sm text-base font-medium leading-7 text-muted-foreground">
    Auto-post & go live across platforms
  </p>

  <div className="mt-6 ">

    {platforms.map((item) => {
      const Icon = item.icon;

      return (
        <div
          key={item.name}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 py-2">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-white/10">
              <Icon className={`h-6 w-6 ${item.color}`} />
            </div>

            <div>
              <h4 className="text-sm font-black text-foreground">
                {item.name}
              </h4>

              <p className="text-xs text-muted-foreground">
                {item.username}
              </p>
            </div>
          </div>

          <Link
  to="/signin"
  className="text-xs font-bold text-red-500 transition hover:text-emerald-600"
>
  Connect
</Link>
        </div>
      );
    })}
  </div>

  <a
    href="/app/connect"
    className="mt-7 flex h-12 w-full items-center justify-center rounded-xl border-2 border-pink-200 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
  >
    Manage Accounts
  </a>

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
            className="rounded-3xl border border-border text-center bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
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
  return (
    <section
      id="how"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
        How It Works
      </h2>

      <div className="mt-10 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:rounded-[32px] lg:p-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {/* STEP 1 */}
          <div className="rounded-3xl border border-border bg-background p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full brand-gradient text-lg font-black text-white sm:h-12 sm:w-12 sm:text-xl">
                1
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground sm:text-xl">
                  Create Your Avatar
                </h3>

                <div className="mt-5 space-y-3 text-sm font-medium leading-6 text-muted-foreground">
                  <StepCheck text="Upload a video" />
                  <StepCheck text="Clone your voice" />
                  <StepCheck text="Choose your style" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center rounded-2xl bg-pink-50 p-4 dark:bg-white/10">
              <img
                src="/images/bb.png"
                alt="AI Twin Avatar"
                className="h-52 object-contain sm:h-64"
              />
            </div>

            <div className="mx-auto mt-4 w-fit rounded-full border border-border bg-card px-5 py-2 shadow-sm">
              <span className="text-sm font-black text-[var(--brand-pink)]">
                ✓ Avatar Ready!
              </span>
            </div>
          </div>

          <StepArrow />

          {/* STEP 2 */}
          <div className="rounded-3xl border border-border bg-background p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full brand-gradient text-lg font-black text-white sm:h-12 sm:w-12 sm:text-xl">
                2
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground sm:text-xl">
                  Upload Products
                </h3>

                <div className="mt-5 space-y-3 text-sm font-medium leading-6 text-muted-foreground">
                  <StepCheck text="Upload products" />
                  <StepCheck text="Explain in your own words" />
                  <StepCheck text="AI learns everything" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-4">
              <ProductRow
                image="/images/6.jpeg"
                name="Vitamin C Serum"
                price="₹799"
              />

              <ProductRow
                image="/images/5.jpeg"
                name="Headphones"
                price="₹499"
              />

              <ProductRow
                image="/images/7.jpeg"
                name="Smart Watch"
                price="₹599"
              />
            </div>
          </div>

          <StepArrow />

          {/* STEP 3 */}
          <div className="rounded-3xl border border-border bg-background p-5 text-foreground sm:p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full brand-gradient text-lg font-black text-white sm:h-12 sm:w-12 sm:text-xl">
                3
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground sm:text-xl">
                  Schedule Your Live
                </h3>

                <div className="mt-5 space-y-3 text-sm font-medium leading-6 text-muted-foreground">
                  <StepCheck text="Choose platform" />
                  <StepCheck text="Pick date & time" />
                  <StepCheck text="AI Twin sells automatically" />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <p className="text-center text-base font-black text-foreground">
                Schedule Live
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Instagram className="h-5 w-5 text-pink-500" />
                <Facebook className="h-5 w-5 text-blue-600" />
                <Youtube className="h-5 w-5 text-red-500" />
                <Music2 className="h-5 w-5 text-foreground" />
              </div>

              <div className="mt-5 space-y-3 text-sm font-medium leading-6 text-muted-foreground">
                <ScheduleInfo text="May 25, 2026" />
                <ScheduleInfo text="07:30 PM" />
                <ScheduleInfo text="2 Hours" />
              </div>

              <Link
                to="/signin"
                className="brand-gradient mt-6 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white transition hover:opacity-90"
              >
                Schedule Live
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCheck({ text }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-500" />
      <span>{text}</span>
    </div>
  );
}

function ScheduleInfo({ text }) {
  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="h-4 w-4 shrink-0 text-pink-500" />
      <span>{text}</span>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <ArrowRight className="h-10 w-10 text-[var(--brand-pink)]" />
    </div>
  );
}





function MetaAds() {
  const features = [
    {
      icon: Target,
      title: "Reach the Right Audience",
      desc: "Target shoppers based on interests, behaviour and demographics across Facebook & Instagram.",
    },
    {
      icon: TrendingUp,
      title: "Boost Live Sales",
      desc: "Promote your AI Twin live sessions and convert viewers into customers with optimized campaigns.",
    },
    {
      icon: Users,
      title: "Scale Your Brand",
      desc: "Increase followers, engagement and product sales without spending hours managing ads.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left */}

          <div className="p-8 lg:p-12">

            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-black tracking-wide text-foreground">
              <Megaphone className="h-4 w-4 text-[var(--brand-pink)]" />
              META ADS
            </span>

            <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground">
              <span className="brand-text">
                Promote Your AI Twin
              </span>
              <br />
              Reach More Customers.
            </h2>

            <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-muted-foreground">
              Launch Facebook and Instagram campaigns directly from Twin.
              Drive traffic to your AI live sessions, increase product
              visibility and generate more sales with AI-powered advertising.
            </p>

            <div className="mt-8 space-y-5">

              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-black tracking-tight text-foreground">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            <Link
              to="/signup"
              className="brand-gradient mt-8 inline-flex items-center gap-2 rounded-[5px] px-6 py-3 text-sm font-black tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              Launch Your First Campaign
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          {/* Right */}

          <div className="brand-gradient flex items-center justify-center p-8">

            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50">
                  <Megaphone className="h-6 w-6 text-[var(--brand-pink)]" />
                </div>

                <div>
                  <h3 className="text-xl font-black tracking-tight text-gray-900">
                    Run Ads (Meta)
                  </h3>

                  <p className="text-sm font-medium text-gray-500">
                    Promote your AI Twin live sessions
                  </p>
                </div>

              </div>

              <div className="mt-8 space-y-5">

                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                    Platform
                  </p>

                  <div className="mt-2 rounded-xl border p-4 text-sm font-bold">
                    Facebook & Instagram
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                    Objective
                  </p>

                  <div className="mt-2 rounded-xl border p-4 text-sm font-bold">
                    Conversions
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-gray-500">
                    Daily Budget
                  </p>

                  <div className="mt-2 rounded-xl border p-4 text-sm font-black text-[var(--brand-pink)]">
                    ₹1,000 / day
                  </div>
                </div>

              </div>

              <button className="brand-gradient mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-black tracking-wide text-white">

                <Megaphone className="h-5 w-5" />

                Launch Ad

              </button>

              <div className="mt-6 space-y-2">

                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  AI Audience Targeting
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Real-time Performance Tracking
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Optimized for Live Shopping
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}






function ProductRow({ image, name, price }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-background p-3 shadow-sm sm:p-4">
      <img
        src={image}
        alt={name}
        className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
      />

      <div className="min-w-0 flex-1">
        <p className="break-words text-base font-black leading-snug tracking-tight text-foreground sm:text-lg">
          {name}
        </p>

        <p className="mt-1 text-sm font-black tracking-tight text-[var(--brand-pink)] sm:text-base">
          {price}
        </p>
      </div>
    </div>
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

      <div className="mt-12 flex flex-wrap items-center  justify-center gap-x-14 gap-y-8">
        {logos.map(([name, src]) => (
          <div key={name} className="flex h-16 items-center dark:bg-white/10 p-2 rounded-xl justify-center">
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
  const [showMore, setShowMore] = useState(false);
  const languages = [
  "English",
  "हिंदी",
  "தமிழ்",
  "తెలుగు",
  "ಕನ್ನಡ",
  "മലയാളം",
  "Español",
  "العربية",
  "বাংলা",
];
const moreLanguages = [
  "Français",
  "Deutsch",
  "Italiano",
  "Português",
  "Русский",
  "日本語",
  "한국어",
  "中文",
  "Polski",
  "Türkçe",
  "Nederlands",
  "Українська",
  "Svenska",
  "Norsk",
  "Dansk",
  "Suomi",
];
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
              to="/signup"
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
      <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
    <div className="shrink-0">
      <h3 className="text-base font-black tracking-tight brand-text">
        One Twin. All Languages.
      </h3>

      <p className="mt-1 text-xs font-medium text-muted-foreground">
        Talk to your audience in their language.
      </p>
    </div>

   <div className="flex flex-1 flex-wrap gap-3">
  {languages.map((lang) => (
    <span
      key={lang}
      className="rounded-[5px] border border-border bg-background px-5 py-2 text-xs font-bold tracking-wide text-foreground shadow-sm"
    >
      {lang}
    </span>
  ))}

  {showMore &&
    moreLanguages.map((lang) => (
      <span
        key={lang}
        className="rounded-[5px] border border-border bg-background px-5 py-2 text-xs font-bold tracking-wide text-foreground shadow-sm"
      >
        {lang}
      </span>
    ))}

  <button
    onClick={() => setShowMore(!showMore)}
    className="cursor-pointer rounded-[5px] border border-border bg-background px-5 py-2 text-xs font-black tracking-wide text-[var(--brand-pink)] shadow-sm transition hover:bg-pink-50"
  >
    {showMore ? "Show Less" : "+ 40 More"}
  </button>
</div>
  </div>
</div>
    </section>
  );
}





function FounderVision() {
  const pillars = [
    {
      icon: Play,
      title: "Live",
      desc: "Go live across platforms instantly.",
    },
    {
      icon: MessageCircle,
      title: "Engage",
      desc: "Real-time AI conversations that connect and convert.",
    },
    {
      icon: ShoppingCart,
      title: "Sell",
      desc: "Turn every interaction into revenue 24/7.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-4 lg:py-4">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:rounded-[40px]">
        <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-4">
          {/* Left */}
          <div className="order-2 lg:order-1">
            <h2 className="text-center text-3xl font-black tracking-tight brand-text sm:text-4xl lg:text-left">
              “The next billion sales conversations won't be handled by humans
              alone”
            </h2>

            <p className="mt-5  text-base font-black tracking-tight text-foreground">
              They'll be powered by{" "}
              <span className="brand-text">AI Twins</span> that can{" "}
              <span className="brand-text">live, engage, and sell</span>{" "}
              instantly.
            </p>

            <p className="mt-4  text-base font-black tracking-tight text-foreground">
              That's the future we're building at{" "}
              <span className="brand-text">twinn.live</span>.
            </p>

           <div className="mt-8 grid gap-5 sm:grid-cols-3">
  {pillars.map(({ icon: Icon, title, desc }) => (
    <div
      key={title}
      className="flex h-full min-h-[210px] w-full flex-col items-center rounded-3xl border border-border bg-card p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-7 w-7" />
      </div>

      <p className="mt-5 text-base font-black tracking-tight text-foreground">
        {title}
      </p>

      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-muted-foreground">
        {desc}
      </p>
    </div>
  ))}
</div>
          </div>

          {/* Right */}
          <div className="relative order-1 flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-background px-4 pt-12 sm:min-h-[600px] lg:order-2 lg:bg-transparent lg:px-0 lg:pt-10">
            <div className="absolute mx-auto top-8 z-20 sm:right-6 sm:top-6 lg:right-0 lg:top-18">
              <span className="text-xl lg:text-md font-black tracking-tight text-foreground text-pink-600">
                Founder's Vision
              </span>
            </div>

            <div className="absolute top-35 h-40 w-40 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-orange-400 sm:h-72 sm:w-72 lg:top-40 lg:h-70 lg:w-70" />

            <div className="relative z-10 flex justify-center">
              <div className="relative">
                <img
                  src="/images/Founder.png"
                  alt="Founder"
                  className="h-[300px] object-cover sm:h-[430px] lg:h-[400px]"
                />

                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-background dark:via-background/95" />

                <div className="absolute -bottom-8 left-1/2 h-28 w-[130%] -ranslate-x-1/2 rounded-[100%] bg-white blur-[55px] dark:bg-background" />
              </div>
            </div>

            <div className="relative z-20 -mt-2 text-center sm:-mt-4">
              <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Arunkumar S
              </h3>

              <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                Founder & CEO, Twinn.live
              </p>

              <div className="mx-auto mt-4 h-1 w-24 rounded-full brand-gradient" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}








function Footer() {
  const cols = [
    [
      Box,
      "Product",
      [
        { name: "Pricing", link: "/pricing" },
        { name: "Create Twin", link: "/signup" },
        { name: "Go Live", link: "/signin" },
        { name: "Analytics", link: "/signin" },
      ],
    ],

    [
      Building2,
      "Company",
      [
        { name: "About Us", link: "/about" },
        { name: "Blog", link: "/blog" },
        { name: "Careers", link: "/careers" },
        { name: "Team", link: "/team" },
        { name: "Conatact Us", link: "/contactus" },
      ],
    ],

    [
      Rocket,
      "Legal",
      [
        {
          name: "Terms and Conditions",
          link: "/terms-and-conditions",
        },
        {
          name: "Privacy Policy",
          link: "/privacy-policy",
        },
        {
          name: "Cookie Policy",
          link: "/cookie-policy",
        },
        {
          name: "Refund Policy",
          link: "/refund-policy",
        },
      ],
    ],
  ];

  return (
    <footer className="bg-[#0d0d12] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* Left */}
        <div className="lg:col-span-1">
          <Logo />

          <p className="mt-5 text-sm font-medium leading-7 text-white/70">
            Your AI Twin that goes live, engages customers and sells while you
            grow your business.
          </p>

          <div className="mt-6 flex items-center gap-5">
            {[
              [Instagram, "https://www.instagram.com/twinnlive?igsh=ZTJoa2w1azB4Y3dt"],
              [Facebook, "https://www.facebook.com/share/16wPoHUvA2/"],
              [Youtube, "https://youtube.com/@twinn-live?si=nHpcUbploHZBNPJf"],
              
              [Linkedin, "https://www.linkedin.com/company/twinlive/"],
            ].map(([Icon, href], index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="h-5 w-5 cursor-pointer text-white/70 transition hover:text-pink-600" />
              </a>
            ))}
          </div>
        </div>

        {/* Columns */}
        {cols.map(([Icon, title, items]) => (
          <div key={title}>
            <div className="mb-5 flex items-center gap-2">
              <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
              <h4 className="text-base font-bold tracking-tight">{title}</h4>
            </div>

            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-sm font-medium leading-6 text-white/70 transition hover:text-[var(--brand-pink)]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <div className="mb-5 flex items-center gap-2">
            <Mail className="h-4 w-4 text-[var(--brand-pink)]" />
            <h4 className="text-base font-bold tracking-tight">Contact</h4>
          </div>

          <ul className="space-y-4 text-sm font-medium leading-6 text-white/70">
            <li>
  <a
    href="https://mail.google.com/mail/?view=cm&fs=1&to=twinn.support@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 transition hover:text-[var(--brand-pink)]"
  >
    <Mail className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
    twinn.support@gmail.com
  </a>
</li>

            <li>
              <a
                href="https://twinn.live"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-[var(--brand-pink)]"
              >
                <Globe className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
                twinn.live
              </a>
            </li>

            <li>
              <a
                href="tel:+918428527015"
                className="flex items-center gap-3 transition hover:text-[var(--brand-pink)]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
                +91 84285 27015
              </a>
            </li>
 <li>
              <a
                href="tel:+447423021644"
                className="flex items-center gap-3 transition hover:text-[var(--brand-pink)]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
                +44 7423 021644
              </a>
            </li>
            <li>
              <a
                href="https://maps.google.com/?q=Chennai,India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-[var(--brand-pink)]"
              >
                <MapPin className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
                Chennai, India
              </a>
            </li>
             <li>
              <a
                href="https://maps.google.com/?q=London,UnitedKingdom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-[var(--brand-pink)]"
              >
                <MapPin className="h-4 w-4 shrink-0 text-[var(--brand-pink)]" />
                London, United Kingdom
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="py-5 text-center text-sm font-medium tracking-wide text-white/50">
          © {new Date().getFullYear()} Twinn. All rights reserved.
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
      <MetaAds />
      <PerfectFor />
      <Tools />
      <FounderVision />
      <SocialProof />
      <Footer />
    </div>
  );
}