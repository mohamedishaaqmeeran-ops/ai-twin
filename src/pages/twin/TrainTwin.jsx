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
  Trash2,
  FileText,
  Link2,
  Brain,
  Sparkles,
  Save,
  CheckCircle2,
  Crown,
  Lock,
  Globe,
  LoaderCircle,
  Package,
  Bot,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

import {
  fetchProducts,
} from "../../features/products/productSlice";

/* =========================================================
   API CONFIGURATION
========================================================= */

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com";

const API_URL =
  RAW_API_URL.replace(
    /\/$/,
    ""
  );

/* =========================================================
   HELPERS
========================================================= */

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

const getProductName = (
  product
) => {
  return (
    product?.name ||
    product?.productName ||
    product?.title ||
    "Unnamed Product"
  );
};

const getProductImage = (
  product
) => {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.images?.[0] ||
    null
  );
};

const getProductPrice = (
  product
) => {
  const price =
    product?.price ??
    product?.sellingPrice ??
    product?.salePrice ??
    product?.amount;

  if (
    price === undefined ||
    price === null ||
    price === ""
  ) {
    return "Price not added";
  }

  const currency =
    product?.currency ||
    "INR";

  if (currency === "INR") {
    return `₹${price}`;
  }

  return `${currency} ${price}`;
};

