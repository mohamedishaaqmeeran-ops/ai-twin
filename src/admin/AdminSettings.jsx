// src/admin/AdminSettings.jsx

import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Shield,
  Palette,
  Bell,
  Bot,
  Radio,
  Save,
  CheckCircle2,
  Lock,
  Trash2,
  AlertTriangle,
  Globe,
  Database,
  KeyRound,
  Sun,
  Moon,
} from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [settings, setSettings] = useState({
    adminName: "Admin",
    adminEmail: "admin@twinn.live",
    platformName: "Twin Live",
    supportEmail: "support@twinn.live",
    theme: "Light",
    userRegistration: true,
    emailNotifications: true,
    liveAlerts: true,
    aiTwinCreation: true,
    autoApproveProducts: false,
    allowMultiPlatformLive: true,
    twoFactor: true,
    apiAccess: true,
  });

  useEffect(() => {
    const old = JSON.parse(localStorage.getItem("adminSettings") || "{}");
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
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    applyTheme(settings.theme);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const resetPlatform = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
          <SettingsIcon className="h-4 w-4 text-[var(--brand-pink)]" />
          ADMIN SETTINGS
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Platform <span className="brand-text">Settings</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Manage admin profile, platform preferences, AI Twin controls, live
          commerce settings and security options.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <Card icon={User} title="Admin Profile">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Admin Name" icon={User}>
                <Input
                  value={settings.adminName}
                  onChange={(e) => update("adminName", e.target.value)}
                />
              </Field>

              <Field label="Admin Email" icon={Mail}>
                <Input
                  value={settings.adminEmail}
                  onChange={(e) => update("adminEmail", e.target.value)}
                />
              </Field>
            </div>
          </Card>

          <Card icon={Globe} title="Platform Details">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Platform Name" icon={Globe}>
                <Input
                  value={settings.platformName}
                  onChange={(e) => update("platformName", e.target.value)}
                />
              </Field>

              <Field label="Support Email" icon={Mail}>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) => update("supportEmail", e.target.value)}
                />
              </Field>
            </div>
          </Card>

          <Card icon={Bot} title="AI Twin Controls">
            <div className="space-y-4">
              <Toggle
                title="Allow AI Twin Creation"
                desc="Users can create their one AI Twin account."
                active={settings.aiTwinCreation}
                onClick={() =>
                  update("aiTwinCreation", !settings.aiTwinCreation)
                }
              />

              <Toggle
                title="Auto Approve Products"
                desc="Approve uploaded products automatically."
                active={settings.autoApproveProducts}
                onClick={() =>
                  update("autoApproveProducts", !settings.autoApproveProducts)
                }
              />

              <Toggle
                title="User Registration"
                desc="Allow new users to sign up to the platform."
                active={settings.userRegistration}
                onClick={() =>
                  update("userRegistration", !settings.userRegistration)
                }
              />
            </div>
          </Card>

          <Card icon={Radio} title="Live Commerce">
            <div className="space-y-4">
              <Toggle
                title="Multi-Platform Live"
                desc="Allow users to go live on Instagram, Facebook, YouTube and TikTok."
                active={settings.allowMultiPlatformLive}
                onClick={() =>
                  update(
                    "allowMultiPlatformLive",
                    !settings.allowMultiPlatformLive
                  )
                }
              />

              <Toggle
                title="Live Alerts"
                desc="Notify admin when users start or schedule live sessions."
                active={settings.liveAlerts}
                onClick={() => update("liveAlerts", !settings.liveAlerts)}
              />
            </div>
          </Card>

          <Card icon={Shield} title="Security">
            <div className="space-y-4">
              <Toggle
                title="Two-Factor Authentication"
                desc="Require 2FA for admin account access."
                active={settings.twoFactor}
                onClick={() => update("twoFactor", !settings.twoFactor)}
              />

              <Toggle
                title="API Access"
                desc="Enable API access for integrations and automation."
                active={settings.apiAccess}
                onClick={() => update("apiAccess", !settings.apiAccess)}
              />

              <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold tracking-wide text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10">
                <Lock className="h-4 w-4" />
                Change Admin Password
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
              Platform Status
            </h2>

            <div className="mt-5 space-y-3">
              <Status icon={Database} label="Storage" value="82.5 GB used" />
              <Status icon={Bot} label="AI Engine" value="Running" />
              <Status icon={Radio} label="Live Server" value="Online" />
              <Status icon={KeyRound} label="API Keys" value="Enabled" />
            </div>

            <button
              onClick={saveSettings}
              className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </section>

          <section className="rounded-3xl border border-red-500/30 bg-red-500/5 p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-red-600 dark:text-red-400">
              Danger Zone
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
              Resetting the platform removes local demo data including users,
              products, twins, schedules and settings.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-red-600 text-sm font-bold tracking-wide text-white transition hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Reset Platform Data
            </button>
          </section>
        </aside>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold tracking-wide text-foreground shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Admin settings saved successfully
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-tight text-foreground">
              Reset Platform Data?
            </h2>

            <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
              This action cannot be undone. All demo users, AI Twins, products,
              schedules, live data and local settings will be removed.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-[5px] border border-border bg-background py-3 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)]"
              >
                Cancel
              </button>

              <button
                onClick={resetPlatform}
                className="rounded-[5px] bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-black tracking-tight brand-text">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
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

function Toggle({ title, desc, active, onClick }) {
  return (
    <button
      type="button"
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

function ThemeButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
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

function Status({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>

      <span className="text-right text-sm font-black tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}