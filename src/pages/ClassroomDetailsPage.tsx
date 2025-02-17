import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClassroomById } from "@/services/classrooms.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const ClassroomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState<any | null>(null);

  useEffect(() => {
    if (!id) {
      toast.error("Salle introuvable.");
      navigate("/");
      return;
    }

    const loadClassroom = async () => {
      const data = await fetchClassroomById(id);
      if (data) {
        setClassroom(data);
      } else {
        toast.error("Erreur lors du chargement de la salle.");
        navigate("/");
      }
    };

    loadClassroom();
  }, [id, navigate]);

  if (!classroom) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-lg mx-auto shadow-md border rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl">{classroom.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Capacité :</strong> {classroom.capacity} personnes
          </p>
          <p>
            <strong>Équipements :</strong>{" "}
            {classroom.equipments?.join(", ") || "Aucun"}
          </p>
          <p>
            <strong>Statut :</strong> {classroom.status || "Indisponible"}
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => navigate("/reservation")}
          >
            Réserver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassroomDetailsPage;
