
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete 
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredData = searchTerm 
    ? data.filter(item => 
        Object.values(item).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search..." 
          className="pl-10 max-w-sm" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey.toString()}>
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id.toString()}>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.accessorKey.toString()}`}>
                      {column.cell 
                        ? column.cell(row) 
                        : row[column.accessorKey] as React.ReactNode}
                    </TableCell>
                  ))}
                  
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onEdit(row)}
                          >
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-50 hover:border-red-200"
                            onClick={() => onDelete(row)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
