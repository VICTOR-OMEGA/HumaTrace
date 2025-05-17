
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
import { toast } from '@/components/ui/use-toast';
import { BirthRecord, Patient } from '@/types/interfaces';

const formSchema = z.object({
  patient_id: z.string().min(1, { message: 'Patient is required' }),
  date_of_birth: z.date({
    required_error: 'Date of birth is required',
  }),
  place_of_birth: z.string().min(1, { message: 'Place of birth is required' }),
  delivery_method: z.string().min(1, { message: 'Delivery method is required' }),
  birth_weight: z.string().min(1, { message: 'Birth weight is required' }),
});

type FormData = z.infer<typeof formSchema>;

const BirthRecordsPage: React.FC = () => {
  // Mock data for patient dropdown
  const mockPatients: Patient[] = [
    { id: '1', first_name: 'John', last_name: 'Doe', gender: 'Male', phone: '123-456-7890', date_of_birth: new Date(1990, 5, 15) },
    { id: '2', first_name: 'Jane', last_name: 'Smith', gender: 'Female', phone: '987-654-3210', date_of_birth: new Date(1985, 8, 22) },
    { id: '3', first_name: 'Baby', last_name: 'Johnson', gender: 'Female', phone: 'N/A', date_of_birth: new Date(2023, 4, 12) },
  ];
  
  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>([
    {
      id: '1',
      patient_id: '3',
      date_of_birth: new Date(2023, 4, 12),
      place_of_birth: 'City General Hospital',
      delivery_method: 'Vaginal',
      birth_weight: '3.2 kg',
    },
  ]);
  
  const [editingRecord, setEditingRecord] = useState<BirthRecord | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      date_of_birth: new Date(),
      place_of_birth: '',
      delivery_method: '',
      birth_weight: '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingRecord) {
      // Update existing birth record
      setBirthRecords(birthRecords.map(record => 
        record.id === editingRecord.id 
          ? { ...record, ...data } 
          : record
      ));
      toast({ title: "Birth record updated successfully" });
    } else {
      // Add new birth record
      const newRecord: BirthRecord = {
        id: `${Date.now()}`,
        patient_id: data.patient_id,
        date_of_birth: data.date_of_birth,
        place_of_birth: data.place_of_birth,
        delivery_method: data.delivery_method,
        birth_weight: data.birth_weight
      };
      setBirthRecords([...birthRecords, newRecord]);
      toast({ title: "Birth record added successfully" });
    }
    
    // Reset the form
    form.reset();
    setEditingRecord(null);
  };

  const handleEdit = (record: BirthRecord) => {
    setEditingRecord(record);
    form.reset({
      patient_id: record.patient_id,
      date_of_birth: record.date_of_birth,
      place_of_birth: record.place_of_birth,
      delivery_method: record.delivery_method,
      birth_weight: record.birth_weight,
    });
  };

  const handleDelete = (record: BirthRecord) => {
    setBirthRecords(birthRecords.filter(r => r.id !== record.id));
    toast({ title: "Birth record deleted", description: "The birth record has been removed" });
  };

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  // Define columns for the birth records table
  type BirthRecordRow = {
    id: string;
    patient_id: string;
    date_of_birth: Date;
    place_of_birth: string;
    delivery_method: string;
    birth_weight: string;
  };

  const columns = [
    { 
      header: 'Patient', 
      accessorKey: 'patient_id' as keyof BirthRecordRow,
      cell: (row: BirthRecordRow) => getPatientName(row.patient_id)
    },
    { 
      header: 'Date of Birth', 
      accessorKey: 'date_of_birth' as keyof BirthRecordRow,
      cell: (row: BirthRecordRow) => format(new Date(row.date_of_birth), 'MMM d, yyyy')
    },
    { 
      header: 'Place of Birth', 
      accessorKey: 'place_of_birth' as keyof BirthRecordRow
    },
    { 
      header: 'Delivery Method', 
      accessorKey: 'delivery_method' as keyof BirthRecordRow
    },
    { 
      header: 'Birth Weight', 
      accessorKey: 'birth_weight' as keyof BirthRecordRow
    },
  ];

  const deliveryMethods = [
    'Vaginal',
    'C-Section',
    'Water Birth',
    'VBAC',
    'Forceps',
    'Vacuum Extraction'
  ];

  return (
    <div>
      <PageHeader 
        title="Birth Records" 
        description="Manage patient birth records" 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingRecord ? 'Edit Birth Record' : 'Add New Birth Record'}</CardTitle>
            <CardDescription>
              {editingRecord ? 'Update birth record details' : 'Fill the form to create a new birth record'}
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
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
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
                  name="place_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Birth</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., City General Hospital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Method</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deliveryMethods.map(method => (
                            <SelectItem key={method} value={method}>
                              {method}
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
                  name="birth_weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3.2 kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => {
                  form.reset();
                  setEditingRecord(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRecord ? 'Update Record' : 'Add Record'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Birth Records</CardTitle>
            <CardDescription>
              Manage existing birth records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={birthRecords}
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

export default BirthRecordsPage;
