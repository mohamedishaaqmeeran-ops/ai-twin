// src/pages/Blog.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  Radio,
  ShoppingBag,
  Brain,
  Instagram,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Nav from "../components/Nav";

const featuredPosts = [
  {
    title: "How AI Twins Are Changing Live Commerce",
    desc: "Learn how AI avatars can sell products, answer customer questions, and keep your brand live 24/7.",
    category: "AI Live Commerce",
    date: "June 2026",
    read: "5 min read",
    image: "/images/5.jpeg",
    icon: Sparkles,
  },
  {
    title: "How to Train Your AI Twin for Product Selling",
    desc: "A simple guide to adding product details, FAQs, scripts, offers, and objection handling for better live sales.",
    category: "Training",
    date: "June 2026",
    read: "6 min read",
    image: "/images/6.jpeg",
    icon: Brain,
  },
  {
    title: "Instagram Live Selling with an AI Twin",
    desc: "Understand how creators and brands can prepare products and connect platforms before going live.",
    category: "Social Selling",
    date: "June 2026",
    read: "4 min read",
    image: "/images/7.jpeg",
    icon: Instagram,
  },
];

const posts = [
  {
    title: "Why Live Commerce Needs Automation",
    desc: "Manual live selling takes time. AI Twins help creators stay consistent, answer faster, and sell around the clock.",
    icon: Radio,
    category: "Live Selling",
  },
  {
    title: "Product Scripts That Convert Viewers",
    desc: "What your AI Twin should say when explaining benefits, handling objections, and creating urgency.",
    icon: ShoppingBag,
    category: "Sales",
  },
  {
    title: "What to Add Before Going Live",
    desc: "Avatar, product, training data, offers, social account connection, and preview checks.",
    icon: CheckCircle2,
    category: "Checklist",
  },
  {
    title: "Understanding Live Sales Analytics",
    desc: "Track views, engagement, products sold, revenue, and customer questions after every session.",
    icon: BarChart3,
    category: "Analytics",
  },
  {
    title: "Keeping Brand Data Safe",
    desc: "How product data, account connections, and AI Twin training information should be protected.",
    icon: ShieldCheck,
    category: "Security",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              TWINN BLOG
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Ideas, guides and updates for{" "}
              <span className="brand-text">AI live selling.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Explore practical guides on AI Twins, live commerce, product
              selling, social media automation, training, analytics and creator
              growth.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight brand-text">
            Featured Articles
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <FeaturedCard key={post.title} post={post} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight brand-text">
                  Latest Posts
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                  Short reads to help you launch, train and scale your AI Twin.
                </p>
              </div>

              <Link
                to="/waitlist"
                className="inline-flex items-center gap-2 text-sm font-black text-[var(--brand-pink)] hover:underline"
              >
                Join updates <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.title} post={post} />
              ))}
            </div>
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

function FeaturedCard({ post }) {
  const Icon = post.icon;

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-pink-50 p-4 dark:bg-white/10">
        <img
          src={post.image}
          alt={post.title}
          className="h-56 w-full rounded-2xl object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/6.jpeg";
          }}
        />
      </div>

      <div className="p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-4 w-4" />
          {post.category}
        </span>

        <h3 className="mt-5 text-xl font-black tracking-tight text-foreground">
          {post.title}
        </h3>

        <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
          {post.desc}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs font-bold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-[var(--brand-pink)]" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-[var(--brand-pink)]" />
            {post.read}
          </span>
        </div>
      </div>
    </article>
  );
}

function PostCard({ post }) {
  const Icon = post.icon;

  return (
    <article className="rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-md">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wide text-[var(--brand-pink)]">
            {post.category}
          </span>

          <h3 className="mt-1 text-lg font-black tracking-tight text-foreground">
            {post.title}
          </h3>

          <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
            {post.desc}
          </p>
        </div>
      </div>
    </article>
  );
}