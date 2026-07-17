import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  LoaderCircle,
  MessageSquare,
  Phone,
  PhoneOff,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

import {
  fetchProducts,
} from "../../features/products/productSlice";

import {
  chatWithTwinApi,
} from "../../lib/twinApi";

import useAvatarStream from "../../hooks/useAvatarStream";

export default function AvatarStudio() {
  const dispatch =
    useDispatch();

  const {
    twins = [],
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

  const avatar =
    useAvatarStream();

  const [
    twinId,
    setTwinId,
  ] = useState("");

  const [
    productId,
    setProductId,
  ] = useState("");

  const [
    language,
    setLanguage,
  ] = useState("English");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    conversationId,
    setConversationId,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");

  useEffect(() => {
    dispatch(fetchTwins());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (
      !twinId &&
      twins.length
    ) {
      setTwinId(
        twins[0]._id
      );
    }
  }, [twinId, twins]);

  useEffect(() => {
    if (
      !productId &&
      products.length
    ) {
      setProductId(
        products[0]._id
      );
    }
  }, [
    productId,
    products,
  ]);

  const selectedTwin =
    useMemo(() => {
      return twins.find(
        (twin) =>
          String(twin._id) ===
          String(twinId)
      );
    }, [twins, twinId]);

  const selectedProduct =
    useMemo(() => {
      return products.find(
        (product) =>
          String(product._id) ===
          String(productId)
      );
    }, [
      products,
      productId,
    ]);

  const startAvatar =
    async () => {
      setPageError("");

      try {
        if (!twinId) {
          throw new Error(
            "Select an AI Twin."
          );
        }

        if (!productId) {
          throw new Error(
            "Select a product."
          );
        }

        await avatar
          .createAvatarSession({
            twinId,
          });

        const productName =
          selectedProduct?.name ||
          selectedProduct
            ?.productName ||
          selectedProduct?.title ||
          "this product";

        await avatar.speak(
          `Hello. I am ready to answer your questions about ${productName}.`,
          language
        );
      } catch (error) {
        setPageError(
          error.message
        );
      }
    };

  const sendMessage =
    async () => {
      const normalized =
        message.trim();

      if (!normalized) {
        return;
      }

      if (
        !avatar.avatarConnected
      ) {
        setPageError(
          "Start the avatar session first."
        );

        return;
      }

      setMessage("");
      setPageError("");

      setMessages(
        (current) => [
          ...current,
          {
            role: "user",
            text: normalized,
          },
        ]
      );

      try {
        setSending(true);

        const response =
          await chatWithTwinApi({
            twinId,
            productId,
            message:
              normalized,
            conversationId,
          });

        const result =
          response.data ||
          response;

        setConversationId(
          result.conversationId
        );

        setMessages(
          (current) => [
            ...current,
            {
              role:
                "assistant",

              text:
                result.reply ||
                response.reply,
            },
          ]
        );

        await avatar.speak(
          result.reply ||
            response.reply,
          language
        );
      } catch (error) {
        setPageError(
          error.message ||
            "Unable to send message."
        );
      } finally {
        setSending(false);
      }
    };

  return (
    <div className="space-y-6 bg-background text-foreground">
      <section className="rounded-3xl border border-border bg-card p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 px-4 py-2 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />

          AVATAR STUDIO
        </span>

        <h1 className="mt-5 text-3xl font-black">
          Product-Trained{" "}

          <span className="brand-text">
            Talking Avatar
          </span>
        </h1>

        {pageError && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
            {pageError}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <aside className="rounded-3xl border border-border bg-card p-5">
          <div className="relative h-96 overflow-hidden rounded-3xl bg-black">
            <video
              ref={
                avatar.videoRef
              }
              autoPlay
              playsInline
              muted
              onCanPlay={
                avatar.playVideo
              }
              className={`absolute inset-0 h-full w-full object-cover ${
                avatar.avatarPlaying
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />

            {!avatar.avatarPlaying && (
              <img
                src={
                  selectedTwin
                    ?.appearance
                    ?.avatarUrl ||
                  selectedTwin
                    ?.image ||
                  "/images/bb.png"
                }
                alt="AI Twin"
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="mt-5 space-y-4">
            <select
              value={twinId}
              disabled={
                avatar.avatarConnected
              }
              onChange={(event) =>
                setTwinId(
                  event.target.value
                )
              }
              className="w-full rounded-[5px] border border-border bg-background p-3"
            >
              {twins.map(
                (twin) => (
                  <option
                    key={twin._id}
                    value={twin._id}
                  >
                    {twin.name}
                  </option>
                )
              )}
            </select>

            <select
              value={productId}
              disabled={
                avatar.avatarConnected
              }
              onChange={(event) =>
                setProductId(
                  event.target.value
                )
              }
              className="w-full rounded-[5px] border border-border bg-background p-3"
            >
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
                    {product.name ||
                      product.productName ||
                      product.title}
                  </option>
                )
              )}
            </select>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value
                )
              }
              className="w-full rounded-[5px] border border-border bg-background p-3"
            >
              {[
                "English",
                "Tamil",
                "Malayalam",
                "Hindi",
                "Arabic",
              ].map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            {!avatar.avatarConnected ? (
              <button
                type="button"
                disabled={
                  avatar.avatarLoading
                }
                onClick={
                  startAvatar
                }
                className="brand-gradient flex w-full items-center justify-center gap-2 rounded-[5px] py-3 font-bold text-white disabled:opacity-60"
              >
                {avatar.avatarLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}

                Start Avatar
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  avatar.closeAvatar
                }
                className="flex w-full items-center justify-center gap-2 rounded-[5px] bg-red-600 py-3 font-bold text-white"
              >
                <PhoneOff className="h-4 w-4" />

                End Avatar
              </button>
            )}
          </div>
        </aside>

        <main className="flex min-h-[620px] flex-col rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <MessageSquare className="h-5 w-5 text-[var(--brand-pink)]" />

            <h2 className="font-black">
              Product Conversation
            </h2>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto py-5">
            {!messages.length && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Volume2 className="h-12 w-12 text-[var(--brand-pink)]" />

                <p className="mt-4 font-black">
                  Start the avatar and ask
                  about the selected product.
                </p>
              </div>
            )}

            {messages.map(
              (item, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                    item.role ===
                    "user"
                      ? "ml-auto bg-pink-500 text-white"
                      : "bg-background"
                  }`}
                >
                  {item.text}
                </div>
              )
            )}

            {sending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />

                AI Twin is replying...
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-border pt-4">
            <input
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  sendMessage();
                }
              }}
              placeholder="Ask about the product..."
              className="flex-1 rounded-[5px] border border-border bg-background px-4 py-3"
            />

            <button
              type="button"
              disabled={
                sending ||
                !avatar.avatarConnected
              }
              onClick={
                sendMessage
              }
              className="brand-gradient rounded-[5px] px-5 text-white disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </main>
      </section>
    </div>
  );
}