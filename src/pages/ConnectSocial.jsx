import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Youtube,
  Facebook,
  Instagram,
  Music2,
  CheckCircle2,
  Radio,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Crown,
  Lock,
  X,
  ExternalLink,
  UserRound,
  Twitch,
  Twitter,
  Linkedin,
  RadioTower,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchConnections,
  disconnectSocial,
  saveRTMPConnection,
  clearSocialError,
} from "../features/social/socialSlice";

import {
  connectAPI,
} from "../features/social/socialAPI";

/* =========================================================
   SOCIAL PLATFORM CONFIGURATION
========================================================= */

const socialData = [
  {
    id: "instagram",
    name: "Instagram",
    color:
      "bg-pink-50 dark:bg-white/10",
    icon: Instagram,
    defaultUsername:
      "@instagram",
    pro: false,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://www.instagram.com/",
    defaultRtmpUrl: "",
  },
  {
    id: "facebook",
    name: "Facebook",
    color:
      "bg-blue-50 dark:bg-white/10",
    icon: Facebook,
    defaultUsername:
      "Facebook Page",
    pro: true,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://www.facebook.com/live/producer",
    defaultRtmpUrl: "",
  },
  {
    id: "youtube",
    name: "YouTube",
    color:
      "bg-red-50 dark:bg-white/10",
    icon: Youtube,
    defaultUsername:
      "YouTube Channel",
    pro: true,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://studio.youtube.com/",
    defaultRtmpUrl: "",
  },
 {
  id:
    "tiktok",

  name:
    "TikTok",

  color:
    "bg-gray-100 dark:bg-white/10",

  icon:
    Music2,

  defaultUsername:
    "@tiktok",

  pro:
    true,

  connectionType:
    "rtmp",

  dashboardUrl:
    "https://www.tiktok.com/studio/download",

  defaultRtmpUrl:
    "",
},
  {
    id: "linkedin",
    name: "LinkedIn",
    color:
      "bg-blue-50 dark:bg-white/10",
    icon: Linkedin,
    defaultUsername:
      "LinkedIn Profile",
    pro: true,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://www.linkedin.com/video/golive/manage/",
    defaultRtmpUrl: "",
  },
  {
    id: "rumble",
    name: "Rumble",
    color:
      "bg-green-50 dark:bg-white/10",
    icon: RadioTower,
    defaultUsername:
      "Rumble Channel",
    pro: true,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://rumble.com/account/livestreams",
    defaultRtmpUrl:
      "rtmp://rtmp.rumble.com/live",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    color:
      "bg-sky-50 dark:bg-white/10",
    icon: Twitter,
    defaultUsername:
      "@twitter",
    pro: true,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://studio.x.com/producer",
    defaultRtmpUrl: "",
  },
  {
    id: "twitch",
    name: "Twitch",
    color:
      "bg-purple-50 dark:bg-white/10",
    icon: Twitch,
    defaultUsername:
      "Twitch Channel",
    pro: true,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://dashboard.twitch.tv/settings/stream",
    defaultRtmpUrl:
      "rtmp://live.twitch.tv/app",
  },
  {
    id: "kick",
    name: "Kick",
    color:
      "bg-lime-50 dark:bg-white/10",
    icon: Zap,
    defaultUsername:
      "Kick Channel",
    pro: true,
    connectionType:
      "rtmp",
    dashboardUrl:
      "https://kick.com/dashboard/settings/stream",
    defaultRtmpUrl: "",
  },
];

/* =========================================================
   NORMALIZE PLATFORM
========================================================= */

const normalizePlatform = (
  platform = ""
) => {
  return String(platform)
    .trim()
    .toLowerCase();
};

/* =========================================================
   GET ACCOUNT DISPLAY NAME
========================================================= */

