// src/pages/products/AddProduct.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Upload,
  Sparkles,
  Save,
  ArrowLeft,
  Package,
  IndianRupee,
  Tag,
  Boxes,
  FileText,
  Megaphone,
  CheckCircle2,
  Trash2,
  Crown,
  Lock,
  Percent,
  AlertCircle,
  Zap,
  Rocket,
  Building2,
  RefreshCw,
  ImagePlus,
} from "lucide-react";

import {
  fetchMe,
} from "../../features/auth/authSlice";

import {
  createProduct,
  fetchProducts,
  clearProductError,
} from "../../features/products/productSlice";

/* =========================================================
   PLAN CONFIGURATION
========================================================= */

const PLAN_CONFIG = {
  free: {
    name: "Free Trial",
    badge: "FREE TRIAL",
    maxProducts: 10,
    maxImages: 1,
    advancedSelling: false,
    icon: Sparkles,
  },

  starter: {
    name: "Starter",
    badge: "STARTER PLAN",
    maxProducts: 30,
    maxImages: 3,
    advancedSelling: false,
    icon: Zap,
  },

  pro: {
    name: "Pro",
    badge: "PRO PLAN",
    maxProducts: 100,
    maxImages: 10,
    advancedSelling: true,
    icon: Crown,
  },

  business: {
    name: "Business",
    badge: "BUSINESS PLAN",
    maxProducts: Infinity,
    maxImages: 20,
    advancedSelling: true,
    icon: Rocket,
  },

  agency: {
    name: "Agency",
    badge: "AGENCY PLAN",
    maxProducts: Infinity,
    maxImages: 20,
    advancedSelling: true,
    icon: Building2,
  },
};

