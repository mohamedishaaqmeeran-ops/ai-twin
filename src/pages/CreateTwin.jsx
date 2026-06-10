// src/pages/CreateTwin.jsx

import {
  Camera,
  Check,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTwin() {
  const navigate = useNavigate();

  const [twinName, setTwinName] = useState("Ananya AI Twin");
  const [tagline, setTagline] = useState("Your AI shopping assistant");
  const [industry, setIndustry] = useState("Beauty & Skincare");
  const [tone, setTone] = useState("Friendly & Professional");

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
          <div className="h-3 w-3 rounded-full bg-[var(--brand-pink)]" />
          <p className="mt-2 text-xs font-bold text-[var(--brand-pink)]">
            Create
          </p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-gray-300" />
          <p className="mt-2 text-xs text-muted-foreground">
            Train
          </p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-gray-300" />
          <p className="mt-2 text-xs text-muted-foreground">
            Launch
          </p>
        </div>

      </div>

      {/* Title */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-black">
          Create Your AI Twin
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Let's give your AI Twin a unique identity.
        </p>
      </div>

      {/* Avatar */}
      <div className="relative mx-auto mt-8 h-32 w-32">
        <img
          src="/images/girl.png"
          alt="Twin"
          className="h-full w-full rounded-full object-cover border-4 border-pink-200"
        />

        <button className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full bg-card shadow-lg">
          <Camera className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-5">

        <div>
          <label className="text-sm font-semibold">
            Twin Name
          </label>

          <input
            value={twinName}
            onChange={(e) => setTwinName(e.target.value)}
            className="mt-2 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">
            Tagline (Optional)
          </label>

          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="mt-2 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-semibold">
              Industry / Niche
            </label>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-2 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
            >
              <option>Beauty & Skincare</option>
              <option>Fashion</option>
              <option>Fitness</option>
              <option>Education</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">
              Tone of Voice
            </label>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-2 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
            >
              <option>Friendly & Professional</option>
              <option>Casual</option>
              <option>Luxury</option>
              <option>Expert</option>
            </select>
          </div>

        </div>

      </div>

      {/* Continue */}
      <button
        onClick={() => navigate("/app/basic-info")}
        className="brand-gradient mt-8 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white"
      >
        Continue →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/connect")}
        className="mt-3 w-full text-sm font-semibold"
      >
        Back
      </button>

    </div>
  );
}