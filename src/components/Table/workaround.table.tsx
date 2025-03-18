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
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { useWorkarounds, useWorkaroundFlows, useCreateWorkaround, useAddWorkaroundFlow } from '../../queries/useWorkaround';
import { WorkaroundList, WorkaroundFlow } from '../../interfaces/workaround/workaround.interface';
import '../../incidentDetails.css';

export default function WorkaroundTable() {
  const { data: workarounds, isLoading } = useWorkarounds();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [selectedWorkaround, setSelectedWorkaround] = useState<WorkaroundList | null>(null);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [createFlowDialogVisible, setCreateFlowDialogVisible] = useState(false);
  const [newWorkaround, setNewWorkaround] = useState<Omit<WorkaroundList, 'id' | 'create_time'>>({
    nombre: '',
    identificador: '',
    corporacion: '',
    empresa: '',
    id_orquestador: '',
    sentido: '',
    job_name: '',
    notificacion: 'NO',
  });
  const [newFlow, setNewFlow] = useState<Omit<WorkaroundFlow, 'id' | 'create_time'>>({
    workaround_id: selectedWorkaround?.id || 0,
    nro_paso: 0,
    tipo_entidad: '',
    entidad: '',
    servicio: '',
    sistema_operativo: '',
    direccion_ip: '',
    auto_id: '',
  });

  // Obtener los flows del workaround seleccionado
  const { data: workaroundFlows, isLoading: flowsLoading } = useWorkaroundFlows(selectedWorkaround?.id || 0);

  // Hook para crear un nuevo workaround
  const { mutate: createWorkaround, isLoading: isCreating } = useCreateWorkaround();

  // Hook para crear un nuevo flow
  const { mutate: createFlow, isLoading: isCreatingFlow } = useAddWorkaroundFlow();

  const onRowClick = (event: { data: WorkaroundList }) => {
    setSelectedWorkaround(event.data);
    setVisible(true);
  };

  const handleCreateWorkaround = () => {
    createWorkaround(newWorkaround, {
      onSuccess: () => {
        setCreateDialogVisible(false);
        setNewWorkaround({
          nombre: '',
          identificador: '',
          corporacion: '',
          empresa: '',
          id_orquestador: '',
          sentido: '',
          job_name: '',
          notificacion: 'NO',
        });
      },
    });
  };

  const handleCreateFlow = () => {
    if (selectedWorkaround) {
      const flowData = {
        ...newFlow,
        workaround_id: selectedWorkaround.id, // Asegurar que el workaround_id sea el correcto
      };
      createFlow(flowData, {
        onSuccess: () => {
          setCreateFlowDialogVisible(false);
          setNewFlow({
            workaround_id: selectedWorkaround.id,
            nro_paso: 0,
            tipo_entidad: '',
            entidad: '',
            servicio: '',
            sistema_operativo: '',
            direccion_ip: '',
            auto_id: '',
          });
        },
      });
    }
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    identificador: { value: null, matchMode: FilterMatchMode.CONTAINS },
    corporacion: { value: null, matchMode: FilterMatchMode.CONTAINS },
    empresa: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id_orquestador: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sentido: { value: null, matchMode: FilterMatchMode.CONTAINS },
    job_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    notificacion: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

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
      <div className="flex justify-content-between align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
        </IconField>
        <Button
          label="Crear Workaround"
          icon="pi pi-plus"
          onClick={() => setCreateDialogVisible(true)}
          className="p-button-success"
        />
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <div className="card" style={{ height: "1000px", display: "flex", flexDirection: "column" }}>
        <DataTable
          value={workarounds || []}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          loading={isLoading}
          globalFilterFields={["id", "nombre", "identificador", "corporacion", "empresa", "id_orquestador", "sentido", "job_name", "notificacion"]}
          header={header}
          emptyMessage="No workarounds found."
          onRowClick={onRowClick}
          selectionMode="single"
          scrollHeight="flex"
          style={{ flex: 1 }}
        >
          {/* Columnas de la tabla de workarounds */}
          <Column field="id" header="ID" sortable filter style={{ minWidth: "10rem" }} />
          <Column field="nombre" header="Nombre" sortable filter style={{ minWidth: "12rem" }} />
          <Column field="identificador" header="Identificador" sortable filter style={{ minWidth: "12rem" }} />
          <Column field="corporacion" header="Corporación" sortable filter style={{ minWidth: "12rem" }} />
          <Column field="empresa" header="Empresa" sortable filter style={{ minWidth: "12rem" }} />
          <Column field="id_orquestador" header="ID Orquestador" sortable filter style={{ minWidth: "12rem" }} />
          <Column field="sentido" header="Sentido" sortable filter style={{ minWidth: "12rem" }} />
          <Column field="job_name" header="Job Name" sortable filter style={{ minWidth: "12rem" }} />
          <Column field="notificacion" header="Notificación" sortable filter style={{ minWidth: "12rem" }} />
        </DataTable>
      </div>

      {/* Diálogo para crear un nuevo workaround */}
      <Dialog
        visible={createDialogVisible}
        onHide={() => setCreateDialogVisible(false)}
        header="Crear Workaround"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              value={newWorkaround.nombre}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, nombre: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="identificador">Identificador</label>
            <InputText
              id="identificador"
              value={newWorkaround.identificador}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, identificador: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="corporacion">Corporación</label>
            <InputText
              id="corporacion"
              value={newWorkaround.corporacion}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, corporacion: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="empresa">Empresa</label>
            <InputText
              id="empresa"
              value={newWorkaround.empresa}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, empresa: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="id_orquestador">ID Orquestador</label>
            <InputText
              id="id_orquestador"
              value={newWorkaround.id_orquestador}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, id_orquestador: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="sentido">Sentido</label>
            <InputText
              id="sentido"
              value={newWorkaround.sentido}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, sentido: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="job_name">Job Name</label>
            <InputText
              id="job_name"
              value={newWorkaround.job_name}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, job_name: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="notificacion">Notificación</label>
            <InputText
              id="notificacion"
              value={newWorkaround.notificacion}
              onChange={(e) => setNewWorkaround({ ...newWorkaround, notificacion: e.target.value })}
            />
          </div>
          <div className="p-field">
            <Button
              label="Crear"
              icon="pi pi-check"
              onClick={handleCreateWorkaround}
              loading={isCreating}
              className="p-button-success"
            />
          </div>
        </div>
      </Dialog>

      {/* Diálogo para crear un nuevo flow */}
      <Dialog
        visible={createFlowDialogVisible}
        onHide={() => setCreateFlowDialogVisible(false)}
        header="Crear Flow"
        style={{ width: '50vw' }}
        modal
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="nro_paso">Nro. Paso</label>
            <InputText
              id="nro_paso"
              value={newFlow.nro_paso}
              onChange={(e) => setNewFlow({ ...newFlow, nro_paso: Number(e.target.value) })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="tipo_entidad">Tipo Entidad</label>
            <InputText
              id="tipo_entidad"
              value={newFlow.tipo_entidad}
              onChange={(e) => setNewFlow({ ...newFlow, tipo_entidad: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="entidad">Entidad</label>
            <InputText
              id="entidad"
              value={newFlow.entidad}
              onChange={(e) => setNewFlow({ ...newFlow, entidad: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="servicio">Servicio</label>
            <InputText
              id="servicio"
              value={newFlow.servicio}
              onChange={(e) => setNewFlow({ ...newFlow, servicio: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="sistema_operativo">Sistema Operativo</label>
            <InputText
              id="sistema_operativo"
              value={newFlow.sistema_operativo}
              onChange={(e) => setNewFlow({ ...newFlow, sistema_operativo: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="direccion_ip">Dirección IP</label>
            <InputText
              id="direccion_ip"
              value={newFlow.direccion_ip}
              onChange={(e) => setNewFlow({ ...newFlow, direccion_ip: e.target.value })}
            />
          </div>
          <div className="p-field">
            <label htmlFor="auto_id">Auto ID</label>
            <InputText
              id="auto_id"
              value={newFlow.auto_id}
              onChange={(e) => setNewFlow({ ...newFlow, auto_id: e.target.value })}
            />
          </div>
          <Button label="Crear" onClick={handleCreateFlow} />
        </div>
      </Dialog>

      {/* Diálogo para ver detalles del workaround */}
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header="Detalles del Workaround"
        style={{ width: '60vw', height: '500px' }}
        modal
        className="incident-dialog"
      >
        {selectedWorkaround && (
          <TabView className="custom-tabs">
            <TabPanel header="Detalles" leftIcon="pi pi-info-circle mr-2">
              <div className="grid">
                <div className="col-12">
                  <Card className="mb-3">
                    <div className="flex align-items-center mb-3 w-full">
                      <h2 className="text-xl m-0 mr-3 text-gray-900">Workaround #{selectedWorkaround.id}</h2>
                    </div>
                    <div className="grid">
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className="text-gray-900">Información Principal</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Nombre:</label>
                            <div>{selectedWorkaround.nombre}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Identificador:</label>
                            <div>{selectedWorkaround.identificador}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Corporación:</label>
                            <div>{selectedWorkaround.corporacion}</div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-12 md:col-6">
                        <Card className="surface-50">
                          <h3 className='text-gray-900'>Detalles Técnicos</h3>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Empresa:</label>
                            <div>{selectedWorkaround.empresa}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">ID Orquestador:</label>
                            <div>{selectedWorkaround.id_orquestador}</div>
                          </div>
                          <div className="mb-2">
                            <label className="font-bold text-gray-900">Sentido:</label>
                            <div>{selectedWorkaround.sentido}</div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Flows" leftIcon="pi pi-sitemap mr-2">
              <div className="p-4">
                {flowsLoading ? (
                  <div className="flex align-items-center justify-content-center">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                  </div>
                ) : (
                  <>
                    <Button
                      label="Agregar Flow"
                      icon="pi pi-plus"
                      onClick={() => setCreateFlowDialogVisible(true)}
                      className="p-button-success mb-3"
                    />
                    <DataTable
                      value={workaroundFlows || []}
                      rows={5}
                      className="p-datatable-sm"
                    >
                      <Column field="id" header="ID" style={{ width: '10%' }} />
                      <Column field="nro_paso" header="Nro. Paso" style={{ width: '10%' }} />
                      <Column field="tipo_entidad" header="Tipo Entidad" style={{ width: '15%' }} />
                      <Column field="entidad" header="Entidad" style={{ width: '15%' }} />
                      <Column field="servicio" header="Servicio" style={{ width: '15%' }} />
                      <Column field="sistema_operativo" header="Sistema Operativo" style={{ width: '15%' }} />
                      <Column field="direccion_ip" header="Dirección IP" style={{ width: '15%' }} />
                      <Column field="auto_id" header="Auto ID" style={{ width: '15%' }} />
                    </DataTable>
                  </>
                )}
              </div>
            </TabPanel>
          </TabView>
        )}
      </Dialog>
    </div>
  );
}