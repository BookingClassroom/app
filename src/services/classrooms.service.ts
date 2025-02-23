const API_BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("access_token");

export const getClassrooms = async (): Promise<any[] | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Erreur récupération salles :", await response.json());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur récupération salles :", error);
    return null;
  }
};

export const createClassroom = async (
  name: string,
  capacity: number,
  equipments?: string[]
): Promise<any | null> => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, capacity, equipments }),
    });

    if (!response.ok) {
      console.error("❌ Erreur API :", await response.json());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur création salle :", error);
    return null;
  }
};

export const updateClassroom = async (
  id: number,
  updatedData: { name?: string; capacity?: number; equipments?: string[] }
): Promise<any | null> => {
  const token = getToken();
  if (!token) {
    console.error("Utilisateur non authentifié");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/classrooms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      console.error("Erreur mise à jour salle :", await response.json());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur mise à jour salle :", error);
    return null;
  }
};

export const deleteClassroom = async (id: number): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    console.error("Utilisateur non authentifié");
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/classrooms/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erreur suppression salle :", await response.json());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur suppression salle :", error);
    return false;
  }
};

export const fetchClassrooms = async (filters?: {
  capacity?: string;
  status?: string;
  equipments?: string[];
}) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Utilisateur non connecté");

    let url = `${API_BASE_URL}/classrooms/filter`;

    const queryParams = new URLSearchParams();
    if (filters?.capacity) queryParams.append("minCapacity", filters.capacity);
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.equipments) {
      filters.equipments.forEach((eq) => queryParams.append("equipments", eq));
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des salles");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur fetchClassrooms:", error);
    return null;
  }
};

export const fetchClassroomById = async (id: string | undefined) => {
  if (!id) return null;

  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/classrooms/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("❌ Erreur API: ", response.status, await response.text());
      throw new Error("Salle introuvable");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur fetchClassroomById:", error);
    return null;
  }
};
