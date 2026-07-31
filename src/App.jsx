import {
  lazy,
  Suspense,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  fetchMe,
} from "./features/auth/authSlice";

import LiveShop from "./pages/LiveShop";
import GenerateAvatarVideo from "./pages/twin/GenerateAvatarVideo";

/* =========================================================
   LAZY IMPORTS
========================================================= */

const AvatarMarketplace = lazy(() =>
  import("./pages/AvatarMarketplace")
);

const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword")
);

const ResetPassword = lazy(() =>
  import("./pages/ResetPassword")
);

const Landing = lazy(() =>
  import("./pages/Landing")
);

const Signin = lazy(() =>
  import("./pages/SignIn")
);

const SignUp = lazy(() =>
  import("./pages/SignUp")
);

const UserHome = lazy(() =>
  import("./pages/user/userHome")
);

const AppLayout = lazy(() =>
  import("./components/AppLayout")
);

const Dashboard = lazy(() =>
  import("./pages/dashboard/Dashboard")
);

const ProductTraining = lazy(() =>
  import("./pages/twin/ProductTraining")
);

const AvatarStudio = lazy(() =>
  import("./pages/twin/AvatarStudio")
);

const TwinDashboard = lazy(() =>
  import("./pages/twin/TwinDashboard")
);

const CreateTwin = lazy(() =>
  import("./pages/twin/CreateTwin")
);

const TrainTwin = lazy(() =>
  import("./pages/twin/TrainTwin")
);

const TestTwin = lazy(() =>
  import("./pages/twin/TestTwin")
);

const EditTwin = lazy(() =>
  import("./pages/twin/EditTwin")
);

const Products = lazy(() =>
  import("./pages/products/Products")
);

const AddProduct = lazy(() =>
  import("./pages/products/AddProduct")
);

const ProductDetails = lazy(() =>
  import("./pages/products/ProductDetails")
);

const EditProduct = lazy(() =>
  import("./pages/products/EditProduct")
);

const ConnectSocial = lazy(() =>
  import("./pages/ConnectSocial")
);

const ScheduleLive = lazy(() =>
  import("./pages/schedule/ScheduleLive")
);

const CreateSchedule = lazy(() =>
  import("./pages/schedule/CreateSchedule")
);

const GoLive = lazy(() =>
  import("./pages/golive/GoLive")
);

const PreLivePreview = lazy(() =>
  import("./pages/golive/PreLivePreview")
);

const LiveStream = lazy(() =>
  import("./pages/golive/LiveStream")
);

const Analytics = lazy(() =>
  import("./pages/Analytics")
);

const Settings = lazy(() =>
  import("./pages/Settings")
);

const NotFound = lazy(() =>
  import("./pages/NotFound")
);

const WaitlistForm = lazy(() =>
  import("./pages/WaitlistForm")
);

const BlogDetails = lazy(() =>
  import("./pages/BlogDetails")
);

const BlogList = lazy(() =>
  import("./pages/BlogList")
);

const CreateBlog = lazy(() =>
  import("./pages/CreateBlog")
);

const EditBlog = lazy(() =>
  import("./pages/EditBlog")
);

const Pricing = lazy(() =>
  import("./pages/Pricing")
);

const Checkout = lazy(() =>
  import("./pages/Checkout")
);

const PaymentSuccess = lazy(() =>
  import("./pages/PaymentSuccess")
);

const PaymentFailed = lazy(() =>
  import("./pages/PaymentFailed")
);

const TermsCondition = lazy(() =>
  import("./pages/TermsCondition")
);

const CookiePolicy = lazy(() =>
  import("./pages/CookiePolicy")
);

const RefundPolicy = lazy(() =>
  import("./pages/RefundPolicy")
);

const PrivacyPolicy = lazy(() =>
  import("./pages/PrivacyPolicy")
);

const AboutUs = lazy(() =>
  import("./pages/AboutUs")
);

const Blog = lazy(() =>
  import("./pages/Blog")
);

const Careers = lazy(() =>
  import("./pages/Careers")
);

const ContactUs = lazy(() =>
  import("./pages/ContactUs")
);

const Team = lazy(() =>
  import("./pages/Team")
);

const DataDeletion = lazy(() =>
  import("./pages/DataDeletion")
);

const Creators = lazy(() =>
  import("./pages/Creators")
);

