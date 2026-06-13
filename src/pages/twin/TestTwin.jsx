import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Send,
  Mic,
  Volume2,
  Sparkles,
  Radio,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Brain,
  MessageSquare,
  Languages,
  BadgeCheck,
} from "lucide-react";

const sampleQuestions = [
  "What is the price?",
  "Is delivery available?",
  "Why should I buy this product?",
  "Is there any discount?",
];

export default function TestTwin() {
  const navigate = useNavigate();

  const twinName = localStorage.getItem("twinName") || "My AI Twin";
  const twinImage =  "/images/bb.png";
  const selectedProduct =
    localStorage.getItem("selectedProduct") || "Vitamin C Glow Serum";

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: `Hi! I’m ${twinName}. Ask me anything about ${selectedProduct}.`,
    },
  ]);

  const [language, setLanguage] = useState("English");
  const [testing, setTesting] = useState(false);

  const getAIResponse = (q) => {
    const text = q.toLowerCase();

    if (text.includes("price")) {
      return `${selectedProduct} is available for ₹799. Today’s live offer includes free shipping.`;
    }

    if (text.includes("delivery")) {
      return "Delivery usually takes 3 to 5 working days. Cash on delivery can also be enabled based on your store settings.";
    }

    if (text.includes("discount")) {
      return "Yes! During live sessions, we can show a limited-time discount coupon to increase conversions.";
    }

    if (text.includes("buy") || text.includes("order")) {
      return "You can click the Buy Now button during live. I’ll also remind viewers about the product link.";
    }

    return `Great question! ${selectedProduct} is a strong product to promote live. I can explain benefits, answer customer questions, and guide viewers to buy.`;
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
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          TEST AI TWIN
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Test <span className="brand-text">{twinName}</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Test voice, lip sync, product knowledge and customer responses before
          going live.
        </p>
      </section>

      {/* Score Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard icon={Mic} label="Voice" value="92%" />
        <ScoreCard icon={BadgeCheck} label="Lip Sync" value="88%" />
        <ScoreCard icon={Brain} label="Knowledge" value="95%" />
        <ScoreCard icon={MessageSquare} label="Sales Reply" value="91%" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* Twin Preview */}
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Twin Preview</h2>

          <div className="brand-gradient mt-5 rounded-3xl ">
            <img
              src={twinImage}
              alt="AI Twin"
              className="h-96 w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <p className="font-black">{twinName}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Product: {selectedProduct}
            </p>
            <p className="mt-2 text-sm font-bold text-emerald-600">
              ● Ready for testing
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <TestButton icon={Volume2} text="Test Voice" />
            <TestButton icon={BadgeCheck} text="Test Lip Sync" />
            <TestButton icon={RefreshCcw} text="Run Full Test Again" />
          </div>
        </aside>

        {/* Chat Test */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black brand-text">Chat Test</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask product questions and check AI Twin answers.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-3 py-2">
              <Languages className="h-4 w-4 text-[var(--brand-pink)]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-bold outline-none"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Arabic</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendQuestion(q)}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs font-bold transition hover:border-[var(--brand-pink)] hover:bg-pink-50"
              >
                {q}
              </button>
            ))}
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
                  className={`max-w-md rounded-2xl px-4 py-3 text-sm leading-6 ${
                    msg.from === "user"
                      ? "brand-gradient text-white"
                      : "bg-card text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {testing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-card px-4 py-3 text-sm font-bold text-muted-foreground">
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
              placeholder="Ask your AI Twin..."
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
            />

            <button
              onClick={() => sendQuestion()}
              className="brand-gradient grid h-12 w-12 place-items-center rounded-[5px] text-white"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      {/* Readiness */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Readiness Checklist</h2>

          <div className="mt-5 space-y-4">
            <CheckItem title="Avatar Created" done />
            <CheckItem title="Voice Selected" done />
            <CheckItem title="Lip Sync Ready" done />
            <CheckItem title="Knowledge Added" done />
            <CheckItem title="Product Selected" done />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">AI Suggestions</h2>

          <div className="mt-5 space-y-4">
            <Suggestion text="Add more FAQ answers for better customer support." />
            <Suggestion text="Record a clearer voice sample for better lip sync." />
            <Suggestion text="Add discount script to improve conversion." />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/app/twin/train"
              className="flex h-11 flex-1 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
            >
              Retrain Twin
            </Link>

            <button
              onClick={() => navigate("/app/golive")}
              className="brand-gradient h-11 flex-1 rounded-[5px] text-sm font-bold text-white"
            >
              Go Live
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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-black brand-text">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TestButton({ icon: Icon, text }) {
  return (
    <button className="flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50">
      <Icon className="h-4 w-4" />
      {text}
    </button>
  );
}

function CheckItem({ title, done }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-orange-500" />
      )}

      <p className="font-bold">{title}</p>
    </div>
  );
}

function Suggestion({ text }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-bold">{text}</p>
    </div>
  );
}