import { Navigate } from "react-router-dom";
import { getUserRole } from "@/services/auth.service";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: JSX.Element;
  adminOnly?: boolean;
}) => {
  const token = localStorage.getItem("access_token");
  const role = getUserRole();

  if (!token) {
    console.warn("🚫 Utilisateur non connecté, redirection vers /auth");
    return <Navigate to="/auth" />;
  }

  if (adminOnly && role !== "admin") {
    console.warn("🚫 Accès refusé : seul un admin peut voir cette page.");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
