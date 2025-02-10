import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    toast.success("👋 Déconnexion réussie !");
    navigate("/auth");
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;
