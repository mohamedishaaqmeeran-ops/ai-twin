// src/pages/TermsCondition.jsx

import {
  ShieldCheck,
  UserCheck,
  CreditCard,
  Bot,
  Mic,
  Globe,
  Lock,
  Scale,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const sections = [
  {
    icon: UserCheck,
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using Twin, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the platform immediately.",
  },
  {
    icon: ShieldCheck,
    title: "2. Eligibility",
    content:
      "You must be at least 18 years old or have appropriate legal consent. You are responsible for maintaining accurate account information and safeguarding your login credentials.",
  },
  {
    icon: CreditCard,
    title: "3. Subscription & Billing",
    content:
      "Twin offers Starter, Creator, Business and Agency plans. Paid subscriptions renew automatically unless cancelled before the next billing cycle.",
  },
  {
    icon: Bot,
    title: "4. AI Twin Services",
    content:
      "Twin provides AI-powered avatars that interact with customers, showcase products and assist in live commerce experiences. AI-generated responses should always be reviewed by users.",
  },
  {
    icon: Mic,
    title: "5. Voice Cloning",
    content:
      "You confirm that any uploaded voice belongs to you or that you have permission to use it. Unauthorized impersonation or misuse is strictly prohibited.",
  },
  {
    icon: Globe,
    title: "6. Third-Party Integrations",
    content:
      "Twin integrates with platforms such as Instagram, Facebook, YouTube, TikTok, LinkedIn, Shopify, WooCommerce, Stripe and other services. Their respective terms also apply.",
  },
  {
    icon: Lock,
    title: "7. Data & Security",
    content:
      "We implement industry-standard security measures to protect your account and data. However, no online system can guarantee absolute security.",
  },
  {
    icon: Scale,
    title: "8. Acceptable Use",
    content:
      "Users may not use Twin for illegal activities, fraud, hate speech, impersonation, spam, copyright infringement or any harmful or abusive behavior.",
  },
  {
    icon: FileText,
    title: "9. Limitation of Liability",
    content:
      "Twin is provided 'as is'. We are not responsible for indirect damages, business losses, AI inaccuracies or interruptions caused by third-party services.",
  },
];

export default function TermsCondition() {
  return (
    <div className="min-h-screen bg-background/90 backdrop-blur text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo />

          <Link
            to="/"
            className="flex items-center gap-2 rounded-[5px] border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="brand-gradient rounded-[40px] p-6 text-white shadow-xl sm:p-10 lg:p-12">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest">
            LEGAL
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Terms & <span className="text-pink-200">Conditions</span>
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-white/80 sm:text-lg sm:leading-8">
            These Terms govern your access and use of Twin AI platform,
            services, subscriptions and live commerce experiences.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
            <span className="rounded-full bg-white/10 px-4 py-2">
              Last Updated: June 2026
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2">
              twinn.live
            </span>
          </div>
        </section>

        <section className="mt-10 grid gap-5">
          {sections.map(({ icon: Icon, title, content }) => (
            <article
              key={title}
              className="rounded-[30px] border border-border bg-card p-5 shadow-sm transition hover:border-[var(--brand-pink)] sm:p-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                    {title}
                  </h2>

                  <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground sm:text-base sm:leading-8">
                    {content}
                  </p>
                </div>
              </div>
            </article>
          ))}
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