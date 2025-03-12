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
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { useImplementations, useEditImplementationGroupField, useCreateWebhook, useDeleteWebhook, useGroupMappings, useAddGroupMapping, useDeleteGroupMapping } from '../../queries/useImplementation';
import { useCompaniesList } from '../../queries/useCompany';
import { useGroupsList } from '../../queries/useGroup';
import { useIntegrations } from '../../queries/useIntegration';
import '../../incidentDetails.css';
import { useQueryClient } from '@tanstack/react-query';

export default function ImplementationComponent() {
  const { data: implementations, isLoading } = useImplementations();
  const { data: integrations } = useIntegrations();
  const { data: companies } = useCompaniesList();
  const { data: groups } = useGroupsList();
  const { data: groupMappings } = useGroupMappings();
  const editGroupFieldMutation = useEditImplementationGroupField();
  const createWebhookMutation = useCreateWebhook();
  const deleteWebhookMutation = useDeleteWebhook();
  const addGroupMappingMutation = useAddGroupMapping();
  const deleteGroupMappingMutation = useDeleteGroupMapping();
  const queryClient = useQueryClient();

  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedImplementation, setSelectedImplementation] = useState<typeof implementations[0] | null>(null);
  const [updatedGroupField, setUpdatedGroupField] = useState<string>('');
  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);
  const [newWebhookData, setNewWebhookData] = useState({
    webhook_name: '',
    integration_id: null as number | null,
    name: '',
    company_id: null as number | null,
  });
  const [newGroupMapping, setNewGroupMapping] = useState({
    identifier: '',
    group_id: '',
  });
  const toast = React.useRef<Toast>(null);

  const groupMap = groups?.reduce((map, group) => {
    map[group.id] = group.short_name;
    return map;
  }, {} as Record<number, string>);

  const onRowClick = (event: { data: typeof implementations[0] }) => {
    setSelectedImplementation(event.data);
    setUpdatedGroupField(event.data.group_field); // Inicializar el campo group_field
    setVisible(true);
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleSaveGroupField = () => {
    if (selectedImplementation) {
      editGroupFieldMutation.mutate(
        { id: selectedImplementation.id, groupField: updatedGroupField },
        {
          onSuccess: () => {
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Campo group_field actualizado correctamente', life: 3000 });
            queryClient.invalidateQueries({ queryKey: ['implementations'] }); // Refrescar datos
          },
        }
      );
    }
  };

  const handleCreateWebhook = () => {
    createWebhookMutation.mutate(newWebhookData, {
      onSuccess: () => {
        setIsCreateDialogVisible(false);
        setNewWebhookData({ webhook_name: '', integration_id: 0, name: '', company_id: 0 }); // Reset form
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Webhook creado correctamente', life: 3000 });
        queryClient.invalidateQueries({ queryKey: ['implementations'] }); // Refrescar datos
      },
      onError: () => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el webhook', life: 3000 });
      },
    });
  };

  const handleDeleteWebhook = () => {
    if (webhookToDelete) {
      deleteWebhookMutation.mutate(webhookToDelete, {
        onSuccess: () => {
          setIsDeleteDialogVisible(false);
          setWebhookToDelete(null); // Reset
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Webhook eliminado correctamente', life: 3000 });
          queryClient.invalidateQueries({ queryKey: ['implementations'] }); // Refrescar datos
        },
        onError: () => {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el webhook', life: 3000 });
        },
      });
    }
  };

  const handleAddGroupMapping = () => {
    if (selectedImplementation) {
      addGroupMappingMutation.mutate(
        { implementationId: selectedImplementation.id, data: newGroupMapping },
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
        </IconField>
        <Button
          label="Crear Webhook"
          icon="pi pi-plus"
          className="ml-3"
          onClick={() => setIsCreateDialogVisible(true)}
        />
      </div>
    );
  };

  const companyMap = companies?.reduce((map, company) => {
    map[company.id] = company.name;
    return map;
  }, {} as Record<number, string>);

  // Opciones para el Dropdown de compañías
  const companyOptions = companies
    ?.sort((a, b) => {
      // Primero las compañías sin parent (padres)
      if (a.parent === null && b.parent !== null) return -1;
      if (a.parent !== null && b.parent === null) return 1;
      return 0;
    })
    .map((c) => ({
      label: c.parent ? `${companyMap[c.parent]} - ${c.name}` : c.name, // Formato: "parent - company" o solo "company"
      value: c.id,
    })) || [];

  const header = renderHeader();

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="card" style={{ height: "1000px", display: "flex", flexDirection: "column" }}>
        <DataTable
          value={implementations || []}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          loading={isLoading}
          globalFilterFields={["id", "name"]}
          header={header}
          emptyMessage="No implementations found."
          onRowClick={onRowClick}
          selectionMode="single"
          scrollHeight="flex"
          style={{ flex: 1 }}
        >
          <Column field="id" header="ID" sortable filter filterPlaceholder="" style={{ minWidth: "10rem" }} />
          <Column field="name" header="Nombre" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
          <Column field="service_name" header="Servicio" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
          <Column field="status" header="Estado" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
          <Column field="group_field" header="Group Field" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
          <Column field="url" header="URL" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
          <Column
            body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setWebhookToDelete(rowData.name); // Asumimos que el nombre del webhook está en rowData.name
                  setIsDeleteDialogVisible(true);
                }}
              />
            )}
          />
        </DataTable>
      </div>

      {/* Diálogo para ver detalles de la implementación */}
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles de la Implementación"
        style={{ width: '60vw', height: '500px' }}
        modal
        className="incident-dialog"
      >
        {selectedImplementation && (
          <TabView className="custom-tabs">
            <TabPanel header="Detalles" leftIcon="pi pi-info-circle mr-2">
              <div className="grid">
                <div className="col-12">
                  <Card className="mb-3">
                    <div className="flex align-items-center mb-3 w-full">
                      <h2 className="text-xl m-0 mr-3 text-gray-900">Implementación #{selectedImplementation.id}</h2>
                    </div>
                    <div className="grid">
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className="text-gray-900">Información Principal</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Nombre:</label>
                            <div>{selectedImplementation.name}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Servicio:</label>
                            <div>{selectedImplementation.service_name}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Estado:</label>
                            <div>{selectedImplementation.status}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Group Field:</label>
                            <div>{selectedImplementation.group_field}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">URL:</label>
                            <div>{selectedImplementation.url}</div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>

            {/* TAB para editar group_field */}
            <TabPanel header="Editar Group Field" leftIcon="pi pi-pencil mr-2">
              <div className="p-fluid">
                <div className="p-field">
                  <label htmlFor="groupField">Group Field</label>
                  <InputText
                    id="groupField"
                    value={updatedGroupField}
                    onChange={(e) => setUpdatedGroupField(e.target.value)}
                  />
                </div>
                <Button label="Guardar" onClick={handleSaveGroupField} />
              </div>
            </TabPanel>

            {/* TAB para Group Mappings */}
            <TabPanel header="Group Mappings" leftIcon="pi pi-list mr-2">
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
                    options={groups?.map((group) => ({ label: group.short_name, value: group.id })) || []}
                    onChange={(e) => setNewGroupMapping({ ...newGroupMapping, group_id: e.value })}
                    placeholder="Selecciona un grupo"
                  />
                </div>
                <Button label="Agregar Group Mapping" onClick={handleAddGroupMapping} />
              </div>
              <DataTable
                value={groupMappings?.filter((gm) => gm.implementation_id === selectedImplementation.id) || []}
                emptyMessage="No hay group mappings para esta implementación."
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

      {/* Diálogo para crear un webhook */}
      <Dialog
        visible={isCreateDialogVisible}
        onHide={() => setIsCreateDialogVisible(false)}
        header="Crear Webhook"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="webhook_name">Nombre del Webhook</label>
            <InputText
              id="webhook_name"
              value={newWebhookData.webhook_name}
              onChange={(e) => setNewWebhookData({ ...newWebhookData, webhook_name: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="integration_id">Integración</label>
            <Dropdown
              id="integration_id"
              value={newWebhookData.integration_id}
              options={integrations?.map((i) => ({ label: i.name, value: i.id })) || []}
              onChange={(e) => setNewWebhookData({ ...newWebhookData, integration_id: e.value })}
              placeholder="Selecciona una integración"
            />
          </div>
          <div className="p-field">
            <label htmlFor="company_id">Compañía</label>
            <Dropdown
              id="company_id"
              value={newWebhookData.company_id}
              options={
                companies
                  ?.sort((a, b) => {
                    // Primero las compañías sin parent (padres)
                    if (a.parent === null && b.parent !== null) return -1;
                    if (a.parent !== null && b.parent === null) return 1;
                    return 0;
                  })
                  .map((c) => ({
                    label: c.parent ? `${companyMap[c.parent]} - ${c.name}` : c.name, // Formato: "parent - company" o solo "company"
                    value: c.id,
                  })) || []
              }
              onChange={(e) => setNewWebhookData({ ...newWebhookData, company_id: e.value })}
              placeholder="Selecciona una compañía"
            />
          </div>
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              value={newWebhookData.name}
              onChange={(e) => setNewWebhookData({ ...newWebhookData, name: e.target.value })}
            />
          </div>
          <Button label="Crear" onClick={handleCreateWebhook} />
        </div>
      </Dialog>
      {/* Diálogo para eliminar un webhook */}
      <Dialog
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        header="Eliminar Webhook"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <p>¿Estás seguro de que deseas eliminar el webhook "{webhookToDelete}"?</p>
          <div className="flex justify-content-end mt-3">
            <Button
              label="Cancelar"
              className="p-button-text"
              onClick={() => setIsDeleteDialogVisible(false)}
            />
            <Button
              label="Eliminar"
              className="p-button-danger"
              onClick={handleDeleteWebhook}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}