import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    script: "",
  });

  const [images, setImages] = useState([]);
  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveProduct = () => {
    const newProduct = {
      id: Date.now(),
      ...product,
      price: product.price || "₹0",
      stock: product.stock || "0",
      status: product.script.trim() ? "Ready to sell" : "Needs script",
      img: images[0]?.url || "/images/product1.png",
      createdAt: new Date().toLocaleString(),
    };

    const oldProducts = JSON.parse(localStorage.getItem("products") || "[]");
    localStorage.setItem("products", JSON.stringify([...oldProducts, newProduct]));
    localStorage.setItem("selectedProduct", newProduct.name);

    setSaved(true);

    setTimeout(() => {
      navigate("/app/products");
    }, 1000);
  };

  const canSave = product.name.trim() && product.price.trim();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          onClick={() => navigate("/app/products")}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />
          ADD PRODUCT
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">Add New</span> Product
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Add product details, images and AI selling script. Your AI Twin will
          use this information while selling live.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Form */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          {/* Upload */}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-pink-50">
            <Upload className="text-[var(--brand-pink)]" />
            <p className="mt-3 font-bold">Upload product images</p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG, WEBP supported
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl border border-border bg-background p-3"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-32 w-full rounded-xl object-contain"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-red-500 shadow"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Inputs */}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field icon={Package} label="Product Name">
              <input
                value={product.name}
                onChange={(e) => updateField("name", e.target.value)}
                 className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100"
                placeholder="Vitamin C Glow Serum"
              />
            </Field>

            <Field icon={IndianRupee} label="Price">
              <input
                value={product.price}
                onChange={(e) => updateField("price", e.target.value)}
                 className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100"
                placeholder="₹799"
              />
            </Field>

            <Field icon={Tag} label="Category">
              <input
                value={product.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100"
                placeholder="Beauty / Electronics"
              />
            </Field>

            <Field icon={Boxes} label="Stock Quantity">
              <input
                value={product.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                 className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100"
                placeholder="100"
              />
            </Field>
          </div>

          <Field icon={FileText} label="Product Description">
            <textarea
              value={product.description}
              onChange={(e) => updateField("description", e.target.value)}
               className="w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100"
              rows="5"
              placeholder="Write product benefits, ingredients/features, usage and offer details..."
            />
          </Field>

          <Field icon={Megaphone} label="AI Twin Sales Script">
            <textarea
              value={product.script}
              onChange={(e) => updateField("script", e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-100"
              rows="5"
              placeholder="Example: Introduce the product, explain benefits, handle objections, offer discount, ask viewers to buy now..."
            />
          </Field>

          <button
            onClick={saveProduct}
            disabled={!canSave}
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Product
          </button>
        </section>

        {/* Preview */}
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Product Preview</h2>

          <div className="mt-5 rounded-3xl border border-border bg-background p-4">
            <img
              src={images[0]?.url || "/images/product1.png"}
              alt="Product Preview"
              className="h-64 w-full rounded-2xl object-contain"
            />

            <h3 className="mt-5 text-lg font-black">
              {product.name || "Product Name"}
            </h3>

            <p className="mt-1 text-2xl font-black brand-text">
              {product.price || "₹0"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {product.category || "Category"} · Stock: {product.stock || "0"}
            </p>

            <div className="mt-5 rounded-2xl bg-pink-50 p-4">
              <p className="text-sm font-bold text-[var(--brand-pink)]">
                AI Selling Status
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.script.trim()
                  ? "Ready to sell during live."
                  : "Add sales script to make it live-ready."}
              </p>
            </div>
          </div>

          {saved && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-600">
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
      <label className="mb-2 flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>
      {children}
    </div>
  );
}