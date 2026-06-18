// src/pages/pro/ProTwins.jsx

import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  Plus,
  Edit,
  Mic,
  Trash2,
  BadgeCheck,
  Crown,
} from "lucide-react";
import { getProTwins, saveProTwins, PRO_LIMITS } from "./proData";

export default function ProTwins() {
  const navigate = useNavigate();
  const twins = getProTwins();

  const deleteTwin = (id) => {
    const updated = twins.filter((twin) => twin.id !== id);
    saveProTwins(updated);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          PRO AI TWINS
        </span>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black">
              My <span className="brand-text">AI Twins</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pro plan allows maximum {PRO_LIMITS.maxTwins} AI Twins.
            </p>
          </div>

          <button
            onClick={() => {
              if (twins.length >= PRO_LIMITS.maxTwins) {
                alert("Pro plan allows maximum 3 AI Twins.");
                return;
              }
              navigate("/app/pro/twins/create");
            }}
            className="brand-gradient flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            Create Twin
          </button>
        </div>
      </section>

      {twins.length === 0 ? (
        <section className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
            <Bot className="h-10 w-10" />
          </div>

          <h2 className="mt-5 text-2xl font-black">No AI Twins Yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create your first AI Twin to start training, selling and going live.
          </p>

          <Link
            to="/app/pro/twins/create"
            className="brand-gradient mx-auto mt-6 flex h-12 w-fit items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white"
          >
            Create First Twin
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {twins.map((twin) => (
            <div
              key={twin.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="overflow-hidden rounded-3xl bg-background">
                <img
                  src={twin.image || "/images/bbb.png"}
                  alt={twin.name}
                  className="h-64 w-full object-contain"
                />
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">{twin.name}</h3>
                  <p className="text-sm text-muted-foreground">{twin.voice}</p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <Link
                  to={`/app/pro/twins/edit/${twin.id}`}
                  className="flex h-11 items-center justify-center rounded-xl border border-border text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  <Edit className="h-4 w-4" />
                </Link>

                <Link
                  to={`/app/pro/twins/train/${twin.id}`}
                  className="flex h-11 items-center justify-center rounded-xl border border-border text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  <Mic className="h-4 w-4" />
                </Link>

                <button
                  onClick={() => deleteTwin(twin.id)}
                  className="flex h-11 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-background p-3 text-sm font-bold">
                <BadgeCheck className="h-5 w-5 text-[var(--brand-pink)]" />
                Advanced lip sync enabled
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}