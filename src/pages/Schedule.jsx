import { useState } from "react";
import { Instagram, Facebook, Youtube, Music2, Calendar, Plus } from "lucide-react";
import { Bell } from "lucide-react";
import Logo from "../components/Logo";
import Chip from "../components/Chip";
import GradientButton from "../components/GradientButton";

const platforms = [
  { id: "ig", label: "Instagram", Icon: Instagram },
  { id: "fb", label: "Facebook", Icon: Facebook },
  { id: "yt", label: "YouTube", Icon: Youtube },
  { id: "tt", label: "TikTok", Icon: Music2 },
];

const times = ["7:30 PM", "8:00 PM", "9:00 PM", "10:00 PM"];
const dates = ["Today", "Tomorrow", "Sat 06/14", "Sun 06/15", "Mon 06/16"];
export default function Schedule() {
  const [platform, setPlatform] = useState("ig");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("7:30 PM");
  const [dur, setDur] = useState("2h");
  const [title, setTitle] = useState("Glow Friday Mega Sale");

  return (
    <div>
      <div className="flex items-center justify-between md:hidden">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>
      <h1 className="mt-6 text-4xl font-black tracking-tight">Schedule Live</h1>

      <p className="mt-2 text-base text-muted-foreground">
        Pick a platform, date and time — your AI twin will go live & sell automatically.
      </p>

      <section className="mt-8 rounded-3xl border border-border bg-white p-6">
        {/* Platform */}
        <p className="text-xs font-extrabold tracking-widest text-foreground/80">CHOOSE PLATFORM</p>

        <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {platforms.map(({ id, label, Icon }) => (
            <Chip
              key={id}
              active={platform === id}
              onClick={() => setPlatform(id)}
              icon={<Icon className="h-4 w-4" />}
            >
              {label}
            </Chip>
          ))}
        </div>

        {/* MOBILE UI */}
        {/* MOBILE UI */}
        <div className="mt-8 space-y-5 md:hidden">
          {/* Title */}
          <div>
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              TITLE
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter live stream title"
              className="w-full rounded-[5px] border border-border px-4 py-3 text-sm font-semibold"
            />
          </div>

          {/* Date Buttons */}
          <div>
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              DATE
            </label>

            <div className="flex flex-wrap gap-2">
              {dates.map((d) => (
                <Chip key={d} active={date === d} onClick={() => setDate(d)}>
                  {d}
                </Chip>
              ))}
            </div>
          </div>

          {/* Time Buttons */}
          <div>
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              TIME
            </label>

            <div className="flex flex-wrap gap-2">
              {times.map((t) => (
                <Chip key={t} active={time === t} onClick={() => setTime(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              DURATION
            </label>

            <input
              type="text"
              value={dur}
              onChange={(e) => setDur(e.target.value)}
              placeholder="2h"
              className="w-full rounded-[5px] border border-border px-4 py-3 text-sm font-semibold"
            />
          </div>
        </div>

        {/* DESKTOP UI */}
        <div className="mt-8 hidden md:grid md:grid-cols-5 md:gap-4">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              TITLE
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter live stream title"
              className="w-full rounded-[5px] border border-border px-4 py-3 text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              DATE
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-[5px] border border-border px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              TIME
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-[5px] border border-border px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
            >
              {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold tracking-widest text-foreground/80">
              DURATION
            </label>
            <input
              type="text"
              value={dur}
              onChange={(e) => setDur(e.target.value)}
              placeholder="2h"
              className="w-full rounded-[5px] border border-border px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]/40"
            />
          </div>
        </div>
      </section>

      <div className="mt-8">
        <GradientButton icon={<Plus className="h-5 w-5" strokeWidth={2.5} />}>
          Schedule Live
        </GradientButton>
      </div>

      <section className="mt-10">
        <p className="flex items-center gap-2 text-base font-extrabold">
          <Calendar className="h-5 w-5" />
          Upcoming Streams
        </p>

        <p className="mt-2 text-sm text-muted-foreground">No streams scheduled yet.</p>
      </section>
    </div>
  );
}
