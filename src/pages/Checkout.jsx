// src/pages/Checkout.jsx

import { useMemo, useState } from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
} from "react-redux";

import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
} from "lucide-react";

import {
  toast,
} from "react-toastify";

import {
  fetchMe,
} from "../features/auth/authSlice";

const API =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "https://twinn-backend.onrender.com/api";

/* =========================================================
   PLAN CONFIGURATION
========================================================= */

const PLAN_DETAILS = {
  starter: {
    name: "Starter",
    monthly: "$15",
    yearly: "$150",
    description:
      "For creators just getting serious.",
    features: [
      "Up to 2 AI Twins",
      "Connect up to 2 platforms",
      "Up to 30 products",
      "300 AI replies per month",
      "Email support",
    ],
  },

  pro: {
    name: "Pro",
    monthly: "$29",
    yearly: "$290",
    description:
      "For creators ready to go live.",
    features: [
      "Up to 3 AI Twins",
      "Connect up to 4 platforms",
      "Up to 100 products",
      "Custom voice cloning",
      "Unlimited AI replies",
      "Live sales analytics",
    ],
  },

  business: {
    name: "Business",
    monthly: "$99",
    yearly: "$990",
    description:
      "Scale across every channel.",
    features: [
      "Unlimited AI Twins",
      "Unlimited products",
      "All supported live platforms",
      "Store integrations",
      "Advanced analytics",
      "Up to 5 team seats",
      "Priority support",
    ],
  },
};

/* =========================================================
   LOAD RAZORPAY
========================================================= */

const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(true),
        {
          once: true,
        }
      );

      existingScript.addEventListener(
        "error",
        () =>
          reject(
            new Error(
              "Razorpay SDK failed to load"
            )
          ),
        {
          once: true,
        }
      );

      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () =>
      resolve(true);

    script.onerror = () =>
      reject(
        new Error(
          "Razorpay SDK failed to load"
        )
      );

    document.body.appendChild(
      script
    );
  });

/* =========================================================
   READ JSON SAFELY
========================================================= */

const readJsonResponse = async (
  response
) => {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    !contentType.includes(
      "application/json"
    )
  ) {
    throw new Error(
      "The payment server returned an invalid response."
    );
  }

  return response.json();
};

/* =========================================================
   CHECKOUT PAGE
========================================================= */

