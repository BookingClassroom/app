// reservation.service.ts
import { jwtDecode } from "jwt-decode";

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

export const fetchUserReservations = async (userId: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await fetch(
      `${API_BASE_URL}/reservations/user/${userId}`,
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
    console.error("❌ Erreur fetchUserReservations:", error);
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
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken?.id;

    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, classroomId, startTime, endTime }),
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

export const updateReservation = async (
  reservationId: number,
  startTime: string,
  endTime: string
) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Utilisateur non connecté");

    console.log("🟢 Requête PUT envoyée :", {
      reservationId,
      startTime,
      endTime,
    });

    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, endTime }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Impossible de mettre à jour la réservation."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur updateReservation :", error);
    return null;
  }
};

export const deleteReservation = async (reservationId: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Impossible de supprimer la réservation."
      );
    }

    return true;
  } catch (error) {
    console.error("❌ Erreur deleteReservation:", error);
    return false;
  }
};
