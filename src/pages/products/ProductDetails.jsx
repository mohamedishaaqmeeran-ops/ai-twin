import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Radio,
  Pencil,
  Trash2,
  ShoppingBag,
  Sparkles,
  Star,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const products = JSON.parse(
    localStorage.getItem("products") || "[]"
  );

  const product =
    products.find((item) => item.id === Number(id)) || {
      id: 1,
      name: "Vitamin C Glow Serum",
      price: "₹799",
      stock: "In Stock",
      category: "Beauty",
      img: "/images/6.jpeg",
      description:
        "Brightens skin, reduces pigmentation and provides natural glow.",
      script:
        "Introduce product, explain benefits, mention ingredients, answer FAQs and provide purchase link.",
    };

  const sellLive = () => {
    localStorage.setItem("selectedProduct", product.name);
    navigate("/app/golive");
  };

  const deleteProduct = () => {
    const updated = products.filter((item) => item.id !== product.id);
    localStorage.setItem("products", JSON.stringify(updated));
    navigate("/app/products");
  };

  return (
    <div className="space-y-6">

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 px-4 py-2 text-xs font-bold">
          <ShoppingBag className="h-4 w-4 text-[var(--brand-pink)]" />
          PRODUCT DETAILS
        </span>

        <h1 className="mt-5 text-4xl font-black">
          <span className="brand-text">{product.name}</span>
        </h1>

        <p className="mt-2 text-muted-foreground">
          Complete product information used by your AI Twin during live selling.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="rounded-3xl bg-pink-50 p-5">
            <img
              src={product.img}
              alt={product.name}
              className="h-96 w-full rounded-2xl object-contain"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-background p-3 text-center">
              <TrendingUp className="mx-auto h-5 w-5 text-[var(--brand-pink)]" />
              <p className="mt-2 text-xs">245 Sold</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-3 text-center">
              <Star className="mx-auto h-5 w-5 text-yellow-500" />
              <p className="mt-2 text-xs">4.9 Rating</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-3 text-center">
              <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
              <p className="mt-2 text-xs">{product.stock}</p>
            </div>
          </div>
        </section>

        <section className="space-y-5">

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <h2 className="text-3xl font-black">{product.name}</h2>

                <p className="mt-2 text-3xl font-black brand-text">
                  {product.price}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">
                  {product.stock}
                </span>
              </div>

              <span className="rounded-full bg-[#0d0d12] px-4 py-2 text-sm font-bold text-white">
                {product.category}
              </span>

            </div>

            <div className="mt-6">
              <h3 className="font-black">Description</h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {product.description}
              </p>
            </div>

          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-[var(--brand-pink)]" />

              <h3 className="text-xl font-black">
                AI Twin Selling Script
              </h3>

            </div>

            <div className="mt-5 rounded-2xl bg-pink-50 p-5">

              <p className="text-sm leading-7 text-gray-700">
                {product.script}
              </p>

            </div>

          </div>

          <div className="grid gap-3 sm:grid-cols-3">

            <button
              onClick={sellLive}
              className="brand-gradient flex h-12 items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white"
            >
              <Radio className="h-4 w-4" />
              Sell Live
            </button>

            <Link
              to={`/app/products/edit/${product.id}`}
              className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>

            <button
              onClick={deleteProduct}
              className="flex h-12 items-center justify-center gap-2 rounded-[5px] border border-red-200 text-sm font-bold text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>

          </div>

        </section>

      </div>
    </div>
  );
}