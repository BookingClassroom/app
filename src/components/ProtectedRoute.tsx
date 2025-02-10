import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "@/services/auth.service";
import toast from "react-hot-toast";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: JSX.Element;
  adminOnly?: boolean;
}) => {
  const [redirect, setRedirect] = useState(false);
  const token = localStorage.getItem("access_token");
  const role = getUserRole();
  const toastDisplayed = useRef(false); // ✅ Bloque les toasts en double

  useEffect(() => {
    if (!toastDisplayed.current) {
      // ✅ Empêche l'affichage multiple
      if (!token || role === null) {
        console.log("getUserRole", getUserRole);
        toast.error("🔒 Accès restreint aux administrateurs.");
        toastDisplayed.current = true;
        setTimeout(() => setRedirect(true), 100);
      }
    }
  }, [token, role, adminOnly]);

  if (redirect) {
    return <Navigate to={role === null ? "/auth" : "/"} />;
  }

  return children;
};

export default ProtectedRoute;
