import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEvents } from '../../queries/useEvent';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

export default function BasicFilterDemo() {
    const { data: events, isLoading } = useEvents();
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.EQUALS },
        implementation: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category_error: { value: null, matchMode: FilterMatchMode.CONTAINS },
        host: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sys_class_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        num_events: { value: null, matchMode: FilterMatchMode.EQUALS },
        state: { value: null, matchMode: FilterMatchMode.EQUALS },
        alert_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        service_desc: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ip_monitoring: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
        summary: { value: null, matchMode: FilterMatchMode.CONTAINS },
        alertgroup: { value: null, matchMode: FilterMatchMode.CONTAINS },
        check: { value: null, matchMode: FilterMatchMode.CONTAINS },
        hostgroups: { value: null, matchMode: FilterMatchMode.CONTAINS },
        type: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    // const getSeverity = (status: string) => {
    //   switch (status) {
    //     case "unqualified":
    //       return "danger";
    //     case "qualified":
    //       return "success";a
    //     case "new":
    //       return "info";
    //     case "negotiation":
    //       return "warning";
    //     case "renewal":
    //       return null;
    //   }
    // };

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
                value={events || []}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={isLoading}
                globalFilterFields={["name", "status"]}
                header={header}
                emptyMessage="No events found."
            >
                <Column
                    field="id"
                    header="id"
                    sortable
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
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
                    field="alert_id"
                    header="alert_id"
                    sortable
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="alertgroup"
                    header="alertgroup"
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
                    field="category_error"
                    header="category_error"
                    sortable
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="check"
                    header="check"
                    sortable
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="hostgroups"
                    header="hostgroups"
                    sortable
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="ip_monitoring"
                    header="ip_monitoring"
                    sortable
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="service_desc"
                    header="service_desc"
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
                    field="summary"
                    header="summary"
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="type"
                    header="type"
                    sortable
                    filter
                    filterPlaceholder=""
                    style={{ minWidth: "12rem" }}
                />
            </DataTable>
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
