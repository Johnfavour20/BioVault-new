import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText: string;
  confirmVariant?: 'primary' | 'destructive';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = 'primary'
}) => {
  if (!isOpen) return null;

  const confirmClasses = {
      primary: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
      destructive: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
      <div className="bg-[var(--card-background)] rounded-2xl max-w-md w-full p-6 sm:p-8 modal-content relative">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close confirmation"
        >
            <XCircle className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h2>
            <div className="text-[var(--text-secondary)] mb-6">{message}</div>

            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full">
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto flex-1 bg-[var(--muted-background)] text-[var(--text-secondary)] py-3 rounded-lg hover:bg-[var(--border-color)] transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className={`w-full sm:w-auto flex-1 py-3 rounded-lg transition-all font-bold shadow-md hover:shadow-lg ${confirmClasses[confirmVariant]}`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