const Brands = lazy(() =>
  import("./pages/Brand")
);

const Agency = lazy(() =>
  import("./pages/Agency")
);

const CreateAI = lazy(() =>
  import("./pages/CreateAI")
);

const TrainVoice = lazy(() =>
  import("./pages/TrainVoice")
);

const AddProd = lazy(() =>
  import("./pages/AddProd")
);

const GoLives = lazy(() =>
  import("./pages/GoLives")
);

const MultiStreaming = lazy(() =>
  import("./pages/MultiStreaming")
);

const UploadAndStream = lazy(() =>
  import("./pages/UploadAndStream")
);

const ShortClips = lazy(() =>
  import("./pages/ShortClips")
);

const AITwins = lazy(() =>
  import("./pages/AITwins")
);

const AdminLayout = lazy(() =>
  import("./components/AdminLayout")
);

const AdminDashboard = lazy(() =>
  import("./admin/AdminDashboard")
);

const AdminUsers = lazy(() =>
  import("./admin/AdminUsers")
);

const AdminTwins = lazy(() =>
  import("./admin/AdminTwins")
);

const AdminProducts = lazy(() =>
  import("./admin/AdminProducts")
);

const AdminLives = lazy(() =>
  import("./admin/AdminLives")
);

const AdminAnalytics = lazy(() =>
  import("./admin/AdminAnalytics")
);

const AdminSettings = lazy(() =>
  import("./admin/AdminSettings")
);

/* =========================================================
   ROLE + PLAN CONFIGURATION
========================================================= */

const normalizeRole = (role) => {
  const value = String(role || "user")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const aliases = {
    admin: "admin",
    manager: "manager",
    brandcreator: "brandcreator",
    brand: "brandcreator",
    creator: "brandcreator",
    contentcreator: "contentcreator",
    content: "contentcreator",
    user: "user",
    customer: "user",
  };

  return aliases[value] || "user";
};

const normalizePlan = (plan) => {
  const value = String(plan || "free")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const aliases = {
    free: "free",
    trial: "free",
    freetrial: "free",
    starter: "starter",
    pro: "pro",
    business: "business",
    agency: "agency",
  };

  return aliases[value] || "free";
};

const ROLE_PERMISSIONS = {
  admin: [
    "twin:view",
    "twin:create",
    "twin:update",
    "twin:delete",
    "twin:train",
    "product:view",
    "product:create",
    "product:update",
    "product:delete",
    "social:view",
    "social:manage",
    "schedule:view",
    "schedule:create",
    "schedule:update",
    "schedule:delete",
    "live:view",
    "live:start",
    "live:stop",
    "analytics:view",
    "avatar:manage",
    "admin:access",
  ],

  manager: [
    "twin:view",
    "twin:create",
    "twin:update",
    "twin:delete",
    "twin:train",
    "product:view",
    "product:create",
    "product:update",
    "product:delete",
    "social:view",
    "social:manage",
    "schedule:view",
    "schedule:create",
    "schedule:update",
    "schedule:delete",
    "live:view",
    "live:start",
    "live:stop",
    "analytics:view",
    "avatar:manage",
  ],

  brandcreator: [
    "twin:view",
    "twin:create",
    "twin:update",
    "twin:delete",
    "twin:train",
    "product:view",
    "product:create",
    "product:update",
    "product:delete",
    "social:view",
    "social:manage",
    "schedule:view",
    "schedule:create",
    "schedule:update",
    "schedule:delete",
    "live:view",
    "live:start",
    "live:stop",
    "analytics:view",
    "avatar:manage",
  ],

  contentcreator: [
    "twin:view",
    "product:view",
    "social:view",
    "schedule:view",
    "live:view",
    "analytics:view",
  ],

  user: [
    "marketplace:view",
    "live:watch",
    "product:browse",
    "twin:chat",
    "wishlist:manage",
    "order:view",
    "profile:manage",
  ],
};

const PLAN_ORDER = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3,
  agency: 4,
};

const hasPermission = (
  role,
  permission
) => {
  const normalizedRole =
    normalizeRole(role);

  return Boolean(
    ROLE_PERMISSIONS[
      normalizedRole
    ]?.includes(permission)
  );
};

const roleUsesPricingPlan = (role) =>
  normalizeRole(role) === "brandcreator";

