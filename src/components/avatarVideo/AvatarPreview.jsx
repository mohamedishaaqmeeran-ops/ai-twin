import {
  Bot,
  CheckCircle2,
  CircleAlert,
  Languages,
  MessageSquareText,
  Mic2,
  Package,
  ScanFace,
  Sparkles,
  Video,
} from "lucide-react";

const getTwinName = (twin) =>
  twin?.name ||
  twin?.twinName ||
  "My AI Twin";

const getTwinImage = (twin) =>
  twin?.appearance?.avatarUrl ||
  twin?.avatarUrl ||
  twin?.image ||
  "/images/bb.png";

const getTwinVoice = (twin) => {
  if (!twin?.voice) {
    return "Warm Female";
  }

  if (typeof twin.voice === "string") {
    return twin.voice;
  }

  return (
    twin.voice.voiceType ||
    twin.voice.voiceName ||
    twin.voice.name ||
    "Warm Female"
  );
};

const getTwinLanguage = (twin) =>
  twin?.voice?.language ||
  twin?.primaryLanguage ||
  twin?.language ||
  "English";

const getTwinStyle = (twin) =>
  twin?.appearance?.style ||
  twin?.style ||
  twin?.personality ||
  "Professional";

const getProductName = (product) =>
  product?.name ||
  product?.title ||
  product?.productName ||
  "Selected Product";

const getProductImage = (product) =>
  product?.image ||
  product?.thumbnail ||
  product?.images?.[0] ||
  "/images/product-placeholder.png";

const getProductDescription = (product) =>
  product?.description ||
  product?.shortDescription ||
  product?.details ||
  "No product description available.";

const getProductPrice = (product) =>
  product?.price ??
  product?.salePrice ??
  product?.sellingPrice ??
  "";

const normalizeStatus = (status) =>
  String(status || "idle")
    .trim()
    .toLowerCase();

const statusConfig = {
  idle: {
    label: "Ready to generate",
    className:
      "border-border bg-background text-muted-foreground",
  },

  queued: {
    label: "Queued",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300",
  },

  processing: {
    label: "Generating",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/10 dark:text-blue-300",
  },

  completed: {
    label: "Video ready",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300",
  },

  failed: {
    label: "Generation failed",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300",
  },
};

export default function AvatarPreview({
  twin,
  product,
  speech = "",
  status = "idle",
}) {
  const normalizedStatus =
    normalizeStatus(status);

  const currentStatus =
    statusConfig[normalizedStatus] ||
    statusConfig.idle;

  if (!twin || !product) {
    return (
      <section className="flex min-h-[640px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-6 text-center shadow-sm">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Video className="h-10 w-10" />
        </div>

        <h2 className="mt-6 text-2xl font-black">
          Select a twin and product
        </h2>

        <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          Choose an AI Twin and a product
          to preview the avatar, product
          details, and generated speech.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
            <Sparkles className="h-4 w-4" />
            VIDEO PREVIEW
          </span>

          <h2 className="mt-4 text-2xl font-black tracking-tight">
            AI Product Presentation
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Preview the avatar, product,
            voice, and generated sales
            speech before creating the
            video.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-black ${currentStatus.className}`}
        >
          {normalizedStatus ===
          "completed" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : normalizedStatus ===
            "failed" ? (
            <CircleAlert className="h-4 w-4" />
          ) : (
            <Video className="h-4 w-4" />
          )}

          {currentStatus.label}
        </div>
      </div>

      <div className="grid min-h-[560px] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[560px] overflow-hidden bg-black">
          <img
            src={getTwinImage(twin)}
            alt={getTwinName(twin)}
            onError={(event) => {
              event.currentTarget.src =
                "/images/bb.png";
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-95"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/20" />

          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <PreviewBadge
              icon={ScanFace}
              text={getTwinName(twin)}
            />

            <PreviewBadge
              icon={Mic2}
              text={getTwinVoice(twin)}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-white shadow-2xl backdrop-blur-md sm:p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
                  <Bot className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">
                    Presenter
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    {getTwinName(twin)}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <DarkBadge
                      icon={Languages}
                      text={getTwinLanguage(
                        twin
                      )}
                    />

                    <DarkBadge
                      icon={Sparkles}
                      text={getTwinStyle(
                        twin
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <ProductPreview
            product={product}
          />

          <SpeechPreview
            speech={speech}
          />

          <div className="rounded-3xl border border-border bg-background p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                <Video className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-black">
                  What will be generated?
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A talking avatar video
                  using this twin's image,
                  language, brand style,
                  and the selected
                  product's information.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetaCard
              icon={Mic2}
              label="Voice"
              value={getTwinVoice(twin)}
            />

            <MetaCard
              icon={Languages}
              label="Language"
              value={getTwinLanguage(
                twin
              )}
            />

            <MetaCard
              icon={Sparkles}
              label="Style"
              value={getTwinStyle(twin)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductPreview({ product }) {
  const price =
    getProductPrice(product);

  return (
    <div className="rounded-3xl border border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <img
          src={getProductImage(product)}
          alt={getProductName(product)}
          onError={(event) => {
            event.currentTarget.src =
              "/images/product-placeholder.png";
          }}
          className="h-24 w-24 shrink-0 rounded-2xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
            <Package className="h-3.5 w-3.5" />
            SELECTED PRODUCT
          </span>

          <h3 className="mt-3 truncate text-xl font-black">
            {getProductName(product)}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {getProductDescription(
              product
            )}
          </p>

          {price !== "" && (
            <p className="mt-3 text-lg font-black text-[var(--brand-pink)]">
              ₹{price}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SpeechPreview({ speech }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
            <MessageSquareText className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-black">
              AI Speech Preview
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Generated from twin and
              product details
            </p>
          </div>
        </div>

        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground">
          {speech.length} characters
        </span>
      </div>

      <div className="mt-4 max-h-52 overflow-y-auto rounded-2xl border border-border bg-card p-4">
        {speech ? (
          <p className="whitespace-pre-wrap text-sm leading-7">
            {speech}
          </p>
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">
            Speech will appear after
            selecting a twin and product.
          </p>
        )}
      </div>
    </div>
  );
}

function PreviewBadge({
  icon: Icon,
  text,
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
      <Icon className="h-4 w-4" />
      {text}
    </span>
  );
}

function DarkBadge({
  icon: Icon,
  text,
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/90">
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}

function MetaCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Icon className="h-5 w-5 text-[var(--brand-pink)]" />

      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black">
        {value}
      </p>
    </div>
  );
}