export default function Checkout() {
  const {
    plan: routePlan,
  } = useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const dispatch =
    useDispatch();

  const [loading, setLoading] =
    useState(false);

  const plan = String(
    routePlan || ""
  ).toLowerCase();

  const billing =
    location.state?.billing ===
    "yearly"
      ? "yearly"
      : "monthly";

  const planDetails =
    useMemo(
      () =>
        PLAN_DETAILS[plan] ||
        null,
      [plan]
    );

  const price =
    billing === "yearly"
      ? planDetails?.yearly
      : planDetails?.monthly;

  const handleBack = () => {
    navigate("/pricing");
  };

  const handleSuccessfulPayment =
    async () => {
      const result =
        await dispatch(
          fetchMe()
        );

      const updatedUser =
        result.payload;

      toast.success(
        "Payment successful. Your plan has been upgraded."
      );

      const updatedPlan =
        String(
          updatedUser?.plan || ""
        ).toLowerCase();

      if (
        [
          "starter",
          "pro",
          "business",
        ].includes(updatedPlan)
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
    };

  const handlePayment =
    async () => {
      if (!planDetails) {
        toast.error(
          "Invalid subscription plan."
        );

        navigate(
          "/pricing",
          {
            replace: true,
          }
        );

        return;
      }

      try {
        setLoading(true);

        const response =
          await fetch(
            `${API}/payments/create-checkout`,
            {
              method: "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  plan,
                  billing,
                }),
            }
          );

        if (
          response.status === 401
        ) {
          toast.error(
            "Please sign in before upgrading."
          );

          navigate(
            "/signin",
            {
              state: {
                from:
                  location.pathname,

                paymentIntent: {
                  plan,
                  billing,
                },
              },
            }
          );

          return;
        }

        const data =
          await readJsonResponse(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to start payment."
          );
        }

        /* =================================================
           STRIPE CHECKOUT
        ================================================= */

        if (
          data.gateway ===
          "stripe"
        ) {
          if (
            !data.checkoutUrl
          ) {
            throw new Error(
              "Stripe checkout URL is missing."
            );
          }

          window.location.href =
            data.checkoutUrl;

          return;
        }

        /* =================================================
           RAZORPAY CHECKOUT
        ================================================= */

        if (
          data.gateway !==
          "razorpay"
        ) {
          throw new Error(
            "Unsupported payment gateway."
          );
        }

        if (
          !data.key ||
          !data.orderId ||
          !data.amount ||
          !data.currency
        ) {
          throw new Error(
            "Incomplete Razorpay order details."
          );
        }

        await loadRazorpay();

        const options = {
          key: data.key,

          amount:
            data.amount,

          currency:
            data.currency,

          order_id:
            data.orderId,

          name: "Twinn",

          description:
            `${planDetails.name} Plan - ${
              billing === "yearly"
                ? "Annual Billing"
                : "Monthly Billing"
            }`,

          image:
            "/images/logos.png",

          prefill: {
            name:
              data.user?.name ||
              "",

            email:
              data.user?.email ||
              "",

            contact:
              data.user?.phone ||
              "",
          },

          notes: {
            plan,
            billing,
          },

          theme: {
            color:
              "#ec4899",
          },

          handler:
            async function (
              razorpayResponse
            ) {
              try {
                setLoading(true);

                const verifyResponse =
                  await fetch(
                    `${API}/payments/razorpay/verify`,
                    {
                      method:
                        "POST",

                      credentials:
                        "include",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body:
                        JSON.stringify({
                          plan,

                          billing,

                          razorpay_order_id:
                            razorpayResponse
                              .razorpay_order_id,

                          razorpay_payment_id:
                            razorpayResponse
                              .razorpay_payment_id,

                          razorpay_signature:
                            razorpayResponse
                              .razorpay_signature,
                        }),
                    }
                  );

                const verifyData =
                  await readJsonResponse(
                    verifyResponse
                  );

                if (
                  !verifyResponse.ok ||
                  !verifyData.success
                ) {
                  throw new Error(
                    verifyData.message ||
                      "Payment verification failed."
                  );
                }

                await handleSuccessfulPayment();
              } catch (error) {
                console.error(
                  "PAYMENT VERIFY ERROR:",
                  error
                );

                toast.error(
                  error.message ||
                    "Payment verification failed."
                );
              } finally {
                setLoading(
                  false
                );
              }
            },

          modal: {
            ondismiss: () => {
              setLoading(
                false
              );

              toast.info(
                "Payment window closed."
              );
            },
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.on(
          "payment.failed",
          (response) => {
            setLoading(false);

            toast.error(
              response?.error
                ?.description ||
                "Payment failed. Please try again."
            );
          }
        );

        razorpay.open();
      } catch (error) {
        console.error(
          "CHECKOUT ERROR:",
          error
        );

        toast.error(
          error.message ||
            "Unable to process payment."
        );

        setLoading(false);
      }
    };

  if (!planDetails) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black">
            Invalid Plan
          </h1>

          <p className="mt-3 text-sm font-medium text-muted-foreground">
            The selected subscription
            plan does not exist.
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="brand-gradient mt-8 h-12 w-full rounded-[5px] font-bold text-white"
          >
            View Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to pricing
        </button>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <span className="inline-flex rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand-pink)]">
              {billing === "yearly"
                ? "Annual plan"
                : "Monthly plan"}
            </span>

            <h1 className="mt-5 text-4xl font-black">
              Upgrade to{" "}
              <span className="brand-text">
                {planDetails.name}
              </span>
            </h1>

            <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
              {
                planDetails.description
              }
            </p>

            <div className="mt-8 border-y border-border py-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black brand-text">
                  {price}
                </span>

                <span className="pb-1 text-sm font-bold text-muted-foreground">
                  {billing === "yearly"
                    ? "/ year"
                    : "/ month"}
                </span>
              </div>

              {billing ===
                "yearly" && (
                <p className="mt-2 text-sm font-bold text-emerald-600">
                  Annual billing selected
                </p>
              )}
            </div>

            <ul className="mt-8 space-y-4">
              {planDetails.features.map(
                (feature) => (
                  <li
                    key={
                      feature
                    }
                    className="flex items-start gap-3 text-sm font-medium"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pink-500/10">
                      <Check className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                    </span>

                    <span>
                      {
                        feature
                      }
                    </span>
                  </li>
                )
              )}
            </ul>
          </section>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10">
              <CreditCard className="h-7 w-7 text-[var(--brand-pink)]" />
            </div>

            <h2 className="mt-6 text-2xl font-black">
              Complete your upgrade
            </h2>

            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
              You will be redirected to
              a secure payment checkout.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Plan
                </span>

                <span className="font-black">
                  {
                    planDetails.name
                  }
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Billing
                </span>

                <span className="font-black capitalize">
                  {billing}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="font-black">
                  Total
                </span>

                <span className="text-xl font-black brand-text">
                  {price}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handlePayment
              }
              disabled={loading}
              className="brand-gradient mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <CreditCard className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs font-medium leading-5 text-muted-foreground">
              Payments are securely
              processed through Razorpay
              or Stripe.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}