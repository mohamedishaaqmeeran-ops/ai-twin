import { useState } from "react";
import { Mic, Sparkles, Check, Leaf, Gamepad2, Minimize2, Zap, Palette } from "lucide-react";
import GradientButton from "../components/GradientButton";

const voices = ["Nova", "Alloy", "Shimmer", "Coral", "Fable", "Sage", "Onyx", "Echo", "Ash"];
const styles = [
  { label: "Natural", Icon: Leaf },
  { label: "Luxe", Icon: Sparkles },
  { label: "Playful", Icon: Gamepad2 },
  { label: "Minimal", Icon: Minimize2 },
  { label: "Bold", Icon: Zap },
];

export default function Portrait() {
  const [style, setStyle] = useState("Natural");
  const [voice, setVoice] = useState("Nova");
  const [ready, setReady] = useState(false);
  const [prompt, setPrompt] = useState(
    "warm friendly female creator, mid-twenties, soft pink lighting",
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-3 flex items-center gap-2 text-xl font-extrabold">
          <Sparkles className="h-5 w-5 text-violet-500" />
          Avatar Identity
        </p>
        {/* NAME INPUT */}
        <div>
          <label className="mb-2 block text-sm text-base font-extrabold">Name</label>
          <input
            type="text"
            placeholder="My AI twin..."
            className="w-full mb-5 rounded-[5px] border border-border bg-card px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
          />
        </div>

        {/* PROMPT TEXTAREA */}
        <div className="mb-5">
          <label className="mb-2 block text-sm text-base font-extrabold">
            Short Bio (used by AI to talk like you)
          </label>
          <textarea
            placeholder={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-[5px] border border-border bg-card px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
          />
        </div>

        {/* STYLE */}
        <p className="flex items-center gap-2 text-base font-extrabold">
          <Palette className="h-5 w-5" /> Style
        </p>

       <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
  {styles.map(({ label, Icon }) => (
    <button
      key={label}
      onClick={() => setStyle(label)}
      className={`flex items-center justify-center sm:justify-start gap-2 rounded-2xl border-2 px-3 py-3 text-base cursor-pointer font-semibold transition ${
        style === label
          ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
          : "border-border bg-card text-foreground hover:border-foreground/20"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm sm:text-base">{label}</span>
    </button>
  ))}
</div>

        {/* VOICE */}
        <p className="mt-6 flex items-center gap-2 text-base font-extrabold">
          <Mic className="h-5 w-5" /> Voice
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {voices.map((v) => (
            <button
              key={v}
              onClick={() => setVoice(v)}
              className={`rounded-[5px] border-2 px-3 py-3 cursor-pointer text-base font-semibold transition ${
                voice === v
                  ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                  : "border-border bg-card text-foreground hover:border-foreground/20"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* GENERATE */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <p className="flex items-center gap-2 text-base font-extrabold">
          <Sparkles className="h-5 w-5 text-violet-500" /> Generate Twin Portrait
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          AI generates a hero portrait of your twin (Gemini Nano Banana).
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="mt-4 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
        />

        <div className="mt-5">
          <GradientButton icon={<Sparkles className="h-5 w-5" />} onClick={() => setReady(true)}>
            Generate avatar
          </GradientButton>
        </div>

        {/* RESULT */}
        <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-b from-pink-50 to-orange-50">
          {ready ? (
            <div className="relative aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80"
                alt="Generated twin"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold shadow-md">
                <Check className="h-4 w-4 text-[var(--brand-pink)]" strokeWidth={3} />
                Avatar Ready
              </span>
            </div>
          ) : (
            <div className="grid aspect-[3/4] place-items-center text-center">
              <div>
                <Sparkles className="mx-auto h-8 w-8 text-[var(--brand-pink)]" />
                <p className="mt-3 text-sm font-semibold text-muted-foreground">
                  Your generated avatar will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
