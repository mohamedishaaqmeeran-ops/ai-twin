// src/pages/Pricing.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Crown,
  Sparkles,
  Rocket,
  Building2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Nav from "../components/Nav";

const API_URL =
  import.meta.env.VITE_API_URL || "https://twinn-backend.onrender.com";

const plans = [
  {
    name: "Free",
    tag: "Try your AI Twin, on us.",
    monthly: "$0",
    monthlyOriginal: "$0",
    yearly: "$0",
    yearlyOriginal: "$0",
    period: "Free forever",
    button: "Get Started Free",
    link: "/signup",
    icon: Sparkles,
    popular: false,
    features: [
      "1 AI Twin",
      "1 connected live platform",
      "Up to 10 products",
      "Standard AI voice",
      "Basic lip sync",
      "100 AI replies / month",
      "Community support",
      "Powered by Twin badge",
    ],
  },
  {
    name: "Pro",
    tag: "For creators ready to go live.",
    monthly: "$29",
    monthlyOriginal: "$49",
    yearly: "$290",
    yearlyOriginal: "$490",
    period: "/ month",
    button: "Start",
    icon: Crown,
    popular: true,
    features: [
      "Everything in Free",
      "Up to 3 AI Twins",
      "Connect up to 4 platforms",
      "Up to 100 products",
      "Custom voice cloning",
      "Advanced lip sync",
      "Unlimited AI replies",
      "Live sales analytics",
      "Remove Powered by Twin badge",
      "Email support",
    ],
  },
  {
    name: "Business",
    tag: "Scale across every channel.",
    monthly: "$99",
    monthlyOriginal: "$149",
    yearly: "$990",
    yearlyOriginal: "$1,490",
    period: "/ month",
    button: "Start",
    icon: Rocket,
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited AI Twins",
      "Instagram, Facebook, YouTube, TikTok & LinkedIn",
      "Unlimited products",
      "Shopify, WooCommerce, WordPress integrations",
      "Klaviyo, Zapier, Stripe support",
      "Advanced analytics dashboard",
      "Up to 5 team seats",
      "Priority support + onboarding",
    ],
  },
  {
    name: "Agency",
    tag: "Run AI Twins for every client.",
    monthly: "Custom",
    monthlyOriginal: "",
    yearly: "Custom",
    yearlyOriginal: "",
    period: "Volume-based pricing",
    button: "Contact Sales",
    link: "/waitlist",
    icon: Building2,
    popular: false,
    features: [
      "Everything in Business",
      "Multiple brand accounts",
      "White-label branding",
      "Custom integrations",
      "API access",
      "Dedicated account manager",
      "SLA support",
      "Volume-based pricing",
    ],
  },
];

const comparison = [
  ["AI Twins", "1", "Up to 3", "Unlimited", "Unlimited"],
  ["Connected platforms", "1", "Up to 4", "IG, FB, YouTube, TikTok, LinkedIn", "All + custom"],
  ["Products", "Up to 10", "Up to 100", "Unlimited", "Unlimited"],
  ["Voice", "Standard", "Custom cloning", "Custom cloning", "Custom cloning"],
  ["Lip Sync", "Basic", "Advanced", "Advanced", "Advanced"],
  ["AI replies", "100 / month", "Unlimited", "Unlimited", "Unlimited"],
  ["Analytics", "—", "Live sales", "Advanced reports", "Advanced reports"],
  ["Store integrations", "—", "—", "Shopify, WooCommerce, Stripe", "All + API"],
  ["Team seats", "1", "1", "Up to 5", "Custom"],
  ["Branding", "Twin badge", "No badge", "No badge", "White-label"],
  ["Support", "Community", "Email", "Priority + onboarding", "Dedicated manager"],
];

