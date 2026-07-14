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
  LoaderCircle,
  MessageSquare,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Send,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  Waves,
} from "lucide-react";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

import useRealtimeTwin from "../../hooks/useRealtimeTwin";
import useAvatarStream from "../../hooks/useAvatarStream";

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
    typeof twin?.voice ===
    "string"
  ) {
    return twin.voice;
  }

  return (
    twin?.voice?.voiceType ||
    twin?.voice?.voiceName ||
    twin?.voiceName ||
    "Warm Female"
  );
};

/* =========================================================
   PAGE
========================================================= */

export default function TestTwin() {
  const dispatch =
    useDispatch();

  const [
    searchParams,
  ] = useSearchParams();

  const {
    twins = [],
    loading: twinsLoading,
  } = useSelector(
    (state) => state.twin
  );

  const realtime =
    useRealtimeTwin();

  const avatar =
    useAvatarStream();

  const conversationEndRef =
    useRef(null);

  const lastAvatarMessageIdRef =
    useRef(null);

  const connectingRef =
    useRef(false);

  const [
    selectedTwinId,
    setSelectedTwinId,
  ] = useState(
    searchParams.get(
      "twinId"
    ) || ""
  );

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");

  const [
    language,
    setLanguage,
  ] = useState("English");

  const [
    textQuestion,
    setTextQuestion,
  ] = useState("");

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
     AUTO SCROLL CHAT
  ======================================================= */

  useEffect(() => {
    conversationEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  }, [
    realtime.messages,
    realtime.userTranscript,
    realtime.assistantTranscript,
  ]);

  /* =======================================================
     MAKE AVATAR SPEAK COMPLETED AI RESPONSE
  ======================================================= */

  useEffect(() => {
    if (
      !avatar.avatarConnected
    ) {
      return;
    }

    const messages =
      realtime.messages || [];

    const lastMessage =
      messages[
        messages.length - 1
      ];

    if (
      !lastMessage ||
      lastMessage.role !==
        "assistant" ||
      !lastMessage.text
    ) {
      return;
    }

    const messageIdentity =
      lastMessage.id ||
      `${lastMessage.createdAt}-${lastMessage.text}`;

    if (
      lastAvatarMessageIdRef.current ===
      messageIdentity
    ) {
      return;
    }

    lastAvatarMessageIdRef.current =
      messageIdentity;

    avatar
      .speak(
        lastMessage.text
      )
      .catch((error) => {
        console.error(
          "AVATAR SPEAK ERROR:",
          error
        );

        setPageError(
          error?.message ||
            "Unable to make the avatar speak."
        );
      });
  }, [
    avatar.avatarConnected,
    avatar.speak,
    realtime.messages,
  ]);

  /* =======================================================
     CLEANUP ON UNMOUNT
  ======================================================= */

  useEffect(() => {
    return () => {
      avatar
        .closeAvatar()
        .catch(() => {});
    };
  }, [
    avatar.closeAvatar,
  ]);

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
    getTwinImage(
      selectedTwin
    );

  const twinVoice =
    getTwinVoice(
      selectedTwin
    );

  const connectionStarting =
    realtime.status ===
      "creating" ||
    realtime.connectionStage ===
      "creating-session" ||
    realtime.connectionStage ===
      "connecting-socket" ||
    realtime.connectionStage ===
      "initializing-gemini" ||
    avatar.avatarLoading;

  const sessionReady =
    realtime.connected &&
    realtime.connectionStage ===
      "ready";

  const visibleError =
    pageError ||
    realtime.error ||
    avatar.avatarError;

  /* =======================================================
     CONNECT REALTIME + AVATAR
  ======================================================= */

  const handleConnect =
    async () => {
      if (
        connectingRef.current ||
        connectionStarting ||
        realtime.connected
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
          "Starting realtime session:",
          {
            twinId:
              selectedTwinId,

            productId:
              selectedProductId ||
              null,

            language,
          }
        );

        /*
         * Step 1:
         * Create Gemini realtime session
         * and browser WebSocket.
         */
        const sessionResult =
          await realtime.connect({
            twinId:
              selectedTwinId,

            productId:
              selectedProductId ||
              null,

            mode: "test",

            language,
          });

        const realtimeSessionId =
          sessionResult?.session?._id;

        if (!realtimeSessionId) {
          throw new Error(
            "Realtime session ID was not returned."
          );
        }

        console.log(
          "Realtime session created:",
          realtimeSessionId
        );

        /*
         * Step 2:
         * Create avatar WebRTC stream.
         */
        const avatarResult =
          await avatar.createAvatarSession({
            twinId:
              selectedTwinId,

            realtimeSessionId,
          });

        console.log(
          "Avatar session created:",
          avatarResult
        );
      } catch (error) {
        console.error(
          "REALTIME CONNECT ERROR:",
          error
        );

        setPageError(
          error?.message ||
            "Unable to start the realtime AI Twin."
        );

        /*
         * Clean up a partially created
         * realtime or avatar session.
         */
        await avatar
          .closeAvatar()
          .catch(() => {});

        await realtime
          .disconnect()
          .catch(() => {});
      } finally {
        connectingRef.current =
          false;
      }
    };

  /* =======================================================
     DISCONNECT REALTIME + AVATAR
  ======================================================= */

  const handleDisconnect =
    async () => {
      try {
        setPageError("");

        await avatar
          .closeAvatar()
          .catch((error) => {
            console.error(
              "AVATAR CLOSE ERROR:",
              error
            );
          });

        await realtime
          .disconnect()
          .catch((error) => {
            console.error(
              "REALTIME DISCONNECT ERROR:",
              error
            );
          });
      } finally {
        lastAvatarMessageIdRef.current =
          null;

        connectingRef.current =
          false;
      }
    };

  /* =======================================================
     MICROPHONE
  ======================================================= */

  const handleMicrophone =
    async () => {
      try {
        setPageError("");

        if (!sessionReady) {
          throw new Error(
            "Wait until Gemini Live is connected."
          );
        }

        if (
          realtime.recording
        ) {
          await realtime.stopMicrophone();
        } else {
          await realtime.startMicrophone();
        }
      } catch (error) {
        console.error(
          "MICROPHONE ERROR:",
          error
        );

        setPageError(
          error?.message ||
            "Unable to access the microphone."
        );
      }
    };

  /* =======================================================
     TEXT MESSAGE
  ======================================================= */

  const handleSendText =
    () => {
      const normalized =
        textQuestion.trim();

      if (!normalized) {
        return;
      }

      if (!sessionReady) {
        setPageError(
          "Start the realtime session before sending a message."
        );

        return;
      }

      const sent =
        realtime.sendText(
          normalized
        );

      if (sent) {
        setTextQuestion("");
        setPageError("");
      }
    };

  /* =======================================================
     LOADING
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

          REALTIME AI TWIN
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          Speak with your{" "}

          <span className="brand-text">
            AI Twin
          </span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Ask questions through your
          microphone or chat. Gemini
          answers using your Twin’s
          product and knowledge data,
          while the avatar provides
          lip-synced video.
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

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* LEFT SIDE */}

        <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black brand-text">
              Twin Preview
            </h2>

          <AvatarStatus
  loading={avatar.avatarLoading}
  connected={avatar.avatarConnected}
  playing={avatar.avatarPlaying}
