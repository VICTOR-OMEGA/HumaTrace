
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { PatientVital } from '@/types/interfaces';
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
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const PatientVitals: React.FC = () => {
  const [patientVitals, setPatientVitals] = useState<PatientVital[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVital, setCurrentVital] = useState<PatientVital | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordedAt, setRecordedAt] = useState<Date | undefined>(new Date());
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PatientVital>();
  
  const onSubmit = (data: Partial<PatientVital>) => {
    if (isEditing && currentVital) {
      const updatedVitals = patientVitals.map(vital => 
        vital.id === currentVital.id ? { ...currentVital, ...data, recorded_at: recordedAt || new Date() } : vital
      );
      setPatientVitals(updatedVitals);
      toast.success("Patient vital updated successfully");
    } else {
      const newVital: PatientVital = {
        id: uuidv4(),
        patient_id: data.patient_id!,
        height_cm: data.height_cm!,
        weight_kg: data.weight_kg!,
        blood_pressure: data.blood_pressure!,
        temperature_celsius: data.temperature_celsius!,
        recorded_at: recordedAt || new Date()
      };
      setPatientVitals([...patientVitals, newVital]);
      toast.success("Patient vital added successfully");
    }
    
    reset();
    setRecordedAt(new Date());
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentVital(null);
  };
  
  const handleEdit = (vital: PatientVital) => {
    setCurrentVital(vital);
    setIsEditing(true);
    setRecordedAt(vital.recorded_at);
    
    setValue("patient_id", vital.patient_id);
    setValue("height_cm", vital.height_cm);
    setValue("weight_kg", vital.weight_kg);
    setValue("blood_pressure", vital.blood_pressure);
    setValue("temperature_celsius", vital.temperature_celsius);
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = (vital: PatientVital) => {
    const updatedVitals = patientVitals.filter(v => v.id !== vital.id);
    setPatientVitals(updatedVitals);
    toast.success("Patient vital deleted successfully");
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
      setIsEditing(false);
      setCurrentVital(null);
      setRecordedAt(new Date());
    }
  };
  
  const columns = [
    {
      header: "Patient ID",
      accessorKey: "patient_id",
    },
    {
      header: "Height (cm)",
      accessorKey: "height_cm",
    },
    {
      header: "Weight (kg)",
      accessorKey: "weight_kg",
    },
    {
      header: "Blood Pressure",
      accessorKey: "blood_pressure",
    },
    {
      header: "Temperature (°C)",
      accessorKey: "temperature_celsius",
    },
    {
      header: "Recorded At",
      accessorKey: "recorded_at",
      cell: (row: { recorded_at: Date }) => format(new Date(row.recorded_at), 'PPP')
    }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Patient Vitals" 
        description="Manage patient vital signs"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button>Add Vital Signs</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit" : "Add"} Patient Vital</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patient_id">Patient ID</Label>
                    <Input 
                      id="patient_id" 
                      {...register("patient_id", { required: "Patient ID is required" })}
                      placeholder="Enter patient ID"
                    />
                    {errors.patient_id && <p className="text-sm text-red-500">{errors.patient_id.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="height_cm">Height (cm)</Label>
                      <Input 
                        id="height_cm" 
                        type="number"
                        {...register("height_cm", { 
                          required: "Height is required",
                          valueAsNumber: true
                        })}
                        placeholder="Height in cm"
                      />
                      {errors.height_cm && <p className="text-sm text-red-500">{errors.height_cm.message}</p>}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="weight_kg">Weight (kg)</Label>
                      <Input 
                        id="weight_kg" 
                        type="number"
                        {...register("weight_kg", { 
                          required: "Weight is required",
                          valueAsNumber: true
                        })}
                        placeholder="Weight in kg"
                      />
                      {errors.weight_kg && <p className="text-sm text-red-500">{errors.weight_kg.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="blood_pressure">Blood Pressure</Label>
                      <Input 
                        id="blood_pressure" 
                        {...register("blood_pressure", { required: "Blood pressure is required" })}
                        placeholder="e.g., 120/80"
                      />
                      {errors.blood_pressure && <p className="text-sm text-red-500">{errors.blood_pressure.message}</p>}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="temperature_celsius">Temperature (°C)</Label>
                      <Input 
                        id="temperature_celsius" 
                        type="number"
                        step="0.1"
                        {...register("temperature_celsius", { 
                          required: "Temperature is required",
                          valueAsNumber: true
                        })}
                        placeholder="Temperature in °C"
                      />
                      {errors.temperature_celsius && <p className="text-sm text-red-500">{errors.temperature_celsius.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Recorded At</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !recordedAt && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {recordedAt ? format(recordedAt, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={recordedAt}
                          onSelect={setRecordedAt}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">{isEditing ? "Update" : "Add"} Vital Signs</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Patient Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={patientVitals}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientVitals;
