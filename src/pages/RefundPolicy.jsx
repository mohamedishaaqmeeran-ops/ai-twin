// src/pages/RefundPolicy.jsx

import {
  RefreshCcw,
  ShieldAlert,
  CreditCard,
  CalendarClock,
  Gift,
  ArrowUpDown,
  Ban,
  ServerCrash,
  Table2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const sections = [
  {
    icon: RefreshCcw,
    title: "1. The Short Version",
    content:
      "Starter is free, so there is nothing to refund. Monthly paid plans are non-refundable. Annual plans may be refunded on a pro-rata basis if requested within 7 days of purchase or renewal. Cancel anytime and keep access until the end of your paid period.",
  },
  {
    icon: CreditCard,
    title: "2. Plans Covered",
    content:
      "This policy covers Starter, Creator, Business and Agency plans. Agency plans may follow a separate order form or agreement. All prices are shown in Indian Rupees unless otherwise stated at checkout.",
  },
  {
    icon: Gift,
    title: "3. Free Trials",
    content:
      "Creator and Business plans include a 14-day free trial. No credit card is required to start a trial. Your subscription converts only if you actively confirm and enter payment details.",
  },
  {
    icon: CalendarClock,
    title: "4. Monthly Plans",
    content:
      "You can cancel a monthly plan anytime. Your access continues until the end of the current billing period, but partial-month refunds are not provided.",
  },
  {
    icon: RefreshCcw,
    title: "5. Annual Plans",
    content:
      "Annual plans can be cancelled anytime. If you request a refund within 7 days of purchase or renewal, you may be eligible for a pro-rata refund for unused months.",
  },
  {
    icon: ArrowUpDown,
    title: "6. Upgrades & Downgrades",
    content:
      "Upgrades take effect immediately and unused current-period value may be applied as credit. Downgrades take effect at the next billing cycle and no current-period refund is issued.",
  },
  {
    icon: Ban,
    title: "7. Non-Refundable Items",
    content:
      "Monthly subscription fees, annual fees requested after the 7-day window, add-ons, one-time purchases, custom Agency fees and suspended account periods are non-refundable unless stated otherwise in writing.",
  },
  {
    icon: ServerCrash,
    title: "8. Service Failures",
    content:
      "If Twin has a significant unplanned outage, refunds or credits may be considered case by case. Third-party platform outages and your own internet issues are outside our control.",
  },
];

const scenarios = [
  ["Free trial expired / not converted", "Yes", "No charge was made."],
  ["Monthly plan — cancel mid-month", "No", "Access continues until period ends."],
  ["Annual plan — cancel within 7 days", "Yes", "Pro-rata refund for unused months."],
  ["Annual plan — cancel after 7 days", "No", "Access continues until annual period ends."],
  ["Upgrade Creator → Business", "Credit", "Unused value may be applied as credit."],
  ["Downgrade Business → Creator", "No", "Downgrade applies next billing cycle."],
  ["Account suspended for ToS violation", "No", "Suspended periods are non-refundable."],
  ["Verified service outage by Twin", "Case-by-case", "Contact within 14 days."],
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border bg-card">
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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest">
            <RefreshCcw className="h-4 w-4" />
            REFUND POLICY
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Refund & <span className="text-pink-200">Cancellation Policy</span>
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-white/80 sm:text-lg sm:leading-8">
            This policy explains refunds, cancellations, free trials, annual
            plan refund windows and service-failure requests for Twin.
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

        <section className="mt-10 rounded-3xl border border-orange-300 bg-orange-50 p-5 shadow-sm dark:border-orange-500/30 dark:bg-orange-500/10 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/10">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-orange-700 dark:text-orange-300">
                Draft for Legal Review
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-orange-700/80 dark:text-orange-200/80 sm:text-base">
                This page is a policy draft for internal review and is not legal
                advice. It should be reviewed by qualified legal counsel before
                publication.
              </p>
            </div>
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

        <section className="mt-10 rounded-[30px] border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Table2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black brand-text">
              Refund Eligibility Quick Reference
            </h2>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 font-black">Scenario</th>
                  <th className="py-4 font-black">Refund Eligible?</th>
                  <th className="py-4 font-black">Notes</th>
                </tr>
              </thead>

              <tbody>
                {scenarios.map(([scenario, eligible, notes]) => (
                  <tr key={scenario} className="border-b border-border">
                    <td className="py-4 font-bold">{scenario}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${
                          eligible === "Yes"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                            : eligible === "No"
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10"
                            : "bg-orange-50 text-orange-600 dark:bg-orange-500/10"
                        }`}
                      >
                        {eligible === "Yes" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : eligible === "No" ? (
                          <XCircle className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {eligible}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-[30px] border border-border bg-card p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black brand-text">
            How to Request a Refund
          </h2>

          <ol className="mt-5 space-y-4 text-sm font-medium leading-7 text-muted-foreground sm:text-base">
            <li>
              <strong className="text-foreground">1.</strong> Email{" "}
              <a
                href="mailto:hello@twinn.live"
                className="font-bold text-[var(--brand-pink)] hover:underline"
              >
                hello@twinn.live
              </a>{" "}
              with the subject line: “Refund Request — [your account email]”.
            </li>
            <li>
              <strong className="text-foreground">2.</strong> Include your
              registered email, plan, purchase or renewal date and reason.
            </li>
            <li>
              <strong className="text-foreground">3.</strong> We aim to
              acknowledge requests within 2 business days.
            </li>
            <li>
              <strong className="text-foreground">4.</strong> Eligible refunds
              are usually processed within 7–10 business days depending on your
              bank or payment provider.
            </li>
          </ol>
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