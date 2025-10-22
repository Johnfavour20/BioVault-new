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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Audit Trail</h2>
          <p className="text-gray-600 mt-1">Complete history of all access to your records</p>
        </div>
        <button className="bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center self-start sm:self-auto">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit log..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <select className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Events</option>
              <option>Access Events</option>
              <option>Document Events</option>
              <option>Emergency Events</option>
            </select>
            <button className="bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-4">
            {auditLog.map((entry) => {
              const Icon = getEventIcon(entry.eventType);
              const color = getEventColor(entry.eventType);
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                red: 'bg-red-100 text-red-600',
                orange: 'bg-orange-100 text-orange-600',
                gray: 'bg-gray-100 text-gray-600'
              };
              
              return (
                <div key={entry.id} className="flex items-start space-x-4 p-2 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors relative">
                  <div className={`z-10 w-10 h-10 ${colorClasses[color]} rounded-full border-4 border-white flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                      <div>
                        <p className="font-medium text-gray-900">{entry.eventType.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-600 mt-1">
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
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Blockchain Verified</h3>
            <p className="text-sm text-gray-600 mb-3">
              All audit log entries are stored immutably on the blockchain, ensuring complete transparency and tamper-proof records.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-xs text-gray-600">Latest Block: #12,456,789</span>
              <span className="text-xs text-gray-600 hidden sm:inline">•</span>
              <span className="text-xs text-gray-600">Last Verified: 2 min ago</span>
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