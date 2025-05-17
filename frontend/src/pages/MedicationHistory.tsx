
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { MedicationHistory as MedicationHistoryType } from '@/types/interfaces';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const MedicationHistory: React.FC = () => {
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistoryType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHistory, setCurrentHistory] = useState<MedicationHistoryType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MedicationHistoryType>();
  
  const onSubmit = (data: Partial<MedicationHistoryType>) => {
    if (isEditing && currentHistory) {
      const updatedHistory = medicationHistory.map(history => 
        history.id === currentHistory.id ? { 
          ...currentHistory, 
          ...data, 
          start_date: startDate || new Date(),
          end_date: endDate
        } : history
      );
      setMedicationHistory(updatedHistory);
      toast.success("Medication history updated successfully");
    } else {
      const newHistory: MedicationHistoryType = {
        id: uuidv4(),
        patient_id: data.patient_id!,
        medication_id: data.medication_id!,
        dosage: data.dosage!,
        start_date: startDate || new Date(),
        end_date: endDate,
        notes: data.notes!
      };
      setMedicationHistory([...medicationHistory, newHistory]);
      toast.success("Medication history added successfully");
    }
    
    reset();
    setStartDate(new Date());
    setEndDate(undefined);
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentHistory(null);
  };
  
  const handleEdit = (history: MedicationHistoryType) => {
    setCurrentHistory(history);
    setIsEditing(true);
    setStartDate(history.start_date);
    setEndDate(history.end_date || undefined);
    
    setValue("patient_id", history.patient_id);
    setValue("medication_id", history.medication_id);
    setValue("dosage", history.dosage);
    setValue("notes", history.notes);
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = (history: MedicationHistoryType) => {
    const updatedHistory = medicationHistory.filter(h => h.id !== history.id);
    setMedicationHistory(updatedHistory);
    toast.success("Medication history deleted successfully");
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
      setIsEditing(false);
      setCurrentHistory(null);
      setStartDate(new Date());
      setEndDate(undefined);
    }
  };
  
  const columns = [
    {
      header: "Patient ID",
      accessorKey: "patient_id",
    },
    {
      header: "Medication ID",
      accessorKey: "medication_id",
    },
    {
      header: "Dosage",
      accessorKey: "dosage",
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      cell: (row: { start_date: Date }) => format(new Date(row.start_date), 'PPP')
    },
    {
      header: "End Date",
      accessorKey: "end_date",
      cell: (row: { end_date: Date | null }) => row.end_date ? format(new Date(row.end_date), 'PPP') : "Ongoing"
    },
    {
      header: "Notes",
      accessorKey: "notes",
    }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Medication History" 
        description="Manage patient medication history"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button>Add Medication History</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit" : "Add"} Medication History</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patient_id">Patient ID</Label>
                      <Input 
                        id="patient_id" 
                        {...register("patient_id", { required: "Patient ID is required" })}
                        placeholder="Enter patient ID"
                      />
                      {errors.patient_id && <p className="text-sm text-red-500">{errors.patient_id.message}</p>}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="medication_id">Medication ID</Label>
                      <Input 
                        id="medication_id" 
                        {...register("medication_id", { required: "Medication ID is required" })}
                        placeholder="Enter medication ID"
                      />
                      {errors.medication_id && <p className="text-sm text-red-500">{errors.medication_id.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input 
                      id="dosage" 
                      {...register("dosage", { required: "Dosage is required" })}
                      placeholder="e.g., 500mg twice daily"
                    />
                    {errors.dosage && <p className="text-sm text-red-500">{errors.dosage.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Ongoing</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      {...register("notes", { required: "Notes are required" })}
                      placeholder="Additional notes"
                      rows={3}
                    />
                    {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">{isEditing ? "Update" : "Add"} History</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Medication History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={medicationHistory}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationHistory;
