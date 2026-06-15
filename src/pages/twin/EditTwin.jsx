import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  CheckCircle2,
  FileText,
  Languages,
  Mic,
  Save,
  ScanFace,
  Shirt,
  Sparkles,
  Upload,
  UserCircle2,
  Volume2,
} from "lucide-react";

const avatars = [
  { name: "Beauty Creator", image: "/images/bb.png" },
  { name: "Sales Expert", image: "/images/dd.png" },
  { name: "Fashion Host", image: "/images/1.jpeg" },
  { name: "Tech Reviewer", image: "/images/2.jpeg" },
];

const backgrounds = [
  { name: "Studio", image: "/images/ff.png" },
  { name: "Pink Store", image: "/images/hh.png" },
  { name: "Luxury", image: "/images/gg.png" },
  
  { name: "Live Stage", image: "/images/ee.png" },
];

const voices = [
  "Warm Female",
  "Soft Female",
  "Luxury Female",
  "Young Male",
  "Professional Male",
  "Energetic Creator",
];

const languages = [
  "English",
  "Tamil",
  "Hindi",
  "Malayalam",
  "Telugu",
  "Kannada",
  "Arabic",
  "French",
  "German",
  "Spanish",
];

const outfits = ["Professional", "Casual", "Creator", "Luxury", "Business"];
const gestures = ["Friendly", "Energetic", "Confident", "Expressive"];

