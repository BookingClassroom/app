import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

const availableEquipments = [
  "Projecteur",
  "Tableau blanc",
  "WiFi",
  "Climatisation",
  "PC",
];

const classroomSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  capacity: z
    .number()
    .min(1, "Capacité minimum : 1")
    .max(200, "Capacité max : 200"),
  equipments: z.array(z.string()).optional(),
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
      equipments: classroom?.equipments || [],
    },
  });

  const onSubmit = async (data: any) => {
    if (isEditing) {
      await updateClassroom(classroom.id, data);
    } else {
      await createClassroom(data.name, data.capacity, data.equipments);
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
            <label className="block text-sm font-medium">Équipements</label>
            <div className="space-y-2">
              {availableEquipments.map((eq) => (
                <div key={eq} className="flex items-center space-x-2">
                  <Checkbox
                    id={eq}
                    checked={form.watch("equipments")?.includes(eq)}
                    onCheckedChange={(checked) => {
                      const currentEquipments =
                        form.getValues("equipments") || [];
                      form.setValue(
                        "equipments",
                        checked
                          ? [...currentEquipments, eq]
                          : currentEquipments.filter((e) => e !== eq)
                      );
                    }}
                  />
                  <label htmlFor={eq} className="text-sm">
                    {eq}
                  </label>
                </div>
              ))}
            </div>
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
