import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Package,
  Radio,
  ShoppingBag,
  TrendingUp,
  Tag,
  Pencil,
  Trash2,
  Save,
  X,
  Crown,
  Lock,
  AlertCircle,
} from "lucide-react";

import { fetchMe } from "../../features/auth/authSlice";

const API = "https://twinn-backend.onrender.com/api";

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});

  const plan = user?.plan || "free";
  const isPro = plan === "pro" || plan === "business";
  const maxProducts = isPro ? 100 : 3;

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [error, setError] = useState("");

  const upgradeToPro = () => navigate("/pricing");

  const canAddProduct = products.length < maxProducts;

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/products`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to load products");
      }

      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }

    loadProducts();
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `
        ${product.name || ""}
        ${product.category || ""}
        ${product.status || ""}
      `
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesFilter =
        filter === "All Products" || product.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [products, query, filter]);

  const deleteProduct = async (id) => {
    try {
      if (!id) return;

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (!confirmDelete) return;

      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => (product._id || product.id) !== id)
      );
    } catch (err) {
      alert(err.message || "Unable to delete product");
    }
  };

  const saveEdit = async () => {
    try {
      if (!editingProduct) return;

      setSavingEdit(true);

      const id = editingProduct._id || editingProduct.id;

      const res = await fetch(`${API}/products/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Unable to update product");
      }

      const updatedProduct = data.product || data.data || editingProduct;

      setProducts((prev) =>
        prev.map((product) =>
          (product._id || product.id) === id ? updatedProduct : product
        )
      );

      setEditingProduct(null);
    } catch (err) {
      alert(err.message || "Unable to update product");
    } finally {
      setSavingEdit(false);
    }
  };

  const selectProductForLive = (product) => {
  navigate("/app/golive", {
    state: {
      selectedProduct: product,
    },
  });
};

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                {isPro ? (
                  <Crown className="h-4 w-4 text-[var(--brand-pink)]" />
                ) : (
                  <ShoppingBag className="h-4 w-4 text-[var(--brand-pink)]" />
                )}
                {isPro ? "PRO AI TWIN PRODUCTS" : "AI TWIN PRODUCTS"}
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
                {isPro ? "PRO PLAN ACTIVE" : "FREE PLAN"}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              <span className="brand-text">
                {isPro ? "Pro Products" : "Products"}
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {isPro
                ? "Manage up to 100 products, live scripts, selling status and Pro live sales."
                : "Free plan allows up to 3 products. Upgrade to Pro to add more products and advanced selling scripts."}
            </p>

            {!isPro && (
              <div className="mt-4 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-[var(--brand-pink)]">
                      Product limit: {products.length}/{maxProducts}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upgrade to Pro for 100 products and advanced product scripts.
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
          </div>

          {canAddProduct ? (
            <Link
              to="/app/products/add"
              className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          ) : (
            <button
              onClick={upgradeToPro}
              className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Lock className="h-4 w-4" />
              Add More - Pro
            </button>
          )}
        </div>
      </section>

      {error && (
        <section className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          {error}
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={loading ? "..." : `${products.length}/${maxProducts}`}
        />
      <StatCard
  icon={Radio}
  label="Live Ready"
  value={
    loading
      ? "..."
      : products.filter((p) => p.status === "active").length
  }
/>
        <StatCard
  icon={Tag}
  label="Draft"
  value={
    loading
      ? "..."
      : products.filter((p) => p.status === "draft").length
  }
/>
        <StatCard
          icon={TrendingUp}
          label="Analytics"
          value={isPro ? "Pro" : "Basic"}
        />
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

         <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold text-foreground outline-none transition focus:border-[var(--brand-pink)]"
>
  <option value="All Products">All Products</option>
  <option value="active">Active</option>
  <option value="draft">Draft</option>
  <option value="inactive">Inactive</option>
</select>
        </div>
      </section>

      {loading ? (
        <section className="rounded-3xl border border-border bg-card p-8 text-center text-sm font-bold text-muted-foreground shadow-sm">
          Loading products...
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;
            const image =
  product.images?.[0] ||
  product.img ||
  product.image ||
  "/images/6.jpeg";

            return (
              <div
                key={productId}
                className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/app/products/${productId}`}>
                  <div className="relative overflow-hidden rounded-2xl bg-pink-50 p-4 dark:bg-white/10">
                    {isPro && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                        PRO SELLING
                      </span>
                    )}

                    <img
                      src={image}
                      alt={product.name}
                      className="h-56 w-full rounded-[5px] object-contain transition duration-300 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-xs font-black tracking-wide text-[var(--brand-pink)] shadow-sm">
                      {product.status || "active"}
                    </span>

                    <span className="absolute right-3 top-3 rounded-full bg-[#0d0d12] px-3 py-1 text-xs font-bold tracking-wide text-white">
                      {product.category || "General"}
                    </span>
                  </div>
                </Link>

                <div className="mt-5">
                  <h3 className="text-lg font-black tracking-tight text-foreground">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center justify-between gap-3">
                   <p className="text-2xl font-black tracking-tight brand-text">
  ₹{product.salePrice || product.price}
</p>

                    <p className="text-xs font-bold tracking-wide text-muted-foreground">
                      {product.sales || "0 sold"}
                    </p>
                  </div>

                 <p
  className={`mt-2 text-sm font-bold ${
    Number(product.stock) <= 0
      ? "text-red-500"
      : Number(product.stock) <= 5
      ? "text-orange-500"
      : "text-emerald-600"
  }`}
>
  {Number(product.stock) <= 0
    ? "Out of Stock"
    : `${product.stock} in stock`}
</p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex h-11 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => selectProductForLive(product)}
                    className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white transition hover:opacity-90"
                  >
                    <Radio className="h-4 w-4" />
                    {isPro ? "Pro Live" : "Sell Live"}
                  </button>

                  <Link
                    to={`/app/products/${productId}`}
                    className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border bg-background text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)]"
                  >
                    <Package className="h-4 w-4" />
                    Details
                  </Link>

                  <button
                    onClick={() => deleteProduct(productId)}
                    className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-red-200 text-sm font-bold tracking-wide text-red-500 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {!loading && filteredProducts.length === 0 && (
        <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <Package className="mx-auto h-10 w-10 text-[var(--brand-pink)]" />
          <h2 className="mt-4 text-xl font-black tracking-tight text-foreground">
            No products found
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Try changing your search or filter.
          </p>
        </section>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 text-foreground shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black tracking-tight brand-text">
                Edit Product
              </h2>

              <button
                onClick={() => setEditingProduct(null)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-foreground transition hover:border-[var(--brand-pink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <EditInput
                label="Product Name"
                value={editingProduct.name || ""}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, name: value })
                }
              />

              <EditInput
                label="Price"
                value={editingProduct.price || ""}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, price: value })
                }
              />

              <EditInput
                label="Category"
                value={editingProduct.category || ""}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, category: value })
                }
              />

              <EditInput
                label="Stock"
                value={editingProduct.stock || ""}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, stock: value })
                }
              />

             <div>
  <label className="text-sm font-black tracking-tight text-foreground">
    Status
  </label>

  <select
    value={editingProduct.status || "active"}
    onChange={(e) =>
      setEditingProduct({
        ...editingProduct,
        status: e.target.value,
      })
    }
    className="mt-2 w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)]"
  >
    <option value="active">Active</option>
    <option value="draft">Draft</option>
    <option value="inactive">Inactive</option>
  </select>
</div>

             <EditInput
  label="Image URL"
  value={editingProduct.images?.[0] || ""}
  onChange={(value) =>
    setEditingProduct({
      ...editingProduct,
      images: value ? [value] : [],
    })
  }
/>

              {isPro && (
                <>
                  <EditInput
                    label="Live Sales Script"
                    value={editingProduct.script || ""}
                    onChange={(value) =>
                      setEditingProduct({ ...editingProduct, script: value })
                    }
                  />

                  <EditInput
                    label="Discount Offer"
                    value={editingProduct.offer || ""}
                    onChange={(value) =>
                      setEditingProduct({ ...editingProduct, offer: value })
                    }
                  />
                </>
              )}
            </div>

            {!isPro && (
              <div className="mt-5 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-white/10 dark:bg-white/10">
                <p className="text-sm font-black text-[var(--brand-pink)]">
                  Pro fields locked
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upgrade to add sales scripts and discount offers.
                </p>
              </div>
            )}

            <button
              onClick={saveEdit}
              disabled={savingEdit}
              className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {savingEdit ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditInput({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-black tracking-tight text-foreground">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-black tracking-tight brand-text">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}