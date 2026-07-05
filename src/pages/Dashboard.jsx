{recentProducts.map((product) => {
  const productImage = getProductImage(product);

  return (
    <div
      key={product._id || product.id || product.name}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <img
          src={productImage}
          alt={product.name}
          className="h-16 w-16 rounded-xl bg-pink-50 object-cover dark:bg-white/10"
          onError={(e) => {
            console.log("FAILED PRODUCT IMAGE:", productImage);
            e.currentTarget.src = "/images/6.jpeg";
          }}
        />

        <div>
          <h3 className="text-base font-black tracking-tight text-foreground">
            {product.name}
          </h3>

          <p className="text-sm font-bold brand-text">
            {getProductPrice(product)}
          </p>

          {Number(product.salePrice) > 0 &&
            Number(product.salePrice) < Number(product.price) && (
              <p className="text-xs font-bold text-muted-foreground line-through">
                ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </p>
            )}

          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {product.status || "active"}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          navigate(`/app/golive?product=${encodeURIComponent(product.name)}`);
        }}
        className="brand-gradient rounded-[5px] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
      >
        Sell Live
      </button>
    </div>
  );
})}