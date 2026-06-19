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
  Crown,
  Lock,
} from "lucide-react";

const platformConfig = {
  Instagram: {
    icon: Instagram,
    ratio: "aspect-[9/16]",
    size: "max-w-[300px]",
    label: "Vertical 9:16",
    pro: false,
  },
  TikTok: {
    icon: Music2,
    ratio: "aspect-[9/16]",
    size: "max-w-[300px]",
    label: "Vertical 9:16",
    pro: true,
  },
  YouTube: {
    icon: Youtube,
    ratio: "aspect-video",
    size: "w-full",
    label: "Landscape 16:9",
    pro: true,
  },
  Facebook: {
    icon: Facebook,
    ratio: "aspect-video",
    size: "w-full",
    label: "Landscape 16:9",
    pro: true,
  },
};

export default function PreLivePreview() {
  const navigate = useNavigate();
  const twinImage = localStorage.getItem("twinImage") || "/images/bb.png";

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";

  const [activePlatform, setActivePlatform] = useState("Instagram");

  const [setup, setSetup] = useState({
    twinName: "My AI Twin",
    product: "Vitamin C Glow Serum",
    platforms: ["Instagram"],
    settings: {
      liveChat: true,
      productLink: true,
      autoAnswer: true,
      multiPlatformSync: false,
    },
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("liveSetup") || "{}");

    const storedPlatforms =
      saved.platforms ||
      JSON.parse(localStorage.getItem("selectedPlatforms") || '["Instagram"]');

    const allowedPlatforms = isPro ? storedPlatforms : storedPlatforms.slice(0, 1);

    const loadedSetup = {
      twinName:
        saved.twinName || localStorage.getItem("twinName") || "My AI Twin",
      product:
        saved.product ||
        localStorage.getItem("selectedProduct") ||
        "Vitamin C Glow Serum",
      platforms: allowedPlatforms.length ? allowedPlatforms : ["Instagram"],
      settings: saved.settings || {
        liveChat: true,
        productLink: true,
        autoAnswer: true,
        multiPlatformSync: false,
      },
      plan: isPro ? "pro" : "free",
    };

    setSetup(loadedSetup);
    setActivePlatform(loadedSetup.platforms[0] || "Instagram");
  }, [isPro]);

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const startLive = () => {
    const finalSetup = {
      ...setup,
      platforms: isPro ? setup.platforms : setup.platforms.slice(0, 1),
      plan: isPro ? "pro" : "free",
    };

    localStorage.setItem("liveSetup", JSON.stringify(finalSetup));
    navigate("/app/golive/live");
  };

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          onClick={() => navigate("/app/golive")}
          className="mb-5 flex items-center gap-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Setup
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}
            {isPro ? "PRO PRE-LIVE PREVIEW" : "PRE-LIVE PREVIEW"}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
              isPro
                ? "bg-pink-500 text-white"
                : "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
            }`}
          >
            {isPro ? <Crown className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isPro ? "PRO PLAN ACTIVE" : "FREE PLAN"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">
            {isPro ? "Pro Preview" : "Preview"}
          </span>{" "}
          Before Live
        </h1>

        <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
          {isPro
            ? "Preview how your AI Twin will look on every selected platform before launching multi-platform live."
            : "Preview how your AI Twin will look before launching your live session. Free users can preview one platform."}
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Multi-platform preview locked
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upgrade to Pro to preview YouTube, Facebook and TikTok layouts.
                </p>
              </div>

              <button
                onClick={upgradeToPro}
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {setup.platforms.map((platform) => {
            const config = platformConfig[platform] || platformConfig.Instagram;
            const Icon = config.icon || Radio;
            const active = activePlatform === platform;

            return (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`flex items-center gap-2 rounded-[5px] border px-4 py-2 text-sm font-bold tracking-wide transition ${
                  active
                    ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                    : "border-border bg-background text-muted-foreground hover:border-[var(--brand-pink)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {platform}
              </button>
            );
          })}

          {!isPro && (
            <button
              onClick={upgradeToPro}
              className="flex items-center gap-2 rounded-[5px] border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] dark:border-white/10 dark:bg-white/10"
            >
              <Lock className="h-4 w-4" />
              More Platforms - Pro
            </button>
          )}
        </div>

        <div className="mt-8">
          <PlatformPreview
            platform={activePlatform}
            twinImage={twinImage}
            twinName={setup.twinName}
            product={setup.product}
            isPro={isPro}
          />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-black tracking-tight brand-text">
            {isPro ? "All Selected Platform Previews" : "Selected Platform Preview"}
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
                isPro={isPro}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black tracking-tight brand-text">
          Live Summary
        </h2>

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
          <Info
            icon={Crown}
            label="Plan"
            value={isPro ? "Pro Live" : "Free Live"}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-pink-50 p-4 dark:bg-white/10">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-[var(--brand-pink)]" />

            <p className="text-sm font-bold leading-6 text-foreground">
              {isPro
                ? "Ready to launch Pro live. Your AI Twin can sell across selected platforms."
                : "Ready to launch. Your AI Twin will focus on this selected product and platform."}
            </p>
          </div>
        </div>

        <button
          onClick={startLive}
          className="brand-gradient mt-8 w-full rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
        >
          {isPro ? "Go Pro Live Now" : "Go Live Now"}
        </button>
      </aside>
    </div>
  );
}

