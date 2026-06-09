import { Link, useLocation } from "react-router-dom";
import { Sparkles, Package, Calendar, Radio, BarChart3 } from "lucide-react";

const items = [
  { to: "/app/wizard", label: "Wizard", Icon: Sparkles },
  { to: "/app/products", label: "Products", Icon: Package },
  { to: "/app/schedule", label: "Schedule", Icon: Calendar },
  { to: "/app/golive", label: "Go Live", Icon: Radio },
  { to: "/app/analytics", label: "Analytics", Icon: BarChart3 },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-2xl grid-cols-5 px-2 pb-2 pt-3">
        {items.map(({ to, label, Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <li key={to} className="flex justify-center">
              <Link to={to} className="flex flex-col items-center gap-1">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-2xl transition ${
                    active ? "brand-gradient text-white shadow-md" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span className={`text-[11px] font-semibold ${active ? "brand-text" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
