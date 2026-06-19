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
  Crown,
  Lock,
} from "lucide-react";

const avatars = [
  { name: "Beauty Creator", image: "/images/bb.png", pro: false },
  { name: "Sales Expert", image: "/images/dd.png", pro: false },
  { name: "Fashion Host", image: "/images/1.jpeg", pro: true },
  { name: "Tech Reviewer", image: "/images/2.jpeg", pro: true },
];

const backgrounds = [
  { name: "Pink Store", image: "/images/hh.png", pro: false },
  { name: "Studio", image: "/images/ff.png", pro: false },
  { name: "Luxury", image: "/images/ee.png", pro: true },
  { name: "Live Stage", image: "/images/gg.png", pro: true },
];

const outfits = [
  { name: "Professional", pro: false },
  { name: "Casual", pro: false },
  { name: "Creator", pro: true },
  { name: "Luxury", pro: true },
  { name: "Business", pro: true },
];

const gestures = [
  { name: "Friendly", pro: false },
  { name: "Energetic", pro: false },
  { name: "Confident", pro: true },
  { name: "Expressive", pro: true },
];

const freeLanguages = ["English", "Hindi", "Tamil", "Malayalam", "Arabic"];

const proLanguages = [
  "English",
  "Arabic",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Bengali",
  "Urdu",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Spanish",
  "French",
  "German",
  "Russian",
  "Turkish",
];

const voices = [
  { name: "Warm Female", pro: false },
  { name: "Soft Female", pro: false },
  { name: "Luxury Female", pro: true },
  { name: "Young Male", pro: true },
  { name: "Professional Male", pro: true },
  { name: "Energetic Creator", pro: true },
];

