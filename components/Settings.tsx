import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Download } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'billing', label: 'Billing' }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 sm:px-6 py-4 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-4 sm:p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold flex-shrink-0">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 text-center sm:text-left">{user?.name}</h3>
                  <p className="text-gray-600 text-center sm:text-left">{user?.email}</p>
                  <div className="text-center sm:text-left">
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Change Avatar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    defaultValue={user?.dateOfBirth}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                  <select
                    defaultValue={user?.bloodType}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                  </select>
                </div>
              </div>
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Save Changes
              </button>
            </div>
          )}
          
          {activeTab === 'security' && (
             <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Wallet Address</h3>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 break-all">
                  {user?.id}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">2FA Enabled</p>
                    <p className="text-sm text-gray-600">Extra security for your account</p>
                  </div>
                  <span className="text-green-600 font-medium text-sm">Active</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Backup & Recovery</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Backup Phrase</p>
                      <p className="text-sm text-gray-600">Save your recovery phrase securely</p>
                    </div>
                    <button className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm flex-shrink-0">
                      View Phrase
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Social Recovery</p>
                      <p className="text-sm text-gray-600">3 of 5 trusted contacts can recover access</p>
                    </div>
                    <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex-shrink-0">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'privacy' && (
             <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Data Sharing</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-gray-50 rounded-lg">
                    <div className="w-full sm:w-auto">
                      <p className="font-medium text-gray-900">Research Data Marketplace</p>
                      <p className="text-sm text-gray-600">Share anonymized data with researchers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 self-end sm:self-center">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                <p className="text-sm text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Delete My Account
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Current Plan: Plus</h3>
                    <p className="text-gray-600">$9.99/month • Billed monthly</p>
                  </div>
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Active</span>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold">
                  Upgrade to Premium
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Billing History</h3>
                <div className="space-y-2">
                  {[
                    { date: 'Oct 22, 2025', amount: '$9.99', status: 'Paid' },
                    { date: 'Sep 22, 2025', amount: '$9.99', status: 'Paid' },
                  ].map((invoice, idx) => (
                    <div key={idx} className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600 text-sm">{invoice.date}</span>
                        <span className="font-medium text-gray-900">{invoice.amount}</span>
                        <span className="text-green-600 text-sm font-medium">{invoice.status}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;