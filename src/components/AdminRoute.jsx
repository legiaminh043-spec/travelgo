
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const savedUser = localStorage.getItem("travelgoUser");

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem("travelgoUser");
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;

