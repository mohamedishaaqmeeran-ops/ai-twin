import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signin from "./pages/SignIn";
import AppLayout from "./components/AppLayout";

import Dashboard from "./pages/Dashboard";
import TwinDashboard from "./pages/twin/TwinDashboard";
import CreateTwin from "./pages/twin/CreateTwin";
import TrainTwin from "./pages/twin/TrainTwin";


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

function RequireTwin({ children }) {
  const hasTwin = localStorage.getItem("hasTwin") === "true";

  if (!hasTwin) {
    return <Navigate to="/app/twin/create" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/waitlist" element={<WaitlistForm/>} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="twin" element={<TwinDashboard />} />
          <Route path="twin/create" element={<CreateTwin />} />
          <Route path="twin/train" element={<TrainTwin />} />

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
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}