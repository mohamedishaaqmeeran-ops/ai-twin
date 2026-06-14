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
} from "lucide-react";

export default function TrainTwin() {
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([""]);
  const [knowledge, setKnowledge] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedTraining = JSON.parse(
      localStorage.getItem("twinTraining") || "{}"
    );

    if (savedTraining.files) setFiles(savedTraining.files);
    if (savedTraining.links) setLinks(savedTraining.links);
    if (savedTraining.knowledge) setKnowledge(savedTraining.knowledge);
  }, []);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || "Document",
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
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
      knowledge,
      trainedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("twinTraining", JSON.stringify(data));
    localStorage.setItem("isTwinTrained", "true");

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20";

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          TRAIN AI TWIN
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">Train</span> Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Upload files, add website links and write brand knowledge. Your AI
          Twin will use this information to answer questions and sell products
          during live.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="Files Added" value={files.length} />
        <StatCard
          icon={Link2}
          label="Links Added"
          value={links.filter((link) => link.trim() !== "").length}
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
              ? "Trained"
              : "Draft"
          }
        />
      </section>

      {/* Main Grid */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Upload Files */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <CardHeader
            icon={Upload}
            title="Upload Files"
            desc="PDF, DOC, TXT, CSV, catalog"
          />

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-pink-50 dark:hover:bg-white/10">
            <Upload className="h-7 w-7 text-[var(--brand-pink)]" />

            <p className="mt-3 text-base font-black tracking-tight text-foreground">
              Upload PDFs / Docs
            </p>

            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Click to select files
            </p>

            <input
              type="file"
              multiple
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

        {/* Website Links */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <CardHeader
            icon={Link2}
            title="Website Links"
            desc="Website, Instagram, YouTube"
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
            <Plus size={18} />
            Add Link
          </button>
        </div>

        {/* Knowledge Text */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <CardHeader
            icon={Brain}
            title="Knowledge Text"
            desc="Brand tone, FAQs, policies"
          />

          <textarea
            rows="11"
            value={knowledge}
            onChange={(e) => setKnowledge(e.target.value)}
            className="mt-5 w-full rounded-2xl border border-border bg-background p-4 text-sm font-medium leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
            placeholder={`Example:
Our brand sells skincare products.
Delivery takes 3 to 5 days.
Return policy is 7 days.
Use friendly, confident selling tone...`}
          />

          <button
            onClick={saveTraining}
            className="brand-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
          >
            <Save size={18} />
            Save Training
          </button>
        </div>
      </section>

      {/* Saved Alert */}
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