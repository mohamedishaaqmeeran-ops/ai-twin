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
} from "lucide-react";

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    name: "Ishaaq Meeran",
    email: "ishaaqmeeran1@gmail.com",
    brand: "Twin Live",
    language: "English",
    timezone: "Asia/Kolkata",
    notifications: true,
    liveAlerts: true,
    orderAlerts: true,
    twoFactor: false,
    theme: "Light",
  });

  useEffect(() => {
    const old = JSON.parse(localStorage.getItem("userSettings") || "{}");
    setSettings((prev) => ({ ...prev, ...old }));
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setSaved(true);

    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-semibold text-foreground">
          <SettingsIcon className="h-4 w-4 text-[var(--brand-pink)]" />
          ACCOUNT SETTINGS
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          <span className="brand-text">Settings</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage your profile, notifications, security and app preferences.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <Card icon={User} title="Profile">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name" icon={User}>
                <input
                  value={settings.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Email" icon={Mail}>
                <input
                  value={settings.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Brand Name" icon={Sparkles}>
                <input
                  value={settings.brand}
                  onChange={(e) => update("brand", e.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Language" icon={Globe}>
                <select
                  value={settings.language}
                  onChange={(e) => update("language", e.target.value)}
                  className="input"
                >
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Hindi</option>
                  <option>Arabic</option>
                </select>
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

              <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold text-[var(--brand-pink)] hover:bg-pink-50">
                <Lock className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card icon={Palette} title="Preferences">
            <div className="space-y-4">
              <Field label="Theme" icon={Palette}>
                <select
                  value={settings.theme}
                  onChange={(e) => update("theme", e.target.value)}
                  className="input"
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </Field>

              <Field label="Timezone" icon={Globe}>
                <select
                  value={settings.timezone}
                  onChange={(e) => update("timezone", e.target.value)}
                  className="input"
                >
                  <option>Asia/Kolkata</option>
                  <option>Asia/Dubai</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                </select>
              </Field>
            </div>
          </Card>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black brand-text">Account Status</h2>

            <div className="mt-5 space-y-3">
              <Status label="Plan" value="Free" />
              <Status label="AI Twin" value="Active" />
              <Status label="Storage" value="2.4 GB used" />
              <Status label="Live Minutes" value="120 / month" />
            </div>

            <button
              onClick={saveSettings}
              className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </aside>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0d0d12] px-5 py-4 text-sm font-bold text-white shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          Settings saved successfully
        </div>
      )}
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Icon className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-black brand-text">{title}</h2>
      </div>

      {children}
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </label>

      {children}
    </div>
  );
}

function Toggle({ title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div>
        <p className="font-black">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>

      <span
        className={`rounded-full px-4 py-2 text-xs font-bold ${
          active
            ? "bg-emerald-50 text-emerald-600"
            : "bg-orange-50 text-orange-500"
        }`}
      >
        {active ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function Status({ label, value }) {
  return (
    <div className="flex justify-between rounded-xl border border-border bg-background p-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}