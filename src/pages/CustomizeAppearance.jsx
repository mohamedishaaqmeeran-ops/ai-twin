// src/pages/CustomizeAppearance.jsx

import {
  Check,
  Menu,
  ChevronDown,
  User,
  Shirt,
  Palette,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CustomizeAppearance() {
  const navigate = useNavigate();

  const [gender, setGender] = useState("Female");
  const [outfit, setOutfit] = useState("Casual");
  const [theme, setTheme] = useState("Pink");

  const colors = [
    "#ec4899",
    "#8b5cf6",
    "#f97316",
    "#22c55e",
    "#3b82f6",
  ];

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
          Customize Appearance
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Choose how your AI Twin should look.
        </p>
      </div>

      {/* Avatar Preview */}
      <div className="mt-8 flex justify-center">
        <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-pink-200 bg-pink-50 shadow-lg">
          <img
            src="/images/girl.png"
            alt="Avatar"
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-2 right-2 grid h-10 w-10 place-items-center rounded-full brand-gradient shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Gender */}
      <div className="mt-10">
        <p className="mb-3 text-sm font-bold">
          Gender
        </p>

        <div className="grid grid-cols-2 gap-3">
          {["Female", "Male"].map((item) => (
            <button
              key={item}
              onClick={() => setGender(item)}
              className={`rounded-[5px] border px-4 py-3 font-semibold transition ${
                gender === item
                  ? "border-pink-500 bg-pink-50 text-[var(--brand-pink)]"
                  : "border-border"
              }`}
            >
              <User className="mx-auto mb-2 h-5 w-5" />
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div className="mt-8">
        <p className="mb-3 text-sm font-bold">
          Outfit Style
        </p>

        <div className="grid grid-cols-3 gap-3">
          {["Casual", "Formal", "Luxury"].map((item) => (
            <button
              key={item}
              onClick={() => setOutfit(item)}
              className={`rounded-[5px] border px-3 py-3 text-sm font-semibold transition ${
                outfit === item
                  ? "border-pink-500 bg-pink-50 text-[var(--brand-pink)]"
                  : "border-border"
              }`}
            >
              <Shirt className="mx-auto mb-2 h-5 w-5" />
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color */}
      <div className="mt-8">
        <p className="mb-3 text-sm font-bold">
          Theme Color
        </p>

        <div className="flex gap-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setTheme(color)}
              className={`h-12 w-12 rounded-full border-4 ${
                theme === color
                  ? "border-black"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Personality Card */}
      <div className="mt-8 rounded-[5px] border border-pink-200 bg-pink-50 p-5">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-[var(--brand-pink)]" />

          <div>
            <h3 className="font-bold">
              Visual Personality
            </h3>

            <p className="text-sm text-muted-foreground">
              Your AI Twin will reflect your selected style and colors.
            </p>
          </div>
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => navigate("/app/voice")}
        className="brand-gradient mt-10 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Continue →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/train")}
        className="mt-3 w-full text-sm font-semibold"
      >
        Back
      </button>
    </div>
  );
}