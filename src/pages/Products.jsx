import { useState, useEffect } from "react";
import { Plus, Package, Trash2, Bell } from "lucide-react";
import Logo from "../components/Logo";

export default function Products() {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = () => {
    if (!form.name) return;

    setProducts([...products, form]);

    setForm({
      name: "",
      price: "",
      originalPrice: "",
      description: "",
      image: "",
    });

    setShowForm(false);
  };

  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      {/* Heading */}
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
            Products
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Items your AI twin can sell on live.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="brand-gradient grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="rounded-[5px] border border-border px-4 py-3"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="rounded-[5px] border border-border px-4 py-3"
            />

            <input
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              placeholder="Original price"
              className="rounded-[5px] border border-border px-4 py-3"
            />
          </div>

          <textarea
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="mt-4 w-full resize-none rounded-[5px] border border-border px-4 py-3"
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="mt-4 w-full rounded-[5px] border border-border px-4 py-3"
          />

          <button
            onClick={addProduct}
            className="brand-gradient mt-5 w-full rounded-2xl py-3 font-bold text-white"
          >
            + Add Product
          </button>
        </div>
      )}

      {/* Product List */}
      <div className="mt-10 flex flex-col gap-4">
        {products.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <Package className="h-7 w-7 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold">{p.name}</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {p.description}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-xl font-bold text-green-600">
                  ₹{p.price}
                </span>

                <span className="text-sm text-muted-foreground line-through">
                  ₹{p.originalPrice}
                </span>
              </div>
            </div>

            <button
              onClick={() => deleteProduct(i)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && !showForm && (
        <div className="mt-24 flex flex-col items-center text-center">
          <Package
            className="h-16 w-16 text-muted-foreground/60"
            strokeWidth={1.5}
          />

          <p className="mt-6 max-w-xs text-base text-muted-foreground">
            No products yet — add your first one above.
          </p>
        </div>
      )}
    </div>
  );
}