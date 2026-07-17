import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  Upload,
  Mic,
  Sparkles,
  ArrowRight,
  ScanFace,
  UserCircle2,
  FileText,
  BadgeCheck,
  Image,
  Shirt,
  Hand,
  Play,
  Volume2,
  Globe,
  Link2,
  Crown,
  Lock,
  LoaderCircle,
  X,
} from "lucide-react";

import {
  createTwinBasicInfo,
  fetchTwins,
  saveTwinAppearance,
  saveTwinKnowledge,
  saveTwinVoice,
} from "../../features/twin/twinSlice";

/* =========================================================
   STATIC OPTIONS
========================================================= */

const avatars = [
  {
    name: "Beauty Creator",
    image: "/images/bb.png",
    pro: false,
  },
  {
    name: "Sales Expert",
    image: "/images/dd.png",
    pro: false,
  },
  {
    name: "Fashion Host",
    image: "/images/1.jpeg",
    pro: true,
  },
  {
    name: "Tech Reviewer",
    image: "/images/2.jpeg",
    pro: true,
  },
];

const backgrounds = [
  {
    name: "Pink Store",
    image: "/images/hh.png",
    pro: false,
  },
  {
    name: "Studio",
    image: "/images/ff.png",
    pro: false,
  },
  {
    name: "Luxury",
    image: "/images/ee.png",
    pro: true,
  },
  {
    name: "Live Stage",
    image: "/images/gg.png",
    pro: true,
  },
];

const outfits = [
  {
    name: "Professional",
    pro: false,
  },
  {
    name: "Casual",
    pro: false,
  },
  {
    name: "Creator",
    pro: true,
  },
  {
    name: "Luxury",
    pro: true,
  },
  {
    name: "Business",
    pro: true,
  },
];

const gestures = [
  {
    name: "Friendly",
    pro: false,
  },
  {
    name: "Energetic",
    pro: false,
  },
  {
    name: "Confident",
    pro: true,
  },
  {
    name: "Expressive",
    pro: true,
  },
];

const voices = [
  {
    name: "Warm Female",
    pro: false,
  },
  {
    name: "Soft Female",
    pro: false,
  },
  {
    name: "Luxury Female",
    pro: true,
  },
  {
    name: "Young Male",
    pro: true,
  },
  {
    name: "Professional Male",
    pro: true,
  },
  {
    name: "Energetic Creator",
    pro: true,
  },
];

const freeLanguages = [
  "English",
  "Hindi",
  "Tamil",
  "Malayalam",
  "Arabic",
];

const proLanguages = [
  "English",
  "Arabic",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Bengali",
  "Urdu",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Spanish",
  "French",
  "German",
  "Russian",
  "Turkish",
];

/* =========================================================
   HELPERS
========================================================= */

const getErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  return (
    error?.message ||
    "Something went wrong."
  );
};

/*
 * Converts a frontend public image such as /images/bb.png
 * into a File, so it is uploaded to Cloudinary through the
 * backend. This prevents relative frontend URLs from being
 * stored in MongoDB.
 */

const publicImageToFile = async (
  imageUrl,
  fileName
) => {
  const absoluteUrl = new URL(
    imageUrl,
    window.location.origin
  ).toString();

  const response = await fetch(
    absoluteUrl
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load the selected avatar."
    );
  }

  const blob = await response.blob();

  return new File(
    [blob],
    fileName,
    {
      type:
        blob.type || "image/png",
    }
  );
};


const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com"
).replace(/\/$/, "");

