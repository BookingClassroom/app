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

  // 🔹 Récupération des filtres depuis l'URL
  const capacityFilter = searchParams.get("minCapacity") || "";
  const statusFilter = searchParams.get("status") || null;
  const selectedEquipments = searchParams.getAll("equipments");

  const availableEquipments = [
    "Projecteur",
    "Tableau blanc",
    "WiFi",
    "Climatisation",
    "PCs",
  ];

  // 🔹 Fonction pour charger les salles avec les filtres dynamiques
  const loadClassrooms = async () => {
    setIsLoading(true); // Débute le chargement
    const data = await fetchClassrooms({
      capacity: capacityFilter,
      status: statusFilter,
      equipments: selectedEquipments,
    });

    if (data) {
      setClassrooms(data);
    } else {
      setClassrooms([]); // ⚠️ Assurez-vous qu’on ne laisse pas un état instable
      toast.error("Erreur lors du chargement des salles.");
    }

    setIsLoading(false); // Fin du chargement
  };
  const firstRender = useRef(true);

  // 🔹 useEffect : Recharge les salles à chaque changement de filtre
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // 🔹 Bloque le premier appel
    }

    loadClassrooms();
  }, [searchParams]); // 🔹 Regarde directement les URL params

  const areFiltersEqual = (currentParams: URLSearchParams, newFilters: any) => {
    return (
      currentParams.get("minCapacity") === newFilters.capacity &&
      currentParams.get("status") === newFilters.status &&
      JSON.stringify(currentParams.getAll("equipments")) ===
        JSON.stringify(newFilters.equipments)
    );
  };

  // 🔹 Mettre à jour les filtres dans l'URL
  const updateFilters = (newFilters: {
    capacity?: string;
    status?: string | null;
    equipments?: string[];
  }) => {
    const currentParams = new URLSearchParams(searchParams);

    // 🔹 Vérifie si les filtres sont déjà appliqués
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Liste des Salles
      </h1>

      {/* ✅ Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
          className="w-full md:w-1/3"
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
        ></Select>
      </div>

      {/* ✅ Liste des équipements (checkbox) */}
      <div className="flex flex-wrap gap-4 mb-6">
        {availableEquipments.map((equipment) => (
          <label key={equipment} className="flex items-center space-x-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Chargement des salles...</p>
        ) : classrooms.length > 0 ? (
          classrooms.map((room) => (
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
