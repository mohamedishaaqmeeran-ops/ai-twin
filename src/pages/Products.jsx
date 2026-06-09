import { useState } from "react";
import { Plus, Package, Trash2 } from "lucide-react";
import { Bell } from "lucide-react";
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
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

  return (
    <div>
      <div className="flex items-center justify-between md:hidden">
        <Logo />

        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="h-5 w-5" />
        </button>
      </div>
      {/* HEADER */}
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className=" text-4xl font-black tracking-tight">Products</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Items your AI twin can sell on live.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="brand-gradient glow-pink grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mt-10 rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
          {/* row 1 */}
          <div className="grid grid-cols-3 gap-4">
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

          {/* row 2 */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full resize-none rounded-[5px] border border-border px-4 py-3"
          />

          {/* row 3 */}
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full rounded-[5px] border border-border px-4 py-3"
          />

          {/* button */}
          <button
            onClick={addProduct}
            className="brand-gradient w-full rounded-2xl py-3 font-bold text-white"
          >
            + Add Product
          </button>
        </div>
      )}

      {/* PRODUCTS LIST */}
      <div className="mt-10 flex flex-col gap-4">
        {products.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm"
          >
            {/* LEFT: IMAGE */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* MIDDLE: DETAILS */}
            <div className="flex-1">
              <h2 className="text-lg font-bold">{p.name}</h2>

              <p className="text-sm text-muted-foreground">{p.description}</p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">₹{p.price}</span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{p.originalPrice}
                </span>
              </div>
            </div>

            {/* RIGHT: DELETE */}
            <button
              onClick={() => deleteProduct(i)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && !showForm && (
        <div className="mt-24 flex flex-col items-center text-center">
          <Package className="h-16 w-16 text-muted-foreground/60" strokeWidth={1.5} />
          <p className="mt-6 max-w-xs text-base text-muted-foreground">
            No products yet — add your first one above.
          </p>
        </div>
      )}
    </div>
  );
}
