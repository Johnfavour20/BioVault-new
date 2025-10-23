
import React, { useState, createContext, useContext, ReactNode, useCallback } from 'react';
import type { AppContextType, User, HealthRecord, AccessRequest, ActiveAccess, AuditLog, Notification, Toast } from '../types';
import { mockUser, mockHealthRecords, mockAccessRequests, mockActiveAccess, mockAuditLog, mockNotifications } from '../constants';

const AppContext = createContext<AppContextType | null>(null);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(mockHealthRecords);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(mockAccessRequests);
  const [activeAccess, setActiveAccess] = useState<ActiveAccess[]>(mockActiveAccess);
  const [auditLog, setAuditLog] = useState<AuditLog[]>(mockAuditLog);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState<HealthRecord | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showHealthRecordViewModal, setShowHealthRecordViewModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  React.useEffect(() => {
     if (user) {
        setIsLoading(false);
        return;
     }
     // For initial load without a user, stop loading to show landing page.
     const timer = setTimeout(() => {
        setIsLoading(false);
     }, 1500); 
    return () => clearTimeout(timer);
  }, [user]);

  const value: AppContextType = {
    currentView,
    setCurrentView,
    user,
    setUser,
    healthRecords,
    setHealthRecords,
    accessRequests,
    setAccessRequests,
    activeAccess,
    setActiveAccess,
    auditLog,
    setAuditLog,
    notifications,
    setNotifications,
    selectedHealthRecord,
    setSelectedHealthRecord,
    showUploadModal,
    setShowUploadModal,
    showQRModal,
    setShowQRModal,
    showHealthRecordViewModal,
    setShowHealthRecordViewModal,
    isSidebarOpen,
    setIsSidebarOpen,
    showNotificationsPanel,
    setShowNotificationsPanel,
    addToast,
    toasts,
    removeToast,
    isLoading,
    setIsLoading,
    showConnectModal,
    setShowConnectModal,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
