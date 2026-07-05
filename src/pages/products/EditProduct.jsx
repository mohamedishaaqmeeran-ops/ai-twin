import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMe } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
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
} from "lucide-react";

const API = "https://twinn-backend.onrender.com/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
 const dispatch = useDispatch();
const { user } = useSelector((state) => state.auth || {});

const plan = user?.plan || "free";
const isPro = plan === "pro" || plan === "business";
  const [product, setProduct] = useState({
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
  });

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-pink)]";

  const textareaClass =
    "w-full rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none transition focus:border-[var(--brand-pink)]";

useEffect(() => {
  dispatch(fetchMe());
  loadProduct();
}, [dispatch, id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/products/${id}`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to load product");
      }

      const p = data.product || data.data || data;

      setProduct({
        name: p.name || "",
        price: p.price || "",
        salePrice: p.salePrice || "",
        category: p.category || "",
        stock: p.stock || "",
        description: p.description || "",
        script: p.script || "",
        offer: p.offer || "",
        objectionHandling: p.objectionHandling || "",
        status: p.status || "active",
        images: p.images || [],
      });
    } catch (err) {
      setError(err.message || "Unable to load product");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []).map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setNewImages(files);
  };

  const removeOldImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveProduct = async () => {
    try {
      setError("");

      if (!product.name.trim() || !product.price) {
        setError("Product name and price are required.");
        return;
      }

      setSaving(true);

      const formData = new FormData();

      formData.append("name", product.name.trim());
      formData.append("price", Number(product.price));
      formData.append("salePrice", Number(product.salePrice || 0));
      formData.append("category", product.category || "General");
      formData.append("stock", Number(product.stock || 0));
      formData.append("description", product.description || "");
      formData.append("script", product.script || "");
      formData.append("offer", isPro ? product.offer || "" : "");
formData.append(
  "objectionHandling",
  isPro ? product.objectionHandling || "" : ""
);
      formData.append("status", product.status || "active");

      if (newImages.length > 0) {
        newImages.forEach((img) => {
          formData.append("images", img.file);
        });
      } 

      const res = await fetch(`${API}/products/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        navigate("/signin");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Unable to update product");
      }

      navigate(`/app/products/${id}`);
    } catch (err) {
      setError(err.message || "Unable to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm font-bold text-muted-foreground">
        Loading product...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-foreground">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-pink)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-3xl font-black sm:text-4xl">
          <span className="brand-text">Edit</span> Product
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update product details, images, stock, status and AI selling scripts.
        </p>

        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-[var(--brand-pink)]">
            <Upload className="h-7 w-7 text-[var(--brand-pink)]" />
            <p className="mt-3 text-base font-black">Upload new product images</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Uploading new images will replace existing product images.
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {product.images.length > 0 && newImages.length === 0 && (
            <ImageGrid
              title="Current Images"
              images={product.images.map((url) => ({ url, name: url }))}
              onRemove={removeOldImage}
            />
          )}

          {newImages.length > 0 && (
            <ImageGrid
              title="New Images"
              images={newImages}
              onRemove={removeNewImage}
            />
          )}

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field icon={Package} label="Product Name">
              <input
                value={product.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field icon={IndianRupee} label="Price">
              <input
                value={product.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field icon={IndianRupee} label="Sale Price">
              <input
                value={product.salePrice}
                onChange={(e) => updateField("salePrice", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field icon={Tag} label="Category">
              <input
                value={product.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field icon={Boxes} label="Stock Quantity">
              <input
                value={product.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field icon={Tag} label="Status">
              <select
                value={product.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <Field icon={FileText} label="Product Description">
            <textarea
              value={product.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={textareaClass}
              rows="5"
            />
          </Field>

          <Field icon={Megaphone} label="AI Twin Sales Script">
            <textarea
              value={product.script}
              onChange={(e) => updateField("script", e.target.value)}
              className={textareaClass}
              rows="5"
            />
          </Field>

         {isPro ? (
  <>
    <Field icon={Percent} label="Discount Offer">
      <textarea
        value={product.offer}
        onChange={(e) => updateField("offer", e.target.value)}
        className={textareaClass}
        rows="4"
      />
    </Field>

    <Field icon={Sparkles} label="Objection Handling">
      <textarea
        value={product.objectionHandling}
        onChange={(e) =>
          updateField("objectionHandling", e.target.value)
        }
        className={textareaClass}
        rows="4"
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
      Upgrade to Pro to edit discount offers and objection handling.
    </p>
  </div>
)}

          <button
            onClick={saveProduct}
            disabled={saving}
            className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </section>

        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black brand-text">Preview</h2>

          <div className="mt-5 rounded-3xl border border-border bg-background p-4">
            <img
              src={
                newImages[0]?.url ||
                product.images?.[0] ||
                "/images/product1.png"
              }
              alt="Preview"
              className="h-64 w-full rounded-2xl object-contain"
            />

            <h3 className="mt-5 text-lg font-black">
              {product.name || "Product Name"}
            </h3>

            <p className="mt-1 text-2xl font-black brand-text">
              ₹{product.salePrice || product.price || 0}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {product.category || "Category"} · Stock: {product.stock || 0}
            </p>

            <p className="mt-2 text-sm font-bold text-[var(--brand-pink)]">
              Status: {product.status}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div className="mt-5">
      <label className="mb-2 flex items-center gap-2 text-sm font-black">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>
      {children}
    </div>
  );
}

function ImageGrid({ title, images, onRemove }) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-sm font-black">{title}</p>

      <div className="grid gap-3 sm:grid-cols-3">
        {images.map((img, index) => (
          <div
            key={`${img.url}-${index}`}
            className="relative rounded-2xl border border-border bg-background p-3"
          >
            <img
              src={img.url}
              alt={img.name}
              className="h-32 w-full rounded-xl object-contain"
            />

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card text-red-500 shadow"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}