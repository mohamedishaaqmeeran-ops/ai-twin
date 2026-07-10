// src/pages/Checkout.jsx

import { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe } from "../features/auth/authSlice";

const API = "https://twinn-backend.onrender.com/api";

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

export default function Checkout() {
  const { plan } = useParams();

const navigate = useNavigate();
const location = useLocation();

const billing = location.state?.billing || "monthly";
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/payments/create-checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  plan,
  billing,
}),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          alert("Please login before upgrading.");
          navigate("/signin");
          return;
        }

        throw new Error(data.message || "Payment failed");
      }

      if (data.gateway === "stripe") {
        window.location.href = data.checkoutUrl;
        return;
      }

      await loadRazorpay();

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Twinn",
        description: `${plan.toUpperCase()} Plan`,
        image: "/images/logos.png",
        order_id: data.orderId,
        theme: { color: "#ec4899" },

        handler: async function (response) {
          const verifyRes = await fetch(`${API}/payments/razorpay/verify`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
  plan,
  billing,
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
}),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(
              verifyData.message || "Payment verification failed"
            );
          }

          alert("Payment successful. Plan upgraded.");
         await dispatch(fetchMe());

const updatedUser = (await dispatch(fetchMe())).payload;

if (
  updatedUser?.plan === "pro" ||
  updatedUser?.plan === "business"
) {
  navigate("/app/pro", { replace: true });
} else {
  navigate("/app", { replace: true });
}
        },

        modal: {
          ondismiss() {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.message || "Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
        <h1 className="text-3xl font-black">
  Upgrade to{" "}
  <span className="brand-text capitalize">{plan}</span>
</h1>

<p className="mt-3 text-sm text-muted-foreground">
  {billing === "yearly"
    ? "Annual Billing • Save 20%"
    : "Monthly Billing"}
</p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="brand-gradient mt-8 h-12 w-full rounded-[5px] font-bold text-white disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
}