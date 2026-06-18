// src/pages/pro/ProEditTwin.jsx

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bot,
  Mic,
  Image,
  Save,
  Crown,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { getProTwins, saveProTwins } from "./proData";

export default function ProEditTwin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const twins = getProTwins();

  const selectedTwin = useMemo(
    () => twins.find((item) => item.id === id),
    [twins, id]
  );

  const [form, setForm] = useState(
    selectedTwin || {
      name: "",
      voice: "Custom Voice Clone",
      style: "Professional Seller",
      image: "/images/bbb.png",
    }
  );

  const [error, setError] = useState("");

  const updateTwin = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter AI Twin name.");
      return;
    }

    const updated = twins.map((item) =>
      item.id === id ? { ...item, ...form } : item
    );

    saveProTwins(updated);
    localStorage.setItem("twinName", form.name);
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
          EDIT PRO TWIN
        </span>

        <h1 className="mt-5 text-4xl font-black">
          Edit <span className="brand-text">AI Twin</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update your AI Twin appearance, voice and selling style.
        </p>
      </section>

      <form
        onSubmit={updateTwin}
        className="grid gap-6 xl:grid-cols-[1fr_360px]"
      >
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-black brand-text">Twin Settings</h2>

          <div className="mt-6 space-y-5">
            <Field label="AI Twin Name" icon={Bot}>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)]"
              />
            </Field>

            <Field label="Voice Type" icon={Mic}>
              <select
                value={form.voice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, voice: e.target.value }))
                }
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)]"
              >
                <option>Custom Voice Clone</option>
                <option>Premium Female Voice</option>
                <option>Premium Male Voice</option>
                <option>Brand Assistant Voice</option>
              </select>
            </Field>

            <Field label="Selling Style" icon={Crown}>
              <select
                value={form.style}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, style: e.target.value }))
                }
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)]"
              >
                <option>Professional Seller</option>
                <option>Friendly Influencer</option>
                <option>Luxury Brand Host</option>
                <option>Tech Reviewer</option>
              </select>
            </Field>

            <Field label="Avatar Image" icon={Image}>
              <select
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:border-[var(--brand-pink)]"
              >
                <option value="/images/bbb.png">Avatar 1</option>
                <option value="/images/bb.png">Avatar 2</option>
                <option value="/images/1.jpeg">Avatar 3</option>
              </select>
            </Field>

            {error && (
              <div className="flex items-center gap-2 rounded-[5px] bg-red-50 p-3 text-sm font-bold text-red-600 dark:bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <button className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-black brand-text">Preview</h2>

          <div className="mt-5 rounded-3xl bg-background p-4">
            <img
              src={form.image}
              alt="Preview"
              className="h-80 w-full rounded-2xl object-contain"
            />
          </div>

          <h3 className="mt-5 text-center text-2xl font-black">
            {form.name}
          </h3>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            {form.voice} · {form.style}
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>
      {children}
    </div>
  );
}