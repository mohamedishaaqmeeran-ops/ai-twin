import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useSearchParams,
} from "react-router-dom";

import {
  AlertCircle,
  Bot,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  MessageSquare,
  Mic,
  Phone,
  PhoneOff,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

import useLiveAvatarEmbed from "../../hooks/useLiveAvatarEmbed";

/* =========================================================
   HELPERS
========================================================= */

const getTwinImage = (twin) => {
  return (
    twin?.appearance?.avatarUrl ||
    twin?.image ||
    "/images/bb.png"
  );
};

const getTwinVoice = (twin) => {
  if (
    typeof twin?.voice === "string"
  ) {
    return twin.voice;
  }

  return (
    twin?.voice?.voiceType ||
    twin?.voice?.voiceName ||
    twin?.voiceName ||
    "LiveAvatar voice agent"
  );
};

/* =========================================================
   PAGE
========================================================= */

export default function TestTwin() {
  const dispatch = useDispatch();

  const [searchParams] =
    useSearchParams();

  const {
    twins = [],
    loading: twinsLoading,
  } = useSelector(
    (state) => state.twin
  );

  const liveAvatar =
    useLiveAvatarEmbed();

  const connectingRef =
    useRef(false);

  const [
    selectedTwinId,
    setSelectedTwinId,
  ] = useState(
    searchParams.get("twinId") ||
      ""
  );

  const [
    language,
    setLanguage,
  ] = useState("English");

  const [
    pageError,
    setPageError,
  ] = useState("");

  /* =======================================================
     LOAD TWINS
  ======================================================= */

  useEffect(() => {
    dispatch(fetchTwins());
  }, [dispatch]);

  /* =======================================================
     AUTO SELECT FIRST TWIN
  ======================================================= */

  useEffect(() => {
    if (
      !selectedTwinId &&
      twins.length > 0
    ) {
      setSelectedTwinId(
        twins[0]._id
      );
    }
  }, [
    selectedTwinId,
    twins,
  ]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      liveAvatar.stop();
    };
  }, [liveAvatar.stop]);

  /* =======================================================
     SELECTED TWIN
  ======================================================= */

  const selectedTwin =
    useMemo(() => {
      return (
        twins.find(
          (twin) =>
            twin._id ===
            selectedTwinId
        ) || null
      );
    }, [
      selectedTwinId,
      twins,
    ]);

  const twinImage =
    getTwinImage(selectedTwin);

  const twinVoice =
    getTwinVoice(selectedTwin);

  const connectionStarting =
    liveAvatar.loading;

  const sessionReady =
    Boolean(
      liveAvatar.embedUrl &&
        liveAvatar.connected
    );

  const visibleError =
    pageError ||
    liveAvatar.error;

  /* =======================================================
     START LIVEAVATAR
  ======================================================= */

  const handleConnect =
    async () => {
      if (
        connectingRef.current ||
        liveAvatar.loading ||
        liveAvatar.embedUrl
      ) {
        return;
      }

      try {
        setPageError("");

        if (!selectedTwinId) {
          throw new Error(
            "Select an AI Twin first."
          );
        }

        connectingRef.current =
          true;

        console.log(
          "STARTING LIVEAVATAR:",
          {
            twinId:
              selectedTwinId,

            language,
          }
        );

        const result =
          await liveAvatar.start();

        console.log(
          "LIVEAVATAR SESSION CREATED:",
          result
        );
      } catch (error) {
        console.error(
          "LIVEAVATAR CONNECT ERROR:",
          error
        );

        setPageError(
          error?.message ||
            "Unable to start LiveAvatar."
        );
      } finally {
        connectingRef.current =
          false;
      }
    };

  /* =======================================================
     STOP LIVEAVATAR
  ======================================================= */

  const handleDisconnect = () => {
    setPageError("");

    liveAvatar.stop();

    connectingRef.current =
      false;
  };

  /* =======================================================
     RESTART
  ======================================================= */

  const handleRestart =
    async () => {
      liveAvatar.stop();

      await new Promise(
        (resolve) =>
          window.setTimeout(
            resolve,
            250
          )
      );

      await handleConnect();
    };

  /* =======================================================
     LOADING TWINS
  ======================================================= */

  if (
    twinsLoading &&
    twins.length === 0
  ) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6 bg-background text-foreground">
      {/* HEADER */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 px-4 py-2 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />

          LIVE AI AVATAR
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          Speak with your{" "}

          <span className="brand-text">
            AI Twin
          </span>
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Start a LiveAvatar session,
          allow microphone access and
          speak directly with your AI
          avatar. LiveAvatar manages the
          real-time video, voice and
          lip-sync inside the embedded
          session.
        </p>

        {visibleError && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <span>
              {visibleError}
            </span>
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* LEFT PANEL */}

        <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black brand-text">
              Twin Settings
            </h2>

            <LiveAvatarStatus
              loading={
                liveAvatar.loading
              }
              connected={
                liveAvatar.connected
              }
              iframeLoaded={
                liveAvatar.iframeLoaded
              }
            />
          </div>

          {/* STATIC PREVIEW */}

          <div className="relative mt-5 h-72 overflow-hidden rounded-3xl bg-black">
            <img
              src={twinImage}
              alt={
                selectedTwin?.name ||
                "AI Twin"
              }
              onError={(event) => {
                event.currentTarget.src =
                  "/images/bb.png";
              }}
              className="h-full w-full object-cover"
            />

            {sessionReady && (
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-black/75 px-4 py-3 text-center text-xs font-black text-white backdrop-blur">
                LiveAvatar is active in
                the conversation panel
              </div>
            )}
          </div>

          {/* SELECT TWIN */}

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black">
              Select AI Twin
            </span>

            <select
              value={selectedTwinId}
              disabled={
                sessionReady ||
                connectionStarting
              }
              onChange={(event) => {
                setSelectedTwinId(
                  event.target.value
                );
              }}
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold outline-none focus:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {twins.length === 0 && (
                <option value="">
                  No AI Twins found
                </option>
              )}

              {twins.map((twin) => (
                <option
                  key={twin._id}
                  value={twin._id}
                >
                  {twin.name}
                </option>
              ))}
            </select>
          </label>

          {/* LANGUAGE */}

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-black">
              Preferred language
            </span>

            <select
              value={language}
              disabled={
                sessionReady ||
                connectionStarting
              }
              onChange={(event) => {
                setLanguage(
                  event.target.value
                );
              }}
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold outline-none focus:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="English">
                English
              </option>

              <option value="Tamil">
                Tamil
              </option>

              <option value="Malayalam">
                Malayalam
              </option>

              <option value="Hindi">
                Hindi
              </option>

              <option value="Arabic">
                Arabic
              </option>
            </select>
          </label>

          {/* DETAILS */}

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <p className="text-lg font-black">
              {selectedTwin?.name ||
                "No Twin selected"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Configured voice:{" "}
              {twinVoice}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Preferred language:{" "}
              {language}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Avatar engine: LiveAvatar
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Mode:{" "}
              {sessionReady
                ? "Active"
                : "Not connected"}
            </p>
          </div>

          {/* BUTTONS */}

          {!sessionReady ? (
            <button
              type="button"
              disabled={
                !selectedTwin ||
                connectionStarting
              }
              onClick={
                handleConnect
              }
              className="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {connectionStarting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />

                  Starting LiveAvatar...
                </>
              ) : (
                <>
                  <Phone className="h-5 w-5" />

                  Start LiveAvatar
                </>
              )}
            </button>
          ) : (
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={
                  handleRestart
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[5px] border border-border bg-background text-sm font-bold hover:bg-muted"
              >
                <RefreshCw className="h-5 w-5" />

                Restart Session
              </button>

              <button
                type="button"
                onClick={
                  handleDisconnect
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-red-500 text-sm font-bold text-white hover:bg-red-600"
              >
                <PhoneOff className="h-5 w-5" />

                End Session
              </button>
            </div>
          )}
        </aside>

        {/* RIGHT PANEL */}

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="text-2xl font-black brand-text">
                LiveAvatar
                Conversation
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                The microphone, voice,
                video and lip-sync run
                inside this secure
                LiveAvatar session.
              </p>
            </div>

            <ConversationStatus
              loading={
                liveAvatar.loading
              }
              connected={
                liveAvatar.connected
              }
              loaded={
                liveAvatar.iframeLoaded
              }
            />
          </div>

          {/* EMBED AREA */}

          <div className="relative min-h-[640px] bg-black">
            {liveAvatar.embedUrl ? (
              <iframe
                key={
                  liveAvatar.embedUrl
                }
                src={
                  liveAvatar.embedUrl
                }
                title="Twinn LiveAvatar"
                allow="microphone; camera; autoplay; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={
                  liveAvatar.markIframeLoaded
                }
                onError={
                  liveAvatar.markIframeError
                }
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="flex min-h-[640px] flex-col items-center justify-center p-8 text-center text-white">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-white/10">
                  <Video className="h-11 w-11 text-pink-400" />
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  Start your live AI
                  avatar
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-7 text-white/70">
                  Select your AI Twin,
                  start the session and
                  allow microphone
                  permission when the
                  LiveAvatar frame opens.
                </p>

                <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                  <FeatureCard
                    icon={Mic}
                    title="Microphone"
                    text="Speak naturally with the avatar."
                  />

                  <FeatureCard
                    icon={Bot}
                    title="AI Agent"
                    text="The configured voice agent answers."
                  />

                  <FeatureCard
                    icon={Video}
                    title="Lip-sync"
                    text="LiveAvatar renders synchronized video."
                  />
                </div>
              </div>
            )}

            {liveAvatar.loading && (
              <div className="absolute inset-0 z-20 grid place-items-center bg-black/75 text-white backdrop-blur-sm">
                <div className="text-center">
                  <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-pink-400" />

                  <p className="mt-4 text-lg font-black">
                    Creating LiveAvatar
                    session...
                  </p>

                  <p className="mt-2 text-sm text-white/70">
                    Preparing secure
                    microphone and video
                    access.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="flex flex-col justify-between gap-4 border-t border-border p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />

              <p>
                The API key remains on
                your backend. The
                frontend receives only
                a short-lived embed URL.
              </p>
            </div>

            {liveAvatar.embedUrl && (
              <a
                href={
                  liveAvatar.embedUrl
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" />

                Open separately
              </a>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}

/* =========================================================
   LIVEAVATAR STATUS
========================================================= */

function LiveAvatarStatus({
  loading,
  connected,
  iframeLoaded,
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-700">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />

        Starting
      </span>
    );
  }

  if (
    connected &&
    iframeLoaded
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-[11px] font-black text-green-700">
        <Video className="h-3.5 w-3.5" />

        Avatar Live
      </span>
    );
  }

  if (connected) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-700">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />

        Loading frame
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-black text-gray-600">
      <Video className="h-3.5 w-3.5" />

      Offline
    </span>
  );
}

/* =========================================================
   CONVERSATION STATUS
========================================================= */

function ConversationStatus({
  loading,
  connected,
  loaded,
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700">
        <LoaderCircle className="h-4 w-4 animate-spin" />

        Creating session
      </span>
    );
  }

  if (
    connected &&
    loaded
  ) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">
        <CheckCircle2 className="h-4 w-4" />

        Connected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-black text-gray-600">
      <AlertCircle className="h-4 w-4" />

      Disconnected
    </span>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
      <Icon className="h-5 w-5 text-pink-400" />

      <p className="mt-3 text-sm font-black">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-white/60">
        {text}
      </p>
    </div>
  );
}