// src/pages/SignIn.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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

const LOGIN_API =
  "https://twinbackend-production.up.railway.app/api/auth/login";

const GOOGLE_LOGIN_API =
  "https://twinbackend-production.up.railway.app/api/auth/google";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showMore, setShowMore] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectByRoleAndPlan = (user) => {
    const role = user?.role || "user";
    const plan = (user?.plan || "free").toLowerCase();

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
    localStorage.setItem("plan", plan);

    if (role === "admin") {
      navigate("/admin");
      return;
    }

    if (plan === "pro") {
      navigate("/app/pro");
      return;
    }

    if (plan === "enterprise") {
      navigate("/app/enterprise");
      return;
    }

    navigate("/app");
  };


    const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      localStorage.setItem("loginProvider", "email");
      redirectByRoleAndPlan(data.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(GOOGLE_LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Google login failed");
      }

      localStorage.setItem("loginProvider", "google");
      redirectByRoleAndPlan(data.user);
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed.");
  };

  const demoSocialLogin = (provider) => {
    localStorage.setItem("loginProvider", provider);

    redirectByRoleAndPlan({
      name: "Demo User",
      email: "demo@twinn.live",
      role: "user",
      plan: "free",
    });
  };

  const socialButtonClass =
    "flex h-12 w-full items-center justify-center gap-3 rounded-[5px] border border-border bg-background text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10";

  const inputWrapperClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  const inputClass =
    "w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground";


      return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-10 lg:grid-cols-2 lg:items-stretch">
        {/* Left */}
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
              Sign in to create your twin, train it, add products, connect social
              platforms and go live.
            </p>
          </div>
        </section>

        {/* Right */}
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
              <div className="overflow-hidden rounded-[5px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  width="100%"
                />
              </div>

              <button
                type="button"
                onClick={() => demoSocialLogin("apple")}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-[5px] bg-[#0d0d12] text-sm font-bold tracking-wide text-white transition hover:opacity-90"
              >
                <Apple className="h-5 w-5" />
                Continue with Apple
              </button>

              {showMore && (
                <>
                  <button
                    type="button"
                    onClick={() => demoSocialLogin("github")}
                    className={socialButtonClass}
                  >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </button>

                  <button
                    type="button"
                    onClick={() => demoSocialLogin("phone")}
                    className={socialButtonClass}
                  >
                    <span className="text-sm font-black">+91</span>
                    Continue with Phone
                  </button>
                </>
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
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="Email address"
                    type="email"
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
                <div className="flex items-center justify-between gap-3 text-xs">
                  <label className="flex items-center gap-2 font-semibold tracking-wide text-muted-foreground">
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  disabled={loading || !email.trim() || !password.trim()}
                  className="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don't have an account?
                  <Link
                    to="/signup"
                    className="ml-2 font-bold text-[var(--brand-pink)] hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>

                <p className="mt-4 text-center text-xs font-medium leading-5 text-muted-foreground">
                  By continuing you agree to our terms.
                  <br />
                  Your AI Twin awaits.
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