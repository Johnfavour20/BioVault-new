import React, { useState } from 'react';
import { Hash, CheckCircle } from 'lucide-react';
import { mockUser } from '../constants';
import type { User } from '../types';

interface WalletConnectProps {
  onConnect: (user: User) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [connecting, setConnecting] = useState(false);
  
  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      onConnect(mockUser);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
            <Hash className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">BioVault</h1>
          <p className="text-gray-600">Your health data, your control</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">End-to-end encrypted medical records</p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">Blockchain-verified access control</p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">Emergency access for critical situations</p>
          </div>
        </div>
        
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connecting ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Connecting Wallet...
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default WalletConnect;