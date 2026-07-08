import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, loading, initialized } = useSelector((state) => state.auth);

  if (loading || !initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <p className="text-sm font-bold text-[var(--brand-pink)]">
          Checking login...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}