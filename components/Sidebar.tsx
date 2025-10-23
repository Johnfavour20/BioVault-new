import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, FileText, Users, Shield, AlertTriangle, Settings, LogOut, LucideIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', icon: Activity, label: 'Dashboard' },
  { id: 'documents', icon: FileText, label: 'My Documents' },
  { id: 'access', icon: Users, label: 'Access Control' },
  { id: 'audit', icon: Shield, label: 'Audit Trail' },
  { id: 'emergency', icon: AlertTriangle, label: 'Emergency Access' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen } = useApp();
  
  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full pt-16">
        <nav className="p-4 space-y-2 flex-grow overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Disconnect</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;