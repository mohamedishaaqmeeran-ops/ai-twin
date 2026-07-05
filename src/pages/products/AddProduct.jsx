import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
} from "lucide-react";

import { fetchMe } from "../../features/auth/authSlice";

const API = "https://twinn-backend.onrender.com/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});

  const plan = user?.plan || "free";
  const isPro = plan === "pro" || plan === "business";
  const maxProducts = isPro ? 100 : 3;

  const [existingCount, setExistingCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    script: "",
    offer: "",
    objectionHandling: "",
  });

  const [images, setImages] = useState([]);

  const reachedLimit = existingCount >= maxProducts;

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-500/20";

  const textareaClass =
    "w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100 dark:focus:ring-pink-500/20";

  const upgradeToPro = () => navigate("/pricing");

  const updateField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const loadProductCount = async () => {
    try {
      setLoadingCount(true);

      const res = await fetch(`${API}/products`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) return;

      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setExistingCount(Array.isArray(list) ? list.length : 0);
    } finally {
      setLoadingCount(false);
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }

    loadProductCount();
  }, [dispatch]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []).map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    if (!isPro) {
      setImages((prev) => [...prev, ...files].slice(0, 1));
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveProduct = async () => {
    try {
      setError("");

      if (reachedLimit) {
        upgradeToPro();
        return;
      }

      if (!product.name.trim() || !product.price.trim()) {
        setError("Product name and price are required.");
        return;
      }

      setSaving(true);

      const status = product.script.trim() ? "Ready to sell" : "Needs script";

      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("category", product.category || "General");
      formData.append("stock", product.stock || "0");
      formData.append("description", product.description);
      formData.append("script", product.script);
      formData.append("offer", isPro ? product.offer : "");
      formData.append(
        "objectionHandling",
        isPro ? product.objectionHandling : ""
      );
      formData.append("status", status);
      formData.append("sales", "0 sold");
      formData.append("plan", isPro ? "pro" : "free");

      const allowedImages = isPro ? images : images.slice(0, 1);

      allowedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      if (!allowedImages.length) {
        formData.append("img", "/images/product1.png");
      }

      const res = await fetch(`${API}/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to save product");
      }

      const newProduct = data.product || data.data || data;

      localStorage.setItem("selectedProduct", newProduct.name || product.name);
      localStorage.setItem("selectedProductId", newProduct._id || newProduct.id || "");

      setSaved(true);

      setTimeout(() => {
        navigate("/app/products");
      }, 1000);
    } catch (err) {
      setError(err.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const canSave = product.name.trim() && product.price.trim() && !reachedLimit;

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-foreground">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          onClick={() => navigate("/app/products")}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
            {isPro ? (
              <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
            )}
            {isPro ? "ADD PRO PRODUCT" : "ADD PRODUCT"}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
              isPro
                ? "bg-pink-500 text-white"
                : "bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
            }`}
          >
            {isPro ? <Crown className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isPro
              ? "PRO PLAN ACTIVE"
              : `FREE ${loadingCount ? "..." : existingCount}/${maxProducts}`}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">{isPro ? "Add Pro" : "Add New"}</span>{" "}
          Product
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {isPro
            ? "Add product details, multiple images, AI sales script, discount offer and objection handling for Pro live selling."
            : "Free plan allows 3 products and 1 image per product. Upgrade to Pro for 100 products and advanced sales scripts."}
        </p>

        {!isPro && (
          <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Product Limit: {loadingCount ? "..." : existingCount}/{maxProducts}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upgrade to Pro for 100 products, multiple images and advanced
                  AI selling scripts.
                </p>
              </div>

              <button
                onClick={upgradeToPro}
                className="brand-gradient rounded-[5px] px-5 py-3 text-sm font-bold text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {reachedLimit && (
          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
            Free product limit reached. Upgrade to Pro to add more products.
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-accent">
            <Upload className="h-7 w-7 text-[var(--brand-pink)]" />

            <p className="mt-3 text-base font-black">
              {isPro ? "Upload product images" : "Upload 1 product image"}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {isPro
                ? "PNG, JPG, WEBP supported. You can upload multiple product images."
                : "Free plan supports only 1 image per product."}
            </p>

            <input
              type="file"
              multiple={isPro}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {images.map((img, index) => (
                <div
                  key={`${img.name}-${index}`}
                  className="relative rounded-2xl border border-border bg-background p-3"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-32 w-full rounded-xl object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card text-red-500 shadow transition hover:bg-red-50 dark:hover:bg-white/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field icon={Package} label="Product Name">
              <input
                value={product.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
                placeholder="Vitamin C Glow Serum"
              />
            </Field>

            <Field icon={IndianRupee} label="Price">
              <input
                value={product.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={inputClass}
                placeholder="₹799"
              />
            </Field>

            <Field icon={Tag} label="Category">
              <input
                value={product.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
                placeholder="Beauty / Electronics"
              />
            </Field>

            <Field icon={Boxes} label="Stock Quantity">
              <input
                value={product.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className={inputClass}
                placeholder="100"
              />
            </Field>
          </div>

          <Field icon={FileText} label="Product Description">
            <textarea
              value={product.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={textareaClass}
              rows="5"
              placeholder="Write product benefits, ingredients/features, usage and offer details..."
            />
          </Field>

          <Field icon={Megaphone} label="AI Twin Sales Script">
            <textarea
              value={product.script}
              onChange={(e) => updateField("script", e.target.value)}
              className={textareaClass}
              rows="5"
              placeholder="Example: Introduce the product, explain benefits, handle objections, offer discount, ask viewers to buy now..."
            />
          </Field>

          {isPro ? (
            <>
              <Field icon={Percent} label="Pro Discount Offer">
                <textarea
                  value={product.offer}
                  onChange={(e) => updateField("offer", e.target.value)}
                  className={textareaClass}
                  rows="4"
                  placeholder="Example: Today only 10% off, free shipping, limited stock urgency..."
                />
              </Field>

              <Field icon={Sparkles} label="Pro Objection Handling">
                <textarea
                  value={product.objectionHandling}
                  onChange={(e) =>
                    updateField("objectionHandling", e.target.value)
                  }
                  className={textareaClass}
                  rows="4"
                  placeholder="Example: If customer says price is high, explain value, quality and offer..."
                />
              </Field>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
              <p className="flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]">
                <Lock className="h-4 w-4" />
                Pro fields locked
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade to add discount offers and objection handling scripts.
              </p>
            </div>
          )}

          <button
            onClick={saveProduct}
            disabled={!canSave || saving}
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving
              ? "Saving..."
              : reachedLimit
              ? "Upgrade Required"
              : "Save Product"}
          </button>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Product Preview</h2>

          <div className="mt-5 rounded-3xl border border-border bg-background p-4">
            <div className="relative">
              {isPro && (
                <span className="absolute right-3 top-3 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                  PRO SELLING
                </span>
              )}

              <img
                src={images[0]?.url || "/images/product1.png"}
                alt="Product Preview"
                className="h-64 w-full rounded-2xl object-contain"
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-foreground">
              {product.name || "Product Name"}
            </h3>

            <p className="mt-1 text-2xl font-black brand-text">
              {product.price || "₹0"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {product.category || "Category"} · Stock: {product.stock || "0"}
            </p>

            <div className="mt-5 rounded-2xl border border-border bg-accent p-4">
              <p className="text-sm font-bold text-[var(--brand-pink)]">
                AI Selling Status
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {product.script.trim()
                  ? isPro
                    ? "Ready for Pro live selling with advanced scripts."
                    : "Ready to sell during live."
                  : "Add sales script to make it live-ready."}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-black">Product Description</p>

              <p className="mt-2 line-clamp-5 text-sm leading-6 text-muted-foreground">
                {product.description ||
                  "Your product description will appear here."}
              </p>
            </div>

            {isPro && product.offer && (
              <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-black">Pro Offer</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {product.offer}
                </p>
              </div>
            )}
          </div>

          {saved && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              Product saved successfully
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div className="mt-5">
      <label className="mb-2 flex items-center gap-2 text-sm font-black text-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>

      {children}
    </div>
  );
}