/>
          </div>

          {/* AVATAR VIDEO */}

          <div className="relative mt-5 overflow-hidden rounded-3xl border border-border bg-black">
            <video
  ref={avatar.videoRef}
  autoPlay
  playsInline
  muted
  onLoadedMetadata={async () => {
    console.log(
      "AVATAR VIDEO METADATA LOADED"
    );

    await avatar.playVideo();
  }}
  onCanPlay={async () => {
    console.log(
      "AVATAR VIDEO CAN PLAY"
    );

    await avatar.playVideo();
  }}
  onPlaying={() => {
    console.log(
      "AVATAR VIDEO PLAYING"
    );
  }}
  onWaiting={() => {
    console.log(
      "AVATAR VIDEO WAITING"
    );
  }}
  onStalled={() => {
    console.log(
      "AVATAR VIDEO STALLED"
    );
  }}
  onError={(event) => {
    console.error(
      "AVATAR VIDEO ELEMENT ERROR:",
      event.currentTarget.error
    );
  }}
  onClick={() => {
    avatar.playVideo();
  }}
  className={`h-96 w-full object-cover ${
    avatar.avatarPlaying
      ? "block"
      : "hidden"
  }`}
/>

            {!avatar.avatarPlaying && (
  <img
    src={twinImage}
    alt={
      selectedTwin?.name ||
      "AI Twin"
    }
    className="h-96 w-full object-cover"
  />
)}

            {avatar.avatarLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 text-white">
                <LoaderCircle className="h-9 w-9 animate-spin" />

                <p className="mt-3 text-sm font-bold">
                  Starting avatar stream...
                </p>
              </div>
            )}

            {realtime.speaking && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/65 px-4 py-3 text-sm font-bold text-white">
                <Waves className="h-5 w-5 animate-pulse" />

                AI Twin is speaking
              </div>
            )}
          </div>

          {/* TWIN SELECT */}

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black">
              Select AI Twin
            </span>

            <select
              value={
                selectedTwinId
              }
              disabled={
                realtime.connected ||
                connectionStarting
              }
              onChange={(
                event
              ) => {
                setSelectedTwinId(
                  event.target.value
                );

                lastAvatarMessageIdRef.current =
                  null;
              }}
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold outline-none focus:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {twins.length ===
                0 && (
                <option value="">
                  No AI Twins found
                </option>
              )}

              {twins.map(
                (twin) => (
                  <option
                    key={
                      twin._id
                    }
                    value={
                      twin._id
                    }
                  >
                    {twin.name}
                  </option>
                )
              )}
            </select>
          </label>

          {/* LANGUAGE */}

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-black">
              Language
            </span>

            <select
              value={language}
              disabled={
                realtime.connected ||
                connectionStarting
              }
              onChange={(
                event
              ) =>
                setLanguage(
                  event.target.value
                )
              }
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

          {/* TWIN DETAILS */}

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <p className="text-lg font-black">
              {selectedTwin?.name ||
                "No Twin selected"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Voice: {twinVoice}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Language:{" "}
              {language}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Gemini:{" "}
              {sessionReady
                ? "Ready"
                : "Not connected"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Avatar:{" "}
              {avatar.avatarConnected
                ? "Connected"
                : avatar.avatarLoading
                ? "Starting"
                : "Not connected"}
            </p>
          </div>

          {/* START / END */}

          {!realtime.connected &&
          realtime.connectionStage !==
            "ready" ? (
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

                  Starting AI Twin...
                </>
              ) : (
                <>
                  <Phone className="h-5 w-5" />

                  Start Realtime Test
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={
                handleDisconnect
              }
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-red-500 text-sm font-bold text-white hover:bg-red-600"
            >
              <PhoneOff className="h-5 w-5" />

              End Session
            </button>
          )}
        </aside>

        {/* RIGHT SIDE */}

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black brand-text">
                Voice Conversation
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Ask through the
                microphone or type a
                message below.
              </p>
            </div>

            <ConnectionStatus
              connected={
                realtime.connected
              }
              connectionStage={
                realtime.connectionStage
              }
              recording={
                realtime.recording
              }
              speaking={
                realtime.speaking
              }
            />
          </div>

          {/* MICROPHONE */}

          <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-border bg-background p-8 text-center">
            <button
              type="button"
              disabled={
                !sessionReady
              }
              onClick={
                handleMicrophone
              }
              className={`grid h-28 w-28 place-items-center rounded-full text-white shadow-xl transition disabled:cursor-not-allowed disabled:opacity-50 ${
                realtime.recording
                  ? "bg-red-500 hover:bg-red-600"
                  : "brand-gradient hover:opacity-90"
              }`}
            >
              {realtime.recording ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </button>

            <p className="mt-5 text-lg font-black">
              {realtime.recording
                ? "Listening..."
                : realtime.speaking
                ? "AI Twin is speaking..."
                : sessionReady
                ? "Tap microphone to speak"
                : connectionStarting
                ? "Starting realtime session..."
                : "Start a realtime session"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Microphone permission:{" "}

              {realtime.permission}
            </p>

            {realtime.speaking && (
              <button
                type="button"
                onClick={
                  realtime.interrupt
                }
                className="mt-4 flex items-center gap-2 rounded-[5px] border border-red-500 px-4 py-2 text-sm font-bold text-red-500"
              >
                <VolumeX className="h-4 w-4" />

                Interrupt AI
              </button>
            )}
          </div>

          {/* CHAT */}

          <div className="mt-6 h-[380px] overflow-y-auto rounded-3xl border border-border bg-background p-5">
            {realtime.messages
              .length === 0 &&
              !realtime.userTranscript &&
              !realtime.assistantTranscript && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <MessageSquare className="h-10 w-10 text-[var(--brand-pink)]" />

                  <p className="mt-3 font-black">
                    Conversation appears
                    here
                  </p>

                  <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                    Ask about products,
                    prices, policies,
                    shipping or uploaded
                    knowledge.
                  </p>
                </div>
              )}

            {realtime.messages.map(
              (
                message,
                index
              ) => (
                <MessageBubble
                  key={
                    message.id ||
                    `${message.createdAt}-${index}`
                  }
                  role={
                    message.role
                  }
                  text={
                    message.text
                  }
                />
              )
            )}

            {realtime.userTranscript && (
              <MessageBubble
                role="user"
                text={
                  realtime.userTranscript
                }
                live
              />
            )}

            {realtime.assistantTranscript && (
              <MessageBubble
                role="assistant"
                text={
                  realtime.assistantTranscript
                }
                live
              />
            )}

            <div
              ref={
                conversationEndRef
              }
            />
          </div>

          {/* TEXT INPUT */}

          <div className="mt-5 flex gap-3">
            <input
              value={
                textQuestion
              }
              disabled={
                !sessionReady
              }
              onChange={(
                event
              ) =>
                setTextQuestion(
                  event.target.value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  handleSendText();
                }
              }}
              placeholder="Type a question to test the AI Twin..."
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              disabled={
                !sessionReady ||
                !textQuestion.trim()
              }
              onClick={
                handleSendText
              }
              className="brand-gradient grid h-12 w-12 shrink-0 place-items-center rounded-[5px] text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}

/* =========================================================
   CONNECTION STATUS
========================================================= */

function ConnectionStatus({
  connected,
  connectionStage,
  recording,
  speaking,
}) {
  if (
    connectionStage ===
      "creating-session" ||
    connectionStage ===
      "connecting-socket" ||
    connectionStage ===
      "initializing-gemini"
  ) {
    let label =
      "Connecting";

    if (
      connectionStage ===
      "creating-session"
    ) {
      label =
        "Creating session";
    }

    if (
      connectionStage ===
      "initializing-gemini"
    ) {
      label =
        "Starting Gemini";
    }

    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
        <LoaderCircle className="h-4 w-4 animate-spin" />

        {label}
      </span>
    );
  }

  if (
    !connected ||
    connectionStage !==
      "ready"
  ) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-black text-gray-600 dark:bg-white/10 dark:text-gray-300">
        <AlertCircle className="h-4 w-4" />

        Disconnected
      </span>
    );
  }

  if (recording) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-xs font-black text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <Mic className="h-4 w-4" />

        Listening
      </span>
    );
  }

  if (speaking) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
        <Volume2 className="h-4 w-4" />

        Speaking
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700 dark:bg-green-900/30 dark:text-green-300">
      <CheckCircle2 className="h-4 w-4" />

      Connected
    </span>
  );
}