const getAccountDisplayName = (
  account,
  defaultUsername
) => {
  if (!account) {
    return defaultUsername;
  }

  const platform = normalizePlatform(
    account.platform
  );

  if (platform === "youtube") {
    return (
      account.youtubeChannelTitle ||
      account.name ||
      account.username ||
      "YouTube Channel"
    );
  }

  if (platform === "facebook") {
    return (
      account.pageName ||
      account.name ||
      account.username ||
      "Facebook Page"
    );
  }

  if (platform === "instagram") {
    const username =
      account.username ||
      account.instagramUsername ||
      account.platformUsername ||
      account.metadata?.username ||
      "";

    if (username) {
      return username.startsWith("@")
        ? username
        : `@${username}`;
    }

    return (
      account.name ||
      account.pageName ||
      "Instagram Account"
    );
  }

  if (platform === "linkedin") {
    return (
      account.linkedinName ||
      account.name ||
      account.username ||
      account.metadata?.name ||
      "LinkedIn Profile"
    );
  }

  if (
    [
      "tiktok",
      "rumble",
      "twitter",
      "twitch",
      "kick",
    ].includes(platform)
  ) {
    return (
      account.username ||
      account.name ||
      account.channelName ||
      account.metadata?.channelName ||
      defaultUsername
    );
  }

  if (account.username) {
    return account.username.startsWith("@")
      ? account.username
      : `@${account.username}`;
  }

  return (
    account.name ||
    defaultUsername
  );
};

/* =========================================================
   GET ACCOUNT AVATAR
========================================================= */

const getAccountAvatar = (
  account
) => {
  return (
    account?.youtubeChannelThumbnail ||
    account?.avatarUrl ||
    account?.profilePictureUrl ||
    account?.profilePicture ||
    account?.instagramProfilePictureUrl ||
    account?.linkedinProfilePictureUrl ||
    account?.metadata?.avatarUrl ||
    account?.metadata?.profile_picture_url ||
    ""
  );
};

/* =========================================================
   CONNECT SOCIAL PAGE
========================================================= */

export default function ConnectSocial() {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const {
    connections = [],
    loading = false,
    error = null,
  } = useSelector(
    (state) =>
      state.social || {}
  );

  const {
    user,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState(null);

  const [
    processingPlatform,
    setProcessingPlatform,
  ] = useState("");
const [
  rtmpPlatform,
  setRtmpPlatform,
] = useState(null);

const [
  rtmpForm,
  setRtmpForm,
] = useState({
  rtmpUrl: "",
  streamKey: "",
  channelUrl: "",
  username: "",
});

const [
  showStreamKey,
  setShowStreamKey,
] = useState(false);
  const plan =
    user?.plan || "free";

  const isPro =
    plan === "pro" ||
    plan === "business";

  const maxPlatforms =
    isPro ? 9 : 1;

  /* =========================================================
     NORMALIZED CONNECTIONS
  ========================================================= */

  const normalizedConnections =
    useMemo(() => {
      if (
        !Array.isArray(
          connections
        )
      ) {
        return [];
      }

      return connections.map(
        (connection) => ({
          ...connection,

          platform:
            normalizePlatform(
              connection.platform
            ),
        })
      );
    }, [connections]);

  const connectedPlatforms =
    useMemo(() => {
      return normalizedConnections
        .filter(
          (connection) =>
            connection.connected !==
            false
        )
        .map(
          (connection) =>
            connection.platform
        )
        .filter(Boolean);
    }, [
      normalizedConnections,
    ]);

  /* =========================================================
     HANDLE OAUTH CALLBACK QUERY
  ========================================================= */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const status =
      params.get("status");

    const platform =
      normalizePlatform(
        params.get("platform")
      );

    const message =
      params.get("message");

    if (
      status === "connected" &&
      platform
    ) {
      alert(
        `${platform} connected successfully.`
      );

      window.history.replaceState(
        {},
        "",
        "/app/connect"
      );

      dispatch(
        fetchConnections()
      );

      return;
    }

    if (
      status === "failed"
    ) {
      alert(
        message ||
          "Social connection failed."
      );

      window.history.replaceState(
        {},
        "",
        "/app/connect"
      );

      return;
    }

    dispatch(
      fetchConnections()
    );
  }, [dispatch]);

  /* =========================================================
     DISPLAY REDUX ERROR
  ========================================================= */

  useEffect(() => {
    if (!error) {
      return;
    }

    alert(error);

    dispatch(
      clearSocialError()
    );
  }, [
    error,
    dispatch,
  ]);

  /* =========================================================
     UPGRADE
  ========================================================= */

  const upgradeToPro =
    () => {
      navigate("/pricing");
    };



    /* =========================================================
   OPEN RTMP CONNECTION MODAL
========================================================= */

