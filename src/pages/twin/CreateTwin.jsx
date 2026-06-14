import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Mic,
  Sparkles,
  ArrowRight,
  ScanFace,
  UserCircle2,
  FileText,
  BadgeCheck,
  Image,
  Shirt,
  Hand,
  Play,
  Volume2,
  Globe,
  Link2,
} from "lucide-react";

const avatars = [
  { name: "Beauty Creator", image: "/images/bb.png" },
  { name: "Sales Expert", image: "/images/dd.png" },
  { name: "Fashion Host", image: "/images/1.jpeg" },
  { name: "Tech Reviewer", image: "/images/2.jpeg" },
];

const backgrounds = [
  { name: "Pink Store", image: "/images/hh.png" },
  { name: "Studio", image: "/images/ff.png" },
  { name: "Luxury", image: "/images/ee.png" },
  { name: "Live Stage", image: "/images/gg.png" },
];

const outfits = ["Professional", "Casual", "Creator", "Luxury", "Business"];
const gestures = ["Friendly", "Energetic", "Confident", "Expressive"];

const languages = [
  "English", "Arabic", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Marathi", "Gujarati", "Punjabi", "Bengali", "Urdu", "Odia", "Assamese",
  "Nepali", "Sinhala", "Chinese (Mandarin)", "Chinese (Cantonese)", "Japanese",
  "Korean", "Thai", "Vietnamese", "Indonesian", "Malay", "Filipino",
  "Burmese", "Khmer", "Lao", "Mongolian", "Spanish", "Portuguese", "French",
  "German", "Italian", "Dutch", "Russian", "Ukrainian", "Polish", "Turkish",
  "Greek", "Romanian", "Hungarian", "Czech", "Slovak", "Swedish", "Norwegian",
  "Danish", "Finnish", "Icelandic", "Irish", "Welsh", "Hebrew",
  "Persian (Farsi)", "Pashto", "Kurdish", "Swahili", "Amharic", "Yoruba",
  "Igbo", "Zulu", "Afrikaans", "Hausa", "Somali", "Latin",
];

const voices = [
  "Warm Female",
  "Soft Female",
  "Luxury Female",
  "Young Male",
  "Professional Male",
  "Energetic Creator",
];

