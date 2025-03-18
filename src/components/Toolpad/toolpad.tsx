import * as React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import IncidentTable from '../Table/incident.table';
import AlertTable from '../Table/alert.table';
import EventTable from '../Table/event.table';
import IntegrationTable from '../Table/integration.table';
import ImplementationTable from '../Table/implementation.table';
import WorkaroundTable from '../Table/workaround.table';
import PipelineTable from '../Table/pipeline.table';
import TivitRedLogo from '../../assets/tivit-red-logo-2.png';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Menu',
    icon: <DashboardIcon sx={{ color: 'white !important' }}/>,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Incidentes',
  },
  {
    segment: 'incidents',
    title: 'Incidentes',
    icon: <ReportProblemIcon sx={{ color: 'white !important' }} />
  },
  {
    segment: 'alerts',
    title: 'Alertas',
    icon: <NotificationsIcon sx={{ color: 'white !important' }}/>,
  },
  {
    segment: 'events',
    title: 'Eventos',
    icon: <NetworkPingIcon sx={{ color: 'white !important' }}/>,
  },
  {
    kind: 'header',
    title: 'Configuración',
  },
  {
    segment: 'integrations',
    title: 'Integraciones',
    icon: <ReportProblemIcon sx={{ color: 'white !important' }} />
  },
  {
    segment: 'implementations',
    title: 'Implementaciones',
    icon: <ReportProblemIcon sx={{ color: 'white !important' }} />
  },
  {
    kind: 'header',
    title: 'Workaround',
  },
  {
    segment: 'workarounds',
    title: 'Workarounds',
    icon: <ReportProblemIcon sx={{ color: 'white !important' }} />
  },
  {
    segment: 'pipelines',
    title: 'Pipelines',
    icon: <ReportProblemIcon sx={{ color: 'white !important' }} />
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Cambia a cualquier color que prefieras
          color: '#fff', // Cambia el color del texto
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f20024', // Cambia el color de la barra
          color: '#fff', // Cambia el color del texto
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f20024',
          color: '#fff',
          width: 280, // Ancho expandido
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms !important',
          '&.MuiDrawer-paperAnchorDockedLeft': {
            width: 80 // Ancho contraído
          }
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        ol: {
          display: 'none',
          padding: 0,
          margin: 0,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#f20024',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#fff !important',
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: '#f20024',
          color: '#fff',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          margin: 0,       // Elimina el margen
          padding: 0,      // Opcional: Elimina el relleno interno
          width: '100vw',
        },
        maxWidthLg: {
          margin: '0 auto',
          maxWidth: '95% !important',
          padding: '0 !important',
        },
      },
    },
  },
});

/* Pantallas */
// function DashboardContent() {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Bienvenido al dashboard.</p>
//       <p>AQUI PONES TU TABLA</p>
//       <div style={{width:'100%', height:'50px', backgroundColor:'red'}}>
//       </div>
//     </div>
//   );
// }

function OrdersContent() {
  return (
    <div>
      <h1>Órdenes</h1>
      <p>Aquí puedes gestionar las órdenes.</p>
    </div>
  );
}

const CONTENT_MAP: Record<string, JSX.Element> = {
  '/dashboard': <OrdersContent/>,
  '/incidents': <IncidentTable />,
  '/alerts': <AlertTable />,
  '/events': <EventTable />,
  '/integrations': <IntegrationTable />,
  '/implementations': <ImplementationTable />,
  '/workarounds': <WorkaroundTable />,
  '/pipelines': <PipelineTable />,
};
/* Pantallas */


function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => {
        setPathname(String(path))
        console.log('Navigating to:', path);
      }, // Cambia el estado del pathname
      
    };
  }, [pathname]);

  return router;
}

// const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
//   backgroundColor: theme.palette.action.hover,
//   borderRadius: theme.shape.borderRadius,
//   height,
//   content: '" "',
// }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardLayoutBasic(props: any) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation={NAVIGATION.map((item :any) =>
      item.segment
        ? {
            ...item,
            onClick: () => router.navigate(item.segment), // Cambia el pathname al hacer clic
          }
        : item
    )}
      branding={{
        logo: <img src={TivitRedLogo} alt="TIVIT logo" style={{ width: '100px', height: 'auto', backgroundPosition:'center', marginTop:'10px'}} />,
        title: 'AIOPS',
        homeUrl: '/toolpad/core/introduction',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout sidebarExpandedWidth={230}>
        <PageContainer>
          {CONTENT_MAP[router.pathname] || <div>Selecciona una opción del menú</div>}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
