import React from "react";

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthorized = localStorage.getItem("token");
  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
