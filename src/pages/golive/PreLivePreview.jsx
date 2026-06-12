import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radio,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Package,
  MessageSquare,
  Link2,
  Bot,
  Users,
} from "lucide-react";

export default function PreLivePreview() {
  const navigate = useNavigate();
  const twinImage = "/images/bb.png";

  const [setup, setSetup] = useState({
    twinName: "My AI Twin",
    product: "Vitamin C Glow Serum",
    platforms: ["Instagram"],
    settings: {
      liveChat: true,
      productLink: true,
      autoAnswer: true,
    },
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("liveSetup") || "{}");

    setSetup({
      twinName: saved.twinName || localStorage.getItem("twinName") || "My AI Twin",
      product:
        saved.product ||
        localStorage.getItem("selectedProduct") ||
        "Vitamin C Glow Serum",
      platforms:
        saved.platforms ||
        JSON.parse(localStorage.getItem("selectedPlatforms") || '["Instagram"]'),
      settings: saved.settings || {
        liveChat: true,
        productLink: true,
        autoAnswer: true,
      },
    });
  }, []);

  const startLive = () => {
    localStorage.setItem("liveSetup", JSON.stringify(setup));
    navigate("/app/golive/live");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          onClick={() => navigate("/app/golive")}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Setup
        </button>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          PRE-LIVE PREVIEW
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">Preview</span> Before Live
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Check your AI Twin, product and platform settings before starting.
        </p>

        <div className="brand-gradient mt-8 overflow-hidden rounded-3xl ">
          <img
            src={twinImage}
            alt="AI Twin"
            className="h-[520px] w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black brand-text">Live Summary</h2>

        <div className="mt-5 space-y-4">
          <Info icon={Radio} label="AI Twin" value={setup.twinName} />
          <Info icon={Package} label="Product" value={setup.product} />
          <Info icon={Users} label="Platforms" value={setup.platforms.join(", ")} />
          <Info
            icon={MessageSquare}
            label="Chat"
            value={setup.settings.liveChat ? "Enabled" : "Disabled"}
          />
          <Info
            icon={Link2}
            label="Product Link"
            value={setup.settings.productLink ? "Enabled" : "Disabled"}
          />
          <Info
            icon={Bot}
            label="Auto Answer"
            value={setup.settings.autoAnswer ? "Enabled" : "Disabled"}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-pink-50 p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-[var(--brand-pink)]" />
            <p className="text-sm font-bold">
              Ready to launch. Your AI Twin will focus on this selected product.
            </p>
          </div>
        </div>

        <button
          onClick={startLive}
          className="brand-gradient mt-8 w-full rounded-[5px] py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
        >
          Go Live Now
        </button>
      </aside>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>

      <span className="text-right text-sm font-black">{value}</span>
    </div>
  );
}