const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getUsers = async (): Promise<any[] | null> => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Erreur : utilisateur non authentifié");
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(
        "Erreur récupération utilisateurs :",
        await response.json()
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur récupération utilisateurs :", error);
    return null;
  }
};

export const getUserById = async (id: number): Promise<any | null> => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Erreur : utilisateur non authentifié");
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erreur récupération utilisateur :", await response.json());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur récupération utilisateur :", error);
    return null;
  }
};

export const updateUser = async (
  id: number,
  updatedData: { email?: string; fullName?: string; password?: string }
): Promise<any | null> => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Erreur : utilisateur non authentifié");
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      console.error("Erreur mise à jour utilisateur :", await response.json());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur mise à jour utilisateur :", error);
    return null;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Erreur : utilisateur non authentifié");
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erreur suppression utilisateur :", await response.json());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);
    return false;
  }
};
