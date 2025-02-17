const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchReservationsForClassroom = async (classroomId: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await fetch(
      `${API_BASE_URL}/reservations/classroom/${classroomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des réservations.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur fetchReservationsForClassroom:", error);
    return [];
  }
};

export const createReservation = async (
  classroomId: number,
  startTime: string,
  endTime: string
) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1, // À remplacer par l'ID réel de l'utilisateur (extrait du token JWT)
        classroomId,
        startTime,
        endTime,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Impossible de créer la réservation."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur createReservation:", error);
    return null;
  }
};
