// src/pages/user/UserHome.jsx

import {
  LogOut,
  Radio,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  logoutUser,
} from "../../features/auth/authSlice";

export default function UserHome() {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {
    user,
    loading,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  const handleLogout =
    async () => {
      await dispatch(
        logoutUser()
      );

      navigate(
        "/signin",
        {
          replace: true,
        }
      );
    };

  const features = [
    {
      title:
        "Watch Live",
      description:
        "Discover live product demonstrations from creators and brands.",
      icon: Radio,
    },
    {
      title:
        "Explore Products",
      description:
        "Browse products presented by AI Twins and brand creators.",
      icon: ShoppingBag,
    },
    {
      title:
        "Chat with AI Twins",
      description:
        "Ask questions and receive product information instantly.",
      icon: Sparkles,
    },
    {
      title:
        "Manage Profile",
      description:
        "Update your personal details, preferences and account settings.",
      icon: UserRound,
    },
  ];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-pink)]">
              Twin Live
            </p>

            <h1 className="mt-1 text-xl font-black">
              User Dashboard
            </h1>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={
              handleLogout
            }
            className="flex items-center gap-2 rounded-[5px] border border-border px-4 py-2 text-sm font-bold transition hover:border-red-400 hover:text-red-500 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <span className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[var(--brand-pink)] dark:bg-pink-500/10">
            NORMAL USER ACCOUNT
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            Welcome
            {user?.name ||
            user?.fullName
              ? `, ${
                  user.name ||
                  user.fullName
                }`
              : ""}
          </h2>

          <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
            Explore live sessions,
            products and AI Twin
            experiences from brands
            and creators.
          </p>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          {features.map(
            ({
              title,
              description,
              icon: Icon,
            }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-pink-500/10">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  {title}
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            )
          )}
        </section>
      </main>
    </div>
  );
}