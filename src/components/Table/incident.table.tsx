import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { useIncidents } from '../../queries/useIncident';
import { useAlertByIncidentId } from '../../queries/useAlert';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../incidentDetails.css';


// const customTabStyle = {
//   '.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link': {
//     backgroundColor: '#ff4444',
//     color: '#ffffff',
//     borderColor: '#ff4444'
//   },
//   '.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus': {
//     boxShadow: '0 0 0 0.2rem rgba(255, 68, 68, 0.2)'
//   }
// };

export default function BasicFilterDemo() {
  const { data: incidents, isLoading } = useIncidents();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<typeof incidents[0] | null>(null);

  const { data: relatedAlerts, isLoading: alertsLoading } = useAlertByIncidentId(
    selectedIncident?.id ?? 0
  );

  const onRowClick = (event: { data: typeof incidents[0] }) => {
    setSelectedIncident(event.data);
    setVisible(true);
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    implementation: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
    assigned_group: { value: null, matchMode: FilterMatchMode.CONTAINS },
    host: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sys_class_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    num_alerts: { value: null, matchMode: FilterMatchMode.EQUALS },
    state: { value: null, matchMode: FilterMatchMode.EQUALS },
    external_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    updated_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
    reopened_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
    resolved_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const getStateTag = (state: string) => {
    const stateColors: Record<string, string> = {
      'OPEN': 'warning',
      'RESOLVED': 'success'
    };
    return <Tag value={state} severity={stateColors[state.toLowerCase()] || 'info'} />;
  };

  // const LoadingAlerts = () => (
  //   <div className="flex align-items-center justify-content-center p-5">
  //     <ProgressSpinner style={{ width: '50px', height: '50px' }} />
  //     <span className="ml-3">Cargando alertas relacionadas...</span>
  //   </div>
  // );

  const getTimelineEvents = (incident: typeof incidents[0]) => {
    const events = [];
    if (incident.created_at) events.push({
      status: 'Creado',
      date: new Date(incident.created_at).toLocaleString(),
      icon: 'pi pi-plus',
      color: '#607D8B'
    });
    if (incident.updated_at) events.push({
      status: 'Actualizado',
      date: new Date(incident.updated_at).toLocaleString(),
      icon: 'pi pi-sync',
      color: '#FF9800'
    });
    if (incident.resolved_at) events.push({
      status: 'Resuelto',
      date: new Date(incident.resolved_at).toLocaleString(),
      icon: 'pi pi-check',
      color: '#4CAF50'
    });
    if (incident.reopened_at) events.push({
      status: 'Reabierto',
      date: new Date(incident.reopened_at).toLocaleString(),
      icon: 'pi pi-refresh',
      color: '#f44336'
    });
    return events;
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <div className="card" style={{ height: "1000px", display: "flex", flexDirection: "column" }}>
      <DataTable
        value={incidents || []}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={isLoading}
        globalFilterFields={["id", "host"]}
        header={header}
        emptyMessage="No incidents found."
        onRowClick={onRowClick}
        selectionMode="single"
        scrollHeight="flex" // Esto permite que la tabla ocupe el espacio restante
        style={{ flex: 1 }} // Hace que la tabla ocupe el espacio disponible
      >
        <Column
          field="id"
          header="id"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="implementation"
          header="implementation"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="created_at"
          header="created_at"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => new Date(rowData.created_at).toLocaleString()}
        />
        <Column
          field="external_id"
          header="external_id"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="assigned_group"
          header="assigned_group"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="host"
          header="host"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="sys_class_name"
          header="sys_class_name"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="num_alerts"
          header="num_alerts"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="state"
          header="state"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="updated_at"
          header="updated_at"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => new Date(rowData.updated_at).toLocaleString()}
        />
        <Column
          field="reopened_at"
          header="reopened_at"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => new Date(rowData.reopened_at).toLocaleString()}
        />
        <Column
          field="resolved_at"
          header="resolved_at"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => new Date(rowData.resolved_at).toLocaleString()}
        />
      </DataTable>
      </div>
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles del Incidente"
        style={{ width: '60vw', height: '700px' }}
        modal
        className="incident-dialog"
      >
        {selectedIncident && (
          <TabView className="custom-tabs">
            <TabPanel header="Detalles" leftIcon="pi pi-info-circle mr-2">
              <div className="grid">
                {/* Sección Principal */}
                <div className="col-12">
                  <Card className="mb-3">
                    <div className="flex align-items-center mb-3 w-full">
                      <h2 className="text-xl m-0 mr-3 text-gray-900">Incidente #{selectedIncident.id}</h2>
                      {getStateTag(selectedIncident.state)}
                    </div>
                    <div className="grid">
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className="text-gray-900">Información Principal</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Host:</label>
                            <div>{selectedIncident.host}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Grupo Asignado:</label>
                            <div>{selectedIncident.assigned_group}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Grupos de Host:</label>
                            <div>{selectedIncident.hostgroups}</div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className='text-gray-900'>Detalles Técnicos</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Clase:</label>
                            <div>{selectedIncident.sys_class_name}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">ID Externo:</label>
                            <div>{selectedIncident.external_id}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Número de Alertas:</label>
                            <Tag value={selectedIncident.num_alerts.toString()} severity="info" />
                          </div>
                        </Card>
                      </div>
                      {/* Notas de Trabajo */}

                      {/* {selectedIncident.work_notes && ( */}
                      <div className="col-12 md:col-6">
                        <Card className="mb-3">
                          <h3 className='text-gray-900'>Notas de Trabajo</h3>
                          <div className="surface-50 p-3 border-round">
                            {selectedIncident.work_notes &&
                              selectedIncident.work_notes
                                .split('\n') // Divide el texto en líneas
                                .filter((note) => note.trim() !== '') // Filtra las cadenas vacías
                                .map((note, index) => (
                                  <p key={index}>- {note}</p> // Agrega un guion a cada línea
                                ))}
                          </div>
                        </Card>
                      </div>
                      {/* )} */}
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Alertas Relacionadas" leftIcon="pi pi-bell mr-2">
              <div className="p-4">
                {selectedIncident && (
                  <div>
                    {alertsLoading ? (
                      <div className="flex align-items-center justify-content-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                      </div>
                    ) : (
                      <DataTable
                        value={relatedAlerts || []}
                        rows={5}
                        className="p-datatable-sm"
                      >
                        <Column
                          field="id"
                          header="ID Alerta"
                          style={{ width: '10%' }}
                        />
                        <Column
                          field="created_at"
                          header="Fecha Creación"
                          style={{ width: '10%' }}
                          body={(rowData) => new Date(rowData.created_at).toLocaleString()}
                        />
                        <Column
                          field="last_event_date"
                          header="Último Evento"
                          style={{ width: '10%' }}
                          body={(rowData) => new Date(rowData.last_event_date).toLocaleString()}
                        />
                        <Column
                          field="host"
                          header="CI"
                          style={{ width: '10%' }}
                        />
                        <Column
                          field="summary"
                          header="Descripción"
                          style={{ width: '30%' }}
                        />
                        <Column
                          field="category_error"
                          header="Error"
                          style={{ width: '10%' }}
                        />
                      </DataTable>
                    )}
                  </div>
                )}
              </div>
            </TabPanel>
          </TabView>
        )}
      </Dialog>
    </div>
  );
}