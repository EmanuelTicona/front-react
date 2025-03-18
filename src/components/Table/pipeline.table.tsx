import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { usePipelines } from '../../queries/useWorkaround';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function PipelinesTable() {
  const { data: pipelines, isLoading } = usePipelines();

  if (isLoading) {
    return (
      <div className="flex align-items-center justify-content-center p-5">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card" style={{ height: "1000px", display: "flex", flexDirection: "column" }}>
        <DataTable
          value={pipelines || []}
          paginator
          rows={10}
          dataKey="empresa"
          emptyMessage="No pipelines found."
          scrollHeight="flex"
          style={{ flex: 1 }}
        >
          <Column field="empresa" header="Empresa" sortable style={{ minWidth: "12rem" }} />
          <Column
            header="Pipelines"
            body={(rowData) => (
              <div>
                {rowData.pipelines.map((pipeline: any) => (
                  <div key={pipeline.name} className="mb-2">
                    <strong>{pipeline.name}</strong>
                    <div>Fecha de creación: {pipeline.creation_date || 'No disponible'}</div>
                  </div>
                ))}
              </div>
            )}
          />
          <Column field="count" header="Total Pipelines" sortable style={{ minWidth: "12rem" }} />
        </DataTable>
      </div>
    </div>
  );
}