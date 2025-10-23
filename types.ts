import type { Dispatch, SetStateAction } from 'react';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  medications: Medication[];
  tier: string;
}

export interface Document {
  id:string;
  name: string;
  type: string;
  category: string;
  uploadedAt: number;
  size: string;
  ipfsHash: string;
  encrypted: boolean;
}

export interface AccessRequest {
  id: string;
  provider: string;
  institution: string;
  reason: string;
  requestedDuration: string;
  dataCategories: string[];
  timestamp: number;
  status: 'pending' | 'approved' | 'denied';
}

export interface ActiveAccess {
  id: string;
  provider: string;
  institution: string;
  grantedAt: number;
  expiresAt: number;
  dataCategories: string[];
  accessCount: number;
}

export interface AuditLog {
  id: string;
  eventType: string;
  actor: string;
  resource: string;
  timestamp: number;
  location: string;
}

export interface Notification {
  id: string;
  type: 'ACCESS_REQUEST' | 'ACCESS_EXPIRING' | 'GENERAL';
  message: string;
  timestamp: number;
  isRead: boolean;
  linkTo: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AppContextType {
  currentView: string;
  setCurrentView: Dispatch<SetStateAction<string>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  documents: Document[];
  setDocuments: Dispatch<SetStateAction<Document[]>>;
  accessRequests: AccessRequest[];
  setAccessRequests: Dispatch<SetStateAction<AccessRequest[]>>;
  activeAccess: ActiveAccess[];
  setActiveAccess: Dispatch<SetStateAction<ActiveAccess[]>>;
  auditLog: AuditLog[];
  setAuditLog: Dispatch<SetStateAction<AuditLog[]>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  selectedDocument: Document | null;
  setSelectedDocument: Dispatch<SetStateAction<Document | null>>;
  showUploadModal: boolean;
  setShowUploadModal: Dispatch<SetStateAction<boolean>>;
  showQRModal: boolean;
  setShowQRModal: Dispatch<SetStateAction<boolean>>;
  showDocumentViewModal: boolean;
  setShowDocumentViewModal: Dispatch<SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  showNotificationsPanel: boolean;
  setShowNotificationsPanel: Dispatch<SetStateAction<boolean>>;
  addToast: (message: string, type: Toast['type']) => void;
  toasts: Toast[];
  removeToast: (id: number) => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  showConnectModal: boolean;
  setShowConnectModal: Dispatch<SetStateAction<boolean>>;
}