/* =========================================================
   AVATAR STATUS
========================================================= */

function AvatarStatus({
  loading,
  connected,
  playing,
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-700">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        Starting
      </span>
    );
  }

  if (playing) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-[11px] font-black text-green-700">
        <Video className="h-3.5 w-3.5" />
        Avatar Live
      </span>
    );
  }

  if (connected) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-700"
      >
        <Video className="h-3.5 w-3.5" />
        Stream waiting
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-black text-gray-600">
      <Video className="h-3.5 w-3.5" />
      Static
    </span>
  );
}

/* =========================================================
   MESSAGE BUBBLE
========================================================= */

function MessageBubble({
  role,
  text,
  live,
}) {
  const isUser =
    role === "user";

  return (
    <div
      className={`mb-4 flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
          isUser
            ? "brand-gradient text-white"
            : "border border-border bg-card text-foreground"
        }`}
      >
        <div className="mb-1 flex items-center gap-2 text-xs font-black opacity-80">
          {isUser ? (
            <Mic className="h-3 w-3" />
          ) : (
            <Bot className="h-3 w-3" />
          )}

          {isUser
            ? "You"
            : "AI Twin"}

          {live && (
            <span className="animate-pulse">
              • Live
            </span>
          )}
        </div>

        {text}
      </div>
    </div>
  );
}