import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Download } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'billing', label: 'Billing' }
  ];
  
  const handleSaveChanges = () => {
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
        <p className="text-[var(--text-secondary)] mt-1">Manage your account and preferences</p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-2xl border-2 border-[var(--border-color)] overflow-hidden shadow-xl">
        <div className="border-b border-[var(--border-color)] flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2 sm:px-6 py-4 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500/5 text-blue-600 border-b-2 border-blue-600'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--muted-background)]'
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
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold flex-shrink-0">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] text-center sm:text-left">{user?.name}</h3>
                  <p className="text-[var(--text-secondary)] text-center sm:text-left">{user?.email}</p>
                  <div className="text-center sm:text-left">
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Change Avatar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Date of Birth</label>
                  <input
                    type="date"
                    defaultValue={user?.dateOfBirth}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Blood Type</label>
                  <select
                    defaultValue={user?.bloodType}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  >
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleSaveChanges}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg">
                Save Changes
              </button>
            </div>
          )}
          
          {activeTab === 'security' && (
             <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Wallet Address</h3>
                <div className="bg-[var(--muted-background)] rounded-lg p-4 font-mono text-sm text-[var(--text-secondary)] break-all">
                  {user?.id}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-[var(--muted-background)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">2FA Enabled</p>
                    <p className="text-sm text-[var(--text-secondary)]">Extra security for your account</p>
                  </div>
                  <span className="text-green-600 font-medium text-sm">Active</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Backup & Recovery</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-yellow-400/10 border border-yellow-500/20 rounded-lg">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Backup Phrase</p>
                      <p className="text-sm text-[var(--text-secondary)]">Save your recovery phrase securely</p>
                    </div>
                    <button className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm flex-shrink-0">
                      View Phrase
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-[var(--muted-background)] rounded-lg">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Social Recovery</p>
                      <p className="text-sm text-[var(--text-secondary)]">3 of 5 trusted contacts can recover access</p>
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-[var(--muted-background)] rounded-lg">
                    <div className="w-full sm:w-auto">
                      <p className="font-medium text-[var(--text-primary)]">Research Data Marketplace</p>
                      <p className="text-sm text-[var(--text-secondary)]">Share anonymized data with researchers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 self-end sm:self-center">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-[var(--border-color)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Delete Account</h3>
                <p className="text-sm text-red-800 dark:text-red-300 mb-4">
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
              <div className="bg-blue-500/5 rounded-xl p-6 border border-blue-500/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)]">Current Plan: Plus</h3>
                    <p className="text-[var(--text-secondary)]">$9.99/month • Billed monthly</p>
                  </div>
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Active</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold">
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
                    <div key={idx} className="flex flex-wrap items-center justify-between gap-2 p-4 bg-[var(--muted-background)] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-[var(--text-secondary)] text-sm">{invoice.date}</span>
                        <span className="font-medium text-[var(--text-primary)]">{invoice.amount}</span>
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