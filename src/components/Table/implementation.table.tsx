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
import {
  useImplementations, useEditImplementationGroupField, useCreateWebhook, useDeleteWebhook, useEditImplementationGroupDefault,
  useGroupMappings, useAddGroupMapping, useDeleteGroupMapping, useAddStructure, useDeleteStructure, useEditStructure, useGetWebhookToken
} from '../../queries/useImplementation';
import { useCompaniesList, useCompanyById } from '../../queries/useCompany';
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
  const editGroupDefaultMutation = useEditImplementationGroupDefault();
  const createWebhookMutation = useCreateWebhook();
  const deleteWebhookMutation = useDeleteWebhook();
  const addGroupMappingMutation = useAddGroupMapping();
  const deleteGroupMappingMutation = useDeleteGroupMapping();
  const addStructureMutation = useAddStructure();
  const editStructureMutation = useEditStructure();
  const deleteStructureMutation = useDeleteStructure();
  const queryClient = useQueryClient();

  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedImplementation, setSelectedImplementation] = useState<typeof implementations[0] | null>(null);
  const [updatedGroupField, setUpdatedGroupField] = useState<string>('');
  const [updatedGroupDefault, setUpdatedGroupDefault] = useState<number | null>(null);
  const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isAddStructureDialogVisible, setIsAddStructureDialogVisible] = useState(false);
  const [isEditStructureDialogVisible, setIsEditStructureDialogVisible] = useState(false);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const getWebhookToken = useGetWebhookToken();
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

  const fetchToken = async () => {
    try {
      const response = await getWebhookToken.mutateAsync(selectedImplementation.service_name);
      if (response.success) {
        setToken(response.token || "");
      } else {
        console.error("Error fetching token:", response.error);
      }
    } catch (error) {
      console.error("Error fetching webhook token:", error);
    }
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

  const handleSaveGroupDefault = () => {
    if (selectedImplementation && updatedGroupDefault !== null) {
      editGroupDefaultMutation.mutate(
        { id: selectedImplementation.id, groupDefault: updatedGroupDefault },
        {
          onSuccess: () => {
            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Campo group_default actualizado correctamente",
              life: 3000,
            });
            queryClient.invalidateQueries({ queryKey: ["implementations"] }); // Refrescar datos
          },
        }
      );
    }
  };

  const handleAddStructure = () => {
    if (jsonFile && selectedImplementation) {
      addStructureMutation.mutate(
        { implementationId: selectedImplementation.id, file: jsonFile },
        {
          onSuccess: () => {
            setIsAddStructureDialogVisible(false);
            setJsonFile(null); // Reset file input
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estructura agregada correctamente', life: 3000 });

            // Actualizar la caché de React Query
            queryClient.invalidateQueries({ queryKey: ['implementations-repo'] });
          },
        }
      );
    }
  };

  const handleEditStructure = () => {
    if (jsonFile && selectedImplementation) {
      editStructureMutation.mutate(
        { implementationId: selectedImplementation.id, file: jsonFile },
        {
          onSuccess: () => {
            setIsEditStructureDialogVisible(false);
            setJsonFile(null); // Reset file input
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estructura editada correctamente', life: 3000 });

            // Actualizar la caché de React Query
            queryClient.invalidateQueries({ queryKey: ['implementations-repo'] });
          },
        }
      );
    }
  };

  const handleDeleteStructure = () => {
    if (selectedImplementation) {
      deleteStructureMutation.mutate(selectedImplementation.id, {
        onSuccess: () => {
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estructura eliminada correctamente', life: 3000 });

          // Actualizar la caché de React Query
          queryClient.invalidateQueries({ queryKey: ['implementations-repo'] });
        },
      });
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
      onError: (error) => {
        let errorMessage = 'Error al crear el webhook';

        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error; // Capturar mensaje del backend
        }

        toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
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
    ?.filter(company => company.parent !== null) // Filtra solo las empresas que tienen parent
    .sort((a, b) => {
      // Primero las compañías sin parent (padres)
      if (a.parent === null && b.parent !== null) return -1;
      if (a.parent !== null && b.parent === null) return 1;
      return 0;
    })
    .map((c) => ({
      label: c.parent ? `${companyMap[c.parent]} - ${c.name}` : c.name, // Formato: "parent - company" o solo "company"
      value: c.id,
    })) || [];

  const integrationMap = integrations?.reduce((map, integration) => {
    map[integration.id] = integration.name;
    return map;
  }, {} as Record<number, string>);

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
            field="company_id"
            header="Empresa"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
            body={(rowData) => companyMap[rowData.company_id] || "Unknown"}
          />
          <Column
            field="integration_id"
            header="Integración"
            sortable
            filter
            filterPlaceholder=""
            style={{ minWidth: "12rem" }}
            body={(rowData) => integrationMap[rowData.integration_id] || "Unknown"}
          />
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
                          <div className="mb-2 flex items-center">
                            <label className="font-bold text-gray-900 mr-2">Token:</label>
                            <div className="bg-gray-200 p-2 rounded text-gray-700">
                              {token ? (isRevealed ? token : "••••••••••") : "No disponible"}
                            </div>
                            <Button className="ml-2" onClick={() => {
                              if (!token) {
                                fetchToken();
                              } else {
                                setIsRevealed(!isRevealed);
                              }
                            }}>
                              {token ? (isRevealed ? "Ocultar" : "Ver Token") : "Obtener Token"}
                            </Button>
                          </div>
                        </Card>
                        {/* Card para la estructura */}
                        <Card className="mb-3" style={{ flex: 1 }}>
                          <h3 className="text-gray-900">Estructura</h3>
                          {selectedImplementation.structure_data ? (
                            <pre>{JSON.stringify(selectedImplementation.structure_data, null, 2)}</pre>
                          ) : (
                            <p>No hay estructura definida.</p>
                          )}
                        </Card>
                      </div>
                    </div>
                    <div className="flex justify-content-end mt-3">
                      {selectedImplementation.structure_data ? (
                        <>
                          <Button
                            label="Editar Estructura"
                            icon="pi pi-pencil"
                            className="p-button-warning mr-2"
                            onClick={() => setIsEditStructureDialogVisible(true)}
                          />
                          <Button
                            label="Eliminar Estructura"
                            icon="pi pi-trash"
                            className="p-button-danger"
                            onClick={handleDeleteStructure}
                          />
                        </>
                      ) : (
                        <Button
                          label="Agregar Estructura"
                          icon="pi pi-plus"
                          onClick={() => setIsAddStructureDialogVisible(true)}
                        />
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>

            {/* TAB para editar group_field */}
            <TabPanel header="Editar Grupos" leftIcon="pi pi-pencil mr-2">
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

              <div className="p-fluid mt-5">
                <div className="p-field">
                  <label htmlFor="groupDefault">Group Default</label>
                  <Dropdown
                    id="groupDefault"
                    value={updatedGroupDefault}
                    options={groups?.map((group) => ({ label: group.short_name, value: group.id })) || []}
                    onChange={(e) => setUpdatedGroupDefault(e.value)}
                    placeholder="Selecciona un grupo por defecto"
                  />
                </div>
                <Button label="Guardar" onClick={handleSaveGroupDefault} />
              </div>

              <div className="p-fluid mt-5">
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

      {/* Diálogo para agregar estructura */}
      <Dialog
        visible={isAddStructureDialogVisible}
        onHide={() => setIsAddStructureDialogVisible(false)}
        header="Agregar Estructura"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="jsonFile">Subir archivo JSON</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button label="Guardar" onClick={handleAddStructure} />
        </div>
      </Dialog>

      {/* Diálogo para editar estructura */}
      <Dialog
        visible={isEditStructureDialogVisible}
        onHide={() => setIsEditStructureDialogVisible(false)}
        header="Editar Estructura"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="jsonFile">Subir archivo JSON</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button label="Guardar" onClick={handleEditStructure} />
        </div>
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
              options={companyOptions} // Usa las opciones filtradas
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