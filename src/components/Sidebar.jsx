import { Link, useLocation } from "react-router-dom";
import { Sparkles, Package, Calendar, Radio, BarChart3 } from "lucide-react";
import Logo from "./Logo";

const items = [
  { to: "/app/wizard", label: "Avatar Wizard", Icon: Sparkles },
  { to: "/app/products", label: "Products", Icon: Package },
  { to: "/app/schedule", label: "Schedule Live", Icon: Calendar },
  { to: "/app/golive", label: "Go Live", Icon: Radio },
  { to: "/app/analytics", label: "Analytics", Icon: BarChart3 },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="px-6 py-6">
        <Logo />
      </div>
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {items.map(({ to, label, Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "brand-gradient text-white shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
