import React from 'react';
import { useApp } from '../../context/AppContext';
import { XCircle, QrCode, CheckCircle, Shield, Lock, Download, Share2 } from 'lucide-react';

const QRCodeModal: React.FC = () => {
  const { setShowQRModal, user } = useApp();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your BioVault QR</h2>
            <p className="text-sm text-gray-600 mt-1">For secure provider access</p>
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
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border-2 border-dashed border-blue-300">
            <div className="w-full aspect-square bg-white rounded-lg mx-auto flex items-center justify-center mb-4 p-4 shadow-inner">
              <QrCode className="w-full h-full text-gray-800" />
            </div>
            <p className="text-center text-sm text-gray-600 mb-1">BioVault ID</p>
            <p className="text-center text-[10px] sm:text-xs font-mono text-gray-500 break-all px-2">{user?.id}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">Verified Access</p>
                <p className="text-xs text-green-700">Only verified providers can request access</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Always Logged</p>
                <p className="text-xs text-blue-700">Every access is recorded on the blockchain</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-900">Your Control</p>
                <p className="text-xs text-purple-700">You approve or deny every request</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button className="w-full sm:flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default QRCodeModal;