
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Treatment, Patient, Diagnosis } from '@/types/interfaces';

const formSchema = z.object({
  patient_id: z.string().min(1, { message: 'Patient is required' }),
  diagnosis_id: z.string().min(1, { message: 'Diagnosis is required' }),
  treatment_plan: z.string().min(1, { message: 'Treatment plan is required' }),
  started_at: z.date({
    required_error: 'Start date is required',
  }),
  ended_at: z.date().nullable().optional(),
});

type FormData = z.infer<typeof formSchema>;

const TreatmentsPage: React.FC = () => {
  // Mock data for dropdowns
  const mockPatients: Patient[] = [
    { id: '1', first_name: 'John', last_name: 'Doe', gender: 'Male', phone: '123-456-7890', date_of_birth: new Date(1990, 5, 15) },
    { id: '2', first_name: 'Jane', last_name: 'Smith', gender: 'Female', phone: '987-654-3210', date_of_birth: new Date(1985, 8, 22) },
  ];
  
  const mockDiagnoses: Diagnosis[] = [
    {
      id: '1',
      patient_id: '1',
      issue_id: '1',
      description: 'Patient experiencing severe migraines for the past week',
      diagnosed_at: new Date(2023, 3, 10),
    },
    {
      id: '2',
      patient_id: '2',
      issue_id: '2',
      description: 'Upper respiratory tract infection with fever and cough',
      diagnosed_at: new Date(2023, 3, 15),
    },
  ];
  
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: '1',
      patient_id: '1',
      diagnosis_id: '1',
      treatment_plan: 'Prescribed pain relief medication and daily monitoring',
      started_at: new Date(2023, 3, 11),
      ended_at: new Date(2023, 3, 18),
    },
    {
      id: '2',
      patient_id: '2',
      diagnosis_id: '2',
      treatment_plan: 'Antibiotics and rest for 7 days',
      started_at: new Date(2023, 3, 16),
      ended_at: null,
    },
  ]);
  
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      diagnosis_id: '',
      treatment_plan: '',
      started_at: new Date(),
      ended_at: null,
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingTreatment) {
      // Update existing treatment
      setTreatments(treatments.map(treatment => 
        treatment.id === editingTreatment.id 
          ? { ...treatment, ...data } 
          : treatment
      ));
      toast({ title: "Treatment updated successfully" });
    } else {
      // Add new treatment
      const newTreatment: Treatment = {
        id: `${Date.now()}`,
        ...data
      };
      setTreatments([...treatments, newTreatment]);
      toast({ title: "Treatment added successfully" });
    }
    
    // Reset the form
    form.reset();
    setEditingTreatment(null);
  };

  const handleEdit = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    form.reset({
      patient_id: treatment.patient_id,
      diagnosis_id: treatment.diagnosis_id,
      treatment_plan: treatment.treatment_plan,
      started_at: treatment.started_at,
      ended_at: treatment.ended_at,
    });
  };

  const handleDelete = (treatment: Treatment) => {
    setTreatments(treatments.filter(t => t.id !== treatment.id));
    toast({ title: "Treatment deleted", description: "The treatment has been removed" });
  };

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getDiagnosisDescription = (diagnosisId: string) => {
    const diagnosis = mockDiagnoses.find(d => d.id === diagnosisId);
    return diagnosis ? diagnosis.description.substring(0, 30) + '...' : 'Unknown';
  };

  const columns = [
    { 
      header: 'Patient', 
      accessorKey: 'patient_id',
      cell: (row: { patient_id: string }) => getPatientName(row.patient_id)
    },
    { 
      header: 'Diagnosis', 
      accessorKey: 'diagnosis_id',
      cell: (row: { diagnosis_id: string }) => getDiagnosisDescription(row.diagnosis_id)
    },
    { 
      header: 'Treatment Plan', 
      accessorKey: 'treatment_plan',
      cell: (row: { treatment_plan: string }) => (
        <div className="max-w-xs truncate" title={row.treatment_plan}>
          {row.treatment_plan}
        </div>
      )
    },
    { 
      header: 'Started At', 
      accessorKey: 'started_at',
      cell: (row: { started_at: Date }) => format(new Date(row.started_at), 'MMM d, yyyy')
    },
    { 
      header: 'Ended At', 
      accessorKey: 'ended_at',
      cell: (row: { ended_at: Date | null }) => 
        row.ended_at ? format(new Date(row.ended_at), 'MMM d, yyyy') : 'Ongoing'
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Treatments Management" 
        description="Create and manage patient treatments" 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}</CardTitle>
            <CardDescription>
              {editingTreatment ? 'Update treatment details' : 'Fill the form to create a new treatment'}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="patient_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockPatients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {`${patient.first_name} ${patient.last_name}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diagnosis_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select diagnosis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockDiagnoses.map(diagnosis => (
                            <SelectItem key={diagnosis.id} value={diagnosis.id}>
                              {getDiagnosisDescription(diagnosis.id)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatment_plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Plan</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter treatment details" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="started_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Started At</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          onChange={e => field.onChange(new Date(e.target.value))}
                          value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ended_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ended At (Leave empty for ongoing treatments)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                          value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => {
                  form.reset();
                  setEditingTreatment(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTreatment ? 'Update Treatment' : 'Add Treatment'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treatments List</CardTitle>
            <CardDescription>
              Manage existing patient treatments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={treatments}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreatmentsPage;