const hasRequiredPlan = (
  role,
  currentPlan,
  minimumPlan
) => {
  const normalizedRole =
    normalizeRole(role);

  // Admin and manager are controlled by role permissions,
  // not by customer subscription plans.
  if (
    normalizedRole === "admin" ||
    normalizedRole === "manager"
  ) {
    return true;
  }

  // Only brand creators can own Free, Starter, Pro,
  // Business or Agency subscriptions.
  if (!roleUsesPricingPlan(normalizedRole)) {
    return false;
  }

  const normalizedCurrentPlan =
    normalizePlan(currentPlan);

  const normalizedMinimumPlan =
    normalizePlan(minimumPlan);

  return (
    (PLAN_ORDER[
      normalizedCurrentPlan
    ] ?? 0) >=
    (PLAN_ORDER[
      normalizedMinimumPlan
    ] ?? 0)
  );
};

/* =========================================================
   HELPERS
========================================================= */

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <p className="text-sm font-bold text-[var(--brand-pink)]">
        Loading...
      </p>
    </div>
  );
}

function getUserTwins(user) {
  if (
    Array.isArray(user?.twins)
  ) {
    return user.twins;
  }

  if (user?.twin) {
    return [user.twin];
  }

  return [];
}

function getRedirectForRole(user) {
  const role =
    normalizeRole(user?.role);

  const redirects = {
    admin: "/admin",
    manager: "/app",
    brandcreator: "/app",
    contentcreator: "/app",
    user: "/user/home",
  };

  return redirects[role] || "/";
}

/* =========================================================
   AUTH GUARDS
========================================================= */

function RequireAdmin({
  children,
}) {
  const {
    user,
    loading,
    initialized,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  if (
    loading ||
    !initialized
  ) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  if (
    normalizeRole(
      user.role
    ) !== "admin"
  ) {
    return (
      <Navigate
        to={getRedirectForRole(user)}
        replace
      />
    );
  }

  return children;
}

function RequireCreatorDashboard({
  children,
}) {
  const location =
    useLocation();

  const {
    user,
    loading,
    initialized,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  if (
    loading ||
    !initialized
  ) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  const role =
    normalizeRole(user.role);

  const allowedRoles = [
    "admin",
    "manager",
    "brandcreator",
    "contentcreator",
  ];

  if (
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to={getRedirectForRole(user)}
        replace
      />
    );
  }

  return children;
}

function RequireNormalUser({
  children,
}) {
  const location =
    useLocation();

  const {
    user,
    loading,
    initialized,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  if (
    loading ||
    !initialized
  ) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  if (
    normalizeRole(
      user.role
    ) !== "user"
  ) {
    return (
      <Navigate
        to={getRedirectForRole(user)}
        replace
      />
    );
  }

  return children;
}

function RequireBrandCreator({
  children,
}) {
  const location =
    useLocation();

  const {
    user,
    loading,
    initialized,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  useEffect(() => {
    if (
      user &&
      initialized &&
      !loading &&
      normalizeRole(
        user.role
      ) !== "brandcreator"
    ) {
      toast.info(
        "Subscription plans are available only for Brand Creator accounts.",
        {
          toastId:
            "brandcreator-checkout-only",
        }
      );
    }
  }, [
    initialized,
    loading,
    user,
  ]);

  if (
    loading ||
    !initialized
  ) {
    return <PageLoader />;
  }

  if (!user) {
    const requestedPlan =
      location.pathname
        .split("/")
        .filter(Boolean)
        .at(-1);

    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from:
            location.pathname,
          paymentIntent: {
            plan:
              requestedPlan,
          },
        }}
      />
    );
  }

  if (
    normalizeRole(
      user.role
    ) !== "brandcreator"
  ) {
    return (
      <Navigate
        to={getRedirectForRole(user)}
        replace
      />
    );
  }

  return children;
}

