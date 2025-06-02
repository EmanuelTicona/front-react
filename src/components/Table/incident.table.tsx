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
import { useCorrelationKeysList } from '../../queries/useCorrelationKey';
import { useWorkNotesList } from '../../queries/useWorkNote';
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
  const { data: correlationKeys } = useCorrelationKeysList();
  const { data: workNotes } = useWorkNotesList();
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
    start_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ci: { value: null, matchMode: FilterMatchMode.CONTAINS },
    class: { value: null, matchMode: FilterMatchMode.CONTAINS },
    alert_count: { value: null, matchMode: FilterMatchMode.EQUALS },
    state: { value: null, matchMode: FilterMatchMode.EQUALS },
    external_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    update_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    reopened_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    end_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const getStateTag = (state: string) => {
    const stateColors: Record<string, string> = {
      'OPEN': 'warning',
      'RESOLVED': 'success',
      'OK': 'success'
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
            field="external_id"
            header="external_id"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="ci"
            header="ci"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="class"
            header="class"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="alert_count"
            header="alert_count"
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
            field="start_time"
            header="start_time"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
            body={(rowData) => new Date(rowData.start_time).toLocaleString()}
          />
          <Column
            field="end_time"
            header="end_time"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
            body={(rowData) => new Date(rowData.end_time).toLocaleString()}
          />
          <Column
            field="update_time"
            header="update_time"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
            body={(rowData) => new Date(rowData.update_time).toLocaleString()}
          />
          <Column
            field="reopened_time"
            header="reopened_time"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
            body={(rowData) => new Date(rowData.reopened_time).toLocaleString()}
          />
        </DataTable>
      </div>
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles del Incidente"
        style={{ width: '60vw', height: '500px' }}
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
                            <label className="font-bold text-gray-900">CI:</label>
                            <div>{selectedIncident.ci}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Clase:</label>
                            <div>{selectedIncident.clase}</div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className='text-gray-900'>Detalles Técnicos</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">ID Externo:</label>
                            <div>{selectedIncident.external_id}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Número de Alertas:</label>
                            <Tag value={selectedIncident.alert_count.toString()} severity="info" />
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Claves de Correlación:</label>
                            <div>
                              {correlationKeys?.filter(key => key.incident_id === selectedIncident.id).length > 0 ? (
                                correlationKeys
                                  .filter(key => key.incident_id === selectedIncident.id)
                                  .map(key => (
                                    <Tag
                                      key={key.id}
                                      value={key.correlation_key}
                                      className="mr-2 mb-2"
                                      severity="success"
                                    />
                                  ))
                              ) : (
                                <span className="text-gray-500">No hay claves de correlación para este incidente</span>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                      {/* Notas de Trabajo */}
                      <div className="col-12 md:col-6">
                        <Card className="mb-3">
                          <h3 className='text-gray-900'>Notas de Trabajo</h3>
                          <div className="surface-50 p-3 border-round">
                            {workNotes
                              ?.filter(note => note.incident_id === selectedIncident.id)
                              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .map(note => (
                                <div key={note.id} className="mb-3 p-3 border-round bg-white">
                                  <div className="text-sm text-gray-500 mb-1">
                                    {new Date(note.created_at).toLocaleString()}
                                  </div>
                                  <div className="text-gray-900">
                                    {note.work_note}
                                  </div>
                                </div>
                              ))
                            }

                            {/* Alternativa mostrando mensaje si no hay notas */}
                            {workNotes?.filter(note => note.incident_id === selectedIncident.id).length === 0 && (
                              <div className="text-center text-gray-500 p-4">
                                No hay notas de trabajo para este incidente
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
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
                          field="start_time"
                          header="Fecha Creación"
                          style={{ width: '10%' }}
                          body={(rowData) => new Date(rowData.start_time).toLocaleString()}
                        />
                        <Column
                          field="end_time"
                          header="Fecha Finalización"
                          style={{ width: '10%' }}
                          body={(rowData) => new Date(rowData.end_time).toLocaleString()}
                        />
                        <Column
                          field="ci"
                          header="CI"
                          style={{ width: '10%' }}
                        />
                        <Column
                          field="error"
                          header="Descripción de error"
                          style={{ width: '30%' }}
                        />
                        <Column
                          field="category_error"
                          header="Categoría de Error"
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