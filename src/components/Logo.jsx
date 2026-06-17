export default function Logo({ size = "md", showText = true }) {
  const sizes = {
    sm: { box: "h-8 w-8 text-base rounded-xl", text: "text-lg" },
    md: { box: "h-11 w-11 text-xl rounded-[5px]", text: "text-2xl" },
    lg: { box: "h-14 w-14 text-2xl rounded-[5px]", text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`${s.box} grid place-items-center`}>
  <img
    src="../images/logo.jpg"
    alt="Logo"
    className="h-12 w-12 object-contain rounded-[6px]"
  />
</div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${s.text} font-extrabold tracking-tight brand-text`}
          >
            twinn
          </span>

          <span className="text-[10px] font-medium text-muted-foreground leading-none ">
            Never sleep. <span className="brand-text">Never stop selling.</span>
          </span>
        </div>
      )}
    </div>
  );
}