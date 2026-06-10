// src/pages/ReviewLaunch.jsx

import {
  Check,
  Menu,
  ChevronDown,
  User,
  FileText,
  Mic,
  Settings,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReviewLaunch() {
  const navigate = useNavigate();

  const sections = [
    {
      Icon: User,
      title: "Twin Profile",
      desc: "Ananya AI Twin • Beauty & Skincare",
      color: "bg-pink-50 text-[var(--brand-pink)]",
    },
    {
      Icon: FileText,
      title: "Knowledge Base",
      desc: "Products, FAQs, Website Content",
      color: "bg-orange-50 text-orange-500",
    },
    {
      Icon: Mic,
      title: "Voice Settings",
      desc: "Female Voice • Indian English",
      color: "bg-violet-50 text-violet-500",
    },
    {
      Icon: Settings,
      title: "Live Behavior",
      desc: "Auto Reply • Product Selling • 24/7",
      color: "bg-emerald-50 text-emerald-500",
    },
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

        <div className="h-[2px] flex-1 bg-emerald-500" />

        <div className="flex flex-col items-center">
          <Check className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-xs">Create</p>
        </div>

        <div className="h-[2px] flex-1 bg-emerald-500" />

        <div className="flex flex-col items-center">
          <Check className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-xs">Train</p>
        </div>

        <div className="h-[2px] flex-1 bg-emerald-500" />

        <div className="flex flex-col items-center">
          <Check className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-xs">Launch</p>
        </div>
      </div>

      {/* Hero */}
      <div className="mt-10 text-center">
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-pink-50">
          <Sparkles className="absolute -top-2 left-6 h-4 w-4 text-pink-400" />
          <Sparkles className="absolute right-0 top-8 h-5 w-5 text-orange-300" />

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">
            <Rocket className="h-8 w-8 text-[var(--brand-pink)]" />
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-black">
          Review & Launch
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Everything looks good. Review your AI Twin
          before going live.
        </p>
      </div>

      {/* Review Cards */}
      <div className="mt-10 space-y-4">
        {sections.map(({ Icon, title, desc, color }) => (
          <div
            key={title}
            className="flex items-center gap-4 rounded-[5px] border border-border bg-card p-5 shadow-sm"
          >
            <div
              className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold">
                {title}
              </h3>

              <p className="truncate text-sm text-muted-foreground">
                {desc}
              </p>
            </div>

            <Check className="h-5 w-5 text-emerald-500" />
          </div>
        ))}
      </div>

      {/* Ready Card */}
      <div className="mt-8 rounded-[5px] border border-pink-200 bg-pink-50 p-6">
        <h3 className="text-lg font-black brand-text">
          Your AI Twin is Ready 🚀
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You can start selling, answering questions,
          and engaging with customers 24/7.
        </p>
      </div>

      {/* Buttons */}
      <button
        onClick={() => navigate("/app/golive")}
        className="brand-gradient mt-8 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Launch AI Twin →
      </button>

      <button
        onClick={() => navigate("/app/settings")}
        className="mt-3 w-full rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)]"
      >
        Back
      </button>
    </div>
  );
}