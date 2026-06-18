// src/pages/pro/ProGoLive.jsx

import { useState } from "react";
import {
  Crown,
  Radio,
  Bot,
  Package,
  Share2,
  Play,
  BadgeCheck,
} from "lucide-react";
import { getProTwins, getProProducts, getConnectedPlatforms } from "./proData";

export default function ProGoLive() {
  const twins = getProTwins();
  const products = getProProducts();
  const platforms = getConnectedPlatforms();

  const [selectedTwin, setSelectedTwin] = useState(twins[0]?.id || "");
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || "");
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0] || "");

  const canGoLive = selectedTwin && selectedProduct && selectedPlatform;

  const startLive = () => {
    if (!canGoLive) return;

    const sessions = JSON.parse(localStorage.getItem("proLiveSessions") || "[]");

    const newSession = {
      id: Date.now().toString(),
      twinId: selectedTwin,
      productId: selectedProduct,
      platform: selectedPlatform,
      startedAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 9000 + 1000),
      replies: "Unlimited",
      sales: Math.floor(Math.random() * 80 + 10),
    };

    localStorage.setItem(
      "proLiveSessions",
      JSON.stringify([newSession, ...sessions])
    );

    alert("Pro Live session started successfully!");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          PRO GO LIVE
        </span>

        <h1 className="mt-5 text-4xl font-black">
          Launch <span className="brand-text">Live Commerce</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Select AI Twin, product and connected platform to start selling live.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-black brand-text">Live Setup</h2>

          <div className="mt-6 space-y-5">
            <Field icon={Bot} label="Select AI Twin">
              <select
                value={selectedTwin}
                onChange={(e) => setSelectedTwin(e.target.value)}
                className="input-live"
              >
                <option value="">Choose AI Twin</option>
                {twins.map((twin) => (
                  <option key={twin.id} value={twin.id}>
                    {twin.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={Package} label="Select Product">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="input-live"
              >
                <option value="">Choose Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={Share2} label="Select Platform">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="input-live"
              >
                <option value="">Choose Platform</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </Field>

            <button
              onClick={startLive}
              disabled={!canGoLive}
              className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Start Pro Live
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-black brand-text">Pro Live Features</h2>

          <div className="mt-5 space-y-4">
            {[
              "Unlimited AI replies",
              "Advanced lip sync",
              "No Powered by Twin badge",
              "Live sales analytics",
              "Custom voice cloning enabled",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-[var(--brand-pink)]" />
                <span className="text-sm font-bold">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-background p-5 text-center">
            <Radio className="mx-auto h-12 w-12 text-[var(--brand-pink)]" />
            <h3 className="mt-3 text-lg font-black">Ready to Go Live</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your AI Twin will engage, answer and sell in real time.
            </p>
          </div>
        </aside>
      </div>

      <style>{`
        .input-live {
          width: 100%;
          border-radius: 5px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          outline: none;
        }
        .input-live:focus {
          border-color: var(--brand-pink);
        }
      `}</style>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>
      {children}
    </div>
  );
}