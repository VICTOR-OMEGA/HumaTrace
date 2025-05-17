
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone: string;
  date_of_birth: Date;
}

// Sample data
const initialPatients: Patient[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    gender: "Male",
    phone: "(555) 123-4567",
    date_of_birth: new Date(1980, 3, 15),
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    gender: "Female",
    phone: "(555) 987-6543",
    date_of_birth: new Date(1992, 7, 22),
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Johnson",
    gender: "Male",
    phone: "(555) 333-2222",
    date_of_birth: new Date(1975, 10, 8),
  },
];

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  gender: z.string(),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
    message: "Phone must be in the format (555) 123-4567",
  }),
  date_of_birth: z.date(),
});

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "Male",
      phone: "",
      date_of_birth: new Date(1990, 0, 1),
    },
  });

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    form.reset({
      first_name: patient.first_name,
      last_name: patient.last_name,
      gender: patient.gender,
      phone: patient.phone,
      date_of_birth: patient.date_of_birth,
    });
    setIsOpen(true);
  };

  const handleDelete = (patient: Patient) => {
    setPatients(patients.filter((p) => p.id !== patient.id));
    toast({
      title: "Patient deleted",
      description: `${patient.first_name} ${patient.last_name} has been removed.`,
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingPatient) {
      // Update existing patient
      setPatients(
        patients.map((p) =>
          p.id === editingPatient.id ? { ...values, id: p.id } : p
        )
      );
      toast({
        title: "Patient updated",
        description: `${values.first_name} ${values.last_name}'s information has been updated.`,
      });
    } else {
      // Add new patient
      const newPatient = {
        ...values,
        id: `${Date.now()}`,
      };
      setPatients([...patients, newPatient]);
      toast({
        title: "Patient added",
        description: `${values.first_name} ${values.last_name} has been added successfully.`,
      });
    }
    setIsOpen(false);
    setEditingPatient(null);
    form.reset();
  };

  const columns = [
    {
      header: "First Name",
      accessorKey: "first_name" as keyof Patient,
    },
    {
      header: "Last Name",
      accessorKey: "last_name" as keyof Patient,
    },
    {
      header: "Gender",
      accessorKey: "gender" as keyof Patient,
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof Patient,
    },
    {
      header: "Date of Birth",
      accessorKey: "date_of_birth" as keyof Patient,
      cell: (row: Patient) => format(new Date(row.date_of_birth), "MM/dd/yyyy"),
    },
  ];

  return (
    <>
      <PageHeader
        title="Patients"
        description="Manage patient information"
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPatient(null);
                  form.reset({
                    first_name: "",
                    last_name: "",
                    gender: "Male",
                    phone: "",
                    date_of_birth: new Date(1990, 0, 1),
                  });
                }}
              >
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPatient ? "Edit Patient" : "Add New Patient"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingPatient ? "Update" : "Save"}
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
          data={patients}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default Patients;
