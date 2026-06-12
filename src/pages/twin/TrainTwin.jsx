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
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? value : link))
    );
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

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          TRAIN AI TWIN
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">Train</span> Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Upload files, add website links and write brand knowledge. Your AI Twin
          will use this information to answer questions and sell products during live.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          value={localStorage.getItem("isTwinTrained") === "true" ? "Trained" : "Draft"}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Upload Files */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Upload className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-black">Upload Files</h2>
              <p className="text-sm text-muted-foreground">
                PDF, DOC, TXT, catalog
              </p>
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-pink-50">
            <Upload className="text-[var(--brand-pink)]" />
            <p className="mt-3 font-bold">Upload PDFs / Docs</p>
            <p className="mt-1 text-xs text-muted-foreground">
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
              <p className="rounded-xl border border-border bg-background p-4 text-center text-sm text-muted-foreground">
                No files uploaded yet.
              </p>
            ) : (
              files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>

                  <button
                    onClick={() => removeFile(index)}
                    className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
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
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Link2 className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-black">Website Links</h2>
              <p className="text-sm text-muted-foreground">
                Website, Instagram, YouTube
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
                  placeholder="https://yourbrand.com"
                />

                {links.length > 1 && (
                  <button
                    onClick={() => removeLink(index)}
                    className="rounded-[5px] border border-border px-3 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addLink}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-dashed border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
          >
            <Plus size={18} /> Add Link
          </button>
        </div>

        {/* Knowledge Text */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Brain className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-black">Knowledge Text</h2>
              <p className="text-sm text-muted-foreground">
                Brand tone, FAQs, policy
              </p>
            </div>
          </div>

          <textarea
            rows="11"
            value={knowledge}
            onChange={(e) => setKnowledge(e.target.value)}
            className="mt-5 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-[var(--brand-pink)]"
            placeholder="Example:
Our brand sells skincare products.
Delivery takes 3 to 5 days.
Return policy is 7 days.
Use friendly, confident selling tone..."
          />

          <button
            onClick={saveTraining}
            className="brand-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
          >
            <Save size={18} />
            Save Training
          </button>
        </div>
      </div>

      {/* Saved Alert */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0d0d12] px-5 py-4 text-sm font-bold text-white shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          Training saved successfully
        </div>
      )}
    </div>
  );
}
function StatCard({ icon: Icon, label, value }) {
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