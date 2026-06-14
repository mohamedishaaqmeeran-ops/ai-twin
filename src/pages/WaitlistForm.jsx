import { useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Phone,
  Lock,
  Star,
  Sparkles,
  Check,
  Instagram,
  Music2,
  Linkedin,
  Youtube,
  Facebook,
  MailOpen,
  Bell,
  Gift,
  AlertCircle,
} from "lucide-react";

const countries = [
  { flag: "🇮🇳", code: "+91" },
  { flag: "🇺🇸", code: "+1" },
  { flag: "🇬🇧", code: "+44" },
  { flag: "🇦🇪", code: "+971" },
];

export default function WaitlistForm() {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!fullName.trim() || !email.trim() || !brand.trim() || !phone.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone.length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    const newUser = {
      fullName,
      email,
      brand,
      phone: `${countryCode} ${phone}`,
      createdAt: new Date().toISOString(),
    };

    const oldUsers = JSON.parse(localStorage.getItem("waitlistUsers") || "[]");

    localStorage.setItem(
      "waitlistUsers",
      JSON.stringify([...oldUsers, newUser])
    );

    setTimeout(() => {
      setLoading(false);
      setJoined(true);
    }, 1000);
  };

  if (joined) {
    return (
      <div className="min-h-screen bg-background px-4 py-16 text-foreground transition-colors duration-300">
        <div className="mx-auto max-w-3xl">
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
            <Sparkles className="absolute left-2 top-4 h-5 w-5 animate-pulse text-pink-400" />
            <Sparkles className="absolute right-2 top-6 h-4 w-4 animate-pulse text-orange-300" />
            <Sparkles className="absolute bottom-3 left-6 h-4 w-4 animate-pulse text-pink-300" />
            <Sparkles className="absolute bottom-2 right-6 h-5 w-5 animate-pulse text-pink-500" />

            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-pink-50 shadow-lg dark:bg-white/10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow transition-all duration-500 hover:scale-110">
                <Check
                  className="h-10 w-10 animate-pulse text-emerald-500"
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>

          <h1 className="mt-8 text-center text-4xl font-black tracking-tight brand-text sm:text-5xl">
            You're on the Waitlist!
          </h1>

          <p className="mt-5 text-center text-base font-medium leading-7 text-muted-foreground sm:text-lg">
            Thank you! You're officially in line for the{" "}
            <span className="brand-text font-bold">AI Twin</span> revolution.
          </p>

          <div className="mx-auto mt-12 max-w-2xl rounded-[5px] border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              What happens next?
            </h2>

            <div className="mt-8 space-y-8">
              <NextStep
                icon={MailOpen}
                title="Priority Early Access"
                desc="Be the first to experience AI Twin when we launch."
              />

              <NextStep
                icon={Bell}
                title="Launch Updates"
                desc="We'll keep you updated with exciting news and progress."
                color="bg-orange-100 text-orange-500 dark:bg-orange-500/10"
              />

              <NextStep
                icon={Gift}
                title="Exclusive Benefits"
                desc="Get special launch benefits and founder perks."
                color="bg-violet-100 text-violet-500 dark:bg-violet-500/10"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Great things are coming.
            </h3>

            <p className="mt-3 text-base font-medium leading-7 text-muted-foreground sm:text-lg">
              Get ready to sell, engage and grow 24/7 with your{" "}
              <span className="brand-text font-bold">AI Twin!</span>
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-[5px] border border-pink-200 bg-pink-50 p-6 dark:border-white/10 dark:bg-white/10 sm:p-8">
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight brand-text sm:text-3xl">
                  Want to move up the list?
                </h3>

                <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                  Invite your friends and earn faster access!
                </p>

                <button className="mt-6 rounded-[5px] border-2 border-pink-500 px-6 py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-500 hover:text-white">
                  Invite & Earn →
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex -space-x-3">
                  {["/images/1.jpeg", "/images/2.jpeg", "/images/3.jpeg"].map(
                    (img) => (
                      <img
                        key={img}
                        src={img}
                        alt=""
                        className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-md"
                      />
                    )
                  )}
                </div>

                <div className="brand-gradient mt-4 flex h-8 w-8 items-center justify-center rounded-[5px] shadow-lg">
                  <Star className="h-5 w-5 fill-white text-white" />
                </div>
              </div>
            </div>
          </div>

          <FooterSocial />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16 text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            LIVE
            <span className="brand-text font-black">
              COMMERCE REVOLUTION
            </span>
          </span>
        </div>

        <h1 className="text-center text-4xl font-black tracking-tight brand-text md:text-5xl">
          Join the Future <br />
          <span className="text-foreground">of Live Commerce</span>
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium leading-6 text-muted-foreground sm:text-base">
          Be the first to know when AI Twin goes live. Join our waitlist and get
          early access, exclusive updates and special launch benefits.
        </p>

        <div className="mx-auto mt-8 max-w-lg rounded-[5px] border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black tracking-tight brand-text">
              Join the Waitlist
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Fill in your details and we'll keep you in the loop.
            </p>
          </div>

          <InputBox icon={User}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </InputBox>

          <InputBox icon={Mail}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </InputBox>

          <InputBox icon={Briefcase}>
            <input
              type="text"
              placeholder="Your Brand / Business"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </InputBox>

          <div className="mb-4 flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20">
            <Phone className="h-5 w-5 text-muted-foreground" />

            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground outline-none"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-[5px] bg-red-50 p-3 text-sm font-bold tracking-wide text-red-500 dark:bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="brand-gradient mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Joining..." : "Yes! Notify Me"}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            We respect your privacy. No spam, ever.
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-lg items-center gap-4 rounded-[5px] border border-border bg-pink-50 p-5 dark:bg-white/10">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-pink-500 bg-pink-100 text-[var(--brand-pink)] dark:bg-white/10">
            <User className="h-6 w-6" />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-foreground">
              Be First, Be Ahead.
            </p>

            <p className="text-sm font-medium leading-6 text-muted-foreground">
              Early waitlist members will get exclusive perks and early access
              when we launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ icon: Icon, children }) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3 transition focus-within:border-[var(--brand-pink)] focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-pink-500/20">
      <Icon className="h-5 w-5 text-muted-foreground" />
      {children}
    </div>
  );
}

