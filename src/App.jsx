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
import WaitlistForm from "./pages/WaitlistForm.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* ✅ WAITLIST PAGE */}
      <Route path="/waitlist" element={<WaitlistForm />} />

      {/* APP SHELL ROUTES */}
      <Route path="/app" element={<AppShellLayout />}>
        <Route index element={<Navigate to="/app/wizard" replace />} />
        <Route path="wizard" element={<Wizard />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="products" element={<Products />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="golive" element={<GoLive />} />
        <Route path="portrait" element={<Portrait />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="connect" element={<ConnectAccounts />} />
<Route path="create" element={<CreateTwin />} />
<Route path="basic-info" element={<BasicInfo />} />
<Route path="train" element={<TrainTwin />} />
<Route path="appearance" element={<CustomizeAppearance />} />
<Route path="voice" element={<VoiceLanguage />} />
<Route path="settings" element={<LiveSettings />} />
<Route path="review" element={<ReviewLaunch />} />
<Route path="dashboard" element={<TwinDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Outlet } from "react-router-dom";
import ConnectAccounts from "./pages/ConnectAccounts.jsx";
import CreateTwin from "./pages/CreateTwin.jsx";
import BasicInfo from "./pages/BasicInfo.jsx";
import TrainTwin from "./pages/TrainTwin.jsx";
import CustomizeAppearance from "./pages/CustomizeAppearance.jsx";
import VoiceLanguage from "./pages/VoiceLanguage.jsx";
import LiveSettings from "./pages/LiveSettings.jsx";
import ReviewLaunch from "./pages/ReviewLaunch.jsx";
import TwinDashboard from "./pages/TwinDashboard.jsx";
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
        <a
          href="/"
          className="mt-4 inline-block font-semibold text-[var(--brand-pink)]"
        >
          ← Go home
        </a>
      </div>
    </div>
  );
}