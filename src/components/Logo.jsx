import { Link } from "react-router-dom";

export default function Logo({ size = "md", showText = true }) {
  const sizes = {
    sm: { box: "h-8 w-8 text-base rounded-xl", text: "text-lg" },
    md: { box: "h-11 w-11 text-xl rounded-[5px]", text: "text-2xl" },
    lg: { box: "h-14 w-14 text-2xl rounded-[5px]", text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <Link to="/" className="flex items-center gap-3">
      <div className={`${s.box} grid place-items-center`}>
        <img
          src="/images/logos.png"
          alt="Logo"
          className="h-12 w-12 object-contain rounded-[6px]"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <p
            className={`${s.text} tracking-tight font-black text-2xl`}
            style={{
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            twinn<span className="brand-text">.</span>live
          </p>

          <span className="text-[10px] font-medium leading-none text-muted-foreground">
            Never sleep.{" "}
            <span className="brand-text">Never stop selling.</span>
          </span>
        </div>
      )}
    </Link>
  );
}