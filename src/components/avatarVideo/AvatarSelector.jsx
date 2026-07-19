import {
  CheckCircle2,
  Crown,
  ScanFace,
} from "lucide-react";

const getTwinId = (twin) =>
  twin?._id || twin?.id || "";

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
  if (!twin?.voice) return "Warm Female";

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
  "English";

const getTwinStatus = (twin) =>
  twin?.status || "draft";

const isTrained = (twin) =>
  Boolean(
    twin?.isTrained ||
      twin?.trainingStatus ===
        "completed" ||
      twin?.status === "active"
  );

export default function AvatarSelector({
  twins = [],
  selectedTwinId,
  selectedTwin,
  loading = false,
  disabled = false,
  onSelect,
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
            <ScanFace className="h-4 w-4" />
            AI TWIN
          </span>

          <h2 className="mt-4 text-xl font-black">
            Select AI Twin
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose which AI Twin will
            generate the talking
            product video.
          </p>
        </div>

        <div className="rounded-2xl bg-pink-50 px-4 py-2 text-sm font-black text-[var(--brand-pink)] dark:bg-white/10">
          {twins.length}
        </div>
      </div>

      {/* Twin List */}

      <div className="mt-6 space-y-4">
        {twins.map((twin) => {
          const twinId =
            getTwinId(twin);

          const active =
  String(twinId) ===
  String(selectedTwinId);
if (loading) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="text-center py-10">
        <ScanFace className="mx-auto h-10 w-10 animate-pulse text-[var(--brand-pink)]" />
        <p className="mt-4 font-semibold">
          Loading AI Twins...
        </p>
      </div>
    </section>
  );
}
          return (
            <button
              key={twinId}
              type="button"
              onClick={() =>
  onSelect(twin)
}
disabled={disabled}
              className={`group w-full rounded-3xl border p-4 text-left transition-all duration-300

${
  disabled
    ? "cursor-not-allowed opacity-60"
    : ""
}

${
  active
    ? "border-[var(--brand-pink)] bg-pink-50 shadow-lg dark:bg-white/10"
    : "border-border bg-background hover:border-[var(--brand-pink)] hover:shadow-md"
}`}
            >
              <div className="flex gap-4">
                {/* Avatar */}

                <div className="relative">
                  <img
                    src={getTwinImage(
                      twin
                    )}
                    alt={getTwinName(
                      twin
                    )}
                    onError={(
                      e
                    ) => {
                      e.currentTarget.src =
                        "/images/bb.png";
                    }}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />

                  {active && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-[var(--brand-pink)] p-1">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">
                      {getTwinName(
                        twin
                      )}
                    </h3>

                    {isTrained(
                      twin
                    ) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Ready
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <Info
                      label="Voice"
                      value={getTwinVoice(
                        twin
                      )}
                    />

                    <Info
                      label="Language"
                      value={getTwinLanguage(
                        twin
                      )}
                    />

                    <Info
                      label="Status"
                      value={getTwinStatus(
                        twin
                      )}
                    />

                    <Info
                      label="Training"
                      value={
                        isTrained(
                          twin
                        )
                          ? "Completed"
                          : "Pending"
                      }
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
                      AI Twin
                    </span>

                    {active && (
                      <span className="rounded-full bg-[var(--brand-pink)] px-3 py-1 text-xs font-bold text-white">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}

      {twins.length > 1 && (
        <div className="mt-6 rounded-2xl border border-border bg-background p-4">
          <div className="flex items-start gap-3">
            <Crown className="mt-1 h-5 w-5 text-[var(--brand-pink)]" />

            <div>
              <h4 className="font-black">
                Multiple AI Twins
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                Each AI Twin can have
                its own generated
                product videos.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-card p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">
        {value}
      </p>
    </div>
  );
}