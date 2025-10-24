
import React from 'react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../context/LocaleContext';
import { Hash, Bell, Menu } from 'lucide-react';
import { mainMenuItems } from '../constants';

const Navbar: React.FC = () => {
  const { user, notifications, setShowNotificationsPanel, setIsSidebarOpen, currentView, setCurrentView } = useApp();
  const { t } = useLocale();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <nav className="bg-[var(--card-background)] border-b border-[var(--border-color)] fixed w-full z-20 top-0">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-[var(--text-secondary)] md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-[var(--primary-foreground)]" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">BioVault</h1>
                <p className="text-xs text-[var(--text-secondary)]">{user?.tier} Plan</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2 ml-8">
              {mainMenuItems.map(item => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--muted-background)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--muted-background)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {t(item.labelKey)}
                  </button>
                );
              })}
            </div>

          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setShowNotificationsPanel(prev => !prev)}
              className="relative p-2 text-[var(--text-secondary)] hover:bg-[var(--muted-background)] rounded-lg transition-colors"
              aria-label="Toggle Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-3 pl-2 sm:pl-4 sm:border-l border-[var(--border-color)]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{user?.id.slice(0, 10)}...</p>
                <div className="flex items-center justify-end mt-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  <p className="text-xs text-green-600 font-medium">BlockDAG Connected</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
