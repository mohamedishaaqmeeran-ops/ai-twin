import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Youtube,
  Facebook,
  Instagram,
  Music2,
  Calendar,
  Clock,
  Radio,
  Sparkles,
  Save,
  CheckCircle2,
  ArrowLeft,
  UserRound,
  Package,
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

export default function CreateSchedule() {
  const navigate = useNavigate();

  const [twin, setTwin] = useState({
    id: 1,
    name: "My AI Twin",
    image: "/images/bb.png",
    voice: "Warm Female",
    status: "Active",
  });

  const [product, setProduct] = useState("Vitamin C Glow Serum");
  const [products, setProducts] = useState(defaultProducts);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Instagram"]);
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

  useEffect(() => {
    const savedTwin = JSON.parse(localStorage.getItem("aiTwin") || "{}");

    const twinName = localStorage.getItem("twinName") || "My AI Twin";
    const twinImage = localStorage.getItem("twinImage") || "/images/bb.png";
    const voiceStyle = localStorage.getItem("voiceStyle") || "Warm Female";

    setTwin({
      id: savedTwin.id || 1,
      name: savedTwin.name || twinName,
      image: savedTwin.image || twinImage,
      voice: savedTwin.voice || voiceStyle,
      status: savedTwin.status || "Active",
    });

    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");

    if (savedProducts.length) {
      const productNames = savedProducts.map((item) => item.name);
      setProducts([...new Set([...defaultProducts, ...productNames])]);

      const selectedProduct = localStorage.getItem("selectedProduct");

      if (selectedProduct) {
        setProduct(selectedProduct);
      } else {
        setProduct(productNames[0] || defaultProducts[0]);
      }
    } else {
      const selectedProduct = localStorage.getItem("selectedProduct");
      if (selectedProduct) setProduct(selectedProduct);
    }

    const connectedPlatforms = JSON.parse(
      localStorage.getItem("connectedPlatforms") || "[]"
    );

    if (connectedPlatforms.length) {
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

  const saveSchedule = () => {
    const schedule = {
      id: Date.now(),

      twinId: twin.id,
      twinName: twin.name,
      twinImage: twin.image,
      twinVoice: twin.voice,

      product,
      title: title || `${product} Live Sale`,
      date,
      time,
      platforms: selectedPlatforms,
      description,
      status: "Upcoming",
      createdAt: new Date().toLocaleString(),
    };

    const oldSchedules = JSON.parse(
      localStorage.getItem("liveSchedules") || "[]"
    );

    localStorage.setItem(
      "liveSchedules",
      JSON.stringify([...oldSchedules, schedule])
    );

    localStorage.setItem("selectedProduct", product);
    localStorage.setItem(
      "selectedPlatforms",
      JSON.stringify(selectedPlatforms)
    );

    localStorage.setItem(
      "selectedTwin",
      JSON.stringify({
        id: twin.id,
        name: twin.name,
        image: twin.image,
        voice: twin.voice,
      })
    );

    setSaved(true);

    setTimeout(() => {
      navigate("/app/schedule");
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          onClick={() => navigate("/app/schedule")}
          className="mb-5 flex items-center gap-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </button>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          CREATE LIVE SCHEDULE
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">Schedule</span> Your AI Twin Live
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Choose your AI Twin, product, platform and timing. Your AI Twin will
          use the selected product knowledge during this live session.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Select AI Twin
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Your live session will use this AI Twin.
            </p>

            <div className="mt-4 rounded-2xl border-2 border-[var(--brand-pink)] bg-pink-50 p-5 dark:bg-white/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={twin.image}
                  alt={twin.name}
                  className="h-24 w-24 rounded-2xl bg-background object-cover"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-black tracking-tight text-foreground">
                    {twin.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    Voice: {twin.voice}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      ✓ Active Twin
                    </span>

                    <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-bold tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
                      One Twin Account
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/app/twin")}
                  className="rounded-[5px] border-2 border-[var(--brand-pink)] px-4 py-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-100 dark:hover:bg-white/10"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Select Product">
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

            <Field label="Live Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Ex: Glow Serum Evening Sale"
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
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

          <Field label="Live Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-border bg-background p-4 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
              rows="5"
              placeholder="Describe what your AI Twin should talk about in this live..."
            />
          </Field>

          <button
            onClick={saveSchedule}
            disabled={!date || !time || selectedPlatforms.length === 0}
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Schedule
          </button>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Live Preview
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-4">
              <img
                src={twin.image}
                alt={twin.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <h3 className="font-black tracking-tight text-foreground">
                  {twin.name}
                </h3>

                <p className="text-xs font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                  ● Active
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Info icon={UserRound} label="AI Twin" value={twin.name} />
              <Info icon={Package} label="Product" value={product} />
              <Info
                icon={Calendar}
                label="Date"
                value={date || "Not selected"}
              />
              <Info
                icon={Clock}
                label="Time"
                value={time || "Not selected"}
              />
              <Info
                icon={Radio}
                label="Platforms"
                value={
                  selectedPlatforms.length
                    ? selectedPlatforms.join(", ")
                    : "Not selected"
                }
              />
            </div>
          </div>

          {saved && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              Schedule saved successfully
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-black tracking-tight text-foreground">
        {label}
      </label>

      <div className="mt-2">{children}</div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </div>

      <p className="mt-2 text-sm font-black tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}