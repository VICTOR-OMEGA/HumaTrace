
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  phone: string;
  email: string;
}

// Sample data
const initialDoctors: Doctor[] = [
  {
    id: "1",
    first_name: "David",
    last_name: "Wilson",
    specialty: "Cardiology",
    phone: "(555) 111-2222",
    email: "david.wilson@humatrack.com",
  },
  {
    id: "2",
    first_name: "Sarah",
    last_name: "Thompson",
    specialty: "Neurology",
    phone: "(555) 333-4444",
    email: "sarah.thompson@humatrack.com",
  },
  {
    id: "3",
    first_name: "Robert",
    last_name: "Johnson",
    specialty: "Pediatrics",
    phone: "(555) 555-6666",
    email: "robert.johnson@humatrack.com",
  },
];

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  specialty: z.string().min(2, {
    message: "Specialty must be at least 2 characters.",
  }),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
    message: "Phone must be in the format (555) 123-4567",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      specialty: "",
      phone: "",
      email: "",
    },
  });

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.reset({
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
    });
    setIsOpen(true);
  };

  const handleDelete = (doctor: Doctor) => {
    setDoctors(doctors.filter((d) => d.id !== doctor.id));
    toast({
      title: "Doctor deleted",
      description: `${doctor.first_name} ${doctor.last_name} has been removed.`,
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingDoctor) {
      // Update existing doctor
      setDoctors(
        doctors.map((d) =>
          d.id === editingDoctor.id ? { ...values, id: d.id } : d
        )
      );
      toast({
        title: "Doctor updated",
        description: `${values.first_name} ${values.last_name}'s information has been updated.`,
      });
    } else {
      // Add new doctor
      const newDoctor = {
        ...values,
        id: `${Date.now()}`,
      };
      setDoctors([...doctors, newDoctor]);
      toast({
        title: "Doctor added",
        description: `${values.first_name} ${values.last_name} has been added successfully.`,
      });
    }
    setIsOpen(false);
    setEditingDoctor(null);
    form.reset();
  };

  const columns = [
    {
      header: "First Name",
      accessorKey: "first_name" as keyof Doctor,
    },
    {
      header: "Last Name",
      accessorKey: "last_name" as keyof Doctor,
    },
    {
      header: "Specialty",
      accessorKey: "specialty" as keyof Doctor,
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof Doctor,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof Doctor,
    },
  ];

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Manage doctor information"
        actions={
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingDoctor(null);
                  form.reset({
                    first_name: "",
                    last_name: "",
                    specialty: "",
                    phone: "",
                    email: "",
                  });
                }}
              >
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
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

                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty</FormLabel>
                        <FormControl>
                          <Input placeholder="Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@humatrack.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingDoctor ? "Update" : "Save"}
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
          data={doctors}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default Doctors;
