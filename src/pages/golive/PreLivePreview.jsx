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
  Instagram,
  Youtube,
  Facebook,
  Music2,
} from "lucide-react";

const platformConfig = {
  Instagram: {
    icon: Instagram,
    ratio: "aspect-[9/16]",
    size: "max-w-[300px]",
    label: "Vertical 9:16",
  },
  TikTok: {
    icon: Music2,
    ratio: "aspect-[9/16]",
    size: "max-w-[300px]",
    label: "Vertical 9:16",
  },
  YouTube: {
    icon: Youtube,
    ratio: "aspect-video",
    size: "w-full",
    label: "Landscape 16:9",
  },
  Facebook: {
    icon: Facebook,
    ratio: "aspect-video",
    size: "w-full",
    label: "Landscape 16:9",
  },
};

export default function PreLivePreview() {
  const navigate = useNavigate();
  const twinImage = "/images/bb.png";

  const [activePlatform, setActivePlatform] = useState("Instagram");

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

    const loadedSetup = {
      twinName:
        saved.twinName || localStorage.getItem("twinName") || "My AI Twin",
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
    };

    setSetup(loadedSetup);
    setActivePlatform(loadedSetup.platforms[0] || "Instagram");
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
          Preview how your AI Twin will look on each selected platform.
        </p>

        {/* Platform Tabs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {setup.platforms.map((platform) => {
            const Icon = platformConfig[platform]?.icon || Radio;
            const active = activePlatform === platform;

            return (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`flex items-center gap-2 rounded-[5px] border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                    : "border-border bg-background text-muted-foreground hover:border-[var(--brand-pink)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {platform}
              </button>
            );
          })}
        </div>

        {/* Active Platform Preview */}
        <div className="mt-8">
          <PlatformPreview
            platform={activePlatform}
            twinImage={twinImage}
            twinName={setup.twinName}
            product={setup.product}
          />
        </div>

        {/* All Selected Platforms Preview */}
        <div className="mt-10">
          <h2 className="text-xl font-black brand-text">
            All Selected Platform Previews
          </h2>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {setup.platforms.map((platform) => (
              <PlatformPreview
                key={platform}
                platform={platform}
                twinImage={twinImage}
                twinName={setup.twinName}
                product={setup.product}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black brand-text">Live Summary</h2>

        <div className="mt-5 space-y-4">
          <Info icon={Radio} label="AI Twin" value={setup.twinName} />
          <Info icon={Package} label="Product" value={setup.product} />
          <Info
            icon={Users}
            label="Platforms"
            value={setup.platforms.join(", ")}
          />
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

function PlatformPreview({ platform, twinImage, twinName, product, compact }) {
  const config = platformConfig[platform] || platformConfig.Instagram;
  const Icon = config.icon;

  return (
    <div className="rounded-3xl border border-border bg-background p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[var(--brand-pink)]" />
          <h3 className="font-black">{platform}</h3>
        </div>

        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[var(--brand-pink)]">
          {config.label}
        </span>
      </div>

      <div
        className={`relative mx-auto overflow-hidden rounded-3xl bg-[#0d0d12] ${
          config.ratio
        } ${config.size}`}
      >
        <img
          src={twinImage}
          alt={`${platform} Preview`}
          className="h-full w-full object-cover opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

        <span className="absolute left-3 top-3 rounded-[5px] bg-red-600 px-3 py-1 text-xs font-black text-white">
          LIVE
        </span>

        <span className="absolute right-3 top-3 rounded-[5px] bg-black/60 px-3 py-1 text-xs font-black text-white">
          👁 2.8K
        </span>

        <div className="absolute left-3 top-12 rounded-2xl bg-black/55 px-3 py-2 text-xs font-bold text-white backdrop-blur">
          {twinName}
        </div>

        {!compact && (
          <div className="absolute left-3 top-24 space-y-2">
            {[
              "What is the price?",
              "Is delivery available?",
              "How do I order?",
            ].map((msg) => (
              <div
                key={msg}
                className="rounded-2xl bg-black/55 px-3 py-2 text-xs text-white backdrop-blur"
              >
                {msg}
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/95 p-3 shadow-lg">
          <p className="text-sm font-black">{product}</p>
          <p className="text-xs font-bold text-[var(--brand-pink)]">
            Limited live offer
          </p>

          <button className="brand-gradient mt-2 w-full rounded-[5px] py-2 text-xs font-bold text-white">
            Buy Now
          </button>
        </div>
      </div>
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