function NextStep({
  icon: Icon,
  title,
  desc,
  color = "bg-pink-100 text-[var(--brand-pink)] dark:bg-white/10",
}) {
  return (
    <div className="flex gap-5">
      <div
        className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${color}`}
      >
        <Icon className="h-7 w-7" />
      </div>

      <div>
        <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
          {title}
        </h3>

        <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground sm:text-base">
          {desc}
        </p>
      </div>
    </div>
  );
}

function FooterSocial() {
  const socials = [
    { icon: Instagram, href: "https://www.instagram.com/", label: "Instagram" },
    { icon: Music2, href: "https://www.tiktok.com/", label: "TikTok" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/twinlive/",
      label: "LinkedIn",
    },
    { icon: Youtube, href: "https://www.youtube.com/", label: "YouTube" },
    { icon: Facebook, href: "https://www.facebook.com/", label: "Facebook" },
  ];

  return (
    <div className="mx-auto mt-12 flex flex-col gap-5 border-t border-border pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
      <div>
        <h4 className="text-lg font-black tracking-tight text-foreground">
          Follow us for more updates
        </h4>

        <p className="text-sm font-medium leading-6 text-muted-foreground">
          Stay connected and be the first to hear exciting news.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 sm:justify-end">
        {socials.map(({ icon: Icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer">
            <button
              aria-label={label}
              className="cursor-pointer rounded-full bg-pink-50 p-2 text-[var(--brand-pink)] transition hover:scale-110 hover:bg-pink-100 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <Icon className="h-5 w-5" />
            </button>
          </a>
        ))}
      </div>
    </div>
  );
}