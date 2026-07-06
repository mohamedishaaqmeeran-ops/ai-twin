import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Sparkles,
  Mic,
  Play,
  Languages,
  BadgeCheck,
  Volume2,
  AudioLines,
  CheckCircle2,
  Radio,
  UserRound,
  Wand2,
} from "lucide-react";
import Logo from "../components/Logo";
import Nav from "../components/Nav";
export default function TrainVoice() {
   const { user } = useSelector((state) => state.auth || {});
  const voicePath = user ? "/app/twin/create" : "/signin";
  const features = [
    {
      icon: Mic,
      title: "Clone your own voice",
      desc: "Record a short sample and your AI Twin can speak in your real voice — consistent, recognisable, and unmistakably you.",
    },
    {
      icon: Volume2,
      title: "Or pick a ready-made voice",
      desc: "Choose from a library of voice styles — Warm Female, Soft Female, Luxury Female, Young Male, Professional Male, Energetic Creator — each with a sample you can preview first.",
    },
    {
      icon: Languages,
      title: "Multilingual ready",
      desc: "Set your AI Twin's voice language so it can engage audiences in the language they shop in.",
    },
    {
      icon: BadgeCheck,
      title: "Synced lips, not just sound",
      desc: "Voice pairs with our Lip Sync technology, so your AI Twin's mouth movement matches what it's saying — live.",
    },
  ];

  const steps = [
    "Choose a voice style, or record a short sample to clone your own.",
    "Preview the voice with “Play sample” before committing.",
    "Set your AI Twin's language.",
    "Continue to Lip Sync to preview voice and face movement together.",
  ];

  const voices = [
    "Warm Female",
    "Soft Female",
    "Luxury Female",
    "Young Male",
    "Professional Male",
    "Energetic Creator",
  ];

  return (
   <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_460px] lg:items-center lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
                TRAIN YOUR VOICE
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Give your AI Twin a voice
                <br />
                <span className="brand-text">that sounds like you.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Clone your own voice, or choose from a library of natural AI
                voices — then watch it come to life with lip-synced video,
                ready for live selling.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={voicePath}
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Explore Voice Options
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 p-5 dark:bg-white/10">
                <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black tracking-tight brand-text">
                        Voice Studio
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Clone, preview and sync your AI voice
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Mic className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-border bg-card p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                        <AudioLines className="h-8 w-8" />
                      </div>

                      <div>
                        <h3 className="text-lg font-black tracking-tight text-foreground">
                          Warm Female
                        </h3>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                          Natural creator voice
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex h-16 items-center gap-2 rounded-2xl bg-pink-50 px-4 dark:bg-white/10">
                      {[40, 70, 50, 90, 45, 75, 55, 85, 60, 35, 70, 48].map(
                        (height, index) => (
                          <span
                            key={index}
                            className="brand-gradient w-2 rounded-full"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>

                    <button className="brand-gradient mt-5 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white">
                      <Play className="h-4 w-4 fill-current" />
                      Play Sample
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {["English", "Tamil", "Hindi", "Arabic"].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <p className="text-xs font-black tracking-tight text-foreground">
                          {item}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                          Voice language
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={voicePath}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                  >
                    Continue to Voice Step
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Why <span className="brand-text">Voice Matters</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Your AI Twin should not just look like your brand — it should
              sound natural, recognisable and ready to sell.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-black tracking-tight text-foreground">
                  {title}
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                    Choose From Natural{" "}
                    <span className="brand-text">AI Voice Styles</span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                    Preview voice samples before selecting the voice your AI
                    Twin will use in live sessions.
                  </p>
                </div>

                <Link
                  to={voicePath}
                  className="inline-flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Open Voice Step
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {voices.map((voice) => (
                  <div
                    key={voice}
                    className="rounded-3xl border border-border bg-background p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black tracking-tight text-foreground">
                          {voice}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                          Voice sample available
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                        <Volume2 className="h-5 w-5" />
                      </div>
                    </div>

                    <button className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-[5px] border border-border bg-card text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10">
                      <Play className="h-4 w-4 fill-current" />
                      Play Sample
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              How It <span className="brand-text">Works</span>
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-border bg-background p-5"
                >
                  <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white">
                    {index + 1}
                  </span>

                  <p className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-[40px] p-8 text-center text-white shadow-xl sm:p-12">
            <Wand2 className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to give your AI Twin a voice?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
             to={voicePath}
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black tracking-wide text-[var(--brand-pink)] transition hover:opacity-90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
        <footer className="border-t border-border bg-[#0d0d12]">
        <p className="px-4 py-5 text-center text-sm font-medium tracking-wide text-white/50">
          © {new Date().getFullYear()} Twinn. All rights reserved.
        </p>
      </footer>
    </div>
  );
}