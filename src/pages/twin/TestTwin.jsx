import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Send,
  Mic,
  Volume2,
  Sparkles,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Brain,
  MessageSquare,
  Languages,
  BadgeCheck,
  Crown,
  Lock,
  Radio,
} from "lucide-react";
import { useSelector } from "react-redux";

const freeQuestions = [
  "What is the price?",
  "Is delivery available?",
  "Why should I buy this product?",
  "Is there any discount?",
];

const proQuestions = [
  "Create a live sales pitch",
  "Handle angry customer",
  "Explain product benefits in Tamil",
  "Suggest discount strategy",
];

export default function TestTwin() {
  const navigate = useNavigate();

 const { user } = useSelector((state) => state.auth);

const plan = user?.plan || "free";
const isPro = plan === "pro" || plan === "business";

const twin = user?.twins?.[0] || user?.twin || {};
const twinName = twin?.name || "My AI Twin";
const twinImage = twin?.image || "/images/bb.png";

const selectedProduct =
  user?.selectedProduct?.name ||
  user?.products?.[0]?.name ||
  "Vitamin C Glow Serum";
  const sampleQuestions = isPro
    ? [...freeQuestions, ...proQuestions]
    : freeQuestions;

  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [testing, setTesting] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: `Hi! I’m ${twinName}. Ask me anything about ${selectedProduct}.`,
    },
  ]);

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const getAIResponse = (q) => {
    const text = q.toLowerCase();

    if (text.includes("price")) {
      return `${selectedProduct} is available for ₹799. Today’s live offer includes free shipping.`;
    }

    if (text.includes("delivery")) {
      return "Delivery usually takes 3 to 5 working days. Cash on delivery can also be enabled based on your store settings.";
    }

    if (text.includes("discount")) {
      return isPro
        ? "For Pro live selling, I recommend a limited-time coupon, countdown urgency, and bundle offer to increase conversions."
        : "Yes! During live sessions, we can show a limited-time discount coupon to increase conversions.";
    }

    if (text.includes("pitch")) {
      return isPro
        ? `Here is a Pro live pitch: “Everyone, this ${selectedProduct} is perfect if you want visible results, easy usage, and great value. Stay till the end for today's special offer.”`
        : "Live sales pitch generation is available in Pro plan.";
    }

    if (text.includes("angry")) {
      return isPro
        ? "I understand your concern. Let me help you clearly. We can explain product details, delivery, return policy, and offer support politely."
        : "Advanced customer handling is available in Pro plan.";
    }

    if (text.includes("tamil")) {
      return isPro
        ? `${selectedProduct} romba useful product. Live offer la free shipping kooda irukku. Ippo order panna best value kidaikkum.`
        : "Multi-language advanced reply is available in Pro plan.";
    }

    if (text.includes("buy") || text.includes("order")) {
      return "You can click the Buy Now button during live. I’ll also remind viewers about the product link.";
    }

    return isPro
      ? `Great question! As a Pro AI Twin, I can explain benefits, compare objections, pitch the product, and guide viewers to buy ${selectedProduct}.`
      : `Great question! ${selectedProduct} is a strong product to promote live. I can explain benefits, answer customer questions, and guide viewers to buy.`;
  };

  const sendQuestion = (value = question) => {
    if (!value.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: value }]);
    setQuestion("");
    setTesting(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: getAIResponse(value) },
      ]);
      setTesting(false);
    }, 700);
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}
            {isPro ? "PRO TEST AI TWIN" : "TEST AI TWIN"}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
              isPro
                ? "bg-pink-500 text-white"
                : "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
            }`}
          >
            {isPro ? <Crown className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isPro ? "PRO PLAN ACTIVE" : "FREE PLAN"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Test{" "}
          <span className="brand-text">
            {isPro ? `Pro ${twinName}` : twinName}
          </span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {isPro
            ? "Test advanced sales replies, multilingual responses, customer objections, voice, lip sync and live selling flow."
            : "Test voice, lip sync, product knowledge and customer responses before going live."}
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Pro Testing
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Test multilingual answers, sales pitches, objections and full
                  live simulation.
                </p>
              </div>

              <button
                onClick={upgradeToPro}
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard icon={Mic} label="Voice" value={isPro ? "98%" : "92%"} />
        <ScoreCard
          icon={BadgeCheck}
          label="Lip Sync"
          value={isPro ? "HD 96%" : "88%"}
        />
        <ScoreCard
          icon={Brain}
          label="Knowledge"
          value={isPro ? "Advanced" : "95%"}
        />
        <ScoreCard
          icon={MessageSquare}
          label="Sales Reply"
          value={isPro ? "Pro 97%" : "91%"}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight brand-text">
            Twin Preview
          </h2>

          <div className="relative mt-5 rounded-3xl bg-pink-50 p-3 dark:bg-white/10">
            {isPro && (
              <span className="absolute right-5 top-5 z-10 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                PRO
              </span>
            )}

            <img
              src={twinImage}
              alt="AI Twin"
              className="h-96 w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <p className="text-lg font-black tracking-tight text-foreground">
              {twinName}
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Product: {selectedProduct}
            </p>

            <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ● {isPro ? "Pro testing ready" : "Ready for testing"}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <TestButton icon={Volume2} text="Test Voice" />
            <TestButton icon={BadgeCheck} text="Test Lip Sync" />
            <TestButton
              icon={RefreshCcw}
              text={isPro ? "Run Pro Full Test" : "Run Full Test Again"}
            />

            {!isPro && (
              <button
                onClick={upgradeToPro}
                className="brand-gradient flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
              >
                <Crown className="h-4 w-4" />
                Unlock Pro Test
              </button>
            )}
          </div>
        </aside>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight brand-text">
                {isPro ? "Pro Chat Test" : "Chat Test"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Ask product questions and check AI Twin answers.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-3 py-2">
              <Languages className="h-4 w-4 text-[var(--brand-pink)]" />

              <select
                value={language}
                onChange={(e) => {
                  if (!isPro && !["English", "Tamil", "Hindi", "Arabic"].includes(e.target.value)) {
                    upgradeToPro();
                    return;
                  }

                  setLanguage(e.target.value);
                }}
                className="bg-transparent text-sm font-bold text-foreground outline-none"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Arabic</option>
                {isPro && (
                  <>
                    <option>Malayalam</option>
                    <option>Telugu</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {sampleQuestions.map((q) => {
              const locked = proQuestions.includes(q) && !isPro;

              return (
                <button
                  key={q}
                  onClick={() => {
                    if (locked) {
                      upgradeToPro();
                      return;
                    }

                    sendQuestion(q);
                  }}
                  className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  {locked && <Lock className="mr-1 inline h-3 w-3" />}
                  {q}
                </button>
              );
            })}
          </div>

          <div className="mt-5 h-[420px] overflow-y-auto rounded-3xl border border-border bg-background p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    msg.from === "user"
                      ? "brand-gradient max-w-md rounded-2xl px-4 py-3 text-sm font-medium leading-7 text-white shadow-md"
                      : "max-w-md rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium leading-7 text-foreground shadow-sm"
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {testing && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold text-muted-foreground shadow-sm">
                  AI Twin is thinking...
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendQuestion();
              }}
              placeholder={
                isPro
                  ? "Ask your Pro AI Twin..."
                  : "Ask your AI Twin..."
              }
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
            />

            <button
              onClick={() => sendQuestion()}
              className="brand-gradient grid h-12 w-12 shrink-0 place-items-center rounded-[5px] text-white shadow-md transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight brand-text">
            Readiness Checklist
          </h2>

          <div className="mt-5 space-y-4">
            <CheckItem title="Avatar Created" done />
            <CheckItem title="Voice Selected" done />
            <CheckItem title={isPro ? "HD Lip Sync Ready" : "Lip Sync Ready"} done />
            <CheckItem title={isPro ? "Advanced Knowledge Added" : "Knowledge Added"} done />
            <CheckItem title="Product Selected" done />
            <CheckItem title="Multi-platform Simulation" done={isPro} />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black tracking-tight brand-text">
            AI Suggestions
          </h2>

          <div className="mt-5 space-y-4">
            <Suggestion text="Add more FAQ answers for better customer support." />
            <Suggestion text="Record a clearer voice sample for better lip sync." />
            <Suggestion text="Add discount script to improve conversion." />
            {isPro && (
              <Suggestion text="Use multilingual sales replies for wider audience reach." />
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/app/twin/train"
              className="flex h-11 flex-1 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] py-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
            >
              Retrain Twin
            </Link>

            <button
              onClick={() => navigate("/app/golive")}
              className="brand-gradient flex h-11 flex-1 items-center justify-center gap-2 rounded-[5px] py-2 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              {isPro ? "Go Pro Live" : "Go Live"}
              <Radio className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-black tracking-tight brand-text">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function TestButton({ icon: Icon, text }) {
  return (
    <button className="flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10">
      <Icon className="h-4 w-4" />
      {text}
    </button>
  );
}

function CheckItem({ title, done }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <AlertCircle className="h-5 w-5 text-orange-500 dark:text-orange-400" />
      )}

      <p className="text-sm font-black tracking-tight text-foreground">
        {title}
      </p>
    </div>
  );
}

function Suggestion({ text }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-medium leading-6 text-foreground">{text}</p>
    </div>
  );
}