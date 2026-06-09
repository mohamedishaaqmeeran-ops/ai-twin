import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import Landing from "./pages/Landing.jsx";
import SignIn from "./pages/SignIn.jsx";
import Wizard from "./pages/Wizard.jsx";
import Products from "./pages/Products.jsx";
import Schedule from "./pages/Schedule.jsx";
import GoLive from "./pages/GoLive.jsx";
import Portrait from "./pages/Portrait.jsx";
import Analytics from "./pages/Analytics.jsx";
import Pricing from "./pages/Pricing.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="/app" element={<AppShellLayout />}>
        <Route index element={<Navigate to="/app/wizard" replace />} />
        <Route path="wizard" element={<Wizard />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="products" element={<Products />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="golive" element={<GoLive />} />
        <Route path="portrait" element={<Portrait />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Outlet } from "react-router-dom";

function AppShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-black brand-text">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
        <a href="/" className="mt-4 inline-block font-semibold text-[var(--brand-pink)]">
          ← Go home
        </a>
      </div>
    </div>
  );
}
