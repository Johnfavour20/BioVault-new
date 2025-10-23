import React from 'react';
import { Hash, Lock, ShieldCheck, Share2 } from 'lucide-react';

interface LandingPageProps {
  onConnectRequest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnectRequest }) => {
  return (
    <div className="bg-[var(--background)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <Hash className="w-6 h-6 text-[var(--primary-foreground)]" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">BioVault</h1>
          </div>
          <button
            onClick={onConnectRequest}
            className="hidden sm:inline-block bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Launch App
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center bg-gradient-to-b from-blue-500/5 to-transparent">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-4">
              The Future of Your Health,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                In Your Hands
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-[var(--text-secondary)] mb-8">
              BioVault is a secure, decentralized platform for managing your medical records. Own your data, control your privacy, and share securely with providers on your terms.
            </p>
            <button
              onClick={onConnectRequest}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg"
            >
              Connect Wallet to Get Started
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[var(--muted-background)]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--card-background)] rounded-2xl mb-4 border border-[var(--card-border)] shadow-md">
                  <Lock className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Unmatched Security</h3>
                <p className="text-[var(--text-secondary)]">
                  With end-to-end encryption and blockchain verification, your data is yours alone. We can't see it, and neither can anyone you don't approve.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--card-background)] rounded-2xl mb-4 border border-[var(--card-border)] shadow-md">
                  <ShieldCheck className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Total Control</h3>
                <p className="text-[var(--text-secondary)]">
                  Grant and revoke access to specific records for limited times. Every action is recorded on an immutable audit trail for full transparency.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--card-background)] rounded-2xl mb-4 border border-[var(--card-border)] shadow-md">
                  <Share2 className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Seamless Sharing</h3>
                <p className="text-[var(--text-secondary)]">
                  Securely share your records with any healthcare provider in the world using a simple QR code, ensuring you get the best care possible.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-[var(--card-background)] border-t border-[var(--border-color)] py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center text-[var(--text-secondary)] text-sm">
          <p>&copy; {new Date().getFullYear()} BioVault. All Rights Reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-[var(--text-primary)]">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-[var(--text-primary)]">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
