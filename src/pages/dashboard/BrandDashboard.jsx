import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Facebook,
  Instagram,
  Lock,
  Music2,
  Package,
  Radio,
  Rocket,
  ScanFace,
  Sparkles,
  TrendingUp,
  Youtube,
  Brain,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

/* =========================================================
   NORMALIZERS
========================================================= */

const normalizeRole = (role) =>
  String(role || "user")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

const normalizePlan = (plan) => {
  const value = String(plan || "free")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (value === "freetrial") return "free";
  return value;
};

/* =========================================================
   ROLE CONFIG
========================================================= */

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    canCreateTwin: true,
    canEditTwin: true,
    canDeleteTwin: true,
    canManageProducts: true,
    canConnectSocial: true,
    canScheduleLive: true,
    canGoLive: true,
    canViewAnalytics: true,
    canViewAllTwins: true,
  },

  manager: {
    label: "Manager",
    canCreateTwin: true,
    canEditTwin: true,
    canDeleteTwin: true,
    canManageProducts: true,
    canConnectSocial: true,
    canScheduleLive: true,
    canGoLive: true,
    canViewAnalytics: true,
    canViewAllTwins: true,
  },

  brandcreator: {
    label: "Brand Creator",
    canCreateTwin: true,
    canEditTwin: true,
    canDeleteTwin: true,
    canManageProducts: true,
    canConnectSocial: true,
    canScheduleLive: true,
    canGoLive: true,
    canViewAnalytics: true,
    canViewAllTwins: false,
  },

  contentcreator: {
    label: "Content Creator",
    canCreateTwin: false,
    canEditTwin: false,
    canDeleteTwin: false,
    canManageProducts: false,
    canConnectSocial: false,
    canScheduleLive: false,
    canGoLive: false,
    canViewAnalytics: true,
    canViewAllTwins: false,
  },

  user: {
    label: "User",
    canCreateTwin: false,
    canEditTwin: false,
    canDeleteTwin: false,
    canManageProducts: false,
    canConnectSocial: false,
    canScheduleLive: false,
    canGoLive: false,
    canViewAnalytics: true,
    canViewAllTwins: false,
  },
};

/* =========================================================
   PLAN CONFIG
   Matches Pricing.jsx
========================================================= */

const PLAN_CONFIG = {
  free: {
    key: "free",
    label: "Free Trial",
    icon: Sparkles,
    maxTwins: 1,
    maxPlatforms: 1,
    maxProducts: 10,
    maxSchedules: 1,
    aiReplies: 100,
    voice: "Standard",
    lipSync: "Basic",
    analytics: "None",
    teamSeats: 1,
    branding: "Twin badge",
    platformNames: ["instagram"],
    advancedTraining: false,
    customVoice: false,
    storeIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
  },

  starter: {
    key: "starter",
    label: "Starter",
    icon: Zap,
    maxTwins: 2,
    maxPlatforms: 2,
    maxProducts: 30,
    maxSchedules: 10,
    aiReplies: 300,
    voice: "Standard",
    lipSync: "Basic",
    analytics: "None",
    teamSeats: 1,
    branding: "Twin badge",
    platformNames: ["instagram", "facebook"],
    advancedTraining: false,
    customVoice: false,
    storeIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
  },

  pro: {
    key: "pro",
    label: "Pro",
    icon: Crown,
    maxTwins: 3,
    maxPlatforms: 4,
    maxProducts: 100,
    maxSchedules: 50,
    aiReplies: Infinity,
    voice: "Custom cloning",
    lipSync: "Advanced",
    analytics: "Live sales",
    teamSeats: 1,
    branding: "No badge",
    platformNames: [
      "instagram",
      "facebook",
      "youtube",
      "tiktok",
    ],
    advancedTraining: true,
    customVoice: true,
    storeIntegrations: false,
    apiAccess: false,
    whiteLabel: false,
  },

  business: {
    key: "business",
    label: "Business",
    icon: Rocket,
    maxTwins: Infinity,
    maxPlatforms: 5,
    maxProducts: Infinity,
    maxSchedules: Infinity,
    aiReplies: Infinity,
    voice: "Custom cloning",
    lipSync: "Advanced",
    analytics: "Advanced reports",
    teamSeats: 5,
    branding: "No badge",
    platformNames: [
      "instagram",
      "facebook",
      "youtube",
      "tiktok",
      "linkedin",
    ],
    advancedTraining: true,
    customVoice: true,
    storeIntegrations: true,
    apiAccess: false,
    whiteLabel: false,
  },

  agency: {
    key: "agency",
    label: "Agency",
    icon: Building2,
    maxTwins: Infinity,
    maxPlatforms: Infinity,
    maxProducts: Infinity,
    maxSchedules: Infinity,
    aiReplies: Infinity,
    voice: "Custom cloning",
    lipSync: "Advanced",
    analytics: "Advanced reports",
    teamSeats: Infinity,
    branding: "White-label",
    platformNames: [
      "instagram",
      "facebook",
      "youtube",
      "tiktok",
      "linkedin",
    ],
    advancedTraining: true,
    customVoice: true,
    storeIntegrations: true,
    apiAccess: true,
    whiteLabel: true,
  },
};

