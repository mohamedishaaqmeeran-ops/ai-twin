// src/pages/products/Products.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Plus,
  Search,
  Package,
  Radio,
  ShoppingBag,
  TrendingUp,
  Tag,
  Crown,
  Lock,
  AlertCircle,
  RefreshCw,
  Zap,
  Rocket,
  Building2,
} from "lucide-react";

import {
  fetchMe,
} from "../../features/auth/authSlice";

import {
  fetchProducts,
  setSelectedProduct,
} from "../../features/products/productSlice";

/* =========================================================
   PLAN CONFIGURATION
========================================================= */

const PLAN_CONFIG = {
  free: {
    name: "Free Trial",
    maxProducts: 10,
    icon: ShoppingBag,
    badge: "FREE TRIAL",
    description:
      "Free Trial supports up to 10 products.",
  },

  starter: {
    name: "Starter",
    maxProducts: 30,
    icon: Zap,
    badge: "STARTER PLAN",
    description:
      "Starter supports up to 30 products.",
  },

  pro: {
    name: "Pro",
    maxProducts: 100,
    icon: Crown,
    badge: "PRO PLAN",
    description:
      "Pro supports up to 100 products.",
  },

  business: {
    name: "Business",
    maxProducts: Infinity,
    icon: Rocket,
    badge: "BUSINESS PLAN",
    description:
      "Business supports unlimited products.",
  },

  agency: {
    name: "Agency",
    maxProducts: Infinity,
    icon: Building2,
    badge: "AGENCY PLAN",
    description:
      "Agency supports unlimited products.",
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

const normalizePlan = (plan) => {
  const value = normalizeValue(plan);

  const plans = {
    free: "free",
    freetrial: "free",
    trial: "free",

    starter: "starter",

    pro: "pro",

    business: "business",

    agency: "agency",
  };

  return plans[value] || "free";
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

/* =========================================================
   PRODUCTS PAGE
========================================================= */

export default function Products() {
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

  const {
    products = [],
    loading = false,
    error = "",
  } = useSelector(
    (state) =>
      state.product || {}
  );

  const [query, setQuery] =
    useState("");

  const [filter, setFilter] =
    useState(
      "All Products"
    );

  /* =========================================================
     USER ROLE AND PLAN
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

  const hasUnlimitedRole =
    isAdmin ||
    isManager;

  const currentPlanConfig =
    PLAN_CONFIG[plan] ||
    PLAN_CONFIG.free;

  const PlanIcon =
    hasUnlimitedRole
      ? Crown
      : currentPlanConfig.icon;

  const maxProducts =
    hasUnlimitedRole
      ? Infinity
      : currentPlanConfig.maxProducts;

  const canCreateProducts =
    isAdmin ||
    isManager ||
    isBrandCreator;

    const canEditProducts =
  isAdmin ||
  isManager ||
  isBrandCreator;

const canDeleteProducts =
  isAdmin ||
  isManager ||
  isBrandCreator;

const canViewProducts =
  isAdmin ||
  isManager ||
  isBrandCreator ||
  isContentCreator;

const canSellLive =
  isAdmin ||
  isManager ||
  isBrandCreator;

  const productList =
    Array.isArray(
      products
    )
      ? products
      : [];

  const productCount =
    productList.length;

  const hasUnlimitedProducts =
    maxProducts ===
    Infinity;

  const reachedLimit =
    !hasUnlimitedProducts &&
    productCount >=
      maxProducts;

  const canAddProduct =
    canCreateProducts &&
    !reachedLimit;

  const remainingProducts =
    hasUnlimitedProducts
      ? Infinity
      : Math.max(
          maxProducts -
            productCount,
          0
        );

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    if (!user?.role) {
    dispatch(fetchMe());
}

    dispatch(
      fetchProducts()
    );
  }, [dispatch]);

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts =
    useMemo(() => {
      const search =
        query
          .trim()
          .toLowerCase();

      return productList.filter(
        (product) => {
          const productStatus =
            String(
              product?.status ||
                "active"
            )
              .trim()
              .toLowerCase();

          const searchableText =
            [
              product?.name,
              product?.category,
              product?.status,
              product?.description,
              product?.script,
            ]
              .filter(
                Boolean
              )
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            !search ||
            searchableText.includes(
              search
            );

          const matchesFilter =
            filter ===
              "All Products" ||
            productStatus ===
              filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      productList,
      query,
      filter,
    ]);

  /* =========================================================
     PRODUCT COUNTS
  ========================================================= */

  const activeCount =
    productList.filter(
      (product) =>
        String(
          product?.status ||
            ""
        ).toLowerCase() ===
        "active"
    ).length;

  const draftCount =
    productList.filter(
      (product) =>
        String(
          product?.status ||
            ""
        ).toLowerCase() ===
        "draft"
    ).length;

  const inactiveCount =
    productList.filter(
      (product) =>
        String(
          product?.status ||
            ""
        ).toLowerCase() ===
        "inactive"
    ).length;

  /* =========================================================
     ACTIONS
  ========================================================= */

  const refreshProducts =
    () => {
      dispatch(
        fetchProducts()
      );
    };

  const upgradePlan =
    () => {
      navigate(
        "/pricing"
      );
    };

  const selectProductForLive =
    (product) => {
      dispatch(
        setSelectedProduct(
          product
        )
      );

      navigate(
        "/app/golive",
        {
          state: {
            selectedProduct:
              product,
          },
        }
      );
    };

  const handleAddProduct =
    () => {
      if (
        !canCreateProducts
      ) {
        return;
      }

      if (reachedLimit) {
        upgradePlan();
        return;
      }

      navigate(
        "/app/products/add"
      );
    };

  /* =========================================================
     PLAN DISPLAY
  ========================================================= */

  const planDisplayName =
    hasUnlimitedRole
      ? isAdmin
        ? "Admin"
        : "Manager"
      : currentPlanConfig.name;

  const planBadge =
    hasUnlimitedRole
      ? "UNLIMITED ACCESS"
      : currentPlanConfig.badge;

  const productLimitText =
    hasUnlimitedProducts
      ? `${productCount} / Unlimited`
      : `${productCount} / ${maxProducts}`;

const analyticsLevel =
  isAdmin
    ? "Enterprise"
    : isManager
    ? "Manager"
    : plan === "agency"
    ? "Agency"
    : plan === "business"
    ? "Business"
    : plan === "pro"
    ? "Live Sales"
    : "Basic";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <PlanIcon className="h-4 w-4 text-[var(--brand-pink)]" />

                AI TWIN PRODUCTS
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-black text-white">
                <PlanIcon className="h-4 w-4" />

                {planBadge}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              <span className="brand-text">
                Products
              </span>
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-muted-foreground">
              Manage product
              details, images,
              stock, AI sales
              scripts and live
              selling status.
            </p>

            <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]">
                    <PlanIcon className="h-4 w-4" />

                    {planDisplayName}{" "}
                    Product Limit
                  </p>

                  <p className="mt-1 text-sm font-bold text-foreground">
                    {productLimitText}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {hasUnlimitedRole
                      ? "Your role has unlimited product access."
                      : currentPlanConfig.description}
                  </p>

                  {!hasUnlimitedProducts &&
                    !reachedLimit && (
                      <p className="mt-1 text-xs font-bold text-emerald-600">
                        {
                          remainingProducts
                        }{" "}
                        product
                        {remainingProducts ===
                        1
                          ? ""
                          : "s"}{" "}
                        remaining
                      </p>
                    )}

                  {reachedLimit && (
                    <p className="mt-1 text-xs font-black text-orange-600 dark:text-orange-400">
                      Product
                      limit
                      reached.
                      Upgrade to
                      add more
                      products.
                    </p>
                  )}
                </div>

                {!hasUnlimitedProducts &&
                  plan !==
                    "agency" && (
                    <button
                      type="button"
                      onClick={
                        upgradePlan
                      }
                      className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white transition hover:opacity-90"
                    >
                      <Crown className="h-4 w-4" />

                      View Plans
                    </button>
                  )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={
                refreshProducts
              }
              disabled={
                loading
              }
              className="flex h-12 items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-5 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-50"
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

            {canCreateProducts && (
              <button
                type="button"
                onClick={
                  handleAddProduct
                }
                className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
              >
                {reachedLimit ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {reachedLimit
                  ? "Upgrade to Add"
                  : "Add Product"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT CREATOR NOTICE
      ===================================================== */}

      {isContentCreator && (
        <section className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm font-bold text-blue-600 dark:text-blue-400">
          <Lock className="h-5 w-5 shrink-0" />

          Your Content
          Creator role has
          read-only product
          access.
        </section>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <section className="flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />

            <span>
              {error}
            </span>
          </div>

          <button
            type="button"
            onClick={
              refreshProducts
            }
            className="rounded-[5px] border border-red-500/30 px-4 py-2 text-xs font-black transition hover:bg-red-500/10"
          >
            Try Again
          </button>
        </section>
      )}

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={Package}
          label="Total Products"
          value={
            loading
              ? "..."
              : productLimitText
          }
        />

        <StatCard
          icon={Radio}
          label="Live Ready"
          value={
            loading
              ? "..."
              : activeCount
          }
        />

        <StatCard
          icon={Tag}
          label="Draft"
          value={
            loading
              ? "..."
              : draftCount
          }
        />

        <StatCard
          icon={Lock}
          label="Inactive"
          value={
            loading
              ? "..."
              : inactiveCount
          }
        />

        <StatCard
          icon={TrendingUp}
          label="Analytics"
          value={
            analyticsLevel
          }
        />
      </section>

      {/* =====================================================
          SEARCH AND FILTER
      ===================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

            <input
              value={query}
              onChange={(
                event
              ) =>
                setQuery(
                  event.target
                    .value
                )
              }
              placeholder="Search products by name, category, description or status..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <select
            value={filter}
            onChange={(
              event
            ) =>
              setFilter(
                event.target
                  .value
              )
            }
            className="rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold text-foreground outline-none transition focus:border-[var(--brand-pink)]"
          >
            <option value="All Products">
              All Products
            </option>

            <option value="active">
              Active
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>
      </section>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <section className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[var(--brand-pink)]" />

          <p className="mt-4 text-sm font-bold text-muted-foreground">
            Loading
            products...
          </p>
        </section>
      )}

      {/* =====================================================
          PRODUCTS GRID
      ===================================================== */}

      {!loading &&
        filteredProducts.length >
          0 && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map(
              (
                product
              ) => {
                const productId =
                  product?._id ||
                  product?.id;

                const image =
                  product
                    ?.images?.[0] ||
                  product?.image ||
                  product?.img ||
                  "/images/product1.png";

                const price =
                  Number(
                    product?.price ||
                      0
                  );

                const salePrice =
                  Number(
                    product?.salePrice ||
                      0
                  );

                const displayPrice =
                  salePrice > 0
                    ? salePrice
                    : price;

                const hasDiscount =
                  salePrice > 0 &&
                  salePrice <
                    price;

                const stock =
                  Number(
                    product?.stock ||
                      0
                  );

                const status =
                  String(
                    product?.status ||
                      "active"
                  )
                    .trim()
                    .toLowerCase();

                return (
                  <article
                    key={
                      productId
                    }
                    className="group flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link
                      to={`/app/products/${productId}`}
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-pink-50 p-4 dark:bg-white/10">
                        {(plan ===
                          "pro" ||
                          plan ===
                            "business" ||
                          plan ===
                            "agency" ||
                          hasUnlimitedRole) && (
                          <span className="absolute bottom-3 right-3 z-10 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                            ADVANCED
                            SELLING
                          </span>
                        )}

                        <img
                          src={
                            image
                          }
                          alt={
                            product?.name ||
                            "Product"
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "/images/product1.png";
                          }}
                          className="h-52 w-full rounded-2xl object-contain transition duration-300 group-hover:scale-105"
                        />

                        <span className="absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-xs font-black capitalize tracking-wide text-[var(--brand-pink)] shadow-sm">
                          {
                            status
                          }
                        </span>

                        <span className="absolute right-3 top-3 max-w-[55%] truncate rounded-full bg-[#0d0d12] px-3 py-1 text-xs font-bold tracking-wide text-white">
                          {product?.category ||
                            "General"}
                        </span>
                      </div>
                    </Link>

                    <div className="mt-5 flex-1">
                      <h3 className="line-clamp-2 text-lg font-black tracking-tight text-foreground">
                        {product?.name ||
                          "Unnamed Product"}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-end gap-2">
                        <p className="text-xl font-black text-[var(--brand-pink)]">
                          ₹
                          {formatCurrency(
                            displayPrice
                          )}
                        </p>

                        {hasDiscount && (
                          <p className="pb-1 text-xs font-bold text-muted-foreground line-through">
                            ₹
                            {formatCurrency(
                              price
                            )}
                          </p>
                        )}
                      </div>

                      <p
                        className={`mt-2 text-sm font-bold ${
                          stock <= 0
                            ? "text-red-500"
                            : stock <=
                              5
                            ? "text-orange-500"
                            : "text-emerald-600"
                        }`}
                      >
                        {stock <= 0
                          ? "Out of Stock"
                          : `${stock} in stock`}
                      </p>

                      {product?.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {
                            product.description
                          }
                        </p>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          selectProductForLive(
                            product
                          )
                        }
                        disabled={
    stock <= 0 ||
    !canSellLive
}
                        className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-2 text-sm font-bold tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Radio className="h-4 w-4 shrink-0" />

                        {
    canSellLive
        ? stock <= 0
            ? "No Stock"
            : "Sell Live"
        : "View Only"
}
                      </button>

                      <Link
                        to={`/app/products/${productId}`}
                        className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border bg-background px-2 text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)]"
                      >
                        <Package className="h-4 w-4 shrink-0" />

                        Details
                      </Link>
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading &&
        filteredProducts.length ===
          0 && (
          <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <Package className="mx-auto h-11 w-11 text-[var(--brand-pink)]" />

            <h2 className="mt-4 text-xl font-black tracking-tight text-foreground">
              No products
              found
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {productCount ===
              0
                ? "Add your first product to start training and selling with your AI Twin."
                : "No products match the selected search or status filter."}
            </p>

            {productCount ===
              0 &&
              canAddProduct && (
                <button
                  type="button"
                  onClick={
                    handleAddProduct
                  }
                  className="brand-gradient mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
                >
                  <Plus className="h-4 w-4" />

                  Add Product
                </button>
              )}
          </section>
        )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 truncate text-2xl font-black tracking-tight brand-text">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}