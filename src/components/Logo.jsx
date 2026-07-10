import { Link } from "react-router-dom";

export default function Logo({ size = "md", showText = true }) {
  const sizes = {
    sm: { box: "h-8 w-8 rounded-xl", text: "text-lg" },
    md: { box: "h-11 w-11 rounded-[5px]", text: "text-2xl" },
    lg: { box: "h-14 w-14 rounded-[5px]", text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <Link
      to="/"
      className="flex cursor-pointer items-center gap-3"
    >
      <div className={`${s.box} grid place-items-center`}>
        <img
          src="/images/logos.png"
          alt="Twinn.live"
          className="h-12 w-12 rounded-[6px] object-contain"
        />
      </div>

      {showText && (
        <div className="pointer-events-auto flex flex-col">
          <h1
            className={`${s.text} text-2xl font-black tracking-tight`}
            style={{
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            twinn<span className="brand-text">.</span>live
          </h1>

          <span className="text-[10px] font-medium leading-none text-muted-foreground">
            Never sleep.{" "}
            <span className="brand-text">Never stop selling.</span>
          </span>
        </div>
      )}
    </Link>
  );
}