// src/pages/VoiceLanguage.jsx

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Bell,
  Upload,
  Play,
  Pause,
  X,
} from "lucide-react";
import Logo from "../components/Logo";

export default function VoiceLanguage() {
  const navigate = useNavigate();

  const audioRef = useRef(null);

  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [style, setStyle] = useState("Friendly & Natural");
  const [defaultLanguage, setDefaultLanguage] = useState("English");

  const [languages, setLanguages] = useState([
    "Hindi",
    "Tamil",
  ]);

 const availableLanguages = [
  "Hindi",
  "Tamil",
  "Malayalam",
  "Telugu",
  "Kannada",
  "English",
];

const addLanguage = () => {
  const remainingLanguages = availableLanguages.filter(
    (lang) => !languages.includes(lang)
  );

  if (remainingLanguages.length > 0) {
    setLanguages([...languages, remainingLanguages[0]]);
  }
};

const removeLanguage = (lang) => {
  setLanguages(
    languages.filter((item) => item !== lang)
  );
};

  // Upload audio
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAudioFile(file);

    const url = URL.createObjectURL(file);

    setAudioUrl(url);

    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Play / Pause audio
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Stop icon when audio ends
  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current?.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [audioUrl]);

  return (
    <div>
      {/* Mobile Header */}
      <div className="flex items-center justify-between pb-10 md:hidden px-4 sm:px-6 lg:px-8">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>

    <div className="mx-auto bg-white px-4 py-8 rounded-lg shadow-md max-w-4xl">

        {/* Progress */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <Check className="h-5 w-5 text-emerald-500" />
            <p className="mt-2 text-xs">Connect</p>
          </div>

          <div className="h-[2px] flex-1 bg-gray-200" />

          <div className="flex flex-col items-center">
            <Check className="h-5 w-5 text-emerald-500" />
            <p className="mt-2 text-xs">Create</p>
          </div>

          <div className="h-[2px] flex-1 bg-gray-200" />

          <div className="flex flex-col items-center">
            <Check className="h-5 w-5 text-emerald-500" />
            <p className="mt-2 text-xs">Train</p>
          </div>

          <div className="h-[2px] flex-1 bg-gray-200" />

          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-[var(--brand-pink)]" />
            <p className="mt-2 text-xs font-bold text-[var(--brand-pink)]">
              Launch
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-black">
            Voice & Language Settings
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Select how your Twin speaks and communicates.
          </p>
        </div>

        {/* Upload Voice */}
        <div className="mt-8 rounded-[5px] border border-border bg-card p-5 shadow-sm">

          <p className="mb-5 text-sm font-bold">
            Upload Your Voice
          </p>

          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[5px] border-2 border-dashed border-pink-200 bg-pink-50 p-6 hover:bg-pink-100">

            <Upload className="h-6 w-6 text-[var(--brand-pink)]" />

            <span className="font-semibold text-[var(--brand-pink)]">
              Choose Audio File
            </span>

            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </label>

          {audioUrl && (
            <div className="mt-6 flex items-center gap-4 rounded-[5px] border border-border p-4">

              <button
                onClick={togglePlay}
                className="flex cursor-pointer h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-[var(--brand-pink)]"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </button>

              <div className="flex-1">
                <h4 className="font-bold">
                  {audioFile?.name}
                </h4>

                <div className="mt-2 flex items-end gap-[3px]">
                  {[8, 14, 18, 10, 22, 15, 10, 18, 12, 20].map(
                    (h, i) => (
                      <div
                        key={i}
                        className={`w-[3px] rounded ${
                          isPlaying
                            ? "animate-pulse bg-pink-400"
                            : "bg-gray-300"
                        }`}
                        style={{ height: `${h}px` }}
                      />
                    )
                  )}
                </div>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
              />
            </div>
          )}
        </div>

        {/* Speaking Style */}
        <div className="mt-8">
          <label className="text-sm font-bold">
            Speaking Style
          </label>

          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-2 w-full rounded-[5px] border border-border px-4 py-3 outline-none cursor-pointer"
          >
            <option>Friendly & Natural</option>
            <option>Professional</option>
            <option>Energetic</option>
            <option>Casual</option>
          </select>
        </div>

        {/* Default Language */}
        <div className="mt-8">
          <label className="text-sm font-bold">
            Default Language
          </label>

          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
            className="mt-2 w-full rounded-[5px] border border-border px-4 py-3 outline-none cursor-pointer"
          >
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
            <option>Malayalam</option>
          </select>
        </div>

        {/* Additional Languages */}
        <div className="mt-8">
          <label className="text-sm font-bold">
            Additional Languages
          </label>

          <div className="mt-4 flex flex-wrap gap-3">

            {languages.map((lang) => (
              <div
                key={lang}
                className="flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm text-[var(--brand-pink)]"
              >
                {lang}

                <button onClick={() => removeLanguage(lang)} className="cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

           

            <button
              onClick={addLanguage}
              className="rounded-full cursor-pointer border border-border px-4 py-2 text-sm font-semibold"
            >
              + Add
            </button>

          </div>
        </div>

        {/* Continue */}
        <button
          onClick={() => navigate("/app/settings")}
          className="brand-gradient cursor-pointer mt-10 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white"
        >
          Continue →
        </button>

        {/* Back */}
        <button
          onClick={() => navigate("/app/appearance")}
          className="mt-3 w-full cursor-pointer text-sm font-semibold"
        >
          Back
        </button>

      </div>
    </div>
  );
}