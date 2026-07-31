// src/pages/products/EditProduct.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  ArrowLeft,
  Save,
  Package,
  IndianRupee,
  Tag,
  Boxes,
  FileText,
  Lock,
  Megaphone,
  Percent,
  Sparkles,
  AlertCircle,
  Upload,
  Trash2,
  Crown,
  Zap,
  Rocket,
  Building2,
  RefreshCw,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";

import {
  fetchMe,
} from "../../features/auth/authSlice";

import {
  fetchProductById,
  updateProduct,
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
    maxImages: 1,
    advancedSelling: false,
    icon: Sparkles,
  },

  starter: {
    name: "Starter",
    badge: "STARTER PLAN",
    maxImages: 3,
    advancedSelling: false,
    icon: Zap,
  },

  pro: {
    name: "Pro",
    badge: "PRO PLAN",
    maxImages: 10,
    advancedSelling: true,
    icon: Crown,
  },

  business: {
    name: "Business",
    badge: "BUSINESS PLAN",
    maxImages: 20,
    advancedSelling: true,
    icon: Rocket,
  },

  agency: {
    name: "Agency",
    badge: "AGENCY PLAN",
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
  status: "active",
  images: [],
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

const normalizeImages = (
  images
) => {
  if (
    !Array.isArray(images)
  ) {
    return [];
  }

  return images
    .map((image) => {
      if (
        typeof image ===
        "string"
      ) {
        return image;
      }

      return (
        image?.url ||
        image?.secure_url ||
        image?.path ||
        ""
      );
    })
    .filter(Boolean);
};

const revokePreviewUrls = (
  images
) => {
  images.forEach(
    (image) => {
      if (
        image?.url
      ) {
        URL.revokeObjectURL(
          image.url
        );
      }
    }
  );
};

/* =========================================================
   EDIT PRODUCT
========================================================= */

export default function EditProduct() {
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
  products = [],
  selectedProduct,
  loading = false,
  detailsLoading = false,
  saving = false,
  error = "",
  detailsError = "",
  saveError = "",
} = productState;

const fetchedProduct = selectedProduct;

  const [product, setProduct] =
    useState(
      INITIAL_PRODUCT
    );

  const [
    newImages,
    setNewImages,
  ] = useState([]);

  const [
    validationError,
    setValidationError,
  ] = useState("");

  const [saved, setSaved] =
    useState(false);

  const [
    initializedProductId,
    setInitializedProductId,
  ] = useState(null);
const updating = saving;
const currentError =
  validationError ||
  saveError ||
  error;
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

  const canEdit =
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

  const maxImages =
    hasUnlimitedRole
      ? 20
      : currentPlan.maxImages;

  const hasAdvancedSelling =
    hasUnlimitedRole ||
    currentPlan
      .advancedSelling;

  /* =========================================================
     LOAD USER AND PRODUCT
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
     POPULATE FORM
  ========================================================= */

  useEffect(() => {
    if (
      !fetchedProduct
    ) {
      return;
    }

    const fetchedId =
      fetchedProduct?._id ||
      fetchedProduct?.id ||
      id;

    if (
      initializedProductId ===
      fetchedId
    ) {
      return;
    }

    setProduct({
      name:
        fetchedProduct?.name ||
        "",

      price:
        fetchedProduct?.price ??
        "",

      salePrice:
        fetchedProduct
          ?.salePrice ?? "",

      category:
        fetchedProduct
          ?.category || "",

      stock:
        fetchedProduct?.stock ??
        "",

      description:
        fetchedProduct
          ?.description || "",

      script:
        fetchedProduct?.script ||
        fetchedProduct
          ?.sellingScript ||
        "",

      offer:
        fetchedProduct?.offer ||
        fetchedProduct
          ?.discountOffer ||
        "",

      objectionHandling:
        fetchedProduct
          ?.objectionHandling ||
        fetchedProduct
          ?.objectionScript ||
        "",

      status:
        fetchedProduct?.status ||
        "active",

      images:
        normalizeImages(
          fetchedProduct?.images ||
            [
              fetchedProduct?.image,
              fetchedProduct?.img,
            ].filter(Boolean)
        ),
    });

    setInitializedProductId(
      fetchedId
    );
  }, [
    fetchedProduct,
    id,
    initializedProductId,
  ]);

  /* =========================================================
     CLEAN IMAGE URLS
  ========================================================= */

  useEffect(() => {
    return () => {
      revokePreviewUrls(
        newImages
      );
    };
  }, [newImages]);

  /* =========================================================
     INPUT STYLES
  ========================================================= */

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-500/20";

  const textareaClass =
    "w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-500/20";

  /* =========================================================
     FIELD UPDATE
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

    if (saved) {
      setSaved(false);
    }
  };

  /* =========================================================
     IMAGE UPLOAD
  ========================================================= */

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
          "Only PNG, JPG and WEBP image files are supported."
        );
      }

      const availableSlots =
        Math.max(
          maxImages -
            newImages.length,
          0
        );

      if (
        availableSlots <= 0
      ) {
        setValidationError(
          `${planName} supports up to ${maxImages} image${
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

      const previews =
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

      setNewImages(
        (current) => [
          ...current,
          ...previews,
        ]
      );

      if (
        validFiles.length >
        availableSlots
      ) {
        setValidationError(
          `Only ${availableSlots} additional image${
            availableSlots === 1
              ? ""
              : "s"
          } can be selected.`
        );
      } else {
        setValidationError(
          ""
        );
      }
    };

  const removeOldImage = (
    index
  ) => {
    setProduct(
      (current) => ({
        ...current,

        images:
          current.images.filter(
            (
              _,
              imageIndex
            ) =>
              imageIndex !==
              index
          ),
      })
    );

    setSaved(false);
  };

  const removeNewImage = (
    index
  ) => {
    setNewImages(
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

    setSaved(false);
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateProduct =
    () => {
      if (!canEdit) {
        return "Your account role cannot edit products.";
      }

      if (
        !product.name.trim()
      ) {
        return "Product name is required.";
      }

      const regularPrice =
        Number(
          product.price
        );

      if (
        !product.price ||
        Number.isNaN(
          regularPrice
        ) ||
        regularPrice <= 0
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
        salePrice >=
          regularPrice
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

      const totalImages =
        newImages.length > 0
          ? newImages.length
          : product.images.length;

      if (
        totalImages >
        maxImages
      ) {
        return `${planName} supports up to ${maxImages} image${
          maxImages === 1
            ? ""
            : "s"
        } per product.`;
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

      setValidationError(
        ""
      );

      setSaved(false);

      const validationMessage =
        validateProduct();

      if (
        validationMessage
      ) {
        setValidationError(
          validationMessage
        );

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
        product.status ||
          "active"
      );

      /*
       * The backend can use this field to retain old images
       * when no replacement upload is supplied.
       */
      formData.append(
        "existingImages",
        JSON.stringify(
          product.images
        )
      );

      /*
       * New images replace existing images in the current
       * backend behaviour.
       */
      newImages.forEach(
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
          updateProduct({
            id,
            formData,
          })
        ).unwrap();

        setSaved(true);

        revokePreviewUrls(
          newImages
        );

        setNewImages([]);

        navigate(
          `/app/products/${id}`,
          {
            replace: true,
          }
        );
      } catch (
        updateError
      ) {
        const message =
          updateError?.message ||
          updateError ||
          "Unable to update product.";

        setValidationError(
          String(message)
        );
      }
    };

  /* =========================================================
     DERIVED VALUES
  ========================================================= */

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

  const previewImage =
    newImages[0]?.url ||
    product.images?.[0] ||
    "/images/product1.png";



  const totalSelectedImages =
    newImages.length > 0
      ? newImages.length
      : product.images.length;

  const canSave =
    canEdit &&
    Boolean(
      product.name.trim()
    ) &&
    Boolean(
      product.price
    ) &&
    !updating;

  const sellingStatus =
    useMemo(() => {
      if (
        product.status ===
        "inactive"
      ) {
        return "This product is inactive and cannot be used for live selling.";
      }

      if (
        product.status ===
        "draft"
      ) {
        return "This product is saved as a draft.";
      }

      if (
        !product.script.trim()
      ) {
        return "Add a sales script to make this product live-ready.";
      }

      if (
        hasAdvancedSelling
      ) {
        return "Ready for advanced AI live selling.";
      }

      return "Ready for AI live selling.";
    }, [
      product.status,
      product.script,
      hasAdvancedSelling,
    ]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading &&
    !fetchedProduct
  ) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[var(--brand-pink)]" />

        <p className="mt-4 text-sm font-bold text-muted-foreground">
          Loading product...
        </p>
      </div>
    );
  }

  /* =========================================================
     ACCESS DENIED
  ========================================================= */

  if (
    user &&
    !canEdit
  ) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <Lock className="mx-auto h-11 w-11 text-[var(--brand-pink)]" />

        <h1 className="mt-4 text-2xl font-black text-foreground">
          Product editing
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
              `/app/products/${id}`
            )
          }
          className="brand-gradient mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Product
        </button>
      </div>
    );
  }

  /* =========================================================
     FETCH ERROR
  ========================================================= */

  if (
    error &&
    !fetchedProduct &&
    !loading
  ) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

        <h1 className="mt-4 text-xl font-black text-red-600 dark:text-red-400">
          Unable to load
          product
        </h1>

        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              dispatch(
                fetchProductById(
                  id
                )
              )
            }
            className="rounded-[5px] border border-red-500/30 px-5 py-3 text-sm font-bold text-red-600"
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
            Back to Products
          </button>
        </div>
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
              `/app/products/${id}`
            )
          }
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Product
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            <PlanIcon className="h-4 w-4 text-[var(--brand-pink)]" />

            EDIT PRODUCT
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-black text-white">
            <PlanIcon className="h-4 w-4" />

            {planBadge}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">
            Edit
          </span>{" "}
          Product
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Update product
          information, pricing,
          stock, images, selling
          status and the scripts
          used by your AI Twin.
        </p>

        <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]">
                <PlanIcon className="h-4 w-4" />

                {planName} Image
                Limit
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your plan supports
                up to {maxImages}{" "}
                image
                {maxImages === 1
                  ? ""
                  : "s"}{" "}
                per product.
              </p>

              <p className="mt-1 text-xs font-bold text-foreground">
                Current selection:{" "}
                {
                  totalSelectedImages
                }
                /{maxImages}
              </p>
            </div>

            {!hasAdvancedSelling && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/pricing"
                  )
                }
                className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] px-5 text-sm font-bold text-white"
              >
                <Crown className="h-4 w-4" />

                View Pro
              </button>
            )}
          </div>
        </div>

        {currentError && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <span>
              {currentError}
            </span>
          </div>
        )}

        {saved && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />

            Product updated
            successfully.
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
              Upload new product
              images
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              New images replace the
              current product images.
              PNG, JPG and WEBP are
              supported.
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
                updating
              }
              className="hidden"
            />
          </label>

          {product.images.length >
            0 &&
            newImages.length ===
              0 && (
              <ImageGrid
                title="Current Images"
                images={product.images.map(
                  (
                    imageUrl,
                    index
                  ) => ({
                    url:
                      imageUrl,
                    name: `Product image ${
                      index +
                      1
                    }`,
                  })
                )}
                onRemove={
                  removeOldImage
                }
              />
            )}

          {newImages.length >
            0 && (
            <ImageGrid
              title="New Images"
              images={
                newImages
              }
              onRemove={
                removeNewImage
              }
            />
          )}

          {/* BASIC FIELDS */}

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
                placeholder="Product name"
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

            <Field
              icon={Tag}
              label="Status"
            >
              <select
                value={
                  product.status
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "status",
                    event.target
                      .value
                  )
                }
                className={
                  inputClass
                }
              >
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
              placeholder="Describe the product, benefits, features and usage..."
            />
          </Field>

          {/* SCRIPT */}

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
              placeholder="Add the script your AI Twin should use while selling this product..."
            />
          </Field>

          {/* ADVANCED SELLING */}

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
                  placeholder="Example: Today only 10% off with free shipping..."
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
                  placeholder="Explain how the AI Twin should respond to pricing, quality or delivery objections..."
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
                edit discount offers,
                objection handling
                and advanced selling
                scripts.
              </p>
            </div>
          )}

          {/* SAVE */}

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
            {updating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {updating
              ? "Saving..."
              : "Save Changes"}
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
                  previewImage
                }
                alt="Product Preview"
                onError={(
                  event
                ) => {
                  event.currentTarget.src =
                    "/images/product1.png";
                }}
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

            <p className="mt-2 text-sm font-bold capitalize text-[var(--brand-pink)]">
              Status:{" "}
              {product.status}
            </p>

            <div className="mt-5 rounded-2xl border border-border bg-accent p-4">
              <p className="text-sm font-black text-[var(--brand-pink)]">
                AI Selling Status
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {sellingStatus}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-black">
                Description
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

/* =========================================================
   IMAGE GRID
========================================================= */

function ImageGrid({
  title,
  images,
  onRemove,
}) {
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-black text-foreground">
          <ImagePlus className="h-4 w-4 text-[var(--brand-pink)]" />

          {title}
        </p>

        <p className="text-xs font-bold text-muted-foreground">
          {images.length}{" "}
          image
          {images.length === 1
            ? ""
            : "s"}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {images.map(
          (
            image,
            index
          ) => (
            <div
              key={`${image.url}-${index}`}
              className="relative rounded-2xl border border-border bg-background p-3"
            >
              <img
                src={image.url}
                alt={
                  image.name ||
                  `Product image ${
                    index + 1
                  }`
                }
                className="h-32 w-full rounded-xl object-contain"
              />

              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-pink-500 px-2 py-1 text-[10px] font-black text-white">
                  PRIMARY
                </span>
              )}

              <button
                type="button"
                onClick={() =>
                  onRemove(
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
  );
}