const openRTMPModal =
  (
    platformItem,
    existingConnection = null
  ) => {
    setRtmpPlatform(
      platformItem
    );

    setRtmpForm({
     rtmpUrl:
  existingConnection?.tiktokRtmpUrl ||
  existingConnection?.rumbleRtmpUrl ||
  existingConnection?.twitchRtmpUrl ||
  existingConnection?.kickRtmpUrl ||
  existingConnection?.twitterRtmpUrl ||
  existingConnection?.rtmpUrl ||
  platformItem?.defaultRtmpUrl ||
  "",

      streamKey: "",

      channelUrl:
  existingConnection?.tiktokChannelUrl ||
  existingConnection?.rumbleChannelUrl ||
  existingConnection?.twitchChannelUrl ||
  existingConnection?.kickChannelUrl ||
  existingConnection?.twitterChannelUrl ||
  existingConnection?.channelUrl ||
  "",

      username:
        existingConnection
          ?.username ||
        existingConnection
          ?.name ||
        "",
    });

    setShowStreamKey(false);
  };
  /* =========================================================
     TOGGLE CONNECTION
  ========================================================= */

 const toggleConnection =
  async (
    platform
  ) => {
    const normalizedPlatform =
      normalizePlatform(
        platform
      );

    const platformItem =
      socialData.find(
        (
          item
        ) =>
          item.id ===
          normalizedPlatform
      );

    if (!platformItem) {
      alert(
        "Unsupported platform."
      );

      return;
    }

    const account =
      normalizedConnections.find(
        (
          connection
        ) =>
          connection.platform ===
            normalizedPlatform &&
          connection.connected !==
            false
      );

    const alreadyConnected =
      Boolean(account);

    if (
      platformItem.pro &&
      !isPro &&
      !alreadyConnected
    ) {
      upgradeToPro();
      return;
    }

    if (
      alreadyConnected
    ) {
      const shouldDisconnect =
        window.confirm(
          `Disconnect ${platformItem.name}?`
        );

      if (!shouldDisconnect) {
        return;
      }

      try {
        setProcessingPlatform(
          normalizedPlatform
        );

        await dispatch(
          disconnectSocial(
            normalizedPlatform
          )
        ).unwrap();

        if (
          selectedAccount
            ?.platform ===
          normalizedPlatform
        ) {
          setSelectedAccount(
            null
          );
        }

        await dispatch(
          fetchConnections()
        );
      } catch (
        disconnectError
      ) {
        alert(
          typeof disconnectError ===
            "string"
            ? disconnectError
            : disconnectError
                ?.message ||
              "Unable to disconnect account."
        );
      } finally {
        setProcessingPlatform(
          ""
        );
      }

      return;
    }

    if (
      !isPro &&
      connectedPlatforms.length >=
        maxPlatforms
    ) {
      upgradeToPro();
      return;
    }

    if (
      platformItem.connectionType ===
      "unsupported"
    ) {
      alert(
        `${platformItem.name} connection is not configured in the current backend.`
      );
      return;
    }

    /*
     * Manual RTMP platforms open the
     * credential form instead of OAuth.
     */
    if (
      platformItem.connectionType ===
      "rtmp"
    ) {
      openRTMPModal(
        platformItem,
        account
      );

      return;
    }

    /*
     * Existing Instagram, Facebook,
     * YouTube, TikTok and LinkedIn OAuth flow.
     */
    setProcessingPlatform(
      normalizedPlatform
    );

    connectAPI(
      normalizedPlatform
    );
  };

  /* =========================================================
   SAVE RTMP CONNECTION
========================================================= */

