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
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
              <ShoppingBag className="h-4 w-4 text-[var(--brand-pink)]" />
              AI TWIN PRODUCTS
            </span>

            <h1 className="mt-5 text-3xl font-black sm:text-4xl">
              <span className="brand-text">Products</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Add, edit and manage products your AI Twin can sell live.
            </p>
          </div>

          <Link
            to="/app/products/add"
            className="brand-gradient glow-pink flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[5px] border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-[var(--brand-pink)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-semibold outline-none"
          >
            <option>All Products</option>
            <option>Ready to sell</option>
            <option>Needs script</option>
            <option>Out of stock</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link to={`/app/products/${product.id}`}>
              <div className="relative overflow-hidden rounded-2xl bg-pink-50 p-4">
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-56 w-full rounded-[5px] object-contain transition duration-300 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--brand-pink)] shadow-sm">
                  {product.status}
                </span>

                <span className="absolute right-3 top-3 rounded-full bg-[#0d0d12] px-3 py-1 text-xs font-bold text-white">
                  {product.category}
                </span>
              </div>
            </Link>

            <div className="mt-5">
              <h3 className="text-lg font-black text-foreground">
                {product.name}
              </h3>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-black brand-text">{product.price}</p>
                <p className="text-xs font-bold text-muted-foreground">
                  {product.sales}
                </p>
              </div>

              <p
                className={`mt-2 text-sm font-bold ${
                  product.stock === "Low Stock"
                    ? "text-orange-500"
                    : "text-emerald-600"
                }`}
              >
                {product.stock}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setEditingProduct(product)}
                className="flex h-11 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <Link
                to="/app/golive"
                onClick={() =>
                  localStorage.setItem("selectedProduct", product.name)
                }
                className="brand-gradient flex h-11 items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white transition hover:opacity-90"
              >
                <Radio className="h-4 w-4" />
                Sell Live
              </Link>

              <Link
                to={`/app/products/${product.id}`}
                className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border text-sm font-bold transition hover:border-[var(--brand-pink)]"
              >
                <Package className="h-4 w-4" />
                Details
              </Link>

              <button
                onClick={() => deleteProduct(product.id)}
                className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-red-200 text-sm font-bold text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black brand-text">Edit Product</h2>

              <button
                onClick={() => setEditingProduct(null)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border"
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
              className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white"
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
      <label className="text-sm font-bold">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-pink)]"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-black brand-text">{value}</p>
        </div>
      </div>
    </div>
  );
}