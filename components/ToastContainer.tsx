import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Toast } from '../types';
import { X, CheckCircle, XCircle as ErrorCircle, Info } from 'lucide-react';

const ToastMessage: React.FC<{ toast: Toast, onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
            // After animation, call dismiss
            const dismissTimer = setTimeout(() => onDismiss(toast.id), 400);
            return () => clearTimeout(dismissTimer);
        }, 4500); // Start exit animation 500ms before removal

        return () => {
            clearTimeout(exitTimer);
        };
    }, [toast.id, onDismiss]);
    
    const icons = {
        success: <CheckCircle className="w-6 h-6 text-green-500" />,
        error: <ErrorCircle className="w-6 h-6 text-red-500" />,
        info: <Info className="w-6 h-6 text-blue-500" />,
    };

    return (
        <div 
            className={`bg-[var(--card-background)] rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 w-full max-w-sm overflow-hidden pointer-events-auto transition-all duration-300 ease-in-out transform ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">{icons[toast.type]}</div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{toast.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={() => onDismiss(toast.id)}
                            className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[var(--card-background)]"
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useApp();

    if (!toasts || toasts.length === 0) {
        return null;
    }

    return (
        <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map(toast => (
                    <ToastMessage key={toast.id} toast={toast} onDismiss={removeToast} />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;