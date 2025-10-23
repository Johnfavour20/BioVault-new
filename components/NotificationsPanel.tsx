import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Bell, Users, Clock } from 'lucide-react';
import type { Notification } from '../types';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'ACCESS_REQUEST':
      return <Users className="w-5 h-5 text-blue-600" />;
    case 'ACCESS_EXPIRING':
      return <Clock className="w-5 h-5 text-orange-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

const NotificationsPanel: React.FC = () => {
  const { notifications, setNotifications, setCurrentView, setShowNotificationsPanel } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if the notification toggle button is clicked
      if (target.closest('[aria-label="Toggle Notifications"]')) {
        return;
      }
      if (panelRef.current && !panelRef.current.contains(target)) {
        setShowNotificationsPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowNotificationsPanel]);

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    setCurrentView(notification.linkTo);
    setShowNotificationsPanel(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div ref={panelRef} className="fixed top-16 right-4 sm:right-6 w-full max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden animate-fade-in-down">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Mark all as read
                </button>
            )}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className="flex items-start space-x-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="w-2 mt-2 flex-shrink-0">
                {!notif.isRead && (
                    <div className="h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                notif.type === 'ACCESS_REQUEST' ? 'bg-blue-100' :
                notif.type === 'ACCESS_EXPIRING' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <NotificationIcon type={notif.type} />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!notif.isRead ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(notif.timestamp)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900">No Notifications</h4>
            <p className="text-sm text-gray-600">You're all caught up!</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in-down {
            0% {
                opacity: 0;
                transform: translateY(-10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPanel;
