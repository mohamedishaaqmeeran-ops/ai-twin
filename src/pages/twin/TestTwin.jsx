
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
  Package,
  Phone,
  PhoneOff,
  Send,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

import {
  fetchProducts,
} from "../../features/products/productSlice";

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

const getProductName = (
  product
) => {
  return (
    product?.name ||
    product?.productName ||
    product?.title ||
    "Unnamed Product"
  );
};

const getProductImage = (
  product
) => {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.images?.[0] ||
    null
  );
};

const getProductPrice = (
  product
) => {
  const price =
    product?.price ??
    product?.sellingPrice ??
    product?.amount;

  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "Price not added";
  }

  const currency =
    product?.currency ||
    "INR";

  if (
    currency === "INR"
  ) {
    return `₹${price}`;
  }

  return `${currency} ${price}`;
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

  /* =======================================================
     REDUX DATA
  ======================================================= */

  const {
    twins = [],
    loading: twinsLoading,
  } = useSelector(
    (state) => state.twin
  );

  const productState =
    useSelector(
      (state) =>
        state.product ||
        state.products ||
        {}
    );

  const products =
    productState.products ||
    productState.items ||
    productState.data ||
    [];

  const productsLoading =
    productState.loading ||
    productState.isLoading ||
    false;

  const productsError =
    productState.error ||
    "";

  /* =======================================================
     HOOKS
  ======================================================= */

  const realtime =
    useRealtimeTwin();

  const avatar =
    useAvatarStream();

  /* =======================================================
     DEBUG
  ======================================================= */

  useEffect(() => {
    window.avatarDebug =
      avatar;

    return () => {
      delete window.avatarDebug;
    };
  }, [avatar]);

  /* =======================================================
     REFS
  ======================================================= */

  const conversationEndRef =
    useRef(null);

  const lastAvatarMessageIdRef =
    useRef(null);

  const connectingRef =
    useRef(false);

  /* =======================================================
     STATE
  ======================================================= */

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
  ] = useState(
    searchParams.get(
      "productId"
    ) || ""
  );

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
     LOAD TWINS AND PRODUCTS
  ======================================================= */

  useEffect(() => {
    dispatch(fetchTwins());
    dispatch(fetchProducts());
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
     AUTO SELECT FIRST PRODUCT
  ======================================================= */

  useEffect(() => {
    if (
      !selectedProductId &&
      products.length > 0
    ) {
      setSelectedProductId(
        products[0]._id
      );
    }
  }, [
    selectedProductId,
    products,
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
      realtime.messages ||
      [];

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
        lastMessage.text,
        language
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
    language,
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
            String(twin._id) ===
            String(
              selectedTwinId
            )
        ) || null
      );
    }, [
      selectedTwinId,
      twins,
    ]);

  /* =======================================================
     SELECTED PRODUCT
  ======================================================= */

  const selectedProduct =
    useMemo(() => {
      return (
        products.find(
          (product) =>
            String(
              product._id
            ) ===
            String(
              selectedProductId
            )
        ) || null
      );
    }, [
      products,
      selectedProductId,
    ]);

  const twinImage =
    getTwinImage(
      selectedTwin
    );

  const twinVoice =
    getTwinVoice(
      selectedTwin
    );

  const selectedProductImage =
    getProductImage(
      selectedProduct
    );

  /* =======================================================
     CONNECTION STATE
  ======================================================= */

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
    productsError ||
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

        /*
         * Product selection is mandatory.
         *
         * This ensures every realtime session
         * has one specific product scope.
         */
        if (!selectedProductId) {
          throw new Error(
            "Select a product before starting the AI Twin."
          );
        }

        if (!selectedProduct) {
          throw new Error(
            "The selected product was not found."
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
              selectedProductId,

            productName:
              getProductName(
                selectedProduct
              ),

            language,
          }
        );

        /*
         * Step 1:
         * Create Gemini realtime session.
         *
         * The backend must verify:
         * - Twin belongs to req.user._id
         * - Product belongs to req.user._id
         */
        const sessionResult =
          await realtime.connect({
            twinId:
              selectedTwinId,

            productId:
              selectedProductId,

            mode: "test",

            language,
          });

        const realtimeSessionId =
          sessionResult?.session
            ?._id;

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
         * Create D-ID WebRTC avatar stream.
         */
        const avatarResult =
          await avatar
            .createAvatarSession({
              twinId:
                selectedTwinId,

              realtimeSessionId,
            });

        console.log(
          "Avatar session created:",
          avatarResult
        );

        /*
         * Step 3:
         * Make D-ID speak a warmup message.
         */
        const warmupMessages = {
          English:
            `Hello. I am ready to answer questions about ${getProductName(
              selectedProduct
            )}.`,

          Tamil:
            `வணக்கம். ${getProductName(
              selectedProduct
            )} பற்றிய கேள்விகளுக்கு பதிலளிக்க நான் தயாராக இருக்கிறேன்.`,

          Malayalam:
            `നമസ്കാരം. ${getProductName(
              selectedProduct
            )} സംബന്ധിച്ച ചോദ്യങ്ങൾക്ക് മറുപടി നൽകാൻ ഞാൻ തയ്യാറാണ്.`,

          Hindi:
            `नमस्ते। मैं ${getProductName(
              selectedProduct
            )} के बारे में आपके सवालों का जवाब देने के लिए तैयार हूँ।`,

          Arabic:
            `مرحبًا. أنا مستعد للإجابة عن أسئلتك حول ${getProductName(
              selectedProduct
            )}.`,
        };

        const warmupText =
          warmupMessages[
            language
          ] ||
          warmupMessages.English;

        console.log(
          "SENDING D-ID WARMUP:",
          {
            language,
            text: warmupText,
          }
        );

        await avatar.speak(
          warmupText,
          language
        );

        console.log(
          "D-ID WARMUP ACCEPTED"
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
          await realtime
            .stopMicrophone();
        } else {
          await realtime
            .startMicrophone();
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
    (twinsLoading ||
      productsLoading) &&
    twins.length === 0 &&
    products.length === 0
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

          PRODUCT-TRAINED AI TWIN
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          Speak with your{" "}

          <span className="brand-text">
            AI Twin
          </span>
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Select one of your
          products and start the
          realtime AI Twin. Gemini
          must answer only from the
          selected product and its
          approved knowledge, while
          D-ID provides the
          lip-synced avatar video.
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
              loading={
                avatar.avatarLoading
              }
              connected={
                avatar.avatarConnected
              }
              playing={
                avatar.avatarPlaying
              }
              connectionState={
                avatar.connectionState
              }
            />
          </div>

          {/* AVATAR VIDEO */}

          <div className="relative mt-5 h-96 overflow-hidden rounded-3xl bg-black">
            <video
              ref={
                avatar.videoRef
              }
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                console.log(
                  "AVATAR VIDEO METADATA LOADED"
                );

                avatar
                  .waitForVideoFrames();
              }}
              onLoadedData={() => {
                console.log(
                  "AVATAR VIDEO DATA LOADED"
                );

                avatar
                  .waitForVideoFrames();
              }}
              onCanPlay={() => {
                console.log(
                  "AVATAR VIDEO CAN PLAY"
                );

                avatar.playVideo();
              }}
              onPlaying={() => {
                console.log(
                  "AVATAR VIDEO PLAYING"
                );
              }}
              onResize={(
                event
              ) => {
                console.log(
                  "AVATAR VIDEO SIZE:",
                  {
                    width:
                      event
                        .currentTarget
                        .videoWidth,

                    height:
                      event
                        .currentTarget
                        .videoHeight,
                  }
                );
              }}
              onError={(
                event
              ) => {
                console.error(
                  "AVATAR VIDEO ERROR:",
                  event
                    .currentTarget
                    .error
                );
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
                avatar.avatarPlaying
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />

            {!avatar.avatarPlaying && (
              <img
                src={twinImage}
                alt={
                  selectedTwin
                    ?.name ||
                  "AI Twin"
                }
                className="absolute inset-0 h-full w-full object-cover"
              />
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
              <option value="">
                Select an AI Twin
              </option>

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

          {/* PRODUCT SELECT */}

          <label className="mt-4 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-black">
              <Package className="h-4 w-4 text-[var(--brand-pink)]" />

              Select Product
            </span>

            <select
              value={
                selectedProductId
              }
              disabled={
                realtime.connected ||
                connectionStarting ||
                productsLoading
              }
              onChange={(
                event
              ) => {
                setSelectedProductId(
                  event.target.value
                );

                lastAvatarMessageIdRef.current =
                  null;
              }}
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold outline-none focus:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Select a product
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product._id
                    }
                    value={
                      product._id
                    }
                  >
                    {getProductName(
                      product
                    )}
                  </option>
                )
              )}
            </select>

            {products.length ===
              0 &&
              !productsLoading && (
                <p className="mt-2 text-xs font-bold text-amber-600">
                  No products found.
                  Add a product before
                  testing the AI Twin.
                </p>
              )}

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              The AI Twin will be
              restricted to this
              product and its approved
              training data.
            </p>
          </label>

          {/* SELECTED PRODUCT CARD */}

          {selectedProduct && (
            <div className="mt-4 rounded-2xl border border-pink-200 bg-pink-50/50 p-4 dark:border-pink-900/30 dark:bg-pink-900/10">
              <div className="flex items-center gap-3">
                {selectedProductImage ? (
                  <img
                    src={
                      selectedProductImage
                    }
                    alt={
                      getProductName(
                        selectedProduct
                      )
                    }
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-background">
                    <Package className="h-6 w-6 text-[var(--brand-pink)]" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-black">
                    {getProductName(
                      selectedProduct
                    )}
                  </p>

                  <p className="mt-1 text-xs font-bold text-[var(--brand-pink)]">
                    {getProductPrice(
                      selectedProduct
                    )}
                  </p>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">
                {selectedProduct
                  ?.description ||
                  "No product description added."}
              </p>
            </div>
          )}

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
              Product:{" "}

              {selectedProduct
                ? getProductName(
                    selectedProduct
                  )
                : "Not selected"}
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
                !selectedProduct ||
                connectionStarting ||
                productsLoading
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

                  Start Product Test
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
                Product Conversation
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Ask questions only
                about the selected
                product.
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

          {/* ACTIVE PRODUCT NOTICE */}

          {selectedProduct && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-pink-900/30 dark:bg-pink-900/10">
              <Package className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

              <div>
                <p className="text-sm font-black">
                  Active product:{" "}

                  {getProductName(
                    selectedProduct
                  )}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Gemini should refuse
                  questions about
                  products outside this
                  selected product.
                </p>
              </div>
            </div>
          )}

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
                : "Start a product session"}
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
                    Product conversation
                    appears here
                  </p>

                  <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                    Ask about the
                    selected product’s
                    price, features,
                    benefits, stock,
                    shipping, policies
                    or uploaded
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
              placeholder={
                selectedProduct
                  ? `Ask about ${getProductName(
                      selectedProduct
                    )}...`
                  : "Select a product first..."
              }
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
      "connecting-socket"
    ) {
      label =
        "Connecting socket";
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
  connectionState,
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
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-700">
        <Video className="h-3.5 w-3.5" />

        Video waiting
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-black text-gray-600">
      <Video className="h-3.5 w-3.5" />

      {connectionState ===
      "failed"
        ? "Avatar failed"
        : "Static"}
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
        className={`max-w-[85%] overflow-hidden rounded-2xl px-4 py-3 text-sm leading-7 ${
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

        <p className="whitespace-pre-wrap break-words">
          {text}
        </p>
      </div>
    </div>
  );
}

