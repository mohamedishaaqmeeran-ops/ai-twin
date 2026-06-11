// src/pages/LiveSettings.jsx

import Logo from "../components/Logo";
import {
  Check,
  Bell,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LiveSettings() {
  const navigate = useNavigate();

  const [chatMode, setChatMode] = useState("AI Handles All");
  const [autoResponse, setAutoResponse] = useState(true);

  const chatModes = [
    {
      title: "AI Handles All",
      desc: "AI will answer all questions",
    },
    {
      title: "AI + Human",
      desc: "AI answers, Human takes over",
    },
    {
      title: "Human Only",
      desc: "Only you will answer live",
    },
  ];

  return (
    <div>
      {/* Mobile Header */}
      <div className="flex items-center justify-between pb-10 md:hidden px-4 sm:px-6 lg:px-8">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-4xl rounded-lg bg-white px-4 py-8 shadow-md">
        {/* Progress */}
        <div className="mt-8 flex items-center justify-between">
          {["Connect", "Create", "Train", "Launch"].map((step, index) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <Check className="h-5 w-5 text-emerald-500" />
                <p className="mt-2 text-xs font-semibold">{step}</p>
              </div>

              {index !== 3 && (
                <div className="mx-2 h-[2px] flex-1 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-black">
            Live & Auto Response Settings
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Set how your Twin interacts with your audience.
          </p>
        </div>

        {/* Live Chat Mode */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-bold">Live Chat Mode</p>

          <div className="overflow-hidden rounded-[5px] border border-border bg-card">
            {chatModes.map((mode, index) => {
              const selected = chatMode === mode.title;

              return (
                <button
                  key={mode.title}
                  type="button"
                  onClick={() => setChatMode(mode.title)}
                  className={`flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left transition hover:bg-pink-50 ${
                    index !== chatModes.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  {selected ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-[var(--brand-pink)]" />
                  ) : (
                    <Circle className="h-6 w-6 shrink-0 text-gray-300" />
                  )}

                  <div>
                    <h3 className="font-bold">{mode.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mode.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auto Response */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">Auto Response</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enable AI to reply to comments & DMs
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAutoResponse(!autoResponse)}
            className={`relative h-8 w-14 rounded-full transition ${
              autoResponse ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                autoResponse ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Response Rules */}
        <div className="mt-8 rounded-[5px] border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Response Rules</h3>

            <button className="text-sm font-bold text-[var(--brand-pink)] hover:underline">
              View / Edit
            </button>
          </div>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Be friendly and helpful</li>
            <li>Recommend products based on skin type</li>
            <li>Don&apos;t share personal contact information</li>
          </ul>
        </div>

        {/* Continue */}
        <button
          onClick={() => navigate("/app/review")}
          className="brand-gradient mt-10 flex h-12 w-full cursor-pointer items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
        >
          Continue →
        </button>

        {/* Back */}
        <button
          onClick={() => navigate("/app/voice")}
          className="mt-3 w-full cursor-pointer text-sm font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
}