import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Crown, Sparkles, Building2, ArrowRight, ChevronDown, Home } from "lucide-react";

import Logo from "../components/Logo";

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: Sparkles,
      monthly: 999,
      yearly: 799,
      description: "Perfect for creators getting started with AI twins.",
      features: [
        "1 AI Twin",
        "100 Monthly Conversations",
        "Voice Cloning",
        "Basic Analytics",
        "Email Support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      icon: Crown,
      monthly: 2999,
      yearly: 2499,
      popular: true,
      description: "Best for influencers and growing brands.",
      features: [
        "5 AI Twins",
        "Unlimited Conversations",
        "Live Commerce",
        "Lead Collection",
        "Advanced Analytics",
        "Priority Support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: Building2,
      monthly: 9999,
      yearly: 8999,
      description: "For teams, agencies and enterprise businesses.",
      features: [
        "Unlimited AI Twins",
        "Unlimited Conversations",
        "White Label",
        "CRM Integration",
        "Dedicated Success Manager",
        "API Access",
      ],
    },
  ];

  const faqs = [
    {
      q: "Can I upgrade later?",
      a: "Yes, you can upgrade or downgrade your plan anytime.",
    },
    {
      q: "Do all plans include voice cloning?",
      a: "Yes. Voice cloning is included in every plan.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes. New users can try Twin before subscribing.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Absolutely. There are no long-term contracts.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Logo />

          <Link to="/" className="rounded-[5px] border border-pink-500 px-5 py-2 text-sm font-bold">
            Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="text-center">
          <p className="text-xs font-extrabold tracking-widest text-[var(--brand-pink)]">
            AI LIVE COMMERCE
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">Choose Your Plan</h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Create your AI sales twin, go live 24/7 and convert visitors into customers
            automatically.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="flex rounded-full border border-border bg-card p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-6 py-2 text-sm font-bold ${
                  billing === "monthly" ? "brand-gradient text-white" : ""
                }`}
              >
                Monthly
              </button>

              <button
                onClick={() => setBilling("yearly")}
                className={`rounded-full px-6 py-2 text-sm font-bold ${
                  billing === "yearly" ? "brand-gradient text-white" : ""
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`
                  relative flex cursor-pointer flex-col rounded-3xl border bg-card p-7 shadow-lg transition-all duration-300
                  ${
                    selectedPlan === plan.id
                      ? "border-pink-500 ring-2 ring-pink-200 scale-[1.02]"
                      : "border-border hover:border-pink-300"
                  }
                `}
              >
                {plan.popular && (
                  <span className="absolute right-5 top-5 rounded-full bg-[var(--brand-pink)] px-3 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                  </span>
                )}

                {selectedPlan === plan.id && (
                  <span className="absolute left-5 top-5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    Selected
                  </span>
                )}

                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-2xl font-black">{plan.name}</h3>

                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-5xl font-black">
                    ₹{billing === "monthly" ? plan.monthly : plan.yearly}
                  </span>

                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>

                {billing === "yearly" && (
                  <p className="mt-2 text-sm font-bold text-green-600">Save up to 20%</p>
                )}

                <div className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="grid h-5 w-5 place-items-center rounded-full bg-green-500 text-white">
                        <Check className="h-3 w-3" />
                      </div>

                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Aligned Button */}
                <div className="mt-auto pt-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                    }}
                    className={`w-full rounded-full py-4 font-bold text-white transition ${
                      selectedPlan === plan.id ? "brand-gradient" : "bg-black hover:bg-black/90"
                    }`}
                  >
                    {selectedPlan === plan.id ? "Selected Plan" : "Get Started"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue */}
        <Link
          to={`/checkout?plan=${selectedPlan}`}
          className="brand-gradient mx-auto mt-10 flex w-full max-w-md items-center justify-center gap-2 rounded-full py-4 font-bold text-white"
        >
          Continue With Selected Plan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="brand-gradient rounded-3xl p-8 text-white">
          <h2 className="text-4xl font-black">Your AI Twin Never Sleeps</h2>

          <p className="mt-3 max-w-xl text-white/90">
            Go live, answer questions, showcase products and generate revenue 24/7.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-center text-4xl font-black">Frequently Asked Questions</h2>

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{faq.q}</h3>

                <ChevronDown className="h-4 w-4" />
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
