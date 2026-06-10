// src/pages/VoiceLanguage.jsx

import {
  Check,
  Menu,
  ChevronDown,
  Mic,
  Globe,
  Volume2,
  Languages,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function VoiceLanguage() {
  const navigate = useNavigate();

  const [voice, setVoice] = useState("Female Voice");
  const [accent, setAccent] = useState("Indian English");
  const [speed, setSpeed] = useState("Normal");
  const [language, setLanguage] = useState("English");

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
          Voice & Language
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Customize how your AI Twin speaks.
        </p>
      </div>

      {/* Voice Type */}
      <div className="mt-8 rounded-[5px] border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Mic className="h-5 w-5 text-[var(--brand-pink)]" />
          <h3 className="font-bold">Voice Type</h3>
        </div>

        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="mt-4 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
        >
          <option>Female Voice</option>
          <option>Male Voice</option>
        </select>
      </div>

      {/* Accent */}
      <div className="mt-5 rounded-[5px] border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-[var(--brand-pink)]" />
          <h3 className="font-bold">Accent</h3>
        </div>

        <select
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
          className="mt-4 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
        >
          <option>Indian English</option>
          <option>American English</option>
          <option>British English</option>
        </select>
      </div>

      {/* Speaking Speed */}
      <div className="mt-5 rounded-[5px] border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5 text-[var(--brand-pink)]" />
          <h3 className="font-bold">Speaking Speed</h3>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {["Slow", "Normal", "Fast"].map((item) => (
            <button
              key={item}
              onClick={() => setSpeed(item)}
              className={`rounded-[5px] border py-3 text-sm font-semibold transition ${
                speed === item
                  ? "border-pink-500 bg-pink-50 text-[var(--brand-pink)]"
                  : "border-border"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="mt-5 rounded-[5px] border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Languages className="h-5 w-5 text-[var(--brand-pink)]" />
          <h3 className="font-bold">Primary Language</h3>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-4 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
        >
          <option>English</option>
          <option>Tamil</option>
          <option>Hindi</option>
          <option>Malayalam</option>
        </select>
      </div>

      {/* Info Card */}
      <div className="mt-8 rounded-[5px] border border-pink-200 bg-pink-50 p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          🎙️ Your AI Twin will use these settings while interacting with your audience during live sessions.
        </p>
      </div>

      {/* Continue */}
      <button
        onClick={() => navigate("/app/settings")}
        className="brand-gradient mt-10 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Continue →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/appearance")}
        className="mt-3 w-full text-sm font-semibold"
      >
        Back
      </button>
    </div>
  );
}