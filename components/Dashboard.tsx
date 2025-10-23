
import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Upload, QrCode, Bell, FileText, Users, Clock, Activity, Pill, ChevronRight, Lock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, healthRecords, accessRequests, setCurrentView, setShowUploadModal, setShowQRModal } = useApp();
  
  const stats = [
    { label: 'Total Health Records', value: healthRecords.length, icon: FileText, color: 'blue' },
    { label: 'Active Access', value: 1, icon: Users, color: 'green' },
    { label: 'Pending Requests', value: accessRequests.length, icon: Clock, color: 'yellow' },
    { label: 'Total Access Events', value: 47, icon: Activity, color: 'sky' }
  ];
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Welcome back, {user?.name.split(' ')[0]}! 👋</h2>
        <p className="text-[var(--text-secondary)] mt-1">Here's what's happening with your health data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left"
        >
          <Upload className="w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Add Health Record</h3>
          <p className="text-blue-100 text-sm">Add new medical records</p>
        </button>
        
        <button
          onClick={() => setShowQRModal(true)}
          className="bg-[var(--card-background)] border-2 border-[var(--border-color)] p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left text-[var(--text-primary)]"
        >
          <QrCode className="w-10 h-10 mb-3 text-[var(--primary)]" />
          <h3 className="font-semibold text-lg mb-1">Show QR Code</h3>
          <p className="text-[var(--text-secondary)] text-sm">For provider access</p>
        </button>
        
        <button
          onClick={() => setCurrentView('access')}
          className="bg-[var(--card-background)] border-2 border-[var(--border-color)] p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left text-[var(--text-primary)] relative"
        >
          {accessRequests.length > 0 && <span className="absolute top-4 right-4 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>}
          {accessRequests.length > 0 && <span className="absolute top-4 right-4 h-3 w-3 rounded-full bg-red-500"></span>}
          <Bell className="w-10 h-10 mb-3 text-[var(--primary)]" />
          <h3 className="font-semibold text-lg mb-1">Access Requests</h3>
          <p className="text-[var(--text-secondary)] text-sm">{accessRequests.length} pending</p>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            yellow: 'from-yellow-500 to-yellow-600',
            sky: 'from-sky-500 to-sky-600'
          };
          
          return (
            <div key={idx} className={`bg-gradient-to-br ${colors[stat.color]} text-white rounded-2xl p-4 sm:p-6 shadow-lg hover:scale-105 transition-transform`}>
              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-90 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card-background)] rounded-2xl p-6 border-2 border-[var(--border-color)] shadow-xl">
          <h3 className="font-semibold text-lg mb-4">Health Profile</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]/50">
              <span className="text-[var(--text-secondary)]">Blood Type</span>
              <span className="font-medium text-[var(--text-primary)]">{user?.bloodType}</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-[var(--border-color)]/50">
              <span className="text-[var(--text-secondary)]">Allergies</span>
              <div className="text-right">
                {user?.allergies.map((allergy, idx) => (
                  <span key={idx} className="block text-sm font-medium text-red-600">{allergy}</span>
                ))}
              </div>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="text-[var(--text-secondary)]">Conditions</span>
              <div className="text-right">
                {user?.chronicConditions.map((condition, idx) => (
                  <span key={idx} className="block text-sm font-medium text-[var(--text-primary)]">{condition}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--card-background)] rounded-2xl p-6 border-2 border-[var(--border-color)] shadow-xl">
          <h3 className="font-semibold text-lg mb-4">Current Medications</h3>
          <div className="space-y-3">
            {user?.medications.map((med, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-[var(--muted-background)] rounded-lg">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">{med.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{med.dosage} - {med.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-2xl p-6 border-2 border-[var(--border-color)] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Health Records</h3>
          <button
            onClick={() => setCurrentView('health_records')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-3">
          {healthRecords.slice(0, 3).map(doc => (
            <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-[var(--muted-background)] rounded-lg transition-colors">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{doc.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{doc.category} • {formatDate(doc.uploadedAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full flex items-center">
                  <Lock className="w-3 h-3 mr-1" /> Encrypted
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
