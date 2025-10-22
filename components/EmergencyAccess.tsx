import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, QrCode, Shield, CheckCircle, XCircle } from 'lucide-react';

const EmergencyAccess: React.FC = () => {
  const { user, setShowQRModal } = useApp();
  const [emergencyPack, setEmergencyPack] = useState({
    bloodType: true,
    allergies: true,
    medications: true,
    conditions: true,
    emergencyContacts: true,
    recentSurgeries: false
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Emergency Access</h2>
        <p className="text-gray-600 mt-1">Configure what emergency responders can access</p>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Critical Information Access</h3>
            <p className="text-sm text-red-700">
              Emergency responders with verified credentials can access your emergency data pack without your explicit permission in life-threatening situations. This access is always logged and you'll be notified when possible.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Emergency QR Code</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 sm:p-8 text-center border-2 border-dashed border-red-300">
              <div className="max-w-[12rem] sm:max-w-[12rem] bg-white rounded-lg mx-auto mb-4 flex items-center justify-center aspect-square">
                <QrCode className="w-full h-full text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan for emergency medical information
              </p>
              <button
                onClick={() => setShowQRModal(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                View Full QR Code
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 How to Use</h4>
              <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                <li>Add QR code to phone lock screen widget</li>
                <li>Print and carry in wallet</li>
                <li>Engrave on medical alert bracelet</li>
                <li>Save to Apple Wallet</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Verified Access Only</h4>
              <p className="text-sm text-green-800">
                Only emergency responders with verified credentials (EMTs, paramedics, ER doctors) can access your emergency pack.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Emergency Data Pack</h3>
        <p className="text-sm text-gray-600 mb-6">
          Select what information emergency responders can access
        </p>
        
        <div className="space-y-3">
          {Object.entries(emergencyPack).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${value ? 'bg-green-100' : 'bg-gray-200'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {value ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-xs text-gray-600">
                    {key === 'bloodType' && `Your blood type: ${user?.bloodType}`}
                    {key === 'allergies' && `${user?.allergies.length} allergies listed`}
                    {key === 'medications' && `${user?.medications.length} current medications`}
                    {key === 'conditions' && `${user?.chronicConditions.length} chronic conditions`}
                    {key === 'emergencyContacts' && 'Primary and secondary contacts'}
                    {key === 'recentSurgeries' && 'Surgeries in last 6 months'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmergencyPack(prev => ({ ...prev, [key]: !value }))}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  value
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {value ? 'Included' : 'Excluded'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Recommendation:</strong> Include blood type and allergies at minimum. This critical information can save your life in emergency situations.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Emergency Access History</h3>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Access</h4>
          <p className="text-gray-600">Your emergency pack has never been accessed</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccess;