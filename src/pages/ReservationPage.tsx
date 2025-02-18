import { useEffect, useState } from "react";
import {
  fetchReservationsForClassroom,
  createReservation,
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
import { format, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";

const generateTimeSlots = () => {
  const slots = [];
  let current = new Date();
  current.setHours(9, 0, 0, 0);
  const end = new Date();
  end.setHours(17, 0, 0, 0);

  while (current <= end) {
    slots.push(format(new Date(current), "HH:mm"));
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
};

const convertToUTC = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);

  return new Date(
    newDate.getTime() - newDate.getTimezoneOffset() * 60000
  ).toISOString();
};

const ReservationPage = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(
    null
  );
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  useEffect(() => {
    const loadClassrooms = async () => {
      const data = await fetchClassrooms();
      setClassrooms(data);
    };

    loadClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      const selectedRoom = classrooms.find(
        (room) => room.id === selectedClassroom
      );
      setSelectedEquipments(selectedRoom?.equipments || []);
    }

    if (selectedClassroom && selectedDate) {
      const loadReservations = async () => {
        const data = await fetchReservationsForClassroom(selectedClassroom);
        setReservations(
          data
            .map((res) => ({
              ...res,
              startTime: new Date(res.startTime),
              endTime: new Date(res.endTime),
            }))
            .filter(
              (res) =>
                format(res.startTime, "yyyy-MM-dd") ===
                format(selectedDate, "yyyy-MM-dd")
            )
        );
      };
      loadReservations();
    }
  }, [selectedClassroom, selectedDate, classrooms]);

  const isSlotUnavailable = (slot: string) => {
    if (!selectedDate) return false;

    const slotTimeUTC = new Date(convertToUTC(selectedDate, slot));

    return reservations.some((res) => {
      return isWithinInterval(slotTimeUTC, {
        start: res.startTime,
        end: res.endTime,
      });
    });
  };

  const getAvailableEndTimes = () => {
    if (!startTime) return [];
    return generateTimeSlots().filter(
      (slot) => slot > startTime && !isSlotUnavailable(slot)
    );
  };

  const handleReserve = async () => {
    if (!selectedClassroom || !selectedDate || !startTime || !endTime) {
      toast.error(
        "Veuillez sélectionner une salle, une date et une plage horaire."
      );
      return;
    }

    const startDateUTC = convertToUTC(selectedDate, startTime);
    const endDateUTC = convertToUTC(selectedDate, endTime);

    try {
      const response = await createReservation(
        selectedClassroom,
        startDateUTC,
        endDateUTC
      );

      if (response) {
        toast.success("Réservation effectuée avec succès !");
        setReservations([...reservations, response]);
      }
    } catch (error) {
      toast.error("Erreur lors de la réservation.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-lg mx-auto shadow-md border rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Réserver une salle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélection de la salle */}
          <Select
            value={selectedClassroom ? selectedClassroom.toString() : ""}
            onValueChange={(value) => setSelectedClassroom(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une salle" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md border rounded-md">
              {classrooms.map((room) => (
                <SelectItem key={room.id} value={room.id.toString()}>
                  {room.name} - Capacité: {room.capacity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ✅ Affichage des équipements immédiatement après sélection de la salle */}
          {selectedClassroom && (
            <div className="p-4 bg-gray-100 border rounded-md">
              <h3 className="text-lg font-semibold">
                Équipements disponibles :
              </h3>
              {selectedEquipments.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700">
                  {selectedEquipments.map((eq, index) => (
                    <li key={index}>{eq}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun équipement spécifique.</p>
              )}
            </div>
          )}

          {/* Sélection de la date */}
          <div className="border rounded-md p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              disabled={(date) => date < new Date()}
            />
          </div>

          {/* Sélection Heure de Début */}
          <Select value={startTime || ""} onValueChange={setStartTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner l'heure de début" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md border rounded-md">
              {generateTimeSlots().map((slot) => (
                <SelectItem
                  key={slot}
                  value={slot}
                  disabled={isSlotUnavailable(slot)}
                >
                  {slot} {isSlotUnavailable(slot) ? "(Indisponible)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sélection Heure de Fin */}
          <Select value={endTime || ""} onValueChange={setEndTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner l'heure de fin" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md border rounded-md">
              {getAvailableEndTimes().map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="w-full" onClick={handleReserve}>
            Réserver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationPage;
