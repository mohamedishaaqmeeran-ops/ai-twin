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
    "warm friendly female creator, mid-twenties, soft pink lighting"
  );

  return (
    <div className="space-y-8">
      {/* Avatar Identity */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-black">
          <Sparkles className="h-5 w-5 text-violet-500" />
          Avatar Identity
        </h2>

        {/* Name */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold">
            Name
          </label>

          <input
            type="text"
            placeholder="My AI Twin..."
            className="w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
          />
        </div>

        {/* Bio */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-bold">
            Short Bio (used by AI to talk like you)
          </label>

          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full resize-none rounded-[5px] border border-border bg-card px-4 py-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
          />
        </div>

        {/* Style */}
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold">
            <Palette className="h-5 w-5" />
            Style
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {styles.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => setStyle(label)}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-4 text-sm font-semibold transition sm:justify-start ${
                  style === label
                    ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                    : "border-border bg-card hover:border-foreground/20"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <Mic className="h-5 w-5" />
            Voice
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {voices.map((v) => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className={`rounded-[5px] border-2 px-4 py-3 text-sm font-semibold transition ${
                  voice === v
                    ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)]"
                    : "border-border bg-card hover:border-foreground/20"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Portrait */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-black">
          <Sparkles className="h-5 w-5 text-violet-500" />
          Generate Twin Portrait
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          AI generates a hero portrait of your twin (Gemini Nano Banana).
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="mt-5 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
        />

        <div className="mt-6">
          <GradientButton
            icon={<Sparkles className="h-5 w-5" />}
            onClick={() => setReady(true)}
          >
            Generate Avatar
          </GradientButton>
        </div>

        {/* Result */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-b from-pink-50 to-orange-50">
          {ready ? (
            <div className="relative aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80"
                alt="Generated twin"
                className="h-full w-full object-cover"
              />

              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-md">
                <Check
                  className="h-4 w-4 text-[var(--brand-pink)]"
                  strokeWidth={3}
                />
                Avatar Ready
              </span>
            </div>
          ) : (
            <div className="grid aspect-[3/4] place-items-center text-center">
              <div>
                <Sparkles className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

                <p className="mt-4 text-sm font-medium text-muted-foreground">
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
