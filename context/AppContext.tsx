import React, { useState, createContext, useContext, ReactNode, useCallback } from 'react';
import type { AppContextType, User, Document, AccessRequest, ActiveAccess, AuditLog, Notification, Toast } from '../types';
import { mockUser, mockDocuments, mockAccessRequests, mockActiveAccess, mockAuditLog, mockNotifications } from '../constants';

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
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(mockAccessRequests);
  const [activeAccess, setActiveAccess] = useState<ActiveAccess[]>(mockActiveAccess);
  const [auditLog, setAuditLog] = useState<AuditLog[]>(mockAuditLog);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDocumentViewModal, setShowDocumentViewModal] = useState(false);
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
    const timer = setTimeout(() => {
        setUser(mockUser);
        setIsLoading(false);
    }, 1500); // Increased to better showcase skeleton loader
    return () => clearTimeout(timer);
  }, [user]);

  const value: AppContextType = {
    currentView,
    setCurrentView,
    user,
    setUser,
    documents,
    setDocuments,
    accessRequests,
    setAccessRequests,
    activeAccess,
    setActiveAccess,
    auditLog,
    setAuditLog,
    notifications,
    setNotifications,
    selectedDocument,
    setSelectedDocument,
    showUploadModal,
    setShowUploadModal,
    showQRModal,
    setShowQRModal,
    showDocumentViewModal,
    setShowDocumentViewModal,
    isSidebarOpen,
    setIsSidebarOpen,
    showNotificationsPanel,
    setShowNotificationsPanel,
    addToast,
    toasts,
    removeToast,
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};