
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Test } from '@/types/interfaces';
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

const Tests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Test>();
  
  const onSubmit = (data: Partial<Test>) => {
    if (isEditing && currentTest) {
      const updatedTests = tests.map(test => 
        test.id === currentTest.id ? { ...currentTest, ...data } : test
      );
      setTests(updatedTests);
      toast.success("Test updated successfully");
    } else {
      const newTest: Test = {
        id: uuidv4(),
        name: data.name!,
        type: data.type!,
        description: data.description!
      };
      setTests([...tests, newTest]);
      toast.success("Test added successfully");
    }
    
    reset();
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentTest(null);
  };
  
  const handleEdit = (test: Test) => {
    setCurrentTest(test);
    setIsEditing(true);
    
    setValue("name", test.name);
    setValue("type", test.type);
    setValue("description", test.description);
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = (test: Test) => {
    const updatedTests = tests.filter(t => t.id !== test.id);
    setTests(updatedTests);
    toast.success("Test deleted successfully");
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
      setIsEditing(false);
      setCurrentTest(null);
    }
  };
  
  type TestRow = {
    id: string;
    name: string;
    type: string;
    description: string;
  };
  
  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof TestRow,
    },
    {
      header: "Type",
      accessorKey: "type" as keyof TestRow,
    },
    {
      header: "Description",
      accessorKey: "description" as keyof TestRow,
    }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tests" 
        description="Manage medical tests"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button>Add Test</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit" : "Add"} Test</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      {...register("name", { required: "Name is required" })}
                      placeholder="Test name"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Input 
                      id="type" 
                      {...register("type", { required: "Type is required" })}
                      placeholder="Test type"
                    />
                    {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      {...register("description", { required: "Description is required" })}
                      placeholder="Test description"
                      rows={3}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">{isEditing ? "Update" : "Add"} Test</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tests}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Tests;
