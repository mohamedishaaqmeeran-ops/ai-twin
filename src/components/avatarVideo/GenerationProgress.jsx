import {
  Brain,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Sparkles,
  Video,
} from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Preparing AI Twin",
    desc: "Loading avatar, voice and brand profile",
  },
  {
    id: 2,
    title: "Understanding Product",
    desc: "Analyzing product details and sales content",
  },
  {
    id: 3,
    title: "Generating Speech",
    desc: "Creating product-specific presentation",
  },
  {
    id: 4,
    title: "Rendering Video",
    desc: "Generating realistic talking avatar",
  },
  {
    id: 5,
    title: "Finalizing",
    desc: "Uploading and optimizing video",
  },
];

export default function GenerationProgress({
  status = "queued",
  twinName = "",
  productName = "",
  polling = false,
}) {
  const normalized =
    String(status).toLowerCase();

  const currentStep =
    normalized === "queued"
      ? 2
      : normalized === "processing"
      ? 4
      : normalized === "completed"
      ? 5
      : 1;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      {/* Header */}

      <div className="border-b border-border bg-gradient-to-r from-pink-50 via-white to-white p-6 dark:from-white/5 dark:via-background dark:to-background">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
              <Sparkles className="h-4 w-4" />
              AI VIDEO GENERATION
            </span>

            <h2 className="mt-4 text-2xl font-black">
              Creating Your AI Product Video
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Veo is generating a realistic talking
              avatar using your AI Twin and selected
              product.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background px-5 py-4">
            <div className="flex items-center gap-3">
              <LoaderCircle className="h-8 w-8 animate-spin text-[var(--brand-pink)]" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Current Status
                </p>

                <p className="mt-1 text-lg font-black capitalize">
                  {status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Twin */}

      <div className="grid gap-5 border-b border-border p-6 md:grid-cols-2">
        <InfoCard
          icon={Brain}
          title="AI Twin"
          value={twinName}
        />

        <InfoCard
          icon={Video}
          title="Product"
          value={productName}
        />
      </div>

      {/* Progress */}

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-black">
            Rendering Progress
          </h3>

          <span className="rounded-full bg-pink-100 px-3 py-2 text-xs font-bold text-[var(--brand-pink)] dark:bg-white/10">
            {Math.round(
              (currentStep / STEPS.length) * 100
            )}
            %
          </span>
        </div>

        {/* Progress Bar */}

        <div className="mb-8 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="brand-gradient h-full rounded-full transition-all duration-700"
            style={{
              width: `${
                (currentStep / STEPS.length) * 100
              }%`,
            }}
          />
        </div>

        {/* Steps */}

        <div className="space-y-5">
          {STEPS.map((step) => {
            const completed =
              step.id < currentStep;

            const active =
              step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 transition-all

                ${
                  completed
                    ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10"
                    : active
                    ? "border-[var(--brand-pink)] bg-pink-50 dark:bg-white/5"
                    : "border-border bg-background"
                }`}
              >
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl

                  ${
                    completed
                      ? "bg-green-500 text-white"
                      : active
                      ? "brand-gradient text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : active ? (
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                  ) : (
                    <Clock3 className="h-6 w-6" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black">
                      {step.title}
                    </h4>

                    {completed && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        Done
                      </span>
                    )}

                    {active && (
                      <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-bold text-[var(--brand-pink)] dark:bg-white/10">
                        Running
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}

        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/30 dark:bg-amber-900/10">
          <div className="flex gap-4">
            <Clock3 className="mt-1 h-6 w-6 shrink-0 text-amber-600" />

            <div>
              <h4 className="font-black text-amber-700 dark:text-amber-300">
                Rendering in Progress
              </h4>

              <p className="mt-2 text-sm leading-7 text-amber-700 dark:text-amber-400">
                AI video generation typically takes
                <strong> 2–5 minutes</strong>.
                This page automatically checks the
                rendering status every 5 seconds.

                {polling && (
                  <>
                    <br />
                    <span className="mt-2 inline-flex items-center gap-2 font-bold">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Checking latest status...
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-1 text-lg font-black">
            {value || "-"}
          </h3>
        </div>
      </div>
    </div>
  );
}