function PlatformPreview({
  platform,
  twinImage,
  twinName,
  product,
  compact,
  isPro,
}) {
  const config = platformConfig[platform] || platformConfig.Instagram;
  const Icon = config.icon;

  const isLandscape = platform === "YouTube" || platform === "Facebook";

  return (
    <div className="rounded-3xl border border-border bg-background p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[var(--brand-pink)]" />

          <h3 className="text-base font-black tracking-tight text-foreground">
            {platform}
          </h3>
        </div>

        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
          {config.label}
        </span>
      </div>

      <div
        className={`relative mx-auto overflow-hidden rounded-3xl bg-[#0d0d12] ${config.ratio} ${config.size}`}
      >
        <img
          src={twinImage}
          alt={`${platform} Preview`}
          className={`h-full w-full opacity-90 ${
            isLandscape ? "object-contain" : "object-cover"
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

        <span className="absolute left-3 top-3 rounded-[5px] bg-red-600 px-3 py-1 text-xs font-black tracking-wide text-white">
          LIVE
        </span>

        {isPro && (
          <span className="absolute left-3 top-12 rounded-[5px] bg-pink-500 px-3 py-1 text-xs font-black tracking-wide text-white">
            PRO
          </span>
        )}

        <span className="absolute right-3 top-3 rounded-[5px] bg-black/60 px-3 py-1 text-xs font-black tracking-wide text-white">
          👁 {isPro ? "12.8K" : "2.8K"}
        </span>

        <div className="absolute left-3 top-24 rounded-2xl bg-black/55 px-3 py-2 text-xs font-black tracking-wide text-white backdrop-blur">
          {twinName}
        </div>

        {!compact && (
          <div className="absolute left-3 top-36 space-y-2">
            {[
              "What is the price?",
              "Is delivery available?",
              isPro ? "Can I get today's offer?" : "How do I order?",
            ].map((msg) => (
              <div
                key={msg}
                className="rounded-2xl bg-black/55 px-3 py-2 text-xs font-medium leading-5 text-white backdrop-blur"
              >
                {msg}
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/95 p-3 shadow-lg dark:bg-white/10">
          <p className="text-sm font-black tracking-tight text-foreground">
            {product}
          </p>

          <p className="text-xs font-bold tracking-wide text-[var(--brand-pink)]">
            {isPro ? "Pro live offer active" : "Limited live offer"}
          </p>

          <button className="brand-gradient mt-2 w-full rounded-[5px] py-2 text-xs font-bold tracking-wide text-white transition hover:opacity-90">
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
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>

      <span className="text-right text-sm font-black tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}