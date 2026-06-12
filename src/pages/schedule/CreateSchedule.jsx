import { useState } from "react";
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
} from "lucide-react";

const platforms = [
  { name: "YouTube", icon: Youtube },
  { name: "Facebook", icon: Facebook },
  { name: "Instagram", icon: Instagram },
  { name: "TikTok", icon: Music2 },
];

const products = [
  "Vitamin C Glow Serum",
  "Wireless Headphone",
  "Smart Watch",
];

export default function CreateSchedule() {
  const navigate = useNavigate();

  const [product, setProduct] = useState("Vitamin C Glow Serum");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Instagram"]);
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);

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
      product,
      title: title || `${product} Live Sale`,
      date,
      time,
      platforms: selectedPlatforms,
      description,
      status: "Upcoming",
    };

    const oldSchedules = JSON.parse(
      localStorage.getItem("liveSchedules") || "[]"
    );

    localStorage.setItem(
      "liveSchedules",
      JSON.stringify([...oldSchedules, schedule])
    );

    localStorage.setItem("selectedProduct", product);

    setSaved(true);

    setTimeout(() => {
      navigate("/app/schedule");
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          onClick={() => navigate("/app/schedule")}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </button>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          CREATE LIVE SCHEDULE
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">Schedule</span> Your AI Twin Live
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Choose the product, platform and timing. Your AI Twin will use the
          selected product knowledge during this live session.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Select Product">
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
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
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
                placeholder="Ex: Glow Serum Evening Sale"
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
              />
            </Field>
          </div>

          <div className="mt-6">
            <h2 className="font-black">Select Platforms</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose where your AI Twin should go live.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map(({ name, icon: Icon }) => {
                const active = selectedPlatforms.includes(name);

                return (
                  <button
                    key={name}
                    onClick={() => togglePlatform(name)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                      active
                        ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                        : "border-border bg-background"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <p className="mt-3 font-black">{name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
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
              className="mt-3 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-[var(--brand-pink)]"
              rows="5"
              placeholder="Describe what your AI Twin should talk about in this live..."
            />
          </Field>

          <button
            onClick={saveSchedule}
            disabled={!date || !time || selectedPlatforms.length === 0}
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Schedule
          </button>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Live Preview</h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Radio className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-black">
              {title || `${product} Live Sale`}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">{product}</p>

            <div className="mt-5 space-y-3">
              <Info icon={Calendar} label="Date" value={date || "Not selected"} />
              <Info icon={Clock} label="Time" value={time || "Not selected"} />
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
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-600">
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
      <label className="text-sm font-bold">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </div>
      <p className="mt-2 text-sm font-black">{value}</p>
    </div>
  );
}