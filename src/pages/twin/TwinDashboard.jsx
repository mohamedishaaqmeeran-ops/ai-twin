import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Database,
  Mic,
  Eye,
  Package,
  Radio,
  ScanFace,
  Brain,
  CheckCircle2,
  Calendar,
  Instagram,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

export default function TwinDashboard() {
  const navigate = useNavigate();

  const hasTwin = localStorage.getItem("hasTwin") === "true";
  const isTrained = localStorage.getItem("isTwinTrained") === "true";
  const twinName = localStorage.getItem("twinName") || "My AI Twin";
  const twinImage =  "/images/bb.png";
  const selectedProduct =
    localStorage.getItem("selectedProduct") || "No product selected";

  const handleGoLive = () => {
    if (!hasTwin) {
      navigate("/app/twin/create");
      return;
    }

    if (selectedProduct === "No product selected") {
      navigate("/app/products");
      return;
    }

    navigate("/app/golive");
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_360px] xl:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              AI TWIN OVERVIEW
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              <span className="brand-text">{twinName}</span>
              <br />
              is ready to sell.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage your AI Twin, train it with brand knowledge, add products,
              connect social media and start live selling.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleGoLive}
                className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md hover:opacity-90"
              >
                Go Live Now
                <Radio className="h-4 w-4" />
              </button>

              <Link
                to="/app/twin/train"
                className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-6 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
              >
                Train Twin
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="brand-gradient rounded-3xl">
            <img
              src={twinImage}
              alt="AI Twin"
              className="h-80 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Status Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          icon={ScanFace}
          label="Avatar"
          value={hasTwin ? "Created" : "Missing"}
          active={hasTwin}
        />
        <StatusCard
          icon={Brain}
          label="Training"
          value={isTrained ? "Completed" : "Draft"}
          active={isTrained}
        />
        <StatusCard
          icon={Package}
          label="Selected Product"
          value={selectedProduct}
          active={selectedProduct !== "No product selected"}
        />
        <StatusCard
          icon={Radio}
          label="Live Status"
          value="Ready"
          active={hasTwin}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Actions */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-xl font-black brand-text">Twin Actions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete these steps before launching your live session.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ActionCard
              to="/app/twin/create"
              icon={Sparkles}
              title="Edit AI Twin"
              desc="Update face, style and basic info."
            />
            <ActionCard
              to="/app/twin/train"
              icon={Database}
              title="Train Twin"
              desc="Add FAQs, PDFs and brand knowledge."
            />
            <ActionCard
              to="/app/twin/preview"
              icon={Eye}
              title="Preview Twin"
              desc="Test how your twin answers users."
            />
            <ActionCard
              to="/app/products"
              icon={Package}
              title="Products"
              desc="Add products your twin can sell."
            />
            <ActionCard
              to="/app/connect"
              icon={Mic}
              title="Connect Social"
              desc="Connect YouTube, Instagram and TikTok."
            />
            <button
              onClick={handleGoLive}
              className="rounded-3xl border border-border bg-background p-5 text-left transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
                <Radio className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-black">Go Live</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Select product and start selling live.
              </p>
            </button>
          </div>
        </div>

        {/* Twin Preview */}
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Twin Preview</h2>

          <div className="mt-5 overflow-hidden rounded-3xl bg-pink-50">
            <img
              src={twinImage}
              alt="AI Twin"
              className="h-96 w-full object-cover"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <p className="font-bold">Hi! I’m {twinName}.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              I can answer questions and sell your products live.
            </p>
          </div>

          <Link
            to="/app/twin/preview"
            className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
          >
            Test Twin
          </Link>
        </aside>
      </section>

      {/* Training Checklist + Schedule */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Setup Checklist</h2>

          <div className="mt-5 space-y-4">
            <ChecklistItem
              title="AI Twin Created"
              desc="Face, style and basic identity completed."
              done={hasTwin}
            />
            <ChecklistItem
              title="Voice Selected"
              desc="Voice tone selected for live selling."
              done={hasTwin}
            />
            <ChecklistItem
              title="Knowledge Added"
              desc="Brand files, links and FAQs uploaded."
              done={isTrained}
            />
            <ChecklistItem
              title="Product Selected"
              desc={selectedProduct}
              done={selectedProduct !== "No product selected"}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Next Live Session</h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
                <Instagram className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-black">Instagram Live</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info icon={Calendar} label="Date" value="Today" />
              <Info icon={BadgeCheck} label="Status" value="Scheduled" />
            </div>

            <Link
              to="/app/schedule"
              className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
            >
              Manage Schedule
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, desc }) {
  return (
    <Link
      to={to}
      className="rounded-3xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
    </Link>
  );
}

function StatusCard({ icon: Icon, label, value, active }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="mt-2 truncate text-xl font-black brand-text">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p
        className={`mt-3 text-sm font-bold ${
          active ? "text-emerald-600" : "text-orange-500"
        }`}
      >
        ● {active ? "Completed" : "Required"}
      </p>
    </div>
  );
}

function ChecklistItem({ title, desc, done }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-background p-4">
      <CheckCircle2
        className={`mt-0.5 h-5 w-5 shrink-0 ${
          done ? "text-emerald-600" : "text-orange-500"
        }`}
      />

      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </div>
      <p className="mt-2 font-black">{value}</p>
    </div>
  );
}