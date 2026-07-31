import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import {
  GoogleLogin,
} from "@react-oauth/google";
import Logo from "../components/Logo";
import ButtonLoader from "../components/ButtonLoader";

import {
  registerUser,
  googleLoginUser,
  clearAuthError,
} from "../features/auth/authSlice";

const ACCOUNT_TYPES = [
  {
    id: "brandcreator",
    title: "Brand Creator",
    description:
      "Create AI Twins, add products, go live and manage your brand.",
    icon: Store,
    features: [
      "Create and train AI Twins",
      "Manage products",
      "Go live and sell",
      "Access subscription plans",
    ],
  },
  {
    id: "user",
    title: "Normal User",
    description:
      "Watch live sessions, chat with AI Twins and explore products.",
    icon: UserRound,
    features: [
      "Watch live sessions",
      "Chat with AI Twins",
      "Explore products",
      "Manage your profile",
    ],
  },
];

const ALLOWED_PUBLIC_ROLES = [
  "user",
  "brandcreator",
];

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    error: reduxError,
  } = useSelector(
    (state) => state.auth || {}
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
const [
  acceptedTerms,
  setAcceptedTerms,
] = useState(false);
  const handleChange = (
    key,
    value
  ) => {
    setError("");

    if (reduxError) {
      dispatch(clearAuthError());
    }

    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const validatePassword = (
    password
  ) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

    return passwordRegex.test(
      password
    );
  };

  const handleSignup = async (
    event
  ) => {
    event.preventDefault();
if (loading) {
  return;
}
    setError("");
    dispatch(clearAuthError());

    if (
  !ALLOWED_PUBLIC_ROLES.includes(
    form.role
  )
) {
  setError(
    "Please select a valid account type."
  );

  return;
}

    if (
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (
      !validatePassword(
        form.password
      )
    ) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }
if (!acceptedTerms) {
  setError(
    "Please accept the Terms and Privacy Policy."
  );

  return;
}
    const result = await dispatch(
      registerUser({
        email: form.email
          .trim()
          .toLowerCase(),

        password:
          form.password,

        confirmPassword:
          form.confirmPassword,

        role:
          form.role,
      })
    );

    if (
      registerUser.fulfilled.match(
        result
      )
    ) {
      navigate(
        "/verify-email-notice",
        {
          replace: true,
          state: {
            email: form.email
              .trim()
              .toLowerCase(),

            role:
              form.role,
          },
        }
      );
      return;
    }

    if (
      registerUser.rejected.match(
        result
      )
    ) {
     setError(
  result.payload?.message ||
    result.payload ||
    "Registration failed."
);
    }
  };

  const handleGoogleSignup =
  async (
    credentialResponse
  ) => {
    setError("");
    dispatch(clearAuthError());

    if (
      loading
    ) {
      return;
    }

  if (
  !ALLOWED_PUBLIC_ROLES.includes(
    form.role
  )
) {
  setError(
    "Please select Brand Creator or Normal User before continuing with Google."
  );

  return;
}

if (!acceptedTerms) {
  setError(
    "Please accept the Terms and Privacy Policy before continuing with Google."
  );

  return;
}

    const credential =
      credentialResponse
        ?.credential;

    if (!credential) {
      setError(
        "Google did not return a valid credential."
      );

      return;
    }

    const result =
      await dispatch(
        googleLoginUser({
          credential,
          role:
            form.role,
          mode:
            "signup",
        })
      );

    if (
      googleLoginUser
        .fulfilled
        .match(result)
    ) {
      const user =
        result.payload
          ?.user;

      const storedRole =
        user?.role;

      if (
        storedRole ===
        "brandcreator"
      ) {
        navigate(
          "/app/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      navigate(
        "/app/explore",
        {
          replace: true,
        }
      );

      return;
    }

    setError(
      result.payload
        ?.message ||
        result.payload ||
        "Google signup failed."
    );
  };

  const inputClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  const inputFieldClass =
    "w-full bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground";

  const displayError =
    error || reduxError;

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto grid min-h-dvh max-w-7xl gap-10 px-4 py-6 sm:py-10 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT SECTION */}

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
              Join{" "}
              <span className="brand-text">
                Twin Live
              </span>
            </h1>

            <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
              Create a Brand Creator
              account to build AI Twins and
              sell products, or create a
              Normal User account to watch,
              chat and shop.
            </p>
          </div>
        </section>

        {/* RIGHT SECTION */}

        <section className="mx-auto flex h-full w-full max-w-xl flex-col rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <Logo />

          <h1 className="mt-8 text-3xl font-black tracking-tight sm:text-4xl">
            Create{" "}
            <span className="brand-text">
              Account
            </span>
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
            Select the type of account you
            want to create.
          </p>
       

<div
  className={
    !form.role ||
    loading
      ? "pointer-events-none opacity-50"
      : ""
  }
>
  <GoogleLogin
    onSuccess={
      handleGoogleSignup
    }
    onError={() => {
      setError(
        "Google signup was cancelled or failed."
      );
    }}
    text="signup_with"
    shape="rectangular"
    size="large"
    width="100%"
    theme="outline"
  />
</div>

{!form.role && (
  <p className="mt-2 text-center text-xs font-semibold text-amber-600 dark:text-amber-400">
    Select an account type before
    using Google signup.
  </p>
)}

          <div className="my-6 h-px w-full bg-border" />

          <form
            onSubmit={handleSignup}
            className="flex flex-1 flex-col justify-between"
          >
            <div className="space-y-5">
              {/* ACCOUNT TYPE */}

              <div>
                <p className="mb-3 text-sm font-bold text-foreground">
                  Choose account type
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {ACCOUNT_TYPES.map(
                    (account) => {
                      const Icon =
                        account.icon;

                      const isSelected =
                        form.role ===
                        account.id;

                      return (
                        <button
  key={account.id}
  type="button"
  aria-pressed={isSelected}
  onClick={() =>
    handleChange(
      "role",
      account.id
    )
  }
  className={`relative rounded-xl border p-4 text-left transition ${
    isSelected
      ? "border-[var(--brand-pink)] bg-pink-50 ring-2 ring-pink-200 dark:bg-pink-500/10 dark:ring-pink-500/20"
      : "border-border bg-background hover:border-pink-300"
  }`}
>
                          {isSelected && (
                            <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-[var(--brand-pink)]" />
                          )}

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-[var(--brand-pink)] dark:bg-pink-500/10">
                            <Icon className="h-5 w-5" />
                          </div>

                          <h2 className="mt-3 text-base font-black">
                            {account.title}
                          </h2>

                          <p className="mt-2 text-xs font-medium leading-5 text-muted-foreground">
                            {
                              account.description
                            }
                          </p>

                          <ul className="mt-3 space-y-2">
                            {account.features.map(
                              (
                                feature
                              ) => (
                                <li
                                  key={
                                    feature
                                  }
                                  className="flex items-start gap-2 text-xs font-medium text-muted-foreground"
                                >
                                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />

                                  <span>
                                    {
                                      feature
                                    }
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* EMAIL */}

              <div className={inputClass}>
                <Mail className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

               <input
  placeholder="Email"
  type="email"
  name="email"
  required
  maxLength={255}
  autoComplete="email"
  className={inputFieldClass}
  value={form.email}
  onChange={(event) =>
    handleChange(
      "email",
      event.target.value
    )
  }
/>
              </div>

              {/* PASSWORD */}

              <div className={inputClass}>
                <Lock className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

                <input
  placeholder="Password"
  type={
    showPassword
      ? "text"
      : "password"
  }
  name="password"
  required
  minLength={8}
  maxLength={128}
  autoComplete="new-password"
  className={inputFieldClass}
  value={form.password}
  onChange={(event) =>
    handleChange(
      "password",
      event.target.value
    )
  }
/>

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className={inputClass}>
                <Lock className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

                <input
  placeholder="Confirm Password"
  type={
    showConfirmPassword
      ? "text"
      : "password"
  }
  name="confirmPassword"
  required
  minLength={8}
  maxLength={128}
  autoComplete="new-password"
  className={inputFieldClass}
  value={form.confirmPassword}
  onChange={(event) =>
    handleChange(
      "confirmPassword",
      event.target.value
    )
  }
/>

                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {displayError && (
                <div className="rounded-[5px] bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {displayError}
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-2 text-sm font-medium leading-5 text-muted-foreground">
               <input
  type="checkbox"
  checked={acceptedTerms}
  onChange={(event) => {
    setAcceptedTerms(
      event.target.checked
    );

    setError("");

    if (reduxError) {
      dispatch(
        clearAuthError()
      );
    }
  }}
  className="mt-1 accent-pink-500"
/>

                <span>
                  I agree to the{" "}
                  <Link
                    to="/terms-and-conditions"
                    className="font-bold text-[var(--brand-pink)] hover:underline"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="font-bold text-[var(--brand-pink)] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
           disabled={
  loading ||
  !form.role ||
  !form.email.trim() ||
  !form.password ||
  !form.confirmPassword ||
  !acceptedTerms
}
                className="brand-gradient mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <ButtonLoader text="Creating Account..." />
                ) : (
                  <>
                    Create{" "}
                    {form.role ===
                    "brandcreator"
                      ? "Brand Creator"
                      : form.role ===
                          "user"
                        ? "User"
                        : ""}{" "}
                    Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
                 <div className="my-5 flex items-center gap-3">
  <div className="h-px flex-1 bg-border" />

  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
    Or
  </span>

  <div className="h-px flex-1 bg-border" />
</div>

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