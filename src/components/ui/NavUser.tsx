"use client";

import { useEffect, useState } from "react";
import { Bolt, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "@/services/users.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function NavUser() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const decoded = jwtDecode(token) as { id: number; email: string };
        const user = await getUserById(decoded.id);

        if (user) {
          setUserData({
            name: user.firstname + " " + user.lastname.toUpperCase(),
            email: user.email,
          });

          if (user.roles.includes("admin")) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const token = localStorage.getItem("access_token");
  if (!token || !userData) return null;

  const initials = userData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    toast.success("👋 Déconnexion réussie !");
    navigate("/auth");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="bg-transparent hover:bg-transparent text-gray-800 ring-0 outline-none px-6 py-6 rounded-lg"
      >
        <Button size="lg" className="focus-visible:ring-0">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{userData.name}</span>
            <span className="truncate text-xs">{userData.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{userData.name}</span>
              <span className="truncate text-xs">{userData.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/classrooms")}>
              <Bolt className="mr-2 h-4 w-4" />
              Gérer les salles
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
