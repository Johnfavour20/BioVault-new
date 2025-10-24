
import React, { useState, createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { AppContextType, User, HealthRecord, AccessRequest, ActiveAccess, AuditLog, Notification, Toast, QRModalState } from '../types';
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
  const [showQRModal, setShowQRModal] = useState<QRModalState>({ visible: false });
  const [showHealthRecordViewModal, setShowHealthRecordViewModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New state for provider upload modal
  const [showProviderUploadModal, setShowProviderUploadModal] = useState(false);
  const [providerUploadingFor, setProviderUploadingFor] = useState<ActiveAccess | null>(null);
  // New state for audit log filtering
  const [auditLogFilter, setAuditLogFilter] = useState<string | null>(null);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  
  // Effect to listen for emergency access events from the public portal
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'biovault_emergency_access' && event.newValue) {
        try {
          const accessEvent = JSON.parse(event.newValue);
          const { actor, resource, location, timestamp } = accessEvent;

          // 1. Add to Audit Log
          const newAuditLog: AuditLog = {
            id: `audit_${timestamp}`,
            eventType: 'EMERGENCY_ACCESS_VIEWED',
            actor,
            resource,
            timestamp,
            location,
          };
          setAuditLog(prev => [newAuditLog, ...prev]);

          // 2. Add Notification
          const newNotification: Notification = {
            id: `notif_${timestamp}`,
            type: 'EMERGENCY_ACCESS_VIEWED',
            message: `CRITICAL: Your emergency data was accessed by ${actor}.`,
            timestamp,
            isRead: false,
            linkTo: 'audit',
          };
          setNotifications(prev => [newNotification, ...prev]);

          // 3. Show a toast
          addToast('EMERGENCY ALERT: Your data was just accessed!', 'error');

          // 4. Clean up
          localStorage.removeItem('biovault_emergency_access');

        } catch (e) {
          console.error("Error parsing emergency access event from localStorage", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [addToast]);


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
    showProviderUploadModal,
    setShowProviderUploadModal,
    providerUploadingFor,
    setProviderUploadingFor,
    auditLogFilter,
    setAuditLogFilter,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
