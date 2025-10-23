import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatTimeLeft } from '../utils';
import { CheckCircle, XCircle, Users } from 'lucide-react';

const AccessManagement: React.FC = () => {
  const { accessRequests, setAccessRequests, activeAccess, setActiveAccess } = useApp();
  
  const handleApprove = (requestId: string) => {
    const request = accessRequests.find(r => r.id === requestId);
    if (request) {
      setActiveAccess(prev => [...prev, {
        id: `grant_${Date.now()}`,
        provider: request.provider,
        institution: request.institution,
        grantedAt: Date.now(),
        expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000, // 48 hours
        dataCategories: request.dataCategories,
        accessCount: 0
      }]);
      setAccessRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };
  
  const handleDeny = (requestId: string) => {
    setAccessRequests(prev => prev.filter(r => r.id !== requestId));
  };
  
  const handleRevoke = (grantId: string) => {
    setActiveAccess(prev => prev.filter(g => g.id !== grantId));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Access Control</h2>
        <p className="text-gray-600 mt-1">Manage who can view your medical records</p>
      </div>
      
      {accessRequests.length > 0 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Pending Requests ({accessRequests.length})</h3>
            <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              Action Required
            </span>
          </div>
          
          <div className="space-y-4">
            {accessRequests.map(request => (
              <div key={request.id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {request.provider.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.provider}</h4>
                      <p className="text-sm text-gray-600">{request.institution}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(request.timestamp)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Reason for Access</p>
                      <p className="text-sm font-medium text-gray-900">{request.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Requested Duration</p>
                      <p className="text-sm font-medium text-gray-900">{request.requestedDuration}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Requested Data Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {request.dataCategories.map((category, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Access
                  </button>
                  <button
                    onClick={() => handleDeny(request.id)}
                    className="w-full sm:w-auto flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h3 className="font-semibold text-lg mb-6">Active Access ({activeAccess.length})</h3>
        
        {activeAccess.length > 0 ? (
          <div className="space-y-4">
            {activeAccess.map(grant => (
              <div key={grant.id} className="border border-gray-200 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {grant.provider.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{grant.provider}</h4>
                      <p className="text-sm text-gray-600">{grant.institution}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ✓ Active • {grant.accessCount} access events
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full self-start sm:self-center">
                    {formatTimeLeft(grant.expiresAt)}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Granted</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(grant.grantedAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Expires</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(grant.expiresAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Access to</p>
                    <div className="flex flex-wrap gap-2">
                      {grant.dataCategories.map((category, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Time remaining</span>
                      <span>{Math.round((grant.expiresAt - Date.now()) / (1000 * 60 * 60))} hours</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, ((grant.expiresAt - grant.grantedAt) - (Date.now() - grant.grantedAt)) / (grant.expiresAt - grant.grantedAt) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    View Activity
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                    Extend Access
                  </button>
                  <button
                    onClick={() => handleRevoke(grant.id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Access</h4>
            <p className="text-gray-600">No providers currently have access to your records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessManagement;