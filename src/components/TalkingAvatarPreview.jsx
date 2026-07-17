import {
  LoaderCircle,
  Play,
} from "lucide-react";

import useTalkingAvatar from "../hooks/useTalkingAvatar";

export default function TalkingAvatarPreview({
  twinId,
  avatarImage,
  script,
}) {
  const talkingAvatar =
    useTalkingAvatar();

  const handleGenerate =
    async () => {
      try {
        await talkingAvatar.generate({
          twinId,
          text: script,
        });
      } catch (error) {
        console.error(
          "TALKING AVATAR ERROR:",
          error
        );
      }
    };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-black">
        {talkingAvatar.videoUrl ? (
          <video
            src={
              talkingAvatar.videoUrl
            }
            controls
            autoPlay
            playsInline
            className="h-80 w-full object-contain"
          />
        ) : (
          <img
            src={
              avatarImage ||
              "/images/bb.png"
            }
            alt="AI Twin"
            className="h-80 w-full object-contain"
          />
        )}
      </div>

      {talkingAvatar.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
          {talkingAvatar.error}
        </div>
      )}

      <button
        type="button"
        disabled={
          talkingAvatar.loading ||
          !twinId ||
          !script?.trim()
        }
        onClick={
          handleGenerate
        }
        className="brand-gradient flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {talkingAvatar.loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}

        {talkingAvatar.loading
          ? `Generating ${talkingAvatar.status}...`
          : "Generate Lip-Sync Preview"}
      </button>
    </div>
  );
}