const handleSaveRTMP =
  async (
    event
  ) => {
    event.preventDefault();

    if (!rtmpPlatform) {
      return;
    }

    const rtmpUrl =
      rtmpForm.rtmpUrl.trim();

    const streamKey =
      rtmpForm.streamKey.trim();

    const channelUrl =
      rtmpForm.channelUrl.trim();

    const username =
      rtmpForm.username.trim();

    if (!rtmpUrl) {
      alert(
        "RTMP URL is required."
      );

      return;
    }

    if (!streamKey) {
      alert(
        "Stream key is required."
      );

      return;
    }

    if (
      !rtmpUrl.startsWith(
        "rtmp://"
      ) &&
      !rtmpUrl.startsWith(
        "rtmps://"
      )
    ) {
      alert(
        "RTMP URL must start with rtmp:// or rtmps://."
      );

      return;
    }

    try {
      setProcessingPlatform(
        rtmpPlatform.id
      );

      await dispatch(
        saveRTMPConnection({
          platform:
            rtmpPlatform.id,

          data: {
            rtmpUrl,
            streamKey,
            channelUrl,
            username,
          },
        })
      ).unwrap();

      await dispatch(
        fetchConnections()
      ).unwrap();

      setRtmpPlatform(null);

      setRtmpForm({
        rtmpUrl: "",
        streamKey: "",
        channelUrl: "",
        username: "",
      });

      alert(
        `${rtmpPlatform.name} connected successfully.`
      );
    } catch (
      saveError
    ) {
      alert(
        typeof saveError ===
          "string"
          ? saveError
          : saveError
              ?.message ||
            "Unable to save RTMP connection."
      );
    } finally {
      setProcessingPlatform(
        ""
      );
    }
  };

  /* =========================================================
     OPEN ACCOUNT MODAL
  ========================================================= */

  const viewAccount = (
    account,
    locked
  ) => {
    if (locked) {
      upgradeToPro();
      return;
    }

    if (!account) {
      alert(
        "No account is connected."
      );

      return;
    }

    setSelectedAccount(
      account
    );
  };

  /* =========================================================
     GO LIVE
  ========================================================= */

  const goToLive = () => {
    if (
      connectedPlatforms.length ===
      0
    ) {
      alert(
        "Connect at least one social platform first."
      );

      return;
    }

    navigate(
      "/app/golive"
    );
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}

            {isPro
              ? "PRO SOCIAL CONNECTIONS"
              : "CONNECT SOCIAL MEDIA"}
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
          <span className="brand-text">
            {isPro
              ? "Connect All"
              : "Connect"}
          </span>{" "}
          Your Platforms
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
  {isPro
    ? "Connect Instagram, Facebook, YouTube, TikTok, LinkedIn, Rumble, Twitter/X, Twitch and Kick."
    : "The Free plan allows one platform. Upgrade to Pro to unlock all supported platforms."}
