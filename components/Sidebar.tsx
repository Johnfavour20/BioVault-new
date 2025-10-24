import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, FileText, Users, Shield, AlertTriangle, Settings, LogOut, LucideIcon, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen, setUser, addToast } = useApp();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'ai_assistant', icon: Sparkles, label: 'AI Assistant' },
    { id: 'health_records', icon: FileText, label: 'Health Records' },
    { id: 'access', icon: Users, label: 'Access Control' },
    { id: 'audit', icon: Shield, label: 'Audit Trail' },
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency Access' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleNavigate = (viewId: string) => {
    setCurrentView(viewId);
    setIsSidebarOpen(false);
  };

  const handleDisconnect = () => {
    addToast('Successfully disconnected.', 'info');
    setTimeout(() => {
        setUser(null);
    }, 300);
  };

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-[var(--card-background)] border-r border-[var(--border-color)] z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full pt-16">
        <nav className="p-4 space-y-2 flex-grow overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all transform ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--muted-background)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="border-t border-[var(--border-color)]">
          <ThemeToggle />
        </div>
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <button 
            onClick={handleDisconnect}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Disconnect</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;