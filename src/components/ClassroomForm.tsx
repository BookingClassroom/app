import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createClassroom,
  updateClassroom,
} from "@/services/classrooms.service";

// ✅ Définition du schéma de validation avec `zod`
const classroomSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  capacity: z
    .number()
    .min(1, "Capacité minimum : 1")
    .max(200, "Capacité max : 200"),
  equipments: z.string().optional(),
});

const ClassroomForm = ({
  onSuccess,
  classroom,
}: {
  onSuccess: () => void;
  classroom?: any;
}) => {
  const isEditing = !!classroom;
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: classroom?.name || "",
      capacity: classroom?.capacity || 10,
      equipments: classroom?.equipments?.join(", ") || "", // Convertit un tableau en string séparé par des virgules
    },
  });

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      equipments: data.equipments
        ? data.equipments.split(",").map((eq: string) => eq.trim())
        : [], // Conversion en tableau
    };

    if (isEditing) {
      await updateClassroom(classroom.id, formattedData);
    } else {
      await createClassroom(
        formattedData.name,
        formattedData.capacity,
        formattedData.equipments
      );
    }

    setOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{isEditing ? "Modifier la salle" : "Ajouter une salle"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier une salle" : "Ajouter une salle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom de la salle</label>
            <Input {...form.register("name")} placeholder="Salle A101" />
          </div>
          <div>
            <label className="block text-sm font-medium">Capacité</label>
            <Input
              type="number"
              {...form.register("capacity", { valueAsNumber: true })}
              placeholder="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Équipements (séparés par des virgules)
            </label>
            <Input
              {...form.register("equipments")}
              placeholder="Tableau, Projecteur, WiFi"
            />
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? "Mettre à jour" : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomForm;
