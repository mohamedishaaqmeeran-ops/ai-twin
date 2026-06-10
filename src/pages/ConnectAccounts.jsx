// src/pages/ConnectAccounts.jsx

import {
  Instagram,
  Facebook,
  Music2,
  Youtube,
  MessageCircle,
  Shield,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConnectAccounts() {
  const navigate = useNavigate();

  const accounts = [
    {
      Icon: Instagram,
      name: "Instagram",
      color: "text-pink-500",
    },
    {
      Icon: Facebook,
      name: "Facebook Page",
      color: "text-blue-500",
    },
    {
      Icon: Music2,
      name: "TikTok",
      color: "text-black",
    },
    {
      Icon: Youtube,
      name: "YouTube",
      color: "text-red-500",
    },
    {
      Icon: MessageCircle,
      name: "WhatsApp Business",
      color: "text-green-500",
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
          <div className="h-2 w-14 rounded-full brand-gradient" />
          <p className="mt-2 text-xs font-semibold text-[var(--brand-pink)]">
            Connect
          </p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-gray-300" />
          <p className="mt-2 text-xs text-muted-foreground">
            Create
          </p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-gray-300" />
          <p className="mt-2 text-xs text-muted-foreground">
            Train
          </p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <div className="h-2 w-2 rounded-full bg-gray-300" />
          <p className="mt-2 text-xs text-muted-foreground">
            Launch
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-black">
          Connect Your Social Accounts
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Connect your platforms to allow your AI Twin
          <br />
          to learn about you and your brand.
        </p>
      </div>

      {/* Accounts Card */}
      <div className="mt-8 space-y-4">
        {accounts.map(({ Icon, name, color }) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-[5px] border border-border bg-card px-4 py-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <Icon className={`h-6 w-6 ${color}`} />

              <p className="font-semibold">
                {name}
              </p>
            </div>

            <button className="text-sm font-bold text-[var(--brand-pink)] hover:underline">
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* Privacy */}
      <div className="mt-8 text-center">
        <Shield className="mx-auto h-5 w-5 text-muted-foreground" />

        <p className="mt-2 text-sm text-muted-foreground">
          We never post without your permission.
        </p>

        <p className="text-sm text-muted-foreground">
          Your data is private and secure.
        </p>
      </div>

      {/* Continue */}
      <button
        onClick={() => navigate("/app/create")}
        className="brand-gradient mt-10 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Continue →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mt-3 w-full text-sm font-semibold"
      >
        Back
      </button>

    </div>
  );
}