const readApiResponse = async (
  response
) => {
  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CreateTwin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
  } = useSelector(
    (state) => state.auth
  );

  const {
    twins,
    loading,
    creating,
    initialized,
    error,
  } = useSelector(
    (state) => state.twin
  );

  const avatarInputRef =
    useRef(null);

  const voiceInputRef =
    useRef(null);

  const knowledgeInputRef =
    useRef(null);

  const isBusiness =
    String(
      user?.plan || ""
    ).toLowerCase() === "business";

  const isPro =
    String(
      user?.plan || ""
    ).toLowerCase() === "pro" ||
    isBusiness;

  const maxTwins =
    isBusiness
      ? Infinity
      : isPro
      ? 3
      : 1;

  const canCreateTwin =
    !Number.isFinite(maxTwins) ||
    twins.length < maxTwins;

  const languages =
    isPro
      ? proLanguages
      : freeLanguages;

  const [step, setStep] =
    useState(1);

  const [name, setName] =
    useState("");

  const [brandName, setBrandName] =
    useState("");

  const [
    brandDescription,
    setBrandDescription,
  ] = useState("");

  const [industry, setIndustry] =
    useState("E-commerce");

  const [purpose, setPurpose] =
    useState(
      "Live-commerce selling and customer support"
    );

  const [
    targetAudience,
    setTargetAudience,
  ] = useState("");

  const [avatar, setAvatar] =
    useState("/images/bb.png");

  const [
    avatarFile,
    setAvatarFile,
  ] = useState(null);

  const [
    avatarPreview,
    setAvatarPreview,
  ] = useState("");

  const [
    background,
    setBackground,
  ] = useState("/images/ff.png");

  const [style, setStyle] =
    useState("Professional");

  const [gesture, setGesture] =
    useState("Friendly");

  const [voice, setVoice] =
    useState("Warm Female");

  const [language, setLanguage] =
    useState("English");

  const [
    voiceSample,
    setVoiceSample,
  ] = useState(null);

  const [voiceSpeed, setVoiceSpeed] =
    useState(1);

  const [voicePitch, setVoicePitch] =
    useState(1);

  const [
    trainingText,
    setTrainingText,
  ] = useState("");

  const [
    knowledgeFile,
    setKnowledgeFile,
  ] = useState(null);

  const [
    websiteUrl,
    setWebsiteUrl,
  ] = useState("");

  const [
    lipScript,
    setLipScript,
  ] = useState(
    "Hi everyone! I am your AI Twin. Today I am going to show you this amazing product and answer your questions live."
  );

  const [
    savingMessage,
    setSavingMessage,
  ] = useState("");

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    createdTwinId,
    setCreatedTwinId,
  ] = useState("");

  const [
    basicSaved,
    setBasicSaved,
  ] = useState(false);

  const [
    appearanceSaved,
    setAppearanceSaved,
  ] = useState(false);

  const [
    voiceSaved,
    setVoiceSaved,
  ] = useState(false);

  const [
    knowledgeSaved,
    setKnowledgeSaved,
  ] = useState(false);

  const [
    lipSyncLoading,
    setLipSyncLoading,
  ] = useState(false);

  const [
    lipSyncStatus,
    setLipSyncStatus,
  ] = useState("idle");

  const [
    lipSyncVideoUrl,
    setLipSyncVideoUrl,
  ] = useState("");

  const [
    lipSyncAudioUrl,
    setLipSyncAudioUrl,
  ] = useState("");

  const steps = [
    {
      title: "Basic Info",
      icon: UserCircle2,
    },
    {
      title: "Appearance",
      icon: ScanFace,
    },
    {
      title: "Voice",
      icon: Mic,
    },
    {
      title: "Lip Sync",
      icon: BadgeCheck,
    },
    {
      title: "Train AI",
      icon: FileText,
    },
    {
      title: "Preview",
      icon: BadgeCheck,
    },
  ];

  const displayedAvatar =
    avatarPreview || avatar;

  const backgroundName =
    useMemo(
      () =>
        backgrounds.find(
          (item) =>
            item.image ===
            background
        )?.name ||
        "Selected",
      [background]
    );

  useEffect(() => {
    dispatch(fetchTwins());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        );
      }
    };
  }, [avatarPreview]);

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const validateStep = () => {
    setFormError("");

    if (step === 1) {
      if (!name.trim()) {
        setFormError(
          "AI Twin name is required."
        );

        return false;
      }

      if (
        !brandDescription.trim()
      ) {
        setFormError(
          "Brand description is required."
        );

        return false;
      }
    }

    if (step === 5) {
      if (
        websiteUrl.trim() &&
        !/^https?:\/\//i.test(
          websiteUrl.trim()
        )
      ) {
        setFormError(
          "Website URL must start with http:// or https://."
        );

        return false;
      }
    }

    return true;
  };

  const getReturnedTwinId = (
    result
  ) => {
    return (
      result?.twin?._id ||
      result?.data?.twinId ||
      result?.data?.twin_id ||
      result?.data?.id ||
      ""
    );
  };

  const saveBasicStep = async () => {
    if (
      basicSaved &&
      createdTwinId
    ) {
      return createdTwinId;
    }

    if (!name.trim()) {
      throw new Error(
        "AI Twin name is required."
      );
    }

    if (
      !brandDescription.trim()
    ) {
      throw new Error(
        "Brand description is required."
      );
    }

    if (!canCreateTwin) {
      throw new Error(
        isPro
          ? "Your Pro plan already has the maximum of three AI Twins."
          : "Your Free plan already has one AI Twin."
      );
    }

    setSavingMessage(
      "Saving basic information..."
    );

    const result =
      await dispatch(
        createTwinBasicInfo({
          name: name.trim(),
          brandName:
            brandName.trim(),
          brandDescription:
            brandDescription.trim(),
          purpose:
            purpose.trim(),
          industry:
            industry.trim() ||
            "General",
          targetAudience:
            targetAudience.trim(),
          personality:
            gesture,
          tone: "Helpful",
          primaryLanguage:
            language,
        })
      ).unwrap();

    const twinId =
      getReturnedTwinId(result);

    if (!twinId) {
      throw new Error(
        "Backend did not return the new Twin ID."
      );
    }

    setCreatedTwinId(twinId);
    setBasicSaved(true);

    return twinId;
  };

  const saveAppearanceStep =
    async (twinId) => {
      if (appearanceSaved) {
        return;
      }

      setSavingMessage(
        "Uploading appearance..."
      );

      let finalAvatarFile =
        avatarFile;

      if (!finalAvatarFile) {
        const selectedName =
          avatar
            .split("/")
            .pop() ||
          "default-avatar.png";

        finalAvatarFile =
          await publicImageToFile(
            avatar,
            selectedName
          );
      }

      await dispatch(
        saveTwinAppearance({
          twinId,
          avatarFile:
            finalAvatarFile,
          style,
          background:
            backgroundName,
          clothingStyle:
            style,
          gesture,
          gender: "",
          ageGroup: "",
          skinTone: "",
          hairStyle: "",
        })
      ).unwrap();

      setAppearanceSaved(true);
  };

  const saveVoiceStep =
    async (twinId) => {
      if (voiceSaved) {
        return;
      }

      setSavingMessage(
        "Saving voice settings..."
      );

      await dispatch(
        saveTwinVoice({
          twinId,
          voiceType: voice,
          language,
          speed: voiceSpeed,
          pitch: voicePitch,
          sampleFile:
            voiceSample,
        })
      ).unwrap();

      setVoiceSaved(true);
  };

  const buildFallbackKnowledge =
    () => {
      return `
AI Twin name: ${name.trim()}

Brand name:
${
  brandName.trim() ||
  "Not provided"
}

Brand description:
${brandDescription.trim()}

Industry:
${industry.trim() || "General"}

Purpose:
${purpose.trim()}

Target audience:
${
  targetAudience.trim() ||
  "General customers"
}

Preferred language:
${language}

Personality:
${gesture}

Communication rules:
The AI Twin represents this brand during live-commerce sessions. It should answer customer questions clearly and helpfully. It must not invent product prices, refund policies, shipping details, guarantees, discounts or product information.
      `.trim();
    };

  const saveKnowledgeStep =
    async (twinId) => {
      if (knowledgeSaved) {
        return;
      }

      setSavingMessage(
        "Training AI Twin..."
      );

      await dispatch(
        saveTwinKnowledge({
          twinId,
          title:
            `${name.trim()} Brand Knowledge`,
          documentFile:
            knowledgeFile,
          websiteUrl:
            knowledgeFile
              ? ""
              : websiteUrl.trim(),
          text:
            knowledgeFile ||
            websiteUrl.trim()
              ? ""
              : trainingText.trim() ||
                buildFallbackKnowledge(),
        })
      ).unwrap();

      setKnowledgeSaved(true);
    };

  const generateLipSyncPreview =
    async () => {
      setFormError("");

      if (!lipScript.trim()) {
        setFormError(
          "Preview script is required."
        );
        return;
      }

      try {
        setLipSyncLoading(true);
        setLipSyncStatus(
          "preparing"
        );
        setLipSyncVideoUrl("");

        const twinId =
          await saveBasicStep();

        await saveAppearanceStep(
          twinId
        );

        await saveVoiceStep(
          twinId
        );

        setSavingMessage(
          "Generating voice and lip sync..."
        );

        const createResponse =
          await fetch(
            `${API_BASE_URL}/api/twin/talking-avatar`,
            {
              method: "POST",
              credentials:
                "include",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                twinId,
                text:
                  lipScript.trim(),
              }),
            }
          );

        const createData =
          await readApiResponse(
            createResponse
          );

        const generation =
          createData.data ||
          createData;

        const generationId =
          generation.generationId;

        if (!generationId) {
          throw new Error(
            "Backend did not return an avatar generation ID."
          );
        }

        setLipSyncAudioUrl(
          generation.audioUrl ||
            ""
        );

        for (
          let attempt = 0;
          attempt < 60;
          attempt += 1
        ) {
          setLipSyncStatus(
            "processing"
          );

          const statusResponse =
            await fetch(
              `${API_BASE_URL}/api/twin/talking-avatar/${generationId}`,
              {
                method: "GET",
                credentials:
                  "include",
              }
            );

          const statusData =
            await readApiResponse(
              statusResponse
            );

          const current =
            statusData.data ||
            statusData;

          if (
            current.status ===
            "completed"
          ) {
            if (
              !current.videoUrl
            ) {
              throw new Error(
                "Avatar completed but no video URL was returned."
              );
            }

            setLipSyncVideoUrl(
              current.videoUrl
            );

            setLipSyncStatus(
              "completed"
            );

            return;
          }

          if (
            current.status ===
            "failed"
          ) {
            throw new Error(
              current.error ||
                "Lip-sync generation failed."
            );
          }

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                2000
              )
          );
        }

        throw new Error(
          "Lip-sync generation timed out."
        );
      } catch (previewError) {
        console.error(
          "LIP SYNC PREVIEW ERROR:",
          previewError
        );

        setLipSyncStatus(
          "failed"
        );

        setFormError(
          getErrorMessage(
            previewError
          )
        );
      } finally {
        setLipSyncLoading(false);
        setSavingMessage("");
      }
    };

  const goNext = async () => {
    if (!validateStep()) {
      return;
    }

    try {
      setFormError("");

      if (step === 1) {
        await saveBasicStep();
      }

      if (step === 2) {
        const twinId =
          createdTwinId ||
          (await saveBasicStep());

        await saveAppearanceStep(
          twinId
        );
      }

      if (step === 3) {
        const twinId =
          createdTwinId ||
          (await saveBasicStep());

        await saveAppearanceStep(
          twinId
        );

        await saveVoiceStep(
          twinId
        );
      }

      if (step === 5) {
        const twinId =
          createdTwinId ||
          (await saveBasicStep());

        await saveAppearanceStep(
          twinId
        );

        await saveVoiceStep(
          twinId
        );

        await saveKnowledgeStep(
          twinId
        );
      }

      setStep((current) =>
        Math.min(
          6,
          current + 1
        )
      );
    } catch (stepError) {
      console.error(
        "SAVE STEP ERROR:",
        stepError
      );

      setFormError(
        getErrorMessage(
          stepError
        )
      );
    } finally {
      setSavingMessage("");
    }
  };

  const handleAvatarUpload = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setFormError(
        "Avatar must be JPG, PNG or WEBP."
      );

      event.target.value = "";

      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview
      );
    }

    setAvatarFile(file);

    setAvatarPreview(
      URL.createObjectURL(file)
    );

    setFormError("");
  };

  const selectDefaultAvatar = (
    item
  ) => {
    if (item.pro && !isPro) {
      upgradeToPro();
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview
      );
    }

    setAvatarFile(null);
    setAvatarPreview("");
    setAvatar(item.image);
  };

  const handleVoiceUpload = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setVoiceSample(file);
    setFormError("");
  };

  const handleKnowledgeUpload = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setKnowledgeFile(file);
    setWebsiteUrl("");
    setFormError("");
  };

  const removeAvatarUpload = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview
      );
    }

    setAvatarFile(null);
    setAvatarPreview("");

    if (
      avatarInputRef.current
    ) {
      avatarInputRef.current.value =
        "";
    }
  };

  const removeVoiceSample = () => {
    setVoiceSample(null);

    if (
      voiceInputRef.current
    ) {
      voiceInputRef.current.value =
        "";
    }
  };

  const removeKnowledgeFile = () => {
    setKnowledgeFile(null);

    if (
      knowledgeInputRef.current
    ) {
      knowledgeInputRef.current.value =
        "";
    }
  };

  const finishCreate = async () => {
    setFormError("");

    try {
      const twinId =
        createdTwinId ||
        (await saveBasicStep());

      await saveAppearanceStep(
        twinId
      );

      await saveVoiceStep(
        twinId
      );

      await saveKnowledgeStep(
        twinId
      );

      setSavingMessage(
        "Loading your AI Twin..."
      );

      await dispatch(
        fetchTwins()
      ).unwrap();

      localStorage.setItem(
        "hasTwin",
        "true"
      );

      navigate("/app/twin");
    } catch (creationError) {
      console.error(
        "FINALIZE TWIN ERROR:",
        creationError
      );

      setFormError(
        getErrorMessage(
          creationError
        )
      );
    } finally {
      setSavingMessage("");
    }
  };

  if (
    loading &&
    !initialized
  ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_380px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}

            {isPro
              ? "CREATE PRO AI TWIN"
              : "CREATE AI TWIN"}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
              isPro
                ? "bg-pink-500 text-white"
                : "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
            }`}
          >
            {isPro ? (
              <Crown className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}

            {isBusiness
              ? "BUSINESS PLAN"
              : isPro
              ? "PRO PLAN ACTIVE"
              : "FREE PLAN"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">
            Create and Train
          </span>{" "}
          Your AI Twin
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Create your AI Twin, upload its
          appearance, configure its voice
          and train it using your brand
          knowledge.
        </p>

        <div className="mt-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black">
                AI Twin usage
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {twins.length} created
                {Number.isFinite(
                  maxTwins
                )
                  ? ` out of ${maxTwins}`
                  : ""}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                canCreateTwin
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {canCreateTwin
                ? "Available"
                : "Limit reached"}
            </span>
          </div>
        </div>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Pro Features
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create more Twins and
                  unlock premium avatars,
                  voice samples and knowledge
                  sources.
                </p>
              </div>

              <button
                type="button"
                onClick={upgradeToPro}
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {(formError || error) && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
            {formError || error}
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(
            (
              {
                title,
                icon: Icon,
              },
              index
            ) => (
              <button
                type="button"
                key={title}
                disabled={creating}
                onClick={() => {
                  setFormError("");
                  setStep(index + 1);
                }}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${
                  step === index + 1
                    ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                    : "border-border bg-background text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-muted-foreground">
                      Step {index + 1}
                    </p>

                    <p className="text-sm font-black tracking-tight">
                      {title}
                    </p>
                  </div>
                </div>
              </button>
            )
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-background p-5 sm:p-6">
          {step === 1 && (
            <StepCard
              title="Basic Information"
              desc="Enter the identity and purpose of your AI Twin."
            >
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  label="AI Twin Name"
                  required
                >
                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Example: Ishaaq AI"
                    className={inputClass}
                  />
                </Field>

                <Field label="Brand Name">
                  <input
                    value={brandName}
                    onChange={(event) =>
                      setBrandName(
                        event.target.value
                      )
                    }
                    placeholder="Example: Twinn"
                    className={inputClass}
                  />
                </Field>

                <Field label="Industry">
                  <input
                    value={industry}
                    onChange={(event) =>
                      setIndustry(
                        event.target.value
                      )
                    }
                    placeholder="Example: E-commerce"
                    className={inputClass}
                  />
                </Field>

                <Field label="Target Audience">
                  <input
                    value={
                      targetAudience
                    }
                    onChange={(event) =>
                      setTargetAudience(
                        event.target.value
                      )
                    }
                    placeholder="Example: Online shoppers"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                label="Brand Description"
                required
                className="mt-4"
              >
                <textarea
                  value={
                    brandDescription
                  }
                  onChange={(event) =>
                    setBrandDescription(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe your brand, products, services and customers..."
                  className={inputClass}
                />
              </Field>

              <Field
                label="AI Twin Purpose"
                className="mt-4"
              >
                <textarea
                  value={purpose}
                  onChange={(event) =>
                    setPurpose(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Explain what the AI Twin should do..."
                  className={inputClass}
                />
              </Field>
            </StepCard>
          )}

          {step === 2 && (
            <StepCard
              title="Appearance"
              desc="Select a default avatar or upload your own image."
            >
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleAvatarUpload
                }
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  avatarInputRef.current?.click()
                }
                className="mt-5 flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-accent sm:p-10"
              >
                <Upload className="h-12 w-12 text-[var(--brand-pink)]" />

                <p className="mt-4 text-lg font-black tracking-tight">
                  Upload Avatar
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  JPG, PNG and WEBP,
                  maximum backend upload
                  limit applies.
                </p>
              </button>

              {avatarFile && (
                <SelectedFile
                  name={avatarFile.name}
                  onRemove={
                    removeAvatarUpload
                  }
                />
              )}

              <SectionTitle
                icon={ScanFace}
                title="Default Avatars"
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {avatars.map((item) => (
                  <ChoiceImage
                    key={item.name}
                    active={
                      !avatarFile &&
                      avatar === item.image
                    }
                    image={item.image}
                    title={item.name}
                    locked={
                      item.pro && !isPro
                    }
                    onClick={() =>
                      selectDefaultAvatar(
                        item
                      )
                    }
                  />
                ))}
              </div>

              <SectionTitle
                icon={Image}
                title="Backgrounds"
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {backgrounds.map(
                  (item) => (
                    <ChoiceImage
                      key={item.name}
                      active={
                        background ===
                        item.image
                      }
                      image={item.image}
                      title={item.name}
                      locked={
                        item.pro &&
                        !isPro
                      }
                      onClick={() => {
                        if (
                          item.pro &&
                          !isPro
                        ) {
                          upgradeToPro();
                          return;
                        }

                        setBackground(
                          item.image
                        );
                      }}
                    />
                  )
                )}
              </div>

              <SectionTitle
                icon={Shirt}
                title="Outfit Style"
              />

              <ButtonGrid
                items={outfits}
                selected={style}
                setSelected={setStyle}
                isPro={isPro}
                onLockedClick={
                  upgradeToPro
                }
              />

              <SectionTitle
                icon={Hand}
                title="Personality and Gesture"
              />

              <ButtonGrid
                items={gestures}
                selected={gesture}
                setSelected={setGesture}
                isPro={isPro}
                onLockedClick={
                  upgradeToPro
                }
              />
            </StepCard>
          )}

          {step === 3 && (
            <StepCard
              title="Voice Setup"
              desc="Configure the AI Twin voice and optional voice sample."
            >
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {voices.map((item) => {
                  const locked =
                    item.pro && !isPro;

                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        if (locked) {
                          upgradeToPro();
                          return;
                        }

                        setVoice(
                          item.name
                        );
                      }}
                      className={`relative rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
                        voice === item.name
                          ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                          : "border-border bg-card text-foreground hover:border-[var(--brand-pink)]"
                      }`}
                    >
                      {locked && (
                        <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                          PRO
                        </span>
                      )}

                      <Mic className="mb-3 h-5 w-5 text-[var(--brand-pink)]" />

                      <p className="font-black">
                        {item.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Field label="Language">
                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    {languages.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field label="Speed">
                  <input
                    type="number"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSpeed}
                    onChange={(event) =>
                      setVoiceSpeed(
                        Number(
                          event.target
                            .value
                        )
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Pitch">
                  <input
                    type="number"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voicePitch}
                    onChange={(event) =>
                      setVoicePitch(
                        Number(
                          event.target
                            .value
                        )
                      )
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <input
                ref={voiceInputRef}
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/ogg,audio/webm"
                onChange={
                  handleVoiceUpload
                }
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  if (!isPro) {
                    upgradeToPro();
                    return;
                  }

                  voiceInputRef.current?.click();
                }}
                className="mt-6 flex items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 py-3 text-sm font-bold text-[var(--brand-pink)]"
              >
                {isPro ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}

                {isPro
                  ? "Upload Voice Sample"
                  : "Voice Sample - Pro"}
              </button>

              {voiceSample && (
                <SelectedFile
                  name={
                    voiceSample.name
                  }
                  onRemove={
                    removeVoiceSample
                  }
                />
              )}
            </StepCard>
          )}

          {step === 4 && (
            <StepCard
              title="Lip Sync Setup"
              desc="Preview the selected appearance and test script."
            >
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-border bg-black">
                  {lipSyncVideoUrl ? (
                    <video
                      src={
                        lipSyncVideoUrl
                      }
                      controls
                      autoPlay
                      playsInline
                      className="h-80 w-full object-contain"
                    />
                  ) : (
                    <img
                      src={
                        displayedAvatar
                      }
                      alt="Lip sync preview"
                      className="h-80 w-full object-contain"
                    />
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-black">
                    Test Script
                  </h3>

                  <textarea
                    value={lipScript}
                    onChange={(event) =>
                      setLipScript(
                        event.target.value
                      )
                    }
                    rows={8}
                    className={`${inputClass} mt-4`}
                  />

                  <button
                    type="button"
                    disabled={
                      lipSyncLoading ||
                      !lipScript.trim()
                    }
                    onClick={
                      generateLipSyncPreview
                    }
                    className="brand-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {lipSyncLoading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}

                    {lipSyncLoading
                      ? `Generating ${lipSyncStatus}...`
                      : lipSyncVideoUrl
                      ? "Regenerate Preview"
                      : "Generate Lip-Sync Preview"}
                  </button>

                  {lipSyncAudioUrl && (
                    <audio
                      src={
                        lipSyncAudioUrl
                      }
                      controls
                      className="mt-4 w-full"
                    />
                  )}

                  {createdTwinId && (
                    <p className="mt-3 break-all text-xs text-muted-foreground">
                      Draft Twin ID:{" "}
                      {createdTwinId}
                    </p>
                  )}
                </div>
              </div>
            </StepCard>
          )}

          {step === 5 && (
            <StepCard
              title="Train Your AI"
              desc="Provide text, upload a document or import a website."
            >
              <input
                ref={
                  knowledgeInputRef
                }
                type="file"
                accept=".pdf,.docx,.txt,.csv,application/pdf,text/plain,text/csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={
                  handleKnowledgeUpload
                }
                className="hidden"
              />

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <TrainingCard
                  icon={Upload}
                  title="Upload Document"
                  desc="PDF, DOCX, TXT or CSV"
                  locked={!isPro}
                  onClick={() => {
                    if (!isPro) {
                      upgradeToPro();
                      return;
                    }

                    knowledgeInputRef.current?.click();
                  }}
                />

                <TrainingCard
                  icon={Link2}
                  title="Website Import"
                  desc="Import readable website content"
                  locked={!isPro}
                  onClick={() => {
                    if (!isPro) {
                      upgradeToPro();
                    }
                  }}
                />

                <TrainingCard
                  icon={Globe}
                  title="Text Knowledge"
                  desc="Brand, FAQ, shipping and policy details"
                  locked={false}
                />

                <TrainingCard
                  icon={Volume2}
                  title="AI Embeddings"
                  desc="Knowledge is embedded automatically"
                  locked={false}
                />
              </div>

              {knowledgeFile && (
                <SelectedFile
                  name={
                    knowledgeFile.name
                  }
                  onRemove={
                    removeKnowledgeFile
                  }
                />
              )}

              {isPro && (
                <Field
                  label="Website URL"
                  className="mt-5"
                >
                  <input
                    type="url"
                    value={websiteUrl}
                    disabled={
                      Boolean(
                        knowledgeFile
                      )
                    }
                    onChange={(event) => {
                      setWebsiteUrl(
                        event.target
                          .value
                      );

                      if (
                        event.target
                          .value
                      ) {
                        removeKnowledgeFile();
                      }
                    }}
                    placeholder="https://yourbrand.com"
                    className={inputClass}
                  />
                </Field>
              )}

              <Field
                label="Training Text"
                className="mt-5"
              >
                <textarea
                  value={trainingText}
                  disabled={
                    Boolean(
                      knowledgeFile
                    ) ||
                    Boolean(
                      websiteUrl.trim()
                    )
                  }
                  onChange={(event) =>
                    setTrainingText(
                      event.target.value
                    )
                  }
                  rows={9}
                  placeholder="Enter product information, FAQs, brand details, shipping policy, refund policy and customer support information..."
                  className={inputClass}
                />
              </Field>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Only one primary source is
                processed during creation:
                document, website or text.
                Additional knowledge can be
                uploaded after creating the
                Twin.
              </p>
            </StepCard>
          )}

          {step === 6 && (
            <StepCard
              title="Preview Your AI Twin"
              desc="Review all settings before saving them to the backend."
            >
              <div className="mt-6 grid gap-6">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
                  <img
                    src={background}
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/20" />

                  <img
                    src={
                      displayedAvatar
                    }
                    alt="AI Twin"
                    className="relative z-10 h-[480px] w-full object-contain"
                  />

                  <span className="absolute left-4 top-4 z-20 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Ready
                  </span>
                </div>

                <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                  <h2 className="text-2xl font-black brand-text">
                    {name ||
                      "Your AI Twin"}
                  </h2>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Info
                      label="Plan"
                      value={
                        isBusiness
                          ? "Business"
                          : isPro
                          ? "Pro"
                          : "Free"
                      }
                    />

                    <Info
                      label="Brand"
                      value={
                        brandName ||
                        "Not provided"
                      }
                    />

                    <Info
                      label="Industry"
                      value={
                        industry ||
                        "General"
                      }
                    />

                    <Info
                      label="Background"
                      value={
                        backgroundName
                      }
                    />

                    <Info
                      label="Outfit"
                      value={style}
                    />

                    <Info
                      label="Personality"
                      value={gesture}
                    />

                    <Info
                      label="Voice"
                      value={voice}
                    />

                    <Info
                      label="Language"
                      value={language}
                    />

                    <Info
                      label="Training"
                      value={
                        knowledgeFile
                          ? knowledgeFile.name
                          : websiteUrl.trim()
                          ? "Website"
                          : trainingText.trim()
                          ? "Text added"
                          : "Brand information"
                      }
                    />
                  </div>
                </div>
              </div>
            </StepCard>
          )}
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            disabled={
              step === 1 ||
              creating
            }
            onClick={() => {
              setFormError("");

              setStep((current) =>
                Math.max(
                  1,
                  current - 1
                )
              );
            }}
            className="rounded-[5px] border-2 border-[var(--brand-pink)] px-6 py-3 text-sm font-bold text-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step < 6 ? (
            <button
              type="button"
              disabled={creating}
              onClick={goNext}
              className="brand-gradient flex items-center gap-2 rounded-[5px] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : canCreateTwin ? (
            <button
              type="button"
              disabled={creating}
              onClick={finishCreate}
              className="brand-gradient flex min-w-[200px] items-center justify-center gap-2 rounded-[5px] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}

              {creating
                ? savingMessage ||
                  "Saving..."
                : "Finalize & Save Twin"}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-[5px] border border-border bg-muted px-6 py-3 text-sm font-bold text-muted-foreground"
            >
              {isPro
                ? "Maximum Twins Created"
                : "Twin Already Created"}
            </button>
          )}
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black brand-text">
          AI Twin Live Preview
        </h2>

        <div className="relative mt-5 overflow-hidden rounded-3xl border border-border">
          <img
            src={background}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />

          <img
            src={displayedAvatar}
            alt="AI Twin"
            className="relative z-10 h-96 w-full object-contain"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background p-4">
          <p className="text-lg font-black">
            Hi, I&apos;m{" "}
            {name ||
              "Your AI Twin"}
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            I will represent{" "}
            {brandName ||
              "your brand"}{" "}
            and answer customer
            questions using your
            uploaded knowledge.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <Info
            label="Twins"
            value={`${twins.length}${
              Number.isFinite(
                maxTwins
              )
                ? ` / ${maxTwins}`
                : ""
            }`}
          />

          <Info
            label="Background"
            value={backgroundName}
          />

          <Info
            label="Style"
            value={style}
          />

          <Info
            label="Voice"
            value={voice}
          />

          <Info
            label="Language"
            value={language}
          />

          <Info
            label="Personality"
            value={gesture}
          />
        </div>
      </aside>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const inputClass =
  "w-full rounded-[5px] border border-border bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-pink-500/20";

function StepCard({
  title,
  desc,
  children,
}) {
  return (
    <div>
      <h2 className="text-xl font-black tracking-tight brand-text">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {desc}
      </p>

      {children}
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}) {
  return (
    <label
      className={`block ${className}`}
    >
      <span className="mb-2 block text-sm font-black">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function SelectedFile({
  name,
  onRemove,
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-900/30 dark:bg-green-900/10">
      <span className="truncate text-sm font-bold text-green-700 dark:text-green-300">
        {name}
      </span>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-lg p-1 text-red-500 hover:bg-red-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function TrainingCard({
  icon: Icon,
  title,
  desc,
  locked,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-2xl border-2 border-dashed border-border bg-card p-6 text-left transition hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-white/10"
    >
      {locked && (
        <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
          PRO
        </span>
      )}

      {locked ? (
        <Lock className="h-7 w-7 text-[var(--brand-pink)]" />
      ) : (
        <Icon className="h-7 w-7 text-[var(--brand-pink)]" />
      )}

      <h3 className="mt-4 text-base font-black">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {locked
          ? "Unlock with Pro plan"
          : desc}
      </p>
    </button>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-sm font-black">
        {value}
      </span>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}) {
  return (
    <h3 className="mb-3 mt-6 flex items-center gap-2 text-base font-black">
      {Icon && (
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
      )}

      {title}
    </h3>
  );
}

function ChoiceImage({
  image,
  title,
  active,
  onClick,
  locked,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border p-3 text-left transition hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 shadow-sm dark:bg-white/10"
          : "border-border bg-card"
      }`}
    >
      {locked && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
          PRO
        </span>
      )}

      <div
        className={
          locked ? "opacity-60" : ""
        }
      >
        <img
          src={image}
          alt={title}
          className="h-28 w-full rounded-xl object-cover"
        />

        <p className="mt-3 text-sm font-black">
          {title}
        </p>
      </div>
    </button>
  );
}

function ButtonGrid({
  items,
  selected,
  setSelected,
  isPro,
  onLockedClick,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const locked =
          item.pro && !isPro;

        return (
          <button
            type="button"
            key={item.name}
            onClick={() => {
              if (locked) {
                onLockedClick();
                return;
              }

              setSelected(
                item.name
              );
            }}
            className={`relative rounded-[5px] border px-4 py-3 text-sm font-bold transition ${
              selected === item.name
                ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                : "border-border bg-card hover:border-[var(--brand-pink)]"
            }`}
          >
            {locked && (
              <Lock className="mr-2 inline h-3 w-3" />
            )}

            {item.name}
          </button>
        );
      })}
    </div>
  );
}