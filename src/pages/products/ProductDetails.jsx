// src/pages/products/ProductDetails.jsx

import {
  useEffect,
  useMemo,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Radio,
  Pencil,
  Trash2,
  ShoppingBag,
  Sparkles,
  Star,
  CheckCircle2,
  TrendingUp,
  Crown,
  Lock,
  Percent,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Zap,
  Rocket,
  Building2,
  Package,
  ArrowLeft,
} from "lucide-react";

import {
  fetchMe,
} from "../../features/auth/authSlice";

import {
  fetchProductById,
  deleteProduct,
  setSelectedProduct,
  clearSelectedProduct,
  clearProductError,
} from "../../features/products/productSlice";

/* =========================================================
   PLAN CONFIGURATION
========================================================= */

const PLAN_CONFIG = {
  free: {
    name: "Free Trial",
    badge: "FREE TRIAL",
    icon: ShoppingBag,
    advancedSelling: false,
    analytics: "Basic",
  },

  starter: {
    name: "Starter",
    badge: "STARTER PLAN",
    icon: Zap,
    advancedSelling: false,
    analytics: "Basic",
  },

  pro: {
    name: "Pro",
    badge: "PRO PLAN",
    icon: Crown,
    advancedSelling: true,
    analytics: "Live Sales",
  },

  business: {
    name: "Business",
    badge: "BUSINESS PLAN",
    icon: Rocket,
    advancedSelling: true,
    analytics: "Advanced",
  },

  agency: {
    name: "Agency",
    badge: "AGENCY PLAN",
    icon: Building2,
    advancedSelling: true,
    analytics: "Advanced",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const normalizeValue = (
  value
) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(
      /[\s_-]/g,
      ""
    );

const normalizePlan = (
  plan
) => {
  const value =
    normalizeValue(plan);

  if (
    value === "freetrial" ||
    value === "trial"
  ) {
    return "free";
  }

  if (
    value === "starter"
  ) {
    return "starter";
  }

  if (
    value === "pro"
  ) {
    return "pro";
  }

  if (
    value === "business"
  ) {
    return "business";
  }

  if (
    value === "agency"
  ) {
    return "agency";
  }

  return "free";
};

const normalizeRole = (role) => {
  const value = normalizeValue(role);

  const roles = {
    admin: "admin",
    manager: "manager",

    brandcreator: "brandcreator",
    brand_creator: "brandcreator",
    brandcreatoruser: "brandcreator",

    contentcreator: "contentcreator",
    content_creator: "contentcreator",

    user: "user",
  };

  return roles[value] || "user";
};

const formatCurrency = (
  value
) =>
  Number(value || 0)
    .toLocaleString(
      "en-IN"
    );

const getProductImage = (
  product
) =>
  product?.images?.[0] ||
  product?.image ||
  product?.img ||
  "/images/product1.png";

/* =========================================================
   PRODUCT DETAILS
========================================================= */

export default function ProductDetails() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const {
    user,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  const productState =
    useSelector(
      (state) =>
        state.product || {}
    );

 const {
  selectedProduct,
  detailsLoading = false,
  deleting = false,
  detailsError = "",
  deleteError = "",
} = useSelector(
  (state) =>
    state.product || {}
);

const productDetails =
  selectedProduct;

const loading =
  detailsLoading;

const error =
  detailsError ||
  deleteError;

  /*
   * Supports different property names in productSlice.
   * Recommended property name: selectedProduct.
   */


  /* =========================================================
     ROLE AND PLAN
  ========================================================= */

  const role =
    normalizeRole(
      user?.role
    );

  const plan =
    normalizePlan(
      user?.plan
    );

  const isAdmin =
    role === "admin";

  const isManager =
    role === "manager";

  const isBrandCreator =
    role ===
    "brandcreator";

  const isContentCreator =
    role ===
    "contentcreator";

  const hasFullRoleAccess =
    isAdmin ||
    isManager;

  const planConfig =
    PLAN_CONFIG[plan] ||
    PLAN_CONFIG.free;

  const hasAdvancedSelling =
    hasFullRoleAccess ||
    planConfig.advancedSelling;

  const canEdit =
    isAdmin ||
    isManager ||
    isBrandCreator;

  const canDelete =
    isAdmin ||
    isManager ||
    isBrandCreator;

    const canSellLive =
  isAdmin ||
  isManager ||
  isBrandCreator;
  const PlanIcon =
    hasFullRoleAccess
      ? Crown
      : planConfig.icon;

  const planBadge =
    hasFullRoleAccess
      ? "UNLIMITED ACCESS"
      : planConfig.badge;

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    if (!user?.role) {
      dispatch(fetchMe());
    }
  }, [
    dispatch,
    user,
  ]);

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(
      clearProductError()
    );

    dispatch(
      fetchProductById(id)
    );

    return () => {
      dispatch(
        clearSelectedProduct()
      );
    };
  }, [
    dispatch,
    id,
  ]);

  /* =========================================================
     DERIVED PRODUCT DATA
  ========================================================= */

  const productId =
    productDetails?._id ||
    productDetails?.id ||
    id;

  const image =
    getProductImage(
      productDetails
    );

  const regularPrice =
    Number(
      productDetails?.price ||
        0
    );

  const salePrice =
    Number(
      productDetails?.salePrice ||
        0
    );

  const displayPrice =
    salePrice > 0
      ? salePrice
      : regularPrice;

  const hasDiscount =
    salePrice > 0 &&
    regularPrice > 0 &&
    salePrice <
      regularPrice;

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((regularPrice -
            salePrice) /
            regularPrice) *
            100
        )
      : 0;

  const stock =
    Number(
      productDetails?.stock ||
        0
    );

  const status =
    String(
      productDetails?.status ||
        "active"
    )
      .trim()
      .toLowerCase();

  const salesLabel =
    useMemo(() => {
      const sales =
        productDetails?.sales ??
        productDetails?.sold ??
        productDetails?.totalSales ??
        0;

      return `${sales} Sold`;
    }, [
      productDetails,
    ]);

  const ratingLabel =
    useMemo(() => {
      const rating =
        Number(
          productDetails?.rating ||
            0
        );

      if (
        rating > 0
      ) {
        return `${rating.toFixed(
          1
        )} Rating`;
      }

      return hasAdvancedSelling
        ? "No Rating"
        : "Basic";
    }, [
      productDetails,
      hasAdvancedSelling,
    ]);

  /* =========================================================
     ACTIONS
  ========================================================= */

  const refreshProduct =
    () => {
      if (!id) {
        return;
      }

      dispatch(
        fetchProductById(id)
      );
    };

  const sellLive =
    () => {
      if (
        !productDetails
      ) {
        return;
      }

      dispatch(
        setSelectedProduct(
          productDetails
        )
      );

      navigate(
        "/app/golive",
        {
          state: {
            selectedProduct:
              productDetails,
          },
        }
      );
    };

  const handleDeleteProduct =
    async () => {
      if (
        !productId ||
        !canDelete
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${
            productDetails?.name ||
            "this product"
          }"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(
          deleteProduct(
            productId
          )
        ).unwrap();

        navigate(
          "/app/products",
          {
            replace: true,
          }
        );
      } catch (deleteError) {
        window.alert(
          deleteError?.message ||
            deleteError ||
            "Unable to delete product."
        );
      }
    };

  const upgradePlan =
    () => {
      navigate(
        "/pricing"
      );
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading &&
    !productDetails
  ) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[var(--brand-pink)]" />

        <p className="mt-4 text-sm font-bold text-muted-foreground">
          Loading product
          details...
        </p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (
    error &&
    !productDetails
  ) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm font-bold text-red-600 dark:text-red-400">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p>
              {error}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={
                  refreshProduct
                }
                className="rounded-[5px] border border-red-500/30 px-5 py-3 text-sm font-bold transition hover:bg-red-500/10"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/app/products"
                  )
                }
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Back to
                Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     EMPTY PRODUCT
  ========================================================= */

  if (!productDetails) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <Package className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />

        <h2 className="mt-4 text-xl font-black text-foreground">
          Product not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This product may have
          been removed or you may
          not have permission to
          access it.
        </p>

        <Link
          to="/app/products"
          className="brand-gradient mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Products
        </Link>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            <PlanIcon className="h-4 w-4 text-[var(--brand-pink)]" />

            PRODUCT DETAILS
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-black text-white">
            <PlanIcon className="h-4 w-4" />

            {planBadge}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              <span className="brand-text">
                {productDetails?.name ||
                  "Product"}
              </span>
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-muted-foreground">
              {hasAdvancedSelling
                ? "View complete product information, live sales scripts, discount offers and objection handling."
                : "View the product information and selling script used by your AI Twin during live sessions."}
            </p>
          </div>

          <button
            type="button"
            onClick={
              refreshProduct
            }
            disabled={
              loading
            }
            className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-5 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {!hasAdvancedSelling && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Advanced
                  Product Selling
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Upgrade to Pro
                  for discount
                  offers, objection
                  handling, advanced
                  scripts and live
                  sales analytics.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  upgradePlan
                }
                className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
              >
                <Crown className="h-4 w-4" />

                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          READ-ONLY NOTICE
      ===================================================== */}

      {isContentCreator && (
        <section className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm font-bold text-blue-600 dark:text-blue-400">
          <Lock className="h-5 w-5 shrink-0" />

          Your Content Creator
          role has read-only
          product access.
        </section>
      )}

      {/* =====================================================
          NON-BLOCKING ERROR
      ===================================================== */}

      {error &&
        productDetails && (
          <section className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />

            {error}
          </section>
        )}

      {/* =====================================================
          PRODUCT CONTENT
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        {/* ===================================================
            IMAGE
        =================================================== */}

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="relative rounded-3xl bg-pink-50 p-5 dark:bg-white/10">
            {hasAdvancedSelling && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                ADVANCED SELLING
              </span>
            )}

            {hasDiscount && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">
                {discountPercentage}%
                OFF
              </span>
            )}

            <img
              src={image}
              alt={
                productDetails?.name ||
                "Product"
              }
              onError={(
                event
              ) => {
                event.currentTarget.src =
                  "/images/product1.png";
              }}
              className="h-80 w-full rounded-2xl object-contain sm:h-96"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat
              icon={
                TrendingUp
              }
              label={
                salesLabel
              }
              iconClass="text-[var(--brand-pink)]"
            />

            <MiniStat
              icon={Star}
              label={
                ratingLabel
              }
              iconClass="text-yellow-500"
            />

            <MiniStat
              icon={
                CheckCircle2
              }
              label={
                stock <= 0
                  ? "Out of Stock"
                  : `${stock} Stock`
              }
              iconClass={
                stock <= 0
                  ? "text-red-500"
                  : "text-green-500"
              }
            />
          </div>
        </section>

        {/* ===================================================
            PRODUCT INFORMATION
        =================================================== */}

        <section className="space-y-5">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {productDetails?.name ||
                    "Unnamed Product"}
                </h2>

                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <p className="text-3xl font-black tracking-tight brand-text">
                    ₹
                    {formatCurrency(
                      displayPrice
                    )}
                  </p>

                  {hasDiscount && (
                    <p className="pb-1 text-sm font-bold text-muted-foreground line-through">
                      ₹
                      {formatCurrency(
                        regularPrice
                      )}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-bold tracking-wide ${
                      stock <= 0
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        : stock <=
                          5
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    }`}
                  >
                    {stock <= 0
                      ? "Out of Stock"
                      : `${stock} in stock`}
                  </span>

                  <span className="inline-flex rounded-full bg-pink-50 px-4 py-2 text-sm font-bold capitalize text-[var(--brand-pink)] dark:bg-white/10">
                    {status}
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-[#0d0d12] px-4 py-2 text-sm font-bold tracking-wide text-white">
                {productDetails?.category ||
                  "General"}
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-black tracking-tight text-foreground">
                Description
              </h3>

              <p className="mt-3 whitespace-pre-line text-sm font-medium leading-7 text-muted-foreground">
                {productDetails?.description ||
                  "No product description added yet."}
              </p>
            </div>
          </div>

          {/* =================================================
              AI SELLING SCRIPT
          ================================================= */}

          <InfoBlock
            icon={Sparkles}
            title={
              hasAdvancedSelling
                ? "Advanced AI Twin Selling Script"
                : "AI Twin Selling Script"
            }
            text={
              productDetails?.script ||
              productDetails?.sellingScript ||
              "No AI selling script added yet. Add a script to help your AI Twin explain and sell this product during live sessions."
            }
          />

          {/* =================================================
              ADVANCED SELLING
          ================================================= */}

          {hasAdvancedSelling ? (
            <>
              <InfoBlock
                icon={Percent}
                title="Discount Offer"
                text={
                  productDetails?.offer ||
                  productDetails?.discountOffer ||
                  "No discount offer added yet."
                }
              />

              <InfoBlock
                icon={
                  MessageSquare
                }
                title="Objection Handling"
                text={
                  productDetails?.objectionHandling ||
                  productDetails?.objectionScript ||
                  "No objection handling script added yet."
                }
              />
            </>
          ) : (
            <div className="rounded-3xl border border-pink-200 bg-pink-50 p-5 shadow-sm dark:border-white/10 dark:bg-white/10 sm:p-6">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[var(--brand-pink)]" />

                <h3 className="text-xl font-black tracking-tight text-foreground">
                  Advanced Selling
                  Tools Locked
                </h3>
              </div>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                The Pro plan
                unlocks discount
                offers, objection
                handling, advanced
                selling scripts and
                live sales
                analytics.
              </p>

              <button
                type="button"
                onClick={
                  upgradePlan
                }
                className="brand-gradient mt-5 flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
              >
                <Crown className="h-4 w-4" />

                Upgrade to Pro
              </button>
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className={`grid gap-3 ${
              canEdit ||
              canDelete
                ? "sm:grid-cols-3"
                : "sm:grid-cols-1"
            }`}
          >
            <button
              type="button"
              onClick={
                sellLive
              }
              disabled={
    stock <= 0 ||
    status === "inactive" ||
    !canSellLive
}
              className="brand-gradient flex h-12 items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Radio className="h-4 w-4" />

              {
    !canSellLive
        ? "View Only"
        : stock <= 0
        ? "Out of Stock"
        : status === "inactive"
        ? "Product Inactive"
        : hasAdvancedSelling
        ? "Advanced Live"
        : "Sell Live"
}
            </button>

            {canEdit && (
              <Link
                to={`/app/products/edit/${productId}`}
                className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
              >
                <Pencil className="h-4 w-4" />

                Edit
              </Link>
            )}

            {canDelete && (
              <button
                type="button"
                onClick={
                  handleDeleteProduct
                }
                disabled={
                  deleting
                }
                className="flex h-12 items-center justify-center gap-2 rounded-[5px] border border-red-200 text-sm font-bold tracking-wide text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
              >
                {deleting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   INFO BLOCK
========================================================= */

function InfoBlock({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

        <h3 className="text-xl font-black tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-accent p-5">
        <p className="whitespace-pre-line text-sm font-medium leading-7 text-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  icon: Icon,
  label,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 text-center">
      <Icon
        className={`mx-auto h-5 w-5 ${iconClass}`}
      />

      <p className="mt-2 break-words text-xs font-bold tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}