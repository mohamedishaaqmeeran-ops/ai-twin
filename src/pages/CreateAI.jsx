import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Sparkles,
  ScanFace,
  Image,
  Wand2,
  ListChecks,
  UserRound,
  Mic,
  Eye,
  Brain,
  Radio,
} from "lucide-react";
import Nav from "../components/Nav";

export default function CreateAI() {
  const { user } = useSelector((state) => state.auth || {});
const createTwinPath = user ? "/app/twin/create" : "/signin";
  const features = [
    {
      icon: ScanFace,
      title: "Choose your look",
      desc: "Pick from ready-made avatar styles — Beauty Creator, Sales Expert, Fashion Host, Tech Reviewer — or customise one to match your brand.",
    },
    {
      icon: Image,
      title: "Set the scene",
      desc: "Choose a background — Pink Store, Studio, Luxury, Live Stage — and an outfit style, from Professional to Creator to Luxury.",
    },
    {
      icon: Wand2,
      title: "No design skills needed",
      desc: "Every option is ready to use out of the box — no editing software, no professional photography, no production team.",
    },
    {
      icon: ListChecks,
      title: "The first step of a 6-step setup",
      desc: "Create AI Twin is step 1 of 6: Basic Info, Appearance, Voice, Lip Sync, Train AI and Preview — all guided, in one dashboard.",
    },
  ];

  const steps = [
    "Name your AI Twin and describe your brand, audience and products.",
    "Choose your avatar's appearance — face, background, outfit and gesture style.",
    "Continue to Train Your Voice to give your AI Twin a voice.",
    "Preview your AI Twin before it ever goes live.",
  ];

  const setupSteps = [
    { icon: UserRound, title: "Basic Info" },
    { icon: ScanFace, title: "Appearance" },
    { icon: Mic, title: "Voice" },
    { icon: Eye, title: "Lip Sync" },
    { icon: Brain, title: "Train AI" },
    { icon: Radio, title: "Preview" },
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
                CREATE AI TWIN
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Meet your digital twin.
                <br />
                <span className="brand-text">Built in minutes.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Design an AI avatar that looks, sounds and sells like you —
                choose a face, a voice, a background and a style, then put it to
                work going live for your brand 24/7.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={createTwinPath}
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Start Building
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
                        AI Twin Builder
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Appearance, voice and style setup
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <ScanFace className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl bg-pink-50 dark:bg-white/10">
                    <img
                      src="/images/bbb.png"
                      alt="Create AI Twin"
                      className="h-[360px] w-full object-cover"
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      "Beauty Creator",
                      "Sales Expert",
                      "Fashion Host",
                      "Tech Reviewer",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <p className="text-xs font-black tracking-tight text-foreground">
                          {item}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                          Avatar style
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={createTwinPath}
                    className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
                  >
                    Start Building
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
              Why <span className="brand-text">Start Here</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Your AI Twin starts with a face, voice, style and brand
              personality — all guided in one simple flow.
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
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                The 6-Step <span className="brand-text">Setup Flow</span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Create AI Twin is step 1 of your complete AI live commerce
                setup.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
                {setupSteps.map(({ icon: Icon, title }, index) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-border bg-background p-5 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Icon className="h-6 w-6" />
                    </div>

                    <p className="mt-4 text-xs font-black tracking-wide text-[var(--brand-pink)]">
                      STEP {index + 1}
                    </p>

                    <h3 className="mt-2 text-sm font-black tracking-tight text-foreground">
                      {title}
                    </h3>
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
            <Sparkles className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to meet your AI Twin?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
              to={createTwinPath}
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