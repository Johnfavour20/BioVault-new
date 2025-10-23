import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Plus, Search, Filter, FileText, Lock, Eye, Download, Share2 } from 'lucide-react';
import type { Document } from '../types';

const Documents: React.FC = () => {
  const { documents, setShowUploadModal, setSelectedDocument, setShowDocumentViewModal, setAuditLog } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const categories = ['All', 'Lab Results', 'Imaging', 'Visit Summary', 'Prescriptions', 'Blood Work', 'Primary Care', 'X-Rays'];
  
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || doc.type === filterCategory || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setAuditLog(prev => [{
        id: `audit_${Date.now()}`,
        eventType: 'DOCUMENT_VIEWED',
        actor: 'You',
        resource: doc.name,
        timestamp: Date.now(),
        location: 'Your Device'
    }, ...prev]);
    setShowDocumentViewModal(true);
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Documents</h2>
          <p className="text-gray-600 mt-1">{documents.length} medical records stored securely</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center self-start sm:self-auto transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Upload Document
        </button>
      </div>
      
      <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-gray-200 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all flex flex-col transform hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                <Lock className="w-3 h-3 mr-1" /> Encrypted
              </span>
            </div>
            
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-900 mb-2 break-words">{doc.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{doc.category} • {doc.size}</p>
                <p className="text-xs text-gray-500 mb-4">{formatDate(doc.uploadedAt)}</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-auto pt-4">
              <button
                onClick={() => handleViewDocument(doc)}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-1" /> View
              </button>
              <button className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center">
                <Download className="w-4 h-4 mr-1" /> Download
              </button>
              <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border-2 border-gray-200 text-center shadow-xl">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Documents;