import React, { createContext, useContext, useState, useCallback } from 'react';
import { Flashbar, FlashbarProps } from '@cloudscape-design/components';

interface NotificationContextType {
  addNotification: (notification: Omit<FlashbarProps.MessageDefinition, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<FlashbarProps.MessageDefinition, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      dismissible: true,
      onDismiss: () => removeNotification(id)
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss all notifications after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {notifications.length > 0 && (
        <Flashbar
          items={notifications}
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 