import React from 'react';
import { useApp } from '../../context/AppContext';
import { XCircle, QrCode, CheckCircle, Shield, Lock, Download, Share2 } from 'lucide-react';

const QRCodeModal: React.FC = () => {
  const { setShowQRModal, user } = useApp();
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
      <div className="bg-[var(--card-background)] rounded-2xl max-w-md w-full p-4 sm:p-6 modal-content">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Your BioVault QR</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">For secure provider access</p>
          </div>
          <button
            onClick={() => setShowQRModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mt-1 -mr-1"
            aria-label="Close modal"
          >
            <XCircle className="w-7 h-7" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-500/5 rounded-xl p-4 sm:p-6 border-2 border-dashed border-blue-500/20">
            <div className="w-full aspect-square bg-white rounded-lg mx-auto flex items-center justify-center mb-4 p-4 shadow-inner">
              <QrCode className="w-full h-full text-gray-800" />
            </div>
            <p className="text-center text-sm text-[var(--text-secondary)] mb-1">BioVault ID</p>
            <p className="text-center text-[10px] sm:text-xs font-mono text-gray-500 break-all px-2">{user?.id}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start space-x-3 p-3 bg-green-500/5 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">Verified Access</p>
                <p className="text-xs text-green-700 dark:text-green-400">Only verified providers can request access</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-500/5 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Always Logged</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">Every access is recorded on the blockchain</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-500/5 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Your Control</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">You approve or deny every request</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button className="w-full sm:flex-1 bg-[var(--muted-background)] text-[var(--text-secondary)] py-3 rounded-lg hover:bg-[var(--border-color)] transition-colors font-medium flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button className="w-full sm:flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;