// src/pages/ConnectAccounts.jsx
import Logo from "../components/Logo";
import {
  Instagram,
  Facebook,
  Music2,
  Youtube,
  MessageCircle,
  Shield,
  Menu,Bell,
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
    <div className="min-h-screen max-w-4xl bg-background px-4">
       <div className="flex items-center pb-10 justify-between md:hidden">
            <Logo />
    
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
              <Bell className="h-5 w-5" />
            </button>
          </div>
      {/* Center Card */}
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm">

        {/* Header */}
      

        {/* Progress */}
        <div className="mt-8 flex items-center">
          <div className="flex flex-col items-center">
            <div className="h-4 w-4 rounded-full border-4 border-[var(--brand-pink)] bg-white" />
            <p className="mt-2 text-xs font-bold text-[var(--brand-pink)] ">
              Connect
            </p>
          </div>

          <div className="h-[2px] flex-1 bg-pink-200" />

          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-gray-300" />
            <p className="mt-2 text-xs text-muted-foreground">
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
            Connect Your Social Accounts
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Connect your platforms to allow your AI Twin
            <br />
            to learn about you and your brand.
          </p>
        </div>

        {/* Social Cards */}
        <div className="mt-8 space-y-3">
          {accounts.map(({ Icon, name, color }) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4"
            >
              <div className="flex items-center gap-4">
                <Icon className={`h-6 w-6 ${color}`} />

                <p className="font-semibold">
                  {name}
                </p>
              </div>

              <button
                onClick={() => navigate("/app/create")}
                className="text-sm font-bold text-[var(--brand-pink)] hover:underline cursor-pointer"
              >
                Connect
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <Shield className="mx-auto h-4 w-4 text-muted-foreground" />

          <p className="mt-2 text-sm text-muted-foreground">
            We never post without your permission.
          </p>

          <p className="text-sm text-muted-foreground">
            Your data is private and secure.
          </p>
        </div>

      </div>
    </div>
  );
}