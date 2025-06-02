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
import { useIntegrations, useAddIntegration, useEditIntegration, useDeleteIntegration, useAddStructure, useEditStructure, useDeleteStructure } from '../../queries/useIntegration';
import '../../incidentDetails.css';
import { useQueryClient } from '@tanstack/react-query';

export default function BasicFilterDemo() {
  const { data: integrations, isLoading } = useIntegrations();
  const addIntegrationMutation = useAddIntegration();
  const editIntegrationMutation = useEditIntegration();
  const deleteIntegrationMutation = useDeleteIntegration();
  const addStructureMutation = useAddStructure();
  const editStructureMutation = useEditStructure();
  const deleteStructureMutation = useDeleteStructure();
  const queryClient = useQueryClient();

  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isAddStructureDialogVisible, setIsAddStructureDialogVisible] = useState(false);
  const [isEditStructureDialogVisible, setIsEditStructureDialogVisible] = useState(false);
  const [newIntegration, setNewIntegration] = useState<Omit<typeof integrations[0], 'id'>>({ name: '' });
  const [updatedIntegration, setUpdatedIntegration] = useState<Partial<typeof integrations[0]>>({});
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const toast = React.useRef<Toast>(null);

  const onRowClick = (event: { data: typeof integrations[0] }) => {
    setSelectedIntegration(event.data);
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

  const handleAddIntegration = () => {
    addIntegrationMutation.mutate(newIntegration, {
      onSuccess: () => {
        setIsAddDialogVisible(false);
        setNewIntegration({ name: '' }); // Reset form
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Integración agregada correctamente', life: 3000 });
      },
    });
  };

  const handleEditIntegration = () => {
    if (selectedIntegration) {
      editIntegrationMutation.mutate(
        { id: selectedIntegration.id, updatedIntegration },
        {
          onSuccess: () => {
            setIsEditDialogVisible(false);
            setUpdatedIntegration({}); // Reset form
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Integración editada correctamente', life: 3000 });
          },
        }
      );
    }
  };

  const handleDeleteIntegration = (id: number) => {
    deleteIntegrationMutation.mutate(id, {
      onSuccess: () => {
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Integración eliminada correctamente', life: 3000 });
      },
    });
  };

  const handleAddStructure = () => {
    if (jsonFile && selectedIntegration) {
      addStructureMutation.mutate(
        { integrationId: selectedIntegration.id, file: jsonFile },
        {
          onSuccess: () => {
            setIsAddStructureDialogVisible(false);
            setJsonFile(null); // Reset file input
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estructura agregada correctamente', life: 3000 });

            // Actualizar la caché de React Query
            queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
          },
        }
      );
    }
  };

  const handleEditStructure = () => {
    if (jsonFile && selectedIntegration) {
      editStructureMutation.mutate(
        { integrationId: selectedIntegration.id, file: jsonFile },
        {
          onSuccess: () => {
            setIsEditStructureDialogVisible(false);
            setJsonFile(null); // Reset file input
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estructura editada correctamente', life: 3000 });

            // Actualizar la caché de React Query
            queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
          },
        }
      );
    }
  };

  const handleDeleteStructure = () => {
    if (selectedIntegration) {
      deleteStructureMutation.mutate(selectedIntegration.id, {
        onSuccess: () => {
          toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Estructura eliminada correctamente', life: 3000 });

          // Actualizar la caché de React Query
          queryClient.invalidateQueries({ queryKey: ['integrations-repo'] });
        },
      });
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
        </IconField>
        <Button
          label="Agregar Integración"
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
          value={integrations || []}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          loading={isLoading}
          globalFilterFields={["id", "name"]}
          header={header}
          emptyMessage="No integrations found."
          onRowClick={onRowClick}
          selectionMode="single"
          scrollHeight="flex"
          style={{ flex: 1 }}
        >
          <Column field="id" header="id" sortable filter filterPlaceholder="" style={{ minWidth: "10rem" }} />
          <Column field="name" header="implementation" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
          <Column
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIntegration(rowData);
                    setUpdatedIntegration({ name: rowData.name });
                    setIsEditDialogVisible(true);
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-text p-button-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIntegration(rowData.id);
                  }}
                />
              </div>
            )}
          />
        </DataTable>
      </div>

      {/* Diálogo para agregar una integración */}
      <Dialog
        visible={isAddDialogVisible}
        onHide={() => setIsAddDialogVisible(false)}
        header="Agregar Integración"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              value={newIntegration.name}
              onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
            />
          </div>
          <Button label="Guardar" onClick={handleAddIntegration} />
        </div>
      </Dialog>

      {/* Diálogo para editar una integración */}
      <Dialog
        visible={isEditDialogVisible}
        onHide={() => setIsEditDialogVisible(false)}
        header="Editar Integración"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              value={updatedIntegration.name || ''}
              onChange={(e) => setUpdatedIntegration({ ...updatedIntegration, name: e.target.value })}
            />
          </div>
          <Button label="Guardar" onClick={handleEditIntegration} />
        </div>
      </Dialog>

      {/* Diálogo para ver detalles de la integración */}
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles de la Integración"
        style={{ width: '60vw', height: '500px' }}
        modal
        className="incident-dialog"
      >
        {selectedIntegration && (
          <TabView className="custom-tabs">
            <TabPanel header="Detalles" leftIcon="pi pi-info-circle mr-2">
              <div className="grid">
                <div className="col-12">
                  <div className="flex">
                    {/* Card para el nombre */}
                    <Card className="mb-3 mr-3" style={{ flex: 1 }}>
                      <div className="flex align-items-center mb-3 w-full">
                        <h2 className="text-xl m-0 mr-3 text-gray-900">Integración #{selectedIntegration.id}</h2>
                      </div>
                      <div className="mb-2">
                        <label className="font-bold text-gray-900">Nombre:</label>
                        <div>{selectedIntegration.name}</div>
                      </div>
                    </Card>

                    {/* Card para la estructura */}
                    <Card className="mb-3" style={{ flex: 1 }}>
                      <h3 className="text-gray-900">Estructura</h3>
                      {selectedIntegration.structure_data ? (
                        <pre>{JSON.stringify(selectedIntegration.structure_data, null, 2)}</pre>
                      ) : (
                        <p>No hay estructura definida.</p>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
              <div className="flex justify-content-end mt-3">
                {selectedIntegration.structure_data ? (
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
    </div>
  );
}