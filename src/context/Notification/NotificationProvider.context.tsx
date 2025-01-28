import React from 'react';
import Notification from '../../components/Notification';
import { NotificationType } from '../../types/Notification/NotificationType';
import NotificationContext from './Notification.context';

const NotificationProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const [notifications, setNotifications] = React.useState<NotificationType[]>([]);
  
    const handleClose = (index: number) => {
      setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
    };
  
    const getError = (msg: string) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { msg, severity: 'error', color: '#f3d8da' },
      ]);
    };
  
    const getSuccess = (msg: string) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { msg, severity: 'success', color: '#d9ecdb' },
      ]);
    };
  
    const getWarning = (msg: string) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { msg, severity: 'warning', color: '#fdf3d1' },
      ]);
    };
  
    const value = React.useMemo(() => ({ getError, getSuccess, getWarning }), []);
  
    return (
      <NotificationContext.Provider value={value}>
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            {...notification}
            open={true}
            handleClose={() => handleClose(index)}
          />
        ))}
        {children}
      </NotificationContext.Provider>
    );
  };

export default NotificationProvider;