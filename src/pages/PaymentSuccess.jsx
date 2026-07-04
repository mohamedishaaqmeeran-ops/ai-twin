// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = "https://twinn-backend.onrender.com/api";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verify = async () => {
      try {
        const plan = params.get("plan");
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Payment verification failed");
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("plan", data.user.plan);

        setMessage("Payment successful. Your plan is now Pro.");

        setTimeout(() => {
          navigate("/app");
        }, 1500);
      } catch (error) {
        setMessage(error.message);
      }
    };

    verify();
  }, [params, navigate]);

  return (
    <div className="min-h-screen grid place-items-center">
      <h1 className="text-2xl font-black">{message}</h1>
    </div>
  );
}