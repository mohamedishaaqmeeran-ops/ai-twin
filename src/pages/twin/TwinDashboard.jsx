import {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  BadgeCheck,
  Brain,
  Calendar,
  CheckCircle2,
  Coins,
  Crown,
  Database,
  Eye,
  Instagram,
  LoaderCircle,
  Mic,
  Package,
  Plus,
  Radio,
  ScanFace,
  Sparkles,
  Store,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

/* =========================================================
   HELPERS
========================================================= */

const getTwinId = (twin) =>
  twin?._id || twin?.id || "";

const getTwinName = (twin) =>
  twin?.name ||
  twin?.twinName ||
  "My AI Twin";

const getTwinImage = (twin) =>
  twin?.appearance?.avatarUrl ||
  twin?.image ||
  "/images/bb.png";
const getTwinVideo = (twin) =>
  twin?.appearance?.avatarVideoUrl ||
  twin?.avatarVideoUrl ||
  "";
const getTwinVoice = (twin) => {
  if (!twin?.voice) {
    return (
      twin?.voiceName ||
      "Warm Female"
    );
  }

  if (
    typeof twin.voice === "string"
  ) {
    return twin.voice;
  }

  return (
    twin.voice.voiceType ||
    twin.voice.voiceName ||
    twin.voice.name ||
    twin.voiceName ||
    "Warm Female"
  );
};

const getTwinLanguage = (twin) => {
  if (
    typeof twin?.voice === "object" &&
    twin.voice !== null
  ) {
    return (
      twin.voice.language ||
      twin.primaryLanguage ||
      "English"
    );
  }

  return (
    twin?.primaryLanguage ||
    "English"
  );
};

const getTwinStatus = (twin) =>
  twin?.status || "draft";

const isTwinTrained = (twin) =>
  Boolean(
    twin?.isTrained ||
      twin?.trainingStatus ===
        "completed" ||
      twin?.status === "active"
  );

const getProductsFromUser = (user) => {
  if (
    Array.isArray(user?.products)
  ) {
    return user.products;
  }

  return [];
};

const formatPlan = (plan) => {
  const normalized =
    String(plan || "free")
      .trim()
      .toLowerCase();

  if (normalized === "business") {
    return "Business";
  }

  if (normalized === "pro") {
    return "Pro";
  }

  return "Free";
};

/* =========================================================
   COMPONENT
========================================================= */

export default function TwinDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [checkingVideo, setCheckingVideo] =
  useState(false);
  const {
    user,
  } = useSelector(
    (state) => state.auth || {}
  );

  const {
    twins = [],
    loading,
    initialized,
    error,
  } = useSelector(
    (state) => state.twin || {}
  );

  const normalizedPlan =
    String(
      user?.plan || "free"
    ).toLowerCase();

  const isBusiness =
    normalizedPlan === "business";

  const isPro =
    normalizedPlan === "pro" ||
    isBusiness;

  const maxTwins =
    isBusiness
      ? Infinity
      : isPro
      ? 3
      : 1;

  const canCreateTwin =
    !Number.isFinite(maxTwins) ||
    twins.length < maxTwins;

  const hasTwin =
    twins.length > 0;

  const activeTwin =
    twins[0] || null;

  const products =
    useMemo(
      () =>
        getProductsFromUser(user),
      [user]
    );

  const activeTwinId =
    getTwinId(activeTwin);

  const twinName =
    getTwinName(activeTwin);

  const twinImage =
    getTwinImage(activeTwin);

  const twinVoice =
    getTwinVoice(activeTwin);

  const twinLanguage =
    getTwinLanguage(activeTwin);

  const trained =
    isTwinTrained(activeTwin);

  const selectedProduct =
    products.length > 0
      ? products[0]?.name ||
        products[0]?.title ||
        "Selected product"
      : "No product selected";

  const planName =
    formatPlan(user?.plan);

  useEffect(() => {
    dispatch(fetchTwins());
  }, [dispatch]);




  const handleCreateTwin = () => {
    if (!canCreateTwin) {
      return;
    }

    navigate("/app/twin/create");
  };

  const handleGoLive = (
    selectedTwin = activeTwin
  ) => {
    if (!selectedTwin) {
      navigate("/app/twin/create");
      return;
    }

    if (!products.length) {
      navigate("/app/products");
      return;
    }

    const twinId =
      getTwinId(selectedTwin);

    navigate(
      `/app/golive?twinId=${twinId}`,
      {
        state: {
          selectedTwin,
          selectedProduct:
            products[0],
        },
      }
    );
  };

  const handleEditTwin = (twin) => {
    const twinId =
      getTwinId(twin);

    navigate(
      `/app/twin/edit?twinId=${twinId}`
    );
  };

  const handleTrainTwin = (
    twin
  ) => {
    const twinId =
      getTwinId(twin);

    navigate(
      `/app/twin/train?twinId=${twinId}`
    );
  };

  const handleTestTwin = (
    twin = activeTwin
  ) => {
    if (!twin) {
      navigate("/app/twin/create");
      return;
    }

    const twinId =
      getTwinId(twin);

    navigate(
      `/app/twin/test?twinId=${twinId}`
    );
  };
useEffect(() => {
  if (!activeTwinId) return;

  const status =
    activeTwin?.appearance?.avatarVideoStatus;

  if (
    status !== "queued" &&
    status !== "processing"
  ) {
    return;
  }

  setCheckingVideo(true);

  const timer = setInterval(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/twin/${activeTwinId}/avatar-video-status`,
        {
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (
        data.success &&
        (
          data.data.status ===
            "completed" ||
          data.data.status ===
            "failed"
        )
      ) {
        clearInterval(timer);

        dispatch(fetchTwins());

        setCheckingVideo(false);
      }
    } catch (err) {
      console.error(err);
    }
  }, 5000);

  return () => {
    clearInterval(timer);
  };
}, [
  activeTwinId,
  activeTwin?.appearance?.avatarVideoStatus,
  dispatch,
]);
  if (
    loading &&
    !initialized
  ) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-[var(--brand-pink)]" />

          <p className="mt-3 text-sm font-bold text-muted-foreground">
            Loading your AI Twins...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
          {error}
        </div>
      )}

      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-6 ${
          isPro
            ? "border-[var(--brand-pink)] bg-pink-50/70 dark:bg-white/10"
            : "border-border bg-card"
        }`}
      >
        {isPro && (
          <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-full bg-[var(--brand-pink)] px-4 py-2 text-xs font-black text-white sm:flex">
            <Crown className="h-4 w-4" />

            {planName.toUpperCase()} PLAN
            ACTIVE
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px] xl:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
              {isPro ? (
                <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
              ) : (
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
              )}

              {isPro
                ? "PRO AI TWIN OVERVIEW"
                : "AI TWIN OVERVIEW"}
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
              <span className="brand-text">
                {hasTwin
                  ? twinName
                  : "Create Your AI Twin"}
              </span>

              <br />

              {hasTwin
                ? "Ready to sell."
                : "Start your AI journey."}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {isBusiness
                ? "Your Business plan supports unlimited AI Twins."
                : isPro
                ? "Your Pro plan allows a maximum of three AI Twins."
                : "Your Free plan allows one AI Twin."}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <p className="inline-flex rounded-full bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
                AI Twins: {twins.length}
                {Number.isFinite(
                  maxTwins
                )
                  ? `/${maxTwins}`
                  : ""}
              </p>

              {activeTwin && (
                <p className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Status:{" "}
                  {getTwinStatus(
                    activeTwin
                  )}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {canCreateTwin && (
                <button
                  type="button"
                  onClick={
                    handleCreateTwin
                  }
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Create AI Twin
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  handleGoLive()
                }
                className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-6 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
              >
                {isPro
                  ? "Start Pro Live"
                  : "Go Live Now"}

                <Radio className="h-4 w-4" />
              </button>
            </div>
          </div>

 <div className="rounded-3xl bg-pink-50 p-3 dark:bg-white/10">

 

  <TwinMotionPreview
    twin={activeTwin}
    className="h-96"
  />

  {checkingVideo && (
    <div className="mt-3 rounded-lg bg-pink-100 p-3 text-center text-sm font-semibold text-pink-600 dark:bg-pink-900/20 dark:text-pink-300">
      Generating AI motion video...
    </div>
  )}

</div>
        </div>
      </section>

      {/* ===================================================
          MARKETPLACE
      =================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
              <Store className="h-4 w-4" />
              AVATAR MARKETPLACE
            </span>

            <h2 className="mt-4 text-2xl font-black tracking-tight">
              Unlock premium{" "}
              <span className="brand-text">
                AI Live Hosts
              </span>
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Browse premium avatars and
              add them to your collection.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-sm font-black">
              <Coins className="h-5 w-5 text-[var(--brand-pink)]" />

              {Number(
                user?.credits || 0
              ).toLocaleString()}{" "}
              Credits
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/app/avatar-marketplace"
                )
              }
              className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white"
            >
              <Store className="h-4 w-4" />
              Browse Avatars
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          CREATED TWINS
      =================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight brand-text">
              Created AI Twins
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              All Twins shown below are
              loaded from your backend.
            </p>
          </div>

          {canCreateTwin && (
            <button
              type="button"
              onClick={handleCreateTwin}
              className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Create Avatar
            </button>
          )}
        </div>

        {!twins.length ? (
          <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-background p-6 text-center">
            <ScanFace className="h-12 w-12 text-[var(--brand-pink)]" />

            <h3 className="mt-4 text-xl font-black">
              No AI Twin created
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Create your first AI Twin,
              upload its appearance and
              train it using your brand
              knowledge.
            </p>

            <button
              type="button"
              onClick={handleCreateTwin}
              className="brand-gradient mt-5 flex h-11 items-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Create AI Twin
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {twins.map(
              (twin, index) => {
                const twinId =
                  getTwinId(twin);

                const currentName =
                  getTwinName(twin);

                const currentImage =
                  getTwinImage(twin);

                const currentVoice =
                  getTwinVoice(twin);

                const currentLanguage =
                  getTwinLanguage(twin);

                const currentTrained =
                  isTwinTrained(twin);

                return (
                  <article
                    key={
                      twinId || index
                    }
                    className="rounded-3xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
                  >
                    <TwinMotionPreview
  twin={twin}
  className="h-64"
/>

                    <h3 className="mt-4 text-lg font-black tracking-tight text-foreground">
                      {currentName}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Voice:{" "}
                      {currentVoice}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Language:{" "}
                      {currentLanguage}
                    </p>

                    <p
                      className={`mt-2 text-sm font-bold ${
                        currentTrained
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-orange-500 dark:text-orange-400"
                      }`}
                    >
                      ●{" "}
                      {currentTrained
                        ? "Trained and active"
                        : "Training required"}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditTwin(
                            twin
                          )
                        }
                        className="flex h-10 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleTrainTwin(
                            twin
                          )
                        }
                        className="flex h-10 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)]"
                      >
                        Train
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleTestTwin(
                            twin
                          )
                        }
                        className="flex h-10 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)]"
                      >
                        Test
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleGoLive(
                            twin
                          )
                        }
                        className="brand-gradient h-10 rounded-[5px] text-sm font-bold text-white"
                      >
                        Go Live
                      </button>
                    </div>
                  </article>
                );
              }
            )}

            {canCreateTwin && (
              <button
                type="button"
                onClick={
                  handleCreateTwin
                }
                className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--brand-pink)] bg-pink-50 p-5 text-center transition hover:-translate-y-1 hover:shadow-lg dark:bg-white/10"
              >
                <Plus className="h-10 w-10 text-[var(--brand-pink)]" />

                <h3 className="mt-4 text-lg font-black text-foreground">
                  Create New AI Twin
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {twins.length}
                  {Number.isFinite(
                    maxTwins
                  )
                    ? `/${maxTwins}`
                    : ""}{" "}
                  created
                </p>
              </button>
            )}
          </div>
        )}
      </section>

      {/* ===================================================
          STATUS
      =================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          icon={ScanFace}
          label="AI Twins"
          value={
            Number.isFinite(maxTwins)
              ? `${twins.length}/${maxTwins}`
              : `${twins.length}`
          }
          active={hasTwin}
        />

        <StatusCard
          icon={Brain}
          label="Training"
          value={
            trained
              ? isPro
                ? "Advanced"
                : "Completed"
              : "Required"
          }
          active={trained}
        />

        <StatusCard
          icon={Package}
          label="Products"
          value={`${products.length} Products`}
          active={
            products.length > 0
          }
        />

        <StatusCard
          icon={Radio}
          label="Live Status"
          value={
            hasTwin &&
            products.length
              ? "Ready"
              : "Setup Required"
          }
          active={
            hasTwin &&
            products.length > 0
          }
        />
      </section>

      {/* ===================================================
          ACTIONS AND PREVIEW
      =================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            AI Twin Actions
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ActionButton
              icon={Sparkles}
              title="Edit AI Twin"
              desc="Update appearance, voice and personality."
              disabled={!activeTwin}
              onClick={() => {
                if (activeTwin) {
                  handleEditTwin(
                    activeTwin
                  );
                }
              }}
            />

            <ActionButton
              icon={Database}
              title="Train Twin"
              desc="Add documents, website data and brand knowledge."
              disabled={!activeTwin}
              onClick={() => {
                if (activeTwin) {
                  handleTrainTwin(
                    activeTwin
                  );
                }
              }}
            />

            <ActionButton
              icon={Eye}
              title="Test Twin"
              desc="Test AI responses using your uploaded knowledge."
              disabled={!activeTwin}
              onClick={() =>
                handleTestTwin()
              }
            />

            <ActionCard
              to="/app/products"
              icon={Package}
              title="Products"
              desc="Add products your Twin can sell."
            />

            <ActionCard
              to="/app/connect"
              icon={Mic}
              title="Connect Social"
              desc="Connect supported social platforms."
            />

            <ActionButton
              icon={Radio}
              title="Go Live"
              desc="Select a product and start selling live."
              disabled={!activeTwin}
              onClick={() =>
                handleGoLive()
              }
            />
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Twin Preview
          </h2>

          <div className="mt-5 overflow-hidden rounded-3xl bg-pink-50 p-3 dark:bg-white/10">
            <img
              src={twinImage}
              alt={twinName}
              onError={(event) => {
                event.currentTarget.src =
                  "/images/bb.png";
              }}
              className="h-96 w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <p className="text-base font-black tracking-tight text-foreground">
              Hi! I&apos;m{" "}
              {twinName}.
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Voice: {twinVoice}
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Language:{" "}
              {twinLanguage}
            </p>
          </div>

          <button
            type="button"
            disabled={!activeTwin}
            onClick={() =>
              handleTestTwin()
            }
            className="mt-5 flex h-11 w-full items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
          >
            Test Twin
          </button>
        </aside>
      </section>

      {/* ===================================================
          CHECKLIST AND SESSION
      =================================================== */}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Setup Checklist
          </h2>

          <div className="mt-5 space-y-4">
            <ChecklistItem
              title="AI Twin Created"
              desc={
                hasTwin
                  ? `${twins.length} AI Twin(s) available.`
                  : "Create your first AI Twin."
              }
              done={hasTwin}
            />

            <ChecklistItem
              title="Voice Configured"
              desc={
                hasTwin
                  ? `${twinVoice}, ${twinLanguage}`
                  : "Select a voice for your AI Twin."
              }
              done={hasTwin}
            />

            <ChecklistItem
              title="Knowledge Added"
              desc={
                trained
                  ? "AI Twin training is complete."
                  : "Upload brand knowledge and documents."
              }
              done={trained}
            />

            <ChecklistItem
              title="Product Selected"
              desc={selectedProduct}
              done={
                products.length > 0
              }
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Next Live Session
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                <Instagram className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-black tracking-tight text-foreground">
                  {isPro
                    ? "Multi-Platform Live"
                    : "Instagram Live"}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {selectedProduct}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info
                icon={Calendar}
                label="Date"
                value="Not scheduled"
              />

              <Info
                icon={BadgeCheck}
                label="Status"
                value={
                  hasTwin &&
                  products.length
                    ? "Ready"
                    : "Setup Required"
                }
              />
            </div>

            <Link
              to="/app/schedule"
              className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
            >
              Manage Schedule
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   SUBCOMPONENTS
========================================================= */

function ActionCard({
  to,
  icon: Icon,
  title,
  desc,
}) {
  return (
    <Link
      to={to}
      className="rounded-3xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-base font-black tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {desc}
      </p>
    </Link>
  );
}

function ActionButton({
  icon: Icon,
  title,
  desc,
  onClick,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-3xl border border-border bg-background p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-base font-black tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {desc}
      </p>
    </button>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  active,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {label}
          </p>

          <h3 className="mt-2 truncate text-xl font-black tracking-tight brand-text">
            {String(
              value ?? ""
            )}
          </h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p
        className={`mt-3 text-sm font-bold ${
          active
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-orange-500 dark:text-orange-400"
        }`}
      >
        ●{" "}
        {active
          ? "Completed"
          : "Required"}
      </p>
    </div>
  );
}

function ChecklistItem({
  title,
  desc,
  done,
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-background p-4">
      <CheckCircle2
        className={`mt-0.5 h-5 w-5 shrink-0 ${
          done
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-orange-500 dark:text-orange-400"
        }`}
      />

      <div>
        <p className="text-sm font-black tracking-tight text-foreground">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {String(
            desc ?? ""
          )}
        </p>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

        {label}
      </div>

      <p className="mt-2 text-sm font-black text-foreground">
        {String(
          value ?? ""
        )}
      </p>
    </div>
  );
}


function TwinMotionPreview({
  twin,
  className = "h-80",
}) {
  const videoUrl =
    getTwinVideo(
      twin
    );

  const imageUrl =
    getTwinImage(
      twin
    );

  const status =
    twin?.appearance
      ?.avatarVideoStatus ||
    "idle";

  if (
  status === "queued" ||
  status === "processing"
) {
    return (
      <div
        className={`relative flex ${className} w-full items-center justify-center overflow-hidden rounded-2xl bg-pink-50 dark:bg-white/10`}
      >
        <img
          src={imageUrl}
          alt={getTwinName(
            twin
          )}
          className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm"
        />

        <div className="relative z-10 rounded-2xl bg-black/60 px-6 py-4 text-center text-white backdrop-blur-md">
          <LoaderCircle className="mx-auto h-7 w-7 animate-spin" />

          <p className="mt-3 text-sm font-black">
            Generating your motion
            AI Twin...
          </p>

          <p className="mt-1 text-xs text-white/70">
            The video will appear
            automatically when ready.
          </p>
        </div>
      </div>
    );
  }

  if (
    videoUrl &&
    status ===
      "completed"
  ) {
    return (
      <video
        src={videoUrl}
        poster={imageUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={`${className} w-full rounded-2xl object-cover`}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={getTwinName(
        twin
      )}
      onError={(
        event
      ) => {
        event.currentTarget.src =
          "/images/bb.png";
      }}
      className={`${className} w-full rounded-2xl object-cover`}
    />
  );
}


function TwinMedia({
  twin,
  className,
}) {
  const imageUrl =
    twin?.appearance
      ?.avatarUrl ||
    "/images/bb.png";

  const videoUrl =
    twin?.appearance
      ?.avatarVideoUrl;

  const status =
    twin?.appearance
      ?.avatarVideoStatus;

  if (
    status ===
      "queued" ||
    status ===
      "processing"
  ) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${className}`}
      >
        <img
          src={imageUrl}
          alt={
            twin?.name ||
            "AI Twin"
          }
          className="h-full w-full object-cover opacity-50"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
          <div className="text-center text-white">
            <LoaderCircle className="mx-auto h-7 w-7 animate-spin" />

            <p className="mt-2 text-sm font-bold">
              Generating motion
              video...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    status ===
      "completed" &&
    videoUrl
  ) {
    return (
      <video
        src={videoUrl}
        poster={imageUrl}
        autoPlay
        muted
        loop
        playsInline
        className={`${className} w-full rounded-2xl object-cover`}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={
        twin?.name ||
        "AI Twin"
      }
      className={`${className} w-full rounded-2xl object-cover`}
    />
  );
}