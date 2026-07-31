import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

export default function ProtectedRoute({
  children,
}) {
  const location =
    useLocation();

  const {
    user,
    isAuthenticated,
    authChecked,
  } = useSelector(
    (state) =>
      state.auth || {}
  );

  /*
   Wait only until the initial /auth/me
   request finishes.
  */
  if (!authChecked) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <p className="text-sm font-bold text-[var(--brand-pink)]">
          Checking login...
        </p>
      </div>
    );
  }

  if (
    !user ||
    !isAuthenticated
  ) {
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

  return children;
}