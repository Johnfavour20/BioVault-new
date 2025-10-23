import React from 'react';
import { Hash } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
      <div className="flex flex-col items-center animate-fade-in-scale">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
          <Hash className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">BioVault</h1>
        <p className="text-white/80">Your health data, your control</p>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;