import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const defaultProducts = [
  {
    id: 1,
    name: "Vitamin C Glow Serum",
    price: "₹799",
    stock: "In Stock",
    status: "Ready to sell",
    category: "Beauty",
    sales: "342 sold",
    img: "/images/6.jpeg",
  },
  {
    id: 2,
    name: "Wireless Headphone",
    price: "₹1,299",
    stock: "In Stock",
    status: "Ready to sell",
    category: "Electronics",
    sales: "218 sold",
    img: "/images/5.jpeg",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: "₹2,499",
    stock: "Low Stock",
    status: "Needs script",
    category: "Gadgets",
    sales: "97 sold",
    img: "/images/7.jpeg",
  },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Products");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products") || "[]");

    if (saved.length) {
      setProducts(saved);
    } else {
      setProducts(defaultProducts);
      localStorage.setItem("products", JSON.stringify(defaultProducts));
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category} ${product.status}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesFilter =
        filter === "All Products" || product.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [products, query, filter]);

  const deleteProduct = (id) => {
    const updated = products.filter((product) => product.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const saveEdit = () => {
    const updated = products.map((product) =>
      product.id === editingProduct.id ? editingProduct : product
    );

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
              <ShoppingBag className="h-4 w-4 text-[var(--brand-pink)]" />
              AI TWIN PRODUCTS
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              <span className="brand-text">Products</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Add, edit and manage products your AI Twin can sell live.
            </p>
          </div>

          <Link
            to="/app/products/add"
            className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total Products" value={products.length} />
        <StatCard
          icon={Radio}
          label="Live Ready"
          value={products.filter((p) => p.status === "Ready to sell").length}
        />
        <StatCard
          icon={Tag}
          label="Need Script"
          value={products.filter((p) => p.status === "Needs script").length}
        />
        <StatCard icon={TrendingUp} label="Total Sales" value="₹2.4L" />
      </section>

      {/* Search */}
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
            <option>All Products</option>
            <option>Ready to sell</option>
            <option>Needs script</option>
            <option>Out of stock</option>
          </select>
        </div>
      </section>

      {/* Products */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Link to={`/app/products/${product.id}`}>
              <div className="relative overflow-hidden rounded-2xl bg-pink-50 p-4 dark:bg-white/10">
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-56 w-full rounded-[5px] object-contain transition duration-300 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-xs font-black tracking-wide text-[var(--brand-pink)] shadow-sm">
                  {product.status}
                </span>

                <span className="absolute right-3 top-3 rounded-full bg-[#0d0d12] px-3 py-1 text-xs font-bold tracking-wide text-white">
                  {product.category}
                </span>
              </div>
            </Link>

            <div className="mt-5">
              <h3 className="text-lg font-black tracking-tight text-foreground">
                {product.name}
              </h3>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-2xl font-black tracking-tight brand-text">
                  {product.price}
                </p>

                <p className="text-xs font-bold tracking-wide text-muted-foreground">
                  {product.sales}
                </p>
              </div>

              <p
                className={`mt-2 text-sm font-bold ${
                  product.stock === "Low Stock"
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {product.stock}
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

              <Link
                to="/app/golive"
                onClick={() =>
                  localStorage.setItem("selectedProduct", product.name)
                }
                className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] text-sm font-bold tracking-wide text-white transition hover:opacity-90"
              >
                <Radio className="h-4 w-4" />
                Sell Live
              </Link>

              <Link
                to={`/app/products/${product.id}`}
                className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border bg-background text-sm font-bold tracking-wide text-foreground transition hover:border-[var(--brand-pink)]"
              >
                <Package className="h-4 w-4" />
                Details
              </Link>

              <button
                onClick={() => deleteProduct(product.id)}
                className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-red-200 text-sm font-bold tracking-wide text-red-500 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
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

      {/* Edit Modal */}
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
                value={editingProduct.name}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, name: value })
                }
              />

              <EditInput
                label="Price"
                value={editingProduct.price}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, price: value })
                }
              />

              <EditInput
                label="Category"
                value={editingProduct.category}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, category: value })
                }
              />

              <EditInput
                label="Stock"
                value={editingProduct.stock}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, stock: value })
                }
              />

              <EditInput
                label="Status"
                value={editingProduct.status}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, status: value })
                }
              />

              <EditInput
                label="Image Path"
                value={editingProduct.img}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, img: value })
                }
              />
            </div>

            <button
              onClick={saveEdit}
              className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Changes
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