export default function CreateTwin() {
  const navigate = useNavigate();

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";
  const savedTwins = JSON.parse(localStorage.getItem("aiTwins") || "[]");
const maxTwins = isPro ? 3 : 1;
const canCreateTwin = savedTwins.length < maxTwins;
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

  const languages = isPro ? proLanguages : freeLanguages;

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

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const finishCreate = () => {
  const oldTwins = JSON.parse(localStorage.getItem("aiTwins") || "[]");
  const maxTwins = isPro ? 3 : 1;

  if (oldTwins.length >= maxTwins) {
    if (isPro) {
      alert("Pro plan allows maximum 3 avatars.");
    } else {
      navigate("/pricing");
    }
    return;
  }

  const newTwin = {
    id: Date.now(),
    name: name || `AI Twin ${oldTwins.length + 1}`,
    brand: brand || "My Brand",
    image: avatar,
    background,
    outfit: style,
    gesture,
    voice,
    language,
    trainingText,
    plan: isPro ? "pro" : "free",
    createdAt: new Date().toLocaleString(),
  };

  const updatedTwins = [...oldTwins, newTwin];

  localStorage.setItem("aiTwins", JSON.stringify(updatedTwins));
  localStorage.setItem("hasTwin", "true");

  localStorage.setItem("aiTwin", JSON.stringify(newTwin));
  localStorage.setItem("twinName", newTwin.name);
  localStorage.setItem("twinBrand", newTwin.brand);
  localStorage.setItem("twinImage", newTwin.image);
  localStorage.setItem("twinBackground", newTwin.background);
  localStorage.setItem("twinOutfit", newTwin.outfit);
  localStorage.setItem("gestureStyle", newTwin.gesture);
  localStorage.setItem("voiceStyle", newTwin.voice);
  localStorage.setItem("voiceLanguage", newTwin.language);
  localStorage.setItem("trainingText", newTwin.trainingText);
  localStorage.setItem(
    "isTwinTrained",
    trainingText.trim() ? "true" : "false"
  );

  navigate("/app/twin");
};

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}
            {isPro ? "CREATE PRO AI TWIN" : "CREATE AI TWIN"}
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
            {isPro ? "Create / Pro Train" : "Create / Train"}
          </span>{" "}
          Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {isPro
            ? "Create your Pro avatar with premium backgrounds, custom voice, advanced lip sync and complete brand training."
            : "Create your avatar, choose background, voice, lip sync and train it with your brand knowledge."}
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Pro Features
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Premium avatars, custom voice, advanced training and more
                  languages.
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
              desc={
                isPro
                  ? "Choose premium avatar, background, outfit and gesture style."
                  : "Choose avatar, background, outfit and gesture style."
              }
            >
              <div className="mt-5 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-accent sm:p-10">
                <Upload className="h-12 w-12 text-[var(--brand-pink)]" />

                <p className="mt-4 text-lg font-black tracking-tight text-foreground">
                  {isPro ? "Upload Photo or Video" : "Upload Photo"}
                </p>

                <p className="mt-2 max-w-md text-center text-sm leading-6 text-muted-foreground">
                  {isPro
                    ? "JPG, PNG or MP4 supported. Pro users can upload video avatars."
                    : "JPG and PNG supported. Video avatar is available in Pro plan."}
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
                    locked={item.pro && !isPro}
                    onClick={() => {
                      if (item.pro && !isPro) {
                        upgradeToPro();
                        return;
                      }
                      setAvatar(item.image);
                    }}
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
                    locked={item.pro && !isPro}
                    onClick={() => {
                      if (item.pro && !isPro) {
                        upgradeToPro();
                        return;
                      }
                      setBackground(item.image);
                    }}
                  />
                ))}
              </div>

              <SectionTitle icon={Shirt} title="Outfit Style" />

              <ButtonGrid
                items={outfits}
                selected={style}
                setSelected={setStyle}
                isPro={isPro}
                onLockedClick={upgradeToPro}
              />

              <SectionTitle icon={Hand} title="Gesture Style" />

              <ButtonGrid
                items={gestures}
                selected={gesture}
                setSelected={setGesture}
                isPro={isPro}
                onLockedClick={upgradeToPro}
              />
            </StepCard>
          )}

          {step === 3 && (
            <StepCard
              title="Voice Setup"
              desc={
                isPro
                  ? "Choose premium voice, custom style and language."
                  : "Choose your AI Twin voice and language."
              }
            >
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {voices.map((x) => {
                  const locked = x.pro && !isPro;

                  return (
                    <button
                      key={x.name}
                      onClick={() => {
                        if (locked) {
                          upgradeToPro();
                          return;
                        }
                        setVoice(x.name);
                      }}
                      className={`relative rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                        voice === x.name
                          ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                          : "border-border bg-card text-foreground hover:border-[var(--brand-pink)]"
                      }`}
                    >
                      {locked && (
                        <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                          PRO
                        </span>
                      )}

                      <Mic className="mb-3 h-5 w-5 text-[var(--brand-pink)]" />
                      <p className="text-base font-black tracking-tight">
                        {x.name}
                      </p>

                      <p className="mt-2 text-xs font-bold text-muted-foreground">
                        {locked ? "Unlock with Pro" : "Play sample"}
                      </p>
                    </button>
                  );
                })}
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

                {!isPro && (
                  <p className="mt-2 text-xs font-bold text-orange-500">
                    Free plan supports limited languages. Upgrade for global
                    language support.
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  if (!isPro) {
                    upgradeToPro();
                  }
                }}
                className="mt-6 flex items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
              >
                {isPro ? <Mic className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {isPro ? "Record Voice Sample" : "Voice Cloning - Pro"}
              </button>
            </StepCard>
          )}

          {step === 4 && (
            <StepCard
              title="Lip Sync Setup"
              desc={
                isPro
                  ? "HD lip sync enabled for realistic live selling."
                  : "Basic lip sync preview is available. HD lip sync is Pro."
              }
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
                      {isPro
                        ? "HD face and voice movement sync is enabled during live sessions."
                        : "Basic sync enabled. Upgrade to Pro for HD realistic lip sync."}
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
                    <button
                      onClick={() => {
                        if (!isPro) upgradeToPro();
                      }}
                      className="brand-gradient rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                    >
                      {isPro ? "Generate HD Preview" : "Generate Preview"}
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
              desc={
                isPro
                  ? "Use all knowledge sources for smarter product selling and live customer answers."
                  : "Add basic training text. Uploads and website import are Pro features."
              }
            >
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <TrainingCard
                  icon={Upload}
                  title="Upload Files"
                  desc="PDF, DOCX, TXT, CSV"
                  locked={!isPro}
                  onClick={upgradeToPro}
                />
                <TrainingCard
                  icon={Link2}
                  title="Website URL"
                  desc="Import brand website"
                  locked={!isPro}
                  onClick={upgradeToPro}
                />
                <TrainingCard
                  icon={Globe}
                  title="FAQ / Policies"
                  desc="Shipping, refund, COD"
                  locked={false}
                />
                <TrainingCard
                  icon={Volume2}
                  title="Voice Notes"
                  desc="Train using speech notes"
                  locked={!isPro}
                  onClick={upgradeToPro}
                />
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

                    {isPro && (
                      <div className="absolute right-4 top-4 z-20 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                        PRO TWIN
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                  <h2 className="text-2xl font-black tracking-tight brand-text">
                    {name || "Your AI Twin"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {isPro
                      ? "Your Pro AI Twin is trained to engage customers, answer questions, pitch products and sell across multiple live platforms."
                      : "Your AI Twin is trained to engage customers, answer questions and sell products automatically across live platforms."}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Info label="Plan" value={isPro ? "Pro" : "Free"} />
                    <Info label="Brand" value={brand || "My Brand"} />
                    <Info label="Avatar" value="Selected" />
                    <Info label="Background" value={backgroundName} />
                    <Info label="Outfit" value={style} />
                    <Info label="Gesture Style" value={gesture} />
                    <Info label="Voice" value={voice} />
                    <Info label="Language" value={language} />
                    <Info label="Lip Sync" value={isPro ? "HD Enabled" : "Basic Enabled"} />
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
                    <Capability
                      title="AI Personalization"
                      value={isPro ? "Pro Active" : "Basic"}
                    />
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
  (() => {
    const twins = JSON.parse(localStorage.getItem("aiTwins") || "[]");
    const maxTwins = isPro ? 3 : 1;
    const canCreate = twins.length < maxTwins;

    return canCreate ? (
      <button
        onClick={finishCreate}
        className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
      >
        Finalize & Save Twin
      </button>
    ) : (
      <button
        disabled
        className="cursor-not-allowed rounded-[5px] border-2 border-gray-300 bg-gray-100 px-6 py-3 text-sm font-bold tracking-wide text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
      >
        {isPro
          ? "Maximum 3 Avatars Created"
          : "Avatar Already Created"}
      </button>
    );
  })()
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

          {isPro && (
            <div className="absolute right-3 top-3 z-20 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
              PRO
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <p className="text-lg font-black tracking-tight text-foreground">
            Hi! I'm {name || "Your AI Twin"}
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isPro
              ? "Ready to sell with advanced voice, HD lip sync and multi-language support."
              : "Ready to engage customers, answer questions and sell products automatically."}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <Info label="Plan" value={isPro ? "Pro Plan" : "Free Plan"} />
          <Info label="Background" value={backgroundName} />
          <Info label="Style" value={style} />
          <Info label="Voice" value={voice} />
          <Info label="Language" value={language} />
          <Info label="Gesture" value={gesture} />
          <Info label="Lip Sync" value={isPro ? "HD Enabled" : "Basic Enabled"} />
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

function TrainingCard({ icon: Icon, title, desc, locked, onClick }) {
  return (
    <button
      onClick={() => {
        if (locked && onClick) onClick();
      }}
      className="relative rounded-2xl border-2 border-dashed border-border bg-card p-6 text-left transition hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-white/10"
    >
      {locked && (
        <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
          PRO
        </span>
      )}

      {locked ? (
        <Lock className="h-7 w-7 text-[var(--brand-pink)]" />
      ) : (
        <Icon className="h-7 w-7 text-[var(--brand-pink)]" />
      )}

      <h3 className="mt-4 text-base font-black tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {locked ? "Unlock with Pro plan" : desc}
      </p>
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

function ChoiceImage({ image, title, active, onClick, locked }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl border p-3 text-left transition hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 shadow-sm dark:bg-white/10"
          : "border-border bg-card"
      }`}
    >
      {locked && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
          PRO
        </span>
      )}

      <div className={locked ? "opacity-60" : ""}>
        <img
          src={image}
          alt={title}
          className="h-28 w-full rounded-xl object-cover"
        />

        <p className="mt-3 text-sm font-black tracking-tight text-foreground">
          {title}
        </p>
      </div>
    </button>
  );
}

function ButtonGrid({ items, selected, setSelected, isPro, onLockedClick }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const locked = item.pro && !isPro;

        return (
          <button
            key={item.name}
            onClick={() => {
              if (locked) {
                onLockedClick();
                return;
              }
              setSelected(item.name);
            }}
            className={`relative rounded-[5px] border px-4 py-3 text-sm font-bold tracking-wide transition ${
              selected === item.name
                ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                : "border-border bg-card text-foreground hover:border-[var(--brand-pink)]"
            }`}
          >
            {locked && (
              <span className="mr-2 inline-flex align-middle">
                <Lock className="inline h-3 w-3" />
              </span>
            )}
            {item.name}
          </button>
        );
      })}
    </div>
  );
}