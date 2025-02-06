import { useEffect, useState } from "react";
import { getClassrooms, deleteClassroom } from "@/services/classrooms.service";
import ClassroomForm from "@/components/ClassroomForm";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast"; // 📢 Pour afficher un message après suppression

const ClassroomPage = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const fetchClassrooms = async () => {
    const data = await getClassrooms();
    if (data) setClassrooms(data);
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteClassroom(id);
    toast.success("Salle supprimée avec succès !"); // ✅ Afficher un message après suppression
    fetchClassrooms();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Gestion des salles</h2>

      {/* Formulaire d'ajout */}
      <ClassroomForm onSuccess={fetchClassrooms} />

      <ul className="mt-6 space-y-4">
        {classrooms.map((classroom) => (
          <li
            key={classroom.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-medium">{classroom.name}</h3>
              <p className="text-sm text-gray-600">
                Capacité : {classroom.capacity} - Équipements :{" "}
                {classroom.equipments?.join(", ") || "Aucun"}
              </p>
            </div>
            <div className="flex space-x-2">
              {/* Formulaire de modification */}
              <ClassroomForm
                onSuccess={fetchClassrooms}
                classroom={classroom}
              />

              {/* Bouton de suppression avec confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedClassroom(classroom)}
                  >
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Supprimer la salle {selectedClassroom?.name} ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Voulez-vous vraiment
                      supprimer cette salle ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(selectedClassroom.id)}
                    >
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassroomPage;
