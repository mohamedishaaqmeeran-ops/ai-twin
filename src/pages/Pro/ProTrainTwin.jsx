// src/pages/pro/ProTrainTwin.jsx

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  Upload,
  FileText,
  MessageSquare,
  Save,
  Crown,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { getProTwins, saveProTwins } from "./proData";

export default function ProTrainTwin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const twins = getProTwins();

  const selectedTwin = useMemo(
    () => twins.find((item) => item.id === id),
    [twins, id]
  );

  const [training, setTraining] = useState({
    voiceSample: selectedTwin?.voiceSample || "",
    productKnowledge: selectedTwin?.productKnowledge || "",
    faq: selectedTwin?.faq || "",
    tone: selectedTwin?.tone || "Friendly and persuasive",
  });

  const saveTraining = (e) => {
    e.preventDefault();

    const updated = twins.map((item) =>
      item.id === id
        ? {
            ...item,
            ...training,
            trained: true,
            trainedAt: new Date().toISOString(),
          }
        : item
    );

    saveProTwins(updated);
    navigate("/app/pro/twins");
  };

  if (!selectedTwin) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black">Twin not found</h1>
        <button
          onClick={() => navigate("/app/pro/twins")}
          className="brand-gradient mt-5 rounded-[5px] px-6 py-3 text-sm font-bold text-white"
        >
          Back to Twins
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <button
          onClick={() => navigate("/app/pro/twins")}
          className="mb-5 flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Twins
        </button>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          CUSTOM VOICE CLONING
        </span>

        <h1 className="mt-5 text-4xl font-black">
          Train <span className="brand-text">{selectedTwin.name}</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Train voice, FAQs, brand tone and product knowledge for better live
          selling.
        </p>
      </section>

      <form onSubmit={saveTraining} className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <Card icon={Mic} title="Voice Clone">
            <div className="rounded-3xl border-2 border-dashed border-border bg-background p-6 text-center">
              <Upload className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />
              <h3 className="mt-4 text-lg font-black">Upload Voice Sample</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add a 30-60 second sample for custom voice cloning.
              </p>

              <input
                type="text"
                value={training.voiceSample}
                onChange={(e) =>
                  setTraining((prev) => ({
                    ...prev,
                    voiceSample: e.target.value,
                  }))
                }
                placeholder="Paste file name or voice sample link"
                className="mt-5 w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)]"
              />
            </div>
          </Card>

          <Card icon={FileText} title="Product Knowledge">
            <textarea
              value={training.productKnowledge}
              onChange={(e) =>
                setTraining((prev) => ({
                  ...prev,
                  productKnowledge: e.target.value,
                }))
              }
              placeholder="Add product details, offers, ingredients, use cases, pricing and selling points..."
              rows={8}
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)]"
            />
          </Card>

          <Card icon={MessageSquare} title="FAQs">
            <textarea
              value={training.faq}
              onChange={(e) =>
                setTraining((prev) => ({ ...prev, faq: e.target.value }))
              }
              placeholder="Example: Q: Is it good for sensitive skin? A: Yes, it is dermatologically tested..."
              rows={7}
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)]"
            />
          </Card>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black brand-text">Training Status</h2>

            <div className="mt-5 space-y-4">
              <Status label="Voice Cloning" value="Pro Enabled" />
              <Status label="Lip Sync" value="Advanced" />
              <Status label="AI Replies" value="Unlimited" />
              <Status
                label="Current Status"
                value={selectedTwin.trained ? "Trained" : "Pending"}
              />
            </div>

            <button className="brand-gradient mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white">
              <Save className="h-4 w-4" />
              Save Training
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-1 h-6 w-6 text-emerald-500" />
              <div>
                <h3 className="font-black">Pro Training Benefits</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Custom voice clone, advanced lip sync, brand-aware responses
                  and unlimited live replies are enabled for this Pro AI Twin.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black brand-text">{title}</h2>
      </div>

      {children}
    </div>
  );
}

function Status({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
      <span className="text-sm font-bold text-muted-foreground">{label}</span>
      <span className="text-sm font-black text-foreground">{value}</span>
    </div>
  );
}