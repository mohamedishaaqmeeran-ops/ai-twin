import { Bell, Check, UserCircle2, FileText, BadgeCheck, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

function StepCard({ n, title, desc, completed }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* Left Icon */}
      <div
        className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white ${
          completed ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <Check className="h-6 w-6" strokeWidth={3} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold leading-6">
          Step {n} · {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {desc}
        </p>
      </div>

      {/* Status */}
      <div
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${
          completed ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <Check className="h-4 w-4" strokeWidth={3.5} />
      </div>
    </div>
  );
}

export default function Wizard() {
  const steps = [
    {
      title: "Upload Video",
      desc: "We learn your face & gestures.",
      completed: true,
    },
    {
      title: "Upload Voice",
      desc: "We clone your unique tone.",
      completed: true,
    },
    {
      title: "Train AI Twin",
      desc: "Personality, style, products.",
      completed: false,
    },
  ];

  const items = [
    {
      Icon: UserCircle2,
      t: "Creators & Influencers",
    },
    {
      Icon: FileText,
      t: "D2C Brands",
    },
    {
      Icon: BadgeCheck,
      t: "Coaches & Educators",
    },
    {
      Icon: Home,
      t: "Real Estate",
    },
    {
      Icon: Sparkles,
      t: "Beauty & Fashion",
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;

  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
  <>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  border-b border-border bg-background/90 backdrop-blur">
          {/* Mobile Header */}
          <div className="flex items-center  z-50 justify-between md:hidden">
            <Logo />
    
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
              <Bell className="h-5 w-5" />
            </button>
          </div>
    

      {/* Heading */}
      <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight  md:text-5xl">
        Avatar Wizard
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
        Create your AI sales twin that goes live, talks, answers questions and
        sells 24/7 while you focus on growing your brand.
      </p>

      {/* Banner */}
      <div className="brand-gradient relative mt-8 overflow-hidden rounded-3xl p-8 text-white shadow-xl">
        <p className="text-xs font-semibold tracking-[0.2em] opacity-90">
          AI LIVE COMMERCE
        </p>

        <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
          Your AI Twin
          <br />
          Sells for You.
        </h2>

        <span className="mt-5 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
          {completedSteps}/{steps.length} steps done
        </span>

        <img
          src="/images/bbb.png"
          alt="AI Twin"
          className="absolute right-6 top-6 hidden h-32 w-32 rounded-3xl object-cover ring-4 ring-white/30 shadow-xl md:block"
        />
      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="h-2 w-full overflow-hidden rounded-full bg-pink-100">
          <div
            className="brand-gradient h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm font-semibold">
          {progress}% trained
        </p>
      </div>

      {/* Steps */}
      <div className="mt-8 space-y-4">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            n={index + 1}
            title={step.title}
            desc={step.desc}
            completed={step.completed}
          />
        ))}
      </div>
    </div>

    {/* Perfect For */}
    <section
      id="cases"
      className="mx-auto mt-20 max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <h2 className="text-center text-3xl font-black brand-text md:text-4xl">
        Perfect For
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {items.map(({ Icon, t }) => (
          <div
            key={t}
            className="flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-6 w-6" />
            </div>

            <p className="mt-5 text-base font-bold">
              {t}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* Button */}
    <div className="mx-auto mb-10 mt-2 max-w-md px-4">
      <Link
        to="/app/portrait"
        className="brand-gradient glow-pink flex h-14 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
      >
        Generate Twin Portrait →
      </Link>
    </div>
  </>
);
}
