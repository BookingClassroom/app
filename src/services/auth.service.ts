const API_BASE_URL = import.meta.env.VITE_API_URL;

export const signin = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Signin error status:", response.status);
      console.error("❌ Signin error text:", errorText);
      return null;
    }

    const data = await response.json();

    const accessToken = data.access_token?.trim().replace(/^"|"$/g, "");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      return accessToken;
    } else {
      console.error("❌ Signin response missing access_token");
      return null;
    }
  } catch (error) {
    console.error("❌ Signin network error:", error);
    return null;
  }
};

export const signup = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, firstname, lastname }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Signup error:", error.message || "Unknown error");
      return false;
    }

    const data = await response.json();
    const accessToken = data.access_token?.trim().replace(/^"|"$/g, "");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      return true;
    } else {
      console.error("❌ Signup response missing access_token");
      return false;
    }
  } catch (error) {
    console.error("❌ Signup error:", error);
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

export const getUserRole = (): string | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const roles = payload.roles;

    if (!roles || roles === null || roles.length === 0) {
      return null;
    }

    return Array.isArray(roles) ? roles[0] : roles;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du rôle :", error);
    return null;
  }
};
