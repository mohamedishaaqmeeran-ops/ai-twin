// src/pages/ContactUs.jsx

import { useState } from "react";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Headphones,
  Building2,
} from "lucide-react";
import Nav from "../components/Nav";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      e.target.reset();
    }, 2500);
  };

  const contactCards = [
    {
      icon: Mail,
      title: "Email Us",
      value: "twinn.support@gmail.com",
      desc: "For support, sales and general questions.",
      href: "mailto:hello@twinn.live",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 84285 27015",
      desc: "Mon to Sat, 10 AM - 6 PM.",
      href: "tel:+918428527015",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Chennai, India",
      desc: "Building AI commerce from India.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
                CONTACT TWINN
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Let’s build your{" "}
                <span className="brand-text">AI selling engine.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Have a question about AI Twins, live commerce, pricing,
                partnerships or support? Send us a message and our team will get
                back to you.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MiniStat icon={MessageCircle} label="Support" value="24/7" />
                <MiniStat icon={Headphones} label="Response" value="< 24h" />
                <MiniStat icon={Building2} label="Location" value="India" />
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-5 shadow-xl">
              <div className="rounded-3xl bg-pink-50 p-5 dark:bg-white/10">
                <Mail className="h-10 w-10 text-[var(--brand-pink)]" />

                <h2 className="mt-5 text-2xl font-black tracking-tight text-foreground">
                  Quick Contact
                </h2>

                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                  For faster support, email us directly.
                </p>

                <a
                  href="mailto:hello@twinn.live"
                  className="brand-gradient mt-6 flex h-12 items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Mail Us Now
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

       <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start">
    {/* Left Contact Cards */}
    <div className="space-y-12">
      {contactCards.map(({ icon: Icon, title, value, desc, href }) => {
        const content = (
          <div className="h-full rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                <Icon className="h-7 w-7" />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-black tracking-tight text-foreground">
                  {title}
                </h3>

                <p className="mt-1 break-words text-sm font-black tracking-wide text-[var(--brand-pink)]">
                  {value}
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                  {desc}
                </p>
              </div>
            </div>
          </div>
        );

        return href ? (
          <a key={title} href={href} className="block">
            {content}
          </a>
        ) : (
          <div key={title}>{content}</div>
        );
      })}

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
  <div className="flex items-start gap-4">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
      <Clock className="h-7 w-7" />
    </div>

    <div>
      <h3 className="text-lg font-black tracking-tight text-foreground">
        Working Hours
      </h3>

      <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
        Monday - Saturday
        <br />
        10:00 AM - 6:00 PM IST
      </p>
    </div>
  </div>

  {/* Google Map */}
  <div className="mt-6 overflow-hidden rounded-2xl border border-border">
    <iframe
      title="Twinn Location"
      src="https://www.google.com/maps?q=Chennai,India&output=embed"
      width="100%"
      height="250"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className="border-0"
    />
  </div>

  <a
    href="https://www.google.com/maps/dir/8.1859837,77.3979608/Parkqwik+Private+Limited,+Level+7,+IIFL+TOWERS,+143,+MGR+Main+Rd,+Kandhanchavadi,+Perungudi,+Chennai,+Greater+Chennai,+Tamil+Nadu+600096/@10.5656965,76.1808097,7z/data=!3m2!4b1!5s0x3a525d1319512c2f:0x111147a8044cf6ee!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3a525d085e1bbb55:0x86d5074faeaa44d1!2m2!1d80.2463332!2d12.9658308?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
    target="_blank"
    rel="noopener noreferrer"
    className="brand-gradient mt-4 flex h-11 items-center justify-center rounded-[5px] text-sm font-bold text-white transition hover:opacity-90"
  >
    <MapPin className="mr-2 h-4 w-4" />
    Open in Google Maps
  </a>
</div>
    </div>

    {/* Right Form */}
    <section className="rounded-[32px] border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-black tracking-tight brand-text">
          Send a Message
        </h2>

        <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
          Fill the form below. We’ll contact you soon.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full Name *">
            <input
              type="text"
              required
              placeholder="Your name"
              className={inputClass}
            />
          </Field>

          <Field label="Email Address *">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className={inputClass}
            />
          </Field>

          <Field label="Phone Number">
            <input type="tel" placeholder="+91" className={inputClass} />
          </Field>

          <Field label="I’m interested in">
            <select className={inputClass}>
              <option>AI Twin Demo</option>
              <option>Pricing</option>
              <option>Creator Plan</option>
              <option>Brand / Shop Plan</option>
              <option>Agency Plan</option>
              <option>Technical Support</option>
            </select>
          </Field>
        </div>

        <Field label="Subject *">
          <input
            type="text"
            required
            placeholder="How can we help?"
            className={inputClass}
          />
        </Field>

        <Field label="Message *">
          <textarea
            required
            rows="5"
            placeholder="Tell us about your requirement..."
            className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
          />
        </Field>

        <button
          type="submit"
          className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
        >
          Send Message
          <Send className="h-4 w-4" />
        </button>

        {submitted && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            Message sent successfully!
          </div>
        )}
      </form>
    </section>
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

const inputClass =
  "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black tracking-tight text-foreground">
        {label}
      </label>

      {children}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
      <Icon className="mx-auto h-6 w-6 text-[var(--brand-pink)]" />
      <p className="mt-3 text-xs font-bold tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-black tracking-tight brand-text">
        {value}
      </p>
    </div>
  );
}