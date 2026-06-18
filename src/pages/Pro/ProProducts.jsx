// src/pages/pro/ProProducts.jsx

import { useState } from "react";
import {
  Package,
  Plus,
  Trash2,
  Crown,
  IndianRupee,
  Image,
  AlertCircle,
} from "lucide-react";
import { getProProducts, saveProProducts, PRO_LIMITS } from "./proData";

export default function ProProducts() {
  const [products, setProducts] = useState(getProProducts());
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "/images/product.png",
  });

  const addProduct = (e) => {
    e.preventDefault();
    setError("");

    if (products.length >= PRO_LIMITS.maxProducts) {
      setError("Pro plan allows maximum 100 products.");
      return;
    }

    if (!form.name.trim() || !form.price.trim()) {
      setError("Product name and price are required.");
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
    };

    const updated = [...products, newProduct];
    setProducts(updated);
    saveProProducts(updated);

    setForm({
      name: "",
      price: "",
      category: "",
      image: "/images/product.png",
    });
  };

  const deleteProduct = (id) => {
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    saveProProducts(updated);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          PRO PRODUCTS
        </span>

        <h1 className="mt-5 text-4xl font-black">
          Product <span className="brand-text">Library</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Add up to {PRO_LIMITS.maxProducts} products for your AI Twins.
          Current: {products.length} / {PRO_LIMITS.maxProducts}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          onSubmit={addProduct}
          className="rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <h2 className="text-2xl font-black brand-text">Add Product</h2>

          <div className="mt-6 space-y-4">
            <Field icon={Package} label="Product Name">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Glow Boost Serum"
                className="input-pro"
              />
            </Field>

            <Field icon={IndianRupee} label="Price">
              <input
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: e.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="799"
                className="input-pro"
              />
            </Field>

            <Field icon={Package} label="Category">
              <input
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="Beauty / Electronics"
                className="input-pro"
              />
            </Field>

            <Field icon={Image} label="Image URL">
              <input
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="/images/product.png"
                className="input-pro"
              />
            </Field>

            {error && (
              <div className="flex items-center gap-2 rounded-[5px] bg-red-50 p-3 text-sm font-bold text-red-600 dark:bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <button className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white">
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </form>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="rounded-3xl bg-background p-4">
                <img
                  src={product.image || "/images/product.png"}
                  alt={product.name}
                  className="h-44 w-full rounded-2xl object-contain"
                />
              </div>

              <h3 className="mt-4 text-lg font-black">{product.name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {product.category || "General"}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-black brand-text">
                  ₹{product.price}
                </span>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="rounded-xl border border-red-200 p-3 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      <style>{`
        .input-pro {
          width: 100%;
          border-radius: 5px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          outline: none;
        }
        .input-pro:focus {
          border-color: var(--brand-pink);
        }
      `}</style>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>
      {children}
    </div>
  );
}