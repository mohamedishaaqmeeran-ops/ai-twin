// src/pages/UploadAndStream.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  UploadCloud,
  Video,
  MessageSquareText,
  CalendarClock,
  FileVideo,
  Package,
  Radio,
  CheckCircle2,
  Play,
  Repeat,
  Zap,
} from "lucide-react";
import Nav from "../components/Nav";

export default function UploadAndStream() {
  const features = [
    {
      icon: FileVideo,
      title: "Reuse what you've already made",
      desc: "Product demos, tutorials, unboxings — upload existing video content instead of recreating it live every time.",
    },
    {
      icon: MessageSquareText,
      title: "Your AI Twin adds the live layer",
      desc: "While your video plays, your AI Twin still answers viewer questions and recommends products in real time, just like a live session.",
    },
    {
      icon: CalendarClock,
      title: "Schedule it once, run it on repeat",
      desc: "Queue uploaded content to stream at set times — a consistent live presence without recording something new every session.",
    },
    {
      icon: UploadCloud,
      title: "Works with your existing footage",
      desc: "No special format requirements — upload the product videos and content you already have.",
    },
  ];

  const steps = [
    "Upload a video from your library.",
    "Link it to the products featured in the video.",
    "Schedule when it streams, and on which platforms.",
    "Your AI Twin presents it live, answering questions as viewers watch.",
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
                UPLOAD & STREAM
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Already have the content?
                <br />
                <span className="brand-text">
                  Let your AI Twin stream it.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Upload pre-recorded videos and let your AI Twin present them
                live — narrating, answering questions, and selling around
                content you've already made.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/app/golive"
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Upload Your First Video
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 p-5 dark:bg-white/10">
                <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black tracking-tight brand-text">
                        Upload & Stream Studio
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Upload video. Add products. Stream live.
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border-2 border-dashed border-[var(--brand-pink)] bg-pink-50 p-6 text-center dark:bg-white/10">
                    <UploadCloud className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

                    <h3 className="mt-4 text-lg font-black tracking-tight text-foreground">
                      Upload product video
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                      Demo, tutorial, unboxing or offer video
                    </p>

                    <button className="brand-gradient mt-5 inline-flex items-center gap-2 rounded-[5px] px-5 py-3 text-sm font-bold tracking-wide text-white">
                      <Video className="h-4 w-4" />
                      Select Video
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      ["Video", "Uploaded"],
                      ["Product", "Linked"],
                      ["Schedule", "Ready"],
                      ["Twin Chat", "Enabled"],
                    ].map(([title, desc]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <p className="text-xs font-black tracking-tight text-foreground">
                          {title}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/app/golive"
                    className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
                  >
                    Start Upload Flow
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
              Why <span className="brand-text">Upload & Stream</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Turn your existing videos into live selling sessions with AI chat,
              product recommendations and scheduled streaming.
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
                Content Becomes{" "}
                <span className="brand-text">Live Commerce</span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Your uploaded video does the presentation. Your AI Twin handles
                the live interaction.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <FlowCard
                  icon={Play}
                  title="Video plays live"
                  desc="Your pre-recorded content streams like a live session."
                />
                <FlowCard
                  icon={MessageSquareText}
                  title="AI answers viewers"
                  desc="Your AI Twin responds to product questions in real time."
                />
                <FlowCard
                  icon={Package}
                  title="Products are promoted"
                  desc="Featured products stay linked and ready to buy."
                />
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
            <Zap className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to put your existing content to work?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
              to="/app/golive"
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

function FlowCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5">
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
  );
}