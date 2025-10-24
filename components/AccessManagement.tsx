
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatTimeLeft } from '../utils';
import { CheckCircle, XCircle, Users, BellOff, Upload, Clock, Eye } from 'lucide-react';
import ConfirmationModal from './modals/ConfirmationModal';
import type { AccessRequest, ActiveAccess } from '../types';

type ConfirmationDetails = {
    action: 'approve' | 'deny';
    details: AccessRequest;
} | {
    action: 'revoke' | 'extend';
    details: ActiveAccess;
};

const AccessManagement: React.FC = () => {
  const { 
    accessRequests, setAccessRequests, activeAccess, setActiveAccess, addToast,
    setShowProviderUploadModal, setProviderUploadingFor, setCurrentView, setAuditLogFilter
  } = useApp();
  const [confirmation, setConfirmation] = useState<ConfirmationDetails | null>(null);
  const [processingItem, setProcessingItem] = useState<{ id: string; action: string } | null>(null);

  const handleApprove = (request: AccessRequest) => setConfirmation({ action: 'approve', details: request });
  const handleDeny = (request: AccessRequest) => setConfirmation({ action: 'deny', details: request });
  const handleRevoke = (grant: ActiveAccess) => setConfirmation({ action: 'revoke', details: grant });
  const handleExtendAccess = (grant: ActiveAccess) => setConfirmation({ action: 'extend', details: grant });
  
  const handleProviderUpload = (grant: ActiveAccess) => {
    setProviderUploadingFor(grant);
    setShowProviderUploadModal(true);
  };

  const handleViewActivity = (grant: ActiveAccess) => {
    setAuditLogFilter(grant.provider);
    setCurrentView('audit');
  };

  const executeConfirmation = () => {
    if (!confirmation) return;
    const { action, details } = confirmation;
    
    setProcessingItem({ id: details.id, action });
    setConfirmation(null);

    setTimeout(() => {
        if (action === 'approve') {
          const request = details as AccessRequest;
          setActiveAccess(prev => [...prev, {
            id: `grant_${Date.now()}`,
            provider: request.provider,
            institution: request.institution,
            grantedAt: Date.now(),
            expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000, // 48 hours for demo
            dataCategories: request.dataCategories,
            accessCount: 0
          }]);
          setAccessRequests(prev => prev.filter(r => r.id !== request.id));
          addToast(`Access approved for ${request.provider}.`, 'success');
        } else if (action === 'deny') {
          const request = details as AccessRequest;
          setAccessRequests(prev => prev.filter(r => r.id !== request.id));
          addToast(`Access denied for ${request.provider}.`, 'info');
        } else if (action === 'revoke') {
          const grant = details as ActiveAccess;
          setActiveAccess(prev => prev.filter(g => g.id !== grant.id));
          addToast(`Access revoked for ${grant.provider}.`, 'success');
        } else if (action === 'extend') {
          const grant = details as ActiveAccess;
          setActiveAccess(prev => prev.map(g => g.id === grant.id ? { ...g, expiresAt: g.expiresAt + 24 * 60 * 60 * 1000 } : g));
          addToast(`Access extended for ${grant.provider}.`, 'success');
        }
        setProcessingItem(null);
    }, 1500);
  };

  const getConfirmationMessage = () => {
    if (!confirmation) return '';
    const { action, details } = confirmation;

    switch (action) {
      case 'approve':
        return <p>Are you sure you want to grant access to <strong>{details.provider}</strong> for <strong>{(details as AccessRequest).requestedDuration}</strong>?</p>;
      case 'deny':
        return <p>Are you sure you want to deny the access request from <strong>{details.provider}</strong>?</p>;
      case 'revoke':
        return <p>Are you sure you want to revoke access for <strong>{details.provider}</strong>? This action cannot be undone.</p>;
      case 'extend':
        return <p>Are you sure you want to extend access for <strong>{details.provider}</strong> by 24 hours?</p>;
      default:
        return '';
    }
  };

  const getProcessingClass = (id: string, currentActions: string[]) => {
    if (processingItem?.id === id && currentActions.includes(processingItem.action)) {
      if (['approve', 'extend'].includes(processingItem.action)) return 'animate-approve-flash';
      if (['deny', 'revoke'].includes(processingItem.action)) return 'animate-deny-flash';
    }
    return '';
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        @keyframes approve-flash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3); }
        }
        .animate-approve-flash {
          animation: approve-flash 1.5s ease-out;
        }
        @keyframes deny-flash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
        }
        .animate-deny-flash {
          animation: deny-flash 1.5s ease-out;
        }
      `}</style>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Access Control</h2>
        <p className="text-[var(--text-secondary)] mt-1">Manage who can view your medical records</p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-2xl p-4 sm:p-6 border-2 border-[var(--border-color)] shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Pending Requests ({accessRequests.length})</h3>
          {accessRequests.length > 0 && (
            <span className="text-sm bg-yellow-400/10 text-yellow-600 px-3 py-1 rounded-full">
              Action Required
            </span>
          )}
        </div>
        
        {accessRequests.length > 0 ? (
          <div className="space-y-4">
            {accessRequests.map(request => (
              <div key={request.id} className={`border-2 border-red-500/30 bg-red-500/5 rounded-2xl p-4 sm:p-6 hover:border-blue-500/30 transition-colors shadow-lg ${getProcessingClass(request.id, ['approve', 'deny'])}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {request.provider.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{request.provider}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{request.institution}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(request.timestamp)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[var(--background)] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Reason for Access</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{request.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Requested Duration</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{request.requestedDuration}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-[var(--text-secondary)] mb-2">Requested Data Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {request.dataCategories.map((category, idx) => (
                        <span key={idx} className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleApprove(request)}
                    disabled={!!processingItem}
                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Access
                  </button>
                  <button
                    onClick={() => handleDeny(request)}
                    disabled={!!processingItem}
                    className="w-full sm:w-auto flex-1 bg-[var(--muted-background)] text-[var(--text-secondary)] py-3 rounded-lg hover:bg-[var(--border-color)] transition-colors font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-[var(--border-color)] rounded-xl">
            <BellOff className="w-16 h-16 text-gray-400/50 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">All Caught Up!</h4>
            <p className="text-[var(--text-secondary)]">You have no pending access requests</p>
          </div>
        )}
      </div>
      
      <div className="bg-[var(--card-background)] rounded-2xl p-4 sm:p-6 border-2 border-[var(--border-color)] shadow-xl">
        <h3 className="font-semibold text-lg mb-6">Active Access ({activeAccess.length})</h3>
        
        {activeAccess.length > 0 ? (
          <div className="space-y-4">
            {activeAccess.map(grant => (
              <div key={grant.id} className={`border-2 border-[var(--border-color)] rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow ${getProcessingClass(grant.id, ['revoke', 'extend'])}`}>
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {grant.provider.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{grant.provider}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{grant.institution}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ✓ Active • {grant.accessCount} access events
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-700 px-3 py-1 rounded-full self-start sm:self-center">
                    {formatTimeLeft(grant.expiresAt)}
                  </span>
                </div>
                
                <div className="bg-[var(--muted-background)] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Granted</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{formatDate(grant.grantedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-1">Expires</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{new Date(grant.expiresAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">Access to</p>
                    <div className="flex flex-wrap gap-2">
                      {grant.dataCategories.map((category, idx) => (
                        <span key={idx} className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                      <span>Time remaining</span>
                    </div>
                    <div className="w-full bg-[var(--border-color)] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, ((grant.expiresAt - Date.now()) / (grant.expiresAt - grant.grantedAt)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => handleProviderUpload(grant)} disabled={!!processingItem} className="flex-1 bg-purple-500/10 text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-500/20 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <Upload className="w-4 h-4 mr-2" /> Simulate Upload
                  </button>
                  <button onClick={() => handleViewActivity(grant)} disabled={!!processingItem} className="flex-1 bg-blue-500/10 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-2" /> View Activity
                  </button>
                  <button onClick={() => handleExtendAccess(grant)} disabled={!!processingItem} className="flex-1 bg-[var(--muted-background)] text-[var(--text-secondary)] py-2 px-3 rounded-lg hover:bg-[var(--border-color)] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2" /> Extend Access
                  </button>
                  <button
                    onClick={() => handleRevoke(grant)}
                    disabled={!!processingItem}
                    className="bg-red-500/10 text-red-600 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400/50 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Active Access</h4>
            <p className="text-[var(--text-secondary)]">No providers currently have access to your records</p>
          </div>
        )}
      </div>

      {confirmation && (
        <ConfirmationModal
          isOpen={!!confirmation}
          onClose={() => setConfirmation(null)}
          onConfirm={executeConfirmation}
          title={
            confirmation.action === 'approve' ? 'Approve Access Request?' :
            confirmation.action === 'deny' ? 'Deny Access Request?' :
            confirmation.action === 'extend' ? 'Extend Access?' :
            'Revoke Access?'
          }
          message={getConfirmationMessage()}
          confirmText={
             confirmation.action === 'approve' ? 'Yes, Approve' :
             confirmation.action === 'deny' ? 'Yes, Deny' :
             confirmation.action === 'extend' ? 'Yes, Extend' :
             'Yes, Revoke'
          }
          confirmVariant={['approve', 'extend'].includes(confirmation.action) ? 'primary' : 'destructive'}
        />
      )}
    </div>
  );
};

export default AccessManagement;
