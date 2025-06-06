import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { useAlerts } from '../../queries/useAlert';
import { useIncidentById } from '../../queries/useIncident';
import { useEventAiopsByAlertId } from '../../queries/useEventAiops';
import { useEventDetailByAlertId } from '../../queries/useEventDetail';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function BasicFilterDemo() {
  const { data: alerts, isLoading } = useAlerts();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);

  const { data: relatedEvents, isLoading: eventsLoading } = useEventAiopsByAlertId(
    selectedAlert?.id ?? 0
  );

  const { data: relatedEventDetails, isLoading: eventDetailsLoading } = useEventDetailByAlertId(
    selectedAlert?.id ?? 0
  );
  console.log("Datos de event details:", relatedEventDetails);

  type EventType = {
    id: number;
    start_time: string;
    state?: string;
    ci?: string;
  };

  type EventDetailType = {
    id: number;
    event_time: string;
    state?: string;
    ci?: string;
  };

  const { data: relatedIncident, isLoading: incidentLoading } = useIncidentById(
    selectedAlert?.incident_id ?? 0
  );

  const onRowClick = (event: { data: typeof alerts[0] }) => {
    setSelectedAlert(event.data);
    setVisible(true);
  };
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
    deduplication_key: { value: null, matchMode: FilterMatchMode.CONTAINS },
    problem_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ci: { value: null, matchMode: FilterMatchMode.CONTAINS },
    class: { value: null, matchMode: FilterMatchMode.CONTAINS },
    state: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    incident_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    start_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    end_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    update_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    error: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const getStateTag = (state: string) => {
    const stateColors: Record<string, string> = {
      'OPEN': 'warning',
      'RESOLVED': 'success',
      'OK': 'success'
    };
    return <Tag value={state} severity={stateColors[state.toLowerCase()] || 'info'} />;
  };

  const getTimelineEvents = (events: EventType[] = []) => {
    return events.map(event => ({
      state: event.state || `Evento ${event.id}`,
      ci: event.ci || `Evento ${event.id}`,
      date: new Date(event.start_time).toLocaleString(),
      icon: 'pi pi-calendar',
      color: '#03A9F4'
    }));
  };

  const getTimelineEventDetails = (eventDetails: EventDetailType[] = []) => {
    return eventDetails.map(eventDetail => ({
      state: eventDetail.state || `Estado no disponible`,
      ci: eventDetail.ci || `CI no definido`,
      date: new Date(eventDetail.event_time).toLocaleString(),
      icon: 'pi pi-calendar',
      color: '#03A9F4'
    }));
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
        value={alerts || []}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={isLoading}
        globalFilterFields={["id", "ci"]}
        header={header}
        emptyMessage="No alerts found."
        onRowClick={onRowClick}
        selectionMode="single"
        scrollable
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
          field="problem_id"
          header="problem_id"
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
          body={(rowData) => rowData.end_time ? new Date(rowData.end_time).toLocaleString() : '-'}
        />
        <Column
          field="incident_id"
          header="incident_id"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="deduplication_key"
          header="deduplication_key"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
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
          field="status"
          header="status"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="update_time"
          header="update_time"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => rowData.update_time ? new Date(rowData.update_time).toLocaleString() : '-'}
        />
        <Column
          field="error"
          header="error"
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
      </div>
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles de la Alerta"
        style={{ width: '60vw', height: '500px' }}
        modal
        className="incident-dialog"
      >
        {selectedAlert && (
          <TabView className="custom-tabs">
            <TabPanel header="Detalles" leftIcon="pi pi-info-circle mr-2">
              <div className="grid">
                {/* Sección Principal */}
                <div className="col-12">
                  <Card className="mb-3">
                    <div className="flex align-items-center mb-3 w-full">
                      <h2 className="text-xl m-0 mr-3 text-gray-900">Alerta #{selectedAlert.id}</h2>
                      {getStateTag(selectedAlert.state)}
                    </div>
                    <div className="grid">
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className='text-gray-900'>Información Principal</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Incidente Relacionado:</label>
                            <div>{selectedAlert.incident_id}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">CI:</label>
                            <div>{selectedAlert.ci}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Clase:</label>
                            <div>{selectedAlert.class}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Clave de deduplicación:</label>
                            <div>{selectedAlert.deduplication_key}</div>
                          </div>
                        </Card>
                      </div>
                      {/* Timeline lateral */}
                      <div className="col-12 md:col-6">
                        {relatedEventDetails && relatedEventDetails.length > 0 && (
                          <Card className="w-full">
                            <h3 className='text-gray-900'>Línea de Tiempo de Eventos</h3>
                            <Timeline
                              className="flex justify-content-start align-content-start"
                              value={getTimelineEventDetails(relatedEventDetails)}
                              content={(item) => (
                                <div>
                                  <small className="text-color-secondary">{item.date}</small>
                                  <div className="font-bold">{item.state}</div>
                                  <div className="font-bold">{item.ci}</div>
                                </div>
                              )}
                            />
                          </Card>
                        )}
                      </div>
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className='text-gray-900'>Detalles Técnicos</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Error:</label>
                            <div>{selectedAlert.error}</div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Eventos Relacionados" leftIcon="pi pi-bell mr-2">
              <div className="p-4">
                {selectedAlert && (
                  <div>
                    {eventsLoading ? (
                      <div className="flex align-items-center justify-content-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                      </div>
                    ) : (
                      <DataTable
                        value={relatedEvents || []}
                        rows={5}
                        className="p-datatable-sm"
                      >
                        <Column
                          field="id"
                          header="ID Evento"
                          style={{ width: '20%' }}
                        />
                        <Column
                          field="category_error"
                          header="Error"
                          style={{ width: '20%' }}
                        />
                        <Column
                          field="state"
                          header="Estado"
                          style={{ width: '20%' }}
                        />
                        <Column
                          field="start_time"
                          header="Fecha Creación"
                          style={{ width: '20%' }}
                          body={(rowData) => new Date(rowData.created_at).toLocaleString()}
                        />
                      </DataTable>
                    )}
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel header="Incidente Relacionado" leftIcon="pi pi-exclamation-triangle mr-2">
              <div className="p-4">
                {selectedAlert && (
                  <div>
                    {incidentLoading ? (
                      <div className="flex align-items-center justify-content-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                      </div>
                    ) : (
                      <DataTable
                        value={relatedIncident || []}
                        rows={5}
                        className="p-datatable-sm"
                      >
                        <Column
                          field="id"
                          header="ID Incidente"
                          style={{ width: '20%' }}
                        />
                        <Column
                          field="start_time"
                          header="Fecha Creación"
                          style={{ width: '20%' }}
                          body={(rowData) => new Date(rowData.start_time).toLocaleString()}
                        />
                        <Column
                          field="update_time"
                          header="Fecha de Actualización"
                          style={{ width: '20%' }}
                          body={(rowData) => new Date(rowData.update_time).toLocaleString()}
                        />
                        <Column
                          field="end_time"
                          header="Fecha de Resolución"
                          style={{ width: '20%' }}
                          body={(rowData) => rowData.end_time ? new Date(rowData.end_time).toLocaleString() : '-'}
                        />
                        <Column
                          field="reopened_time"
                          header="Fecha de Reapertura"
                          style={{ width: '20%' }}
                          body={(rowData) => rowData.reopened_time ? new Date(rowData.reopened_time).toLocaleString() : '-'}
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