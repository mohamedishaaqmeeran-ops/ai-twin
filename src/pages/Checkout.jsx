import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Crown,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const API = "https://twinn-backend.onrender.com/api";

export default function Checkout() {
  const { plan } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const prices = {
    pro: {
      old: "$49",
      new: "$29",
    },
    business: {
      old: "$149",
      new: "$99",
    },
  };

  const current = prices[plan];

  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/payments/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        setLoading(false);
        return;
      }

      // ==========================
      // STRIPE
      // ==========================

      if (data.gateway === "stripe") {
        window.location.href = data.checkoutUrl;
        return;
      }

      // ==========================
      // RAZORPAY
      // ==========================

      const options = {
        key: data.key,

        amount: data.amount,

        currency: data.currency,

        name: "Twinn",

        description: `${plan.toUpperCase()} Plan`,

        image: "/images/logos.png",

        order_id: data.orderId,

        theme: {
          color: "#ec4899",
        },

        handler: async function (response) {
          const verify = await fetch(
            `${API}/payments/razorpay/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                plan,

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }),
            }
          );

          const verifyData = await verify.json();

          if (!verifyData.success) {
            alert(verifyData.message);
            return;
          }

          localStorage.setItem(
            "user",
            JSON.stringify(verifyData.user)
          );

          localStorage.setItem(
            "plan",
            verifyData.user.plan
          );

          alert("Plan upgraded successfully.");

          navigate("/app");
        },

        modal: {
          ondismiss() {
            setLoading(false);
          },
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (err) {
      console.log(err);

      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="mx-auto max-w-6xl px-4 py-20">

        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold">

              <Crown className="h-4 w-4 text-pink-500" />

              SECURE PAYMENT

            </span>

            <h1 className="mt-6 text-5xl font-black">

              Upgrade to

              <span className="brand-text">

                {" "}
                {plan.toUpperCase()}

              </span>

            </h1>

            <p className="mt-5 text-muted-foreground leading-7">

              Unlock premium AI Twins, unlimited AI replies,
              analytics, advanced voices and multi-platform
              streaming.

            </p>

            <div className="mt-10 space-y-5">

              <Feature text="Unlimited AI replies" />

              <Feature text="Advanced AI voice cloning" />

              <Feature text="Multi platform live streaming" />

              <Feature text="Live analytics dashboard" />

              <Feature text="Priority support" />

            </div>

          </div>

          {/* RIGHT */}

          <div className="rounded-[35px] border border-border bg-card p-8 shadow-xl">

            <div className="flex justify-center">

              <div className="rounded-full bg-pink-50 p-5">

                <CreditCard className="h-10 w-10 text-pink-500" />

              </div>

            </div>

            <h2 className="mt-6 text-center text-3xl font-black">

              {plan.toUpperCase()} Plan

            </h2>

            <div className="mt-8 text-center">

              <span className="text-xl text-gray-400 line-through">

                {current.old}

              </span>

              <div className="mt-2 text-6xl font-black brand-text">

                {current.new}

              </div>

              <p className="mt-2 text-muted-foreground">

                Limited Time Offer

              </p>

            </div>

            <div className="mt-10 rounded-2xl border bg-pink-50 p-5 dark:bg-white/5">

              <div className="flex items-center gap-3">

                <ShieldCheck className="text-green-500" />

                <div>

                  <p className="font-bold">

                    Secure Payment

                  </p>

                  <p className="text-sm text-muted-foreground">

                    Razorpay (India)

                    <br />

                    Stripe (Worldwide)

                  </p>

                </div>

              </div>

            </div>

            <button
              disabled={loading}
              onClick={handlePayment}
              className="brand-gradient mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-[5px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : "Continue to Payment"}

              {!loading && (
                <ArrowRight className="h-5 w-5" />
              )}
            </button>

            <p className="mt-5 text-center text-xs text-muted-foreground">

              Payment gateway will be selected automatically
              based on your country.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 text-pink-500" />
      <span className="font-medium">{text}</span>
    </div>
  );
}