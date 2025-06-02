import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { useEventAiops } from '../../queries/useEventAiops';
import { useAlertById } from '../../queries/useAlert';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function BasicFilterDemo() {
    const { data: events, isLoading } = useEventAiops();
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [visible, setVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

    const { data: relatedAlert, isLoading: alertLoading } = useAlertById(
        selectedEvent?.alert_id ?? 0
    );
    const onRowClick = (event: { data: typeof events[0] }) => {
        setSelectedEvent(event.data);
        setVisible(true);
    };
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.EQUALS },
        start_time: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category_error: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ci: { value: null, matchMode: FilterMatchMode.CONTAINS },
        class: { value: null, matchMode: FilterMatchMode.CONTAINS },
        state: { value: null, matchMode: FilterMatchMode.EQUALS },
        alert_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        error: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
        deduplication_key: { value: null, matchMode: FilterMatchMode.CONTAINS },
        problem_id: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const getStateTag = (state: string) => {
        const stateColors: Record<string, string> = {
            'critical': 'danger',
            'warning': 'warning',
            'open': 'warning',
            'ok': 'success',
            'resolved': 'success'
        };
        return <Tag value={state} severity={stateColors[state.toLowerCase()] || 'info'} />;
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
                    value={events || []}
                    paginator
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="row"
                    loading={isLoading}
                    globalFilterFields={["id", "ci"]}
                    header={header}
                    emptyMessage="No events found."
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
                        body={(rowData) => new Date(rowData.end_time).toLocaleString()}
                    />
                    <Column
                        field="alert_id"
                        header="alert_id"
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
                        field="category_error"
                        header="category_error"
                        sortable
                        filter
                        filterPlaceholder=""
                        style={{ minWidth: "12rem" }}
                    />
                    <Column
                        field="error"
                        header="error"
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
                        field="deduplication_key"
                        header="deduplication_key"
                        sortable
                        filter
                        filterPlaceholder=""
                        style={{ minWidth: "12rem" }}
                    />
                </DataTable>
            </div>
            <Dialog
                visible={visible}
                onHide={() => setVisible(false)}
                header="Detalles del Evento"
                style={{ width: '60vw', height: '500px' }}
                modal
                className="incident-dialog"
            >
                {selectedEvent && (
                    <TabView className="custom-tabs">
                        <TabPanel header="Detalles" leftIcon="pi pi-info-circle mr-2">
                            <div className="grid">
                                {/* Sección Principal */}
                                <div className="col-12">
                                    <Card className="mb-3">
                                        <div className="flex align-items-center mb-3 w-full">
                                            <h2 className="text-xl m-0 mr-3 text-gray-900">Evento #{selectedEvent.id}</h2>
                                            {getStateTag(selectedEvent.state)}
                                        </div>
                                        <div className="grid">
                                            <div className="col-12 md:col-6">
                                                <Card className="surface-50">
                                                    <h3 className='text-gray-900'>Información Principal</h3>
                                                    <div className="mb-2">
                                                        <label className="font-bold text-gray-900">Alerta Relacionado:</label>
                                                        <div>{selectedEvent.alert_id}</div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="font-bold text-gray-900">CI:</label>
                                                        <div>{selectedEvent.ci}</div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="font-bold text-gray-900">Clase:</label>
                                                        <div>{selectedEvent.class}</div>
                                                    </div>
                                                </Card>
                                            </div>
                                            <div className="col-12 md:col-6">
                                                <Card className="surface-50">
                                                    <h3 className='text-gray-900'>Detalles Técnicos</h3>
                                                    <div className="mb-2">
                                                        <label className="font-bold text-gray-900">Categoría de Error:</label>
                                                        <div>{selectedEvent.category_error}</div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="font-bold text-gray-900">Error:</label>
                                                        <div>{selectedEvent.error}</div>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel header="Alertas Relacionadzs" leftIcon="pi pi-bell mr-2">
                            <div className="p-4">
                                {selectedEvent && (
                                    <div>
                                        {alertLoading ? (
                                            <div className="flex align-items-center justify-content-center">
                                                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                                            </div>
                                        ) : (
                                            <DataTable
                                                value={relatedAlert || []}
                                                rows={5}
                                                className="p-datatable-sm"
                                            >
                                                <Column
                                                    field="id"
                                                    header="ID Alerta"
                                                    style={{ width: '20%' }}
                                                />
                                                <Column
                                                    field="start_time"
                                                    header="Fecha Creación"
                                                    style={{ width: '40%' }}
                                                    body={(rowData) => new Date(rowData.start_time).toLocaleString()}
                                                />
                                                <Column
                                                    field="end_time"
                                                    header="Fecha de Finalización"
                                                    style={{ width: '40%' }}
                                                    body={(rowData) => new Date(rowData.end_time).toLocaleString()}
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