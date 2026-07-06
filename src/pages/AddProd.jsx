import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Sparkles,
  Upload,
  FileText,
  Link2,
  MessageSquareText,
  RefreshCcw,
  CheckCircle2,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  Brain,
  Globe,
  Mic,
  Eye,
  Wand2,
} from "lucide-react";
import Logo from "../components/Logo";
import Nav from "../components/Nav";

export default function AddProd() {
  const { user } = useSelector((state) => state.auth || {});
const trainPath = user ? "/app/twin/train" : "/signin";
  const features = [
    {
      icon: Upload,
      title: "Multiple ways to add knowledge",
      desc: "Upload files like PDF, DOCX, TXT and CSV, import your website URL, add FAQ and policy details, or train using recorded voice notes — whatever is easiest for your workflow.",
    },
    {
      icon: MessageSquareText,
      title: "Built for real selling questions",
      desc: "Add shipping, refund and COD details so your AI Twin can answer the questions that actually come up during a live session.",
    },
    {
      icon: Brain,
      title: "Describe your brand in your own words",
      desc: "Tell your AI Twin who you sell to and what you sell — your products, target customers and tone — and it adapts its answers accordingly.",
    },
    {
      icon: RefreshCcw,
      title: "Keep it current",
      desc: "Update your product and policy information anytime — your AI Twin's answers update with it.",
    },
  ];

  const steps = [
    "Upload product files, or import them directly from your website.",
    "Add FAQs and policies — shipping, refunds, COD and more.",
    "Describe your brand, audience and products in your own words.",
    "Preview your AI Twin to confirm it understands your catalogue before going live.",
  ];

  const knowledgeCards = [
    { icon: FileText, title: "Product files", desc: "PDF, DOCX, TXT, CSV" },
    { icon: Globe, title: "Website URL", desc: "Import from your store" },
    { icon: Truck, title: "Shipping policy", desc: "Delivery answers" },
    { icon: RotateCcw, title: "Refund policy", desc: "Return and exchange rules" },
    { icon: CreditCard, title: "COD details", desc: "Payment information" },
    { icon: Mic, title: "Voice notes", desc: "Train with recordings" },
  ];

  return (
     <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Nav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-pink-50/40 to-orange-50/30 py-16 dark:from-background dark:via-white/5 dark:to-white/5">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_460px] lg:items-center lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
                ADD PRODUCTS
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Teach your AI Twin everything
                <br />
                <span className="brand-text">it needs to sell.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Upload your catalogue, FAQs and policies, and your AI Twin
                learns your products inside and out — so it can answer questions
                and close sales without you standing by.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                 to={trainPath}
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
                >
                  Upload Your Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[40px] border border-border bg-card p-4 shadow-xl">
              <div className="relative overflow-hidden rounded-[32px] bg-pink-50 p-5 dark:bg-white/10">
                <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black tracking-tight brand-text">
                        Product Knowledge Hub
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Files, FAQs, policies and product scripts
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border-2 border-dashed border-[var(--brand-pink)] bg-pink-50 p-6 text-center dark:bg-white/10">
                    <Upload className="mx-auto h-9 w-9 text-[var(--brand-pink)]" />

                    <h3 className="mt-4 text-lg font-black tracking-tight text-foreground">
                      Upload product catalogue
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                      PDF, DOCX, TXT, CSV or website import
                    </p>

                    <button className="brand-gradient mt-5 rounded-[5px] px-5 py-3 text-sm font-bold tracking-wide text-white">
                      Select Files
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {["Shipping", "Refunds", "COD", "FAQs"].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border bg-card p-3"
                      >
                        <p className="text-xs font-black tracking-tight text-foreground">
                          {item}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                          Knowledge added
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={trainPath}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                  >
                    Open Train AI Step
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Why It <span className="brand-text">Matters</span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
              Better product knowledge means better answers, stronger trust and
              more confident buying decisions during live sessions.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Icon className="h-6 w-6" />
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

        <section className="bg-pink-50/50 py-16 dark:bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                    Add Product Knowledge{" "}
                    <span className="brand-text">Your Way</span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                    Use files, websites, policies, FAQs and voice notes to teach
                    your AI Twin what to sell and how to answer.
                  </p>
                </div>

                <Link
                  to={trainPath}
                  className="inline-flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Open Training
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {knowledgeCards.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-border bg-background p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black tracking-tight text-foreground">
                          {title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                          {desc}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[40px] border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              How It <span className="brand-text">Works</span>
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-border bg-background p-5"
                >
                  <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white">
                    {index + 1}
                  </span>

                  <p className="mt-4 text-sm font-medium leading-6 text-muted-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-[40px] p-8 text-center text-white shadow-xl sm:p-12">
            <Wand2 className="mx-auto h-12 w-12" />

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to teach your AI Twin what to sell?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-white/85">
              Create your AI Twin in minutes. Go live in hours.
            </p>

            <Link
              to={trainPath}
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black tracking-wide text-[var(--brand-pink)] transition hover:opacity-90"
            >
              Get Started
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