import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClassrooms } from "@/services/classrooms.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import toast from "react-hot-toast";

const ClassroomListPage = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [capacityFilter, setCapacityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const navigate = useNavigate();

  const availableEquipments = [
    "Projecteur",
    "Tableau blanc",
    "Wifi",
    "Climatisation",
    "PCs",
  ];

  useEffect(() => {
    const loadClassrooms = async () => {
      const data = await fetchClassrooms();
      if (data) {
        setClassrooms(data);
      } else {
        toast.error("Erreur lors du chargement des salles.");
      }
    };
    loadClassrooms();
  }, []);

  const filteredClassrooms = classrooms.filter((room) => {
    const matchesCapacity = capacityFilter
      ? room.capacity >= Number(capacityFilter)
      : true;
    const matchesStatus = statusFilter ? room.status === statusFilter : true;
    const matchesEquipments =
      selectedEquipments.length === 0 ||
      selectedEquipments.every((eq) => room.equipments?.includes(eq));

    return matchesCapacity && matchesStatus && matchesEquipments;
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Liste des Salles
      </h1>

      {/* ✅ Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="number"
          placeholder="Capacité min."
          value={capacityFilter}
          onChange={(e) => setCapacityFilter(e.target.value)}
          className="w-full md:w-1/3"
        />

        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? null : value)
          }
        ></Select>
      </div>

      {/* ✅ Liste des équipements (checkbox) */}
      <div className="flex flex-wrap gap-4 mb-6">
        {availableEquipments.map((equipment) => (
          <label key={equipment} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedEquipments.includes(equipment)}
              onCheckedChange={(checked) => {
                setSelectedEquipments((prev) =>
                  checked
                    ? [...prev, equipment]
                    : prev.filter((e) => e !== equipment)
                );
              }}
            />
            <span>{equipment}</span>
          </label>
        ))}
      </div>

      {/* ✅ Liste des salles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClassrooms.length > 0 ? (
          filteredClassrooms.map((room) => (
            <Card key={room.id} className="shadow-md border rounded-lg p-4">
              <CardHeader>
                <CardTitle className="text-xl">{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Capacité :</strong> {room.capacity} personnes
                </p>
                <p>
                  <strong>Équipements :</strong>{" "}
                  {room.equipments?.join(", ") || "Aucun"}
                </p>
                <p>
                  <strong>Statut :</strong> {room.status || "Indisponible"}
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => navigate(`/classroom/${room.id}`)}
                >
                  Voir les détails
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Aucune salle ne correspond aux critères.
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassroomListPage;
