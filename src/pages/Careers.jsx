// src/pages/Careers.jsx

import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  Code2,
  Server,
  Palette,
  Brain,
  Clock,
  Globe,
  TrendingUp,
  CheckCircle2,
  Users,
  Rocket,
  HeartHandshake,
  Trophy,
} from "lucide-react";
import Nav from "../components/Nav";

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const jobs = [
    {
      icon: Code2,
      title: "Frontend Developer",
      location: "Chennai / Remote",
      type: "Full Time",
    },
    {
      icon: Server,
      title: "Backend Developer",
      location: "Chennai / Remote",
      type: "Full Time",
    },
    {
      icon: Palette,
      title: "UI/UX Designer",
      location: "Remote",
      type: "Internship",
    },
    {
      icon: Brain,
      title: "AI Engineer",
      location: "Chennai",
      type: "Full Time",
    },
  ];

  const benefits = [
    "Flexible Working Hours",
    "Remote Friendly",
    "Fast Growth Opportunities",
    "Latest AI Technologies",
    "Learning Budget",
    "Performance Bonuses",
  ];

  const values = [
    {
      icon: Rocket,
      title: "Move Fast",
      desc: "Build, test and improve quickly with a strong ownership mindset.",
    },
    {
      icon: HeartHandshake,
      title: "Customer First",
      desc: "Create products that help creators and brands sell better.",
    },
    {
      icon: TrendingUp,
      title: "Think Big",
      desc: "Work on AI commerce products built for global scale.",
    },
  ];

  const process = ["Apply", "Interview", "Technical Round", "Offer"];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              CAREERS AT TWINN
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Build the future of{" "}
              <span className="brand-text">AI Commerce</span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Join the team building AI Twins that can live, engage and sell
              24/7. Help creators, brands and agencies transform how they
              connect with customers.
            </p>

            <div className="mt-8 flex justify-center">
              <a
                href="#open-positions"
                className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
              >
                View Open Roles
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-7 w-7" />
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

        <section
          id="open-positions"
          className="bg-pink-50/50 py-16 dark:bg-white/5"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
              Open Positions
            </h2>

            <div className="mt-10 space-y-4">
              {jobs.map(({ icon: Icon, title, location, type }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black tracking-tight text-foreground">
                        {title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {location} · {type}
                      </p>
                    </div>
                  </div>

                  <button
  onClick={() => setSelectedJob(title)}
  className="brand-gradient flex h-11 items-center justify-center rounded-[5px] px-6 text-sm font-bold tracking-wide text-white transition hover:opacity-90"
>
  Apply Now
</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
            Benefits & Perks
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
                <p className="text-sm font-black tracking-tight text-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-black tracking-tight brand-text md:text-4xl">
              Hiring Process
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {process.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm"
                >
                  <div className="brand-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white">
                    {index + 1}
                  </div>

                  <p className="mt-5 text-base font-black tracking-tight text-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-[40px] p-8 text-center text-white shadow-xl sm:p-12">
            <Trophy className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to build the future with us?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Join Twinn and help create the next generation of AI-powered
              commerce.
            </p>

            <a
              href="mailto:hello@twinn.live"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black tracking-wide text-[var(--brand-pink)] transition hover:opacity-90"
            >
              Apply Today
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          {selectedJob && (
  <ApplicationModal
    jobTitle={selectedJob}
    onClose={() => setSelectedJob(null)}
  />
)}
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

function ApplicationModal({ jobTitle, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl border border-border bg-card p-5 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight brand-text sm:text-2xl">
              Apply for {jobTitle}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Fill your details and submit your application.
            </p>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background text-sm font-black text-foreground"
          >
            X
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="mt-5 flex-1 overflow-y-auto pr-2">
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Application submitted successfully!");
              onClose();
            }}
          >
            <FormField label="Full Name *">
              <input
                type="text"
                required
                placeholder="Your name"
                className={inputClass}
              />
            </FormField>

            <FormField label="Email *">
              <input
                type="email"
                required
                placeholder="Email address"
                className={inputClass}
              />
            </FormField>

            <FormField label="Phone *">
              <input
                type="tel"
                required
                placeholder="Phone number"
                className={inputClass}
              />
            </FormField>

            <FormField label="Experience">
              <select className={inputClass}>
                <option>Fresher</option>
                <option>0 - 1 Years</option>
                <option>1 - 3 Years</option>
                <option>3 - 5 Years</option>
                <option>5+ Years</option>
              </select>
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Portfolio / LinkedIn / GitHub">
                <input
                  type="url"
                  placeholder="https://"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Upload Resume *">
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  className="w-full rounded-[5px] border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Why do you want to join Twinn?">
                <textarea
                  rows="3"
                  placeholder="Tell us about yourself..."
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-[var(--brand-pink)]"
                />
              </FormField>
            </div>

            <button
              type="submit"
              className="brand-gradient flex h-11 items-center justify-center rounded-[5px] text-sm font-bold tracking-wide text-white md:col-span-2"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-[5px] border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-[var(--brand-pink)]";

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black tracking-tight text-foreground">
        {label}
      </label>

      {children}
    </div>
  );
}