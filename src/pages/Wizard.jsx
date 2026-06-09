import { Bell, Check, UserCircle2, FileText, BadgeCheck, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

function StepCard({ n, title, desc, completed }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white ${
          completed ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <Check className="h-6 w-6" strokeWidth={3} />
      </div>

      <div className="flex-1">
        <p className="text-base font-extrabold">
          Step {n} · {title}
        </p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>

      <span
        className={`grid h-6 w-6 place-items-center rounded-full text-white ${
          completed ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
      </span>
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
      <div>
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden">
          <Logo />

          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-black tracking-tight md:mt-0">Avatar Wizard</h1>

        <p className="mt-3 text-base text-muted-foreground">
          Create your AI sales twin that goes live, talks, answers questions and sells 24/7.
        </p>

        {/* Banner */}
        <div className="brand-gradient relative mt-6 overflow-hidden rounded-3xl p-6 text-white shadow-xl">
          <p className="text-xs font-extrabold tracking-widest opacity-90">AI LIVE COMMERCE</p>

          <h2 className="mt-2 text-3xl font-black leading-tight">
            Your AI Twin
            <br />
            Sells for You.
          </h2>

          <span className="mt-4 inline-block rounded-full bg-white/25 px-3 py-1 text-xs font-bold">
            {completedSteps}/{steps.length} steps done
          </span>

          <img
            src="/images/bbb.png"
            alt="AI Twin"
            className="absolute right-4 top-4 h-28 w-28 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
          />
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-pink-100">
            <div
              className="brand-gradient h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-2 text-sm font-extrabold">{progress}% trained</p>
        </div>

        {/* Dynamic Steps */}
        <div className="mt-6 space-y-3">
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

        {/* Button */}
      </div>

      {/* Perfect For */}
      <section id="cases" className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-center text-3xl font-black brand-text">Perfect For</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.map(({ Icon, t }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
                <Icon className="h-6 w-6" />
              </div>

              <p className="mt-3 text-sm font-extrabold">{t}</p>
            </div>
          ))}
        </div>
      </section>
      <Link
        to="/app/portrait"
        className="brand-gradient glow-pink mt-6 flex items-center justify-center gap-2 rounded-full py-4 font-bold text-white"
      >
        Generate Twin Portrait →
      </Link>
    </>
  );
}
