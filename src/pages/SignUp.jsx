import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  Phone,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import Logo from "../components/Logo";

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

const [form, setForm] = useState({
  name: "",
  mobile: "",
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

  const handleSignup = (e) => {
    e.preventDefault();

   if (
  !form.name ||
  !form.mobile ||
  !form.email ||
  !form.password ||
  !form.confirmPassword
) {
  return;
}

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "user");

    navigate("/app/twin/create");
  };

  const inputClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  const inputFieldClass =
    "w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2 lg:items-stretch">
        {/* Left */}
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

        {/* Right */}
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
                <User className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  placeholder="Full Name"
                  className={inputFieldClass}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className={inputClass}>
  <Phone className="h-5 w-5 text-[var(--brand-pink)]" />

  <input
    type="tel"
    placeholder="Mobile Number"
    className={inputFieldClass}
    value={form.mobile}
    maxLength={10}
    onChange={(e) =>
      handleChange(
        "mobile",
        e.target.value.replace(/\D/g, "")
      )
    }
  />
</div>

              <div className={inputClass}>
                <Mail className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  placeholder="Email"
                  type="email"
                  className={inputFieldClass}
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className={inputClass}>
                <Lock className="h-5 w-5 text-[var(--brand-pink)]" />
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
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
                  type="password"
                  className={inputFieldClass}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-2 text-sm font-medium leading-5 text-muted-foreground">
                <input type="checkbox" required className="mt-1" />
                <span>I agree to the Terms & Privacy Policy</span>
              </label>

              <button className="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90">
                Create Account
                <ArrowRight className="h-4 w-4" />
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