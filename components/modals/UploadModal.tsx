import React, { useState, DragEvent, ChangeEvent } from 'react';
import { useApp } from '../../context/AppContext';
import { XCircle, Upload, FileText, Lock } from 'lucide-react';
import type { Document } from '../../types';

const UploadModal: React.FC = () => {
  const { setShowUploadModal, setDocuments, addToast } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('Lab Results');
  
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    setTimeout(() => {
      const newDoc: Document = {
        id: `doc_${Date.now()}`,
        name: selectedFile.name,
        type: category,
        category: category,
        uploadedAt: Date.now(),
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        ipfsHash: `QmNew${Math.random().toString(36).substr(2, 9)}`,
        encrypted: true
      };
      setDocuments(prev => [newDoc, ...prev]);
      setUploading(false);
      setShowUploadModal(false);
      addToast('Document uploaded successfully!', 'success');
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
      <div className="bg-[var(--card-background)] rounded-2xl max-w-2xl w-full p-6 sm:p-8 modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Upload Medical Document</h2>
          <button
            onClick={() => setShowUploadModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
            >
              <option>Lab Results</option><option>Imaging</option><option>Visit Summary</option><option>Prescriptions</option><option>Vaccination Records</option><option>Insurance</option>
            </select>
          </div>
          
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--border-color)] bg-[var(--muted-background)]'}`}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)] break-all">{selectedFile.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove File</button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-[var(--text-primary)] font-medium mb-2">Drop your file here, or browse</p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Supports: PDF, JPG, PNG (Max 50MB)</p>
                <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" accept=".pdf,.jpg,.jpeg,.png" />
                <label htmlFor="file-upload" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all cursor-pointer font-medium shadow-md hover:shadow-lg">Browse Files</label>
              </>
            )}
          </div>
          
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">End-to-End Encrypted</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">Your document will be encrypted on your device before upload. Only you and those you explicitly grant access can view it.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
            <button onClick={() => setShowUploadModal(false)} className="w-full sm:w-auto flex-1 bg-[var(--muted-background)] text-[var(--text-secondary)] py-3 rounded-lg hover:bg-[var(--border-color)] transition-colors font-medium">Cancel</button>
            <button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full sm:w-auto flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Encrypting & Uploading...
                </span>
              ) : ( 'Upload Document' )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;