export default function CreateTwin() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [avatar, setAvatar] = useState("/images/bb.png");
  const [background, setBackground] = useState("/images/ff.png");
  const [style, setStyle] = useState("Professional");
  const [gesture, setGesture] = useState("Friendly");
  const [voice, setVoice] = useState("Warm Female");
  const [language, setLanguage] = useState("English");
  const [lipScript, setLipScript] = useState(
    "Hi everyone! I am your AI Twin. Today I am going to show you this amazing product and answer your questions live."
  );
  const [trainingText, setTrainingText] = useState("");

  const steps = [
    { title: "Basic Info", icon: UserCircle2 },
    { title: "Appearance", icon: ScanFace },
    { title: "Voice", icon: Mic },
    { title: "Lip Sync", icon: BadgeCheck },
    { title: "Train AI", icon: FileText },
    { title: "Preview", icon: BadgeCheck },
  ];

  const backgroundName =
    backgrounds.find((item) => item.image === background)?.name || "Selected";

  const finishCreate = () => {
    localStorage.setItem("hasTwin", "true");
    localStorage.setItem("twinName", name || "My AI Twin");
    localStorage.setItem("twinBrand", brand || "My Brand");
    localStorage.setItem("twinImage", avatar);
    localStorage.setItem("twinBackground", background);
    localStorage.setItem("twinOutfit", style);
    localStorage.setItem("gestureStyle", gesture);
    localStorage.setItem("voiceStyle", voice);
    localStorage.setItem("voiceLanguage", language);
    localStorage.setItem("lipSyncEnabled", "true");
    localStorage.setItem("trainingText", trainingText);
    localStorage.setItem("isTwinTrained", trainingText.trim() ? "true" : "false");

    navigate("/app/twin");
  };

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          CREATE AI TWIN
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">Create / Train</span> Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Create your avatar, choose background, voice, lip sync and train it
          with your brand knowledge.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ title, icon: Icon }, index) => (
            <button
              key={title}
              onClick={() => setStep(index + 1)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                step === index + 1
                  ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <p className="text-sm font-black tracking-tight">{title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-background p-5 sm:p-6">
          {step === 1 && (
            <StepCard title="Basic Info" desc="Name your AI Twin and brand.">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Twin name ex: Neha's Twin"
                className="mt-5 w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
              />

              <textarea
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                rows={5}
                placeholder="Describe your brand, audience and products..."
                className="mt-4 w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
              />
            </StepCard>
          )}

          {step === 2 && (
            <StepCard
              title="Appearance"
              desc="Choose avatar, background, outfit and gesture style."
            >
              <div className="mt-5 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-accent sm:p-10">
                <Upload className="h-12 w-12 text-[var(--brand-pink)]" />

                <p className="mt-4 text-lg font-black tracking-tight text-foreground">
                  Upload Photo or Video
                </p>

                <p className="mt-2 max-w-md text-center text-sm leading-6 text-muted-foreground">
                  JPG, PNG or MP4 supported. Optional, you can use default
                  avatars below.
                </p>
              </div>

              <SectionTitle icon={ScanFace} title="Default Avatars" />

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

              <SectionTitle icon={Image} title="Backgrounds" />

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

              <SectionTitle icon={Shirt} title="Outfit Style" />

              <ButtonGrid
                items={outfits}
                selected={style}
                setSelected={setStyle}
              />

              <SectionTitle icon={Hand} title="Gesture Style" />

              <ButtonGrid
                items={gestures}
                selected={gesture}
                setSelected={setGesture}
              />
            </StepCard>
          )}

          {step === 3 && (
            <StepCard
              title="Voice Setup"
              desc="Choose your AI Twin voice and language."
            >
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {voices.map((x) => (
                  <button
                    key={x}
                    onClick={() => setVoice(x)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                      voice === x
                        ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                        : "border-border bg-card text-foreground hover:border-[var(--brand-pink)]"
                    }`}
                  >
                    <Mic className="mb-3 h-5 w-5 text-[var(--brand-pink)]" />
                    <p className="text-base font-black tracking-tight">{x}</p>

                    <p className="mt-2 text-xs font-bold text-muted-foreground">
                      Play sample
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-black text-foreground">
                  AI Voice Language
                </label>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <button className="mt-6 flex items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10">
                <Mic className="h-4 w-4" />
                Record Voice Sample
              </button>
            </StepCard>
          )}

          {step === 4 && (
            <StepCard
              title="Lip Sync Setup"
              desc="Test how mouth movement matches the selected voice."
            >
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="relative overflow-hidden rounded-2xl bg-pink-50 dark:bg-white/10">
                    <img
                      src={avatar}
                      alt="Lip Sync Preview"
                      className="h-72 w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-card/90 p-3 text-sm font-black tracking-tight text-foreground shadow backdrop-blur">
                      Voice: {voice}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border bg-accent p-4">
                    <p className="text-sm font-black tracking-tight text-[var(--brand-pink)]">
                      Lip Sync Status
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Voice and face movement will be synced during live
                      sessions.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-base font-black tracking-tight text-foreground">
                    Test Script
                  </h3>

                  <textarea
                    value={lipScript}
                    onChange={(e) => setLipScript(e.target.value)}
                    rows={7}
                    className="mt-4 w-full rounded-2xl border border-border bg-background p-4 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
                  />

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button className="brand-gradient rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90">
                      Generate Preview
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10">
                      <Play className="h-4 w-4" />
                      Play
                    </button>
                  </div>
                </div>
              </div>
            </StepCard>
          )}

          {step === 5 && (
            <StepCard
              title="Train Your AI"
              desc="Add knowledge sources for better product selling and customer answers."
            >
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <TrainingCard icon={Upload} title="Upload Files" desc="PDF, DOCX, TXT, CSV" />
                <TrainingCard icon={Link2} title="Website URL" desc="Import brand website" />
                <TrainingCard icon={Globe} title="FAQ / Policies" desc="Shipping, refund, COD" />
                <TrainingCard icon={Volume2} title="Voice Notes" desc="Train using speech notes" />
              </div>

              <textarea
                value={trainingText}
                onChange={(e) => setTrainingText(e.target.value)}
                rows={8}
                placeholder="Example: Our brand sells skincare products. Our target customers are women aged 18-35..."
                className="mt-5 w-full rounded-2xl border border-border bg-card p-4 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
              />
            </StepCard>
          )}

          {step === 6 && (
            <StepCard
              title="Preview Your AI Twin"
              desc="Review your AI Twin before saving."
            >
              <div className="mt-6 grid gap-6">
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <div className="relative h-[420px] sm:h-[520px]">
                    <img
                      src={background}
                      alt="Background"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/20" />

                    <img
                      src={avatar}
                      alt="AI Twin"
                      className="relative z-10 h-full w-full object-contain"
                    />

                    <div className="absolute left-4 top-4 z-20 rounded-full bg-green-100 px-3 py-1 text-xs font-bold tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      ● Ready
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                  <h2 className="text-2xl font-black tracking-tight brand-text">
                    {name || "Your AI Twin"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Your AI Twin is trained to engage customers, answer
                    questions and sell products automatically across live
                    platforms.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Info label="Brand" value={brand || "My Brand"} />
                    <Info label="Avatar" value="Selected" />
                    <Info label="Background" value={backgroundName} />
                    <Info label="Outfit" value={style} />
                    <Info label="Gesture Style" value={gesture} />
                    <Info label="Voice" value={voice} />
                    <Info label="Language" value={language} />
                    <Info label="Lip Sync" value="Enabled" />
                    <Info
                      label="Training"
                      value={
                        trainingText.trim()
                          ? "Knowledge Added"
                          : "No Training Data"
                      }
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                  <h3 className="text-lg font-black tracking-tight text-foreground">
                    AI Twin Capabilities
                  </h3>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Capability title="Live Product Selling" value="Enabled" />
                    <Capability title="Customer Q&A" value="Enabled" />
                    <Capability title="Multilingual Voice" value={language} />
                    <Capability title="AI Personalization" value="Active" />
                  </div>
                </div>
              </div>
            </StepCard>
          )}
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className="rounded-[5px] border-2 border-[var(--brand-pink)] px-6 py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
          >
            Back
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="brand-gradient flex items-center gap-2 rounded-[5px] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={finishCreate}
              className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              Finalize & Save Twin
            </button>
          )}
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black tracking-tight brand-text">
          AI Twin Live Preview
        </h2>

        <div className="relative mt-5 overflow-hidden rounded-3xl border border-border">
          <img
            src={background}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />

          <img
            src={avatar}
            alt="AI Twin"
            className="relative z-10 h-96 w-full object-contain"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <p className="text-lg font-black tracking-tight text-foreground">
            Hi! I'm {name || "Your AI Twin"}
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Ready to engage customers, answer questions and sell products
            automatically.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <Info label="Background" value={backgroundName} />
          <Info label="Style" value={style} />
          <Info label="Voice" value={voice} />
          <Info label="Language" value={language} />
          <Info label="Gesture" value={gesture} />
          <Info label="Lip Sync" value="Enabled" />
        </div>

        <button
          onClick={() => navigate("/app/twin/test")}
          className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
        >
          <Sparkles size={18} />
          Test Twin
        </button>
      </aside>
    </div>
  );
}

function StepCard({ title, desc, children }) {
  return (
    <div>
      <h2 className="text-xl font-black tracking-tight brand-text">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}

function TrainingCard({ icon: Icon, title, desc }) {
  return (
    <button className="rounded-2xl border-2 border-dashed border-border bg-card p-6 text-left transition hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-white/10">
      <Icon className="h-7 w-7 text-[var(--brand-pink)]" />
      <h3 className="mt-4 text-base font-black tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{desc}</p>
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-black tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}

function Capability({ title, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span className="text-sm font-bold text-foreground">{title}</span>
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
        {value}
      </span>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h3 className="mb-3 mt-6 flex items-center gap-2 text-base font-black tracking-tight text-foreground">
      {Icon && <Icon className="h-4 w-4 text-[var(--brand-pink)]" />}
      {title}
    </h3>
  );
}

function ChoiceImage({ image, title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 shadow-sm dark:bg-white/10"
          : "border-border bg-card"
      }`}
    >
      <img
        src={image}
        alt={title}
        className="h-28 w-full rounded-xl object-cover"
      />

      <p className="mt-3 text-sm font-black tracking-tight text-foreground">
        {title}
      </p>
    </button>
  );
}

function ButtonGrid({ items, selected, setSelected }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <button
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