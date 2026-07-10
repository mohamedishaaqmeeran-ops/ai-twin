import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

import Logo from "../components/Logo";
import ButtonLoader from "../components/ButtonLoader";

const API =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/auth/forgot-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send password reset email"
        );
      }

      setMessage(
        data.message ||
          "If an account exists for this email, a reset link has been sent."
      );
    } catch (err) {
      setError(
        err.message || "Unable to process password reset request"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <Logo />

        <h1 className="mt-8 text-3xl font-black tracking-tight">
          Forgot your{" "}
          <span className="brand-text">password?</span>
        </h1>

        <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
          Enter your email address and we will send you a secure password
          reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-7">
          <div className={inputWrapperClass}>
            <Mail className="h-5 w-5 text-[var(--brand-pink)]" />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value.trimStart().toLowerCase())
              }
              placeholder="Email address"
              autoComplete="email"
              className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-[5px] bg-red-50 p-3 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 flex gap-3 rounded-[5px] bg-emerald-50 p-3 text-sm font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="brand-gradient mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <ButtonLoader text="Sending..." />
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <Link
          to="/signin"
          className="mt-6 flex items-center justify-center text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}