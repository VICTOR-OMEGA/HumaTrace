
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title,
  description,
  className,
  actions
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-6", className)}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