const formatFileSize = (
  bytes
) => {
  if (!bytes) {
    return "0 KB";
  }

  const kilobytes =
    bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(
      1
    )} KB`;
  }

  return `${(
    kilobytes / 1024
  ).toFixed(1)} MB`;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function TrainTwin() {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const fileInputRef =
    useRef(null);

  const {
    user,
  } = useSelector(
    (state) => state.auth
  );

  const {
    twins = [],
    loading: twinsLoading,
    initialized:
      twinsInitialized,
  } = useSelector(
    (state) => state.twin
  );

  const productState =
    useSelector(
      (state) =>
        state.product ||
        state.products ||
        {}
    );

  const products =
    productState.products ||
    productState.items ||
    productState.data ||
    [];

  const productsLoading =
    productState.loading ||
    productState.isLoading ||
    false;

  const productsError =
    productState.error ||
    "";

  const plan = String(
    user?.plan || "free"
  ).toLowerCase();

  const isBusiness =
    plan === "business";

  const isPro =
    plan === "pro" ||
    isBusiness;

  const maxFiles =
    isPro ? 20 : 1;

  const maxKnowledgeChars =
    isPro ? 10000 : 1000;

  const [
    selectedTwinId,
    setSelectedTwinId,
  ] = useState("");

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");

  const [
    files,
    setFiles,
  ] = useState([]);

  const [
    websiteUrl,
    setWebsiteUrl,
  ] = useState("");

  const [
    knowledge,
    setKnowledge,
  ] = useState("");

  const [
    knowledgeTitle,
    setKnowledgeTitle,
  ] = useState("");

  const [
    training,
    setTraining,
  ] = useState(false);

  const [
    progressMessage,
    setProgressMessage,
  ] = useState("");

  const [
    pageError,
    setPageError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    lastChunkCount,
    setLastChunkCount,
  ] = useState(0);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    dispatch(fetchTwins());
    dispatch(fetchProducts());
  }, [dispatch]);

  /* =======================================================
     AUTO SELECT FIRST TWIN
  ======================================================= */

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
     AUTO SELECT FIRST PRODUCT
  ======================================================= */

  useEffect(() => {
    if (
      !selectedProductId &&
      products.length > 0
    ) {
      setSelectedProductId(
        products[0]._id
      );
    }
  }, [
    selectedProductId,
    products,
  ]);

  /* =======================================================
     SELECTED DATA
  ======================================================= */

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
      selectedTwinId,
      twins,
    ]);

  const selectedProduct =
    useMemo(() => {
      return (
        products.find(
          (product) =>
            String(
              product._id
            ) ===
            String(
              selectedProductId
            )
        ) || null
      );
    }, [
      selectedProductId,
      products,
    ]);

  const selectedProductImage =
    getProductImage(
      selectedProduct
    );

  const selectedProductName =
    getProductName(
      selectedProduct
    );

  const isProductAlreadyTrained =
    Boolean(
      selectedTwin?.productIds?.some(
        (product) => {
          const id =
            typeof product ===
            "object"
              ? product._id
              : product;

          return (
            String(id) ===
            String(
              selectedProductId
            )
          );
        }
      )
    );

  /* =======================================================
     PLAN
  ======================================================= */

  const upgradeToPro = () => {
    navigate("/pricing");
  };

  /* =======================================================
     FILE UPLOAD
  ======================================================= */

  const handleFileUpload = (
    event
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files ||
          []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    const supportedTypes = [
      "application/pdf",
      "text/plain",
      "text/csv",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const supportedExtensions = [
      ".pdf",
      ".docx",
      ".txt",
      ".csv",
    ];

    const validFiles =
      selectedFiles.filter(
        (file) => {
          const lowerName =
            file.name.toLowerCase();

          return (
            supportedTypes.includes(
              file.type
            ) ||
            supportedExtensions.some(
              (extension) =>
                lowerName.endsWith(
                  extension
                )
            )
          );
        }
      );

    if (
      validFiles.length !==
      selectedFiles.length
    ) {
      setPageError(
        "Only PDF, DOCX, TXT and CSV files are supported."
      );
    } else {
      setPageError("");
    }

    const availableSlots =
      maxFiles -
      files.length;

    if (
      availableSlots <= 0
    ) {
      if (!isPro) {
        upgradeToPro();
      } else {
        setPageError(
          `You can upload a maximum of ${maxFiles} files.`
        );
      }

      event.target.value = "";

      return;
    }

    const acceptedFiles =
      validFiles.slice(
        0,
        availableSlots
      );

    setFiles((current) => [
      ...current,
      ...acceptedFiles,
    ]);

    /*
     * Product training currently processes
     * one source at a time. When files are
     * selected, website and text are cleared.
     */
    if (
      acceptedFiles.length > 0
    ) {
      setWebsiteUrl("");
      setKnowledge("");
    }

    event.target.value = "";
  };

  const removeFile = (
    index
  ) => {
    setFiles((current) =>
      current.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );
  };

  const clearFiles = () => {
    setFiles([]);

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateTraining = () => {
    setPageError("");
    setSuccessMessage("");

    if (!selectedTwinId) {
      setPageError(
        "Select an AI Twin."
      );

      return false;
    }

    if (!selectedProductId) {
      setPageError(
        "Select a product."
      );

      return false;
    }

    if (
      websiteUrl.trim() &&
      !/^https?:\/\//i.test(
        websiteUrl.trim()
      )
    ) {
      setPageError(
        "Website URL must begin with http:// or https://."
      );

      return false;
    }

    if (
      knowledge.length >
      maxKnowledgeChars
    ) {
      setPageError(
        `Knowledge text cannot exceed ${maxKnowledgeChars} characters.`
      );

      return false;
    }

    return true;
  };

  /* =======================================================
     TRAIN ONE SOURCE
  ======================================================= */

  const trainSource = async ({
    documentFile = null,
    website = "",
    text = "",
    title,
  }) => {
    const formData =
      new FormData();

    formData.append(
      "title",
      title
    );

    if (documentFile) {
      formData.append(
        "document",
        documentFile
      );
    } else if (website) {
      formData.append(
        "websiteUrl",
        website
      );
    } else if (text) {
      formData.append(
        "text",
        text
      );
    }

    const response = await fetch(
      `${API_URL}/api/twin/${selectedTwinId}/products/${selectedProductId}/train`,
      {
        method: "POST",
        credentials:
          "include",
        body: formData,
      }
    );

    return readResponse(
      response
    );
  };

  /* =======================================================
     SAVE TRAINING
  ======================================================= */

  const saveTraining =
    async () => {
      if (!validateTraining()) {
        return;
      }

      try {
        setTraining(true);
        setLastChunkCount(0);

        let totalChunks = 0;

        /*
         * Your backend product training route
         * replaces existing chunks for the same
         * Twin and product.
         *
         * Therefore, when several files are
         * uploaded, combine them through
         * consecutive requests only if the
         * backend is changed to append chunks.
         *
         * With the current backend, use the
         * first uploaded file as the primary
         * training document.
         */

        if (files.length > 0) {
          const primaryFile =
            files[0];

          setProgressMessage(
            `Training from ${primaryFile.name}...`
          );

          const result =
            await trainSource({
              documentFile:
                primaryFile,

              title:
                knowledgeTitle.trim() ||
                `${selectedProductName} Product Knowledge`,
            });

          totalChunks +=
            Number(
              result.chunkCount ||
                0
            );
        } else if (
          websiteUrl.trim()
        ) {
          setProgressMessage(
            "Importing and training website content..."
          );

          const result =
            await trainSource({
              website:
                websiteUrl.trim(),

              title:
                knowledgeTitle.trim() ||
                `${selectedProductName} Website Knowledge`,
            });

          totalChunks +=
            Number(
              result.chunkCount ||
                0
            );
        } else {
          setProgressMessage(
            "Training product information..."
          );

          const result =
            await trainSource({
              text:
                knowledge
                  .slice(
                    0,
                    maxKnowledgeChars
                  )
                  .trim(),

              title:
                knowledgeTitle.trim() ||
                `${selectedProductName} Product Knowledge`,
            });

          totalChunks +=
            Number(
              result.chunkCount ||
                0
            );
        }

        setLastChunkCount(
          totalChunks
        );

        setSuccessMessage(
          `${selectedProductName} trained successfully for ${
            selectedTwin?.name ||
            "the selected AI Twin"
          }. ${totalChunks} knowledge chunks created.`
        );

        clearFiles();
        setWebsiteUrl("");
        setKnowledge("");
        setKnowledgeTitle("");

        await dispatch(
          fetchTwins()
        ).unwrap();
      } catch (error) {
        console.error(
          "PRODUCT TRAINING ERROR:",
          error
        );

        setPageError(
          error.message ||
            "Product training failed."
        );
      } finally {
        setTraining(false);
        setProgressMessage("");
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    (
      twinsLoading &&
      !twinsInitialized
    ) ||
    productsLoading
  ) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* HEADER */}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}

            {isPro
              ? "PRO PRODUCT TRAINING"
              : "PRODUCT AI TRAINING"}
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
          Train Your Twin With{" "}

          <span className="brand-text">
            Product Knowledge
          </span>
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Select an AI Twin and one
          product. The backend combines
          the product database information
          with your uploaded document,
          website or additional text and
          stores product-specific
          embeddings.
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Unlock Pro Training
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Pro supports longer
                  knowledge text and more
                  source files.
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
      </section>

      {/* MESSAGES */}

      {(pageError ||
        productsError) && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <span>
            {pageError ||
              productsError}
          </span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <span>
            {successMessage}
          </span>
        </div>
      )}

      {/* STATS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Bot}
          label="Selected Twin"
          value={
            selectedTwin?.name ||
            "Not selected"
          }
        />

        <StatCard
          icon={Package}
          label="Selected Product"
          value={
            selectedProductName ||
            "Not selected"
          }
        />

        <StatCard
          icon={FileText}
          label="Files Added"
          value={`${files.length}/${maxFiles}`}
        />

        <StatCard
          icon={
            isProductAlreadyTrained
              ? CheckCircle2
              : Brain
          }
          label="Training Status"
          value={
            isProductAlreadyTrained
              ? "Trained"
              : lastChunkCount > 0
              ? `${lastChunkCount} Chunks`
              : "Not Trained"
          }
        />
      </section>

      {/* MAIN */}

      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* TARGET */}

        <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <CardHeader
            icon={Brain}
            title="Training Target"
            desc="Select the AI Twin and product."
          />

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black">
              AI Twin
            </span>

            <select
              value={
                selectedTwinId
              }
              disabled={training}
              onChange={(event) => {
                setSelectedTwinId(
                  event.target.value
                );

                setSuccessMessage("");
                setPageError("");
              }}
              className={inputClass}
            >
              <option value="">
                Select AI Twin
              </option>

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

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black">
              Product
            </span>

            <select
              value={
                selectedProductId
              }
              disabled={training}
              onChange={(event) => {
                setSelectedProductId(
                  event.target.value
                );

                setSuccessMessage("");
                setPageError("");
              }}
              className={inputClass}
            >
              <option value="">
                Select Product
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product._id
                    }
                    value={
                      product._id
                    }
                  >
                    {getProductName(
                      product
                    )}
                  </option>
                )
              )}
            </select>
          </label>

          {selectedTwin && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
              <img
                src={
                  selectedTwin
                    ?.appearance
                    ?.avatarUrl ||
                  selectedTwin
                    ?.image ||
                  "/images/bb.png"
                }
                alt={
                  selectedTwin.name
                }
                className="h-52 w-full object-contain"
              />

              <div className="p-4">
                <p className="font-black">
                  {selectedTwin.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedTwin
                    .brandName ||
                    "No brand name"}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    selectedTwin
                      .isTrained
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {selectedTwin
                    .isTrained
                    ? "Twin trained"
                    : "Twin draft"}
                </span>
              </div>
            </div>
          )}

          {selectedProduct && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
              {selectedProductImage ? (
                <img
                  src={
                    selectedProductImage
                  }
                  alt={
                    selectedProductName
                  }
                  className="h-44 w-full object-contain"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-muted">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="p-4">
                <p className="font-black">
                  {
                    selectedProductName
                  }
                </p>

                <p className="mt-1 text-sm font-bold text-[var(--brand-pink)]">
                  {getProductPrice(
                    selectedProduct
                  )}
                </p>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {selectedProduct
                    .description ||
                    "No product description added."}
                </p>

                {isProductAlreadyTrained && (
                  <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Trained for this Twin
                  </span>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* KNOWLEDGE */}

        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <CardHeader
              icon={FileText}
              title="Product Knowledge Source"
              desc="Choose a document, website or text."
            />

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-black">
                Knowledge Title
              </span>

              <input
                value={
                  knowledgeTitle
                }
                disabled={training}
                onChange={(event) =>
                  setKnowledgeTitle(
                    event.target.value
                  )
                }
                placeholder={`${selectedProductName} Product Knowledge`}
                className={inputClass}
              />
            </label>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {/* FILE */}

              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Upload className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-black">
                      Upload Product File
                    </p>

                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, TXT or CSV
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={isPro}
                  accept=".pdf,.docx,.txt,.csv"
                  onChange={
                    handleFileUpload
                  }
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={
                    training
                  }
                  onClick={() => {
                    if (
                      !isPro &&
                      files.length >= 1
                    ) {
                      upgradeToPro();
                      return;
                    }

                    fileInputRef.current?.click();
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-dashed border-[var(--brand-pink)] py-3 text-sm font-bold text-[var(--brand-pink)] disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />

                  Choose File
                </button>
              </div>

              {/* WEBSITE */}

              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Globe className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-black">
                      Product Website
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Import readable webpage content
                    </p>
                  </div>
                </div>

                <input
                  type="url"
                  value={websiteUrl}
                  disabled={
                    training ||
                    files.length > 0
                  }
                  onChange={(event) => {
                    setWebsiteUrl(
                      event.target.value
                    );

                    if (
                      event.target.value
                    ) {
                      setKnowledge("");
                    }
                  }}
                  placeholder="https://your-product-page.com"
                  className={`${inputClass} mt-5`}
                />
              </div>
            </div>

            {/* FILE LIST */}

            {files.length > 0 && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black">
                    Selected Files
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearFiles
                    }
                    className="text-xs font-bold text-red-500"
                  >
                    Clear all
                  </button>
                </div>

                {files.map(
                  (file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-5 w-5 shrink-0 text-[var(--brand-pink)]" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">
                            {file.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(
                              file.size
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={
                          training
                        }
                        onClick={() =>
                          removeFile(
                            index
                          )
                        }
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                )}

                {files.length > 1 && (
                  <p className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs font-bold leading-5 text-orange-700">
                    Your current backend
                    replaces previous product
                    chunks on each request.
                    Only the first selected
                    file will be processed
                    until append-mode training
                    is added to the backend.
                  </p>
                )}
              </div>
            )}

            {/* TEXT */}

            <label className="mt-6 block">
              <span className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
                <span>
                  Additional Product Knowledge
                </span>

                <span className="text-xs text-muted-foreground">
                  {knowledge.length}/
                  {
                    maxKnowledgeChars
                  }
                </span>
              </span>

              <textarea
                rows={11}
                maxLength={
                  maxKnowledgeChars
                }
                value={knowledge}
                disabled={
                  training ||
                  files.length > 0 ||
                  Boolean(
                    websiteUrl.trim()
                  )
                }
                onChange={(event) =>
                  setKnowledge(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-none`}
                placeholder={`Example:

Warranty: 1 year
Delivery: 3 to 5 business days
Return policy: 7 days
Available colours: Black and Silver
Material: Stainless steel
Usage instructions: ...`}
              />
            </label>

            {!isPro && (
              <p className="mt-2 text-xs font-bold text-orange-500">
                Free plan knowledge limit:
                1000 characters.
              </p>
            )}
          </section>

          {/* SAVE */}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black brand-text">
                  Train Selected Product
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  Existing product knowledge
                  for this Twin and product
                  will be replaced with the
                  latest training data.
                </p>
              </div>

              <button
                type="button"
                disabled={
                  training ||
                  !selectedTwinId ||
                  !selectedProductId
                }
                onClick={
                  saveTraining
                }
                className="brand-gradient flex min-w-[230px] items-center justify-center gap-2 rounded-[5px] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {training ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : isProductAlreadyTrained ? (
                  <RefreshCw className="h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}

                {training
                  ? progressMessage ||
                    "Training..."
                  : isProductAlreadyTrained
                  ? "Retrain Product"
                  : "Train Product"}
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const inputClass =
  "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-pink-500/20";

function CardHeader({
  icon: Icon,
  title,
  desc,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <h2 className="text-lg font-black tracking-tight text-foreground">
          {title}
        </h2>

        <p className="text-sm leading-6 text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  );
}

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
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="truncate text-lg font-black tracking-tight brand-text">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}