import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const { user, loading } = useSelector((state) => state.auth);

  // Wait until fetchMe finishes
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="font-semibold text-pink-500">Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}