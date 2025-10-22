import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Upload, QrCode, Bell, FileText, Users, Clock, Activity, Pill, ChevronRight, Lock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, documents, accessRequests, setCurrentView, setShowUploadModal, setShowQRModal } = useApp();
  
  const stats = [
    { label: 'Total Documents', value: documents.length, icon: FileText, color: 'blue' },
    { label: 'Active Access', value: 1, icon: Users, color: 'green' },
    { label: 'Pending Requests', value: accessRequests.length, icon: Clock, color: 'yellow' },
    { label: 'Total Access Events', value: 47, icon: Activity, color: 'purple' }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, {user?.name.split(' ')[0]}! 👋</h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your health data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left"
        >
          <Upload className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Upload Document</h3>
          <p className="text-blue-100 text-sm">Add new medical records</p>
        </button>
        
        <button
          onClick={() => setShowQRModal(true)}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left"
        >
          <QrCode className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Show QR Code</h3>
          <p className="text-purple-100 text-sm">For provider access</p>
        </button>
        
        <button
          onClick={() => setCurrentView('access')}
          className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-all text-left"
        >
          <Bell className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Access Requests</h3>
          <p className="text-pink-100 text-sm">{accessRequests.length} pending</p>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600'
          };
          
          return (
            <div key={idx} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <div className={`w-12 h-12 ${colors[stat.color]} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Health Profile</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Blood Type</span>
              <span className="font-medium text-gray-900">{user?.bloodType}</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Allergies</span>
              <div className="text-right">
                {user?.allergies.map((allergy, idx) => (
                  <span key={idx} className="block text-sm font-medium text-red-600">{allergy}</span>
                ))}
              </div>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="text-gray-600">Conditions</span>
              <div className="text-right">
                {user?.chronicConditions.map((condition, idx) => (
                  <span key={idx} className="block text-sm font-medium text-gray-900">{condition}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Current Medications</h3>
          <div className="space-y-3">
            {user?.medications.map((med, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{med.name}</p>
                  <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Documents</h3>
          <button
            onClick={() => setCurrentView('documents')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-3">
          {documents.slice(0, 3).map(doc => (
            <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.category} • {formatDate(doc.uploadedAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
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