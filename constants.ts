
import type { User, Document, AccessRequest, ActiveAccess, AuditLog } from './types';

export const mockUser: User = {
  id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  dateOfBirth: '1985-06-15',
  bloodType: 'B+',
  allergies: ['Penicillin', 'Latex', 'Shellfish'],
  chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
  medications: [
    { name: 'Metformin', dosage: '1000mg', frequency: '2x daily' },
    { name: 'Lisinopril', dosage: '10mg', frequency: '1x daily' }
  ],
  tier: 'Plus'
};

export const mockDocuments: Document[] = [
  {
    id: 'doc_001',
    name: 'Blood Test Results - Oct 2025',
    type: 'Lab Results',
    category: 'Blood Work',
    uploadedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    size: '2.3 MB',
    ipfsHash: 'QmX7Ym1FgB9vZj9x...',
    encrypted: true
  },
  {
    id: 'doc_002',
    name: 'Chest X-Ray',
    type: 'Imaging',
    category: 'X-Rays',
    uploadedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    size: '5.7 MB',
    ipfsHash: 'QmA9B2c3d4E5f...',
    encrypted: true
  },
  {
    id: 'doc_003',
    name: 'Annual Physical Summary',
    type: 'Visit Summary',
    category: 'Primary Care',
    uploadedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    size: '856 KB',
    ipfsHash: 'QmC7D8e9F0g1H...',
    encrypted: true
  }
];

export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'req_001',
    provider: 'Dr. Maria Rodriguez',
    institution: 'City General Hospital',
    reason: 'Routine follow-up appointment',
    requestedDuration: '48 hours',
    dataCategories: ['Lab Results', 'Medications', 'Visit History'],
    timestamp: Date.now() - 30 * 60 * 1000,
    status: 'pending'
  },
  {
    id: 'req_002',
    provider: 'Dr. James Chen',
    institution: 'Heart & Vascular Center',
    reason: 'Cardiology consultation',
    requestedDuration: '7 days',
    dataCategories: ['Imaging', 'Lab Results', 'Visit History'],
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    status: 'pending'
  }
];

export const mockActiveAccess: ActiveAccess[] = [
  {
    id: 'grant_001',
    provider: 'Dr. Emily Thompson',
    institution: 'Family Health Clinic',
    grantedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
    dataCategories: ['All Records'],
    accessCount: 3
  }
];

export const mockAuditLog: AuditLog[] = [
  {
    id: 'audit_001',
    eventType: 'DOCUMENT_VIEWED',
    actor: 'Dr. Emily Thompson',
    resource: 'Blood Test Results - Oct 2025',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    location: 'City General Hospital'
  },
  {
    id: 'audit_002',
    eventType: 'ACCESS_APPROVED',
    actor: 'You',
    resource: 'Dr. Emily Thompson - 7 day access',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    location: 'Your Device'
  },
  {
    id: 'audit_003',
    eventType: 'DOCUMENT_UPLOADED',
    actor: 'You',
    resource: 'Chest X-Ray',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    location: 'Your Device'
  }
];
