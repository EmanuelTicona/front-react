import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { useIncidents } from '../../queries/useIncident';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { TabView, TabPanel } from 'primereact/tabview';
import '../incidentDetails.css';


const customTabStyle = {
  '.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link': {
    backgroundColor: '#ff4444',
    color: '#ffffff',
    borderColor: '#ff4444'
  },
  '.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus': {
    boxShadow: '0 0 0 0.2rem rgba(255, 68, 68, 0.2)'
  }
};

export default function BasicFilterDemo() {
  const { data: incidents, isLoading } = useIncidents();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<typeof incidents[0] | null>(null);

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
      <DataTable
        value={incidents || []}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={isLoading}
        globalFilterFields={["name", "status"]}
        header={header}
        emptyMessage="No incidents found."
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
        />
        <Column
          field="reopened_at"
          header="reopened_at"
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
        />
      </DataTable>
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles del Incidente"
        style={{ width: '80vw' }}
        modal
        className="incident-dialog"
      >
        {selectedIncident && (
          <TabView className="custom-tabs">
            <TabPanel header="Detalles" leftIcon="pi pi-info-circle">
              <div className="grid">
                {/* Sección Principal */}
                <div className="col-12 md:col-8">
                  <Card className="mb-3">
                    <div className="flex align-items-center mb-3">
                      <h2 className="text-xl m-0 mr-3">Incidente #{selectedIncident.id}</h2>
                      {getStateTag(selectedIncident.state)}
                    </div>
                    <div className="grid">
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3>Información Principal</h3>
                          <div className="mb-2">
                            <label className="font-bold">Host:</label>
                            <div>{selectedIncident.host}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">Grupo Asignado:</label>
                            <div>{selectedIncident.assigned_group}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">Grupos de Host:</label>
                            <div>{selectedIncident.hostgroups}</div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3>Detalles Técnicos</h3>
                          <div className="mb-2">
                            <label className="font-bold">Clase:</label>
                            <div>{selectedIncident.sys_class_name}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">ID Externo:</label>
                            <div>{selectedIncident.external_id}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold">Alertas Relacionadas:</label>
                            <Tag value={selectedIncident.num_alerts.toString()} severity="info" />
                          </div>
                        </Card>
                      </div>
                    </div>
                  </Card>

                  {/* Notas de Trabajo */}
                  {selectedIncident.work_notes && (
                    <Card className="mb-3">
                      <h3>Notas de Trabajo</h3>
                      <div className="surface-50 p-3 border-round">
                        {selectedIncident.work_notes}
                      </div>
                    </Card>
                  )}
                </div>

                {/* Timeline lateral */}
                <div className="col-12 md:col-4">
                  <Card className="h-full">
                    <h3>Línea de Tiempo</h3>
                    <Timeline
                      value={getTimelineEvents(selectedIncident)}
                      content={(item) => (
                        <div>
                          <small className="text-color-secondary">{item.date}</small>
                          <div className="font-bold">{item.status}</div>
                        </div>
                      )}
                    />
                  </Card>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Alertas Relacionadas" leftIcon="pi pi-bell">
              <div className="p-4">
                {/* Contenido de alertas relacionadas */}
                <p>Contenido de alertas relacionadas pendiente</p>
              </div>
            </TabPanel>
          </TabView>
        )}
      </Dialog>
    </div>
  );
}

// export default function BasicFilterDemo() {
//     const [customers, setCustomers] = useState<Customer[]>([]);
//     const [filters, setFilters] = useState<DataTableFilterMeta>({
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//         'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//         representative: { value: null, matchMode: FilterMatchMode.IN },
//         status: { value: null, matchMode: FilterMatchMode.EQUALS },
//         verified: { value: null, matchMode: FilterMatchMode.EQUALS }
//     });
//     const [loading, setLoading] = useState<boolean>(true);
//     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
//     const [representatives] = useState<Representative[]>([
//         { name: 'Amy Elsner', image: 'amyelsner.png' },
//         { name: 'Anna Fali', image: 'annafali.png' },
//         { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
//         { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
//         { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
//         { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
//         { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
//         { name: 'Onyama Limba', image: 'onyamalimba.png' },
//         { name: 'Stephen Shaw', image: 'stephenshaw.png' },
//         { name: 'XuXue Feng', image: 'xuxuefeng.png' }
//     ]);
//     const [statuses] = useState<string[]>(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

//     useEffect(() => {
//         CustomerService.getCustomersMedium().then((data: Customer[]) => {
//             setCustomers(getCustomers(data));
//             setLoading(false);
//         });
//     }, []);

//     const getCustomers = (data: Customer[]) => {
//         return [...(data || [])].map((d) => {
//             const newDate = new Date(d.date);
//             d.date = newDate.toString()

//             return d;
//         });
//     };

//     const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         const  _filters = { ...filters };
//         _filters['global'].value = value;
//         setFilters(_filters);
//         setGlobalFilterValue(value);
//     };

//     const renderHeader = () => {
//         return (
//             <div className="flex justify-content-end">
//                 <IconField iconPosition="left">
//                     <InputIcon className="pi pi-search" />
//                     <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
//                 </IconField>
//             </div>
//         );
//     };

//     const countryBodyTemplate = (rowData: Customer) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
//                 <span>{rowData.country.name}</span>
//             </div>
//         );
//     };

//     const representativeBodyTemplate = (rowData: Customer) => {
//         const representative = rowData.representative;

//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
//                 <span>{representative.name}</span>
//             </div>
//         );
//     };

//     const representativesItemTemplate = (option: Representative) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
//                 <span>{option.name}</span>
//             </div>
//         );
//     };

//     const statusBodyTemplate = (rowData: Customer) => {
//         return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
//     };

//     const statusItemTemplate = (option: string) => {
//         return <Tag value={option} severity={getSeverity(option)} />;
//     };

//     const verifiedBodyTemplate = (rowData: Customer) => {
//         return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified, 'false-icon pi-times-circle': !rowData.verified })}></i>;
//     };

//     const representativeRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return (
//             <MultiSelect
//                 value={options.value}
//                 options={representatives}
//                 itemTemplate={representativesItemTemplate}
//                 onChange={(e: MultiSelectChangeEvent) => options.filterApplyCallback(e.value)}
//                 optionLabel="name"
//                 placeholder="Any"
//                 className="p-column-filter"
//                 maxSelectedLabels={1}
//                 style={{ minWidth: '14rem' }}
//             />
//         );
//     };

//     const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return (
//             <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
//         );
//     };

//     const verifiedRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return <TriStateCheckbox value={options.value} onChange={(e: TriStateCheckboxChangeEvent) => options.filterApplyCallback(e.value)} />;
//     };

//     const header = renderHeader();

//     return (
//         <div className="card">
//             <DataTable value={customers} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
//                     globalFilterFields={['name', 'country.name', 'representative.name', 'status']} header={header} emptyMessage="No customers found.">
//                 <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
//                 <Column header="Country" filterField="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" />
//                 <Column header="Agent" filterField="representative" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
//                     body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} />
//                 <Column field="status" header="Status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
//                 <Column field="verified" header="Verified" dataType="boolean" style={{ minWidth: '6rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedRowFilterTemplate} />
//             </DataTable>
//         </div>
//     );
// }