const formatLimit = (value) =>
  Number.isFinite(value)
    ? value
    : "Unlimited";

const formatUsage = (
  current,
  limit
) =>
  Number.isFinite(limit)
    ? `${current}/${limit}`
    : `${current}/Unlimited`;

const formatReplies = (value) =>
  Number.isFinite(value)
    ? `${value}/month`
    : "Unlimited";

/* =========================================================
   DASHBOARD
========================================================= */

export default function BrandDashboard() {
  const navigate = useNavigate();

  const { user } =
    useSelector(
      (state) =>
        state.auth || {}
    );

  const roleKey =
    normalizeRole(
      user?.role
    );

  const isBrandCreator =
    roleKey === "brandcreator";

  const isInternalRole =
    roleKey === "admin" ||
    roleKey === "manager";

  const planKey =
    isBrandCreator
      ? normalizePlan(user?.plan)
      : null;

  const role =
    ROLE_CONFIG[roleKey] ||
    ROLE_CONFIG.user;

  // Subscription plans belong only to brand creators.
  // Admin and manager use unrestricted internal access.
  // Content creators and users are view-only and have no plan.
  const plan =
    isBrandCreator
      ? PLAN_CONFIG[planKey] || PLAN_CONFIG.free
      : isInternalRole
        ? {
            ...PLAN_CONFIG.agency,
            key: "internal",
            label: "Internal Access",
            icon: ShieldCheck,
            branding: "Internal",
          }
        : {
            key: "none",
            label: "No Subscription",
            icon: Users,
            maxTwins: 0,
            maxPlatforms: 0,
            maxProducts: 0,
            maxSchedules: 0,
            aiReplies: 0,
            voice: "View only",
            lipSync: "View only",
            analytics: "Basic activity",
            teamSeats: 0,
            branding: "View only",
            platformNames: [],
            advancedTraining: false,
            customVoice: false,
            storeIntegrations: false,
            apiAccess: false,
            whiteLabel: false,
          };

  const PlanIcon =
    plan.icon;

  const twins =
    Array.isArray(
      user?.twins
    )
      ? user.twins
      : user?.twin
        ? [user.twin]
        : [];

  const twin =
    user?.twin ||
    twins[0] ||
    null;

  const products =
    Array.isArray(
      user?.products
    )
      ? user.products
      : [];

  const schedules =
    Array.isArray(
      user?.liveSchedules
    )
      ? user.liveSchedules
      : Array.isArray(
          user?.schedules
        )
        ? user.schedules
        : [];

  const connections =
    Array.isArray(
      user?.connections
    )
      ? user.connections
      : Array.isArray(
          user?.socialConnections
        )
        ? user.socialConnections
        : [];

  const hasTwin =
    Boolean(twin);

  const isTrained =
    Boolean(
      twin?.isTrained
    );

  const twinName =
    twin?.name ||
    "My AI Twin";

  const twinImage =
    twin?.image ||
    twin?.avatarImage ||
    twin?.twinImage ||
    twin?.appearance
      ?.avatarUrl ||
    "/images/bbb.png";

  const recentProducts =
    products.slice(0, 3);

  const live =
    schedules[0] ||
    null;

  const platform =
    Array.isArray(
      live?.platforms
    )
      ? live.platforms[0]
      : live?.platform ||
        "Instagram";

  const PlatformIcon =
    platform === "YouTube"
      ? Youtube
      : platform === "Facebook"
        ? Facebook
        : platform === "TikTok"
          ? Music2
          : Instagram;

  const connectedPlatforms =
    connections
      .filter(
        (connection) =>
          connection?.connected !== false &&
          connection?.status !==
            "disconnected"
      )
      .map(
        (connection) =>
          String(
            connection?.platform ||
              connection?.name ||
              ""
          ).toLowerCase()
      );

  const isPlatformConnected =
    (platformName) =>
      connectedPlatforms.includes(
        platformName.toLowerCase()
      );

  const isPlatformAllowed =
    (platformName) =>
      plan.platformNames.includes(
        platformName.toLowerCase()
      );

  const getProductImage =
    (product) => {
      const image =
        product?.images?.[0] ||
        product?.image ||
        product?.img;

      return image &&
        typeof image ===
          "string"
        ? image
        : "/images/6.jpeg";
    };

  const getProductPrice =
    (product) => {
      const price =
        Number(
          product?.salePrice
        ) > 0
          ? product.salePrice
          : product?.price;

      return `$${Number(
        price || 0
      ).toLocaleString(
        "en-US"
      )}`;
    };

  const goLive = () => {
    if (!role.canGoLive) {
      navigate(
        "/app/twin"
      );
      return;
    }

    if (!hasTwin) {
      navigate(
        "/app/twin/create"
      );
      return;
    }

    if (!isTrained) {
      navigate(
        "/app/twin/train"
      );
      return;
    }

    if (
      !connectedPlatforms.length
    ) {
      navigate(
        "/app/connect"
      );
      return;
    }

    navigate(
      "/app/golive"
    );
  };

  const heroTitle =
    roleKey === "admin"
      ? "Manage every AI Twin."
      : roleKey ===
          "manager"
        ? "Operate the live commerce platform."
        : role.canGoLive
          ? "Sell around the clock."
          : "Explore AI live commerce.";

  const heroSubtitle =
    isBrandCreator
      ? `${plan.label} gives you ${formatLimit(
          plan.maxTwins
        )} AI Twin(s), ${formatLimit(
          plan.maxProducts
        )} products, ${formatLimit(
          plan.maxPlatforms
        )} platform(s), and ${formatReplies(
          plan.aiReplies
        )}.`
      : isInternalRole
        ? "Internal role access is controlled by backend permissions and is not limited by customer subscription plans."
        : "Your account has view access only. Subscription plans are available only for brand creator accounts.";

  return (
    <div className="min-h-full space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-[var(--brand-pink)] bg-pink-50/70 p-5 shadow-sm dark:bg-white/10 sm:p-6">
        <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-full bg-[var(--brand-pink)] px-4 py-2 text-xs font-black text-white sm:flex">
          {roleKey ===
            "admin" ||
          roleKey ===
            "manager" ? (
            <ShieldCheck className="h-4 w-4" />
          ) : (
            <PlanIcon className="h-4 w-4" />
          )}

          {role.label.toUpperCase()}
          {isBrandCreator && (
            <>
              {" · "}
              {plan.label.toUpperCase()}
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
              <PlanIcon className="h-4 w-4 text-[var(--brand-pink)]" />
              {isBrandCreator
                ? `${plan.label.toUpperCase()} DASHBOARD`
                : `${role.label.toUpperCase()} DASHBOARD`}
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              <span className="brand-text">
                {heroTitle}
              </span>
              <br />
              Build. Train. Go live.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {heroSubtitle}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {role.canGoLive ? (
                <button
                  onClick={
                    goLive
                  }
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
                >
                  Go Live Now
                  <Radio className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  to="/app/twin"
                  className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
                >
                  View AI Twins
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {role.canManageProducts ? (
                <Link
                  to="/app/products/add"
                  className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-6 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Add Product
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to="/app/products"
                  className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-6 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  View Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-pink-50 p-3 dark:bg-white/10">
            <img
              src={
                twinImage
              }
              alt="AI Twin"
              className="h-80 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PLAN USAGE
      ====================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={
            ScanFace
          }
          label="AI Twins"
          value={formatUsage(
            twins.length,
            plan.maxTwins
          )}
          change={`${plan.label} limit`}
        />

        <StatCard
          icon={
            Package
          }
          label="Products"
          value={formatUsage(
            products.length,
            plan.maxProducts
          )}
          change={`${plan.label} limit`}
        />

        <StatCard
          icon={
            Radio
          }
          label="Connected Platforms"
          value={formatUsage(
            connectedPlatforms.length,
            plan.maxPlatforms
          )}
          change={`${plan.label} access`}
        />

        <StatCard
          icon={
            Brain
          }
          label="AI Replies"
          value={formatReplies(
            plan.aiReplies
          )}
          change={
            plan.voice
          }
        />
      </section>

      {/* =====================================================
          QUICK ACTIONS + STATUS
      ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Available actions are based on your role and pricing plan.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              icon={
                ScanFace
              }
              title={
                role.canCreateTwin
                  ? "Manage AI Twins"
                  : "View AI Twins"
              }
              desc={
                role.canCreateTwin
                  ? `Create up to ${formatLimit(
                      plan.maxTwins
                    )} AI Twin(s).`
                  : "Browse active AI Twins."
              }
              to={
                role.canCreateTwin
                  ? "/app/twin/create"
                  : "/app/twin"
              }
              locked={
                !role.canCreateTwin
              }
            />

            <ActionCard
              icon={
                Brain
              }
              title={
                role.canEditTwin
                  ? plan.advancedTraining
                    ? "Advanced Training"
                    : "Standard Training"
                  : "View Knowledge"
              }
              desc={
                role.canEditTwin
                  ? plan.customVoice
                    ? "Upload knowledge and use custom voice cloning."
                    : "Upload knowledge using the standard voice."
                  : "Training changes are restricted."
              }
              to={
                role.canEditTwin
                  ? "/app/twin/train"
                  : "/app/twin"
              }
              locked={
                !role.canEditTwin
              }
            />

            <ActionCard
              icon={
                Package
              }
              title={
                role.canManageProducts
                  ? "Manage Products"
                  : "View Products"
              }
              desc={
                role.canManageProducts
                  ? `Add up to ${formatLimit(
                      plan.maxProducts
                    )} products.`
                  : "Browse available products."
              }
              to="/app/products"
              locked={
                !role.canManageProducts
              }
            />

            <ActionCard
              icon={
                Instagram
              }
              title={
                role.canConnectSocial
                  ? "Connect Social"
                  : "Connected Accounts"
              }
              desc={
                role.canConnectSocial
                  ? `Connect up to ${formatLimit(
                      plan.maxPlatforms
                    )} platform(s).`
                  : "Social account changes are restricted."
              }
              to="/app/connect"
              locked={
                !role.canConnectSocial
              }
            />

            <ActionCard
              icon={
                Calendar
              }
              title={
                role.canScheduleLive
                  ? "Schedule Live"
                  : "View Schedule"
              }
              desc={
                role.canScheduleLive
                  ? `Create up to ${formatLimit(
                      plan.maxSchedules
                    )} scheduled lives.`
                  : "View upcoming live sessions."
              }
              to="/app/schedule"
              locked={
                !role.canScheduleLive
              }
            />

            <ActionCard
              icon={
                BarChart3
              }
              title={
                plan.analytics ===
                "None"
                  ? "Basic Activity"
                  : `${plan.analytics} Analytics`
              }
              desc={
                plan.analytics ===
                "None"
                  ? "Upgrade to unlock sales analytics."
                  : "Track views, sales, revenue and live performance."
              }
              to="/app/analytics"
              locked={
                !role.canViewAnalytics ||
                plan.analytics ===
                  "None"
              }
            />
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            AI Twin Status
          </h2>

          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  twinImage
                }
                alt="AI Twin"
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <h3 className="text-base font-black tracking-tight text-foreground">
                  {twinName}
                </h3>

                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ●{" "}
                  {hasTwin
                    ? twin?.status ||
                      "Available"
                    : "Not Created"}
                </p>

                <p className="mt-1 text-xs font-black text-[var(--brand-pink)]">
                  {role.label}
                  {isBrandCreator && (
                    <>
                      {" · "}
                      {plan.label}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Progress
                label="Avatar Created"
                value={
                  hasTwin
                    ? 100
                    : 0
                }
              />

              <Progress
                label={
                  plan.customVoice
                    ? "Custom Voice"
                    : "Standard Voice"
                }
                value={
                  twin?.voice
                    ? 100
                    : hasTwin
                      ? 50
                      : 0
                }
              />

              <Progress
                label="Knowledge Added"
                value={
                  isTrained
                    ? 100
                    : 0
                }
              />

              <Progress
                label="Products Added"
                value={
                  Number.isFinite(
                    plan.maxProducts
                  )
                    ? Math.min(
                        (products.length /
                          plan.maxProducts) *
                          100,
                        100
                      )
                    : products.length
                      ? 100
                      : 0
                }
              />
            </div>
          </div>

          <Link
            to={
              hasTwin
                ? "/app/twin"
                : role.canCreateTwin
                  ? "/app/twin/create"
                  : "/app/twin"
            }
            className="mt-5 flex h-11 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
          >
            {hasTwin
              ? "View Twin Dashboard"
              : role.canCreateTwin
                ? "Create AI Twin"
                : "Browse AI Twins"}
          </Link>
        </aside>
      </section>

      {/* =====================================================
          PRODUCTS + UPCOMING LIVE
      ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight brand-text">
                Recent Products
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Products available for your AI Twin.
              </p>
            </div>

            <Link
              to="/app/products"
              className="shrink-0 text-sm font-bold text-[var(--brand-pink)] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {!recentProducts.length ? (
              <EmptyState
                icon={
                  Package
                }
                title="No products available"
                description={
                  role.canManageProducts
                    ? "Add your first product to begin live selling."
                    : "No products are available to view."
                }
              />
            ) : (
              recentProducts.map(
                (product) => {
                  const productImage =
                    getProductImage(
                      product
                    );

                  return (
                    <div
                      key={
                        product._id ||
                        product.id ||
                        product.name
                      }
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            productImage
                          }
                          alt={
                            product.name
                          }
                          className="h-16 w-16 rounded-xl bg-pink-50 object-cover dark:bg-white/10"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "/images/6.jpeg";
                          }}
                        />

                        <div>
                          <h3 className="text-base font-black tracking-tight text-foreground">
                            {
                              product.name
                            }
                          </h3>

                          <p className="text-sm font-bold brand-text">
                            {getProductPrice(
                              product
                            )}
                          </p>

                          {Number(
                            product.salePrice
                          ) >
                            0 &&
                            Number(
                              product.salePrice
                            ) <
                              Number(
                                product.price
                              ) && (
                              <p className="text-xs font-bold text-muted-foreground line-through">
                                $
                                {Number(
                                  product.price ||
                                    0
                                ).toLocaleString(
                                  "en-US"
                                )}
                              </p>
                            )}

                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {product.status ||
                              "active"}
                          </p>
                        </div>
                      </div>

                      {role.canGoLive ? (
                        <button
                          onClick={() =>
                            navigate(
                              `/app/golive?product=${encodeURIComponent(
                                product.name
                              )}`
                            )
                          }
                          className="brand-gradient rounded-[5px] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
                        >
                          Sell Live
                        </button>
                      ) : (
                        <Link
                          to="/app/products"
                          className="rounded-[5px] border-2 border-[var(--brand-pink)] px-5 py-2.5 text-center text-sm font-bold text-[var(--brand-pink)]"
                        >
                          View Product
                        </Link>
                      )}
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Upcoming Live
          </h2>

          {live ? (
            <div className="mt-5 rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <PlatformIcon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-base font-black tracking-tight text-foreground">
                    {live.title ||
                      `${platform} Live`}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {live.productName ||
                      live.product ||
                      "Product not selected"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <Info
                  icon={
                    Calendar
                  }
                  label="Date"
                  value={
                    live.date ||
                    "Not set"
                  }
                />

                <Info
                  icon={
                    Clock
                  }
                  label="Time"
                  value={
                    live.time ||
                    "Not set"
                  }
                />
              </div>

              {role.canGoLive && (
                <button
                  onClick={() =>
                    navigate(
                      `/app/golive?product=${encodeURIComponent(
                        live.productName ||
                          live.product ||
                          ""
                      )}&platform=${encodeURIComponent(
                        platform
                      )}`
                    )
                  }
                  className="brand-gradient mt-5 h-11 w-full rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90"
                >
                  Start This Live
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState
                icon={
                  Calendar
                }
                title="No upcoming live"
                description={
                  role.canScheduleLive
                    ? "Create your next scheduled live session."
                    : "There are no scheduled live sessions."
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CONNECTED ACCOUNTS + PLAN FEATURES
      ====================================================== */}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Connected Accounts
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SocialCard
              icon={
                Instagram
              }
              name="Instagram"
              connected={isPlatformConnected(
                "instagram"
              )}
              allowed={isPlatformAllowed(
                "instagram"
              )}
            />

            <SocialCard
              icon={
                Facebook
              }
              name="Facebook"
              connected={isPlatformConnected(
                "facebook"
              )}
              allowed={isPlatformAllowed(
                "facebook"
              )}
            />

            <SocialCard
              icon={
                Youtube
              }
              name="YouTube"
              connected={isPlatformConnected(
                "youtube"
              )}
              allowed={isPlatformAllowed(
                "youtube"
              )}
            />

            <SocialCard
              icon={
                Music2
              }
              name="TikTok"
              connected={isPlatformConnected(
                "tiktok"
              )}
              allowed={isPlatformAllowed(
                "tiktok"
              )}
            />

            {(plan.key ===
              "business" ||
              plan.key ===
                "agency") && (
              <SocialCard
                icon={
                  Users
                }
                name="LinkedIn"
                connected={isPlatformConnected(
                  "linkedin"
                )}
                allowed={isPlatformAllowed(
                  "linkedin"
                )}
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight brand-text">
            Plan Features
          </h2>

          <div className="mt-5 space-y-4">
            <ActivityItem
              title={`${plan.voice} voice`}
              time={`${plan.lipSync} lip sync`}
            />

            <ActivityItem
              title={`${formatReplies(
                plan.aiReplies
              )} AI replies`}
              time={
                plan.analytics ===
                "None"
                  ? "Analytics not included"
                  : `${plan.analytics} analytics`
              }
            />

            <ActivityItem
              title={`${formatLimit(
                plan.teamSeats
              )} team seat(s)`}
              time={
                plan.branding
              }
            />

            {plan.storeIntegrations && (
              <ActivityItem
                title="Store integrations"
                time="Shopify, WooCommerce, WordPress and Stripe"
              />
            )}

            {plan.apiAccess && (
              <ActivityItem
                title="Agency tools"
                time="API access, white-label branding and custom integrations"
              />
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          UPGRADE
      ====================================================== */}

      {isBrandCreator &&
        plan.key !== "agency" && (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black brand-text">
                Need more capacity?
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Upgrade for more AI Twins, products, platforms, replies and analytics.
              </p>
            </div>

            <Link
              to="/pricing"
              className="brand-gradient flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-black text-white"
            >
              View Pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  change,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {label}
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight brand-text sm:text-3xl">
            {value}
          </h2>

          <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {change}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  desc,
  to,
  locked = false,
}) {
  return (
    <Link
      to={to}
      className="relative rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg"
    >
      {locked && (
        <span className="absolute right-4 top-4 rounded-full bg-orange-50 p-2 text-orange-500 dark:bg-orange-500/10">
          <Lock className="h-4 w-4" />
        </span>
      )}

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-base font-black tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {desc}
      </p>
    </Link>
  );
}

function Progress({
  label,
  value,
}) {
  const safeValue =
    Math.min(
      Math.max(
        Math.round(
          Number(value) ||
            0
        ),
        0
      ),
      100
    );

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-sm font-bold text-foreground">
          {label}
        </span>

        <span className="text-sm font-bold text-[var(--brand-pink)]">
          {safeValue}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-pink-100 dark:bg-white/10">
        <div
          className="brand-gradient h-2 rounded-full"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>

      <span className="text-sm font-black text-foreground">
        {value}
      </span>
    </div>
  );
}

function SocialCard({
  icon: Icon,
  name,
  connected,
  allowed,
}) {
  let status =
    "Not connected";

  if (!allowed) {
    status =
      "Upgrade";
  } else if (connected) {
    status =
      "Connected";
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[var(--brand-pink)]" />

        <p className="text-sm font-black text-foreground">
          {name}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          connected
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            : allowed
              ? "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
              : "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function ActivityItem({
  title,
  time,
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-background p-4">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

      <div>
        <p className="text-sm font-bold leading-6 text-foreground">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {time}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-black text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}