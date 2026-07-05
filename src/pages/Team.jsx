// src/pages/Team.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Users,
  Linkedin,
  Mail,
  Code2,
  Palette,
  Brain,
  Megaphone,
  ShieldCheck,
  Rocket,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import Nav from "../components/Nav";

export default function Team() {
  const team = [
    {
      name: "Arunkumar S",
      role: "Founder & CEO",
      image: "/images/fo.jpeg",
      icon: Rocket,
      desc: "Building the future of AI-powered live commerce.",
    },
    {
      name: "Vijaysree",
      role: "Co-Founder",
      image: "/images/co.jpeg",
      icon: Brain,
      desc: "Designing AI Twin flows for creators, brands and agencies.",
    },
    
  ];

  const values = [
    {
      icon: Rocket,
      title: "Move Fast",
      desc: "We build, test and improve quickly.",
    },
    {
      icon: HeartHandshake,
      title: "Customer First",
      desc: "Every feature should help users sell better.",
    },
    {
      icon: TrendingUp,
      title: "Think Big",
      desc: "We are building for global AI commerce.",
    },
    {
      icon: ShieldCheck,
      title: "Trust Matters",
      desc: "We care about privacy, safety and reliability.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              OUR TEAM
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The people building{" "}
              <span className="brand-text">Twinn.live</span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
              We are a team of builders, designers and AI commerce thinkers
              creating digital twins that can live, engage and sell 24/7.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                to="/careers"
                className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
              >
                Join Our Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
            Meet The Team
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {team.map(({ name, role, image, icon: Icon, desc }) => (
              <div
                key={name}
                className="rounded-3xl border border-border bg-card p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto overflow-hidden rounded-3xl bg-pink-50 p-3 dark:bg-white/10">
                  <img
                    src={image}
                    alt={name}
                    className="h-60 w-full rounded-2xl object-cover"
                  />
                </div>

                <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-xl font-black tracking-tight text-foreground">
                  {name}
                </h3>

                <p className="mt-1 text-sm font-black tracking-wide text-[var(--brand-pink)]">
                  {role}
                </p>

                <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                  {desc}
                </p>

                <div className="mt-5 flex justify-center gap-3">
                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>

                  <a
                    href="mailto:hello@twinn.live"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
              How We Work
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-base font-black tracking-tight text-foreground">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-[40px] p-8 text-center text-white shadow-xl sm:p-12">
            <Users className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Want to build the future with us?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Join Twinn and help create the next generation of AI-powered live
              commerce.
            </p>

            <Link
              to="/careers"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black tracking-wide text-[var(--brand-pink)] transition hover:opacity-90"
            >
              View Careers
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