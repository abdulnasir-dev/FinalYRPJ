import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = true; // later replace with auth logic

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
