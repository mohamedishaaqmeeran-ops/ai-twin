// src/pages/ReviewLaunch.jsx
import Logo from "../components/Logo";
import {
  Check,
  Menu,
  ChevronDown,
  Edit,Bell,
  Instagram,
  Facebook,
  Music2,
  Youtube,
  
  Save,
  Linkedin,
} from "lucide-react";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReviewLaunch() {
  const navigate = useNavigate();
const voiceInputRef = useRef(null);
const [voiceFile, setVoiceFile] = useState(null);
  const [selectedField, setSelectedField] = useState("name");
  const [editingField, setEditingField] = useState(null);

  const [details, setDetails] = useState({
    name: "Ananya AI Twin",
    industry: "Beauty & Skincare",
    languages: "English, Hindi, Tamil",
    voice: "Ananya (Female)",
  });

  const abilities = [
    "Answer Questions",
    "Recommend Products",
    "Sell Live",
    "Engage Audience",
  ];

const socials = [
  {
    Icon: Instagram,
    color: "text-pink-500",
    href: "https://www.instagram.com",
  },
  {
    Icon: Facebook,
    color: "text-blue-600",
    href: "https://www.facebook.com",
  },
  {
    Icon: Music2,
    color: "text-black",
    href: "https://www.tiktok.com",
  },
  {
    Icon: Youtube,
    color: "text-red-500",
    href: "https://www.youtube.com",
  },
  {
    Icon: Linkedin,
    color: "text-blue-700",
    href: "https://www.linkedin.com/company/twinlive",
  },
];

  const handleEdit = () => {
    setEditingField(selectedField);
  };

  const handleChange = (key, value) => {
    setDetails({
      ...details,
      [key]: value,
    });
  };
 
const handleVoiceUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setVoiceFile(file);

  setDetails({
    ...details,
    voice: file.name,
  });

  setEditingField(null);
};

  const handleSave = () => {
    setEditingField(null);
  };

  const DetailRow = ({ field, label, value }) => (
    <div className="mt-5 border-t border-border pt-4">
      <div className="flex items-start gap-3">
        <input
          type="radio"
          checked={selectedField === field}
          onChange={() => setSelectedField(field)}
          className="mt-1 h-4 w-4 accent-pink-500"
        />

        <div className="flex-1">
          <p className="text-sm font-bold">{label}</p>

          {editingField === field ? (
            <input
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className="mt-2 w-full rounded-[5px] border border-border px-3 py-2 text-sm outline-none"
              autoFocus
            />
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              • {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
   <div>
      {/* Mobile Header */}
      <div className="flex items-center justify-between pb-10 md:hidden px-4 sm:px-6 lg:px-8">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-4xl rounded-lg bg-white px-4 py-8 shadow-md">
    

      {/* Progress */}
      <div className="mt-8 flex items-center justify-between">
        {["Connect", "Create", "Train", "Launch"].map((step, index) => (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              {index === 3 ? (
                <div className="h-4 w-4 rounded-full border-4 border-[var(--brand-pink)] bg-white" />
              ) : (
                <Check className="h-5 w-5 text-emerald-500" />
              )}

              <p
                className={`mt-2 text-xs font-semibold ${
                  index === 3 ? "text-[var(--brand-pink)]" : "text-foreground"
                }`}
              >
                {step}
              </p>
            </div>

            {index !== 3 && <div className="mx-2 h-[2px] flex-1 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-black">Review Your AI Twin</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          You're almost ready to launch!
        </p>
      </div>

      {/* Review Card */}
      <div className="mt-8  bg-card p-5 ">
        <div className="flex gap-5">
          {/* Avatar */}
          <div className="shrink-0">
            <img
              src="/images/1.jpeg"
              alt="AI Twin"
              className="h-24 w-24 rounded-full border-4 border-pink-500 object-cover"
            />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-bold">Twin Details</p>

              {editingField ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 text-sm font-semibold cursor-pointer text-emerald-600"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1 text-sm font-semibold cursor-pointer text-[var(--brand-pink)]"
                >
                  <Edit className="h-4 w-4 " />
                  Edit
                </button>
              )}
            </div>

            <DetailRow
              field="name"
              label="Twin Name"
              value={details.name}
            />

            <DetailRow
              field="industry"
              label="Industry"
              value={details.industry}
            />

            <DetailRow
              field="languages"
              label="Languages"
              value={details.languages}
            />

            <div className="mt-5 border-t border-border pt-4">
  <div className="flex items-start gap-3">
    <input
      type="radio"
      checked={selectedField === "voice"}
      onChange={() => setSelectedField("voice")}
      className="mt-1 h-4 w-4 accent-pink-500"
    />

    <div className="flex-1">
      <p className="text-sm font-bold">Voice</p>

      {editingField === "voice" ? (
        <>
          <input
            ref={voiceInputRef}
            type="file"
            accept="audio/*"
            onChange={handleVoiceUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => voiceInputRef.current.click()}
            className="mt-2 flex items-center gap-2 rounded-[5px] border border-border px-3 py-2 text-sm font-semibold text-[var(--brand-pink)]"
          >
            <Upload className="h-4 w-4" />
            Upload Different Voice
          </button>
        </>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">
          • {details.voice}
        </p>
      )}
    </div>
  </div>
</div>
          </div>
        </div>

        {/* Abilities */}
        <div className="mt-8">
          <p className="text-sm font-bold">Key Abilities</p>

          <div className="mt-3 flex flex-wrap gap-3">
            {abilities.map((item) => (
              <span
                key={item}
                className="rounded-[5px] bg-pink-50 px-4 py-2 text-sm font-semibold text-[var(--brand-pink)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Socials */}
       <div className="mt-8 flex items-center gap-5">
  {socials.map(({ Icon, color, href }, index) => (
    <a
      key={index}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm transition duration-300 hover:scale-110 hover:shadow-lg"
    >
      <Icon className={`h-6 w-6 ${color}`} />
    </a>
  ))}
</div>
      </div>

      {/* Launch Button */}
      <button
        onClick={() => navigate("/app/golive")}
        className="brand-gradient mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Launch My AI Twin 🚀
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/settings")}
        className="mt-3 w-full cursor-pointer text-sm font-semibold"
      >
        Back
      </button>
    </div>
    </div>
  );
}