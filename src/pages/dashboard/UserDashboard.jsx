// src/pages/dashboard/UserDashboard.jsx

import {
  ArrowRight,
  Bot,
  Heart,
  History,
  PackageSearch,
  Radio,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

export default function UserDashboard() {
  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")?.[0] ||
    "User";

  const actions = [
    {
      title: "Watch Live",
      description:
        "Discover current and upcoming live commerce sessions.",
      icon: Radio,
      to: "/live-shop",
      button: "Explore Live",
    },
    {
      title: "Browse Products",
      description:
        "Explore products demonstrated by brands and AI Twins.",
      icon: ShoppingBag,
      to: "/live-shop",
      button: "View Products",
    },
    {
      title: "Chat with AI Twins",
      description:
        "Ask questions about products, features and availability.",
      icon: Bot,
      to: "/live-shop",
      button: "Start Exploring",
    },
    {
      title: "Saved Products",
      description:
        "Keep your favourite products ready for later.",
      icon: Heart,
      to: "/user/wishlist",
      button: "View Wishlist",
    },
    {
      title: "Order History",
      description:
        "Review products purchased from live sessions.",
      icon: History,
      to: "/user/orders",
      button: "View Orders",
    },
    {
      title: "Account Profile",
      description:
        "Manage your name, contact details and preferences.",
      icon: UserRound,
      to: "/user/profile",
      button: "Manage Profile",
    },
  ];

  return (
    <div className="min-h-full space-y-6 bg-background text-foreground">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--brand-pink)] bg-pink-50/70 p-6 shadow-sm dark:bg-white/10 sm:p-8">
        <div className="absolute right-6 top-6 hidden rounded-full bg-[var(--brand-pink)] px-4 py-2 text-xs font-black text-white sm:block">
          NORMAL USER
        </div>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            TWIN LIVE EXPERIENCE
          </span>

          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Welcome,{" "}
            <span className="brand-text">
              {displayName}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
            Watch live product demonstrations, explore products and
            interact with AI Twins from brands and creators.
          </p>

          <Link
            to="/live-shop"
            className="brand-gradient mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
          >
            Explore Live Shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section>
        <div>
          <h2 className="text-2xl font-black brand-text">
            Explore Twin Live
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Everything available for your normal user account.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map(
            ({
              title,
              description,
              icon: Icon,
              to,
              button,
            }) => (
              <article
                key={title}
                className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  {title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>

                <Link
                  to={to}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
                >
                  {button}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            )
          )}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <UserStat
          icon={Radio}
          label="Live Sessions"
          value="Explore"
          description="Watch available live shows"
        />

        <UserStat
          icon={PackageSearch}
          label="Products"
          value="Discover"
          description="Find products shown by AI Twins"
        />

        <UserStat
          icon={Heart}
          label="Wishlist"
          value={
            Array.isArray(user?.wishlist)
              ? user.wishlist.length
              : 0
          }
          description="Products saved for later"
        />
      </section>
    </div>
  );
}

function UserStat({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {label}
          </p>

          <h3 className="text-2xl font-black brand-text">
            {value}
          </h3>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
