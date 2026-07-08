import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./components/CookieConsent";
import { fetchMe } from "./features/auth/authSlice";
import ScrollToTop from "./components/ScrollToTop";
import LiveShop from "./pages/LiveShop";
import ProtectedRoute from "./components/ProtectedRoute";


const Landing = lazy(() => import("./pages/Landing"));
const Signin = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));

const AppLayout = lazy(() => import("./components/AppLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const TwinDashboard = lazy(() => import("./pages/twin/TwinDashboard"));
const CreateTwin = lazy(() => import("./pages/twin/CreateTwin"));
const TrainTwin = lazy(() => import("./pages/twin/TrainTwin"));
const TestTwin = lazy(() => import("./pages/twin/TestTwin"));
const EditTwin = lazy(() => import("./pages/twin/EditTwin"));

const Products = lazy(() => import("./pages/products/Products"));
const AddProduct = lazy(() => import("./pages/products/AddProduct"));
const ProductDetails = lazy(() => import("./pages/products/ProductDetails"));
const EditProduct = lazy(() => import("./pages/products/EditProduct"));

const ConnectSocial = lazy(() => import("./pages/ConnectSocial"));
const ScheduleLive = lazy(() => import("./pages/schedule/ScheduleLive"));
const CreateSchedule = lazy(() => import("./pages/schedule/CreateSchedule"));

const GoLive = lazy(() => import("./pages/golive/GoLive"));
const PreLivePreview = lazy(() => import("./pages/golive/PreLivePreview"));
const LiveStream = lazy(() => import("./pages/golive/LiveStream"));

const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WaitlistForm = lazy(() => import("./pages/WaitlistForm"));

const Pricing = lazy(() => import("./pages/Pricing"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));

const TermsCondition = lazy(() => import("./pages/TermsCondition"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

const AboutUs = lazy(() => import("./pages/AboutUs"));
const Blog = lazy(() => import("./pages/Blog"));
const Careers = lazy(() => import("./pages/Careers"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Team = lazy(() => import("./pages/Team"));
const DataDeletion = lazy(() => import("./pages/DataDeletion"));

const Creators = lazy(() => import("./pages/Creators"));
const Brands = lazy(() => import("./pages/Brand"));
const Agency = lazy(() => import("./pages/Agency"));
const CreateAI = lazy(() => import("./pages/CreateAI"));
const TrainVoice = lazy(() => import("./pages/TrainVoice"));
const AddProd = lazy(() => import("./pages/AddProd"));
const GoLives = lazy(() => import("./pages/GoLives"));
const MultiStreaming = lazy(() => import("./pages/MultiStreaming"));
const UploadAndStream = lazy(() => import("./pages/UploadAndStream"));
const ShortClips = lazy(() => import("./pages/ShortClips"));
const AITwins = lazy(() => import("./pages/AITwins"));

const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./admin/AdminUsers"));
const AdminTwins = lazy(() => import("./admin/AdminTwins"));
const AdminProducts = lazy(() => import("./admin/AdminProducts"));
const AdminLives = lazy(() => import("./admin/AdminLives"));
const AdminAnalytics = lazy(() => import("./admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./admin/AdminSettings"));

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <p className="text-sm font-bold text-[var(--brand-pink)]">Loading...</p>
    </div>
  );
}

function RequireAdmin({ children }) {
  const { user } = useSelector((state) => state.auth || {});

  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "admin") return <Navigate to="/app" replace />;

  return children;
}

function RequireTwin({ children }) {
  const hasTwin = localStorage.getItem("hasTwin") === "true";

  useEffect(() => {
    if (!hasTwin) {
      toast.warning("Please create your AI Twin first to access this section.", {
        toastId: "create-twin-warning",
      });
    }
  }, [hasTwin]);

  if (!hasTwin) return <Navigate to="/app/twin/create" replace />;

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

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", prefersDark);
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    applySavedTheme();
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/team" element={<Team />} />

          <Route path="/creators" element={<Creators />} />
          <Route path="/brand" element={<Brands />} />
          <Route path="/agency" element={<Agency />} />

          <Route path="/createai" element={<CreateAI />} />
          <Route path="/trainvoice" element={<TrainVoice />} />
          <Route path="/add-products" element={<AddProd />} />
          <Route path="/go-live" element={<GoLives />} />
          <Route path="/aitwins" element={<AITwins />} />
          <Route path="/shortclips" element={<ShortClips />} />
          <Route path="/multistreaming" element={<MultiStreaming />} />
          <Route path="/uploadandstream" element={<UploadAndStream />} />
          <Route path="/live-shop" element={<LiveShop />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checkout/:plan" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />

          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsCondition />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/waitlist" element={<WaitlistForm />} />

         <Route
  path="/app"
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
            <Route index element={<Dashboard />} />

            <Route path="twin" element={<TwinDashboard />} />
            <Route path="twin/create" element={<CreateTwin />} />
            <Route path="twin/edit" element={<EditTwin />} />
            <Route path="twin/train" element={<TrainTwin />} />
            <Route path="twin/test" element={<TestTwin />} />

            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="products/edit/:id" element={<EditProduct />} />

            <Route path="connect" element={<ConnectSocial />} />
            <Route path="schedule" element={<ScheduleLive />} />
            <Route path="schedule/create" element={<CreateSchedule />} />

            <Route path="golive" element={<GoLive />} />
            <Route
              path="golive/preview/:id"
              element={
                <RequireTwin>
                  <PreLivePreview />
                </RequireTwin>
              }
            />
            <Route
              path="golive/live/:id"
              element={
                <RequireTwin>
                  <LiveStream />
                </RequireTwin>
              }
            />

            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
  path="/app/pro"
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
            <Route index element={<Dashboard />} />
          </Route>

         <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    </ProtectedRoute>
  }
>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="twins" element={<AdminTwins />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="lives" element={<AdminLives />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
<CookieConsent />
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