import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signin from "./pages/SignIn";
import AppLayout from "./components/AppLayout";

import Dashboard from "./pages/Dashboard";
import TwinDashboard from "./pages/twin/TwinDashboard";
import CreateTwin from "./pages/twin/CreateTwin";
import TrainTwin from "./pages/twin/TrainTwin";
import TestTwin from "./pages/twin/TestTwin";
import EditTwin from "./pages/twin/EditTwin";

import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import ProductDetails from "./pages/products/ProductDetails";

import ConnectSocial from "./pages/ConnectSocial";
import ScheduleLive from "./pages/schedule/ScheduleLive";
import CreateSchedule from "./pages/schedule/CreateSchedule";

import GoLive from "./pages/golive/GoLive";
import PreLivePreview from "./pages/golive/PreLivePreview";
import LiveStream from "./pages/golive/LiveStream";

import ScrollToTop from "./components/ScrollToTop";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import WaitlistForm from "./pages/WaitlistForm";
import Settings from "./pages/Settings";
import creators from "./pages/Creators";


import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminTwins from "./admin/AdminTwins";
import AdminProducts from "./admin/AdminProducts";
import AdminLives from "./admin/AdminLives";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminSettings from "./admin/AdminSettings";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import TermsCondition from "./pages/TermsCondition";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import AboutUs from "./pages/AboutUs";
import Creators from "./pages/Creators";
import Brands from "./pages/Brand";
import Agency from "./pages/Agency";


function RequireAdmin({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/app" replace />;
  }

  return children;
}
function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "Light";

  if (theme === "Dark") {
    document.documentElement.classList.add("dark");
    return;
  }

  if (theme === "Light") {
    document.documentElement.classList.remove("dark");
    return;
  }

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  document.documentElement.classList.toggle("dark", prefersDark);
}

function RequireTwin({ children }) {
  const hasTwin = localStorage.getItem("hasTwin") === "true";

  useEffect(() => {
    if (!hasTwin) {
      toast.warning(
        "Please create your AI Twin first to access this section.",
        {
          toastId: "create-twin-warning",
        }
      );
    }
  }, [hasTwin]);

  if (!hasTwin) {
    return <Navigate to="/app/twin/create" replace />;
  }

  return children;
}

export default function App() {
  useEffect(() => {
    applySavedTheme();
  }, []);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/brand" element={<Brands />} />
        <Route path="/agency" element={<Agency />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsCondition />} />
        <Route path="/waitlist" element={<WaitlistForm />} />

        <Route path="/app" element={<AppLayout />}>
        
          <Route index element={<Dashboard />} />
<Route path="/app/pro" element={<Dashboard />} />
          <Route path="twin" element={<TwinDashboard />} />
          <Route path="twin/create" element={<CreateTwin />} />
          <Route path="twin/edit" element={<EditTwin />} />
          <Route path="twin/train" element={<TrainTwin />} />
          <Route path="twin/test" element={<TestTwin />} />

          <Route
            path="products"
            element={
              <RequireTwin>
                <Products />
              </RequireTwin>
            }
          />

          <Route
            path="products/add"
            element={
              <RequireTwin>
                <AddProduct />
              </RequireTwin>
            }
          />

          <Route
            path="products/:id"
            element={
              <RequireTwin>
                <ProductDetails />
              </RequireTwin>
            }
          />

          <Route
            path="connect"
            element={
              <RequireTwin>
                <ConnectSocial />
              </RequireTwin>
            }
          />

          <Route
            path="schedule"
            element={
              <RequireTwin>
                <ScheduleLive />
              </RequireTwin>
            }
          />

          <Route
            path="schedule/create"
            element={
              <RequireTwin>
                <CreateSchedule />
              </RequireTwin>
            }
          />

          <Route
            path="golive"
            element={
              <RequireTwin>
                <GoLive />
              </RequireTwin>
            }
          />

          <Route
            path="golive/preview"
            element={
              <RequireTwin>
                <PreLivePreview />
              </RequireTwin>
            }
          />

          <Route
            path="golive/live"
            element={
              <RequireTwin>
                <LiveStream />
              </RequireTwin>
            }
          />

          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />


        <Route path="/admin" element={ <RequireAdmin><AdminLayout /></RequireAdmin>}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="twins" element={<AdminTwins />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="lives" element={<AdminLives />} />
  <Route path="analytics" element={<AdminAnalytics />} />
  <Route path="settings" element={<AdminSettings />} />
</Route>
      </Routes>
       <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}