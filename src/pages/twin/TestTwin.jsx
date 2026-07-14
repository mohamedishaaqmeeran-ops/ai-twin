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
  Volume2,
  VolumeX,
  Waves,
} from "lucide-react";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

import useRealtimeTwin from "../../hooks/useRealtimeTwin";

/* =========================================================
   HELPERS
========================================================= */

const getTwinImage = (
  twin
) => {
  return (
    twin?.appearance?.avatarUrl ||
    twin?.image ||
    "/images/bb.png"
  );
};

const getTwinVoice = (
  twin
) => {
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

const conversationEndRef =
  useRef(null);

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

useEffect(() => {
  conversationEndRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, [
  realtime.messages,
  realtime.userTranscript,
  realtime.assistantTranscript,
]);

useEffect(() => {
  dispatch(fetchTwins());
}, [dispatch]);

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

/* =======================================================
   CONNECT
======================================================= */

const handleConnect =
  async () => {
    try {
      if (!selectedTwinId) {
        throw new Error(
          "Select an AI Twin first."
        );
      }

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

      const result =
        await realtime.connect({
          twinId:
            selectedTwinId,

          productId:
            selectedProductId ||
            null,

          mode: "test",

          language,
        });

      console.log(
        "Realtime session created:",
        result
      );
    } catch (error) {
      console.error(
        "REALTIME CONNECT ERROR:",
        error
      );
    }
  };

/* =======================================================
   MICROPHONE
======================================================= */

const handleMicrophone =
  async () => {
    try {
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
    }
  };

/* =======================================================
   TEXT MESSAGE
======================================================= */

const handleSendText = () => {
  const normalized =
    textQuestion.trim();

  if (!normalized) {
    return;
  }

  const sent =
    realtime.sendText(
      normalized
    );

  if (sent) {
    setTextQuestion("");
  }
};

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
          microphone and hear your AI Twin
          respond using Gemini Live.
        </p>

        {realtime.error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            {realtime.error}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* LEFT PREVIEW */}

        <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">
            Twin Preview
          </h2>

          <div className="relative mt-5 overflow-hidden rounded-3xl border border-border bg-pink-50 dark:bg-white/10">
            <img
              src={twinImage}
              alt={
                selectedTwin?.name ||
                "AI Twin"
              }
              onError={(
                event
              ) => {
                event.currentTarget.src =
                  "/images/bb.png";
              }}
              className={`h-96 w-full object-cover transition duration-300 ${
                realtime.speaking
                  ? "scale-[1.02]"
                  : ""
              }`}
            />

            {realtime.speaking && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/65 px-4 py-3 text-sm font-bold text-white">
                <Waves className="h-5 w-5 animate-pulse" />

                AI Twin is speaking
              </div>
            )}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black">
              Select AI Twin
            </span>

            <select
              value={
                selectedTwinId
              }
              disabled={
                realtime.connected
              }
              onChange={(event) =>
                setSelectedTwinId(
                  event.target.value
                )
              }
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

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-black">
              Language
            </span>

            <select
              value={language}
              disabled={
                realtime.connected
              }
              onChange={(event) =>
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
          </div>

          {!realtime.connected ? (
            <button
              type="button"
              disabled={
                !selectedTwin ||
                realtime.status ===
                  "creating"
              }
              onClick={
                handleConnect
              }
              className="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {realtime.status ===
              "creating" ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <Phone className="h-5 w-5" />
              )}

              {realtime.status ===
              "creating"
                ? "Connecting..."
                : "Start Realtime Test"}
            </button>
          ) : (
            <button
              type="button"
              onClick={
                realtime.disconnect
              }
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-red-500 text-sm font-bold text-white hover:bg-red-600"
            >
              <PhoneOff className="h-5 w-5" />

              End Session
            </button>
          )}
        </aside>

        {/* RIGHT CONVERSATION */}

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black brand-text">
                Voice Conversation
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Start a session and tap
                the microphone to ask a
                question.
              </p>
            </div>

            <ConnectionStatus
              connected={
                realtime.connected
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
  {!realtime.connected ? (
    <>
      <button
        type="button"
        disabled={
          !selectedTwinId ||
          realtime.status === "creating"
        }
        onClick={handleConnect}
        className="brand-gradient flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {realtime.status === "creating" ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Phone className="h-5 w-5" />
            Start Realtime Session
          </>
        )}
      </button>

      <p className="mt-5 text-lg font-black">
        Start a realtime session
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Connect your AI Twin before enabling the microphone.
      </p>
    </>
  ) : (
    <>
      <button
        type="button"
        onClick={handleMicrophone}
        className={`grid h-28 w-28 place-items-center rounded-full text-white shadow-xl transition ${
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
          : "Tap microphone to speak"}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Microphone permission: {realtime.permission}
      </p>

      <button
        type="button"
        onClick={realtime.disconnect}
        className="mt-5 flex items-center gap-2 rounded-[5px] border border-red-500 px-5 py-2 text-sm font-bold text-red-500"
      >
        <PhoneOff className="h-4 w-4" />
        End Session
      </button>
    </>
  )}
</div>

          {/* CONVERSATION */}

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
                    Ask questions about
                    products, prices,
                    policies, shipping or
                    uploaded knowledge.
                  </p>
                </div>
              )}

            {realtime.messages.map(
              (message) => (
                <MessageBubble
                  key={message.id}
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
  ref={conversationEndRef}
/>
          </div>

          {/* TEXT INPUT */}

          <div className="mt-5 flex gap-3">
            <input
  value={textQuestion}
  disabled={
    realtime.connectionStage !==
    "ready"
  }
  onChange={(event) =>
    setTextQuestion(
      event.target.value
    )
  }
  onKeyDown={(event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendText();
    }
  }}
  placeholder="Type a question to test the AI Twin..."
  className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none"
/>

            <button
  type="button"
  disabled={
    realtime.connectionStage !==
      "ready" ||
    !textQuestion.trim()
  }
  onClick={handleSendText}
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
  recording,
  speaking,
}) {
  if (!connected) {
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