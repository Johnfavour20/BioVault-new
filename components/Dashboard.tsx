
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Upload, QrCode, Bell, FileText, Users, HeartPulse, ChevronRight, Lock, BarChart2, Shield } from 'lucide-react';
import type { HealthRecord } from '../types';

const StatCard: React.FC<{ label: string, value: number | string, icon: React.ElementType, color: string, subtitle?: string }> = ({ label, value, icon: Icon, color, subtitle }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${colors[color]} text-white rounded-2xl p-4 sm:p-6 shadow-lg hover:-translate-y-1 transition-transform h-full flex flex-col`}>
      <div className="absolute -top-4 -right-4 w-24 h-24 text-white/10">
        <Icon className="w-full h-full" strokeWidth={1.5}/>
      </div>
      <div className="relative z-10 flex-grow flex flex-col">
        <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        <p className="text-sm opacity-90 mt-1">{label}</p>
        {subtitle && <p className="text-xs opacity-80 mt-auto pt-2">{subtitle}</p>}
      </div>
    </div>
  );
}

const WeeklyActivityChart: React.FC = () => {
    const data = [
        { day: 'Mon', uploads: 2, views: 5 },
        { day: 'Tue', uploads: 1, views: 8 },
        { day: 'Wed', uploads: 0, views: 3 },
        { day: 'Thu', uploads: 3, views: 10 },
        { day: 'Fri', uploads: 1, views: 6 },
        { day: 'Sat', uploads: 0, views: 2 },
        { day: 'Sun', uploads: 0, views: 4 },
    ];
    const maxActivity = Math.max(...data.map(d => d.uploads + d.views), 10);
    const chartRef = useRef<HTMLDivElement>(null);
    const [tooltipData, setTooltipData] = useState<{ day: string, uploads: number, views: number, x: number, y: number } | null>(null);

    const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>, item: typeof data[0]) => {
        const bar = e.currentTarget;
        const chart = chartRef.current;
        if (!chart) return;

        const chartRect = chart.getBoundingClientRect();
        const barRect = bar.getBoundingClientRect();
        
        setTooltipData({
            ...item,
            x: barRect.left - chartRect.left + barRect.width / 2,
            y: barRect.top - chartRect.top,
        });
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    return (
        <div ref={chartRef} className="bg-[var(--card-background)] rounded-2xl p-6 border-2 border-[var(--border-color)] shadow-xl relative">
          <h3 className="font-semibold text-lg mb-4 flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-blue-500"/>Weekly Activity</h3>
          <div className="flex justify-between items-end h-48">
            {data.map((item, index) => (
                <div key={index} onMouseOver={(e) => handleMouseOver(e, item)} onMouseLeave={handleMouseLeave} className="flex-1 flex flex-col items-center justify-end h-full px-1 group cursor-pointer">
                    <div className="w-full h-full flex flex-col items-center justify-end">
                        <div className="relative w-full h-full flex flex-col justify-end">
                            <div className="bg-purple-200 dark:bg-purple-700/50 rounded-t-lg transition-all duration-300 group-hover:bg-purple-300" style={{ height: `${(item.views / maxActivity) * 100}%` }}></div>
                            <div className="bg-blue-300 dark:bg-blue-500/80 rounded-t-lg transition-all duration-300 group-hover:bg-blue-400" style={{ height: `${(item.uploads / maxActivity) * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-2">{item.day}</div>
                    </div>
                </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 border-t border-[var(--border-color)] pt-3">
              <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-300 dark:bg-blue-500/80 rounded-sm mr-2"></span>
                  <span className="text-xs text-[var(--text-secondary)]">Uploads</span>
              </div>
              <div className="flex items-center">
                  <span className="w-3 h-3 bg-purple-200 dark:bg-purple-700/50 rounded-sm mr-2"></span>
                  <span className="text-xs text-[var(--text-secondary)]">Views</span>
              </div>
          </div>
          {tooltipData && (
                <div
                    className="absolute bg-gray-900 dark:bg-gray-700 text-white rounded-lg p-3 text-xs shadow-2xl z-20 pointer-events-none transition-opacity duration-200"
                    style={{
                        left: `${tooltipData.x}px`,
                        top: `${tooltipData.y}px`,
                        transform: 'translate(-50%, -110%)',
                    }}
                >
                    <p className="font-bold mb-1 border-b border-gray-600 pb-1">{tooltipData.day}</p>
                    <div className="flex items-center mt-1">
                        <span className="w-2 h-2 bg-blue-300 rounded-sm mr-1.5"></span>
                        <span>Uploads: <strong>{tooltipData.uploads}</strong></span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 bg-purple-200 rounded-sm mr-1.5"></span>
                        <span>Views: <strong>{tooltipData.views}</strong></span>
                    </div>
                </div>
            )}
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { user, healthRecords, accessRequests, activeAccess, setCurrentView, setShowUploadModal, setShowQRModal, setSelectedHealthRecord, setShowHealthRecordViewModal, setAuditLog, addToast } = useApp();
  
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleConnectWatch = () => {
    if (heartRate || isConnecting) return;

    setIsConnecting(true);
    addToast('Connecting to Apple Watch...', 'info');

    setTimeout(() => {
        setIsConnecting(false);
        const initialHeartRate = Math.floor(Math.random() * (90 - 70 + 1)) + 70;
        setHeartRate(initialHeartRate);
        addToast('Apple Watch connected successfully!', 'success');

        intervalRef.current = window.setInterval(() => {
            setHeartRate(prev => {
                if (prev === null) {
                    if(intervalRef.current) clearInterval(intervalRef.current);
                    return null;
                };
                const change = Math.floor(Math.random() * 5) - 2; // change between -2 and 2
                return Math.max(60, Math.min(110, prev + change));
            });
        }, 2500);

    }, 2000);
  };

  const stats = [
    { id: 'security', label: 'Security Score', value: '100%', icon: Shield, color: 'purple', subtitle: 'AES-256 Encrypted', view: 'settings' },
    { id: 'records', label: 'Health Records', value: healthRecords.length, icon: FileText, color: 'blue', subtitle: 'All Encrypted On-Chain', view: 'healthRecords' },
    { id: 'grants', label: 'Active Providers', value: activeAccess.length, icon: Users, color: 'green', subtitle: 'Time-Limited Access', view: 'access' },
  ];

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

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{`Welcome back, ${user?.name.split(' ')[0] || ''}! 👋`}</h2>
        <p className="text-[var(--text-secondary)] mt-1">Today is {currentDate}. Here's a summary of your health data activity.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-left"
        >
          <Upload className="w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Add Health Record</h3>
          <p className="text-blue-100 text-sm">Upload new medical documents</p>
        </button>
        
        <button
          onClick={() => setShowQRModal({ visible: true })}
          className="bg-[var(--card-background)] border-2 border-[var(--border-color)] p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-left text-[var(--text-primary)]"
        >
          <QrCode className="w-10 h-10 mb-3 text-[var(--primary)]" />
          <h3 className="font-semibold text-lg mb-1">Share Access QR</h3>
          <p className="text-[var(--text-secondary)] text-sm">For secure provider access</p>
        </button>
        
        <button
          onClick={() => setCurrentView('access')}
          className="bg-[var(--card-background)] border-2 border-[var(--border-color)] p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-left text-[var(--text-primary)] relative"
        >
          {accessRequests.length > 0 && <span className="absolute top-4 right-4 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>}
          {accessRequests.length > 0 && <span className="absolute top-4 right-4 h-3 w-3 rounded-full bg-red-500"></span>}
          <Bell className="w-10 h-10 mb-3 text-[var(--primary)]" />
          <h3 className="font-semibold text-lg mb-1">Access Requests</h3>
          <p className="text-[var(--text-secondary)] text-sm">{accessRequests.length} pending</p>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button key={stat.id} onClick={() => setCurrentView(stat.view)} className="text-left w-full h-full">
            <StatCard {...stat} />
          </button>
        ))}
         <button onClick={handleConnectWatch} disabled={isConnecting || !!heartRate} className="text-left w-full h-full disabled:cursor-not-allowed">
            <div className={`relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-4 sm:p-6 shadow-lg hover:-translate-y-1 transition-transform h-full flex flex-col`}>
                <div className="absolute -top-4 -right-4 w-24 h-24 text-white/10">
                    <HeartPulse className="w-full h-full" strokeWidth={1.5}/>
                </div>
                <div className="relative z-10 flex-grow flex flex-col">
                    <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                        <HeartPulse className="w-6 h-6" />
                    </div>
                    {isConnecting ? (
                        <p className="text-2xl sm:text-3xl font-bold animate-pulse">...</p>
                    ) : (
                        <p className="text-2xl sm:text-3xl font-bold">{heartRate ? heartRate : '—'}</p>
                    )}
                    <p className="text-sm opacity-90 mt-1">Live Heart Rate</p>
                    {isConnecting ? (
                        <p className="text-xs opacity-80 mt-auto pt-2">Connecting...</p>
                    ) : (
                        <p className="text-xs opacity-80 mt-auto pt-2">{heartRate ? `Connected` : 'Connect Apple Watch'}</p>
                    )}
                    {heartRate && <span className="absolute top-4 right-4 h-3 w-3 rounded-full bg-white/50 animate-ping"></span>}
                </div>
            </div>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityChart />
        
        <div className="bg-[var(--card-background)] rounded-2xl p-6 border-2 border-[var(--border-color)] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Health Records</h3>
            <button
              onClick={() => setCurrentView('healthRecords')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {healthRecords.slice(0, 3).map(doc => (
              <div 
                key={doc.id} 
                onClick={() => handleViewRecord(doc)}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-[var(--muted-background)] rounded-lg transition-all transform cursor-pointer hover:shadow-md hover:-translate-y-px"
              >
                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{doc.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{doc.category} • {formatDate(doc.uploadedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full flex items-center">
                    <Lock className="w-3 h-3 mr-1" /> Encrypted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
