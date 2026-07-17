// src/pages/ConnectSocial.jsx

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
  },
  {
    id: "tiktok",
    name: "TikTok",
    color:
      "bg-gray-100 dark:bg-white/10",
    icon: Music2,
    defaultUsername:
      "@tiktok",
    pro: true,
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

  if (
    account.platform ===
    "youtube"
  ) {
    return (
      account.youtubeChannelTitle ||
      account.name ||
      account.username ||
      "YouTube Channel"
    );
  }

  if (
    account.platform ===
    "facebook"
  ) {
    return (
      account.pageName ||
      account.name ||
      account.username ||
      "Facebook Page"
    );
  }

  if (
  account.platform ===
  "instagram"
) {
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

  if (account.username) {
    return account.username.startsWith(
      "@"
    )
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

  const plan =
    user?.plan || "free";

  const isPro =
    plan === "pro" ||
    plan === "business";

  const maxPlatforms =
    isPro ? 4 : 1;

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
     TOGGLE CONNECTION
  ========================================================= */

  const toggleConnection =
    async (platform) => {
      const normalizedPlatform =
        normalizePlatform(
          platform
        );

      const platformItem =
        socialData.find(
          (item) =>
            item.id ===
            normalizedPlatform
        );

      const alreadyConnected =
        connectedPlatforms.includes(
          normalizedPlatform
        );

      if (
        platformItem?.pro &&
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
            `Disconnect ${platformItem?.name || normalizedPlatform}?`
          );

        if (
          !shouldDisconnect
        ) {
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
            selectedAccount?.platform ===
            normalizedPlatform
          ) {
            setSelectedAccount(
              null
            );
          }
        } catch (disconnectError) {
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

      setProcessingPlatform(
        normalizedPlatform
      );

      connectAPI(
        normalizedPlatform
      );
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
            ? "Connect Instagram, Facebook, YouTube and TikTok for multi-platform AI Twin live selling."
            : "The Free plan allows one platform. Upgrade to Pro to connect Facebook, YouTube and TikTok."}
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
            isPro ? "4" : "1"
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

          <AccountRow
            label="Platform User ID"
            value={
              account.platformUserId ||
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
                label="Linked Facebook Page"
                value={
                  account.pageName ||
                  "Not available"
                }
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