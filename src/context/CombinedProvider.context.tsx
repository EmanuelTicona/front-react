import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from 'primereact/api';
import NotificationProvider from './Notification/NotificationProvider.context';

// Importa otros contextos aquí
interface CombinedProviderProps {
  children: ReactNode;
}
// Query client
const queryClient = new QueryClient();

const CombinedProvider: React.FC<CombinedProviderProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider>
         {children}
        </PrimeReactProvider>
      </QueryClientProvider>
    </NotificationProvider>
  );
};

export default CombinedProvider;
