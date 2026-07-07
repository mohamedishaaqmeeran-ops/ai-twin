import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, Settings, X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [manage, setManage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookieConsent");

    if (!saved) {
      setShow(true);
    }
  }, []);

  const saveConsent = (type) => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        type,
        date: new Date().toISOString(),
      })
    );

    setShow(false);
    setManage(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-4xl rounded-3xl border border-border bg-card p-5 shadow-2xl">
      <button
        onClick={() => setShow(false)}
        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)]">
          <Cookie className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-black text-foreground">
            We use cookies
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We use cookies to keep you signed in, improve performance, remember
            preferences, and understand how Twinn.live is used. Read our{" "}
            <Link
              to="/cookie-policy"
              className="font-bold text-[var(--brand-pink)] hover:underline"
            >
              Cookie Policy
            </Link>
            .
          </p>

          {manage && (
            <div className="mt-4 space-y-3 rounded-2xl border border-border bg-background p-4">
              <label className="flex items-start gap-3">
                <input type="checkbox" checked readOnly className="mt-1" />
                <span>
                  <strong>Essential cookies</strong>
                  <p className="text-sm text-muted-foreground">
                    Required for login, security and account sessions.
                  </p>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <span>
                  <strong>Analytics cookies</strong>
                  <p className="text-sm text-muted-foreground">
                    Helps us understand visits, pages and performance.
                  </p>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <span>
                  <strong>Marketing cookies</strong>
                  <p className="text-sm text-muted-foreground">
                    Used for ads, tracking and campaign measurement.
                  </p>
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => saveConsent("all")}
              className="brand-gradient h-11 rounded-[5px] px-5 text-sm font-bold text-white"
            >
              Allow All Cookies
            </button>

            <button
              onClick={() => setManage(!manage)}
              className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-border px-5 text-sm font-bold"
            >
              <Settings className="h-4 w-4" />
              Manage Cookies
            </button>

            <button
              onClick={() => saveConsent("essential")}
              className="h-11 rounded-[5px] border border-border px-5 text-sm font-bold"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}