import React from "react";
import NotificationContext from "../context/Notification/Notification.context";

export const useNotification = () => {
    const context = React.useContext(NotificationContext);
    if (!context) throw new Error("No existe el contexto");
    return context;
};