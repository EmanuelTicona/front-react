export interface WorkaroundAuto {
    id: number;
    create_time: string;
    script_name: string;
    active: string;
    sentido: string;
}

export interface WorkaroundFlow {
    id: number;
    create_time: string;
    workaround_id: number;
    nro_paso: number;
    tipo_entidad: string;
    entidad: string;
    servicio: string;
    sistema_operativo: string;
    direccion_ip: string;
    auto_id: string;
}

export interface WorkaroundList {
    id: number;
    create_time: string;
    nombre: string;
    identificador: string;
    corporacion: string;
    empresa: string;
    id_orquestador: string;
    sentido: string;
    job_name: string;
    notificacion: string;
}