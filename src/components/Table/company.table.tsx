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
import { useCompaniesList, useAddCompany, useEditCompany, useDeleteCompany } from '../../queries/useCompany';
import { useQueryClient } from '@tanstack/react-query';

export default function CompanyTable() {
  const { data: companies, isLoading } = useCompaniesList();
  const addCompanyMutation = useAddCompany();
  const editCompanyMutation = useEditCompany();
  const deleteCompanyMutation = useDeleteCompany();
  
  const queryClient = useQueryClient();

  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);

  const [newCompany, setNewCompany] = useState<Omit<any, 'id'>>({ 
    name: '', 
    // Add other company fields here
  });
  const [updatedCompany, setUpdatedCompany] = useState<Partial<any>>({});
  const toast = React.useRef<Toast>(null);

  const onRowClick = (event: { data: any }) => {
    setSelectedCompany(event.data);
    setVisible(true);
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // Add other company fields here
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleAddCompany = () => {
    addCompanyMutation.mutate(newCompany, {
      onSuccess: () => {
        setIsAddDialogVisible(false);
        setNewCompany({ name: '' }); // Reset form
        toast.current?.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Empresa agregada correctamente', 
          life: 3000 
        });
      },
      onError: () => {
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al agregar empresa', 
          life: 3000 
        });
      }
    });
  };

  const handleEditCompany = () => {
    if (selectedCompany) {
        editCompanyMutation.mutate(
        { id: selectedCompany.id, updatedCompany },
        {
          onSuccess: () => {
            setIsEditDialogVisible(false);
            setUpdatedCompany({}); // Reset form
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Integración editada correctamente', life: 3000 });
          },
        }
      );
    }
  };

  const handleDeleteCompany = (id: number) => {
    deleteCompanyMutation.mutate(id, {
      onSuccess: () => {
        toast.current?.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Empresa eliminada correctamente', 
          life: 3000 
        });
      },
      onError: () => {
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al eliminar empresa', 
          life: 3000 
        });
      }
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText 
            value={globalFilterValue} 
            onChange={onGlobalFilterChange} 
            placeholder="Buscar empresas..." 
          />
        </IconField>
        <Button
          label="Agregar Empresa"
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
          value={companies || []}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          loading={isLoading}
          globalFilterFields={["id", "name"]} // Add other company fields here
          header={header}
          emptyMessage="No se encontraron empresas."
          onRowClick={onRowClick}
          selectionMode="single"
          scrollHeight="flex"
          style={{ flex: 1 }}
        >
          <Column field="id" header="ID" sortable filter filterPlaceholder="" style={{ minWidth: "10rem" }} />
          <Column field="name" header="Nombre" sortable filter filterPlaceholder="" style={{ minWidth: "12rem" }} />
          {/* Add other company columns here */}
          <Column
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCompany(rowData);
                    setUpdatedCompany({ name: rowData.name });
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

      {/* Add Company Dialog */}
      <Dialog
        visible={isAddDialogVisible}
        onHide={() => setIsAddDialogVisible(false)}
        header="Agregar Empresa"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
            />
          </div>
          {/* Add other company fields here */}
          <Button 
            label="Guardar" 
            onClick={handleAddCompany} 
            loading={addCompanyMutation.isPending}
          />
        </div>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog
        visible={isEditDialogVisible}
        onHide={() => setIsEditDialogVisible(false)}
        header="Editar Empresa"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="name"
              value={updatedCompany.name || ''}
              onChange={(e) => setUpdatedCompany({ ...updatedCompany, name: e.target.value })}
            />
          </div>
          {/* Add other company fields here */}
          <Button 
            label="Guardar" 
            onClick={handleEditCompany} 
            loading={editCompanyMutation.isPending}
          />
        </div>
      </Dialog>

      {/* Company Details Dialog */}
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles de la Empresa"
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
                      <h2 className="text-xl m-0 mr-3 text-gray-900">Empresa #{selectedCompany.id}</h2>
                    </div>
                    <div className="mb-2">
                      <label className="font-bold text-gray-900">Nombre:</label>
                      <div>{selectedCompany.name}</div>
                    </div>
                    {/* Add other company details here */}
                  </Card>
                </div>
              </div>
            </TabPanel>
          </TabView>
        )}
      </Dialog>
    </div>
  );
}