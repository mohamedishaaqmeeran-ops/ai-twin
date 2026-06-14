import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  ScanFace,
  Package,
  Radio,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold tracking-wide text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              PAGE NOT FOUND
            </span>

            <h1 className="mt-6 text-6xl font-black leading-none tracking-tight brand-text sm:text-7xl lg:text-8xl">
              404
            </h1>

            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
              Oops! Your AI Twin
              <br />
              couldn't find this page.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              The page may have been moved, deleted or never existed. Don't
              worry, your AI Twin is still ready to sell for you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/"
                className="brand-gradient flex items-center gap-2 rounded-[5px] px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:opacity-90"
              >
                <Home className="h-4 w-4" />
                Back Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <QuickCard icon={ScanFace} title="AI Twin" to="/app/twin" />
              <QuickCard icon={Package} title="Products" to="/app/products" />
              <QuickCard icon={Radio} title="Go Live" to="/app/golive" />
            </div>
          </div>

          {/* Right */}
          <div className="relative flex justify-center">
            <div className="brand-gradient absolute h-80 w-80 rounded-full opacity-20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[40px] border border-border bg-card p-5 shadow-xl">
              <img
                src="/images/dd.png"
                alt="AI Twin"
                className="h-[520px] w-full rounded-[30px] object-cover"
              />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 backdrop-blur dark:bg-black/70">
                <p className="text-lg font-black tracking-tight brand-text">
                  "I'm still here!"
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                  Let's get you back to selling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ icon: Icon, title, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-black tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-1 text-xs font-medium text-muted-foreground">
        Open page
      </p>
    </Link>
  );
}