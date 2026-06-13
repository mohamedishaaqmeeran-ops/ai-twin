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
} from "lucide-react";

export default function CreateTwin() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [style, setStyle] = useState("Professional");
  const [voice, setVoice] = useState("Warm Female");
  const [trainingText, setTrainingText] = useState("");

const steps = [
  { title: "Basic Info", icon: UserCircle2 },
  { title: "Appearance", icon: ScanFace },
  { title: "Voice", icon: Mic },
  { title: "Lip Sync", icon: BadgeCheck },
  { title: "Train AI", icon: FileText },
  { title: "Preview", icon: BadgeCheck },
];

  const finishCreate = () => {
    localStorage.setItem("hasTwin", "true");
    localStorage.setItem("twinName", name || "My AI Twin");
    localStorage.setItem("twinImage", "/images/dd.png");
    localStorage.setItem("lipSyncEnabled", "true");
    navigate("/app/twin");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            CREATE AI TWIN
          </span>

          <h1 className="mt-5 text-3xl font-black sm:text-4xl">
            <span className="brand-text">Create / Train</span> Your AI Twin
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create your digital sales avatar, train it with brand knowledge,
            then use it to sell products during live sessions.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ title, icon: Icon }, index) => (
            <button
              key={title}
              onClick={() => setStep(index + 1)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                step === index + 1
                  ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    step === index + 1
                      ? "bg-white text-[var(--brand-pink)]"
                      : "bg-pink-50 text-[var(--brand-pink)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <p className="text-sm font-black">{title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-background p-5 sm:p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black brand-text">Basic Info</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Name your AI Twin and describe your brand.
              </p>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-5 w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
                placeholder="Twin name ex: Neha's Twin"
              />

              <textarea
                className="mt-4 w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
                rows="5"
                placeholder="Describe your brand, business and audience"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-black brand-text">Appearance</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a photo/video and choose your twin style.
              </p>

              <div className="mt-5 rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center">
                <Upload className="mx-auto text-[var(--brand-pink)]" />
                <p className="mt-3 font-bold">Upload your photo or video</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This will be used to create your AI Twin.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Professional", "Casual", "Creator"].map((x) => (
                  <button
                    key={x}
                    onClick={() => setStyle(x)}
                    className={`rounded-[5px] border px-4 py-3 text-sm font-bold transition ${
                      style === x
                        ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                        : "border-border bg-card hover:border-[var(--brand-pink)]"
                    }`}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-black brand-text">Voice Setup</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose how your AI Twin should sound during live selling.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Warm Female", "Energetic", "Professional"].map((x) => (
                  <button
                    key={x}
                    onClick={() => setVoice(x)}
                    className={`rounded-2xl border p-4 text-left font-bold transition ${
                      voice === x
                        ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                        : "border-border bg-card hover:border-[var(--brand-pink)]"
                    }`}
                  >
                    <Mic className="mb-3 h-5 w-5" />
                    {x}
                  </button>
                ))}
              </div>

              <button className="mt-5 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 py-3 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50">
                Record Voice Sample
              </button>
            </div>
          )}


{step === 4 && (
  <div>
    <h2 className="text-xl font-black brand-text">Lip Sync Setup</h2>
    <p className="mt-1 text-sm text-muted-foreground">
      Test how your AI Twin mouth movement matches the selected voice.
    </p>

    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <img
          src="/images/bb.png"
          alt="Lip Sync Preview"
          className="h-72 w-full rounded-2xl object-cover"
        />

        <div className="mt-4 rounded-2xl bg-pink-50 p-4">
          <p className="font-bold text-[var(--brand-pink)]">
            Lip Sync Status
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Voice and face movement will be synced during live sessions.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-black">Test Script</h3>

        <textarea
          rows="7"
          className="mt-4 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-[var(--brand-pink)]"
          defaultValue="Hi everyone! I am your AI Twin. Today I am going to show you this amazing product and answer your questions live."
        />

        <button className="brand-gradient mt-4 w-full rounded-[5px] py-3 text-sm font-bold text-white">
          Generate Lip Sync Preview
        </button>
      </div>
    </div>
  </div>
)}


          {step === 5 && (
            <div>
              <h2 className="text-xl font-black brand-text">Train Your AI</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add knowledge so your AI Twin can answer customer questions.
              </p>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border-2 border-dashed border-border bg-card p-6">
                  <Upload className="text-[var(--brand-pink)]" />
                  <p className="mt-3 font-bold">
                    Upload PDFs, Docs, Product Catalog
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Brand files, FAQs, policies, product info.
                  </p>
                </div>

                <textarea
                  value={trainingText}
                  onChange={(e) => setTrainingText(e.target.value)}
                  className="rounded-2xl border border-border bg-card p-4 text-sm outline-none focus:border-[var(--brand-pink)]"
                  rows="8"
                  placeholder="Example: Our brand sells skincare products. Our target customers are women aged 18-35..."
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-xl font-black brand-text">
                Preview Your AI Twin
              </h2>

              <div className="mt-5 rounded-2xl border border-border bg-pink-50 p-6">
                <p className="font-bold">Hi! I’m {name || "your AI Twin"}.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  I can go live, answer customer questions and sell your
                  products 24/7.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className="rounded-[5px] border-2 border-[var(--brand-pink)] px-6 py-3 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
          >
            Back
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="brand-gradient flex items-center gap-2 rounded-[5px] px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={finishCreate}
              className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
            >
              Finalize & Save Twin
            </button>
          )}
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black brand-text">AI Twin Preview</h2>

        <div className="brand-gradient mt-5 rounded-3xl">
          <img
            src="/images/bb.png"
            alt="AI Twin"
            className="h-80 w-full rounded-2xl object-cover"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <p className="font-bold">Hi! I’m {name || "your AI Twin"}.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            I’m ready to engage, answer and sell for you.
          </p>
        </div>

        <button
  onClick={() => navigate("/app/twin/test")}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 hover:shadow-md"
>
  <Sparkles size={18} />
  Test Twin
</button>
      </aside>
    </div>
  );
}