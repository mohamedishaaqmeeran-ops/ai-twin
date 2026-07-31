// src/pages/SignIn.jsx

import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  useDispatch,
  useSelector,
} from "react-redux";

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

import {
  clearAuthError,
  googleLoginUser,
  loginUser,
} from "../features/auth/authSlice";

/* =========================================================
   ROLE DASHBOARD ROUTES
========================================================= */

const ROLE_HOME_ROUTES = {
  admin: "/admin",
  manager: "/manager",
  contentcreator: "/creator",
  brandcreator: "/app",
  user: "/user/home",
};

/* =========================================================
   ROLE NORMALIZER
========================================================= */

const normalizeRole = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

/* =========================================================
   SAFE INTERNAL PATH
========================================================= */

const isSafeInternalPath = (path) => {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//")
  );
};

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.auth || {}
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showMore, setShowMore] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [localError, setLocalError] =
    useState("");

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearErrors = () => {
    setLocalError("");

    if (error) {
      dispatch(clearAuthError());
    }
  };

  /* =======================================================
     REDIRECT AFTER LOGIN
  ======================================================= */

  const redirectAfterLogin = (
    loggedInUser
  ) => {
    const role = normalizeRole(
      loggedInUser?.role
    );

    const plan = String(
      loggedInUser?.plan || ""
    )
      .trim()
      .toLowerCase();

    const requestedPath =
      location.state?.from;

    const paymentIntent =
      location.state?.paymentIntent;

    /*
     * Only Brand Creator accounts can purchase plans.
     */
    if (
      paymentIntent?.plan &&
      role === "brandcreator"
    ) {
      navigate(
        `/checkout/${paymentIntent.plan}`,
        {
          replace: true,

          state: {
            billing:
              paymentIntent.billing ||
              "monthly",

            from:
              isSafeInternalPath(
                requestedPath
              )
                ? requestedPath
                : "/pricing",
          },
        }
      );

      return;
    }

    /*
     * A normal user or internal account cannot buy
     * a Brand Creator subscription.
     */
    if (
      paymentIntent?.plan &&
      role !== "brandcreator"
    ) {
      navigate(
        ROLE_HOME_ROUTES[role] ||
          "/",
        {
          replace: true,

          state: {
            message:
              "Subscription plans are available only for Brand Creator accounts.",
          },
        }
      );

      return;
    }

    /*
     * Return to the originally requested protected route.
     */
    if (
      isSafeInternalPath(
        requestedPath
      )
    ) {
      navigate(
        requestedPath,
        {
          replace: true,
        }
      );

      return;
    }

    /*
     * Role-based default destinations.
     */
    if (role === "admin") {
      navigate(
        "/admin",
        {
          replace: true,
        }
      );

      return;
    }

    if (role === "manager") {
      navigate(
        "/manager",
        {
          replace: true,
        }
      );

      return;
    }

    if (
      role ===
      "contentcreator"
    ) {
      navigate(
        "/creator",
        {
          replace: true,
        }
      );

      return;
    }

    if (
      role ===
      "brandcreator"
    ) {
      if (
        plan === "pro" ||
        plan === "business" ||
        plan === "agency"
      ) {
        navigate(
          "/app/pro",
          {
            replace: true,
          }
        );

        return;
      }

      navigate(
        "/app",
        {
          replace: true,
        }
      );

      return;
    }

    /*
     * Normal user account.
     */
    navigate(
      "/user/home",
      {
        replace: true,
      }
    );
  };

  /* =======================================================
     EMAIL LOGIN
  ======================================================= */

  const handleEmailLogin = async (
    event
  ) => {
    event.preventDefault();

    clearErrors();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !normalizedEmail ||
      !password
    ) {
      setLocalError(
        "Email and password are required."
      );

      return;
    }

    const result =
      await dispatch(
        loginUser({
          email:
            normalizedEmail,

          password,
        })
      );

    if (
      loginUser.fulfilled.match(
        result
      )
    ) {
      redirectAfterLogin(
        result.payload?.user ||
          result.payload
      );

      return;
    }

   if (
  loginUser.rejected.match(
    result
  )
) {
  setLocalError(
    result.payload
      ?.message ||
      result.error
        ?.message ||
      "Login failed."
  );
}
  };

  /* =======================================================
     GOOGLE LOGIN
  ======================================================= */

  const handleGoogleSuccess =
    async (
      credentialResponse
    ) => {
      clearErrors();

      const credential =
        credentialResponse
          ?.credential;

      if (!credential) {
        setLocalError(
          "Google credential was not received."
        );

        return;
      }

      /*
       * Existing Google users do not need to select
       * an account type again.
       *
       * New users should create their account from
       * the Signup page, where they select:
       * user or brandcreator.
       */
      const result =
        await dispatch(
          googleLoginUser({
            credential,
          })
        );

      if (
        googleLoginUser.fulfilled.match(
          result
        )
      ) {
        redirectAfterLogin(
          result.payload?.user ||
            result.payload
        );

        return;
      }

      if (
  googleLoginUser.rejected.match(
    result
  )
) {
  setLocalError(
    result.payload
      ?.message ||
      result.error
        ?.message ||
      "Google login failed."
  );
}
    };

  const handleGoogleError = () => {
    setLocalError(
      "Google login failed. Please try again."
    );
  };

  /* =======================================================
     STYLES
  ======================================================= */

  const socialButtonClass =
    "flex h-12 w-full items-center justify-center gap-3 rounded-[5px] border border-border bg-background text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10";

  const inputWrapperClass =
    "flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20";

  const inputClass =
    "w-full bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground";

  const displayedError =
    localError || error;

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto grid min-h-dvh max-w-7xl gap-8 px-4 py-6 sm:py-10 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT SIDE */}

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
              Welcome back to{" "}
              <span className="brand-text">
                Twin Live
              </span>
            </h1>

            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
              Brand Creators can manage AI
              Twins, products and live
              sessions. Normal users can
              watch, chat and explore
              products.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}

        <section className="mx-auto flex h-full w-full max-w-md flex-col">
          <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <Logo />

            <h1 className="mt-8 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
              Sign in to{" "}
              <span className="brand-text">
                Twin Live
              </span>
            </h1>

            <p className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
              Continue to the dashboard for
              your selected account type.
            </p>

            {/* SOCIAL LOGIN */}

            <div className="mt-7 space-y-3">
              <div className="w-full overflow-hidden rounded-[5px]">
                <GoogleLogin
                  onSuccess={
                    handleGoogleSuccess
                  }
                  onError={
                    handleGoogleError
                  }
                  useOneTap={false}
                  auto_select={false}
                  theme="outline"
                  shape="rectangular"
                  text="signin_with"
                  size="large"
                  width="100%"
                />
              </div>

              {showMore && (
                <>
                  <button
                    type="button"
                    disabled
                    className="mt-3 flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-[5px] bg-[#0d0d12] text-sm font-bold tracking-wide text-white opacity-50"
                  >
                    <Apple className="h-5 w-5" />
                    Continue with Apple
                  </button>

                  <button
                    type="button"
                    disabled
                    className={`${socialButtonClass} cursor-not-allowed opacity-50`}
                  >
                    <Github className="h-5 w-5" />
                    Continue with GitHub
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() =>
                  setShowMore(
                    (previous) =>
                      !previous
                  )
                }
                className="w-full text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
              >
                {showMore
                  ? "Show less options"
                  : "More login options"}
              </button>
            </div>

            {/* DIVIDER */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs font-bold tracking-wide text-muted-foreground">
                OR LOGIN WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* EMAIL FORM */}

            <form
              onSubmit={
                handleEmailLogin
              }
              className="mt-2 flex flex-1 flex-col justify-between"
            >
              <div className="space-y-4">
                {/* EMAIL */}

                <div
                  className={
                    inputWrapperClass
                  }
                >
                  <Mail className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

                  <input
                    value={email}
                    onChange={(
                      event
                    ) => {
                      clearErrors();

                      setEmail(
                        event.target.value
                          .trimStart()
                          .toLowerCase()
                      );
                    }}
                    className={
                      inputClass
                    }
                    placeholder="Email address"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>

                {/* PASSWORD */}

                <div
                  className={
                    inputWrapperClass
                  }
                >
                  <Lock className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

                  <input
                    value={password}
                    onChange={(
                      event
                    ) => {
                      clearErrors();

                      setPassword(
                        event.target
                          .value
                      );
                    }}
                    className={
                      inputClass
                    }
                    placeholder="Password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    required
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

                {/* FORGOT PASSWORD */}

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    state={{
                      from:
                        location.state
                          ?.from,

                      paymentIntent:
                        location.state
                          ?.paymentIntent,
                    }}
                    className="text-sm font-bold text-[var(--brand-pink)] transition hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* ERROR */}

                {displayedError && (
                  <div className="rounded-[5px] bg-red-50 p-3 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    {displayedError}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !email.trim() ||
                    !password
                  }
                  className="brand-gradient mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <ButtonLoader text="Signing In..." />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?

                  <Link
                    to="/signup"
                    state={{
                      from:
                        location.state
                          ?.from,

                      paymentIntent:
                        location.state
                          ?.paymentIntent,
                    }}
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