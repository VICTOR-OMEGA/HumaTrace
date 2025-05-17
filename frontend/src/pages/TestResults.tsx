
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { TestResult } from '@/types/interfaces';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const TestResults: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [takenAt, setTakenAt] = useState<Date | undefined>(new Date());
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TestResult>();
  
  const onSubmit = (data: Partial<TestResult>) => {
    if (isEditing && currentResult) {
      const updatedResults = testResults.map(result => 
        result.id === currentResult.id ? { 
          ...currentResult, 
          ...data, 
          taken_at: takenAt || new Date() 
        } : result
      );
      setTestResults(updatedResults);
      toast.success("Test result updated successfully");
    } else {
      const newResult: TestResult = {
        id: uuidv4(),
        test_id: data.test_id!,
        patient_id: data.patient_id!,
        result: data.result!,
        taken_at: takenAt || new Date()
      };
      setTestResults([...testResults, newResult]);
      toast.success("Test result added successfully");
    }
    
    reset();
    setTakenAt(new Date());
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentResult(null);
  };
  
  const handleEdit = (result: TestResult) => {
    setCurrentResult(result);
    setIsEditing(true);
    setTakenAt(result.taken_at);
    
    setValue("test_id", result.test_id);
    setValue("patient_id", result.patient_id);
    setValue("result", result.result);
    
    setIsDialogOpen(true);
  };
  
  const handleDelete = (result: TestResult) => {
    const updatedResults = testResults.filter(r => r.id !== result.id);
    setTestResults(updatedResults);
    toast.success("Test result deleted successfully");
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      reset();
      setIsEditing(false);
      setCurrentResult(null);
      setTakenAt(new Date());
    }
  };
  
  const columns = [
    {
      header: "Test ID",
      accessorKey: "test_id",
    },
    {
      header: "Patient ID",
      accessorKey: "patient_id",
    },
    {
      header: "Result",
      accessorKey: "result",
    },
    {
      header: "Taken At",
      accessorKey: "taken_at",
      cell: (row: { taken_at: Date }) => format(new Date(row.taken_at), 'PPP')
    }
  ];
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Test Results" 
        description="Manage patient test results"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button>Add Test Result</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit" : "Add"} Test Result</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="test_id">Test ID</Label>
                      <Input 
                        id="test_id" 
                        {...register("test_id", { required: "Test ID is required" })}
                        placeholder="Enter test ID"
                      />
                      {errors.test_id && <p className="text-sm text-red-500">{errors.test_id.message}</p>}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="patient_id">Patient ID</Label>
                      <Input 
                        id="patient_id" 
                        {...register("patient_id", { required: "Patient ID is required" })}
                        placeholder="Enter patient ID"
                      />
                      {errors.patient_id && <p className="text-sm text-red-500">{errors.patient_id.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="result">Result</Label>
                    <Textarea 
                      id="result" 
                      {...register("result", { required: "Result is required" })}
                      placeholder="Test result details"
                      rows={3}
                    />
                    {errors.result && <p className="text-sm text-red-500">{errors.result.message}</p>}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Taken At</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !takenAt && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {takenAt ? format(takenAt, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={takenAt}
                          onSelect={setTakenAt}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">{isEditing ? "Update" : "Add"} Test Result</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={testResults}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResults;
