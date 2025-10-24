
import type { Dispatch, SetStateAction } from 'react';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface User {
  id: string;
  emergencyId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  tier: string;
}

export interface HealthRecord {
  id:string;
  name: string;
  type: string;
  category: string;
  uploadedAt: number;
  size: string;
  ipfsHash: string;
  encrypted: boolean;
  uploadedBy?: string; // Optional field to track who uploaded the record
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
  type: 'ACCESS_REQUEST' | 'ACCESS_EXPIRING' | 'GENERAL' | 'DOCUMENT_UPLOADED' | 'EMERGENCY_ACCESS_VIEWED';
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

export interface QRModalState {
  visible: boolean;
  url?: string;
}

export interface AppContextType {
  currentView: string;
  setCurrentView: Dispatch<SetStateAction<string>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  healthRecords: HealthRecord[];
  setHealthRecords: Dispatch<SetStateAction<HealthRecord[]>>;
  accessRequests: AccessRequest[];
  setAccessRequests: Dispatch<SetStateAction<AccessRequest[]>>;
  activeAccess: ActiveAccess[];
  setActiveAccess: Dispatch<SetStateAction<ActiveAccess[]>>;
  auditLog: AuditLog[];
  setAuditLog: Dispatch<SetStateAction<AuditLog[]>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  selectedHealthRecord: HealthRecord | null;
  setSelectedHealthRecord: Dispatch<SetStateAction<HealthRecord | null>>;
  showUploadModal: boolean;
  setShowUploadModal: Dispatch<SetStateAction<boolean>>;
  showQRModal: QRModalState;
  setShowQRModal: Dispatch<SetStateAction<QRModalState>>;
  showHealthRecordViewModal: boolean;
  setShowHealthRecordViewModal: Dispatch<SetStateAction<boolean>>;
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
  // New state for provider upload flow
  showProviderUploadModal: boolean;
  setShowProviderUploadModal: Dispatch<SetStateAction<boolean>>;
  providerUploadingFor: ActiveAccess | null;
  setProviderUploadingFor: Dispatch<SetStateAction<ActiveAccess | null>>;
  // New state for audit trail filtering
  auditLogFilter: string | null;
  setAuditLogFilter: Dispatch<SetStateAction<string | null>>;
}
