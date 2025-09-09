import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { authAPI } from "../services/authAPI";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authAPI.verify();
        // if verify succeeds, we assume user is logged in
        setIsAuthenticated(!!user?.id);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
