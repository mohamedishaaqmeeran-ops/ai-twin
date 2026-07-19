import {
  BadgeIndianRupee,
  Box,
  CheckCircle2,
  ImageIcon,
  Package,
  ShoppingBag,
  Tag,
} from "lucide-react";

const getProductId = (product) =>
  product?._id || product?.id || "";

const getProductName = (product) =>
  product?.name ||
  product?.title ||
  product?.productName ||
  "Unnamed Product";

const getProductImage = (product) =>
  product?.image ||
  product?.thumbnail ||
  product?.images?.[0] ||
  "/images/product-placeholder.png";

const getProductPrice = (product) => {
  return (
    product?.price ??
    product?.salePrice ??
    product?.sellingPrice ??
    "-"
  );
};

const getProductStock = (product) => {
  return (
    product?.stock ??
    product?.quantity ??
    product?.inventory ??
    "-"
  );
};

const getDescription = (product) => {
  return (
    product?.description ||
    product?.shortDescription ||
    product?.details ||
    "No description available."
  );
};

const getCategory = (product) => {
  return (
    product?.category ||
    product?.type ||
    "General"
  );
};

export default function ProductSelector({
  products = [],
  selectedProductId,
  selectedProduct,
  loading = false,
  disabled = false,
  onSelect,
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
            <ShoppingBag className="h-4 w-4" />
            PRODUCT
          </span>

          <h2 className="mt-4 text-xl font-black">
            Select Product
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose the product that
            your AI Twin will present
            in the generated video.
          </p>
        </div>

        <div className="rounded-2xl bg-pink-50 px-4 py-2 text-sm font-black text-[var(--brand-pink)] dark:bg-white/10">
          {products.length}
        </div>
      </div>

      {/* Products */}

      <div className="mt-6 space-y-4">
        {products.map((product) => {
          const productId =
            getProductId(product);
const active =
  String(selectedProductId) ===
  String(productId);
if (loading) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="py-10 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 animate-pulse text-[var(--brand-pink)]" />
        <p className="mt-4 font-semibold">
          Loading Products...
        </p>
      </div>
    </section>
  );
}
          return (
            <button
              key={productId}
              type="button"
            onClick={() =>
  onSelect(product)
}
disabled={disabled}
              className={`group w-full rounded-3xl border p-4 text-left transition-all duration-300

${
  disabled
    ? "cursor-not-allowed opacity-60"
    : ""
}

${
  active
    ? "border-[var(--brand-pink)] bg-pink-50 shadow-lg dark:bg-white/10"
    : "border-border bg-background hover:border-[var(--brand-pink)] hover:shadow-md"
}`}
            >
              <div className="flex gap-4">
                {/* Image */}

                <div className="relative">
                  <img
                    src={getProductImage(
                      product
                    )}
                    alt={getProductName(
                      product
                    )}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/product-placeholder.png";
                    }}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />

                  {active && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-[var(--brand-pink)] p-1">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Product */}

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">
                        {getProductName(
                          product
                        )}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {getDescription(
                          product
                        )}
                      </p>
                    </div>

                    {active && (
                      <span className="rounded-full bg-[var(--brand-pink)] px-3 py-1 text-xs font-bold text-white">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Product Details */}

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Info
                      icon={
                        BadgeIndianRupee
                      }
                      label="Price"
                      value={getProductPrice(
                        product
                      )}
                    />

                    <Info
                      icon={Box}
                      label="Stock"
                      value={getProductStock(
                        product
                      )}
                    />

                    <Info
                      icon={Tag}
                      label="Category"
                      value={getCategory(
                        product
                      )}
                    />

                    <Info
                      icon={ImageIcon}
                      label="Images"
                      value={
                        product?.images
                          ?.length || 1
                      }
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
                      AI Commerce
                    </span>

                    {product?.featured && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-300">
                        Featured
                      </span>
                    )}

                    {product?.isBestSeller && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
                        Best Seller
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}

      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-start gap-3">
          <Package className="mt-1 h-5 w-5 text-[var(--brand-pink)]" />

          <div>
            <h4 className="font-black">
              Product-aware AI Video
            </h4>

            <p className="mt-1 text-sm text-muted-foreground">
              The generated avatar
              video will be trained to
              speak only about the
              selected product using
              your AI Twin's
              personality, voice, and
              brand information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-card p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-bold">
        {value}
      </p>
    </div>
  );
}