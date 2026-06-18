// src/pages/pro/ProDashboard.jsx

import { Link } from "react-router-dom";
import {
  Crown,
  Bot,
  Package,
  Radio,
  Mic,
  BarChart3,
  Share2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { getProTwins, getProProducts, getConnectedPlatforms } from "./proData";

export default function ProDashboard() {
  const twins = getProTwins();
  const products = getProProducts();
  const platforms = getConnectedPlatforms();

  const cards = [
    { title: "AI Twins", value: `${twins.length} / 3`, icon: Bot },
    { title: "Products", value: `${products.length} / 100`, icon: Package },
    { title: "Platforms", value: `${platforms.length} / 4`, icon: Share2 },
    { title: "AI Replies", value: "Unlimited", icon: Radio },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          PRO PLAN
        </span>

        <h1 className="mt-5 text-4xl font-black">
          Pro <span className="brand-text">Dashboard</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create up to 3 AI Twins, connect 4 platforms, manage 100 products and
          access advanced live analytics.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <h2 className="mt-2 text-3xl font-black brand-text">
                  {value}
                </h2>
              </div>

              <div className="rounded-2xl bg-pink-50 p-4 text-[var(--brand-pink)] dark:bg-white/10">
                <Icon className="h-7 w-7" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Action title="Create Twin" icon={Bot} link="/app/pro/twins/create" />
        <Action title="Train Voice" icon={Mic} link="/app/pro/twins" />
        <Action title="Products" icon={Package} link="/app/pro/products" />
        <Action title="Connect Social" icon={Share2} link="/app/pro/connect" />
        <Action title="Go Live" icon={Radio} link="/app/pro/golive" />
        <Action title="Analytics" icon={BarChart3} link="/app/pro/analytics" />
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black brand-text">Pro Features</h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            "Up to 3 AI Twins",
            "Connect up to 4 platforms",
            "Up to 100 products",
            "Custom voice cloning",
            "Advanced lip sync",
            "Unlimited AI replies",
            "Live sales analytics",
            "Remove Powered by Twin badge",
            "Email support",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[var(--brand-pink)]" />
              <span className="text-sm font-bold">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Action({ title, icon: Icon, link }) {
  return (
    <Link
      to={link}
      className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-[var(--brand-pink)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Manage your Pro feature.
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]">
        Open <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}