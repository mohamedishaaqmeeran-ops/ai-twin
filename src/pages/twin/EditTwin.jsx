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
  useSearchParams,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Crown,
  FileText,
  Languages,
  LoaderCircle,
  Lock,
  Mic,
  Save,
  ScanFace,
  Shirt,
  Sparkles,
  Upload,
  UserCircle2,
  Volume2,
  X,
} from "lucide-react";

import {
  fetchTwins,
  saveTwinAppearance,
  saveTwinKnowledge,
  saveTwinVoice,
} from "../../features/twin/twinSlice";

/* =========================================================
   API
========================================================= */

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

const API_URL =
  RAW_API_URL.replace(/\/$/, "");

const readResponse = async (
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
    name: "Studio",
    image: "/images/ff.png",
    pro: false,
  },
  {
    name: "Pink Store",
    image: "/images/hh.png",
    pro: false,
  },
  {
    name: "Luxury",
    image: "/images/gg.png",
    pro: true,
  },
  {
    name: "Live Stage",
    image: "/images/ee.png",
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
  {
    name: "English",
    pro: false,
  },
  {
    name: "Tamil",
    pro: false,
  },
  {
    name: "Hindi",
    pro: false,
  },
  {
    name: "Malayalam",
    pro: false,
  },
  {
    name: "Arabic",
    pro: false,
  },
];

const proLanguages = [
  ...freeLanguages,
  {
    name: "Telugu",
    pro: true,
  },
  {
    name: "Kannada",
    pro: true,
  },
  {
    name: "French",
    pro: true,
  },
  {
    name: "German",
    pro: true,
  },
  {
    name: "Spanish",
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

/* =========================================================
   HELPERS
========================================================= */

const normalizeVoiceName = (
  twin
) => {
  if (
    typeof twin?.voice ===
    "string"
  ) {
    return twin.voice;
  }

  return (
    twin?.voice?.voiceType ||
    twin?.voice?.voiceName ||
    twin?.voiceName ||
    "Warm Female"
  );
};

const getBackgroundImage = (
  backgroundValue
) => {
  const match =
    backgrounds.find(
      (item) =>
        item.name ===
          backgroundValue ||
        item.image ===
          backgroundValue
    );

  return (
    match?.image ||
    "/images/ff.png"
  );
};

const getBackgroundName = (
  backgroundImage
) => {
  return (
    backgrounds.find(
      (item) =>
        item.image ===
        backgroundImage
    )?.name || "Studio"
  );
};

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
      "Unable to load the selected avatar image."
    );
  }

  const blob =
    await response.blob();

  return new File(
    [blob],
    fileName,
    {
      type:
        blob.type ||
        "image/png",
    }
  );
};

/* =========================================================
   PAGE
========================================================= */

