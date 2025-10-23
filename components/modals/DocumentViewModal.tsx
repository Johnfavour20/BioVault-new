import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils';
import { XCircle, FileText, Clock, HardDrive, Tag } from 'lucide-react';

const DocumentViewModal: React.FC = () => {
  const { selectedDocument, setShowDocumentViewModal } = useApp();
  
  if (!selectedDocument) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
      <div className="bg-[var(--card-background)] rounded-2xl max-w-3xl w-full p-6 sm:p-8 flex flex-col h-[90vh] modal-content">
        <div className="flex items-start justify-between mb-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] break-all">{selectedDocument.name}</h2>
                <p className="text-sm text-[var(--text-secondary)]">Secure Document Viewer</p>
              </div>
          </div>
          <button
            onClick={() => setShowDocumentViewModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close document viewer"
          >
            <XCircle className="w-7 h-7" />
          </button>
        </div>
        
        <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
          {/* Left panel: Preview */}
          <div className="flex-1 bg-[var(--muted-background)] border border-[var(--border-color)] rounded-xl flex items-center justify-center p-4">
            <div className="text-center text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-[var(--text-secondary)]">Document Preview</h3>
              <p className="text-sm">Content would be securely rendered here.</p>
            </div>
          </div>

          {/* Right panel: Details */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-4">
            <h3 className="font-semibold text-lg text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Details</h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 text-[var(--text-secondary)] mr-3 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">Uploaded</p>
                        <p className="text-[var(--text-secondary)]">{formatDate(selectedDocument.uploadedAt)}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Tag className="w-4 h-4 text-[var(--text-secondary)] mr-3 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">Category</p>
                        <p className="text-[var(--text-secondary)]">{selectedDocument.category}</p>
                    </div>
                </div>
                 <div className="flex items-center">
                    <HardDrive className="w-4 h-4 text-[var(--text-secondary)] mr-3 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">File Size</p>
                        <p className="text-[var(--text-secondary)]">{selectedDocument.size}</p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <FileText className="w-4 h-4 text-[var(--text-secondary)] mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">IPFS Hash</p>
                        <p className="text-[var(--text-secondary)] text-xs break-all font-mono">{selectedDocument.ipfsHash}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex-shrink-0 flex items-center justify-end">
            <button 
                onClick={() => setShowDocumentViewModal(false)}
                className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
            >
                Close Viewer
            </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal;