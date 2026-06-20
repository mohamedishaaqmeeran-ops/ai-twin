// src/pages/Brands.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Users,
  Eye,
  IndianRupee,
  CheckCircle2,
  Radio,
  ShoppingBag,
  Store,
  Boxes,
  Plug,
  MessageSquareText,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import Logo from "../components/Logo";

import shopifyLogo from "/images/eee.png";
import wordpressLogo from "/images/ddd.png";
import woocommerceLogo from "/images/fff.png";
import klaviyoLogo from "/images/ggg.png";
import zapierLogo from "/images/hhh.png";
import stripeLogo from "/images/iii.png";

export default function Brands() {
  const stats = [
    { value: "10K+", label: "Creators & Brands using Twin", icon: Users },
    { value: "25M+", label: "Viewers engaged", icon: Eye },
    {
      value: "₹500Cr+",
      label: "Revenue generated through Twin",
      icon: IndianRupee,
    },
  ];

  const audience = [
    "Beauty and skincare brands wanting to demo products live, at scale.",
    "Fashion stores showcasing new arrivals, styling tips and limited offers.",
    "Small shops and D2C brands that can't staff a live-selling team.",
    "Any retailer with a product catalogue who wants a 24/7 storefront presence.",
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Demo every product, live",
      desc: "Showcase your full catalogue through realistic AI-led product demos — skincare routines, outfit try-ons, feature walkthroughs and more.",
    },
    {
      icon: Plug,
      title: "Connects to your store",
      desc: "Sync your existing storefront and sales tools — Shopify, WooCommerce, WordPress, Klaviyo, Zapier and Stripe — so live sessions plug straight into your catalogue and checkout.",
    },
    {
      icon: MessageSquareText,
      title: "Consistent brand voice, every session",
      desc: "Train your AI Twin once on your brand tone, FAQs, shipping and return policies — every live session stays on-message, every time.",
    },
    {
      icon: TrendingUp,
      title: "Scale without scaling headcount",
      desc: "Run multiple live sessions across platforms without hiring or scheduling a live-selling team.",
    },
  ];

  const steps = [
    "Create your AI Twin and choose a look that matches your brand.",
    "Upload your product catalogue and train your AI Twin on policies and FAQs.",
    "Connect your store and social platforms.",
    "Launch live sessions and track sales in real time.",
  ];

  const tools = [
    { name: "Shopify", logo: shopifyLogo },
    { name: "WordPress", logo: wordpressLogo },
    { name: "WooCommerce", logo: woocommerceLogo },
    { name: "Klaviyo", logo: klaviyoLogo },
    { name: "Zapier", logo: zapierLogo },
    { name: "Stripe", logo: stripeLogo },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />

          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="hidden h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10 sm:flex"
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
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_460px] lg:items-center lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
                FOR BRANDS & SHOPS
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                A live sales rep for your storefront —
                <br />
                <span className="brand-text">that never clocks out.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Turn your product catalogue into a live, always-on shopping
                experience. Your AI Twin demos products, answers customer
                questions and drives sales across every channel — without adding
                headcount.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Create Your AI Twin
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-7 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  See How It Works
                </a>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 dark:bg-white/10">
                <img
                  src="/images/bbb.png"
                  alt="AI Twin Brand Live Selling"
                  className="h-[520px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <span className="absolute left-4 top-4 rounded-[5px] bg-red-600 px-3 py-1 text-xs font-black text-white">
                  LIVE
                </span>

                <span className="absolute right-4 top-4 rounded-[5px] bg-black/60 px-3 py-1 text-xs font-black text-white">
                  👁 8.2K
                </span>

                <div className="absolute left-4 top-16 rounded-2xl bg-black/55 px-4 py-3 text-white backdrop-blur">
                  <p className="text-xs font-black tracking-wide">
                    AI Store Host
                  </p>
                  <p className="mt-1 text-xs font-medium leading-5 text-white/80">
                    Showing product features live
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-lg dark:bg-card">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Boxes className="h-7 w-7" />
                    </div>

                    <div className="flex-1">
                      <p className="text-base font-black tracking-tight text-foreground">
                        Live Storefront
                      </p>
                      <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                        Catalogue synced. Checkout ready.
                      </p>
                    </div>
                  </div>

                  <button className="brand-gradient mt-4 w-full rounded-[5px] py-2 text-sm font-bold tracking-wide text-white">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card py-10">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-3xl border border-border bg-background p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-3xl font-black tracking-tight brand-text">
                      {value}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
                      {label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-bold tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
                WHO THIS IS FOR
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Built for brands that want a
                <span className="brand-text"> 24/7 storefront.</span>
              </h2>

              <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                Twin helps shops and D2C brands turn products, policies and
                catalogues into always-on live sales experiences.
              </p>
            </div>

            <div className="grid gap-4">
              {audience.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Why Brands Choose <span className="brand-text">Twin</span>
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Scale live selling without adding a bigger team.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              How It <span className="brand-text">Works</span>
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-border bg-background p-5"
                >
                  <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white">
                    {index + 1}
                  </span>

                  <p className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Works With Your <span className="brand-text">Business Tools</span>
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Twin connects directly with the tools you already use to run
                your store.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex h-28 flex-col items-center justify-center rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="h-10 max-w-[120px] object-contain"
                  />

                  <p className="mt-3 text-sm font-black tracking-tight text-foreground">
                    {tool.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-[40px] p-8 text-center text-white shadow-xl sm:p-12">
            <HeartHandshake className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to let your AI Twin sell for you?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
              to="/signup"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black tracking-wide text-[var(--brand-pink)] transition hover:opacity-90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
       <footer className="border-t border-border bg-[#0d0d12]">
        <p className="px-4 py-5 text-center text-sm font-medium tracking-wide text-white/50">
          © {new Date().getFullYear()} Twinn. All rights reserved.
        </p>
      </footer>
    </div>
  );
}