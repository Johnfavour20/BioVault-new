import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Plus, Search, Filter, FileText, Lock, Eye, Download, Share2, List, LayoutGrid } from 'lucide-react';
import type { HealthRecord } from '../types';

const HealthRecords: React.FC = () => {
  const { healthRecords, setShowUploadModal, setSelectedHealthRecord, setShowHealthRecordViewModal, setAuditLog, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Lab Results', 'Imaging', 'Visit Summary', 'Prescriptions', 'Blood Work', 'Primary Care', 'X-Rays'];

  const filteredRecords = healthRecords.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || rec.type === filterCategory || rec.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewRecord = (rec: HealthRecord) => {
    setSelectedHealthRecord(rec);
    setAuditLog(prev => [{
      id: `audit_${Date.now()}`,
      eventType: 'DOCUMENT_VIEWED',
      actor: 'You',
      resource: rec.name,
      timestamp: Date.now(),
      location: 'Your Device'
    }, ...prev]);
    setShowHealthRecordViewModal(true);
  };

  const handleShare = (rec: HealthRecord) => {
    navigator.clipboard.writeText(`biovault://share?record_id=${rec.id}&hash=${rec.ipfsHash}`);
    addToast('Secure sharing link copied to clipboard!', 'success');
  };

  const handleDownload = (rec: HealthRecord) => {
    // This is a mock download. In a real app, this would fetch the decrypted file.
    const blob = new Blob(["This is a mock file for " + rec.name], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = rec.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast(`${rec.name} download started.`, 'info');
  };

  const RecordItemGrid: React.FC<{ rec: HealthRecord }> = ({ rec }) => (
    <div className="bg-[var(--card-background)] rounded-2xl p-5 border border-[var(--card-border)] hover:border-[var(--accent)] shadow-md hover:shadow-xl transition-all flex flex-col transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full flex items-center">
          <Lock className="w-3 h-3 mr-1" /> Encrypted
        </span>
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-[var(--text-primary)] mb-2 break-words">{rec.name}</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">{rec.category} • {rec.size}</p>
        <p className="text-xs text-gray-500 mb-4">{formatDate(rec.uploadedAt)}</p>
      </div>
      <div className="flex items-center space-x-2 mt-auto pt-4 border-t border-[var(--border-color)]">
        <button onClick={() => handleViewRecord(rec)} className="flex-1 bg-blue-500/10 text-blue-600 py-2 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium flex items-center justify-center">
          <Eye className="w-4 h-4 mr-1" /> View
        </button>
        <button onClick={() => handleDownload(rec)} className="flex-1 bg-[var(--muted-background)] text-[var(--text-secondary)] py-2 rounded-lg hover:bg-[var(--border-color)] transition-colors text-sm font-medium flex items-center justify-center">
          <Download className="w-4 h-4 mr-1" /> Download
        </button>
        <button onClick={() => handleShare(rec)} className="bg-[var(--muted-background)] text-[var(--text-secondary)] p-2 rounded-lg hover:bg-[var(--border-color)] transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const RecordItemList: React.FC<{ rec: HealthRecord }> = ({ rec }) => (
    <div className="flex items-center p-4 bg-[var(--card-background)] rounded-xl border border-[var(--card-border)] hover:bg-[var(--muted-background)] transition-colors">
        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
            <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <p className="font-medium text-[var(--text-primary)] break-all col-span-2 md:col-span-1">{rec.name}</p>
            <p className="text-sm text-[var(--text-secondary)] hidden md:block">{rec.category}</p>
            <p className="text-sm text-[var(--text-secondary)] hidden md:block">{formatDate(rec.uploadedAt)}</p>
            <div className="text-right">
                <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full flex items-center max-w-min ml-auto">
                    <Lock className="w-3 h-3 mr-1" /> Encrypted
                </span>
            </div>
        </div>
        <div className="flex items-center space-x-1 ml-4">
            <button onClick={() => handleViewRecord(rec)} className="p-2 text-[var(--text-secondary)] hover:bg-[var(--border-color)] rounded-lg"><Eye className="w-4 h-4" /></button>
            <button onClick={() => handleDownload(rec)} className="p-2 text-[var(--text-secondary)] hover:bg-[var(--border-color)] rounded-lg"><Download className="w-4 h-4" /></button>
            <button onClick={() => handleShare(rec)} className="p-2 text-[var(--text-secondary)] hover:bg-[var(--border-color)] rounded-lg"><Share2 className="w-4 h-4" /></button>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">My Health Records</h2>
          <p className="text-[var(--text-secondary)] mt-1">{healthRecords.length} health records stored securely</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center self-start sm:self-auto transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Health Record
        </button>
      </div>

      <div className="bg-[var(--card-background)] rounded-2xl p-4 shadow-xl border-2 border-[var(--border-color)] flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--ring-color)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--ring-color)] focus:border-transparent bg-[var(--background)] text-[var(--text-primary)]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center bg-[var(--muted-background)] p-1 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-[var(--card-background)] shadow-sm text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}><LayoutGrid className="w-5 h-5"/></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-[var(--card-background)] shadow-sm text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}><List className="w-5 h-5"/></button>
        </div>
      </div>
        
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map(rec => <RecordItemGrid key={rec.id} rec={rec} />)}
        </div>
      ) : (
        <div className="space-y-3">
             {filteredRecords.map(rec => <RecordItemList key={rec.id} rec={rec} />)}
        </div>
      )}

      {filteredRecords.length === 0 && (
        <div className="bg-[var(--card-background)] rounded-2xl p-12 border-2 border-dashed border-[var(--border-color)] text-center shadow-lg">
          <FileText className="w-16 h-16 text-gray-400/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No health records found</h3>
          <p className="text-[var(--text-secondary)]">Try adjusting your search or filter criteria, or add a new record.</p>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
