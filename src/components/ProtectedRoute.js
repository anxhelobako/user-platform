import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Restrict access based on roles
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
