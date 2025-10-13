import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = Boolean(localStorage.getItem("access_token")); 
  // or use your auth state

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
