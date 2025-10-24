
import React, { useState, useEffect } from 'react';
import { mockUser, initialEmergencyPackConfig } from '../constants';
import type { User, EmergencyContact, Medication } from '../types';
import { Shield, FileText, HeartPulse, Pill, Stethoscope, Phone, Hash, AlertTriangle, Droplet } from 'lucide-react';

const EmergencyPortal: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [verified, setVerified] = useState(false);
  const [responderInfo, setResponderInfo] = useState({ name: '', badgeId: '', org: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attested, setAttested] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call. Here we find the mock user.
    if (userId === mockUser.emergencyId) {
      setUser(mockUser);
    } else {
      setError("Invalid or expired emergency link.");
    }
    // Change page title for context
    document.title = "BioVault Emergency Access";
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponderInfo({ ...responderInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responderInfo.name || !responderInfo.badgeId || !responderInfo.org) {
      alert("Please fill out all fields.");
      return;
    }
    if (!attested) {
      alert("You must attest to being a medical professional.");
      return;
    }
    setIsSubmitting(true);
    // Simulate verification
    setTimeout(() => {
      // Log the access event to localStorage for the main app to pick up
      const accessEvent = {
        actor: `${responderInfo.name} (Responder)`,
        resource: 'Emergency Data Pack',
        location: responderInfo.org,
        timestamp: Date.now(),
      };
      localStorage.setItem('biovault_emergency_access', JSON.stringify(accessEvent));
      
      setVerified(true);
      setIsSubmitting(false);
    }, 1500);
  };
  
  const InfoCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode, variant?: 'default' | 'critical' }> = ({ icon: Icon, title, children, variant = 'default' }) => {
    const colors = {
        default: 'border-blue-500/20 bg-blue-500/5 text-blue-800 dark:text-blue-300',
        critical: 'border-red-500/20 bg-red-500/5 text-red-800 dark:text-red-300'
    };
    return (
        <div className={`p-4 rounded-lg border ${colors[variant]}`}>
            <h3 className="font-semibold flex items-center mb-2">
                <Icon className="w-5 h-5 mr-2" /> {title}
            </h3>
            <div className="pl-7 text-sm">{children}</div>
        </div>
    );
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600">{error}</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Hash className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">BioVault</h1>
        </div>
        <h2 className="text-xl font-semibold text-red-600">Emergency Medical Information</h2>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {!verified ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-red-500">
                <h3 className="text-lg font-bold mb-2">Patient Confirmation</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Responder Verification</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">To protect patient privacy, you must verify your identity before accessing this sensitive information. This action will be logged and the patient will be notified.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" name="name" value={responderInfo.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Badge / ID Number</label>
                        <input type="text" name="badgeId" value={responderInfo.badgeId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization (e.g., City General Hospital EMS)</label>
                        <input type="text" name="org" value={responderInfo.org} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="flex items-start">
                        <input id="attestation" type="checkbox" checked={attested} onChange={e => setAttested(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"/>
                        <label htmlFor="attestation" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">I confirm I am a verified medical professional accessing this information for a medical emergency.</label>
                    </div>
                    <button type="submit" disabled={isSubmitting || !attested} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
                        {isSubmitting ? 'Verifying...' : 'View Emergency Information'}
                    </button>
                </form>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fadeIn">
            <div className="p-3 bg-green-500/10 text-green-800 dark:text-green-300 rounded-lg mb-6 text-sm text-center">
              Access granted. Viewing as <strong>{responderInfo.name}</strong> from {responderInfo.org}.
            </div>
            <div className="space-y-4">
                {initialEmergencyPackConfig.bloodType && <InfoCard icon={Droplet} title="Blood Type" variant="critical"><p className="font-bold text-lg">{user.bloodType}</p></InfoCard>}
                {initialEmergencyPackConfig.allergies && <InfoCard icon={AlertTriangle} title="Allergies" variant="critical"><ul className="list-disc list-inside">{user.allergies.map(a => <li key={a}>{a}</li>)}</ul></InfoCard>}
                {initialEmergencyPackConfig.conditions && <InfoCard icon={HeartPulse} title="Chronic Conditions"><ul className="list-disc list-inside">{user.chronicConditions.map(c => <li key={c}>{c}</li>)}</ul></InfoCard>}
                {initialEmergencyPackConfig.medications && <InfoCard icon={Pill} title="Current Medications"><ul>{user.medications.map((m: Medication) => <li key={m.name}><strong>{m.name}</strong> - {m.dosage}, {m.frequency}</li>)}</ul></InfoCard>}
                {initialEmergencyPackConfig.emergencyContacts && <InfoCard icon={Phone} title="Emergency Contacts"><ul>{user.emergencyContacts.map((c: EmergencyContact) => <li key={c.name}><strong>{c.name}</strong> ({c.relationship}) - {c.phone}</li>)}</ul></InfoCard>}
            </div>
          </div>
        )}
      </main>
      
      <footer className="max-w-4xl mx-auto mt-8 text-center text-xs text-gray-500">
        <p>This information is confidential and protected. Access is logged and audited. &copy; {new Date().getFullYear()} BioVault</p>
      </footer>
    </div>
  );
};

export default EmergencyPortal;
