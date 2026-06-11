// src/pages/TrainTwin.jsx

import Logo from "../components/Logo";
import {
  Check,
  Upload,
  FileText,
  Image,
  Globe,
  Bell,
  Package,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function TrainTwin() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const sources = [
    {
      Icon: FileText,
      title: "Documents",
      desc: "PDFs, FAQs, brochures",
    },
    {
      Icon: Image,
      title: "Images",
      desc: "Product photos & banners",
    },
    {
      Icon: Globe,
      title: "Website",
      desc: "Import content from your website",
    },
    {
      Icon: Package,
      title: "Product Catalog",
      desc: "Products, pricing & descriptions",
    },
  ];

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);

    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <div>  <div className="flex items-center justify-between pb-10 md:hidden px-4 sm:px-6 lg:px-8">
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
          <div className="h-3 w-3 rounded-full bg-[var(--brand-pink)]" />
          <p className="mt-2 text-xs font-bold text-[var(--brand-pink)]">
            Train
          </p>
        </div>

        <div className="h-[2px] flex-1 bg-gray-200" />

        <div className="flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-gray-300" />
          <p className="mt-2 text-xs text-muted-foreground">
            Launch
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-black">
          Train Your AI Twin
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Upload content to help your AI Twin learn
          about your products and brand.
        </p>
      </div>

      {/* Upload Area */}
      <div className="mt-8 rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50 p-8 text-center">

        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow">
          <Upload className="h-8 w-8 text-[var(--brand-pink)]" />
        </div>

        <h3 className="mt-5 text-lg font-bold">
          Upload Files
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Drag & drop files here or browse from your device.
        </p>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFiles}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="brand-gradient mt-6 rounded-[5px] cursor-pointer px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Browse Files
        </button>
      </div>

      {/* Source Cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sources.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-4 rounded-[5px] border border-border bg-card p-5 shadow-sm"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
              <Icon className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold">
                {title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8 rounded-[5px] border border-border bg-card p-6 shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">
              Uploaded Files ({uploadedFiles.length})
            </h3>

            <button className="text-sm font-semibold text-[var(--brand-pink)] hover:underline">
              View All
            </button>
          </div>

          {/* Files */}
          <div className="mt-5 space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-[5px] border border-border p-4"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-50">
                  <FileText className="h-5 w-5 text-[var(--brand-pink)]" />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-semibold">
                    {file.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-pink-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="mt-8 rounded-[5px] border border-pink-200 bg-pink-50 p-5">
        <p className="text-sm leading-6 text-muted-foreground">
          💡 The more information you provide, the smarter and more
          accurate your AI Twin will become.
        </p>
      </div>

      {/* Continue */}
      <button
        onClick={() => navigate("/app/appearance")}
        className="brand-gradient mt-10 flex h-12 w-full cursor-pointer items-center justify-center rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Continue →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/basic-info")}
        className="mt-3 mb-8 w-full text-sm font-semibold cursor-pointer"
      >
        Back
      </button>
    </div>
    </div>
  );
}