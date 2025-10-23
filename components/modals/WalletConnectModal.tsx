import React, { useState } from 'react';
import { Hash, CheckCircle, XCircle } from 'lucide-react';
import { mockUser } from '../../constants';
import type { User } from '../../types';

interface WalletConnectModalProps {
  onConnect: (user: User) => void;
  onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ onConnect, onClose }) => {
  const [connecting, setConnecting] = useState(false);
  
  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      onConnect(mockUser);
    }, 1500);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
      <div className="bg-[var(--card-background)] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative modal-content">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close connection modal"
        >
            <XCircle className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
            <Hash className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">Connect to BioVault</h1>
          <p className="text-[var(--text-secondary)]">Your health data, your control</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--text-secondary)]">End-to-end encrypted medical records</p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--text-secondary)]">Blockchain-verified access control</p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--text-secondary)]">Emergency access for critical situations</p>
          </div>
        </div>
        
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connecting ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Connecting Wallet...
            </span>
          ) : (
            'Connect Wallet & Sign'
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default WalletConnectModal;