/* =========================================================
   INITIAL FORM
========================================================= */

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  salePrice: "",
  category: "",
  stock: "",
  description: "",
  script: "",
  offer: "",
  objectionHandling: "",
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
    value ===
      "freetrial" ||
    value === "trial"
  ) {
    return "free";
  }

  if (
    value === "starter"
  ) {
    return "starter";
  }

  if (value === "pro") {
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

const revokeImageUrls = (
  imageList
) => {
  imageList.forEach(
    (image) => {
      if (image?.url) {
        URL.revokeObjectURL(
          image.url
        );
      }
    }
  );
};

/* =========================================================
   ADD PRODUCT
========================================================= */

export default function AddProduct() {
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
  saving = false,
  error = "",
  saveError = "",
} = useSelector((state) => state.product || {});



  const [product, setProduct] =
    useState(
      INITIAL_PRODUCT
    );

  const [images, setImages] =
    useState([]);

  const [saved, setSaved] =
    useState(false);

  const [validationError, setValidationError] =
    useState("");


    const creating = saving;

const currentError =
  validationError ||
  saveError ||
  error;
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

  const canCreateProducts =
    isAdmin ||
    isManager ||
    isBrandCreator;

  const hasUnlimitedRole =
    isAdmin ||
    isManager;

  const currentPlan =
    PLAN_CONFIG[plan] ||
    PLAN_CONFIG.free;

  const PlanIcon =
    hasUnlimitedRole
      ? Crown
      : currentPlan.icon;

  const planName =
    hasUnlimitedRole
      ? isAdmin
        ? "Admin"
        : "Manager"
      : currentPlan.name;

  const planBadge =
    hasUnlimitedRole
      ? "UNLIMITED ACCESS"
      : currentPlan.badge;

  const maxProducts =
    hasUnlimitedRole
      ? Infinity
      : currentPlan.maxProducts;

  const maxImages =
    hasUnlimitedRole
      ? 20
      : currentPlan.maxImages;

  const hasAdvancedSelling =
    hasUnlimitedRole ||
    currentPlan
      .advancedSelling;

  const productList =
    Array.isArray(
      products
    )
      ? products
      : [];

  const existingCount =
    productList.length;

  const reachedLimit =
    maxProducts !==
      Infinity &&
    existingCount >=
      maxProducts;

  const remainingProducts =
    maxProducts ===
    Infinity
      ? Infinity
      : Math.max(
          maxProducts -
            existingCount,
          0
        );

  /* =========================================================
     LOAD USER AND PRODUCTS
  ========================================================= */

  useEffect(() => {
    if (!user?.role) {
    dispatch(fetchMe());
}

    dispatch(
      fetchProducts()
    );

    dispatch(
      clearProductError()
    );
  }, [dispatch]);

  /* =========================================================
     CLEAN IMAGE PREVIEWS
  ========================================================= */

  useEffect(() => {
    return () => {
      revokeImageUrls(
        images
      );
    };
  }, [images]);

  /* =========================================================
     INPUT STYLES
  ========================================================= */

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-500/20";

  const textareaClass =
    "w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-500/20";

  /* =========================================================
     FORM ACTIONS
  ========================================================= */

  const updateField = (
    field,
    value
  ) => {
    setProduct(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

    if (
      validationError
    ) {
      setValidationError(
        ""
      );
    }
  };

  const upgradePlan =
    () => {
      navigate(
        "/pricing"
      );
    };

  const handleImageUpload =
    (event) => {
      const selectedFiles =
        Array.from(
          event.target
            .files || []
        );

      event.target.value =
        "";

      if (
        selectedFiles.length ===
        0
      ) {
        return;
      }

      const validFiles =
        selectedFiles.filter(
          (file) =>
            file.type.startsWith(
              "image/"
            )
        );

      if (
        validFiles.length !==
        selectedFiles.length
      ) {
        setValidationError(
          "Only image files are allowed."
        );
      }

      const availableSlots =
        Math.max(
          maxImages -
            images.length,
          0
        );

      if (
        availableSlots ===
        0
      ) {
        setValidationError(
          `Your ${planName} plan supports up to ${maxImages} image${
            maxImages === 1
              ? ""
              : "s"
          } per product.`
        );

        return;
      }

      const filesToAdd =
        validFiles.slice(
          0,
          availableSlots
        );

      const newImages =
        filesToAdd.map(
          (file) => ({
            file,
            name: file.name,
            url:
              URL.createObjectURL(
                file
              ),
          })
        );

      setImages(
        (current) => [
          ...current,
          ...newImages,
        ]
      );

      if (
        validFiles.length >
        availableSlots
      ) {
        setValidationError(
          `Only ${availableSlots} more image${
            availableSlots ===
            1
              ? ""
              : "s"
          } can be added on your current plan.`
        );
      }
    };

  const removeImage = (
    index
  ) => {
    setImages(
      (current) => {
        const selected =
          current[index];

        if (
          selected?.url
        ) {
          URL.revokeObjectURL(
            selected.url
          );
        }

        return current.filter(
          (
            _,
            imageIndex
          ) =>
            imageIndex !==
            index
        );
      }
    );
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateProduct =
    () => {
      if (
        !canCreateProducts
      ) {
        return "Your role cannot create products.";
      }

      if (
        reachedLimit
      ) {
        return `Your ${planName} product limit has been reached.`;
      }

      if (
        !product.name.trim()
      ) {
        return "Product name is required.";
      }

      const price =
        Number(
          product.price
        );

      if (
        !product.price ||
        Number.isNaN(
          price
        ) ||
        price <= 0
      ) {
        return "Enter a valid product price.";
      }

      const salePrice =
        Number(
          product.salePrice ||
            0
        );

      if (
        product.salePrice &&
        (Number.isNaN(
          salePrice
        ) ||
          salePrice < 0)
      ) {
        return "Enter a valid sale price.";
      }

      if (
        salePrice > 0 &&
        salePrice >= price
      ) {
        return "Sale price must be lower than the regular price.";
      }

      const stock =
        Number(
          product.stock ||
            0
        );

      if (
        Number.isNaN(
          stock
        ) ||
        stock < 0
      ) {
        return "Stock cannot be negative.";
      }

      return "";
    };

  /* =========================================================
     SAVE PRODUCT
  ========================================================= */

  const saveProduct =
    async () => {
      dispatch(
        clearProductError()
      );

      setSaved(false);
      setValidationError(
        ""
      );

      const validationMessage =
        validateProduct();

      if (
        validationMessage
      ) {
        setValidationError(
          validationMessage
        );

        if (
          reachedLimit
        ) {
          upgradePlan();
        }

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "name",
        product.name.trim()
      );

      formData.append(
        "price",
        String(
          Number(
            product.price
          )
        )
      );

      formData.append(
        "salePrice",
        String(
          Number(
            product.salePrice ||
              0
          )
        )
      );

      formData.append(
        "category",
        product.category.trim() ||
          "General"
      );

      formData.append(
        "stock",
        String(
          Number(
            product.stock ||
              0
          )
        )
      );

      formData.append(
        "description",
        product.description.trim()
      );

      formData.append(
        "script",
        product.script.trim()
      );

      formData.append(
        "offer",
        hasAdvancedSelling
          ? product.offer.trim()
          : ""
      );

      formData.append(
        "objectionHandling",
        hasAdvancedSelling
          ? product.objectionHandling.trim()
          : ""
      );

      formData.append(
        "status",
        product.script.trim()
          ? "active"
          : "draft"
      );

      images.forEach(
        (image) => {
          if (
            image?.file
          ) {
            formData.append(
              "images",
              image.file
            );
          }
        }
      );

      try {
        await dispatch(
          createProduct(
            formData
          )
        ).unwrap();

        setSaved(true);

        revokeImageUrls(
          images
        );

        setImages([]);

        setProduct(
          INITIAL_PRODUCT
        );

        navigate(
          "/app/products",
          {
            replace: true,
          }
        );
      } catch (
        createError
      ) {
        const message =
          createError?.message ||
          createError ||
          "Unable to save product.";

        setValidationError(
          String(message)
        );
      }
    };

  /* =========================================================
     DERIVED VALUES
  ========================================================= */

  const canSave =
    Boolean(
      product.name.trim()
    ) &&
    Boolean(
      product.price
    ) &&
    !reachedLimit &&
    canCreateProducts &&
    !creating;

  const displayPrice =
    Number(
      product.salePrice ||
        product.price ||
        0
    );

  const regularPrice =
    Number(
      product.price ||
        0
    );

  const salePrice =
    Number(
      product.salePrice ||
        0
    );

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

  const imageLimitText =
    maxImages === 1
      ? "1 image"
      : `${maxImages} images`;

  const productLimitText =
    maxProducts ===
    Infinity
      ? `${existingCount} / Unlimited`
      : `${existingCount} / ${maxProducts}`;



  const sellingStatus =
    useMemo(() => {
      if (
        !product.script.trim()
      ) {
        return "Add a sales script to make this product live-ready.";
      }

      if (
        hasAdvancedSelling
      ) {
        return "Ready for advanced live selling.";
      }

      return "Ready to sell during live sessions.";
    }, [
      product.script,
      hasAdvancedSelling,
    ]);

  /* =========================================================
     ACCESS BLOCK
  ========================================================= */

  if (
    user &&
    !canCreateProducts
  ) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <Lock className="mx-auto h-11 w-11 text-[var(--brand-pink)]" />

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Product creation
          unavailable
        </h1>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Your current account
          role has read-only
          product access.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/products"
            )
          }
          className="brand-gradient mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Products
        </button>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-foreground">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/app/products"
            )
          }
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Products
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
            <PlanIcon className="h-4 w-4 text-[var(--brand-pink)]" />

            ADD PRODUCT
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-black text-white">
            <PlanIcon className="h-4 w-4" />

            {planBadge}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">
            Add New
          </span>{" "}
          Product
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Add product details,
          pricing, stock, images
          and the sales script your
          AI Twin will use during
          live sessions.
        </p>

        <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]">
                <PlanIcon className="h-4 w-4" />

                {planName} Product
                Limit
              </p>

              <p className="mt-1 text-sm font-bold text-foreground">
                {loading
                  ? "Loading..."
                  : productLimitText}
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your plan supports{" "}
                {maxProducts ===
                Infinity
                  ? "unlimited products"
                  : `up to ${maxProducts} products`}{" "}
                and {imageLimitText}{" "}
                per product.
              </p>

              {!reachedLimit &&
                remainingProducts !==
                  Infinity && (
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
            </div>

            {!hasUnlimitedRole &&
              plan !==
                "agency" && (
                <button
                  type="button"
                  onClick={
                    upgradePlan
                  }
                  className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
                >
                  <Crown className="h-4 w-4" />

                  View Plans
                </button>
              )}
          </div>
        </div>

        {reachedLimit && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
            <Lock className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p>
                Product limit
                reached.
              </p>

              <p className="mt-1 font-medium">
                Upgrade your plan
                to add more
                products.
              </p>
            </div>
          </div>
        )}

        {currentError && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <span>
              {currentError}
            </span>
          </div>
        )}
      </section>

      {/* =====================================================
          FORM AND PREVIEW
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* ===================================================
            FORM
        =================================================== */}

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          {/* IMAGE UPLOAD */}

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-accent">
            <Upload className="h-7 w-7 text-[var(--brand-pink)]" />

            <p className="mt-3 text-base font-black">
              Upload product
              images
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              PNG, JPG and WEBP
              supported. Your{" "}
              {planName} plan
              supports{" "}
              {imageLimitText}.
            </p>

            <input
              type="file"
              multiple={
                maxImages > 1
              }
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleImageUpload
              }
              disabled={
                reachedLimit ||
                creating
              }
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-black text-foreground">
                  <ImagePlus className="h-4 w-4 text-[var(--brand-pink)]" />

                  Product Images
                </p>

                <p className="text-xs font-bold text-muted-foreground">
                  {images.length}/
                  {maxImages}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="relative rounded-2xl border border-border bg-background p-3"
                    >
                      <img
                        src={
                          image.url
                        }
                        alt={
                          image.name
                        }
                        className="h-32 w-full rounded-xl object-contain"
                      />

                      {index ===
                        0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                          PRIMARY
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card text-red-500 shadow transition hover:bg-red-50 dark:hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* BASIC INFORMATION */}

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field
              icon={Package}
              label="Product Name"
              required
            >
              <input
                value={
                  product.name
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "name",
                    event.target
                      .value
                  )
                }
                className={
                  inputClass
                }
                placeholder="Vitamin C Glow Serum"
              />
            </Field>

            <Field
              icon={
                IndianRupee
              }
              label="Regular Price"
              required
            >
              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  product.price
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "price",
                    event.target
                      .value
                  )
                }
                className={
                  inputClass
                }
                placeholder="799"
              />
            </Field>

            <Field
              icon={Percent}
              label="Sale Price"
            >
              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  product.salePrice
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "salePrice",
                    event.target
                      .value
                  )
                }
                className={
                  inputClass
                }
                placeholder="699"
              />
            </Field>

            <Field
              icon={Tag}
              label="Category"
            >
              <input
                value={
                  product.category
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "category",
                    event.target
                      .value
                  )
                }
                className={
                  inputClass
                }
                placeholder="Beauty / Electronics"
              />
            </Field>

            <Field
              icon={Boxes}
              label="Stock Quantity"
            >
              <input
                type="number"
                min="0"
                step="1"
                value={
                  product.stock
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "stock",
                    event.target
                      .value
                  )
                }
                className={
                  inputClass
                }
                placeholder="100"
              />
            </Field>
          </div>

          {/* DESCRIPTION */}

          <Field
            icon={FileText}
            label="Product Description"
          >
            <textarea
              value={
                product.description
              }
              onChange={(
                event
              ) =>
                updateField(
                  "description",
                  event.target
                    .value
                )
              }
              className={
                textareaClass
              }
              rows="5"
              placeholder="Write the product benefits, ingredients, features and usage information..."
            />
          </Field>

          {/* SELLING SCRIPT */}

          <Field
            icon={Megaphone}
            label="AI Twin Sales Script"
          >
            <textarea
              value={
                product.script
              }
              onChange={(
                event
              ) =>
                updateField(
                  "script",
                  event.target
                    .value
                )
              }
              className={
                textareaClass
              }
              rows="5"
              placeholder="Introduce the product, explain the benefits, create urgency and ask viewers to buy..."
            />
          </Field>

          {/* ADVANCED FIELDS */}

          {hasAdvancedSelling ? (
            <>
              <Field
                icon={Percent}
                label="Discount Offer"
              >
                <textarea
                  value={
                    product.offer
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "offer",
                      event
                        .target
                        .value
                    )
                  }
                  className={
                    textareaClass
                  }
                  rows="4"
                  placeholder="Example: Today only 10% off, free shipping and limited stock..."
                />
              </Field>

              <Field
                icon={Sparkles}
                label="Objection Handling"
              >
                <textarea
                  value={
                    product.objectionHandling
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "objectionHandling",
                      event
                        .target
                        .value
                    )
                  }
                  className={
                    textareaClass
                  }
                  rows="4"
                  placeholder="Example: When a viewer says the price is high, explain the quality, benefits and available offer..."
                />
              </Field>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
              <p className="flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]">
                <Lock className="h-4 w-4" />

                Advanced fields
                locked
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Upgrade to Pro to
                add discount offers,
                objection handling
                and advanced live
                selling scripts.
              </p>

              <button
                type="button"
                onClick={
                  upgradePlan
                }
                className="mt-4 text-sm font-black text-[var(--brand-pink)] hover:underline"
              >
                View Pro plan
              </button>
            </div>
          )}

          {/* SAVE BUTTON */}

          <button
            type="button"
            onClick={
              saveProduct
            }
            disabled={
              !canSave
            }
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : reachedLimit ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {creating
              ? "Saving..."
              : reachedLimit
              ? "Upgrade Required"
              : "Save Product"}
          </button>
        </section>

        {/* ===================================================
            PREVIEW
        =================================================== */}

        <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:sticky xl:top-6">
          <h2 className="text-xl font-black brand-text">
            Product Preview
          </h2>

          <div className="mt-5 rounded-3xl border border-border bg-background p-4">
            <div className="relative overflow-hidden rounded-2xl bg-pink-50 p-3 dark:bg-white/10">
              {hasAdvancedSelling && (
                <span className="absolute right-3 top-3 z-10 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                  ADVANCED
                </span>
              )}

              {hasDiscount && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">
                  {
                    discountPercentage
                  }% OFF
                </span>
              )}

              <img
                src={
                  images[0]
                    ?.url ||
                  "/images/product1.png"
                }
                alt="Product Preview"
                className="h-64 w-full rounded-2xl object-contain"
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-foreground">
              {product.name ||
                "Product Name"}
            </h3>

            <div className="mt-2 flex flex-wrap items-end gap-2">
              <p className="text-2xl font-black brand-text">
                ₹
                {formatCurrency(
                  displayPrice
                )}
              </p>

              {hasDiscount && (
                <p className="pb-1 text-xs font-bold text-muted-foreground line-through">
                  ₹
                  {formatCurrency(
                    regularPrice
                  )}
                </p>
              )}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {product.category ||
                "Category"}{" "}
              · Stock:{" "}
              {product.stock ||
                "0"}
            </p>

            <div className="mt-5 rounded-2xl border border-border bg-accent p-4">
              <p className="text-sm font-bold text-[var(--brand-pink)]">
                AI Selling Status
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {sellingStatus}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-black">
                Product Description
              </p>

              <p className="mt-2 line-clamp-5 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {product.description ||
                  "Your product description will appear here."}
              </p>
            </div>

            {hasAdvancedSelling &&
              product.offer && (
                <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                  <p className="text-sm font-black">
                    Discount Offer
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {
                      product.offer
                    }
                  </p>
                </div>
              )}

            {hasAdvancedSelling &&
              product.objectionHandling && (
                <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                  <p className="text-sm font-black">
                    Objection
                    Handling
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {
                      product.objectionHandling
                    }
                  </p>
                </div>
              )}
          </div>

          {saved && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />

              Product saved
              successfully
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  icon: Icon,
  label,
  required = false,
  children,
}) {
  return (
    <div className="mt-5">
      <label className="mb-2 flex items-center gap-2 text-sm font-black text-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}