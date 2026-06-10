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
} from "lucide-react";

export default function WaitlistForm() {
    const [joined, setJoined] = useState(false);
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [brand, setBrand] = useState("");
const [phone, setPhone] = useState("");
if (joined) {
  return (
    <div className="mx-auto  px-4 py-16">
<div className="max-w-lg mx-auto">
      {/* Success Icon */}
     <div className="relative mx-auto flex h-32 w-32 items-center justify-center">

  {/* Sparkles */}
 <Sparkles className="absolute left-[180px] top-6 h-5 w-5 text-pink-400 animate-pulse" />
<Sparkles className="absolute right-[180px] top-8 h-4 w-4 text-orange-300 animate-pulse" />
<Sparkles className="absolute left-[220px] bottom-4 h-4 w-4 text-pink-300 animate-pulse" />
<Sparkles className="absolute right-[220px] bottom-3 h-5 w-5 text-pink-500 animate-pulse" />
<Sparkles className="absolute -top-8 left-1/2 h-4 w-4 -translate-x-1/2 text-orange-200 animate-pulse" />

  {/* Outer Circle */}
  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-pink-50 shadow-lg">
    {/* Inner Circle */}
   <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow transition-all duration-500 hover:scale-110 ">
  <Check className="h-10 w-10 text-emerald-500 animate-pulse" strokeWidth={3} />
</div>
  </div>

</div>

      {/* Heading */}
      <h1 className="mt-8 text-center text-5xl font-black brand-text animate-fade-in">
        You're on the Waitlist!
      </h1>

      <p className="mt-5 text-center text-xl text-muted-foreground">
        Thank you! You're officially in line for the<br/>
        <span className="brand-text font-bold"> AI Twin </span>
        revolution.
      </p>

      {/* What happens next */}
      <div className="mx-auto mt-12 max-w-2xl rounded-[5px] border border-border bg-card p-8 shadow-sm animate-fade-in">

        <h2 className="text-3xl font-black">
          What happens next?
        </h2>

        <div className="mt-8 space-y-8">

          <div className="flex gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-pink-100 text-[var(--brand-pink)]">
              <MailOpen className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold">
                Priority Early Access
              </h3>

              <p className="mt-1 text-muted-foreground">
                Be the first to experience AI Twin when we launch.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-orange-100 text-orange-500">
              <Bell className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold">
                Launch Updates
              </h3>

              <p className="mt-1 text-muted-foreground">
                We'll keep you updated with exciting news and progress.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-100 text-violet-500">
              <Gift className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold">
                Exclusive Benefits
              </h3>

              <p className="mt-1 text-muted-foreground">
                Get special launch benefits and founder perks.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-12 text-center">
        <h3 className="text-3xl font-black">
          Great things are coming.
        </h3>

        <p className="mt-3 text-xl text-muted-foreground">
          Get ready to sell, engage and grow 24/7 with your
          <span className="brand-text font-bold"> AI Twin!</span>
        </p>
      </div>

      {/* Invite Card */}
     <div className="mx-auto mt-12 max-w-2xl rounded-[5px] border border-pink-200 bg-pink-50 p-8 animate-fade-in">
  <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
    
    {/* Left Content */}
    <div>
      <h3 className="text-3xl font-black brand-text">
        Want to move up the list?
      </h3>

      <p className="mt-3 text-lg text-muted-foreground">
        Invite your friends and earn faster access!
      </p>

      <button className="mt-6 rounded-[5px] border-2 border-pink-500 px-6 py-3 font-semibold text-[var(--brand-pink)] transition hover:bg-pink-500 hover:text-white">
        Invite & Earn →
      </button>
    </div>

    {/* Right Side */}
    <div className="flex flex-col items-center">
      {/* Avatars */}
      <div className="flex -space-x-3">
        <img
          src="/images/1.jpeg"
          alt=""
          className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-md"
        />
        <img
          src="/images/2.jpeg"
          alt=""
          className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-md"
        />
        <img
          src="/images/3.jpeg"
          alt=""
          className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-md"
        />
      </div>

      {/* Star Icon */}
     <div className="mt-4 flex h-8 w-8 items-center justify-center rounded-[5px] brand-gradient shadow-lg">
  <Star className="h-5 w-5 fill-white text-white" />
</div>
    </div>
</div>
  </div>
</div>
{/* Footer */}
<div className="mx-auto mt-12 flex items-center justify-between border-t border-border pt-6">
  {/* Left */}
  <div>
    <h4 className="text-lg font-bold">
      Follow us for more updates
    </h4>

    <p className="text-sm text-muted-foreground">
      Stay connected and be the first to hear exciting news.
    </p>
  </div>

  {/* Right */}
  <div className="flex items-center gap-3">
  <a
  href="https://www.instagram.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="cursor-pointer rounded-full bg-pink-50 p-2 text-[var(--brand-pink)] transition hover:scale-110 hover:bg-pink-100">
    <Instagram className="h-5 w-5" />
  </button>
</a>

<a
  href="https://www.tiktok.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="cursor-pointer rounded-full bg-pink-50 p-2 text-[var(--brand-pink)] transition hover:scale-110 hover:bg-pink-100">
    <Music2 className="h-5 w-5" />
  </button>
</a>

<a
  href="https://www.linkedin.com/company/twinlive/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="cursor-pointer rounded-full bg-pink-50 p-2 text-[var(--brand-pink)] transition hover:scale-110 hover:bg-pink-100">
    <Linkedin className="h-5 w-5" />
  </button>
</a>

<a
  href="https://www.youtube.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="cursor-pointer rounded-full bg-pink-50 p-2 text-[var(--brand-pink)] transition hover:scale-110 hover:bg-pink-100">
    <Youtube className="h-5 w-5" />
  </button>
</a>

<a
  href="https://www.facebook.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="cursor-pointer rounded-full bg-pink-50 p-2 text-[var(--brand-pink)] transition hover:scale-110 hover:bg-pink-100">
    <Facebook className="h-5 w-5" />
  </button>
</a>
  </div>
</div>
    </div>
  );
}

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">

      {/* Top Badge */}
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border-3 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          LIVE
          <span className="brand-text font-bold">COMMERCE REVOLUTION</span>
        </span>
      </div>

      {/* Title */}
      <h1 className="text-center text-4xl font-black tracking-tight md:text-5xl brand-text">
        Join the Future <br/><span className="text-black">of Live Commerce</span>
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-center text-md leading-6 text-muted-foreground">
        Be the first to know when AI Twin goes live.<br/>Join our waitlist and get early access, exclusive<br/>updates and special launch benefits.
      </p>

    

      {/* Form Card */}
      <div className="mx-auto mt-8 max-w-lg rounded-[5px] border border-border bg-card p-8 shadow-sm">

  {/* Header INSIDE CARD */}
  <div className="mb-6   text-center">
    <h2 className="text-2xl font-black tracking-tight brand-text">
      Join the Waitlist
    </h2>

    <p className="mt-2 text-base leading-6 text-muted-foreground">
      Fill in your details and we'll keep you in the loop!.
    </p>
  </div>

  {/* Full Name */}
  <div className="mb-4 flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
    <User className="h-5 w-5 text-muted-foreground" />
    <input
  type="text"
  placeholder="Full Name"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  className="w-full bg-transparent text-md outline-none"
/>
  </div>

  {/* Email */}
  <div className="mb-4 flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
    <Mail className="h-5 w-5 text-muted-foreground" />
    <input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full bg-transparent text-md outline-none"
/>
  </div>

  {/* Brand */}
  <div className="mb-4 flex items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
    <Briefcase className="h-5 w-5 text-muted-foreground" />
    <input
  type="text"
  placeholder="Your Brand / Business"
  value={brand}
  onChange={(e) => setBrand(e.target.value)}
  className="w-full bg-transparent text-md outline-none"
/>
  </div>

  {/* Phone */}
  <div className="mb-4 flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3">
    <Phone className="h-5 w-5 text-muted-foreground" />

    <select className="bg-transparent text-md outline-none">
      <option>🇮🇳 +91</option>
      <option>🇺🇸 +1</option>
      <option>🇬🇧 +44</option>
      <option>🇦🇪 +971</option>
    </select>

    <input
  type="tel"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="w-full bg-transparent text-md outline-none"
/>
  </div>

  {/* Button */}
  <button
  type="button"
  onClick={() => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !brand.trim() ||
      !phone.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    setJoined(true);
  }}
  className="brand-gradient mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-semibold text-white shadow-md transition hover:opacity-90"
>
  <Sparkles className="h-4 w-4" />
  Yes! Notify Me
</button>
  {/* Privacy Note */}
<div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
  <Lock className="h-3.5 w-3.5" />
  We respect your privacy. No spam, ever.
</div>
</div>
        {/* Info Card */}
      <div className="mt-10 max-w-lg mx-auto flex items-center gap-4 rounded-[5px] border border-border bg-pink-50 p-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-pink-500 bg-pink-100 text-[var(--brand-pink)]">
          <User className="h-6 w-6" />
        </div>

        <div>
          <p className="font-bold text-md">Be First, Be Ahead.</p>
          <p className="text-base leading-6 text-muted-foreground">
            Early waitlist members will get exclusive perks and early access when we launch.
          </p>
        </div>
      </div>
    </div>
  );
}