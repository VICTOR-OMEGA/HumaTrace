
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: Date;
  status: "Scheduled" | "Completed" | "Cancelled";
  patient?: Patient;
  doctor?: Doctor;
}

// Sample data
const samplePatients: Patient[] = [
  { id: "1", first_name: "John", last_name: "Doe" },
  { id: "2", first_name: "Jane", last_name: "Smith" },
  { id: "3", first_name: "Michael", last_name: "Johnson" },
];

const sampleDoctors: Doctor[] = [
  { id: "1", first_name: "David", last_name: "Wilson", specialty: "Cardiology" },
  {
    id: "2",
    first_name: "Sarah",
    last_name: "Thompson",
    specialty: "Neurology",
  },
  {
    id: "3",
    first_name: "Robert",
    last_name: "Johnson",
    specialty: "Pediatrics",
  },
];

const initialAppointments: Appointment[] = [
  {
    id: "1",
    patient_id: "1",
    doctor_id: "1",
    scheduled_at: new Date(2025, 5, 17, 10, 0),
    status: "Scheduled",
  },
  {
    id: "2",
    patient_id: "2",
    doctor_id: "2",
    scheduled_at: new Date(2025, 5, 16, 14, 30),
    status: "Completed",
  },
  {
    id: "3",
    patient_id: "3",
    doctor_id: "3",
    scheduled_at: new Date(2025, 5, 18, 9, 15),
    status: "Cancelled",
  },
];

// Add patient and doctor details to appointments
const enrichedAppointments = initialAppointments.map((appointment) => {
  const patient = samplePatients.find((p) => p.id === appointment.patient_id);
  const doctor = sampleDoctors.find((d) => d.id === appointment.doctor_id);
  return {
    ...appointment,
    patient,
    doctor,
  };
});

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Please select a patient.",
  }),
  doctor_id: z.string({
    required_error: "Please select a doctor.",
  }),
  appointment_date: z.date({
    required_error: "Please select a date.",
  }),
  appointment_time: z.string({
    required_error: "Please select a time.",
  }),
  status: z.enum(["Scheduled", "Completed", "Cancelled"], {
    required_error: "Please select a status.",
  }),
});

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(enrichedAppointments);
  const [isOpen, setIsOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      doctor_id: "",
      appointment_date: new Date(),
      appointment_time: "09:00",
      status: "Scheduled" as const,
    },
  });

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    
    // Extract the time from the date
    const hours = appointment.scheduled_at.getHours();
    const minutes = appointment.scheduled_at.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    form.reset({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointment_date: appointment.scheduled_at,
      appointment_time: timeString,
      status: appointment.status,
    });
    setIsOpen(true);
  };

  const handleDelete = (appointment: Appointment) => {
    setAppointments(appointments.filter((a) => a.id !== appointment.id));
    toast({
      title: "Appointment deleted",
      description: `Appointment has been removed.`,
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Parse the time string to hours and minutes
    const [hours, minutes] = values.appointment_time.split(":").map(Number);
    
    // Create a new date with the appointment date and time
    const scheduledAt = new Date(values.appointment_date);
    scheduledAt.setHours(hours, minutes);
    
    const patient = samplePatients.find(p => p.id === values.patient_id);
    const doctor = sampleDoctors.find(d => d.id === values.doctor_id);
    
    if (editingAppointment) {
      // Update existing appointment
      setAppointments(
        appointments.map((a) =>
          a.id === editingAppointment.id 
            ? { 
                ...a, 
                patient_id: values.patient_id,
                doctor_id: values.doctor_id,
                scheduled_at: scheduledAt,
                status: values.status,
                patient,
                doctor,
              } 
            : a
        )
      );
      toast({
        title: "Appointment updated",
        description: `Appointment has been updated.`,
      });
    } else {
      // Add new appointment
      const newAppointment = {
        id: `${Date.now()}`,
        patient_id: values.patient_id,
        doctor_id: values.doctor_id,
        scheduled_at: scheduledAt,
        status: values.status,
        patient,
        doctor,
      };
      setAppointments([...appointments, newAppointment]);
      toast({
        title: "Appointment added",
        description: `New appointment has been added successfully.`,
      });
    }
    setIsOpen(false);
    setEditingAppointment(null);
    form.reset();
  };

  const columns = [
    {
      header: "Patient",
      accessorKey: "patient" as keyof Appointment,
      cell: (row: Appointment) => 
        `${row.patient?.first_name} ${row.patient?.last_name}`,
    },
    {
      header: "Doctor",
      accessorKey: "doctor" as keyof Appointment,
      cell: (row: Appointment) => 
        `${row.doctor?.first_name} ${row.doctor?.last_name} (${row.doctor?.specialty})`,
    },
    {
      header: "Date & Time",
      accessorKey: "scheduled_at" as keyof Appointment,
      cell: (row: Appointment) => format(new Date(row.scheduled_at), "MMM dd, yyyy h:mm a"),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Appointment,
      cell: (row: Appointment) => {
        const statusClasses = {
          Scheduled: "inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800",
          Completed: "inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800",
          Cancelled: "inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800",
        };
        return <span className={statusClasses[row.status]}>{row.status}</span>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Schedule and manage patient appointments"
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingAppointment(null);
                  form.reset({
                    patient_id: "",
                    doctor_id: "",
                    appointment_date: new Date(),
                    appointment_time: "09:00",
                    status: "Scheduled",
                  });
                }}
              >
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? "Edit Appointment" : "Add New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="patient_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sampleDoctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                {doctor.first_name} {doctor.last_name} ({doctor.specialty})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appointment_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="appointment_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingAppointment ? "Update" : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mt-6">
        <DataTable
          data={appointments}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default Appointments;
