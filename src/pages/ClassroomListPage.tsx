import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchClassrooms } from "@/services/classrooms.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useRef } from "react";

const ClassroomListPage = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const capacityFilter = searchParams.get("minCapacity") || "";
  const statusFilter = searchParams.get("status") || null;
  const selectedEquipments = searchParams.getAll("equipments");

  const availableEquipments = [
    "Projecteur",
    "Tableau blanc",
    "Wifi",
    "Climatisation",
    "Pc",
  ];

  const loadClassrooms = async () => {
    setIsLoading(true);
    const data = await fetchClassrooms({
      capacity: capacityFilter,
      status: statusFilter,
      equipments: selectedEquipments,
    });

    if (data) {
      setClassrooms(data);
    } else {
      setClassrooms([]);
      toast.error("Erreur lors du chargement des salles.");
    }

    setIsLoading(false);
  };
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    loadClassrooms();
  }, [searchParams]);

  const areFiltersEqual = (currentParams: URLSearchParams, newFilters: any) => {
    return (
      currentParams.get("minCapacity") === newFilters.capacity &&
      currentParams.get("status") === newFilters.status &&
      JSON.stringify(currentParams.getAll("equipments")) ===
        JSON.stringify(newFilters.equipments)
    );
  };

  const updateFilters = (newFilters: {
    capacity?: string;
    status?: string | null;
    equipments?: string[];
  }) => {
    const currentParams = new URLSearchParams(searchParams);

    if (areFiltersEqual(currentParams, newFilters)) return;

    const params = new URLSearchParams();

    if (newFilters.capacity) params.set("minCapacity", newFilters.capacity);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.equipments) {
      newFilters.equipments.forEach((eq) => params.append("equipments", eq));
    }

    setSearchParams(params);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-background via-muted to-primary/10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-primary mb-8 drop-shadow-lg">
        Liste des Salles
      </h1>

      {/* ✅ Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card shadow-md rounded-lg">
        {/* 🔹 Capacité */}
        <Input
          type="number"
          placeholder="Capacité min."
          value={capacityFilter}
          onChange={(e) =>
            updateFilters({
              capacity: e.target.value,
              status: statusFilter,
              equipments: selectedEquipments,
            })
          }
          className="w-full md:w-1/3 border border-border p-2 rounded-lg shadow-sm"
        />

        {/* 🔹 Statut */}
        <Select
          value={statusFilter || "all"}
          onChange={(e) =>
            updateFilters({
              capacity: capacityFilter,
              status: e.target.value === "all" ? null : e.target.value,
              equipments: selectedEquipments,
            })
          }
          className="w-full md:w-1/3 border border-border p-2 rounded-lg shadow-sm"
        ></Select>
        {availableEquipments.map((equipment) => (
          <label
            key={equipment}
            className="flex items-center space-x-2 text-primary"
          >
            <Checkbox
              checked={selectedEquipments.includes(equipment)}
              onCheckedChange={(checked) => {
                const newEquipments = checked
                  ? [...selectedEquipments, equipment]
                  : selectedEquipments.filter((e) => e !== equipment);
                updateFilters({
                  capacity: capacityFilter,
                  status: statusFilter,
                  equipments: newEquipments,
                });
              }}
            />
            <span>{equipment}</span>
          </label>
        ))}
      </div>

      {/* ✅ Liste des salles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <p className="text-center text-muted-foreground">
            Chargement des salles...
          </p>
        ) : classrooms.length > 0 ? (
          classrooms.map((room) => (
            <Card
              key={room.id}
              className="shadow-lg border border-border rounded-xl p-6 bg-card transition-transform duration-300 hover:scale-105"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground">
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
                  className="mt-6 w-full bg-primary text-primary-foreground font-semibold rounded-lg py-2 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate(`/classroom/${room.id}`)}
                >
                  Voir les détails
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            Aucune salle ne correspond aux critères.
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassroomListPage;
