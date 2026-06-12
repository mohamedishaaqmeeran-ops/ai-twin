import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = (provider = "email") => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginProvider", provider);

    const hasTwin = localStorage.getItem("hasTwin") === "true";

    if (hasTwin) {
      navigate("/app");
    } else {
      navigate("/app/twin/create");
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;

    login("email");
  };

  return (
    <div className="min-h-screen bg-[#f8f8fb]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2">
        {/* Left */}
        <section className="hidden rounded-[40px] border border-border bg-card p-8 shadow-sm lg:block">
          <div className="brand-gradient rounded-[32px] p-5">
            <img
              src="/images/bb.png"
              alt="AI Twin"
              className="h-[520px] w-full rounded-[24px] object-contain"
            />
          </div>

          <div className="mt-6">
            <span className="inline-flex rounded-full border-2 border-pink-500 px-4 py-2 text-xs font-bold">
              AI LIVE COMMERCE
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight">
              Your <span className="brand-text">AI Twin</span> is ready to sell.
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in to create your twin, train it, add products, connect social
              platforms and go live.
            </p>
          </div>
        </section>

        {/* Right */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <Logo />

            <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
              Sign in to your <span className="brand-text">AI Twin</span>
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Continue to your dashboard, products and live sessions.
            </p>

            {/* Social Login */}
            <div className="mt-7 space-y-3">
              <button
                onClick={() => login("google")}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-[5px] border border-border bg-background text-sm font-bold transition hover:border-[var(--brand-pink)] hover:bg-pink-50"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-black text-red-600 shadow-sm">
                  G
                </span>
                Continue with Google
              </button>

              <button
                onClick={() => login("apple")}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-[5px] bg-[#0d0d12] text-sm font-bold text-white transition hover:opacity-90"
              >
                <Apple className="h-5 w-5" />
                Continue with Apple
              </button>

              {showMore && (
                <>
                  <button
                    onClick={() => login("github")}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-[5px] border border-border bg-background text-sm font-bold transition hover:border-[var(--brand-pink)] hover:bg-pink-50"
                  >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </button>

                  <button
                    onClick={() => login("phone")}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-[5px] border border-border bg-background text-sm font-bold transition hover:border-[var(--brand-pink)] hover:bg-pink-50"
                  >
                    +91
                    Continue with Phone
                  </button>
                </>
              )}

              <button
                onClick={() => setShowMore(!showMore)}
                className="w-full text-sm font-bold text-[var(--brand-pink)] hover:underline"
              >
                {showMore ? "Show less options" : "More login options"}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-bold text-muted-foreground">
                OR LOGIN WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Email Login */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 focus-within:border-[var(--brand-pink)]">
                <Mail className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Email address"
                  type="email"
                />
              </div>

              <div className="flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 focus-within:border-[var(--brand-pink)]">
                <Lock className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 font-semibold text-muted-foreground">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-bold text-[var(--brand-pink)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                disabled={!email.trim() || !password.trim()}
                className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing you agree to our terms.
              <br />
              Your AI Twin awaits.
            </p>
          </div>

          <Link
            to="/"
            className="mt-4 block text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </section>
      </div>
    </div>
  );
}