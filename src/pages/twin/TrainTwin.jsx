import { useEffect, useState } from "react";
import {
  Upload,
  Plus,
  Trash2,
  FileText,
  Link2,
  Brain,
  Sparkles,
  Save,
  CheckCircle2,
  Crown,
  Lock,
  Globe,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrainTwin() {
  const navigate = useNavigate();

  const plan = localStorage.getItem("plan") || "free";
  const isPro = plan === "pro";

  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([""]);
  const [knowledge, setKnowledge] = useState("");
  const [saved, setSaved] = useState(false);

  const maxFiles = isPro ? 20 : 1;
  const maxLinks = isPro ? 10 : 1;
  const maxKnowledgeChars = isPro ? 10000 : 1000;

  useEffect(() => {
    const savedTraining = JSON.parse(
      localStorage.getItem("twinTraining") || "{}"
    );

    if (savedTraining.files) setFiles(savedTraining.files);
    if (savedTraining.links) setLinks(savedTraining.links);
    if (savedTraining.knowledge) setKnowledge(savedTraining.knowledge);
  }, []);

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const handleFileUpload = (e) => {
    if (!isPro && files.length >= maxFiles) {
      upgradeToPro();
      return;
    }

    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || "Document",
    }));

    const allowedFiles = [...files, ...uploadedFiles].slice(0, maxFiles);
    setFiles(allowedFiles);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (links.length >= maxLinks) {
      upgradeToPro();
      return;
    }

    setLinks((prev) => [...prev, ""]);
  };

  const updateLink = (index, value) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
  };

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const saveTraining = () => {
    const data = {
      files,
      links: links.filter((link) => link.trim() !== ""),
      knowledge: knowledge.slice(0, maxKnowledgeChars),
      plan: isPro ? "pro" : "free",
      trainedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("twinTraining", JSON.stringify(data));
    localStorage.setItem("trainingText", data.knowledge);
    localStorage.setItem("isTwinTrained", "true");

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

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
            {isPro ? "PRO AI TRAINING" : "TRAIN AI TWIN"}
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
          <span className="brand-text">
            {isPro ? "Advanced Train" : "Train"}
          </span>{" "}
          Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {isPro
            ? "Upload more files, add multiple links, train with long brand knowledge and enable advanced selling intelligence."
            : "Free plan allows 1 file, 1 link and basic knowledge training. Upgrade for advanced training."}
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Pro Training
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  20 files, 10 links, voice notes, website import and advanced
                  knowledge memory.
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
        <StatCard
          icon={FileText}
          label="Files Added"
          value={`${files.length}/${maxFiles}`}
        />
        <StatCard
          icon={Link2}
          label="Links Added"
          value={`${links.filter((link) => link.trim() !== "").length}/${maxLinks}`}
        />
        <StatCard
          icon={Brain}
          label="Knowledge"
          value={knowledge.trim() ? "Added" : "Empty"}
        />
        <StatCard
          icon={CheckCircle2}
          label="Status"
          value={
            localStorage.getItem("isTwinTrained") === "true"
              ? isPro
                ? "Pro Trained"
                : "Trained"
              : "Draft"
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <CardHeader
            icon={Upload}
            title={isPro ? "Upload Training Files" : "Upload File"}
            desc={isPro ? "PDF, DOC, TXT, CSV, catalogs" : "Free: 1 file only"}
          />

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10">
            <Upload className="h-7 w-7 text-[var(--brand-pink)]" />

            <p className="mt-3 text-base font-black tracking-tight text-foreground">
              {isPro ? "Upload PDFs / Docs / Catalogs" : "Upload 1 PDF / Doc"}
            </p>

            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {isPro
                ? `You can upload up to ${maxFiles} files`
                : "Upgrade for multiple files"}
            </p>

            <input
              type="file"
              multiple={isPro}
              accept=".pdf,.doc,.docx,.txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="mt-5 space-y-3">
            {files.length === 0 ? (
              <p className="rounded-xl border border-border bg-background p-4 text-center text-sm leading-6 text-muted-foreground">
                No files uploaded yet.
              </p>
            ) : (
              files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black tracking-tight text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {file.size}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFile(index)}
                    className="shrink-0 rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-white/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <CardHeader
            icon={Link2}
            title="Website Links"
            desc={isPro ? "Website, Instagram, YouTube" : "Free: 1 link only"}
          />

          <div className="mt-5 space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className={inputClass}
                  placeholder="https://yourbrand.com"
                />

                {links.length > 1 && (
                  <button
                    onClick={() => removeLink(index)}
                    className="rounded-[5px] border border-border px-3 text-red-500 transition hover:bg-red-50 dark:hover:bg-white/10"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addLink}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-dashed border-[var(--brand-pink)] py-3 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
          >
            {links.length >= maxLinks && !isPro ? (
              <Lock size={18} />
            ) : (
              <Plus size={18} />
            )}
            {links.length >= maxLinks && !isPro ? "Add More - Pro" : "Add Link"}
          </button>

          <div className="mt-5 grid gap-3">
            <ProMiniCard
              icon={Globe}
              title="Auto Website Import"
              desc="Import full website content"
              isPro={isPro}
              onClick={upgradeToPro}
            />
            <ProMiniCard
              icon={Volume2}
              title="Voice Notes Training"
              desc="Train using recorded speech"
              isPro={isPro}
              onClick={upgradeToPro}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <CardHeader
            icon={Brain}
            title={isPro ? "Advanced Knowledge Text" : "Knowledge Text"}
            desc={
              isPro
                ? `${knowledge.length}/${maxKnowledgeChars} characters`
                : `${knowledge.length}/${maxKnowledgeChars} characters`
            }
          />

          <textarea
            rows="11"
            maxLength={maxKnowledgeChars}
            value={knowledge}
            onChange={(e) => setKnowledge(e.target.value)}
            className="mt-5 w-full rounded-2xl border border-border bg-background p-4 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
            placeholder={`Example:
Our brand sells skincare products.
Delivery takes 3 to 5 days.
Return policy is 7 days.
Use friendly, confident selling tone...`}
          />

          {!isPro && (
            <p className="mt-2 text-xs font-bold text-orange-500">
              Free plan limit: 1000 characters. Upgrade for advanced knowledge.
            </p>
          )}

          <button
            onClick={saveTraining}
            className="brand-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
          >
            <Save size={18} />
            Save Training
          </button>
        </div>
      </section>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold tracking-wide text-foreground shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          Training saved successfully
        </div>
      )}
    </div>
  );
}

function CardHeader({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <h2 className="text-lg font-black tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
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

function ProMiniCard({ icon: Icon, title, desc, isPro, onClick }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!isPro) onClick();
      }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        {isPro ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
      </div>

      <div>
        <p className="text-sm font-black text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          {isPro ? desc : "Unlock with Pro"}
        </p>
      </div>
    </button>
  );
}