const API_BASE_URL = import.meta.env.VITE_API_URL;

export const signin = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Signin error :", error.message || "Unknown error");
      return null;
    }

    const data = await response.json();

    const accessToken = data.access_token?.trim();
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      return accessToken;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const signup = async (
  email: string,
  password: string,
  fullName: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Signup error:", error.message || "Unknown error");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Signup error:", error);
    return false;
  }
};

export const signout = () => {
  localStorage.removeItem("access_token");
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

export const getUserRole = (): string => {
  const token = localStorage.getItem("access_token");
  if (!token) return "user";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const roles = payload.roles;
    if (Array.isArray(roles) && roles.length > 0) {
      return roles[0];
    }

    return roles ?? "user";
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du rôle :", error);
    return "user";
  }
};
