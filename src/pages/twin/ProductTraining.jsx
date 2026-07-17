import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Brain,
  CheckCircle2,
  FileText,
  Globe,
  LoaderCircle,
  Package,
  Upload,
  X,
} from "lucide-react";

import {
  fetchTwins,
} from "../../features/twin/twinSlice";

import {
  fetchProducts,
} from "../../features/products/productSlice";

import {
  trainProductApi,
} from "../../lib/twinApi";

export default function ProductTraining() {
  const dispatch =
    useDispatch();

  const {
    twins = [],
    loading: twinsLoading,
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
    false;

  const [
    selectedTwinId,
    setSelectedTwinId,
  ] = useState("");

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    trainingText,
    setTrainingText,
  ] = useState("");

  const [
    websiteUrl,
    setWebsiteUrl,
  ] = useState("");

  const [
    documentFile,
    setDocumentFile,
  ] = useState(null);

  const [
    training,
    setTraining,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  useEffect(() => {
    dispatch(fetchTwins());
    dispatch(fetchProducts());
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
            String(product._id) ===
            String(
              selectedProductId
            )
        ) || null
      );
    }, [
      products,
      selectedProductId,
    ]);

  const handleFile = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setDocumentFile(file);
    setWebsiteUrl("");
    setTrainingText("");
    setError("");
  };

  const removeFile = () => {
    setDocumentFile(null);
  };

  const handleTrain =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!selectedTwinId) {
        setError(
          "Select an AI Twin."
        );

        return;
      }

      if (!selectedProductId) {
        setError(
          "Select a product."
        );

        return;
      }

      if (
        websiteUrl.trim() &&
        !/^https?:\/\//i.test(
          websiteUrl.trim()
        )
      ) {
        setError(
          "Website URL must begin with http:// or https://."
        );

        return;
      }

      try {
        setTraining(true);

        const response =
          await trainProductApi({
            twinId:
              selectedTwinId,

            productId:
              selectedProductId,

            title:
              title.trim() ||
              selectedProduct
                ?.name ||
              "Product Knowledge",

            documentFile,

            websiteUrl:
              documentFile
                ? ""
                : websiteUrl.trim(),

            text:
              documentFile ||
              websiteUrl.trim()
                ? ""
                : trainingText.trim(),
          });

        setSuccess(
          `Product trained successfully. ${
            response.chunkCount ||
            0
          } knowledge chunks created.`
        );

        setTitle("");
        setTrainingText("");
        setWebsiteUrl("");
        setDocumentFile(null);

        dispatch(fetchTwins());
      } catch (
        trainingError
      ) {
        setError(
          trainingError.message ||
            "Unable to train product."
        );
      } finally {
        setTraining(false);
      }
    };

  if (
    (twinsLoading ||
      productsLoading) &&
    !twins.length &&
    !products.length
  ) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-[var(--brand-pink)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-background text-foreground">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 px-4 py-2 text-xs font-bold">
          <Brain className="h-4 w-4 text-[var(--brand-pink)]" />

          PRODUCT AI TRAINING
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          Train Your Twin With{" "}

          <span className="brand-text">
            Product Knowledge
          </span>
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Select one AI Twin and one
          product. Product information,
          uploaded documents and website
          content will be converted into
          embeddings for product-specific
          answers.
        </p>
      </section>

      {(error || success) && (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error ? (
            <X className="mt-0.5 h-5 w-5" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
          )}

          <span>
            {error || success}
          </span>
        </div>
      )}

      <form
        onSubmit={handleTrain}
        className="grid gap-6 xl:grid-cols-[360px_1fr]"
      >
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">
            Select Training Target
          </h2>

          <label className="mt-5 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-black">
              <Brain className="h-4 w-4 text-[var(--brand-pink)]" />

              AI Twin
            </span>

            <select
              value={
                selectedTwinId
              }
              onChange={(event) =>
                setSelectedTwinId(
                  event.target.value
                )
              }
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3"
            >
              <option value="">
                Select Twin
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
            <span className="mb-2 flex items-center gap-2 text-sm font-black">
              <Package className="h-4 w-4 text-[var(--brand-pink)]" />

              Product
            </span>

            <select
              value={
                selectedProductId
              }
              onChange={(event) =>
                setSelectedProductId(
                  event.target.value
                )
              }
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3"
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
                    {product.name ||
                      product.productName ||
                      product.title}
                  </option>
                )
              )}
            </select>
          </label>

          {selectedTwin && (
            <div className="mt-5 rounded-2xl border border-border bg-background p-4">
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
                className="h-48 w-full rounded-xl object-contain"
              />

              <p className="mt-3 font-black">
                {selectedTwin.name}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedTwin
                  .brandName ||
                  "No brand name"}
              </p>
            </div>
          )}

          {selectedProduct && (
            <div className="mt-4 rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-bold text-muted-foreground">
                SELECTED PRODUCT
              </p>

              <p className="mt-2 font-black">
                {selectedProduct
                  .name ||
                  selectedProduct
                    .productName ||
                  selectedProduct
                    .title}
              </p>

              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                {selectedProduct
                  .description ||
                  "No product description"}
              </p>
            </div>
          )}
        </aside>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">
            Product Knowledge
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Product database information
            is included automatically.
            Add one optional source below.
          </p>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-black">
              Knowledge Title
            </span>

            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Example: Rolex Watch Catalog"
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3"
            />
          </label>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center hover:border-[var(--brand-pink)]">
              <Upload className="h-8 w-8 text-[var(--brand-pink)]" />

              <p className="mt-3 font-black">
                Upload Document
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                PDF, DOCX, TXT or CSV
              </p>

              <input
                type="file"
                accept=".pdf,.docx,.txt,.csv"
                onChange={
                  handleFile
                }
                className="hidden"
              />
            </label>

            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--brand-pink)]" />

                <p className="font-black">
                  Website
                </p>
              </div>

              <input
                value={websiteUrl}
                disabled={
                  Boolean(
                    documentFile
                  )
                }
                onChange={(event) => {
                  setWebsiteUrl(
                    event.target.value
                  );

                  if (
                    event.target.value
                  ) {
                    setTrainingText(
                      ""
                    );
                  }
                }}
                placeholder="https://product-page.com"
                className="mt-4 w-full rounded-[5px] border border-border bg-card px-4 py-3 disabled:opacity-50"
              />
            </div>
          </div>

          {documentFile && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-green-700" />

                <span className="truncate text-sm font-bold text-green-700">
                  {
                    documentFile.name
                  }
                </span>
              </div>

              <button
                type="button"
                onClick={
                  removeFile
                }
                className="rounded-lg p-2 text-red-500 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-black">
              Additional Product Text
            </span>

            <textarea
              value={
                trainingText
              }
              disabled={
                Boolean(
                  documentFile
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
              rows={10}
              placeholder="Enter specifications, usage instructions, warranty details, FAQs, shipping information and product policies..."
              className="w-full rounded-[5px] border border-border bg-background px-4 py-3 disabled:opacity-50"
            />
          </label>

          <button
            type="submit"
            disabled={
              training ||
              !selectedTwinId ||
              !selectedProductId
            }
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {training ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <Brain className="h-5 w-5" />
            )}

            {training
              ? "Training Product..."
              : "Train Selected Product"}
          </button>
        </section>
      </form>
    </div>
  );
}