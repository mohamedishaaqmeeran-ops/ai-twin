// src/pages/SignUp.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import Logo from "../components/Logo";
import ButtonLoader from "../components/ButtonLoader";
import { registerUser, fetchMe } from "../features/auth/authSlice";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth || {});

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

    return passwordRegex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = await dispatch(
      registerUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      await dispatch(fetchMe());
      navigate("/app/twin/create", { replace: true });
    }

    if (registerUser.rejected.match(result)) {
      setError(result.payload || "Registration failed");
    }
  };

  const inputClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  const inputFieldClass =
    "w-full bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground";

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto grid min-h-dvh max-w-7xl gap-10 px-4 py-6 sm:py-10 lg:grid-cols-2 lg:items-stretch">
        <section className="hidden h-full flex-col rounded-[40px] border border-border bg-card p-8 shadow-sm lg:flex">
          <div className="brand-gradient flex-1 overflow-hidden rounded-[32px]">
            <img
              src="/images/bb.png"
              className="h-full w-full rounded-[24px] object-cover"
              alt="AI Twin"
            />
          </div>

          <div className="pt-8">
            <h1 className="text-4xl font-black tracking-tight">
              Create your <span className="brand-text">AI Twin</span>
            </h1>

            <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
              Join Twin Live and start creating AI avatars that sell products,
              engage customers and go live 24/7.
            </p>
          </div>
        </section>

        <section className="mx-auto flex h-full w-full max-w-md flex-col rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <Logo />

          <h1 className="mt-8 text-3xl font-black tracking-tight sm:text-4xl">
            Create <span className="brand-text">Account</span>
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
            Start building your AI Twin today.
          </p>

          <div className="my-6 h-px w-full bg-border" />

          <form
            onSubmit={handleSignup}
            className="flex flex-1 flex-col justify-between"
          >
            <div className="space-y-4">
              <div className={inputClass}>
                <Mail className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  className={inputFieldClass}
                  value={form.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value.trimStart())
                  }
                />
              </div>

              <div className={inputClass}>
                <Lock className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={inputFieldClass}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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

              <div className={inputClass}>
                <Lock className="h-5 w-5 text-[var(--brand-pink)]" />

                <input
                  placeholder="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={inputFieldClass}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                />
              </div>

              {error && (
                <div className="rounded-[5px] bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-2 text-sm font-medium leading-5 text-muted-foreground">
                <input type="checkbox" required className="mt-1" />
                <span>I agree to the Terms & Privacy Policy</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="brand-gradient mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <ButtonLoader text="Creating Account..." />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?
                <Link
                  to="/signin"
                  className="ml-2 font-bold text-[var(--brand-pink)] hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}