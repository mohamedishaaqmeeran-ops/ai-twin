import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Sparkles,
  Scissors,
  Play,
  Instagram,
  Youtube,
  Music2,
  Repeat,
  BadgeCheck,
  Download,
  CalendarDays,
  CheckCircle2,
  Video,
  Wand2,
  Zap,
} from "lucide-react";
import Nav from "../components/Nav";

export default function ShortClips() {
  const { user } = useSelector((state) => state.auth || {});
const clipsPath = user ? "/app/analytics" : "/signin";
  const features = [
    {
      icon: Scissors,
      title: "Automatic highlights",
      desc: "Your AI Twin's best moments from each live session — strong reactions and key product moments — get clipped automatically.",
    },
    {
      icon: Video,
      title: "Built for short-form platforms",
      desc: "Clips are sized and formatted for Instagram Reels, YouTube Shorts and TikTok, ready to post without extra editing.",
    },
    {
      icon: Repeat,
      title: "Extend the life of every live session",
      desc: "A single live session becomes days of short-form content, driving viewers back to your next live.",
    },
    {
      icon: BadgeCheck,
      title: "Always on-brand",
      desc: "Clips carry your AI Twin's same voice, look and product info — consistent with every other touchpoint.",
    },
  ];

  const steps = [
    "Run a live session as usual.",
    "Twin identifies key moments and generates short clips automatically.",
    "Review and select which clips to publish.",
    "Post directly or download for your own content calendar.",
  ];

  const clips = [
    {
      title: "Best Product Pitch",
      time: "00:24",
      platform: "Reels",
      icon: Instagram,
    },
    {
      title: "Customer Question Answered",
      time: "00:31",
      platform: "Shorts",
      icon: Youtube,
    },
    {
      title: "Limited Offer Moment",
      time: "00:18",
      platform: "TikTok",
      icon: Music2,
    },
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
                SHORT CLIPS
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Turn your live sessions into
                <br />
                <span className="brand-text">scroll-stopping clips.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Every live session becomes a library of short, shareable clips —
                the best moments, automatically packaged for Reels, Shorts and
                TikTok.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={clipsPath}
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  See Your Clips
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
                        AI Clip Studio
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Auto-generated clips from live sessions
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Scissors className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl bg-[#0d0d12] p-4">
                    <div className="relative mx-auto aspect-[9/16] max-w-[230px] overflow-hidden rounded-3xl bg-black">
                      <img
                        src="/images/bbb.png"
                        alt="AI Twin Short Clip"
                        className="h-full w-full object-cover opacity-90"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                      <span className="absolute left-3 top-3 rounded-[5px] bg-red-600 px-3 py-1 text-xs font-black tracking-wide text-white">
                        CLIP
                      </span>

                      <button className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--brand-pink)] shadow-lg">
                        <Play className="h-6 w-6 fill-current" />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/95 p-3 dark:bg-card">
                        <p className="text-sm font-black tracking-tight text-foreground">
                          Best Product Moment
                        </p>
                        <p className="mt-1 text-xs font-bold tracking-wide text-[var(--brand-pink)]">
                          Ready for Reels, Shorts & TikTok
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {clips.map(({ title, time, platform, icon: Icon }) => (
                      <div
                        key={title}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-xs font-black tracking-tight text-foreground">
                              {title}
                            </p>
                            <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                              {platform} · {time}
                            </p>
                          </div>
                        </div>

                        <Download className="h-4 w-4 text-[var(--brand-pink)]" />
                      </div>
                    ))}
                  </div>

                  <Link
                    to={clipsPath}
                    className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white"
                  >
                    Open Clip Library
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
              Why <span className="brand-text">Short Clips</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Turn every live session into reusable content that keeps promoting
              your products after the live ends.
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
                Built For{" "}
                <span className="brand-text">Short-Form Platforms</span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Every clip is ready to share across the platforms where your
                audience already scrolls.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <PlatformCard
                  icon={Instagram}
                  title="Instagram Reels"
                  desc="Vertical clips designed for quick product discovery."
                />
                <PlatformCard
                  icon={Youtube}
                  title="YouTube Shorts"
                  desc="Repurpose live highlights into searchable short videos."
                />
                <PlatformCard
                  icon={Music2}
                  title="TikTok"
                  desc="Share high-energy product moments with trend-ready formatting."
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
            <Wand2 className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to turn one live session into a week of content?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
              to={clipsPath}
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

function PlatformCard({ icon: Icon, title, desc }) {
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