export default function EditTwin() {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("My AI Twin");
  const [brand, setBrand] = useState("My Brand");
  const [avatar, setAvatar] = useState("/images/bb.png");
  const [background, setBackground] = useState("/images/bg1.jpg");
  const [voice, setVoice] = useState("Warm Female");
  const [language, setLanguage] = useState("English");
  const [style, setStyle] = useState("Professional");
  const [gesture, setGesture] = useState("Friendly");
  const [trainingText, setTrainingText] = useState("");

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 text-foreground placeholder:text-muted-foreground outline-none transition-all duration-300 focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

  useEffect(() => {
    const savedTwin = JSON.parse(localStorage.getItem("aiTwin") || "{}");

    setName(savedTwin?.name || localStorage.getItem("twinName") || "My AI Twin");
    setBrand(savedTwin?.brand || localStorage.getItem("twinBrand") || "My Brand");
    setAvatar(savedTwin?.image || localStorage.getItem("twinImage") || "/images/bb.png");
    setBackground(savedTwin?.background || localStorage.getItem("twinBackground") || "/images/bg1.jpg");
    setVoice(savedTwin?.voice || localStorage.getItem("voiceStyle") || "Warm Female");
    setLanguage(savedTwin?.language || localStorage.getItem("twinLanguage") || "English");
    setStyle(savedTwin?.style || localStorage.getItem("twinOutfit") || "Professional");
    setGesture(savedTwin?.gesture || localStorage.getItem("gestureStyle") || "Friendly");
    setTrainingText(savedTwin?.trainingText || localStorage.getItem("trainingText") || "");
  }, []);

  const saveTwin = () => {
    const updatedTwin = {
      id: "default-twin",
      name: name.trim() || "My AI Twin",
      brand: brand.trim() || "My Brand",
      image: avatar,
      background,
      voice,
      language,
      style,
      gesture,
      trainingText: trainingText.trim(),
      status: "Active",
      updatedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("hasTwin", "true");
    localStorage.setItem("aiTwin", JSON.stringify(updatedTwin));
    localStorage.setItem("twinName", updatedTwin.name);
    localStorage.setItem("twinBrand", updatedTwin.brand);
    localStorage.setItem("twinImage", updatedTwin.image);
    localStorage.setItem("twinBackground", updatedTwin.background);
    localStorage.setItem("voiceStyle", updatedTwin.voice);
    localStorage.setItem("twinLanguage", updatedTwin.language);
    localStorage.setItem("twinOutfit", updatedTwin.style);
    localStorage.setItem("gestureStyle", updatedTwin.gesture);
    localStorage.setItem("trainingText", updatedTwin.trainingText);

    setSaved(true);

    setTimeout(() => {
      navigate("/app/twin");
    }, 1000);
  };

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_400px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          type="button"
          onClick={() => navigate("/app/twin")}
          className="mb-5 flex items-center gap-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Twin
        </button>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          EDIT AI TWIN
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Edit Your <span className="brand-text">AI Twin</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Update your single AI Twin identity, voice, language, appearance and brand style.
        </p>

        <div className="mt-8 space-y-6">
          <Card icon={UserCircle2} title="Basic Info">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="AI Twin Name" icon={UserCircle2}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="My AI Twin"
                />
              </Field>

              <Field label="Brand Name" icon={Sparkles}>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className={inputClass}
                  placeholder="My Brand"
                />
              </Field>
            </div>

            <Field label="Brand / Personality Description" icon={FileText}>
              <textarea
                value={trainingText}
                onChange={(e) => setTrainingText(e.target.value)}
                rows={5}
                className={`${inputClass} resize-none rounded-2xl p-4`}
                placeholder="Describe your AI Twin personality, brand tone and audience..."
              />
            </Field>
          </Card>

          <Card icon={ScanFace} title="Avatar Appearance">
            <div className="rounded-2xl border-2 border-dashed border-border bg-background p-6 text-center transition hover:border-[var(--brand-pink)]">
              <Upload className="mx-auto h-8 w-8 text-[var(--brand-pink)]" />

              <p className="mt-3 text-sm font-black tracking-tight text-foreground">
                Upload New Photo / Video
              </p>

              <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                Optional. Use default avatars below if you do not upload.
              </p>
            </div>

            <SectionTitle icon={ScanFace} title="Choose Avatar" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {avatars.map((item) => (
                <ChoiceImage
                  key={item.name}
                  active={avatar === item.image}
                  image={item.image}
                  title={item.name}
                  onClick={() => setAvatar(item.image)}
                />
              ))}
            </div>

            <SectionTitle icon={Camera} title="Choose Background" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {backgrounds.map((item) => (
                <ChoiceImage
                  key={item.name}
                  active={background === item.image}
                  image={item.image}
                  title={item.name}
                  onClick={() => setBackground(item.image)}
                />
              ))}
            </div>
          </Card>

          <Card icon={Mic} title="Voice, Language & Style">
            <SectionTitle icon={Volume2} title="Voice" />
            <ButtonGrid items={voices} selected={voice} setSelected={setVoice} />

            <SectionTitle icon={Languages} title="AI Language" />
            <ButtonGrid
              items={languages}
              selected={language}
              setSelected={setLanguage}
            />

            <SectionTitle icon={Shirt} title="Outfit Style" />
            <ButtonGrid items={outfits} selected={style} setSelected={setStyle} />

            <SectionTitle icon={BadgeCheck} title="Gesture Style" />
            <ButtonGrid
              items={gestures}
              selected={gesture}
              setSelected={setGesture}
            />
          </Card>

          <button
            type="button"
            onClick={saveTwin}
            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black tracking-tight brand-text">
          Live Preview
        </h2>

        <div className="relative mt-5 overflow-hidden rounded-3xl border border-border bg-background">
          <img
            src={background}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />

          <img
            src={avatar}
            alt="AI Twin"
            className="relative z-10 mx-auto h-96 object-contain"
          />
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-background p-5 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-lg font-black leading-tight tracking-tight text-foreground">
              {name || "My AI Twin"}
            </p>

            <p className="text-sm font-medium leading-tight text-muted-foreground">
              {brand || "My Brand"}
            </p>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 dark:bg-emerald-900/20">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Active AI Twin
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <Info label="Voice" value={voice} />
            <Info label="Language" value={language} />
            <Info label="Style" value={style} />
            <Info label="Gesture" value={gesture} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/app/twin/test")}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
        >
          <BadgeCheck className="h-4 w-4" />
          Test Twin
        </button>

        {saved && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            AI Twin updated successfully
          </div>
        )}
      </aside>
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-5 w-5" />
        </div>

        <h2 className="text-xl font-black tracking-tight brand-text">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
        {Icon && <Icon className="h-4 w-4 text-[var(--brand-pink)]" />}
        {label}
      </label>

      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="mb-4 mt-6 flex items-center gap-2">
      <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
      <h3 className="text-base font-black tracking-tight text-foreground">
        {title}
      </h3>
    </div>
  );
}

function ChoiceImage({ image, title, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 dark:bg-white/10"
          : "border-border bg-card"
      }`}
    >
      <img
        src={image}
        alt={title}
        className="h-32 w-full rounded-xl object-cover"
      />

      <p className="mt-3 text-sm font-black tracking-tight text-foreground">
        {title}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {active ? "Selected" : "Click to select"}
        </p>

        {active && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      </div>
    </button>
  );
}

function ButtonGrid({ items, selected, setSelected }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => setSelected(item)}
          className={`rounded-[5px] border px-4 py-3 text-sm font-bold tracking-wide transition ${
            selected === item
              ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
              : "border-border bg-card text-foreground hover:border-[var(--brand-pink)]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-3">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>

      <span className="text-right text-sm font-black tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}