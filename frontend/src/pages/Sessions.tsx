
import React, { useState } from 'react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from '@/components/ui/DataTable';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Session, Patient, Doctor } from '@/types/interfaces';
import { useToast } from '@/hooks/use-toast';

// Sample data for patients and doctors
const samplePatients: Patient[] = [
  { id: '1', first_name: 'John', last_name: 'Doe', gender: 'Male', phone: '555-1234', date_of_birth: new Date(1980, 1, 1) },
  { id: '2', first_name: 'Jane', last_name: 'Smith', gender: 'Female', phone: '555-5678', date_of_birth: new Date(1985, 5, 15) },
];

const sampleDoctors: Doctor[] = [
  { id: '1', first_name: 'Dr. Sarah', last_name: 'Johnson', specialty: 'Cardiology', phone: '555-9876', email: 'sarah@example.com' },
  { id: '2', first_name: 'Dr. Michael', last_name: 'Williams', specialty: 'Neurology', phone: '555-4321', email: 'michael@example.com' },
];

// Form schema for validation
const formSchema = z.object({
  patient_id: z.string().nonempty({ message: "Patient is required" }),
  doctor_id: z.string().nonempty({ message: "Doctor is required" }),
  started_at: z.string().nonempty({ message: "Start date/time is required" }),
  ended_at: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Sessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      patient_id: '1',
      doctor_id: '1',
      started_at: new Date(2023, 4, 15, 10, 30),
      ended_at: new Date(2023, 4, 15, 11, 15),
      notes: 'Initial consultation for heart palpitations.',
    },
    {
      id: '2',
      patient_id: '2',
      doctor_id: '2',
      started_at: new Date(2023, 4, 16, 14, 0),
      ended_at: null,
      notes: 'Follow-up appointment for migraines.',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      doctor_id: '',
      started_at: '',
      ended_at: '',
      notes: '',
    },
  });

  const openAddDialog = () => {
    form.reset({
      patient_id: '',
      doctor_id: '',
      started_at: '',
      ended_at: '',
      notes: '',
    });
    setCurrentSession(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (session: Session) => {
    const formattedStartedAt = format(new Date(session.started_at), "yyyy-MM-dd'T'HH:mm");
    const formattedEndedAt = session.ended_at ? format(new Date(session.ended_at), "yyyy-MM-dd'T'HH:mm") : '';

    form.reset({
      patient_id: session.patient_id,
      doctor_id: session.doctor_id,
      started_at: formattedStartedAt,
      ended_at: formattedEndedAt,
      notes: session.notes,
    });
    setCurrentSession(session);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const onSubmit = (data: FormValues) => {
    if (currentSession) {
      // Edit existing session
      const updatedSessions = sessions.map(session => {
        if (session.id === currentSession.id) {
          return {
            ...session,
            patient_id: data.patient_id,
            doctor_id: data.doctor_id,
            started_at: new Date(data.started_at),
            ended_at: data.ended_at ? new Date(data.ended_at) : null,
            notes: data.notes || '',
          };
        }
        return session;
      });
      setSessions(updatedSessions);
      toast({ title: "Session updated successfully" });
    } else {
      // Add new session
      const newSession: Session = {
        id: `${Date.now()}`,
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        started_at: new Date(data.started_at),
        ended_at: data.ended_at ? new Date(data.ended_at) : null,
        notes: data.notes || '',
      };
      setSessions([...sessions, newSession]);
      toast({ title: "Session added successfully" });
    }
    closeDialog();
  };

  const handleDelete = (session: Session) => {
    const updatedSessions = sessions.filter(s => s.id !== session.id);
    setSessions(updatedSessions);
    toast({ title: "Session deleted successfully" });
  };

  // Helper functions to get patient and doctor names
  const getPatientName = (patientId: string) => {
    const patient = samplePatients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = sampleDoctors.find(d => d.id === doctorId);
    return doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Unknown';
  };

  // Define columns for the sessions table
  type SessionRow = {
    id: string;
    patient_id: string;
    doctor_id: string;
    started_at: Date;
    ended_at: Date | null;
    notes: string;
  };

  const columns = [
    {
      header: 'Patient',
      accessorKey: 'patient_id' as keyof SessionRow,
      cell: (row: SessionRow) => getPatientName(row.patient_id),
    },
    {
      header: 'Doctor',
      accessorKey: 'doctor_id' as keyof SessionRow,
      cell: (row: SessionRow) => getDoctorName(row.doctor_id),
    },
    {
      header: 'Started At',
      accessorKey: 'started_at' as keyof SessionRow,
      cell: (row: SessionRow) => format(new Date(row.started_at), 'MMM d, yyyy HH:mm'),
    },
    {
      header: 'Ended At',
      accessorKey: 'ended_at' as keyof SessionRow,
      cell: (row: SessionRow) => row.ended_at ? format(new Date(row.ended_at), 'MMM d, yyyy HH:mm') : 'Ongoing',
    },
    {
      header: 'Notes',
      accessorKey: 'notes' as keyof SessionRow,
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Patient Sessions</h1>
        <Button onClick={openAddDialog}>Add Session</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sessions}
            columns={columns}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Session Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentSession ? 'Edit Session' : 'Add Session'}</DialogTitle>
            <DialogDescription>
              {currentSession ? 'Edit session details' : 'Add a new patient-doctor session'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {samplePatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
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
                name="doctor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.first_name} {doctor.last_name} - {doctor.specialty}
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
                name="started_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date/Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      When the session started
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ended_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date/Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank if session is ongoing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Session notes..."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {currentSession ? 'Update' : 'Add'} Session
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sessions;
