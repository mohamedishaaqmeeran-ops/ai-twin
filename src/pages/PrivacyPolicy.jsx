// src/pages/PrivacyPolicy.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Database,
  User,
  Mic,
  Radio,
  Link2,
  Cookie,
  Lock,
  Globe,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Nav from "../components/Nav";

export default function PrivacyPolicy() {
  const infoCategories = [
    {
      category: "Account information",
      examples:
        "Name, email address, phone number, password, billing details when you register or subscribe to a plan.",
    },
    {
      category: "Brand & product data",
      examples:
        "Product catalogues, FAQs, policies such as shipping, refund and COD, and brand descriptions you upload to train your AI Twin.",
    },
    {
      category: "Voice & likeness data",
      examples:
        "Voice recordings used for voice cloning, and avatar or appearance choices used to build your AI Twin.",
    },
    {
      category: "Live session data",
      examples:
        "Recordings of live sessions, viewer questions, chat logs, and sales or engagement data generated during live selling.",
    },
    {
      category: "Connected platform data",
      examples:
        "Account tokens and profile information from connected platforms such as Instagram, Facebook, YouTube, TikTok, LinkedIn and integrations such as Shopify, WooCommerce, WordPress, Klaviyo, Zapier and Stripe.",
    },
    {
      category: "Usage & device data",
      examples:
        "Pages visited, features used, log files, IP address, browser type, and device identifiers collected automatically.",
    },
    {
      category: "Cookies",
      examples:
        "Data collected via cookies and similar technologies. See our separate Cookie Policy for details.",
    },
  ];

  const useCases = [
    "Create, train, animate and operate your AI Twin, including voice cloning and lip sync.",
    "Provide, maintain and improve the Service, including live session hosting and analytics.",
    "Process payments, manage subscriptions, and send billing-related communications.",
    "Connect to and post on third-party platforms and integrations you authorise.",
    "Respond to support requests and communicate with you about your account.",
    "Send product updates, tips and promotional communications, where you have consented. You can opt out at any time.",
    "Detect, investigate and prevent fraud, abuse, or violations of our Terms and Conditions.",
    "Comply with legal obligations and enforce our agreements.",
  ];

  const sharing = [
    {
      title: "With connected platforms and integrations",
      desc: "When you connect Instagram, Facebook, YouTube, TikTok, LinkedIn, Shopify, WooCommerce, WordPress, Klaviyo, Zapier or Stripe, relevant data is shared as needed to operate the connection. Each platform's own privacy policy governs their handling of that data.",
    },
    {
      title: "With service providers",
      desc: "Vendors who help us operate the Service, such as cloud hosting, payment processing, AI model providers and analytics, under contractual obligations to protect your data and use it only for the purposes we specify.",
    },
    {
      title: "With viewers, during live sessions",
      desc: "Your AI Twin's responses and any product or brand information you add are visible to viewers of your live sessions by the nature of the Service.",
    },
    {
      title: "For legal reasons",
      desc: "Where required to comply with a law, regulation, legal process or government request, or to protect the rights, property or safety of Twin, our users or the public.",
    },
    {
      title: "Business transfers",
      desc: "If Twin is involved in a merger, acquisition or sale of assets, your information may be transferred as part of that transaction, subject to this Policy or a successor policy.",
    },
  ];

  const retention = [
    "Account and billing information is retained for the duration of your subscription and for a reasonable period afterward, to comply with accounting and legal obligations.",
    "Voice recordings and AI Twin training data are retained until you delete your AI Twin or close your account, after which they are deleted within a reasonable period, except where retention is required by law.",
    "Live session recordings and analytics may be retained for reporting purposes, subject to the data retention settings available in your account, where applicable.",
  ];

  const rights = [
    "Access the personal information we hold about you.",
    "Correct inaccurate or incomplete information.",
    "Request deletion of your personal information, subject to legal and contractual retention requirements.",
    "Withdraw consent for optional processing, such as marketing communications or voice cloning, at any time.",
    "Object to or restrict certain processing of your information.",
    "Request a copy of your data in a portable format, where applicable.",
  ];

  const aiTwinData = [
    "Voice samples you provide are used solely to generate your AI Twin's cloned voice and are not used to train shared or general-purpose voice models without your separate consent.",
    "Avatar appearance choices such as face, background, outfit and gesture style are used to render your AI Twin's live appearance.",
    "If you upload images or video of a real person, including yourself, for avatar creation, you confirm you have the right and consent needed to do so, per our Terms and Conditions.",
    "You may delete your voice and avatar data by deleting your AI Twin from your account settings, subject to the retention terms in Section 4.",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <ShieldCheck className="h-4 w-4 text-[var(--brand-pink)]" />
                PRIVACY POLICY
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                How <span className="brand-text">Twin</span> handles your data.
              </h1>

              <p className="mt-5 max-w-3xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                This Privacy Policy explains how Twin collects, uses, shares and
                protects information when you use the Twin website, application
                and related services at twinn.live.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-black tracking-wide text-[var(--brand-pink)] dark:bg-white/10">
                  Last Updated: June 2026
                </span>

                
              </div>

             
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-black tracking-tight brand-text">
                Contents
              </h2>

              <nav className="mt-4 space-y-2">
                {[
                  ["Information We Collect", "#collect"],
                  ["How We Use Information", "#use"],
                  ["How We Share Information", "#share"],
                  ["Data Retention", "#retention"],
                  ["Your Rights", "#rights"],
                  ["Voice & Avatar Data", "#voice-avatar"],
                  ["Children's Privacy", "#children"],
                  ["International Transfers", "#transfers"],
                  ["Data Security", "#security"],
                  ["Cookies", "#cookies"],
                  ["Third-Party Services", "#third-party"],
                  ["Changes", "#changes"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="block rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground transition hover:bg-pink-50 hover:text-[var(--brand-pink)] dark:hover:bg-white/10"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-6">
            <PolicyCard
              id="collect"
              icon={Database}
              number="1"
              title="Information We Collect"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                We collect information you provide directly, information
                generated through your use of the Service, and information
                needed to operate your AI Twin.
              </p>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                <div className="grid bg-pink-50 text-sm font-black tracking-tight text-foreground dark:bg-white/10 md:grid-cols-[260px_1fr]">
                  <div className="border-b border-border p-4 md:border-b-0 md:border-r">
                    Category
                  </div>
                  <div className="p-4">Examples</div>
                </div>

                {infoCategories.map((item) => (
                  <div
                    key={item.category}
                    className="grid border-t border-border bg-background text-sm md:grid-cols-[260px_1fr]"
                  >
                    <div className="border-b border-border p-4 font-black tracking-tight text-foreground md:border-b-0 md:border-r">
                      {item.category}
                    </div>
                    <div className="p-4 font-medium leading-6 text-muted-foreground">
                      {item.examples}
                    </div>
                  </div>
                ))}
              </div>
            </PolicyCard>

            <PolicyCard
              id="use"
              icon={Sparkles}
              number="2"
              title="How We Use Your Information"
            >
              <List items={useCases} />

             
            </PolicyCard>

            <PolicyCard
              id="share"
              icon={Link2}
              number="3"
              title="How We Share Your Information"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                We do not sell your personal information. We share information
                only in the following circumstances:
              </p>

              <div className="mt-5 space-y-4">
                {sharing.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <div className="flex gap-3">
                      <span className="brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-white">
                        {index + 1}
                      </span>

                      <div>
                        <h3 className="text-base font-black tracking-tight text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PolicyCard>

            <PolicyCard
              id="retention"
              icon={Database}
              number="4"
              title="Data Retention"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                We retain your information for as long as your account is
                active, or as needed to provide the Service.
              </p>

              <List items={retention} />

              <LegalFlag>
                Specific retention periods should be confirmed with the
                engineering and legal teams and stated explicitly once finalised.
              </LegalFlag>
            </PolicyCard>

            <PolicyCard
              id="rights"
              icon={User}
              number="5"
              title="Your Rights & Choices"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                Depending on your location, you may have the right to:
              </p>

              <List items={rights} />

              <p className="mt-5 text-sm font-medium leading-6 text-muted-foreground">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:hello@twinn.live"
                  className="font-bold text-[var(--brand-pink)] hover:underline"
                >
                  hello@twinn.live
                </a>
                . We will respond within a reasonable timeframe and in
                accordance with applicable law.
              </p>

              <LegalFlag>
                Specific statutory response timelines should be confirmed with
                legal counsel and stated explicitly here.
              </LegalFlag>
            </PolicyCard>

            <PolicyCard
              id="voice-avatar"
              icon={Mic}
              number="6"
              title="Voice, Avatar & AI Twin Data"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                Because Twin's core feature involves cloning your voice and
                building a digital avatar, we want to be specific about how this
                sensitive data is handled:
              </p>

              <List items={aiTwinData} />
            </PolicyCard>

            <PolicyCard
              id="children"
              icon={ShieldCheck}
              number="7"
              title="Children's Privacy"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                The Service is not directed at, and is not intended for use by,
                individuals under 18 years of age. We do not knowingly collect
                personal information from children. If we become aware that we
                have collected information from a child under 18, we will take
                steps to delete it.
              </p>
            </PolicyCard>

            <PolicyCard
              id="transfers"
              icon={Globe}
              number="8"
              title="International Data Transfers"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                Twin is based in India, and your information may be processed
                and stored on servers located in India or other countries where
                our service providers operate. Where we transfer information
                internationally, we take steps to ensure it receives an adequate
                level of protection, consistent with applicable law.
              </p>
            </PolicyCard>

            <PolicyCard id="security" icon={Lock} number="9" title="Data Security">
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                We use reasonable technical and organisational measures to
                protect your information, including encryption in transit,
                access controls, and secure hosting infrastructure. However, no
                method of transmission or storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </PolicyCard>

            <PolicyCard
              id="cookies"
              icon={Cookie}
              number="10"
              title="Cookies & Tracking Technologies"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                We use cookies and similar technologies to operate the Service,
                remember your preferences, and understand how the Service is
                used. For full details on the types of cookies we use and how to
                manage your preferences, see our{" "}
                <Link
                  to="/cookiepolicy"
                  className="font-bold text-[var(--brand-pink)] hover:underline"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </PolicyCard>

            <PolicyCard
              id="third-party"
              icon={Radio}
              number="11"
              title="Third-Party Links & Services"
            >
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                The Service may link to or integrate with third-party websites
                and services such as Instagram, Facebook, YouTube, TikTok,
                LinkedIn, Shopify, WooCommerce, WordPress, Klaviyo, Zapier and
                Stripe. This Policy does not apply to those third parties, and
                we encourage you to review their privacy policies separately.
              </p>
            </PolicyCard>

            <PolicyCard id="changes" icon={RefreshIcon} number="12" title="Changes to This Policy">
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                We may update this Policy from time to time to reflect changes
                to the Service, legal requirements, or our data practices. If we
                make material changes, we will provide reasonable notice, for
                example via the website or email, before the changes take
                effect. Continued use of the Service after changes take effect
                constitutes acceptance of the updated Policy.
              </p>
            </PolicyCard>

            <PolicyCard id="contact" icon={Mail} number="13" title="Contact Us">
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                If you have questions about this Policy or how we handle your
                information, contact us:
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ContactItem icon={Mail} label="Email" value="hello@twinn.live" href="mailto:hello@twinn.live" />
                <ContactItem icon={Globe} label="Website" value="www.twinn.live" href="https://www.twinn.live" />
                <ContactItem icon={Phone} label="Phone" value="+91 84285 27015" href="tel:+918428527015" />
                <ContactItem icon={MapPin} label="Address" value="Chennai, India" />
              </div>
            </PolicyCard>
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

function PolicyCard({ id, icon: Icon, number, title, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs font-black tracking-wide text-[var(--brand-pink)]">
            SECTION {number}
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
            {title}
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}

function List({ items }) {
  return (
    <div className="mt-5 space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex gap-3 rounded-2xl border border-border bg-background p-4"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />
          <p className="text-sm font-medium leading-6 text-muted-foreground">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function LegalFlag({ children }) {
  return (
    <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
        <p className="text-sm font-medium leading-6 text-orange-700 dark:text-orange-300">
          <span className="font-black">Legal review flag: </span>
          {children}
        </p>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-[var(--brand-pink)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-black tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
      {content}
    </a>
  );
}

function RefreshIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0 0 19 5M19 5h-6"
      />
    </svg>
  );
}