import React, { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useGroupsList } from '../../queries/useGroup';
import { useCiList } from '../../queries/useCi';
import { useCompaniesList } from '../../queries/useCompany';
import { useToolsList } from '../../queries/useTools';
import {
    useAiopsCompaniesList,
    useAddAiopsCompany,
    useUpdateAiopsCompany,
    useSoftDeleteAiopsCompany,
    useGroupMappings, useAddGroupMapping, useDeleteGroupMapping
} from '../../queries/useAiopsCompany';
import { useQueryClient } from '@tanstack/react-query';

export default function AiopsCompanyTable() {
    const { data: aiops_companies, isLoading } = useAiopsCompaniesList();
    const { data: companies } = useCompaniesList();
    const { data: tools } = useToolsList();
    const { data: groups } = useGroupsList();
    const { data: cis } = useCiList();
    const addCompanyMutation = useAddAiopsCompany();
    const updateCompanyMutation = useUpdateAiopsCompany();
    const deleteCompanyMutation = useSoftDeleteAiopsCompany();

    const queryClient = useQueryClient();

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const { data: groupMappings } = useGroupMappings();
    const addGroupMappingMutation = useAddGroupMapping();
    const deleteGroupMappingMutation = useDeleteGroupMapping();
    const [visible, setVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);

    const [newGroupMapping, setNewGroupMapping] = useState({
        identifier: '',
        group_id: '',
    });

    const [newCompany, setNewCompany] = useState({
        status: 'active',
        company_id: 0,
        itsm_tool_id: undefined as number | undefined,
        default_group_id: undefined as number | undefined,
        default_ci_id: undefined as number | undefined,
    });

    const [updatedCompany, setUpdatedCompany] = useState({
        id: 0,
        company_id: undefined as number | undefined,
        itsm_tool_id: undefined as number | undefined | null,
        default_group_id: undefined as number | undefined | null,
        default_ci_id: undefined as number | undefined,
    });

    const toast = React.useRef<Toast>(null);

    const onRowClick = (event: { data: any }) => {
        setSelectedCompany(event.data);
        setVisible(true);
    };

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.EQUALS },
        company_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleAddGroupMapping = () => {
        if (selectedCompany) {
            addGroupMappingMutation.mutate(
                { aiops_companyId: selectedCompany.id, data: newGroupMapping },
                {
                    onSuccess: () => {
                        setNewGroupMapping({ identifier: '', group_id: '' }); // Reset form
                        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Group Mapping agregado correctamente', life: 3000 });
                    },
                    onError: () => {
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al agregar el Group Mapping', life: 3000 });
                    },
                }
            );
        }
    };

    const handleDeleteGroupMapping = (id: number) => {
        deleteGroupMappingMutation.mutate(id, {
            onSuccess: () => {
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Group Mapping eliminado correctamente', life: 3000 });
            },
            onError: () => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el Group Mapping', life: 3000 });
            },
        });
    };

    const handleAddCompany = () => {
        addCompanyMutation.mutate(newCompany, {
            onSuccess: () => {
                setIsAddDialogVisible(false);
                setNewCompany({
                    status: 'active',
                    company_id: 0,
                    itsm_tool_id: undefined,
                    default_group_id: undefined,
                    default_ci_id: undefined
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Empresa AiOps creada correctamente',
                    life: 3000
                });
            },
            onError: () => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al crear empresa AiOps',
                    life: 3000
                });
            }
        });
    };

    const handleEditCompany = () => {
        if (selectedCompany) {
            updateCompanyMutation.mutate({
                id: selectedCompany.id,
                company_id: updatedCompany.company_id,
                itsm_tool_id: updatedCompany.itsm_tool_id,
                default_group_id: updatedCompany.default_group_id,
                default_ci_id: updatedCompany.default_ci_id,
            }, {
                onSuccess: () => {
                    setIsEditDialogVisible(false);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Empresa actualizada correctamente',
                        life: 3000
                    });
                },
                onError: () => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar empresa',
                        life: 3000
                    });
                }
            });
        }
    };

    const handleDeleteCompany = (id: number) => {
        deleteCompanyMutation.mutate(id, {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Empresa marcada como inactiva',
                    life: 3000
                });
            },
            onError: () => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al desactivar empresa',
                    life: 3000
                });
            }
        });
    };

    const groupMap = (groups ?? []).reduce((map, group) => {
        map[group.id] = group.short_name;
        return map;
    }, {} as Record<number, string>);

    const ciMap = (cis ?? []).reduce((map, ci) => {
        map[ci.id] = ci.name;
        return map;
    }, {} as Record<number, string>);

    const companyMap = (companies ?? []).reduce((map, company) => {
        map[company.id] = company.name;
        return map;
    }, {} as Record<number, string>);

    const toolMap = (tools ?? []).reduce((map, tool) => {
        map[tool.id] = tool.name;
        return map;
    }, {} as Record<number, string>);

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end align-items-center">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Buscar empresas AiOps..."
                    />
                </IconField>
                <Button
                    label="Agregar Empresa AiOps"
                    icon="pi pi-plus"
                    className="ml-3"
                    onClick={() => setIsAddDialogVisible(true)}
                />
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="card" style={{ height: "1000px", display: "flex", flexDirection: "column" }}>
                <DataTable
                    value={aiops_companies || []}
                    paginator
                    rows={10}
                    dataKey="id"
                    filters={filters}
                    filterDisplay="row"
                    loading={isLoading}
                    globalFilterFields={["id", "company_id", "status"]}
                    header={header}
                    emptyMessage="No se encontraron empresas AiOps."
                    onRowClick={onRowClick}
                    selectionMode="single"
                    scrollHeight="flex"
                    style={{ flex: 1 }}
                >
                    <Column field="id" header="ID" sortable filter filterPlaceholder="" style={{ minWidth: "10rem" }} />
                    <Column field="status" header="Estado" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
                    <Column
                        field="company_id"
                        header="Empresa"
                        sortable
                        filter
                        style={{ minWidth: "12rem" }}
                        body={(rowData) => {
                            const companyName = rowData.company_id ? companyMap[rowData.company_id] : undefined;
                            return companyName ?? "Unknown";
                        }}
                    />

                    <Column
                        field="itsm_tool_id"
                        header="Herramienta ITSM"
                        sortable
                        filter
                        style={{ minWidth: "12rem" }}
                        body={(rowData) => {
                            const toolName = rowData.itsm_tool_id ? toolMap[rowData.itsm_tool_id] : undefined;
                            return toolName ?? "Unknown";
                        }}
                    />
                    <Column
                        field="default_group_id"
                        header="Grupo por Defecto"
                        sortable
                        filter
                        style={{ minWidth: "12rem" }}
                        body={(rowData) => {
                            const groupName = rowData.default_group_id ? groupMap[rowData.default_group_id] : undefined;
                            return groupName ?? "Unknown";
                        }}
                    />
                    <Column
                        field="default_ci_id"
                        header="CI por Defecto"
                        sortable
                        filter
                        style={{ minWidth: "12rem" }}
                        body={(rowData) => {
                            const ciName = rowData.default_ci_id ? ciMap[rowData.default_ci_id] : undefined;
                            return ciName ?? "Unknown";
                        }}
                    />
                    <Column
                        body={(rowData) => (
                            <div>
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-text"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCompany(rowData);
                                        setUpdatedCompany({
                                            id: rowData.id,
                                            company_id: rowData.company_id,
                                            itsm_tool_id: rowData.itsm_tool_id,
                                            default_group_id: rowData.default_group_id,
                                            default_ci_id: rowData.default_ci_id,
                                        });
                                        setIsEditDialogVisible(true);
                                    }}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-text p-button-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCompany(rowData.id);
                                    }}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </div>

            {/* Diálogo para agregar empresa AiOps */}
            <Dialog
                visible={isAddDialogVisible}
                onHide={() => setIsAddDialogVisible(false)}
                header="Agregar Empresa AiOps"
                style={{ width: '50vw' }}
                modal
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="company_id">Empresa</label>
                        <Dropdown
                            id="company_id"
                            value={newCompany.company_id}
                            options={companies?.map((company) => ({ label: company.name, value: company.id })) || []}
                            onChange={(e) => setNewCompany({ ...newCompany, company_id: e.value })}
                            placeholder="Selecciona una empresa"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="status">Estado</label>
                        <InputText
                            id="status"
                            value={newCompany.status}
                            onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value })}
                            required
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="itsm_tool_id">Herramienta ITSM</label>
                        <Dropdown
                            id="itsm_tool_id"
                            value={newCompany.itsm_tool_id}
                            options={tools?.map((tool) => ({ label: tool.name, value: tool.id })) || []}
                            onChange={(e) => setNewCompany({ ...newCompany, itsm_tool_id: e.value })}
                            placeholder="Selecciona una herramienta"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="default_group_id">Grupo por Defecto</label>
                        <Dropdown
                            id="group_id"
                            value={newCompany.default_group_id}
                            options={
                                groups
                                    ?.filter((group) => group.company_id === newCompany.company_id)
                                    .map((group) => ({ label: group.short_name, value: group.id })) || []
                            }
                            onChange={(e) => setNewCompany({ ...newCompany, default_group_id: e.value })}
                            placeholder="Selecciona un grupo"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="default_group_id">CI por Defecto</label>
                        <Dropdown
                            id="ci_id"
                            value={newCompany.default_ci_id}
                            options={
                                cis
                                    ?.filter((ci) => ci.flag_standard === 1)
                                    .map((ci) => ({ label: ci.name, value: ci.id })) || []
                            }
                            onChange={(e) => setNewCompany({ ...newCompany, default_ci_id: e.value })}
                            placeholder="Selecciona un CI"
                        />
                    </div>
                    <Button
                        label="Guardar"
                        onClick={handleAddCompany}
                        loading={addCompanyMutation.isPending}
                    />
                </div>
            </Dialog>

            {/* Diálogo para editar empresa */}
            <Dialog
                visible={isEditDialogVisible}
                onHide={() => setIsEditDialogVisible(false)}
                header={`Editar Empresa AiOps #${selectedCompany?.id}`}
                style={{ width: '50vw' }}
                modal
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="edit_company_id">Empresa</label>
                        <Dropdown
                            id="company_id"
                            value={updatedCompany.company_id}
                            options={companies?.map((company) => ({ label: company.name, value: company.id })) || []}
                            onChange={(e) => setUpdatedCompany({ ...updatedCompany, company_id: e.value })}
                            placeholder="Selecciona una empresa"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="edit_itsm_tool_id">Herramienta ITSM</label>
                        <Dropdown
                            id="itsm_tool_id"
                            value={updatedCompany.itsm_tool_id}
                            options={tools?.map((tool) => ({ label: tool.name, value: tool.id })) || []}
                            onChange={(e) => setUpdatedCompany({ ...updatedCompany, itsm_tool_id: e.value })}
                            placeholder="Selecciona una herramienta"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="edit_default_group_id">Grupo por Defecto</label>
                        <Dropdown
                            id="group_id"
                            value={updatedCompany.default_group_id}
                            options={
                                groups
                                    ?.filter(group => group.company_id === updatedCompany.company_id)
                                    .map(group => ({ label: group.short_name, value: group.id })) || []
                            }
                            onChange={(e) => setUpdatedCompany({ ...updatedCompany, default_group_id: e.value })}
                            placeholder="Selecciona un grupo"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="edit_default_ci_id">CI por Defecto</label>
                        <Dropdown
                            id="ci_id"
                            value={updatedCompany.default_ci_id}
                            options={
                                cis
                                    ?.filter((ci) => ci.flag_standard === 1 && ci.company_id === updatedCompany.company_id)
                                    .map((ci) => ({ label: ci.name, value: ci.id })) || []
                            }
                            onChange={(e) =>
                                setUpdatedCompany({ ...updatedCompany, default_ci_id: e.value })
                            }
                            placeholder="Selecciona un CI"
                        />
                    </div>
                    <Button
                        label="Guardar Cambios"
                        onClick={handleEditCompany}
                        loading={updateCompanyMutation.isPending}
                    />
                </div>
            </Dialog>

            {/* Diálogo para ver detalles de la empresa AiOps */}
            <Dialog
                visible={visible}
                onHide={() => setVisible(false)}
                header="Detalles de la Empresa AiOps"
                style={{ width: '60vw', height: '500px' }}
                modal
            >
                {selectedCompany && (
                    <TabView>
                        <TabPanel header="Detalles" leftIcon="pi pi-info-circle mr-2">
                            <div className="grid">
                                <div className="col-12">
                                    <Card className="mb-3">
                                        <div className="flex align-items-center mb-3 w-full">
                                            <h2 className="text-xl m-0 mr-3 text-gray-900">Empresa AiOps #{selectedCompany.id}</h2>
                                        </div>
                                        <div className="mb-2">
                                            <label className="font-bold text-gray-900">Estado:</label>
                                            <div>{selectedCompany.status}</div>
                                        </div>
                                        <div className="mb-2">
                                            <label className="font-bold text-gray-900">Empresa:</label>
                                            <div>{selectedCompany.company_id}</div>
                                        </div>
                                        <div className="mb-2">
                                            <label className="font-bold text-gray-900">Herramienta ITSM:</label>
                                            <div>{selectedCompany.itsm_tool_id || 'No especificado'}</div>
                                        </div>
                                        <div className="mb-2">
                                            <label className="font-bold text-gray-900">Grupo por Defecto:</label>
                                            <div>{selectedCompany.default_group_id || 'No especificado'}</div>
                                        </div>
                                        <div className="mb-2">
                                            <label className="font-bold text-gray-900">CI por Defecto:</label>
                                            <div>{selectedCompany.default_ci_id || 'No especificado'}</div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </TabPanel>
                        {/* TAB para editar grupos */}
                        <TabPanel header="Editar Grupos" leftIcon="pi pi-pencil mr-2">
                            <div className="p-fluid">
                                <div className="p-field">
                                    <label htmlFor="identifier">Identificador</label>
                                    <InputText
                                        id="identifier"
                                        value={newGroupMapping.identifier}
                                        onChange={(e) => setNewGroupMapping({ ...newGroupMapping, identifier: e.target.value })}
                                    />
                                </div>
                                <div className="p-field">
                                    <label htmlFor="group_id">Group</label>
                                    <Dropdown
                                        id="group_id"
                                        value={newGroupMapping.group_id}
                                        options={
                                            groups
                                                ?.filter(group => group.company_id === selectedCompany.company_id)
                                                .map(group => ({ label: group.short_name, value: group.id })) || []
                                        }
                                        onChange={(e) => setNewGroupMapping({ ...newGroupMapping, group_id: e.value })}
                                        placeholder="Selecciona un grupo"
                                    />
                                </div>
                                <Button label="Agregar Group Mapping" onClick={handleAddGroupMapping} />
                            </div>
                            <DataTable
                                value={groupMappings?.filter((gm) => gm.aiops_company_id === selectedCompany.id) || []}
                                emptyMessage="No hay group mappings para esta empresa aiops."
                            >
                                <Column field="identifier" header="Identificador" />
                                <Column
                                    field="group_id"
                                    header="Group"
                                    body={(rowData) => groupMap[rowData.group_id] || rowData.group_id}
                                />
                                <Column
                                    body={(rowData) => (
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-text p-button-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteGroupMapping(rowData.id);
                                            }}
                                        />
                                    )}
                                />
                            </DataTable>
                        </TabPanel>
                    </TabView>
                )}
            </Dialog>
        </div>
    );
}