import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Expand,
  ExternalLink,
  FileVideo2,
  Languages,
  Loader2,
  LoaderCircle,
  Maximize2,
  MessageSquareText,
  Package,
  Pause,
  Play,
  RefreshCcw,
  RotateCcw,
  ScanFace,
  Share2,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const clamp = (value, minimum, maximum) => {
  return Math.min(Math.max(value, minimum), maximum);
};

const createSafeFilePart = (value, fallback) => {
  const safeValue = String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return safeValue || fallback;
};

const getVideoFileName = ({ twinName, productName }) => {
  const safeTwinName = createSafeFilePart(twinName, "ai-twin");
  const safeProductName = createSafeFilePart(productName, "product");

  return `${safeTwinName}-${safeProductName}-video.mp4`;
};

const copyTextToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function GeneratedVideoPlayer({
  videoUrl = "",
  posterUrl = "",
  twinName = "AI Twin",
  productName = "Selected Product",
  speech = "",
  onRegenerate,
  onGoLive,
  onNotify,
  regenerating = false,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(videoUrl));
  const [videoError, setVideoError] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const fileName = getVideoFileName({ twinName, productName });

  const notify = (message, type = "success") => {
    if (typeof onNotify === "function") {
      onNotify({ message, type });
      return;
    }

    window.alert(message);
  };

  /* =========================================================
     RESET WHEN VIDEO CHANGES
  ========================================================= */

  useEffect(() => {
    setIsLoading(Boolean(videoUrl));
    setVideoError("");
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);
    setIsPlaying(false);
    setShowControls(true);
  }, [videoUrl]);

  /* =========================================================
     FULLSCREEN LISTENER
  ========================================================= */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  /* =========================================================
     CLEANUP TIMER
  ========================================================= */

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  /* =========================================================
     VIDEO EVENTS
  ========================================================= */

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setIsLoading(false);
    setVideoError("");
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const scheduleControlsHide = () => {
    if (controlsTimerRef.current) {
      window.clearTimeout(controlsTimerRef.current);
    }

    if (!isPlaying) {
      return;
    }

    controlsTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2500);
  };

  const handlePlaying = () => {
    setIsPlaying(true);
    setIsLoading(false);
    scheduleControlsHide();
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
    setShowControls(true);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextCurrentTime = Number.isFinite(video.currentTime)
      ? video.currentTime
      : 0;

    const nextDuration = Number.isFinite(video.duration)
      ? video.duration
      : duration;

    setCurrentTime(nextCurrentTime);

    if (nextDuration > 0) {
      setProgress(clamp((nextCurrentTime / nextDuration) * 100, 0, 100));
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    setVideoError(
      "Unable to load the generated video. The video URL may have expired or the file may still be processing."
    );
  };

  /* =========================================================
     PLAYBACK CONTROLS
  ========================================================= */

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video || videoError) {
      return;
    }

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("VIDEO PLAYBACK ERROR:", error);
      setVideoError(
        "Your browser blocked video playback. Please click the play button again."
      );
    }
  };

  const restartVideo = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      video.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      await video.play();
    } catch (error) {
      console.error("VIDEO RESTART ERROR:", error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (event) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextVolume = clamp(Number(event.target.value), 0, 1);

    video.volume = nextVolume;
    video.muted = nextVolume === 0;

    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const handleSeek = (event) => {
    const video = videoRef.current;

    if (!video || !duration) {
      return;
    }

    const nextProgress = clamp(Number(event.target.value), 0, 100);
    const nextTime = (nextProgress / 100) * duration;

    video.currentTime = nextTime;
    setProgress(nextProgress);
    setCurrentTime(nextTime);
  };

  /* =========================================================
     FULLSCREEN
  ========================================================= */

  const toggleFullscreen = async () => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch (error) {
      console.error("FULLSCREEN ERROR:", error);
    }
  };

  /* =========================================================
     POINTER + KEYBOARD
  ========================================================= */

  const handlePointerMove = () => {
    setShowControls(true);
    scheduleControlsHide();
  };

  const handlePointerLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const handlePlayerKeyDown = (event) => {
    const key = event.key.toLowerCase();

    if (key === " " || key === "k") {
      event.preventDefault();
      togglePlay();
    }

    if (key === "m") {
      toggleMute();
    }

    if (key === "f") {
      toggleFullscreen();
    }

    if (key === "r") {
      restartVideo();
    }
  };

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleRegenerateClick = async () => {
    if (regenerating || typeof onRegenerate !== "function") {
      return;
    }

    try {
      await onRegenerate();
    } catch (error) {
      console.error("REGENERATE VIDEO ERROR:", error);
      notify("Unable to regenerate the video.", "error");
    }
  };

  const handleGoLiveClick = () => {
    if (typeof onGoLive === "function") {
      onGoLive();
    }
  };

  const downloadVideo = async () => {
    if (!videoUrl || actionLoading) {
      return;
    }

    let objectUrl = "";

    try {
      setActionLoading("download");

      const response = await fetch(videoUrl);

      if (!response.ok) {
        throw new Error(`Video download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      notify("Video download started.");
    } catch (error) {
      console.error("VIDEO DOWNLOAD ERROR:", error);

      // Cloud storage CORS may block fetch. Opening the file still lets the user save it.
      window.open(videoUrl, "_blank", "noopener,noreferrer");
      notify(
        "The video was opened in a new tab because direct download was blocked.",
        "info"
      );
    } finally {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }

      setActionLoading("");
    }
  };

  const copyVideoUrl = async () => {
    if (!videoUrl || actionLoading) {
      return;
    }

    try {
      setActionLoading("copy");
      await copyTextToClipboard(videoUrl);
      notify("Video link copied successfully.");
    } catch (error) {
      console.error("COPY VIDEO URL ERROR:", error);
      notify("Unable to copy the video link.", "error");
    } finally {
      setActionLoading("");
    }
  };

  const shareVideo = async () => {
    if (!videoUrl || actionLoading) {
      return;
    }

    try {
      setActionLoading("share");

      if (navigator.share) {
        await navigator.share({
          title: productName || "AI Avatar Video",
          text: "Check out this AI-generated avatar video.",
          url: videoUrl,
        });

        notify("Video shared successfully.");
        return;
      }

      await copyTextToClipboard(videoUrl);
      notify("Sharing is unavailable, so the video link was copied instead.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("SHARE VIDEO ERROR:", error);
        notify("Unable to share the video.", "error");
      }
    } finally {
      setActionLoading("");
    }
  };

  const openVideo = () => {
    if (!videoUrl) {
      return;
    }

    window.open(videoUrl, "_blank", "noopener,noreferrer");
  };

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!videoUrl) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-6 text-center shadow-sm">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Play className="h-10 w-10" />
        </div>

        <h2 className="mt-6 text-2xl font-black">
          Generated video unavailable
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
          The video generation process completed, but no playable video URL was
          returned. Try regenerating the video.
        </p>

        <button
          type="button"
          onClick={handleRegenerateClick}
          disabled={regenerating || typeof onRegenerate !== "function"}
          className="brand-gradient mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {regenerating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}

          Regenerate Video
        </button>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            VIDEO READY
          </span>

          <h2 className="mt-4 text-2xl font-black tracking-tight">
            Generated AI Product Video
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Preview the generated talking avatar video before using it in your
            live commerce session.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-300">
          <Sparkles className="h-5 w-5" />
          Generation completed
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.2fr_0.8fr]">
        {/* Video player */}
        <div className="border-b border-border p-4 sm:p-6 xl:border-b-0 xl:border-r">
          <div
            ref={containerRef}
            tabIndex={0}
            role="application"
            aria-label="Generated AI avatar video player"
            onKeyDown={handlePlayerKeyDown}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
            onTouchStart={handlePointerMove}
            className="group relative aspect-video overflow-hidden rounded-3xl bg-black shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-pink)]"
          >
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl || undefined}
              preload="metadata"
              muted={isMuted}
              playsInline
              loop
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={handleCanPlay}
              onWaiting={handleWaiting}
              onPlaying={handlePlaying}
              onPause={handlePause}
              onEnded={handleEnded}
              onTimeUpdate={handleTimeUpdate}
              onError={handleVideoError}
              onClick={togglePlay}
              className="h-full w-full cursor-pointer object-contain"
            />

            {isLoading && !videoError && (
              <div className="absolute inset-0 z-20 grid place-items-center bg-black/55 backdrop-blur-sm">
                <div className="text-center text-white">
                  <LoaderCircle className="mx-auto h-12 w-12 animate-spin" />
                  <p className="mt-4 text-sm font-bold">
                    Loading generated video...
                  </p>
                </div>
              </div>
            )}

            {videoError && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 p-6 text-center">
                <div className="max-w-md text-white">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-red-500/20 text-red-300">
                    <AlertCircle className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Video playback failed
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {videoError}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setVideoError("");
                      setIsLoading(true);
                      videoRef.current?.load();
                    }}
                    className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] border border-white/20 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reload Video
                  </button>
                </div>
              </div>
            )}

            {!isPlaying && !isLoading && !videoError && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/55 text-white shadow-2xl backdrop-blur-md transition hover:scale-105 hover:bg-black/70"
              >
                <Play className="ml-1 h-9 w-9 fill-current" />
              </button>
            )}

            <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
              <span className="truncate rounded-full border border-white/15 bg-black/45 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
                {twinName}
              </span>

              <span className="truncate rounded-full border border-white/15 bg-black/45 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
                {productName}
              </span>
            </div>

            {!videoError && (
              <div
                className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/75 to-transparent px-4 pb-4 pt-16 text-white transition-opacity duration-300 ${
                  showControls
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  aria-label="Seek video"
                  className="h-1.5 w-full cursor-pointer accent-white"
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4 fill-current" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={restartVideo}
                      aria-label="Restart video"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      aria-label="Video volume"
                      className="hidden h-1 w-20 cursor-pointer accent-white sm:block"
                    />

                    <span className="whitespace-nowrap text-xs font-bold text-white/80">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={
                      isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                  >
                    {isFullscreen ? (
                      <Expand className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold text-muted-foreground">
              The generated video is configured to loop during preview and live
              sessions.
            </p>

            <span className="rounded-full border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground">
              MP4 · {fileName}
            </span>
          </div>
        </div>

        {/* Information panel */}
        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/40 dark:bg-emerald-900/10">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Generation Status
                </p>

                <h3 className="mt-1 text-xl font-black text-emerald-800 dark:text-emerald-200">
                  AI Video Ready
                </h3>

                <p className="mt-2 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
                  Your product-specific talking avatar video has been generated
                  and is ready for preview or live use.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5">
            <PanelHeader
              icon={FileVideo2}
              title="Video Information"
              description="Generated avatar and product details"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <VideoInfoCard icon={ScanFace} label="AI Twin" value={twinName} />
              <VideoInfoCard
                icon={Package}
                label="Product"
                value={productName}
              />
              <VideoInfoCard
                icon={Clock3}
                label="Duration"
                value={duration > 0 ? formatTime(duration) : "Loading..."}
              />
              <VideoInfoCard
                icon={FileVideo2}
                label="Format"
                value="MP4 Video"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <PanelHeader
                icon={MessageSquareText}
                title="AI Speech"
                description="Product presentation used for generation"
              />

              <span className="w-fit rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground">
                {speech.length} characters
              </span>
            </div>

            <div className="mt-4 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-4">
              {speech ? (
                <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                  {speech}
                </p>
              ) : (
                <div className="flex min-h-[120px] flex-col items-center justify-center text-center">
                  <MessageSquareText className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-bold text-muted-foreground">
                    Speech information is unavailable.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5">
            <PanelHeader
              icon={Bot}
              title="AI Generation Details"
              description="How this video was prepared"
            />

            <div className="mt-5 space-y-3">
              <GenerationDetail
                icon={ScanFace}
                title="Avatar"
                description={`Generated using the uploaded appearance of ${twinName}.`}
              />
              <GenerationDetail
                icon={Package}
                title="Product Context"
                description={`The speech and presentation are based on ${productName}.`}
              />
              <GenerationDetail
                icon={Languages}
                title="Voice and Language"
                description="The video uses the voice, language, tone, and personality configured for the selected AI Twin."
              />
              <GenerationDetail
                icon={Sparkles}
                title="AI Rendering"
                description="The final MP4 was rendered by the configured AI video generation provider and uploaded to secure cloud storage."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5">
            <PanelHeader
              icon={FileVideo2}
              title="Video File"
              description={fileName}
            />
          </div>

          <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5 dark:border-pink-900/30 dark:bg-pink-900/10">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pink-100 text-[var(--brand-pink)] dark:bg-pink-900/30">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-black text-pink-800 dark:text-pink-200">
                  Ready for the next step
                </h3>

                <p className="mt-2 text-sm leading-6 text-pink-700 dark:text-pink-400">
                  Review the generated video, then download it, regenerate it,
                  copy its link, or continue to your live commerce setup.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5">
            <PanelHeader
              icon={Video}
              title="Video Actions"
              description="Manage your generated AI video"
            />

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <ActionButton
                onClick={downloadVideo}
                disabled={Boolean(actionLoading)}
                loading={actionLoading === "download"}
                icon={Download}
                label="Download"
                ariaLabel="Download generated video"
                primary
              />

              <ActionButton
                onClick={copyVideoUrl}
                disabled={Boolean(actionLoading)}
                loading={actionLoading === "copy"}
                icon={Copy}
                label="Copy Link"
                ariaLabel="Copy video URL"
              />

              <ActionButton
                onClick={shareVideo}
                disabled={Boolean(actionLoading)}
                loading={actionLoading === "share"}
                icon={Share2}
                label="Share"
                ariaLabel="Share generated video"
              />

              <ActionButton
                onClick={openVideo}
                icon={ExternalLink}
                label="Open Video"
                ariaLabel="Open video in a new tab"
              />

              <ActionButton
                onClick={handleRegenerateClick}
                disabled={
                  regenerating || typeof onRegenerate !== "function"
                }
                loading={regenerating}
                icon={RefreshCcw}
                label="Regenerate"
                ariaLabel="Regenerate avatar video"
              />

              <ActionButton
                onClick={handleGoLiveClick}
                disabled={typeof onGoLive !== "function"}
                icon={Video}
                label="Go Live"
                ariaLabel="Go live with this avatar"
                success
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function PanelHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function VideoInfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-[var(--brand-pink)] hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-pink-500/10">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p
            className="mt-1 truncate text-sm font-bold text-foreground"
            title={String(value || "-")}
          >
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function GenerationDetail({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-[var(--brand-pink)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-pink-500/10">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-foreground">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  label,
  ariaLabel,
  primary = false,
  success = false,
}) {
  const buttonClass = primary
    ? "bg-[var(--brand-pink)] text-white hover:opacity-90"
    : success
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "border border-border bg-card text-foreground hover:border-[var(--brand-pink)]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonClass}`}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Icon className="h-5 w-5" />
      )}

      {label}
    </button>
  );
}