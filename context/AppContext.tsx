import React, { useState, createContext, useContext, ReactNode } from 'react';
import type { AppContextType, User, Document, AccessRequest, ActiveAccess, AuditLog } from '../types';
import { mockUser, mockDocuments, mockAccessRequests, mockActiveAccess, mockAuditLog } from '../constants';

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
  const [notifications, setNotifications] = useState(2);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // This effect simulates connecting to a wallet and fetching initial user data.
  // In a real app, this would be an async call to a wallet connector.
  React.useEffect(() => {
     if (user) {
        // user is already "connected"
        return;
     }
    // Simulate wallet connection after a short delay
    const timer = setTimeout(() => {
        setUser(mockUser);
        setNotifications(mockAccessRequests.length);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    isSidebarOpen,
    setIsSidebarOpen
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};