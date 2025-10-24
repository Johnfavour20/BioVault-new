import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Download } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
    bloodType: user?.bloodType || 'B+'
  });
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [shareData, setShareData] = useState(false);
  const [dataResidency, setDataResidency] = useState('global');


  useEffect(() => {
    if (!user) return;
    const initialProfile = {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      bloodType: user.bloodType
    };
    const changes = JSON.stringify(profileData) !== JSON.stringify(initialProfile);
    setHasProfileChanges(changes);
  }, [profileData, user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveChanges = () => {
    addToast('Profile updated successfully!', 'success');
    setHasProfileChanges(false);
  };

  const handleDataSharingToggle = () => {
    const newShareData = !shareData;
    setShareData(newShareData);
    addToast(
      `Research data sharing ${newShareData ? 'enabled' : 'disabled'}.`,
      'info'
    );
  };
  
  const handleExport = () => {
    addToast('Data export request received. It will be sent to your email.', 'success');
  }

  const handleResidencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDataResidency(e.target.value);
      addToast(`Data residency preference updated to ${e.target.options[e.target.selectedIndex].text}`, 'info');
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
        <p className="text-[var(--text-secondary)] mt-1">Manage your account and preferences</p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-2xl border-2 border-[var(--border-color)] overflow-hidden shadow-xl">
        <div className="border-b border-[var(--border-color)] flex">
          {['profile', 'security', 'privacy', 'billing', 'compliance'].map(tabId => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex-1 px-2 sm:px-6 py-4 font-medium transition-colors text-sm sm:text-base whitespace-nowrap capitalize ${
                activeTab === tabId
                  ? 'bg-blue-500/5 text-blue-600 border-b-2 border-blue-600'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--muted-background)]'
              }`}
            >
              {tabId}
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
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Blood Type</label>
                   <select
                    name="bloodType"
                    value={profileData.bloodType}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Security Settings</h3>
              <p className="text-[var(--text-secondary)]">Manage 2FA, connected devices, and more.</p>
            </div>
          )}
          
          {activeTab === 'privacy' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[var(--muted-background)] rounded-lg">
                    <div>
                        <h4 className="font-medium text-[var(--text-primary)]">Share Anonymized Data for Research</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Help advance medical research by sharing non-identifiable data.</p>
                    </div>
                    <button
                        onClick={handleDataSharingToggle}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${shareData ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${shareData ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
             </div>
          )}

          {activeTab === 'billing' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Billing Information</h3>
              <p className="text-[var(--text-secondary)]">Manage your BioVault subscription and payment methods.</p>
            </div>
          )}
          
          {activeTab === 'compliance' && (
             <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">Data Residency</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">Select the geographical region where your encrypted data pointers are stored. This helps comply with local data protection regulations.</p>
                  <select
                    value={dataResidency}
                    onChange={handleResidencyChange}
                    className="w-full md:w-1/2 px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
                  >
                    <option value="global">Global (Default)</option>
                    <option value="us">United States (US)</option>
                    <option value="eu">European Union (EU)</option>
                  </select>
                </div>
                <div className="border-t border-[var(--border-color)] pt-6">
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">Data Export</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">Request a complete export of all your data and metadata stored on BioVault.</p>
                  <button
                    onClick={handleExport}
                    className="bg-[var(--card-background)] border border-[var(--border-color)] px-6 py-2 rounded-lg hover:bg-[var(--muted-background)] transition-colors font-medium flex items-center self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Request Data Export
                  </button>
                </div>
             </div>
          )}
        </div>
        
        {hasProfileChanges && activeTab === 'profile' && (
           <div className="mt-6 p-4 bg-[var(--card-background)] border-t border-[var(--border-color)] flex items-center justify-end">
             <button
               onClick={handleSaveChanges}
               className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
             >
               Save Changes
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
