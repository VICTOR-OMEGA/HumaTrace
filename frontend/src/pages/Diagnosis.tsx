
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
import { Diagnosis, Patient, Issue } from '@/types/interfaces';

const formSchema = z.object({
  patient_id: z.string().min(1, { message: 'Patient is required' }),
  issue_id: z.string().min(1, { message: 'Issue is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  diagnosed_at: z.date({
    required_error: 'Please select a date',
  }),
});

type FormData = z.infer<typeof formSchema>;

const DiagnosisPage: React.FC = () => {
  // Mock data for dropdowns
  const mockPatients: Patient[] = [
    { id: '1', first_name: 'John', last_name: 'Doe', gender: 'Male', phone: '123-456-7890', date_of_birth: new Date(1990, 5, 15) },
    { id: '2', first_name: 'Jane', last_name: 'Smith', gender: 'Female', phone: '987-654-3210', date_of_birth: new Date(1985, 8, 22) },
  ];
  
  const mockIssues: Issue[] = [
    { id: '1', name: 'Acute Headache', severity: 'Medium', created_at: new Date(2023, 1, 15) },
    { id: '2', name: 'Respiratory Infection', severity: 'High', created_at: new Date(2023, 2, 10) },
  ];
  
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
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
  ]);
  
  const [editingDiagnosis, setEditingDiagnosis] = useState<Diagnosis | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      issue_id: '',
      description: '',
      diagnosed_at: new Date(),
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingDiagnosis) {
      // Update existing diagnosis
      setDiagnoses(diagnoses.map(diagnosis => 
        diagnosis.id === editingDiagnosis.id 
          ? { ...diagnosis, ...data } 
          : diagnosis
      ));
      toast({ title: "Diagnosis updated successfully" });
    } else {
      // Add new diagnosis
      const newDiagnosis: Diagnosis = {
        id: `${Date.now()}`,
        ...data
      };
      setDiagnoses([...diagnoses, newDiagnosis]);
      toast({ title: "Diagnosis added successfully" });
    }
    
    // Reset the form
    form.reset();
    setEditingDiagnosis(null);
  };

  const handleEdit = (diagnosis: Diagnosis) => {
    setEditingDiagnosis(diagnosis);
    form.reset({
      patient_id: diagnosis.patient_id,
      issue_id: diagnosis.issue_id,
      description: diagnosis.description,
      diagnosed_at: diagnosis.diagnosed_at,
    });
  };

  const handleDelete = (diagnosis: Diagnosis) => {
    setDiagnoses(diagnoses.filter(d => d.id !== diagnosis.id));
    toast({ title: "Diagnosis deleted", description: "The diagnosis has been removed" });
  };

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getIssueName = (issueId: string) => {
    const issue = mockIssues.find(i => i.id === issueId);
    return issue ? issue.name : 'Unknown';
  };

  const columns = [
    { 
      header: 'Patient', 
      accessorKey: 'patient_id',
      cell: (row: { patient_id: string }) => getPatientName(row.patient_id)
    },
    { 
      header: 'Issue', 
      accessorKey: 'issue_id',
      cell: (row: { issue_id: string }) => getIssueName(row.issue_id)
    },
    { 
      header: 'Description', 
      accessorKey: 'description',
      cell: (row: { description: string }) => (
        <div className="max-w-xs truncate" title={row.description}>
          {row.description}
        </div>
      )
    },
    { 
      header: 'Diagnosed At', 
      accessorKey: 'diagnosed_at',
      cell: (row: { diagnosed_at: Date }) => format(new Date(row.diagnosed_at), 'MMM d, yyyy')
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Diagnosis Management" 
        description="Create and manage patient diagnoses" 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingDiagnosis ? 'Edit Diagnosis' : 'Add New Diagnosis'}</CardTitle>
            <CardDescription>
              {editingDiagnosis ? 'Update diagnosis details' : 'Fill the form to create a new diagnosis'}
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
                  name="issue_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select issue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockIssues.map(issue => (
                            <SelectItem key={issue.id} value={issue.id}>
                              {issue.name} - {issue.severity}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter diagnosis details" 
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
                  name="diagnosed_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosed At</FormLabel>
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => {
                  form.reset();
                  setEditingDiagnosis(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDiagnosis ? 'Update Diagnosis' : 'Add Diagnosis'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnosis List</CardTitle>
            <CardDescription>
              Manage existing patient diagnoses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={diagnoses}
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

export default DiagnosisPage;
