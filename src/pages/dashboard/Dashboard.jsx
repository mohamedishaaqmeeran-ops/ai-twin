// src/pages/dashboard/Dashboard.jsx

import { useSelector } from "react-redux";

import BrandDashboard from "./BrandDashboard";
import ManagerDashboard from "./ManagerDashboard";
import ContentCreatorDashboard from "./ContentCreatorDashboard";
import UserDashboard from "./UserDashboard";

const normalizeRole = (role) =>
  String(role || "user")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

export default function Dashboard() {
  const { user } = useSelector(
    (state) => state.auth || {}
  );

  const role = normalizeRole(user?.role);

  if (role === "manager") {
    return <ManagerDashboard />;
  }

  if (role === "contentcreator") {
    return <ContentCreatorDashboard />;
  }

  if (role === "user") {
    return <UserDashboard />;
  }

  /*
   * Admin users normally use /admin.
   * If an admin opens /app, show the internal manager dashboard.
   */
  if (role === "admin") {
    return <ManagerDashboard />;
  }

  return <BrandDashboard />;
}
