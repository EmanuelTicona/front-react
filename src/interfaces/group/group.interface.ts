export interface GroupMapping {
    id: number;
    group_id: string;
    aiops_company_id: number;
    identifier: string;
}

export interface Group {
    id: number;
    sys_id: string;
    long_name: string;
    short_name: string;
    company_id: number;
    u_servicio: string;
    u_categoria: string;
    u_subcategoria_1: string;
    u_subcategoria_2: string;
    u_subcategoria_3: string;
}