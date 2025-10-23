import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import WalletConnect from './components/WalletConnect';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Documents from './components/Documents';
import AccessManagement from './components/AccessManagement';
import AuditTrail from './components/AuditTrail';
import EmergencyAccess from './components/EmergencyAccess';
import Settings from './components/Settings';
import UploadModal from './components/modals/UploadModal';
import QRCodeModal from './components/modals/QRCodeModal';
import SplashScreen from './components/SplashScreen';
import type { User } from './types';

const AppContent: React.FC = () => {
  const { currentView, user, setUser, showUploadModal, showQRModal, isSidebarOpen, setIsSidebarOpen } = useApp();
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Show splash for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'documents': return <Documents />;
      case 'access': return <AccessManagement />;
      case 'audit': return <AuditTrail />;
      case 'emergency': return <EmergencyAccess />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  if (!user) {
    return <WalletConnect onConnect={(connectedUser) => setUser(connectedUser)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:ml-64 transition-all duration-300">
          {/* Overlay for mobile sidebar */}
          {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"></div>}
          {renderView()}
        </main>
      </div>
      
      {showUploadModal && <UploadModal />}
      {showQRModal && <QRCodeModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}