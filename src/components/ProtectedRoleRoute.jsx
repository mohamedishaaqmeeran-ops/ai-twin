import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import {
  normalizeRole,
} from "../utils/accessControl";

export default function ProtectedRoleRoute({
  allowedRoles = [],
  redirectTo = "/app",
}) {
  const {
    user,
    loading,
  } = useSelector(
    (state) =>
      state.auth
  );

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  const currentRole =
    normalizeRole(
      user.role
    );

  const allowed =
    allowedRoles.map(
      normalizeRole
    );

  if (
    !allowed.includes(
      currentRole
    )
  ) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return <Outlet />;
}