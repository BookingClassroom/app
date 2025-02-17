import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Button } from "./ui/button";

const getUserRole = (): string[] | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.roles || null;
  } catch (error) {
    console.error("❌ Erreur lors du décodage du token :", error);
    return null;
  }
};

const ManageClassroomsButton = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const roles = getUserRole();
    if (roles && roles.includes("admin")) {
      setIsAdmin(true);
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <Button
      onClick={() => navigate("/classrooms")}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
    >
      Gérer les salles
    </Button>
  );
};

export default ManageClassroomsButton;