function RequirePermission({
  permission,
  children,
  redirectTo = "/app",
  message = "You do not have permission to access this page.",
}) {
  const location =
    useLocation();

  const {
    user,
    loading,
    initialized,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  const allowed =
    hasPermission(
      user?.role,
      permission
    );

  useEffect(() => {
    if (
      user &&
      !loading &&
      !allowed
    ) {
      toast.warning(
        message,
        {
          toastId: `permission-${permission}`,
        }
      );
    }
  }, [
    allowed,
    initialized,
    loading,
    message,
    permission,
    user,
  ]);

  if (loading || !initialized) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (!allowed) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return children;
}

function RequirePlan({
  minimumPlan,
  children,
  redirectTo = "/pricing",
  message,
}) {
  const {
    user,
    loading,
    initialized,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  const allowed =
    hasRequiredPlan(
      user?.role,
      user?.plan,
      minimumPlan
    );

  useEffect(() => {
    if (
      user &&
      !loading &&
      !allowed
    ) {
      toast.info(
        message ||
          (roleUsesPricingPlan(user?.role)
            ? `This feature requires the ${minimumPlan} plan or higher.`
            : "This feature is available only to brand creator accounts."),
        {
          toastId: `plan-${minimumPlan}`,
        }
      );
    }
  }, [
    allowed,
    initialized,
    loading,
    message,
    minimumPlan,
    user,
  ]);

  if (loading || !initialized) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  if (!allowed) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return children;
}

function RequireTwin({
  children,
  requireTrained = false,
}) {
  const {
    user,
    loading,
    initialized,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  const twins =
    getUserTwins(user);

  const twin =
    user?.twin ||
    twins[0] ||
    null;

  const hasTwin =
    Boolean(twin);

  const isTrained =
    Boolean(
      twin?.isTrained
    );

  useEffect(() => {
    if (
      user &&
      !loading &&
      !hasTwin
    ) {
      toast.warning(
        "Please create your AI Twin first to access this section.",
        {
          toastId:
            "create-twin-warning",
        }
      );
    } else if (
      user &&
      !loading &&
      hasTwin &&
      requireTrained &&
      !isTrained
    ) {
      toast.warning(
        "Please train your AI Twin before starting a live session.",
        {
          toastId:
            "train-twin-warning",
        }
      );
    }
  }, [
    hasTwin,
    initialized,
    isTrained,
    loading,
    requireTrained,
    user,
  ]);

  if (loading || !initialized) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  if (!hasTwin) {
    if (
      hasPermission(
        user.role,
        "twin:create"
      )
    ) {
      return (
        <Navigate
          to="/app/twin/create"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/app/twin"
        replace
      />
    );
  }

  if (
    requireTrained &&
    !isTrained
  ) {
    if (
      hasPermission(
        user.role,
        "twin:train"
      )
    ) {
      return (
        <Navigate
          to="/app/twin/train"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/app/twin"
        replace
      />
    );
  }

  return children;
}

/* =========================================================
   THEME
========================================================= */

function applySavedTheme() {
  const theme =
    localStorage.getItem(
      "theme"
    ) || "Light";

  if (theme === "Dark") {
    document.documentElement.classList.add(
      "dark"
    );
    return;
  }

  if (theme === "Light") {
    document.documentElement.classList.remove(
      "dark"
    );
    return;
  }

  const prefersDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  document.documentElement.classList.toggle(
    "dark",
    prefersDark
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const dispatch =
    useDispatch();

  useEffect(() => {
    applySavedTheme();
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />

      <Suspense
        fallback={
          <PageLoader />
        }
      >
        <Routes>
          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          <Route
            path="/"
            element={
              <Landing />
            }
          />

          <Route
            path="/signup"
            element={
              <SignUp />
            }
          />

          <Route
            path="/signin"
            element={
              <Signin />
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <ResetPassword />
            }
          />

          <Route
            path="/about"
            element={
              <AboutUs />
            }
          />

          <Route
            path="/blog"
            element={
              <Blog />
            }
          />

          <Route
            path="/blog/:slug"
            element={
              <BlogDetails />
            }
          />

          <Route
            path="/careers"
            element={
              <Careers />
            }
          />

          <Route
            path="/contactus"
            element={
              <ContactUs />
            }
          />

          <Route
            path="/team"
            element={
              <Team />
            }
          />

          <Route
            path="/creators"
            element={
              <Creators />
            }
          />

          <Route
            path="/brand"
            element={
              <Brands />
            }
          />

          <Route
            path="/agency"
            element={
              <Agency />
            }
          />

          <Route
            path="/createai"
            element={
              <CreateAI />
            }
          />

          <Route
            path="/trainvoice"
            element={
              <TrainVoice />
            }
          />

          <Route
            path="/add-products"
            element={
              <AddProd />
            }
          />

          <Route
            path="/go-live"
            element={
              <GoLives />
            }
          />

          <Route
            path="/aitwins"
            element={
              <AITwins />
            }
          />

          <Route
            path="/shortclips"
            element={
              <ShortClips />
            }
          />

          <Route
            path="/multistreaming"
            element={
              <MultiStreaming />
            }
          />

          <Route
            path="/uploadandstream"
            element={
              <UploadAndStream />
            }
          />

          <Route
            path="/live-shop"
            element={
              <ProtectedRoute>
                <LiveShop />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pricing"
            element={
              <Pricing />
            }
          />

          <Route
            path="/checkout/:plan"
            element={
              <RequireBrandCreator>
                <Checkout />
              </RequireBrandCreator>
            }
          />

          <Route
            path="/payment-success"
            element={
              <PaymentSuccess />
            }
          />

          <Route
            path="/payment-failed"
            element={
              <PaymentFailed />
            }
          />

          <Route
            path="/cookie-policy"
            element={
              <CookiePolicy />
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <PrivacyPolicy />
            }
          />

          <Route
            path="/refund-policy"
            element={
              <RefundPolicy />
            }
          />

          <Route
            path="/terms-and-conditions"
            element={
              <TermsCondition />
            }
          />

          <Route
            path="/data-deletion"
            element={
              <DataDeletion />
            }
          />

          <Route
            path="/waitlist"
            element={
              <WaitlistForm />
            }
          />

          {/* =================================================
              NORMAL USER ROUTES
          ================================================= */}

          <Route
            path="/user/home"
            element={
              <ProtectedRoute>
                <RequireNormalUser>
                  <UserHome />
                </RequireNormalUser>
              </ProtectedRoute>
            }
          />

          {/* =================================================
              APPLICATION ROUTES
          ================================================= */}

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <RequireCreatorDashboard>
                  <AppLayout />
                </RequireCreatorDashboard>
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Dashboard />
              }
            />

            {/* -----------------------------------------------
                TWIN VIEW ROUTES
            ----------------------------------------------- */}

            <Route
              path="twin"
              element={
                <RequirePermission permission="twin:view">
                  <TwinDashboard />
                </RequirePermission>
              }
            />

            <Route
              path="twin/create"
              element={
                <RequirePermission
                  permission="twin:create"
                  message="Your role cannot create AI Twins."
                >
                  <CreateTwin />
                </RequirePermission>
              }
            />

            <Route
              path="twin/edit"
              element={
                <RequirePermission
                  permission="twin:update"
                  message="Your role cannot edit AI Twins."
                >
                  <RequireTwin>
                    <EditTwin />
                  </RequireTwin>
                </RequirePermission>
              }
            />

            <Route
              path="twin/train"
              element={
                <RequirePermission
                  permission="twin:train"
                  message="Your role cannot train AI Twins."
                >
                  <RequireTwin>
                    <TrainTwin />
                  </RequireTwin>
                </RequirePermission>
              }
            />

            <Route
              path="twin/product-training"
              element={
                <RequirePermission
                  permission="twin:train"
                  message="Your role cannot train products."
                >
                  <RequireTwin>
                    <ProductTraining />
                  </RequireTwin>
                </RequirePermission>
              }
            />

            <Route
              path="twin/test"
              element={
                <RequirePermission permission="twin:view">
                  <RequireTwin>
                    <TestTwin />
                  </RequireTwin>
                </RequirePermission>
              }
            />

            {/* -----------------------------------------------
                AVATAR ROUTES
            ----------------------------------------------- */}

            <Route
              path="twin/generate-video"
              element={
                <RequirePermission
                  permission="avatar:manage"
                  message="Your role cannot generate avatar videos."
                >
                  <RequirePlan
                    minimumPlan="pro"
                    message="Avatar video generation requires the Pro plan or higher."
                  >
                    <RequireTwin>
                      <GenerateAvatarVideo />
                    </RequireTwin>
                  </RequirePlan>
                </RequirePermission>
              }
            />

            <Route
              path="twin/avatar-studio"
              element={
                <RequirePermission
                  permission="avatar:manage"
                  message="Your role cannot access Avatar Studio."
                >
                  <RequirePlan
                    minimumPlan="pro"
                    message="Avatar Studio requires the Pro plan or higher."
                  >
                    <RequireTwin>
                      <AvatarStudio />
                    </RequireTwin>
                  </RequirePlan>
                </RequirePermission>
              }
            />

            <Route
              path="avatar-marketplace"
              element={
                <RequirePermission permission="twin:view">
                  <AvatarMarketplace />
                </RequirePermission>
              }
            />

            {/* -----------------------------------------------
                PRODUCT ROUTES
            ----------------------------------------------- */}

            <Route
              path="products"
              element={
                <RequirePermission permission="product:view">
                  <Products />
                </RequirePermission>
              }
            />

            <Route
              path="products/add"
              element={
                <RequirePermission
                  permission="product:create"
                  message="Your role cannot add products."
                >
                  <AddProduct />
                </RequirePermission>
              }
            />

            <Route
              path="products/:id"
              element={
                <RequirePermission permission="product:view">
                  <ProductDetails />
                </RequirePermission>
              }
            />

            <Route
              path="products/edit/:id"
              element={
                <RequirePermission
                  permission="product:update"
                  message="Your role cannot edit products."
                >
                  <EditProduct />
                </RequirePermission>
              }
            />

            {/* -----------------------------------------------
                SOCIAL ROUTES
            ----------------------------------------------- */}

            <Route
              path="connect"
              element={
                <RequirePermission permission="social:view">
                  <ConnectSocial />
                </RequirePermission>
              }
            />

            {/* -----------------------------------------------
                SCHEDULE ROUTES
            ----------------------------------------------- */}

            <Route
              path="schedule"
              element={
                <RequirePermission permission="schedule:view">
                  <ScheduleLive />
                </RequirePermission>
              }
            />

            <Route
              path="schedule/create"
              element={
                <RequirePermission
                  permission="schedule:create"
                  message="Your role cannot create live schedules."
                >
                  <CreateSchedule />
                </RequirePermission>
              }
            />

            {/* -----------------------------------------------
                LIVE ROUTES
            ----------------------------------------------- */}

            <Route
              path="golive"
              element={
                <RequirePermission
                  permission="live:start"
                  message="Your role cannot start live sessions."
                >
                  <RequireTwin requireTrained>
                    <GoLive />
                  </RequireTwin>
                </RequirePermission>
              }
            />

            <Route
              path="golive/preview/:id"
              element={
                <RequirePermission
                  permission="live:start"
                  message="Your role cannot preview live sessions."
                >
                  <RequireTwin requireTrained>
                    <PreLivePreview />
                  </RequireTwin>
                </RequirePermission>
              }
            />

            <Route
              path="golive/live/:id"
              element={
                <RequirePermission
                  permission="live:start"
                  message="Your role cannot start live sessions."
                >
                  <RequireTwin requireTrained>
                    <LiveStream />
                  </RequireTwin>
                </RequirePermission>
              }
            />

            {/* -----------------------------------------------
                ANALYTICS + SETTINGS
            ----------------------------------------------- */}

            <Route
              path="analytics"
              element={
                <RequirePermission permission="analytics:view">
                  <Analytics />
                </RequirePermission>
              }
            />

            <Route
              path="settings"
              element={
                <Settings />
              }
            />
          </Route>

          {/* =================================================
              LEGACY PRO ROUTE
              Redirect to the main app.
          ================================================= */}

          <Route
            path="/app/pro"
            element={
              <Navigate
                to="/app"
                replace
              />
            }
          />

          {/* =================================================
              ADMIN ROUTES
          ================================================= */}

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
            <Route
              index
              element={
                <AdminDashboard />
              }
            />

            <Route
              path="users"
              element={
                <AdminUsers />
              }
            />

            <Route
              path="twins"
              element={
                <AdminTwins />
              }
            />

            <Route
              path="products"
              element={
                <AdminProducts />
              }
            />

            <Route
              path="lives"
              element={
                <AdminLives />
              }
            />

            <Route
              path="blogs"
              element={
                <BlogList />
              }
            />

            <Route
              path="blogs/create"
              element={
                <CreateBlog />
              }
            />

            <Route
              path="blogs/:blogId/edit"
              element={
                <EditBlog />
              }
            />

            <Route
              path="analytics"
              element={
                <AdminAnalytics />
              }
            />

            <Route
              path="settings"
              element={
                <AdminSettings />
              }
            />
          </Route>

          {/* =================================================
              FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={
              <NotFound />
            }
          />
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