const faqs = [
  {
    q: "Can I change my plan later?",
    a: "Yes. You can upgrade, downgrade or cancel anytime from your dashboard.",
  },
  {
    q: "Is there a free trial on paid plans?",
    a: "Yes. Pro and Business plans include a 14-day free trial, no credit card required.",
  },
  {
    q: "What happens if I reach my limit?",
    a: "We will notify you before you hit your limit. You can upgrade anytime.",
  },
  {
    q: "Do you offer annual billing discount?",
    a: "Yes. Annual billing saves up to 20% compared to monthly billing.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept major cards and UPI for customers in India.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There is no lock-in period.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide">
            <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            PRICING
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            Simple Plans.{" "}
            <span className="brand-text">Sell Around the Clock.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-muted-foreground sm:text-base">
            Pick a plan that fits where you are today — and upgrade anytime as
            you grow. Your AI Twin works 24/7, so your plan should too.
          </p>

          <div className="mx-auto mt-8 flex w-fit rounded-full border border-border bg-card p-1 shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-bold ${
                billing === "monthly"
                  ? "brand-gradient text-white"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-bold ${
                billing === "yearly"
                  ? "brand-gradient text-white"
                  : "text-muted-foreground"
              }`}
            >
              Annual · Save up to 20%
            </button>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} billing={billing} />
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <h2 className="text-3xl font-black brand-text">Compare Plans</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 text-sm font-black">Feature</th>
                    <th>Free</th>
                    <th>Pro</th>
                    <th>Business</th>
                    <th>Agency</th>
                  </tr>
                </thead>

                <tbody>
                  {comparison.map((row) => (
                    <tr key={row[0]} className="border-b border-border">
                      {row.map((item, index) => (
                        <td
                          key={index}
                          className={`py-4 text-sm ${
                            index === 0
                              ? "font-black text-foreground"
                              : "font-medium text-muted-foreground"
                          }`}
                        >
                          {item}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black brand-text">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex gap-3">
                  <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

                  <div>
                    <h3 className="font-black text-foreground">{faq.q}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-[40px] p-8 text-center text-white shadow-xl sm:p-12">
            <h2 className="text-3xl font-black sm:text-5xl">
              Ready to let your AI Twin sell for you?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-white/90 sm:text-base">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-[5px] bg-white px-6 py-3 text-sm font-black text-[var(--brand-pink)]"
              >
                Get Started Free →
              </Link>

              <Link
                to="/waitlist"
                className="rounded-[5px] border border-white/40 px-6 py-3 text-sm font-black text-white"
              >
                Talk to Sales →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-[#0d0d12]">
        <p className="px-4 py-5 text-center text-sm font-medium tracking-wide text-white/50">
          © {new Date().getFullYear()} Twinn. All rights reserved.
        </p>
      </footer>
    </div>
  );
}


const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));

    document.body.appendChild(script);
  });


function PlanCard({ plan, billing }) {
  const Icon = plan.icon;
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
  if (plan.name === "Free") {
    window.location.href = "/signup";
    return;
  }

  if (plan.name === "Agency") {
    window.location.href = "/waitlist";
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(`${API_URL}/api/payments/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        plan: plan.name.toLowerCase(),
        billing,
      }),
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        "Backend API URL is wrong or payment route is missing."
      );
    }

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Unable to start payment");
    }

    // Stripe
    if (data.gateway === "stripe") {
      window.location.href = data.checkoutUrl;
      return;
    }

    // Razorpay
    await loadRazorpay();

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "Twinn",
      description: `${plan.name} Plan`,

      handler: async function (response) {
        try {
          const verifyRes = await fetch(
            `${API_URL}/api/payments/razorpay/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                plan: plan.name.toLowerCase(),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verifyContentType =
            verifyRes.headers.get("content-type");

          if (
            !verifyContentType ||
            !verifyContentType.includes("application/json")
          ) {
            throw new Error("Payment verify API returned HTML.");
          }

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(
              verifyData.message || "Payment verification failed."
            );
          }

          alert("Payment successful.");
          window.location.href = "/app";
        } catch (err) {
          alert(err.message);
        }
      },

      modal: {
        ondismiss: () => setLoading(false),
      },

      theme: {
        color: "#ec4899",
      },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`relative flex flex-col rounded-[32px] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        plan.popular
          ? "border-[var(--brand-pink)] bg-pink-50 dark:bg-white/10"
          : "border-border bg-card"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand-pink)] px-4 py-2 text-xs font-black text-white shadow-md">
          MOST POPULAR
        </span>
      )}

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-6 text-2xl font-black">{plan.name}</h3>

      <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
        {plan.tag}
      </p>

      <div className="mt-6">
        {plan.name !== "Agency" && (
          <p className="text-sm font-bold text-muted-foreground line-through">
            {billing === "monthly" ? plan.monthlyOriginal : plan.yearlyOriginal}
          </p>
        )}

        <p className="mt-1 text-4xl font-black brand-text">
          {billing === "monthly" ? plan.monthly : plan.yearly}
        </p>

        {plan.name !== "Free" && plan.name !== "Agency" && (
          <p className="mt-1 text-xs font-black text-emerald-600">
            Limited time offer
          </p>
        )}

        <p className="mt-1 text-sm font-bold text-muted-foreground">
          {plan.name === "Agency"
            ? plan.period
            : billing === "monthly"
            ? plan.period
            : "/ year"}
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`mt-6 flex h-12 items-center justify-center gap-2 rounded-[5px] text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-70 ${
          plan.popular
            ? "brand-gradient text-white"
            : "border-2 border-[var(--brand-pink)] text-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10"
        }`}
      >
        {loading ? "Processing..." : plan.button}
        <ArrowRight className="h-4 w-4" />
      </button>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm font-medium leading-6">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}