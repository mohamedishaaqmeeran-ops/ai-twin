import { Radio } from "lucide-react";
import GradientButton from "../components/GradientButton";
import { Bell } from "lucide-react";
import Logo from "../components/Logo";
export default function GoLive() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8   border-b border-border bg-background/90 backdrop-blur">
          {/* Mobile Header */}
          <div className="flex items-center top-0  justify-between md:hidden">
            <Logo />
    
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
              <Bell className="h-5 w-5" />
            </button>
          </div>
    
      <div className="-mx-5 mt-6 md:-mx-10 md:-mt-10 pt-5 md:pt-10">
        <div
          className="relative min-h-[calc(100vh-7rem)] overflow-hidden bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 md:min-h-[calc(100vh-2.5rem)] md:rounded-3xl"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(20,15,12,0.25) 0%, rgba(20,15,12,0.85) 70%, rgba(10,8,6,1) 100%), url('https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80')",
            backgroundSize: "contain",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-x-0 bottom-0 p-6 pb-8 md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 text-xs font-extrabold tracking-widest text-foreground backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-pink)] animate-pulse" />
              READY TO GO LIVE
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl">
              Your AI Twin is ready
              <br />
              to sell for you.
            </h1>
            <p className="mt-4 max-w-md text-base text-white/80">
              Tap below and let your trained AI twin engage viewers, answer questions, and close
              sales — 24/7.
            </p>
            <div className="mt-8 max-w-lg mx-auto">
              <GradientButton icon={<Radio className="h-5 w-5" />}>Go Live now</GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
