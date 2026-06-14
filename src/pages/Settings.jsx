import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  CheckCircle2,
  Sparkles,
  Lock,
  Sun,
  Moon,
} from "lucide-react";

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    name: "Ishaaq Meeran",
    email: "ishaaqmeeran1@gmail.com",
    brand: "Twin Live",
    language: "English",
    
    notifications: true,
    liveAlerts: true,
    orderAlerts: true,
    twoFactor: false,
    theme: "Light",
  });

  useEffect(() => {
    const old = JSON.parse(localStorage.getItem("userSettings") || "{}");
    const theme = localStorage.getItem("theme") || old.theme || "Light";

    setSettings((prev) => ({ ...prev, ...old, theme }));
    applyTheme(theme);
  }, []);

  const applyTheme = (theme) => {
    if (theme === "Dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "Dark");
      return;
    }

    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "Light");
  };

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    if (key === "theme") {
      applyTheme(value);
    }
  };

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    applyTheme(settings.theme);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-full space-y-6 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <SettingsIcon className="h-4 w-4 text-[var(--brand-pink)]" />
          ACCOUNT SETTINGS
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          <span className="brand-text">Settings</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Manage your profile, notifications, security and app preferences.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <Card icon={User} title="Profile">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name" icon={User}>
                <Input
                  value={settings.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </Field>

              <Field label="Email" icon={Mail}>
                <Input
                  value={settings.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>

              <Field label="Brand Name" icon={Sparkles}>
                <Input
                  value={settings.brand}
                  onChange={(e) => update("brand", e.target.value)}
                />
              </Field>

              <Field label="Language" icon={Globe}>
                <Select
                  value={settings.language}
                  onChange={(e) => update("language", e.target.value)}
                >
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Hindi</option>
                  <option>Arabic</option>
                </Select>
              </Field>
            </div>
          </Card>

          <Card icon={Bell} title="Notifications">
            <div className="space-y-4">
              <Toggle
                title="Email Notifications"
                desc="Receive account and product updates."
                active={settings.notifications}
                onClick={() => update("notifications", !settings.notifications)}
              />

              <Toggle
                title="Live Alerts"
                desc="Notify when a live session starts or ends."
                active={settings.liveAlerts}
                onClick={() => update("liveAlerts", !settings.liveAlerts)}
              />

              <Toggle
                title="Order Alerts"
                desc="Notify when new orders are created."
                active={settings.orderAlerts}
                onClick={() => update("orderAlerts", !settings.orderAlerts)}
              />
            </div>
          </Card>

          <Card icon={Shield} title="Security">
            <div className="space-y-4">
              <Toggle
                title="Two-Factor Authentication"
                desc="Add extra protection to your account."
                active={settings.twoFactor}
                onClick={() => update("twoFactor", !settings.twoFactor)}
              />

              <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10">
                <Lock className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card icon={Palette} title="Appearance">
            <div className="grid gap-3">
              <ThemeButton
                icon={Sun}
                label="Light"
                active={settings.theme === "Light"}
                onClick={() => update("theme", "Light")}
              />

              <ThemeButton
                icon={Moon}
                label="Dark"
                active={settings.theme === "Dark"}
                onClick={() => update("theme", "Dark")}
              />
            </div>

          
          </Card>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight brand-text">
              Account Status
            </h2>

            <div className="mt-5 space-y-3">
              <Status label="Plan" value="Free" />
              <Status label="AI Twin" value="Active" />
              <Status label="Storage" value="2.4 GB used" />
              <Status label="Live Minutes" value="120 / month" />
            </div>

            <button
              onClick={saveSettings}
              className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </section>
        </aside>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold tracking-wide text-foreground shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          Settings saved successfully
        </div>
      )}
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm transition sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-black tracking-tight brand-text">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 flex h-5 items-center gap-2 text-sm font-bold tracking-tight text-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>

      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-500/20"
    >
      {children}
    </select>
  );
}

function ThemeButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
          : "border-border bg-background text-foreground hover:border-[var(--brand-pink)]"
      }`}
    >
      <span className="flex items-center gap-3 text-sm font-black tracking-tight">
        <Icon className="h-5 w-5" />
        {label}
      </span>

      {active && <CheckCircle2 className="h-5 w-5" />}
    </button>
  );
}

function Toggle({ title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div>
        <p className="text-sm font-black tracking-tight text-foreground">
          {title}
        </p>

        <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
          {desc}
        </p>
      </div>

      <span
        className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide ${
          active
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
        }`}
      >
        {active ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function Status({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>

      <span className="font-black tracking-tight text-foreground">{value}</span>
    </div>
  );
}