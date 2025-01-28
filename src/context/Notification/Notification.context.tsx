import React from "react";
import { ContextProps } from "../../types/Notification/ContextProps";

const NotificationContext = React.createContext<ContextProps | null>(null);

export default NotificationContext;
