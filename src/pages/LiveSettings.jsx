// src/pages/LiveSettings.jsx

import {
  Check,
  Menu,
  ChevronDown,
  MessageCircle,
  Clock3,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LiveSettings() {
  const navigate = useNavigate();

  const [autoReply, setAutoReply] = useState(true);
  const [live24x7, setLive24x7] = useState(true);
  const [sellProducts, setSellProducts] = useState(true);
  const [engageAudience, setEngageAudience] = useState(true);

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black brand-text">
          twin
        </h1>

        <div className="flex items-center gap-4">
          <Menu className="h-5 w-5" />
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex flex-col items-center">
          <Check className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-xs">Connect</p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <Check className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-xs">Create</p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <Check className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-xs">Train</p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-[var(--brand-pink)]" />
          <p className="mt-2 text-xs font-bold text-[var(--brand-pink)]">
            Launch
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-black">
          Live Settings
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Configure how your AI Twin behaves during live sessions.
        </p>
      </div>

      {/* Settings */}
      <div className="mt-8 space-y-4">

        {/* Auto Reply */}
        <div className="flex items-center justify-between rounded-[5px] border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <MessageCircle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold">
                Auto Reply
              </h3>

              <p className="text-sm text-muted-foreground">
                Answer audience questions automatically.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={autoReply}
            onChange={() => setAutoReply(!autoReply)}
            className="h-5 w-5 accent-pink-500"
          />
        </div>

        {/* 24/7 */}
        <div className="flex items-center justify-between rounded-[5px] border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-500">
              <Clock3 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold">
                24/7 Availability
              </h3>

              <p className="text-sm text-muted-foreground">
                Keep your AI Twin active all day.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={live24x7}
            onChange={() => setLive24x7(!live24x7)}
            className="h-5 w-5 accent-pink-500"
          />
        </div>

        {/* Product Selling */}
        <div className="flex items-center justify-between rounded-[5px] border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-500">
              <ShoppingBag className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold">
                Product Selling
              </h3>

              <p className="text-sm text-muted-foreground">
                Recommend and sell products live.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={sellProducts}
            onChange={() => setSellProducts(!sellProducts)}
            className="h-5 w-5 accent-pink-500"
          />
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between rounded-[5px] border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
              <Heart className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold">
                Audience Engagement
              </h3>

              <p className="text-sm text-muted-foreground">
                Like, greet and interact with viewers.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={engageAudience}
            onChange={() => setEngageAudience(!engageAudience)}
            className="h-5 w-5 accent-pink-500"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 rounded-[5px] border border-pink-200 bg-pink-50 p-5">
        <h3 className="font-bold text-[var(--brand-pink)]">
          Ready to Launch 🚀
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your AI Twin is almost ready. These settings determine how it
          communicates and sells during live streams.
        </p>
      </div>

      {/* Finish */}
      <button
        onClick={() => navigate("/app/success")}
        className="brand-gradient mt-10 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Finish Setup →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/voice")}
        className="mt-3 w-full text-sm font-semibold"
      >
        Back
      </button>
    </div>
  );
}