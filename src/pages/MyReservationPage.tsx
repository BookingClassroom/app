import { useEffect, useState } from "react";
import {
  fetchUserReservations,
  deleteReservation,
  updateReservation,
} from "@/services/reservation.service";
import { fetchClassrooms } from "@/services/classrooms.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import toast from "react-hot-toast";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";
import ConfirmDialog from "@/components/ConfirmDialog";

const generateTimeSlots = () => {
  const slots = [];
  let current = new Date();
  current.setHours(9, 0, 0, 0);
  const end = new Date();
  end.setHours(17, 0, 0, 0);

  while (current < end) {
    slots.push(format(new Date(current), "HH:mm"));
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
};

const convertFromUTC = (utcString: string) => {
  const date = new Date(utcString);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

const convertToUTC = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return new Date(
    newDate.getTime() - newDate.getTimezoneOffset() * 60000
  ).toISOString();
};

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken?.id;

      const loadReservations = async () => {
        const data = await fetchUserReservations(userId);

        const formattedReservations = data.map((res: any) => ({
          ...res,
          startTime: convertFromUTC(res.startTime),
          endTime: convertFromUTC(res.endTime),
        }));

        setReservations(formattedReservations);
      };

      const loadClassrooms = async () => {
        const data = await fetchClassrooms();
        setClassrooms(data);
      };

      loadReservations();
      loadClassrooms();
    }
  }, [token]);

  const handleDelete = async (reservationId: number) => {
    try {
      await deleteReservation(reservationId);
      setReservations(reservations.filter((res) => res.id !== reservationId));
      toast.success("Réservation supprimée !");
    } catch (error) {
      toast.error("Erreur lors de la suppression !");
    }
  };

  const handleEdit = (reservation: any) => {
    setSelectedReservation(reservation);
    setSelectedDate(new Date(reservation.startTime));
    setStartTime(format(new Date(reservation.startTime), "HH:mm"));
    setEndTime(format(new Date(reservation.endTime), "HH:mm"));
  };

  const handleUpdate = async () => {
    if (!selectedReservation || !selectedDate || !startTime || !endTime) {
      toast.error("Veuillez sélectionner une date et des horaires valides.");
      return;
    }

    const startDateUTC = convertToUTC(selectedDate, startTime);
    const endDateUTC = convertToUTC(selectedDate, endTime);

    try {
      await updateReservation(selectedReservation.id, startDateUTC, endDateUTC);
      toast.success("Réservation mise à jour !");
      setReservations(
        reservations.map((res) =>
          res.id === selectedReservation.id
            ? {
                ...res,
                startTime: convertFromUTC(startDateUTC),
                endTime: convertFromUTC(endDateUTC),
              }
            : res
        )
      );
      setSelectedReservation(null);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-3xl mx-auto shadow-md border rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Mes Réservations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reservations.length === 0 ? (
            <p className="text-gray-600 text-center">
              Aucune réservation trouvée.
            </p>
          ) : (
            reservations.map((res) => (
              <div
                key={res.id}
                className="border p-4 rounded-md shadow-md bg-gray-100 flex justify-between items-center"
              >
                <div>
                  <p>
                    📍 <strong>{res.classroom.name}</strong> | 🕐{" "}
                    {format(res.startTime, "HH:mm")} -{" "}
                    {format(res.endTime, "HH:mm")}
                  </p>
                  <p>
                    📅 {format(res.startTime, "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => handleEdit(res)} variant="outline">
                    Modifier
                  </Button>
                  <ConfirmDialog
                    title="Supprimer la réservation ?"
                    description="Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."
                    onConfirm={() => handleDelete(res.id)}
                  >
                    <Button variant="destructive">Supprimer</Button>
                  </ConfirmDialog>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 📌 Modal de modification */}
      {selectedReservation && (
        <Card className="max-w-lg mx-auto mt-6 shadow-md border rounded-lg p-6">
          <CardHeader>
            <CardTitle className="text-xl">Modifier la Réservation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                disabled={(date) => date < new Date()}
              />
            </div>

            <Select value={startTime || ""} onValueChange={setStartTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner l'heure de début" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeSlots().map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={endTime || ""} onValueChange={setEndTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner l'heure de fin" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeSlots().map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ConfirmDialog
              title="Modifier la réservation ?"
              description={`Voulez-vous vraiment modifier cette réservation du ${format(
                selectedDate,
                "dd MMMM yyyy"
              )} de ${startTime} à ${endTime} ?`}
              onConfirm={handleUpdate}
            >
              <Button className="w-full">Mettre à jour</Button>
            </ConfirmDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyReservationsPage;