</p>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Connected"
          value={
            loading
              ? "..."
              : `${connectedPlatforms.length}/${maxPlatforms}`
          }
          icon={
            CheckCircle2
          }
        />

        <Stat
          title="Available"
          value={
            isPro ? "9" : "1"
          }
          icon={
            ShieldCheck
          }
        />

        <Stat
          title="Ready Live"
          value={
            connectedPlatforms.length >
            0
              ? "Yes"
              : "No"
          }
          icon={Radio}
        />

        <Stat
          title="AI Status"
          value={
            isPro
              ? "Pro Online"
              : "Online"
          }
          icon={Sparkles}
        />
      </section>

      {/* =====================================================
          SOCIAL CARDS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2">
        {socialData.map(
          ({
            id,
            name,
            icon: Icon,
            color,
            defaultUsername,
            pro,
          }) => {
            const active =
              connectedPlatforms.includes(
                id
              );

            const locked =
              pro && !isPro;

            const account =
              normalizedConnections.find(
                (connection) =>
                  connection.platform ===
                  id &&
                  connection.connected !==
                    false
              );

            const accountName =
              active
                ? getAccountDisplayName(
                    account,
                    defaultUsername
                  )
                : defaultUsername;

            const avatar =
              getAccountAvatar(
                account
              );

            const isProcessing =
              loading ||
              processingPlatform ===
                id;

            return (
              <div
                key={id}
                className={`relative rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
                  locked
                    ? "border-pink-200 dark:border-white/10"
                    : active
                    ? "border-green-200 dark:border-green-500/30"
                    : "border-border"
                }`}
              >
                {locked && (
                  <span className="absolute right-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                    PRO
                  </span>
                )}

                <div
                  className={
                    locked
                      ? "opacity-70"
                      : ""
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${color}`}
                      >
                        {avatar &&
                        active ? (
                          <img
                            src={
                              avatar
                            }
                            alt={
                              accountName
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : locked ? (
                          <Lock className="h-7 w-7 text-[var(--brand-pink)]" />
                        ) : (
                          <Icon className="h-7 w-7 text-[var(--brand-pink)]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-lg font-black tracking-tight text-foreground">
                          {name}
                        </h2>

                        <p className="truncate text-sm font-medium text-muted-foreground">
                          {locked
                            ? "Unlock with Pro"
                            : accountName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
                        active
                          ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : locked
                          ? "bg-pink-100 text-[var(--brand-pink)] dark:bg-white/10"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                      }`}
                    >
                      {active
                        ? "Connected"
                        : locked
                        ? "Pro Only"
                        : "Not Connected"}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        toggleConnection(
                          id
                        )
                      }
                      disabled={
                        isProcessing
                      }
                      className={`rounded-[5px] py-3 text-sm font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        active
                          ? "border border-red-500 text-red-500 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10"
                          : "brand-gradient text-white shadow-md hover:opacity-90"
                      }`}
                    >
                      {isProcessing
                        ? "Please wait..."
                        : active
                        ? "Disconnect"
                        : locked
                        ? "Upgrade"
                        : "Connect"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        viewAccount(
                          account,
                          locked
                        )
                      }
                      disabled={
                        isProcessing
                      }
                      className="rounded-[5px] border border-border bg-background py-3 text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)] hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {locked
                        ? "Pro Account"
                        : "View Account"}
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </section>

      {/* =====================================================
          START LIVE
      ===================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight brand-text">
              {isPro
                ? "Ready for Multi-Platform Live?"
                : "Ready to Go Live?"}
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              {isPro
                ? "Start your AI Twin live on selected connected platforms."
                : "Connect at least one platform before starting your AI Twin live."}
            </p>
          </div>

          <button
            type="button"
            disabled={
              connectedPlatforms.length ===
                0 ||
              loading
            }
            onClick={
              goToLive
            }
            className="brand-gradient flex items-center justify-center gap-2 rounded-[5px] px-8 py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPro
              ? "Start Pro Live"
              : "Start Live"}

            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* =====================================================
          ACCOUNT MODAL
      ===================================================== */}

      {selectedAccount && (
        <AccountModal
          account={
            selectedAccount
          }
          onClose={() =>
            setSelectedAccount(
              null
            )
          }
        />
      )}

      {rtmpPlatform && (
        <RTMPConnectionModal
          platform={
            rtmpPlatform
          }
          form={
            rtmpForm
          }
          setForm={
            setRtmpForm
          }
          showStreamKey={
            showStreamKey
          }
          setShowStreamKey={
            setShowStreamKey
          }
          processing={
            processingPlatform ===
            rtmpPlatform.id
          }
          onSubmit={
            handleSaveRTMP
          }
          onClose={() => {
            if (processingPlatform) {
              return;
            }

            setRtmpPlatform(null);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   ACCOUNT MODAL
========================================================= */

function AccountModal({
  account,
  onClose,
}) {
  const platform =
    normalizePlatform(
      account.platform
    );

  const platformDetails =
    socialData.find(
      (item) =>
        item.id ===
        platform
    );

  const PlatformIcon =
    platformDetails?.icon ||
    UserRound;

  const avatar =
    getAccountAvatar(
      account
    );

  const accountName =
    getAccountDisplayName(
      account,
      "Connected Account"
    );

  const youtubeUrl =
    account.youtubeChannelId
      ? `https://www.youtube.com/channel/${account.youtubeChannelId}`
      : "";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 text-foreground shadow-xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black tracking-tight brand-text">
            Connected Account
          </h2>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Close account details"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background transition hover:border-[var(--brand-pink)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted">
            {avatar ? (
              <img
                src={avatar}
                alt={
                  accountName
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <PlatformIcon className="h-8 w-8 text-[var(--brand-pink)]" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-black text-foreground">
              {accountName}
            </p>

            <p className="mt-1 capitalize text-sm font-medium text-muted-foreground">
              {platform}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <AccountRow
            label="Platform"
            value={
              platform ||
              "Not available"
            }
          />

          <AccountRow
            label="Account Name"
            value={
              accountName ||
              "Not available"
            }
          />

         

          {platform ===
            "facebook" && (
            <>
              <AccountRow
                label="Page Name"
                value={
                  account.pageName ||
                  "Not available"
                }
              />

              <AccountRow
                label="Page ID"
                value={
                  account.pageId ||
                  "Not available"
                }
              />
            </>
          )}

          {platform ===
            "instagram" && (
            <>
              <AccountRow
                label="Instagram Username"
                value={(() => {
                  const username =
                    account.username ||
                    account.instagramUsername ||
                    account.platformUsername ||
                    account.metadata?.username ||
                    "";

                  if (!username) {
                    return "Not available";
                  }

                  return username.startsWith("@")
                    ? username
                    : `@${username}`;
                })()}
              />

              

              <AccountRow
                label="RTMP Configured"
                value={
                  account.instagramRtmpConfigured
                    ? "Yes"
                    : "No"
                }
              />
            </>
          )}

          {platform ===
            "youtube" && (
            <>
              <AccountRow
                label="YouTube Channel"
                value={
                  account.youtubeChannelTitle ||
                  accountName ||
                  "Not available"
                }
              />

              <AccountRow
                label="Channel ID"
                value={
                  account.youtubeChannelId ||
                  account.platformUserId ||
                  "Not available"
                }
              />

              <AccountRow
                label="Live Status"
                value={
                  account.youtubeLiveStatus ||
                  "Idle"
                }
              />

              {account.youtubeWatchUrl && (
                <AccountRow
                  label="Current Live URL"
                  value={
                    account.youtubeWatchUrl
                  }
                />
              )}
            </>
          )}
          {platform ===
            "linkedin" && (
            <>
              <AccountRow
                label="LinkedIn Name"
                value={
                  account.linkedinName ||
                  account.name ||
                  accountName ||
                  "Not available"
                }
              />

              <AccountRow
                label="LinkedIn ID"
                value={
                  account.linkedinId ||
                  account.platformUserId ||
                  "Not available"
                }
              />

              {(account.linkedinProfileUrl ||
                account.profileUrl) && (
                <a
                  href={
                    account.linkedinProfileUrl ||
                    account.profileUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-5 py-3 text-sm font-bold transition hover:border-[var(--brand-pink)]"
                >
                  Open LinkedIn Profile

                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </>
          )}

{[
  "tiktok",
  "rumble",
  "twitter",
  "twitch",
  "kick",
].includes(
  platform
) && (
  <>
    <AccountRow
      label="Channel"
      value={
        account.username ||
        account.name ||
        account.channelName ||
        accountName
      }
    />

    <AccountRow
      label="RTMP Configured"
      value={
        account.rtmpConfigured ||
account.tiktokRtmpConfigured ||
account.rumbleRtmpConfigured ||
account.twitchRtmpConfigured ||
account.kickRtmpConfigured ||
account.twitterRtmpConfigured
          ? "Yes"
          : "No"
      }
    />

    <AccountRow
      label="Live Status"
      value={
       account.liveStatus ||
account.tiktokLiveStatus ||
account.rumbleLiveStatus ||
account.twitchLiveStatus ||
account.kickLiveStatus ||
account.twitterLiveStatus ||
"Idle"
      }
    />

    {(
     account.channelUrl ||
account.tiktokChannelUrl ||
account.rumbleChannelUrl ||
account.twitchChannelUrl ||
account.kickChannelUrl ||
account.twitterChannelUrl
    ) && (
      <a
        href={
          account.channelUrl ||
          account.rumbleChannelUrl ||
          account.twitchChannelUrl ||
          account.kickChannelUrl ||
          account.twitterChannelUrl
        }
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-5 py-3 text-sm font-bold transition hover:border-[var(--brand-pink)]"
      >
        Open Channel

        <ExternalLink className="h-4 w-4" />
      </a>
    )}
  </>
)}
          <AccountRow
            label="Status"
            value={
              account.connected !==
              false
                ? "Connected"
                : "Disconnected"
            }
          />
        </div>

        {platform ===
          "youtube" &&
          youtubeUrl && (
            <a
              href={
                youtubeUrl
              }
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] bg-red-600 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-red-700"
            >
              Open YouTube Channel

              <ExternalLink className="h-4 w-4" />
            </a>
          )}
      </div>
          </div>
  );
}


/* =========================================================
   RTMP CONNECTION MODAL
========================================================= */

function RTMPConnectionModal({
  platform,
  form,
  setForm,
  showStreamKey,
  setShowStreamKey,
  processing,
  onSubmit,
  onClose,
}) {
  const PlatformIcon =
    platform.icon ||
    Radio;

  const updateField =
    (
      field,
      value
    ) => {
      setForm(
        (
          previous
        ) => ({
          ...previous,
          [field]: value,
        })
      );
    };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4"
      onClick={
        onClose
      }
    >
      <form
        onSubmit={
          onSubmit
        }
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
        className="my-8 w-full max-w-xl rounded-3xl border border-border bg-card p-6 text-foreground shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`grid h-14 w-14 place-items-center rounded-2xl ${platform.color}`}>
              <PlatformIcon className="h-7 w-7 text-[var(--brand-pink)]" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight brand-text">
                Connect{" "}
                {platform.name}
              </h2>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Enter the streaming details provided by{" "}
                {platform.name}.
              </p>

              {platform.dashboardUrl && (
                <a
                  href={platform.dashboardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[var(--brand-pink)] hover:underline"
                >
                  Open {platform.name} live dashboard
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              processing
            }
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background transition hover:border-[var(--brand-pink)] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-black text-foreground">
              Channel name
            </span>

            <input
              type="text"
              value={
                form.username
              }
              onChange={(
                event
              ) =>
                updateField(
                  "username",
                  event.target.value
                )
              }
              placeholder={`${platform.name} channel`}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none transition focus:border-[var(--brand-pink)]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-foreground">
              RTMP URL
            </span>

            <input
              type="text"
              required
              value={
                form.rtmpUrl
              }
              onChange={(
                event
              ) =>
                updateField(
                  "rtmpUrl",
                  event.target.value
                )
              }
              placeholder="rtmp://stream-server/live"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none transition focus:border-[var(--brand-pink)]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-foreground">
              Stream key
            </span>

            <div className="relative mt-2">
              <input
                type={
                  showStreamKey
                    ? "text"
                    : "password"
                }
                required
                value={
                  form.streamKey
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "streamKey",
                    event.target.value
                  )
                }
                placeholder="Enter stream key"
                autoComplete="off"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm font-medium outline-none transition focus:border-[var(--brand-pink)]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowStreamKey(
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              >
                {showStreamKey ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-black text-foreground">
              Channel URL
            </span>

            <input
              type="url"
              value={
                form.channelUrl
              }
              onChange={(
                event
              ) =>
                updateField(
                  "channelUrl",
                  event.target.value
                )
              }
              placeholder="https://platform.com/your-channel"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none transition focus:border-[var(--brand-pink)]"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-medium leading-6 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
          The stream key is private. It will be sent securely to your backend and must never be displayed in the connection response.
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              processing
            }
            className="rounded-[5px] border border-border bg-background px-5 py-3 text-sm font-bold transition hover:border-[var(--brand-pink)] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              processing
            }
            className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing
              ? "Connecting..."
              : `Connect ${platform.name}`}
          </button>
        </div>
      </form>
    </div>
  );
}
/* =========================================================
   STAT
========================================================= */

function Stat({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="text-2xl font-black tracking-tight brand-text">
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ACCOUNT ROW
========================================================= */

function AccountRow({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-foreground">
        {String(
          value ??
            "Not available"
        )}
      </p>
    </div>
  );
}