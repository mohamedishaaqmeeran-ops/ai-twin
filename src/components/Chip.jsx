export default function Chip({ active, children, onClick, icon, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-[5px] border px-5 py-3 text-sm font-semibold transition ${
        active
          ? "brand-gradient border-transparent text-white shadow-md"
          : "border-border bg-card text-foreground hover:border-foreground/20"
      } ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
