
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../context/LocaleContext';
import { Download, Plus, X } from 'lucide-react';
import type { Medication } from '../types';

const Settings: React.FC = () => {
  const { user, setUser, addToast } = useApp();
  const { language, setLanguage, t } = useLocale();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
    bloodType: user?.bloodType || 'B+',
    allergies: user?.allergies || [],
    chronicConditions: user?.chronicConditions || [],
    medications: user?.medications || []
  });
  const [hasProfileChanges, setHasProfileChanges] = useState(false);

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState<Medication>({ name: '', dosage: '', frequency: '' });

  // Privacy tab state
  const [shareData, setShareData] = useState(false);
  // Compliance tab state
  const [dataResidency, setDataResidency] = useState('global');

  useEffect(() => {
    if (!user) return;
    const initialProfile = {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      bloodType: user.bloodType,
      allergies: user.allergies,
      chronicConditions: user.chronicConditions,
      medications: user.medications,
    };
    const changes = JSON.stringify(profileData) !== JSON.stringify(initialProfile);
    setHasProfileChanges(changes);
  }, [profileData, user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddItem = (type: 'allergies' | 'chronicConditions' | 'medications') => {
    if (type === 'allergies' && newAllergy.trim()) {
        setProfileData(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy.trim()] }));
        setNewAllergy('');
    } else if (type === 'chronicConditions' && newCondition.trim()) {
        setProfileData(prev => ({ ...prev, chronicConditions: [...prev.chronicConditions, newCondition.trim()] }));
        setNewCondition('');
    } else if (type === 'medications' && newMedication.name.trim() && newMedication.dosage.trim()) {
        setProfileData(prev => ({ ...prev, medications: [...prev.medications, newMedication] }));
        setNewMedication({ name: '', dosage: '', frequency: '' });
    }
  };

  const handleRemoveItem = (type: 'allergies' | 'chronicConditions' | 'medications', index: number) => {
    if (type === 'allergies') {
        setProfileData(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== index) }));
    } else if (type === 'chronicConditions') {
        setProfileData(prev => ({ ...prev, chronicConditions: prev.chronicConditions.filter((_, i) => i !== index) }));
    } else if (type === 'medications') {
        setProfileData(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }));
    }
  };
  
  const handleSaveChanges = () => {
    if (user) {
        setUser({ ...user, ...profileData });
    }
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
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{t('settings.title')}</h2>
        <p className="text-[var(--text-secondary)] mt-1">{t('settings.tagline')}</p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-2xl border-2 border-[var(--border-color)] overflow-hidden shadow-xl">
        <div className="border-b border-[var(--border-color)] flex overflow-x-auto">
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
              {t(`settings.tabs.${tabId}`)}
            </button>
          ))}
        </div>
        
        <div className="p-4 sm:p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                    <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                    <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleProfileChange} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Blood Type</label>
                     <select name="bloodType" value={profileData.bloodType} onChange={handleProfileChange} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (<option key={type} value={type}>{type}</option>))}
                    </select>
                  </div>
                </div>

                {/* Allergies */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('settings.profile.allergies')}</label>
                    <div className="flex gap-2">
                        <input type="text" value={newAllergy} onChange={e => setNewAllergy(e.target.value)} placeholder={t('settings.profile.addAllergyPlaceholder')} className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                        <button onClick={() => handleAddItem('allergies')} className="px-4 py-2 bg-blue-500/10 text-blue-600 rounded-lg"><Plus className="w-5 h-5"/></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.allergies.map((item, i) => <span key={i} className="flex items-center bg-gray-200 dark:bg-gray-700 text-sm rounded-full px-3 py-1">{item} <button onClick={() => handleRemoveItem('allergies', i)} className="ml-2 text-gray-500 hover:text-gray-800"><X className="w-3 h-3"/></button></span>)}
                    </div>
                </div>

                {/* Chronic Conditions */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('settings.profile.conditions')}</label>
                    <div className="flex gap-2">
                        <input type="text" value={newCondition} onChange={e => setNewCondition(e.target.value)} placeholder={t('settings.profile.addConditionPlaceholder')} className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                        <button onClick={() => handleAddItem('chronicConditions')} className="px-4 py-2 bg-blue-500/10 text-blue-600 rounded-lg"><Plus className="w-5 h-5"/></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.chronicConditions.map((item, i) => <span key={i} className="flex items-center bg-gray-200 dark:bg-gray-700 text-sm rounded-full px-3 py-1">{item} <button onClick={() => handleRemoveItem('chronicConditions', i)} className="ml-2 text-gray-500 hover:text-gray-800"><X className="w-3 h-3"/></button></span>)}
                    </div>
                </div>

                {/* Medications */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('settings.profile.medications')}</label>
                    <div className="grid sm:grid-cols-3 gap-2 mb-2">
                        <input type="text" value={newMedication.name} onChange={e => setNewMedication(p => ({...p, name: e.target.value}))} placeholder={t('settings.profile.medNamePlaceholder')} className="px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                        <input type="text" value={newMedication.dosage} onChange={e => setNewMedication(p => ({...p, dosage: e.target.value}))} placeholder={t('settings.profile.medDosagePlaceholder')} className="px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                        <input type="text" value={newMedication.frequency} onChange={e => setNewMedication(p => ({...p, frequency: e.target.value}))} placeholder={t('settings.profile.medFreqPlaceholder')} className="px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]" />
                    </div>
                    <button onClick={() => handleAddItem('medications')} className="w-full py-2 bg-blue-500/10 text-blue-600 rounded-lg font-medium">{t('settings.profile.addMedication')}</button>
                    <div className="space-y-2 mt-2">
                        {profileData.medications.map((med, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-[var(--muted-background)] rounded-lg">
                              <span className="text-sm">{med.name} - {med.dosage} ({med.frequency})</span>
                              <button onClick={() => handleRemoveItem('medications', i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4"/></button>
                          </div>
                        ))}
                    </div>
                </div>
                
                {/* Language Settings */}
                <div className="border-t border-[var(--border-color)] pt-6">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('settings.profile.language')}</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr')}
                    className="w-full md:w-1/2 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
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
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">{t('settings.compliance.dataResidency')}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">{t('settings.compliance.residencyDescription')}</p>
                  <select
                    value={dataResidency}
                    onChange={handleResidencyChange}
                    className="w-full md:w-1/2 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--text-primary)]"
                  >
                    <option value="global">{t('settings.compliance.residency.global')}</option>
                    <option value="us">{t('settings.compliance.residency.us')}</option>
                    <option value="eu">{t('settings.compliance.residency.eu')}</option>
                  </select>
                </div>
                <div className="border-t border-[var(--border-color)] pt-6">
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">{t('settings.compliance.dataExport')}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">{t('settings.compliance.exportDescription')}</p>
                  <button
                    onClick={handleExport}
                    className="bg-[var(--card-background)] border border-[var(--border-color)] px-6 py-2 rounded-lg hover:bg-[var(--muted-background)] transition-colors font-medium flex items-center self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('settings.compliance.requestExport')}
                  </button>
                </div>
             </div>
          )}
        </div>
        
        {hasProfileChanges && activeTab === 'profile' && (
           <div className="p-4 bg-[var(--card-background)] border-t border-[var(--border-color)] flex items-center justify-end">
             <button
               onClick={handleSaveChanges}
               className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
             >
               {t('settings.profile.saveChanges')}
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default Settings;