// src/pages/pro/ProSettings.jsx

import { useEffect, useState } from "react";
import {
  Crown,
  User,
  Mail,
  Globe,
  Palette,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Sun,
  Moon,
  Lock,
  Trash2,
  AlertTriangle,
  Sparkles,
  BadgeCheck,
  Bot,
  Package,
  Share2,
  Radio,
} from "lucide-react";
import { PRO_LIMITS, getProTwins, getProProducts, getConnectedPlatforms } from "./proData";

const ME_API = "https://ai-twin-backend-4.onrender.com/api/auth/me";

export default function ProSettings() {
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apiError, setApiError] = useState("");

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    brand: "Twin Live",
    language: "English",
    notifications: true,
    liveAlerts: true,
    analyticsAlerts: true,
    twoFactor: false,
    theme: "Light",
    plan: "pro",
  });

  const twins = getProTwins();
  const products = getProProducts();
  const platforms = getConnectedPlatforms();

  useEffect(() => {
    const old = JSON.parse(localStorage.getItem("proSettings") || "{}");
    const theme = localStorage.getItem("theme") || old.theme || "Light";

    setSettings((prev) => ({ ...prev, ...old, theme }));
    applyTheme(theme);
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch(ME_API, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to fetch account details");
      }

      const user = data.user || data;

      setSettings((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        plan: user.plan || "pro",
      }));
    } catch (err) {
      setApiError(err.message);
    }
  };

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
    localStorage.setItem("proSettings", JSON.stringify(settings));
    applyTheme(settings.theme);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const deleteAccount = () => {
    const theme = localStorage.getItem("theme");
    localStorage.clear();

    if (theme) localStorage.setItem("theme", theme);

    window.location.href = "/";
  };

  return (
    <div className="min-h-full space-y-6 bg-background text-foreground">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
          <Crown className="h-4 w-4" />
          PRO ACCOUNT SETTINGS
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Pro <span className="brand-text">Settings</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
          Manage your Pro profile, plan limits, notifications, security and app appearance.
        </p>

        {apiError && (
          <div className="mt-4 rounded-[5px] bg-red-50 p-3 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {apiError}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <Card icon={User} title="Profile">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name" icon={User}>
                <Input value={settings.name} onChange={(e) => update("name", e.target.value)} />
              </Field>

              <Field label="Email" icon={Mail}>
                <Input value={settings.email} onChange={(e) => update("email", e.target.value)} />
              </Field>

              <Field label="Brand Name" icon={Sparkles}>
                <Input value={settings.brand} onChange={(e) => update("brand", e.target.value)} />
              </Field>

              <Field label="Language" icon={Globe}>
                <Select value={settings.language} onChange={(e) => update("language", e.target.value)}>
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Hindi</option>
                  <option>Arabic</option>
                </Select>
              </Field>
            </div>
          </Card>

          <Card icon={Bell} title="Pro Notifications">
            <div className="space-y-4">
              <Toggle
                title="Email Notifications"
                desc="Receive product, account and Pro plan updates."
                active={settings.notifications}
                onClick={() => update("notifications", !settings.notifications)}
              />

              <Toggle
                title="Live Alerts"
                desc="Notify when your AI Twin starts or ends a live session."
                active={settings.liveAlerts}
                onClick={() => update("liveAlerts", !settings.liveAlerts)}
              />

              <Toggle
                title="Analytics Alerts"
                desc="Receive weekly live sales analytics and performance summaries."
                active={settings.analyticsAlerts}
                onClick={() => update("analyticsAlerts", !settings.analyticsAlerts)}
              />
            </div>
          </Card>

          <Card icon={Shield} title="Security">
            <div className="space-y-4">
              <Toggle
                title="Two-Factor Authentication"
                desc="Add extra protection to your Pro account."
                active={settings.twoFactor}
                onClick={() => update("twoFactor", !settings.twoFactor)}
              />

              <button className="flex h-12 items-center justify-center gap-2 rounded-[5px] border-2 border-[var(--brand-pink)] px-5 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10">
                <Lock className="h-4 w-4" />
                Change Password
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[5px] border-2 border-red-500 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-500 hover:text-white dark:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
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

          <section className="rounded-3xl border border-[var(--brand-pink)] bg-pink-50 p-5 shadow-sm dark:bg-white/10 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                <Crown className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-black text-foreground">Creator Pro</h2>
                <p className="text-sm font-bold text-[var(--brand-pink)]">₹1,499 / month</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Status icon={Bot} label="AI Twins" value={`${twins.length} / ${PRO_LIMITS.maxTwins}`} />
              <Status icon={Package} label="Products" value={`${products.length} / ${PRO_LIMITS.maxProducts}`} />
              <Status icon={Share2} label="Platforms" value={`${platforms.length} / ${PRO_LIMITS.maxPlatforms}`} />
              <Status icon={Radio} label="AI Replies" value="Unlimited" />
            </div>

            <div className="mt-5 rounded-2xl bg-background p-4">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-1 h-5 w-5 text-emerald-500" />
                <p className="text-sm font-medium leading-6 text-muted-foreground">
                  Custom voice cloning, advanced lip sync, live sales analytics and badge removal are enabled.
                </p>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="brand-gradient mt-6 flex w-full items-center justify-center gap-2 rounded-[5px] py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Pro Settings
            </button>
          </section>
        </aside>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="mt-5 text-center text-2xl font-black">Delete Pro Account?</h2>

            <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">
              This action cannot be undone.
              <br />
              Your AI Twins, products, platforms, analytics and settings will be permanently removed.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-[5px] border border-border py-3 text-sm font-bold transition hover:bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={deleteAccount}
                className="flex-1 rounded-[5px] bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold text-foreground shadow-xl">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          Pro settings saved successfully
        </div>
      )}
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
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
    <div className="flex flex-col">
      <label className="mb-2 flex h-5 items-center gap-2 text-sm font-bold text-foreground">
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

function Toggle({ title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 text-left transition hover:border-[var(--brand-pink)]"
    >
      <div>
        <p className="text-sm font-black text-foreground">{title}</p>
        <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">{desc}</p>
      </div>

      <span
        className={`rounded-full px-4 py-2 text-xs font-bold ${
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
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
        active
          ? "border-[var(--brand-pink)] bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10"
          : "border-border bg-background text-foreground hover:border-[var(--brand-pink)]"
      }`}
    >
      <span className="flex items-center gap-3 text-sm font-black">
        <Icon className="h-5 w-5" />
        {label}
      </span>

      {active && <CheckCircle2 className="h-5 w-5" />}
    </button>
  );
}

function Status({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm">
      <span className="flex items-center gap-2 font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-[var(--brand-pink)]" />
        {label}
      </span>

      <span className="font-black text-foreground">{value}</span>
    </div>
  );
}