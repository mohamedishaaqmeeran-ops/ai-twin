// src/pages/SignIn.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Apple,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
} from "lucide-react";

import Logo from "../components/Logo";
import ButtonLoader from "../components/ButtonLoader";
import { loginUser, googleLoginUser } from "../features/auth/authSlice";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const redirectByRoleAndPlan = (user) => {
    const role = user?.role || "user";
    const plan = (user?.plan || "free").toLowerCase();

    if (role === "admin") return navigate("/admin", { replace: true });
    if (plan === "pro" || plan === "business")
      return navigate("/app/pro", { replace: true });

    navigate("/app", { replace: true });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      loginUser({
        email: email.trim().toLowerCase(),
        password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      redirectByRoleAndPlan(result.payload?.user || result.payload);
    }
  };

  const handleCustomGoogleLogin = () => {
    if (!window.google) {
      alert("Google login is not loaded yet");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const credential = response?.credential;

        if (!credential) {
          alert("Google credential not received");
          return;
        }

        const result = await dispatch(googleLoginUser(credential));

        if (googleLoginUser.fulfilled.match(result)) {
          redirectByRoleAndPlan(result.payload?.user || result.payload);
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  const socialButtonClass =
    "flex h-12 w-full items-center justify-center gap-3 rounded-[5px] border border-border bg-background text-sm font-bold tracking-wide text-foreground cursor-pointer transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10";

  const inputWrapperClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  const inputClass =
    "w-full bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground";

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto grid min-h-dvh max-w-7xl gap-8 px-4 py-6 sm:py-10 lg:grid-cols-2 lg:items-stretch">
        <section className="hidden h-full flex-col rounded-[40px] border border-border bg-card p-8 shadow-sm lg:flex">
          <div className="brand-gradient flex-1 overflow-hidden rounded-[32px]">
            <img
              src="/images/bb.png"
              alt="AI Twin"
              className="h-full w-full rounded-[24px] object-cover"
            />
          </div>

          <div className="pt-8">
            <span className="inline-flex rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
              AI TWIN LIVE COMMERCE
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
              Your <span className="brand-text">AI Twin</span> is ready to sell.
            </h1>

            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
              Sign in to create your twin, train it, add products, connect
              social platforms and go live.
            </p>
          </div>
        </section>

        <section className="mx-auto flex h-full w-full max-w-md flex-col">
          <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <Logo />

            <h1 className="mt-8 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
              Sign in to your <span className="brand-text">AI Twin</span>
            </h1>

            <p className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
              Continue to your dashboard, products and live sessions.
            </p>

            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={handleCustomGoogleLogin}
                className={socialButtonClass}
              >
                <img src="/images/go.png" alt="Google" className="h-5 w-5" />
                Continue with Google
              </button>

              <button
                type="button"
                disabled
                className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-[5px] bg-[#0d0d12] text-sm font-bold tracking-wide text-white"
              >
                <Apple className="h-5 w-5" />
                Continue with Apple
              </button>

              {showMore && (
                <button
                  type="button"
                  disabled
                  className={`${socialButtonClass} cursor-not-allowed opacity-50`}
                >
                  <Github className="h-5 w-5" />
                  Continue with GitHub
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="w-full text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
              >
                {showMore ? "Show less options" : "More login options"}
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-bold tracking-wide text-muted-foreground">
                OR LOGIN WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form
              onSubmit={handleEmailLogin}
              className="mt-2 flex flex-1 flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={inputWrapperClass}>
                  <Mail className="h-5 w-5 text-[var(--brand-pink)]" />
                  <input
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value.trimStart().toLowerCase())
                    }
                    className={inputClass}
                    placeholder="Email address"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div className={inputWrapperClass}>
                  <Lock className="h-5 w-5 text-[var(--brand-pink)]" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {error && (
                  <div className="rounded-[5px] bg-red-50 p-3 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password.trim()}
                  className="brand-gradient mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <ButtonLoader text="Signing In..." /> : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?
                  <Link
                    to="/signup"
                    className="ml-2 font-bold text-[var(--brand-pink)] hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <Link
            to="/"
            className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-[var(--brand-pink)]"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Home
          </Link>
        </section>
      </div>
    </div>
  );
}