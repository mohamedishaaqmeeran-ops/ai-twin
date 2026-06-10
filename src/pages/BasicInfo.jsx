// src/pages/BasicInfo.jsx

import { Check, Menu, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BasicInfo() {
  const navigate = useNavigate();

  const [about, setAbout] = useState(
    "I am a skincare creator and beauty influencer. I love helping people choose the right products for their skin."
  );

  const [language, setLanguage] = useState("English");

  const abilities = [
    "Answer Questions",
    "Recommend Products",
    "Sell Live",
    "Engage Audience",
  ];

  const [selectedAbilities, setSelectedAbilities] = useState([
    "Answer Questions",
    "Recommend Products",
  ]);

  const toggleAbility = (ability) => {
    if (selectedAbilities.includes(ability)) {
      setSelectedAbilities(
        selectedAbilities.filter((item) => item !== ability)
      );
    } else {
      setSelectedAbilities([...selectedAbilities, ability]);
    }
  };

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
          <div className="h-3 w-3 rounded-full bg-[var(--brand-pink)]" />
          <p className="mt-2 text-xs font-bold text-[var(--brand-pink)]">
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
          Tell Us About You
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Help your AI Twin understand you better.
        </p>
      </div>

      {/* About */}
      <div className="mt-8">
        <label className="text-sm font-bold">
          About You
        </label>

        <textarea
          rows={5}
          maxLength={500}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="mt-2 w-full rounded-[5px] border border-border p-4 outline-none"
        />

        <p className="mt-2 text-right text-xs text-muted-foreground">
          {about.length}/500
        </p>
      </div>

      {/* Abilities */}
      <div className="mt-8">
        <label className="text-sm font-bold">
          What do you want your AI Twin to do?
        </label>

        <div className="mt-4 flex flex-wrap gap-3">
          {abilities.map((ability) => (
            <button
              key={ability}
              onClick={() => toggleAbility(ability)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedAbilities.includes(ability)
                  ? "bg-pink-100 text-[var(--brand-pink)]"
                  : "border border-border"
              }`}
            >
              {ability}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="mt-8">
        <label className="text-sm font-bold">
          Your Preferred Language
        </label>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-2 w-full rounded-[5px] border border-border px-4 py-3 outline-none"
        >
          <option>English</option>
          <option>Tamil</option>
          <option>Hindi</option>
          <option>Malayalam</option>
        </select>
      </div>

      {/* Additional Languages */}
      <div className="mt-8">
        <label className="text-sm font-bold">
          Additional Languages (Optional)
        </label>

        <div className="mt-3 flex flex-wrap gap-3">
          <span className="rounded-full bg-pink-50 px-4 py-2 text-sm text-[var(--brand-pink)]">
            Hindi
          </span>

          <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
            + Add
          </button>
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => navigate("/app/train")}
        className="brand-gradient mt-10 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white"
      >
        Continue →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/create")}
        className="mt-3 w-full text-sm font-semibold"
      >
        Back
      </button>
    </div>
  );
}