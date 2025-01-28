import React from 'react'
import ReactDOM from 'react-dom/client'
import CombinedProvider from './context/CombinedProvider.context';
//import { App } from './App'
import { ThemeConfig } from './config/theme.config';
import './index.css'
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import DashboardLayoutBasic from './components/Toolpad/toolpad';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeConfig>
        <CombinedProvider>
          {/* <App/> */}
          <DashboardLayoutBasic/>
        </CombinedProvider>
    </ThemeConfig>
  </React.StrictMode>,
)
