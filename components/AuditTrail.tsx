
import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Download, Search, Calendar, Shield, Eye, CheckCircle, Upload, XCircle, AlertTriangle, Activity, LucideIcon } from 'lucide-react';

const AuditTrail: React.FC = () => {
  const { auditLog } = useApp();
  
  const getEventIcon = (eventType: string): LucideIcon => {
    switch (eventType) {
      case 'DOCUMENT_VIEWED': return Eye;
      case 'ACCESS_APPROVED': return CheckCircle;
      case 'DOCUMENT_UPLOADED': return Upload;
      case 'ACCESS_DENIED': return XCircle;
      case 'ACCESS_REVOKED': return AlertTriangle;
      default: return Activity;
    }
  };
  
  const getEventColor = (eventType: string): string => {
    switch (eventType) {
      case 'DOCUMENT_VIEWED': return 'blue';
      case 'ACCESS_APPROVED': return 'green';
      case 'DOCUMENT_UPLOADED': return 'purple';
      case 'ACCESS_DENIED': return 'red';
      case 'ACCESS_REVOKED': return 'orange';
      default: return 'gray';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Audit Trail</h2>
          <p className="text-[var(--text-secondary)] mt-1">Complete history of all access to your records</p>
        </div>
        <button className="bg-[var(--card-background)] border border-[var(--border-color)] px-6 py-2 rounded-lg hover:bg-[var(--muted-background)] transition-colors font-medium flex items-center self-start sm:self-auto">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-xl p-4 sm:p-6 border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit log..."
              className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
            />
          </div>
          <div className="flex items-center gap-4">
            <select className="flex-1 w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]">
              <option>All Events</option>
              <option>Access Events</option>
              <option>Record Events</option>
              <option>Emergency Events</option>
            </select>
            <button className="bg-[var(--muted-background)] p-2 rounded-lg hover:bg-[var(--border-color)] transition-colors">
              <Calendar className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[var(--border-color)]"></div>
          <div className="space-y-4">
            {auditLog.map((entry) => {
              const Icon = getEventIcon(entry.eventType);
              const color = getEventColor(entry.eventType);
              const colorClasses = {
                blue: 'bg-blue-500/10 text-blue-600',
                green: 'bg-green-500/10 text-green-600',
                purple: 'bg-purple-500/10 text-purple-600',
                red: 'bg-red-500/10 text-red-600',
                orange: 'bg-orange-500/10 text-orange-600',
                gray: 'bg-gray-500/10 text-gray-500'
              };
              
              return (
                <div key={entry.id} className="flex items-start space-x-4 p-2 sm:p-4 hover:bg-[var(--muted-background)] rounded-lg transition-colors relative">
                  <div className={`z-10 w-10 h-10 ${colorClasses[color]} rounded-full border-4 border-[var(--card-background)] flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{entry.eventType.replace(/_/g, ' ').replace('DOCUMENT', 'RECORD')}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                          <span className="font-medium">{entry.actor}</span> • {entry.resource}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 sm:mt-0">{formatDate(entry.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center">
                        📍 {entry.location}
                      </span>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Load More Events
          </button>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl p-6 border border-blue-500/10">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-[var(--primary-foreground)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Blockchain Verified</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              All audit log entries are stored immutably on the blockchain, ensuring complete transparency and tamper-proof records.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-xs text-[var(--text-secondary)]">Latest Block: #12,456,789</span>
              <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">•</span>
              <span className="text-xs text-[var(--text-secondary)]">Last Verified: 2 min ago</span>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                View on Explorer →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
