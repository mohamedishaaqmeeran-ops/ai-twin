import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import Logo from "../components/Logo";
import ButtonLoader from "../components/ButtonLoader";

const API =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  return passwordRegex.test(password);
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("Password reset token is missing.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill all password fields.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/auth/reset-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password"
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/signin", {
          replace: true,
        });
      }, 2000);
    } catch (err) {
      setError(err.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  if (success) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />

          <h1 className="mt-5 text-3xl font-black">
            Password reset{" "}
            <span className="brand-text">successfully</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Redirecting you to the sign-in page.
          </p>

          <Link
            to="/signin"
            className="brand-gradient mt-6 inline-flex h-11 items-center justify-center rounded-[5px] px-6 text-sm font-bold text-white"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <Logo />

        <h1 className="mt-8 text-3xl font-black tracking-tight">
          Create a new{" "}
          <span className="brand-text">password</span>
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter a strong password for your Twinn account.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className={inputWrapperClass}>
            <Lock className="h-5 w-5 text-[var(--brand-pink)]" />

            <input
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              autoComplete="new-password"
              className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-muted-foreground"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className={inputWrapperClass}>
            <Lock className="h-5 w-5 text-[var(--brand-pink)]" />

            <input
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              className="text-muted-foreground"
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
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

          <button
            type="submit"
            disabled={
              loading ||
              !newPassword.trim() ||
              !confirmPassword.trim()
            }
            className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <ButtonLoader text="Resetting..." />
            ) : (
              <>
                Reset Password
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}