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
import { useEventByAlertId } from '../../queries/useEvent';
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

  const { data: relatedEvents, isLoading: eventsLoading } = useEventByAlertId(
    selectedAlert?.id ?? 0
  );

  type EventType = {
    id: number;
    created_at: string;
    status?: string;
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
    implementation: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dedupe_key: { value: null, matchMode: FilterMatchMode.CONTAINS },
    host: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sys_class_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    num_events: { value: null, matchMode: FilterMatchMode.EQUALS },
    state: { value: null, matchMode: FilterMatchMode.EQUALS },
    incident_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    last_event_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    resolved_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    summary: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const getStateTag = (state: string) => {
    const stateColors: Record<string, string> = {
      'OPEN': 'warning',
      'RESOLVED': 'success'
    };
    return <Tag value={state} severity={stateColors[state.toLowerCase()] || 'info'} />;
  };

  const getTimelineEvents = (events: EventType[] = []) => {
    return events.map(event => ({
      status: event.status || `Evento ${event.id}`,
      date: new Date(event.created_at).toLocaleString(),
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
      <DataTable
        value={alerts || []}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={isLoading}
        globalFilterFields={["id", "host"]}
        header={header}
        emptyMessage="No alerts found."
        onRowClick={onRowClick}
        selectionMode="single"
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
          field="created_at"
          header="created_at"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => new Date(rowData.created_at).toLocaleString()}
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
          field="last_event_date"
          header="last_event_date"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => new Date(rowData.last_event_date).toLocaleString()}
        />
        <Column
          field="num_events"
          header="num_events"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "10rem" }}
        />
        <Column
          field="dedupe_key"
          header="dedupe_key"
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
          field="resolved_at"
          header="resolved_at"
          sortable
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
          body={(rowData) => rowData.resolved_at ? new Date(rowData.resolved_at).toLocaleString() : ''}
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
          field="summary"
          header="summary"
          filter
          filterPlaceholder=""
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles de la Alerta"
        style={{ width: '60vw', height: '700px' }}
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
                      <h2 className="text-xl m-0 mr-3">Alerta #{selectedAlert.id}</h2>
                      {getStateTag(selectedAlert.state)}
                    </div>
                    <div className="grid">
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3>Información Principal</h3>
                          <div className="mb-2">
                            <label className="font-bold">Incidente Relacionado:</label>
                            <div>{selectedAlert.incident_id}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">CI:</label>
                            <div>{selectedAlert.host}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">Clase:</label>
                            <div>{selectedAlert.sys_class_name}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">Clave de deduplicación:</label>
                            <div>{selectedAlert.dedupe_key}</div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3>Detalles Técnicos</h3>
                          <div className="mb-2">
                            <label className="font-bold">Descripción:</label>
                            <div>{selectedAlert.summary}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">Error:</label>
                            <div>{selectedAlert.category_error}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">Número de Eventos:</label>
                            <Tag value={selectedAlert.num_events.toString()} severity="info" />
                          </div>
                        </Card>
                      </div>

                      {/* Timeline lateral */}
                      <div className="col-12 md:col-6">
                        {relatedEvents && relatedEvents.length > 0 && (
                          <Card className="w-full">
                            <h3>Línea de Tiempo de Eventos</h3>
                            <Timeline
                              className="flex justify-content-start align-content-start"
                              value={getTimelineEvents(relatedEvents)}
                              content={(item) => (
                                <div>
                                  <small className="text-color-secondary">{item.date}</small>
                                  <div className="font-bold">{item.status}</div>
                                </div>
                              )}
                            />
                          </Card>
                        )}
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
                          style={{ width: '40%' }}
                        />
                        <Column
                          field="created_at"
                          header="Fecha Creación"
                          style={{ width: '60%' }}
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
                          field="created_at"
                          header="Fecha Creación"
                          style={{ width: '20%' }}
                          body={(rowData) => new Date(rowData.created_at).toLocaleString()}
                        />
                        <Column
                          field="updated_at"
                          header="Fecha de Actualización"
                          style={{ width: '20%' }}
                          body={(rowData) => new Date(rowData.updated_at).toLocaleString()}
                        />
                        <Column
                          field="resolved_at"
                          header="Fecha de Resolución"
                          style={{ width: '20%' }}
                          body={(rowData) => rowData.resolved_at ? new Date(rowData.resolved_at).toLocaleString() : '-'}
                        />
                        <Column
                          field="reopened_at"
                          header="Fecha de Reapertura"
                          style={{ width: '20%' }}
                          body={(rowData) => rowData.reopened_at ? new Date(rowData.reopened_at).toLocaleString() : '-'}
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