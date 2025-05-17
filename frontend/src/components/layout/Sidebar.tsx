
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MenuIcon, 
  X, 
  Stethoscope, 
  AlertTriangle, 
  Pill, 
  Baby,
  Heart, 
  History,
  TestTube,
  ClockAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Doctors', href: '/doctors', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Sessions', href: '/sessions', icon: ClockAlert },
    { name: 'Diagnosis', href: '/diagnosis', icon: Stethoscope },
    { name: 'Issues', href: '/issues', icon: AlertTriangle },
    { name: 'Treatments', href: '/treatments', icon: Pill },
    { name: 'Birth Records', href: '/birth-records', icon: Baby },
    { name: 'Patient Vitals', href: '/patient-vitals', icon: Heart },
    { name: 'Medications', href: '/medications', icon: Pill },
    { name: 'Medication History', href: '/medication-history', icon: History },
    { name: 'Tests', href: '/tests', icon: TestTube },
    { name: 'Test Results', href: '/test-results', icon: TestTube },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-humatrack-600">HumaTrack</h1>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isCollapsed ? <MenuIcon size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <nav className="mt-5 px-2 flex-1">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                             (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center py-2 px-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-humatrack-50 text-humatrack-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-humatrack-500" : "text-gray-400 group-hover:text-gray-500"
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-humatrack-500 flex items-center justify-center text-white">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@humatrack.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
