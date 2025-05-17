
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Medication } from '@/types/interfaces';
import { DataTable } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Medication>();
  
  const onSubmit = (data: Partial<Medication>) => {
    if (isEditing && currentMedication) {
      const updatedMedications = medications.map(med => 
        med.id === currentMedication.id ? { ...currentMedication, ...data } : med
      );
      setMedications(updatedMedications);
      toast.success("Medication updated successfully");
    } else {
      const newMedication: Medication = {
        id: uuidv4(),
        name: data.name!,
        type: data.type!,
        description: data.description!,
        side_effects: data.side_effects!
      };
      setMedications([...medications, newMedication]);
      toast.success("Medication added successfully");
    }
    
    reset();
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentMedication(null);
  };
  
  const handleEdit = (medication: Medication) => {
    setCurrentMedication(medication);
    setIsEditing(true);
    
    setValue("name", medication.name);
    setValue("type", medication.type);
    setValue("description", medication.description);
    setValue("side_effects", medication.side_effects);
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = (medication: Medication) => {
    const updatedMedications = medications.filter(med => med.id !== medication.id);
    setMedications(updatedMedications);
    toast.success("Medication deleted successfully");
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
      setIsEditing(false);
      setCurrentMedication(null);
    }
  };

  type MedicationRow = {
    id: string;
    name: string;
    type: string;
    description: string;
    side_effects: string;
  };
  
  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof MedicationRow,
    },
    {
      header: "Type",
      accessorKey: "type" as keyof MedicationRow,
    },
    {
      header: "Description",
      accessorKey: "description" as keyof MedicationRow,
    },
    {
      header: "Side Effects",
      accessorKey: "side_effects" as keyof MedicationRow,
    }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Medications" 
        description="Manage medications"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button>Add Medication</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit" : "Add"} Medication</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      {...register("name", { required: "Name is required" })}
                      placeholder="Medication name"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Input 
                      id="type" 
                      {...register("type", { required: "Type is required" })}
                      placeholder="Medication type"
                    />
                    {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      {...register("description", { required: "Description is required" })}
                      placeholder="Medication description"
                      rows={3}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="side_effects">Side Effects</Label>
                    <Textarea 
                      id="side_effects" 
                      {...register("side_effects", { required: "Side effects information is required" })}
                      placeholder="Potential side effects"
                      rows={3}
                    />
                    {errors.side_effects && <p className="text-sm text-red-500">{errors.side_effects.message}</p>}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">{isEditing ? "Update" : "Add"} Medication</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={medications}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Medications;
