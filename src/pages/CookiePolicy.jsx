// src/pages/CookiePolicy.jsx

import {
  Cookie,
  ShieldCheck,
  Gauge,
  Settings,
  BarChart3,
  Megaphone,
  Globe,
  Clock,
  SlidersHorizontal,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Nav from "../components/Nav";

const cookieTypes = [
  {
    icon: ShieldCheck,
    title: "Essential Cookies",
    points: [
      "Required for the platform to function correctly",
      "Enable login sessions and account security",
      "Cannot be disabled without affecting platform performance",
    ],
  },
  {
    icon: Gauge,
    title: "Performance Cookies",
    points: [
      "Help us understand how visitors interact with our platform",
      "Collect anonymous data on page visits, clicks and load times",
      "Used to improve platform speed and usability",
    ],
  },
  {
    icon: Settings,
    title: "Functional Cookies",
    points: [
      "Remember your preferences such as language and region",
      "Save your AI Twin settings and configurations",
      "Provide a personalised experience across sessions",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics Cookies",
    points: [
      "Track usage patterns to improve our features",
      "Provided by third-party tools such as Google Analytics",
      "Data is aggregated and anonymised",
    ],
  },
  {
    icon: Megaphone,
    title: "Marketing Cookies",
    points: [
      "Used to show relevant ads and promotions",
      "Track campaign performance across platforms",
      "You can opt out of marketing cookies at any time",
    ],
  },
];

const sections = [
  {
    icon: Cookie,
    title: "1. What Are Cookies?",
    content:
      "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, understand how you use our platform, and improve your overall experience on Twin.",
  },
  {
    icon: Globe,
    title: "3. Third-Party Cookies",
    content:
      "Some cookies on our platform are set by trusted third-party services we use, including Google Analytics, Stripe, Shopify, WooCommerce and Zapier. These third parties have their own privacy and cookie policies, which we encourage you to review.",
  },
  {
    icon: Clock,
    title: "4. How Long Do Cookies Last?",
    content:
      "Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period, typically 30 days to 1 year, or until you delete them manually.",
  },
  {
    icon: SlidersHorizontal,
    title: "5. Managing Your Cookie Preferences",
    content:
      "You can control cookies through our cookie consent banner, your browser settings or privacy browser extensions. Please note that disabling certain cookies may affect login, dashboard features, AI Twin settings and platform functionality.",
  },
  {
    icon: ShieldCheck,
    title: "6. Updates to This Policy",
    content:
      "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.",
  },
];

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                 <Nav />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="brand-gradient rounded-[40px] p-6 text-white shadow-xl sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest">
            <Cookie className="h-4 w-4" />
            COOKIE POLICY
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Cookie <span className="text-pink-200">Policy</span>
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-white/80 sm:text-lg sm:leading-8">
            This Cookie Policy explains how Twin uses cookies to remember your
            preferences, improve your experience, support account security and
            understand platform usage.
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
          {sections.slice(0, 1).map(({ icon: Icon, title, content }) => (
            <PolicyCard key={title} icon={Icon} title={title} content={content} />
          ))}
        </section>

        <section className="mt-10 rounded-[30px] border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Cookie className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black brand-text">
              2. Types of Cookies We Use
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {cookieTypes.map(({ icon: Icon, title, points }) => (
              <div
                key={title}
                className="rounded-3xl border border-border bg-background p-5 transition hover:border-[var(--brand-pink)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-black text-foreground">
                    {title}
                  </h3>
                </div>

                <ul className="mt-4 space-y-3">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm font-medium leading-6 text-muted-foreground"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--brand-pink)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5">
          {sections.slice(1).map(({ icon: Icon, title, content }) => (
            <PolicyCard key={title} icon={Icon} title={title} content={content} />
          ))}
        </section>

        
      </main>

      <footer className="border-t border-border bg-[#0d0d12]">
        <p className="px-4 py-5 text-center text-sm font-medium tracking-wide text-white/50">
          © {new Date().getFullYear()} Twinn. All rights reserved. | twinn.live
        </p>
      </footer>
    </div>
  );
}

function PolicyCard({ icon: Icon, title, content }) {
  return (
    <article className="rounded-[30px] border border-border bg-card p-5 shadow-sm transition hover:border-[var(--brand-pink)] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">
            {title}
          </h2>

          <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {content}
          </p>
        </div>
      </div>
    </article>
  );
}

function ContactCard({ icon: Icon, href, children, external }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="rounded-[20px] bg-white/10 p-5 transition hover:bg-white/20"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-pink-200" />
        {children}
      </div>
    </a>
  );
}