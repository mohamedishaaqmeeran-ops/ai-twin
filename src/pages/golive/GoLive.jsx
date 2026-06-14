import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Youtube,
  Facebook,
  Instagram,
  Music2,
  Radio,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Link2,
  Bot,
  ArrowRight,
  Package,
  ScanFace,
} from "lucide-react";

const platforms = [
  { name: "YouTube", icon: Youtube },
  { name: "Facebook", icon: Facebook },
  { name: "Instagram", icon: Instagram },
  { name: "TikTok", icon: Music2 },
];

const defaultProducts = [
  "Vitamin C Glow Serum",
  "Wireless Headphone",
  "Smart Watch",
];

export default function GoLive() {
  const navigate = useNavigate();

  const [twinName, setTwinName] = useState("My AI Twin");
  const [product, setProduct] = useState("Vitamin C Glow Serum");
  const [products, setProducts] = useState(defaultProducts);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Instagram"]);
  const [settings, setSettings] = useState({
    liveChat: true,
    productLink: true,
    autoAnswer: true,
  });

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

  useEffect(() => {
    setTwinName(localStorage.getItem("twinName") || "My AI Twin");

    const selectedProduct = localStorage.getItem("selectedProduct");
    if (selectedProduct) setProduct(selectedProduct);

    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");

    if (savedProducts.length) {
      const productNames = savedProducts.map((item) => item.name);
      setProducts([...new Set([...defaultProducts, ...productNames])]);
    }

    const savedPlatforms = JSON.parse(
      localStorage.getItem("selectedPlatforms") || "[]"
    );

    const connectedPlatforms = JSON.parse(
      localStorage.getItem("connectedPlatforms") || "[]"
    );

    if (savedPlatforms.length) {
      setSelectedPlatforms(savedPlatforms);
    } else if (connectedPlatforms.length) {
      setSelectedPlatforms(
        connectedPlatforms.map(
          (item) => item.charAt(0).toUpperCase() + item.slice(1)
        )
      );
    }
  }, []);

  const togglePlatform = (name) => {
    setSelectedPlatforms((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const continuePreview = () => {
    const liveSetup = {
      twinName,
      product,
      platforms: selectedPlatforms,
      settings,
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem("selectedProduct", product);
    localStorage.setItem("selectedPlatforms", JSON.stringify(selectedPlatforms));
    localStorage.setItem("liveSetup", JSON.stringify(liveSetup));

    navigate("/app/golive/preview");
  };

  const canContinue = product && selectedPlatforms.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          GO LIVE SETUP
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">Go Live</span> With Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Select one product and one or more platforms. Your AI Twin will focus
          on selling the selected product during this live session.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Setup */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={ScanFace} label="Select AI Twin">
              <select
                value={twinName}
                onChange={(e) => setTwinName(e.target.value)}
                className={inputClass}
              >
                <option>{twinName}</option>
              </select>
            </Field>

            <Field icon={Package} label="Select Product">
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className={inputClass}
              >
                {products.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select Platforms
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Choose where your AI Twin should go live.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map(({ name, icon: Icon }) => {
                const active = selectedPlatforms.includes(name);

                return (
                  <button
                    key={name}
                    onClick={() => togglePlatform(name)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      active
                        ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6 text-[var(--brand-pink)]" />

                    <p className="mt-3 text-base font-black tracking-tight text-foreground">
                      {name}
                    </p>

                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {active ? "Selected" : "Click to select"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <LiveToggle
              icon={MessageSquare}
              title="Enable Live Chat"
              desc="Allow viewers to comment and ask questions."
              active={settings.liveChat}
              onClick={() => toggleSetting("liveChat")}
            />

            <LiveToggle
              icon={Link2}
              title="Show Product Link"
              desc="Display buy link while AI Twin is selling."
              active={settings.productLink}
              onClick={() => toggleSetting("productLink")}
            />

            <LiveToggle
              icon={Bot}
              title="Auto Answer Customer Questions"
              desc="AI Twin answers product questions automatically."
              active={settings.autoAnswer}
              onClick={() => toggleSetting("autoAnswer")}
            />
          </div>

          <button
            onClick={continuePreview}
            disabled={!canContinue}
            className="brand-gradient mt-8 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Preview
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>

        {/* Preview */}
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Live Setup Preview
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Radio className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
              {product}
            </h3>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Selling with {twinName}
            </p>

            <div className="mt-5 space-y-3">
              <Info label="Platforms" value={selectedPlatforms.join(", ")} />
              <Info
                label="Live Chat"
                value={settings.liveChat ? "Enabled" : "Disabled"}
              />
              <Info
                label="Product Link"
                value={settings.productLink ? "Enabled" : "Disabled"}
              />
              <Info
                label="Auto Answer"
                value={settings.autoAnswer ? "Enabled" : "Disabled"}
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-accent p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--brand-pink)]" />

              <p className="text-sm font-bold leading-6 text-foreground">
                One AI Twin can sell all products. This live will focus only on
                the selected product.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black tracking-tight text-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>

      {children}
    </div>
  );
}

function LiveToggle({ icon: Icon, title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black tracking-tight text-foreground">
            {title}
          </p>

          <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
            {desc}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
          active
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
        }`}
      >
        {active ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 rounded-xl border border-border bg-card p-4 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>

      <span className="text-right text-sm font-black tracking-tight text-foreground">
        {value || "Not selected"}
      </span>
    </div>
  );
}