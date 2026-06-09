export default function GradientButton({ children, className = "", icon, ...props }) {
  return (
    <button
      {...props}
      className={`brand-gradient glow-pink inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-60 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