export default function EditTwin() {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const [
    searchParams,
  ] = useSearchParams();

  const avatarInputRef =
    useRef(null);

  const voiceInputRef =
    useRef(null);

  const {
    user,
  } = useSelector(
    (state) => state.auth
  );

  const {
    twins = [],
    loading,
    initialized,
  } = useSelector(
    (state) => state.twin
  );

  const plan = String(
    user?.plan || "free"
  ).toLowerCase();

  const isPro =
    plan === "pro" ||
    plan === "business";

  const requestedTwinId =
    searchParams.get("twinId");

  const [
    selectedTwinId,
    setSelectedTwinId,
  ] = useState(
    requestedTwinId || ""
  );

  const [
    name,
    setName,
  ] = useState("");

  const [
    brandName,
    setBrandName,
  ] = useState("");

  const [
    brandDescription,
    setBrandDescription,
  ] = useState("");

  const [
    industry,
    setIndustry,
  ] = useState("");

  const [
    purpose,
    setPurpose,
  ] = useState("");

  const [
    targetAudience,
    setTargetAudience,
  ] = useState("");

  const [
    avatar,
    setAvatar,
  ] = useState(
    "/images/bb.png"
  );

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
  ] = useState(
    "/images/ff.png"
  );

  const [
    voice,
    setVoice,
  ] = useState(
    "Warm Female"
  );

  const [
    language,
    setLanguage,
  ] = useState("English");

  const [
    style,
    setStyle,
  ] = useState(
    "Professional"
  );

  const [
    gesture,
    setGesture,
  ] = useState("Friendly");

  const [
    voiceSpeed,
    setVoiceSpeed,
  ] = useState(1);

  const [
    voicePitch,
    setVoicePitch,
  ] = useState(1);

  const [
    voiceSample,
    setVoiceSample,
  ] = useState(null);

  const [
    trainingText,
    setTrainingText,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    savingMessage,
    setSavingMessage,
  ] = useState("");

  const [
    saved,
    setSaved,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");

  const languages =
    isPro
      ? proLanguages
      : freeLanguages;

  const selectedTwin =
    useMemo(() => {
      return (
        twins.find(
          (twin) =>
            String(twin._id) ===
            String(
              selectedTwinId
            )
        ) || null
      );
    }, [
      twins,
      selectedTwinId,
    ]);

  const displayedAvatar =
    avatarPreview ||
    avatar;

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 text-foreground placeholder:text-muted-foreground outline-none transition-all duration-300 focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-pink-500/20";

  /* =======================================================
     LOAD TWINS
  ======================================================= */

  useEffect(() => {
    dispatch(fetchTwins());
  }, [dispatch]);

  useEffect(() => {
    if (
      !selectedTwinId &&
      twins.length > 0
    ) {
      setSelectedTwinId(
        twins[0]._id
      );
    }
  }, [
    selectedTwinId,
    twins,
  ]);

  /* =======================================================
     LOAD SELECTED TWIN INTO FORM
  ======================================================= */

  useEffect(() => {
    if (!selectedTwin) {
      return;
    }

    setName(
      selectedTwin.name ||
        "My AI Twin"
    );

    setBrandName(
      selectedTwin.brandName ||
        selectedTwin.brand ||
        "My Brand"
    );

    setBrandDescription(
      selectedTwin.brandDescription ||
        ""
    );

    setIndustry(
      selectedTwin.industry ||
        "General"
    );

    setPurpose(
      selectedTwin.purpose ||
        "Live-commerce selling and customer support"
    );

    setTargetAudience(
      selectedTwin.targetAudience ||
        ""
    );

    setAvatar(
      selectedTwin.appearance
        ?.avatarUrl ||
        selectedTwin.image ||
        "/images/bb.png"
    );

    setBackground(
      getBackgroundImage(
        selectedTwin.appearance
          ?.background ||
          selectedTwin.background
      )
    );

    setVoice(
      normalizeVoiceName(
        selectedTwin
      )
    );

    setLanguage(
      selectedTwin.voice
        ?.language ||
        selectedTwin
          .primaryLanguage ||
        selectedTwin.language ||
        "English"
    );

    setStyle(
      selectedTwin.appearance
        ?.style ||
        selectedTwin.style ||
        "Professional"
    );

    setGesture(
      selectedTwin.appearance
        ?.gesture ||
        selectedTwin
          .personality ||
        selectedTwin.gesture ||
        "Friendly"
    );

    setVoiceSpeed(
      Number(
        selectedTwin.voice
          ?.speed || 1
      )
    );

    setVoicePitch(
      Number(
        selectedTwin.voice
          ?.pitch || 1
      )
    );

    setTrainingText("");

    setAvatarFile(null);
    setAvatarPreview("");
    setVoiceSample(null);
    setSaved(false);
    setPageError("");
  }, [selectedTwin]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        );
      }
    };
  }, [avatarPreview]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  const handleAvatarUpload = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setPageError(
        "Avatar must be JPG, PNG or WEBP."
      );

      event.target.value =
        "";

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

    setPageError("");
  };

  const removeAvatarUpload =
    () => {
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

  const selectDefaultAvatar = (
    item
  ) => {
    if (
      item.pro &&
      !isPro
    ) {
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
    setPageError("");
  };

  const removeVoiceSample =
    () => {
      setVoiceSample(null);

      if (
        voiceInputRef.current
      ) {
        voiceInputRef.current.value =
          "";
      }
    };

  /* =======================================================
     UPDATE BASIC INFO
  ======================================================= */

  const updateBasicInfo =
    async () => {
      const response = await fetch(
        `${API_URL}/api/twin/${selectedTwinId}`,
        {
          method: "PATCH",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              name.trim(),

            brandName:
              brandName.trim(),

            brandDescription:
              brandDescription.trim(),

            industry:
              industry.trim() ||
              "General",

            purpose:
              purpose.trim(),

            targetAudience:
              targetAudience.trim(),

            personality:
              gesture,

            primaryLanguage:
              language,
          }),
        }
      );

      return readResponse(
        response
      );
    };

  /* =======================================================
     SAVE
  ======================================================= */

  const saveTwin =
    async () => {
      setPageError("");
      setSaved(false);

      if (!selectedTwinId) {
        setPageError(
          "Select an AI Twin."
        );

        return;
      }

      if (!name.trim()) {
        setPageError(
          "AI Twin name is required."
        );

        return;
      }

      if (
        !brandDescription.trim()
      ) {
        setPageError(
          "Brand description is required."
        );

        return;
      }

      if (
        voiceSpeed < 0.5 ||
        voiceSpeed > 2
      ) {
        setPageError(
          "Voice speed must be between 0.5 and 2."
        );

        return;
      }

      if (
        voicePitch < 0.5 ||
        voicePitch > 2
      ) {
        setPageError(
          "Voice pitch must be between 0.5 and 2."
        );

        return;
      }

      try {
        setSaving(true);

        /*
         * 1. BASIC INFO
         */

        setSavingMessage(
          "Updating basic information..."
        );

        await updateBasicInfo();

        /*
         * 2. APPEARANCE
         */

        setSavingMessage(
          "Updating appearance..."
        );

        let selectedAvatarFile =
          avatarFile;

        const existingAvatarUrl =
          selectedTwin
            ?.appearance
            ?.avatarUrl ||
          selectedTwin?.image ||
          "";

        const avatarChanged =
          avatarFile ||
          (
            avatar &&
            avatar !==
              existingAvatarUrl
          );

        if (
          !selectedAvatarFile &&
          avatarChanged &&
          avatar.startsWith("/")
        ) {
          selectedAvatarFile =
            await publicImageToFile(
              avatar,
              avatar
                .split("/")
                .pop() ||
                "avatar.png"
            );
        }

        await dispatch(
          saveTwinAppearance({
            twinId:
              selectedTwinId,

            avatarFile:
              selectedAvatarFile,

            avatarUrl:
              selectedAvatarFile
                ? ""
                : avatar,

            style,

            background:
              getBackgroundName(
                background
              ),

            clothingStyle:
              style,

            gesture,
          })
        ).unwrap();

        /*
         * 3. VOICE
         */

        setSavingMessage(
          "Updating voice..."
        );

        await dispatch(
          saveTwinVoice({
            twinId:
              selectedTwinId,

            voiceType:
              voice,

            language,

            speed:
              voiceSpeed,

            pitch:
              voicePitch,

            sampleFile:
              voiceSample,
          })
        ).unwrap();

        /*
         * 4. OPTIONAL GENERAL KNOWLEDGE
         */

        if (
          trainingText.trim()
        ) {
          setSavingMessage(
            "Updating general knowledge..."
          );

          await dispatch(
            saveTwinKnowledge({
              twinId:
                selectedTwinId,

              title:
                `${name.trim()} Updated Knowledge`,

              text:
                trainingText.trim(),

              websiteUrl: "",

              documentFile:
                null,

              replaceExisting:
                false,
            })
          ).unwrap();
        }

        /*
         * 5. REFRESH
         */

        setSavingMessage(
          "Refreshing AI Twin..."
        );

        await dispatch(
          fetchTwins()
        ).unwrap();

        setSaved(true);

        setTimeout(() => {
          navigate(
            "/app/twin"
          );
        }, 1200);
      } catch (error) {
        console.error(
          "UPDATE TWIN ERROR:",
          error
        );

        setPageError(
          typeof error ===
            "string"
            ? error
            : error.message ||
                "Unable to update AI Twin."
        );
      } finally {
        setSaving(false);
        setSavingMessage("");
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading &&
    !initialized
  ) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
      </div>
    );
  }

  if (
    initialized &&
    twins.length === 0
  ) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <ScanFace className="mx-auto h-12 w-12 text-[var(--brand-pink)]" />

        <h1 className="mt-4 text-2xl font-black">
          No AI Twin Found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create an AI Twin before
          opening the edit page.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/twin/create"
            )
          }
          className="brand-gradient mt-5 rounded-[5px] px-6 py-3 text-sm font-bold text-white"
        >
          Create AI Twin
        </button>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="grid gap-6 bg-background text-foreground transition-colors duration-300 xl:grid-cols-[1fr_400px]">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/twin"
            )
          }
          className="mb-5 flex items-center gap-2 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Twin
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}

            {isPro
              ? "EDIT PRO AI TWIN"
              : "EDIT AI TWIN"}
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

            {isPro
              ? "PRO PLAN ACTIVE"
              : "FREE PLAN"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Edit Your{" "}

          <span className="brand-text">
            {isPro
              ? "Pro AI Twin"
              : "AI Twin"}
          </span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Update the Twin identity,
          appearance, voice and general
          knowledge.
        </p>

        {twins.length > 1 && (
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black">
              Select AI Twin
            </span>

            <select
              value={
                selectedTwinId
              }
              disabled={saving}
              onChange={(event) =>
                setSelectedTwinId(
                  event.target.value
                )
              }
              className={inputClass}
            >
              {twins.map(
                (twin) => (
                  <option
                    key={twin._id}
                    value={twin._id}
                  >
                    {twin.name}
                  </option>
                )
              )}
            </select>
          </label>
        )}

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Pro Editing
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Premium avatars,
                  advanced voices and more
                  languages.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  upgradeToPro
                }
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {pageError && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <span>
              {pageError}
            </span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {/* BASIC INFORMATION */}

          <Card
            icon={UserCircle2}
            title="Basic Information"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="AI Twin Name"
                icon={UserCircle2}
              >
                <input
                  value={name}
                  disabled={saving}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="My AI Twin"
                />
              </Field>

              <Field
                label="Brand Name"
                icon={Sparkles}
              >
                <input
                  value={brandName}
                  disabled={saving}
                  onChange={(event) =>
                    setBrandName(
                      event.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="My Brand"
                />
              </Field>

              <Field
                label="Industry"
                icon={FileText}
              >
                <input
                  value={industry}
                  disabled={saving}
                  onChange={(event) =>
                    setIndustry(
                      event.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="E-commerce"
                />
              </Field>

              <Field
                label="Target Audience"
                icon={UserCircle2}
              >
                <input
                  value={
                    targetAudience
                  }
                  disabled={saving}
                  onChange={(event) =>
                    setTargetAudience(
                      event.target.value
                    )
                  }
                  className={inputClass}
                  placeholder="Online shoppers"
                />
              </Field>
            </div>

            <Field
              label="Brand Description"
              icon={FileText}
            >
              <textarea
                value={
                  brandDescription
                }
                disabled={saving}
                onChange={(event) =>
                  setBrandDescription(
                    event.target.value
                  )
                }
                rows={5}
                className={`${inputClass} resize-none rounded-2xl p-4`}
                placeholder="Describe the brand, products and audience..."
              />
            </Field>

            <Field
              label="AI Twin Purpose"
              icon={BadgeCheck}
            >
              <textarea
                value={purpose}
                disabled={saving}
                onChange={(event) =>
                  setPurpose(
                    event.target.value
                  )
                }
                rows={3}
                className={`${inputClass} resize-none rounded-2xl p-4`}
                placeholder="Explain what the Twin should do..."
              />
            </Field>
          </Card>

          {/* APPEARANCE */}

          <Card
            icon={ScanFace}
            title="Avatar Appearance"
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
              disabled={saving}
              onClick={() => {
                if (!isPro) {
                  upgradeToPro();
                  return;
                }

                avatarInputRef.current?.click();
              }}
              className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-border bg-background p-6 text-center transition hover:border-[var(--brand-pink)] disabled:opacity-50"
            >
              {isPro ? (
                <Upload className="mx-auto h-8 w-8 text-[var(--brand-pink)]" />
              ) : (
                <Lock className="mx-auto h-8 w-8 text-[var(--brand-pink)]" />
              )}

              <p className="mt-3 text-sm font-black tracking-tight text-foreground">
                {isPro
                  ? "Upload New Avatar Image"
                  : "Custom Avatar Upload - Pro"}
              </p>

              <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                JPG, PNG or WEBP
              </p>
            </button>

            {avatarFile && (
              <SelectedFile
                name={
                  avatarFile.name
                }
                onRemove={
                  removeAvatarUpload
                }
              />
            )}

            <SectionTitle
              icon={ScanFace}
              title="Choose Avatar"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {avatars.map(
                (item) => (
                  <ChoiceImage
                    key={item.name}
                    active={
                      !avatarFile &&
                      avatar ===
                        item.image
                    }
                    image={
                      item.image
                    }
                    title={
                      item.name
                    }
                    locked={
                      item.pro &&
                      !isPro
                    }
                    onClick={() =>
                      selectDefaultAvatar(
                        item
                      )
                    }
                  />
                )
              )}
            </div>

            <SectionTitle
              icon={Camera}
              title="Choose Background"
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
                    image={
                      item.image
                    }
                    title={
                      item.name
                    }
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
          </Card>

          {/* VOICE */}

          <Card
            icon={Mic}
            title="Voice, Language and Style"
          >
            <SectionTitle
              icon={Volume2}
              title="Voice"
            />

            <ButtonGrid
              items={voices}
              selected={voice}
              setSelected={
                setVoice
              }
              isPro={isPro}
              onLockedClick={
                upgradeToPro
              }
            />

            <SectionTitle
              icon={Languages}
              title="AI Language"
            />

            <ButtonGrid
              items={languages}
              selected={language}
              setSelected={
                setLanguage
              }
              isPro={isPro}
              onLockedClick={
                upgradeToPro
              }
            />

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field
                label="Voice Speed"
                icon={Volume2}
              >
                <input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={
                    voiceSpeed
                  }
                  disabled={saving}
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

              <Field
                label="Voice Pitch"
                icon={Mic}
              >
                <input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={
                    voicePitch
                  }
                  disabled={saving}
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
              disabled={saving}
              onClick={() => {
                if (!isPro) {
                  upgradeToPro();
                  return;
                }

                voiceInputRef.current?.click();
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] disabled:opacity-50"
            >
              {isPro ? (
                <Mic className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}

              {isPro
                ? "Upload New Voice Sample"
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

            <SectionTitle
              icon={Shirt}
              title="Outfit Style"
            />

            <ButtonGrid
              items={outfits}
              selected={style}
              setSelected={
                setStyle
              }
              isPro={isPro}
              onLockedClick={
                upgradeToPro
              }
            />

            <SectionTitle
              icon={BadgeCheck}
              title="Gesture Style"
            />

            <ButtonGrid
              items={gestures}
              selected={gesture}
              setSelected={
                setGesture
              }
              isPro={isPro}
              onLockedClick={
                upgradeToPro
              }
            />
          </Card>

          {/* GENERAL KNOWLEDGE */}

          <Card
            icon={FileText}
            title="Additional General Knowledge"
          >
            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              This appends new general
              brand knowledge. Product
              knowledge should be updated
              from the Train Twin page.
            </p>

            <textarea
              value={trainingText}
              disabled={saving}
              onChange={(event) =>
                setTrainingText(
                  event.target.value
                )
              }
              rows={7}
              className={`${inputClass} resize-none rounded-2xl p-4`}
              placeholder="Enter new brand FAQs, policies or support instructions..."
            />
          </Card>

          <button
            type="button"
            disabled={saving}
            onClick={saveTwin}
            className="brand-gradient flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving
              ? savingMessage ||
                "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </section>

      {/* LIVE PREVIEW */}

      <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-black tracking-tight brand-text">
          Live Preview
        </h2>

        <div className="relative mt-5 overflow-hidden rounded-3xl border border-border bg-background">
          <img
            src={background}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-black/10" />

          <img
            src={
              displayedAvatar
            }
            alt="AI Twin"
            className="relative z-10 mx-auto h-96 w-full object-contain"
          />

          {isPro && (
            <span className="absolute right-3 top-3 z-20 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
              PRO
            </span>
          )}
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-background p-5 shadow-sm">
          <p className="text-lg font-black leading-tight tracking-tight text-foreground">
            {name ||
              "My AI Twin"}
          </p>

          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {brandName ||
              "My Brand"}
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 dark:bg-emerald-900/20">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {selectedTwin
                ?.status ||
                "Active"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <Info
              label="Plan"
              value={
                isPro
                  ? "Pro"
                  : "Free"
              }
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
              label="Style"
              value={style}
            />

            <Info
              label="Gesture"
              value={gesture}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/app/twin/test?twinId=${selectedTwinId}`
            )
          }
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
        >
          <BadgeCheck className="h-4 w-4" />
          Test Twin
        </button>

        {saved && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            AI Twin updated successfully
          </div>
        )}
      </aside>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function Card({
  icon: Icon,
  title,
  children,
}) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-5 w-5" />
        </div>

        <h2 className="text-xl font-black tracking-tight brand-text">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
        {Icon && (
          <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        )}

        {label}
      </label>

      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}) {
  return (
    <div className="mb-4 mt-6 flex items-center gap-2">
      <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

      <h3 className="text-base font-black tracking-tight text-foreground">
        {title}
      </h3>
    </div>
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
      className={`relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 dark:bg-white/10"
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
          locked
            ? "opacity-60"
            : ""
        }
      >
        <img
          src={image}
          alt={title}
          className="h-32 w-full rounded-xl object-cover"
        />

        <p className="mt-3 text-sm font-black tracking-tight text-foreground">
          {title}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            {active
              ? "Selected"
              : locked
              ? "Pro only"
              : "Click to select"}
          </p>

          {active && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
        </div>
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
          item.pro &&
          !isPro;

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
            className={`rounded-[5px] border px-4 py-3 text-sm font-bold tracking-wide transition ${
              selected ===
              item.name
                ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
                : "border-border bg-card text-foreground hover:border-[var(--brand-pink)]"
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

function Info({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-3">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-sm font-black tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}