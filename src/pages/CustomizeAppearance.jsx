// src/pages/CustomizeAppearance.jsx

import {
  Check,
  Camera,
  Bell,
} from "lucide-react";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CustomizeAppearance() {
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedBg, setSelectedBg] = useState(0);
  const [gender, setGender] = useState("Female");

  const avatars = [
    "/images/dd.png",
    "/images/aa.png",
    "/images/bb.png",
    "/images/cc.png",
  ];

  const backgrounds = [
    "/images/hh.png",
    "/images/ee.png",
    "/images/ff.png",
    "/images/gg.png",
  ];

  return (
    <div> <div className="flex items-center justify-between pb-10 md:hidden px-4 sm:px-6 lg:px-8">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>

     <div className="mx-auto bg-white px-4 py-8 rounded-lg shadow-md max-w-4xl">
      {/* Progress */}
      <div className="flex items-center justify-between">
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
          <div className="h-3 w-3 rounded-full bg-[var(--brand-pink)]"></div>

          <p className="mt-2 text-xs font-bold text-[var(--brand-pink)]">
            Launch
          </p>
        </div>
      </div>

      {/* Heading */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-black">
          Customize Your Twin's Appearance
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Choose how your AI Twin looks on live and videos.
        </p>
      </div>

      {/* Video */}
     <div className="mt-8 overflow-hidden rounded-3xl border shadow-sm">

  {/* Mobile Image */}
  <img
    src="/images/b2.png"
    alt="Mobile Banner"
    className="block h-auto w-full object-cover md:hidden"
  />

  {/* Desktop Image */}
  <img
    src="/images/b1.png"
    alt="Desktop Banner"
    className="hidden h-auto w-full object-cover md:block"
  />

</div>

    

      {/* Avatar Style */}
      <div className="mt-8">
        <h3 className="font-bold">
          Choose Avatar / Style
        </h3>

        <div className="mt-5 flex gap-4">
          {avatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => setSelectedAvatar(index)}
              className={`relative cursor-pointer rounded-full ${
                selectedAvatar === index
                  ? "ring-4 ring-pink-500"
                  : ""
              }`}
            >
              <img
                src={avatar}
                className="h-20 w-20 rounded-full object-cover"
                alt=""
              />

              {selectedAvatar === index && (
                <div className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full brand-gradient">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Background Style */}
      <div className="mt-8">
        <h3 className="font-bold">
          Background Style
        </h3>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {backgrounds.map((bg, index) => (
            <button
              key={index}
              onClick={() => setSelectedBg(index)}
              className={`overflow-hidden cursor-pointer rounded-xl border-4 ${
                selectedBg === index
                  ? "border-pink-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={bg}
                className="h-16 w-full object-cover"
                alt=""
              />
            </button>
          ))}
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => navigate("/app/voice")}
        className="brand-gradient mt-10 flex h-12 w-full items-center justify-center rounded-[5px] text-sm font-bold text-white cursor-pointer"
      >
        Continue →
      </button>

      {/* Back */}
      <button
        onClick={() => navigate("/app/train")}
        className="mt-3 mb-8 w-full text-sm font-semibold cursor-pointer"
      >
        Back
      </button>
    </div>
    </div>
  );
}