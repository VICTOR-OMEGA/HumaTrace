
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
import { Issue } from '@/types/interfaces';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  severity: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Please select a severity level',
  }),
  created_at: z.date({
    required_error: 'Please select a date',
  }),
});

type FormData = z.infer<typeof formSchema>;

const Issues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      name: 'Acute Headache',
      severity: 'Medium',
      created_at: new Date(2023, 1, 15),
    },
    {
      id: '2',
      name: 'Respiratory Infection',
      severity: 'High',
      created_at: new Date(2023, 2, 10),
    },
  ]);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      severity: 'Low',
      created_at: new Date(),
    },
  });

  const onSubmit = (data: FormData) => {
    if (editingIssue) {
      // Update existing issue
      setIssues(issues.map(issue => 
        issue.id === editingIssue.id 
          ? { ...issue, ...data } 
          : issue
      ));
      toast({ title: "Issue updated successfully" });
    } else {
      // Add new issue
      const newIssue: Issue = {
        id: `${Date.now()}`,
        ...data
      };
      setIssues([...issues, newIssue]);
      toast({ title: "Issue added successfully" });
    }
    
    // Reset the form
    form.reset();
    setEditingIssue(null);
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    form.reset({
      name: issue.name,
      severity: issue.severity,
      created_at: issue.created_at,
    });
  };

  const handleDelete = (issue: Issue) => {
    setIssues(issues.filter(i => i.id !== issue.id));
    toast({ title: "Issue deleted", description: "The issue has been removed" });
  };

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { 
      header: 'Severity', 
      accessorKey: 'severity',
      cell: (row: { severity: string }) => (
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.severity === 'High' 
              ? 'bg-red-100 text-red-800' 
              : row.severity === 'Medium' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
          }`}
        >
          {row.severity}
        </span>
      )
    },
    { 
      header: 'Created At', 
      accessorKey: 'created_at',
      cell: (row: { created_at: Date }) => format(new Date(row.created_at), 'MMM d, yyyy')
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Issues Management" 
        description="Create and manage health issues in the system" 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingIssue ? 'Edit Issue' : 'Add New Issue'}</CardTitle>
            <CardDescription>
              {editingIssue ? 'Update issue details' : 'Fill the form to create a new issue'}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter issue name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="created_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created At</FormLabel>
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
                  setEditingIssue(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingIssue ? 'Update Issue' : 'Add Issue'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues List</CardTitle>
            <CardDescription>
              Manage existing issues in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={issues}
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

export default Issues;
