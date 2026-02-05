// Tipos atualizados para corresponder aos campos reais do SharePoint

export interface SharePointDemanda {
  id: string;
  fields: {
    Title: string; // Nome da Demanda
    TaskID?: string;
    Munic_x00ed_pio?: { // Lookup field
      LookupId: number;
      LookupValue: string;
    };
    Tipo_x0020_de_x0020_Demanda?: string;
    Prioridade?: string;
    Prazo_x0028_DataeHor_x00e1_rio?: string;
    Respons_x00e1_vel?: {
      LookupId: number;
      LookupValue: string;
    }[];
    Orienta_x00e7__x00f5_es_x0020_da?: string;
    Descri_x00e7__x00e3_o_x0020_da_x?: string;
    _x00c1_rea?: string;
    Created: string;
    Modified: string;
    Cancelada_x003f_?: boolean;
    Demanda_x0020_Interna_x003f_?: boolean;
    Concluida?: boolean;
  };
}

export interface Activity {
  id: string;
  nomeDemanda: string;
  taskId: string;
  municipio: string;
  tipoDemanda: string;
  prioridade: string;
  prazo: string;
  responsaveis: string[];
  orientacoes: string;
  descricao: string;
  area: string;
  dataCriacao: string;
  dataModificacao: string;
  cancelada: boolean;
  demandaInterna: boolean;
  concluida: boolean;
  ano: number;
  mes: number;
}

export interface MunicipioStats {
  municipio: string;
  total: number;
  concluidas: number;
  pendentes: number;
  porTipo: Record<string, number>;
  porArea: Record<string, number>;
}

export interface ResponsavelStats {
  responsavel: string;
  total: number;
  concluidas: number;
  pendentes: number;
  porTipo: Record<string, number>;
}

export interface DashboardFilters {
  ano: number;
  mes: number | null;
  municipio: string | null;
  responsavel: string | null;
  incluirCanceladas: boolean;
  incluirConcluidas: boolean;
}

export interface DashboardStats {
  totalAtividades: number;
  totalMunicipios: number;
  totalResponsaveis: number;
  concluidas: number;
  pendentes: number;
  canceladas: number;
  atividadesPorMunicipio: MunicipioStats[];
  atividadesPorResponsavel: ResponsavelStats[];
  atividadesPorTipo: Record<string, number>;
  atividadesPorArea: Record<string, number>;
  atividadesPorPrioridade: Record<string, number>;
}

// Cores para os gráficos
export const CHART_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
];

export const PRIORIDADE_COLORS: Record<string, string> = {
  'Alta': '#ef4444',
  'Média': '#f59e0b',
  'Baixa': '#22c55e',
};

export const TIPOS_DEMANDA = [
  'Parecer',
  'Atividade Administrativa',
  'Outras Atividades',
  'Treinamento',
  'Atendimento/Consulta',
  'Orientações',
  'Reunião',
  'Projeto de Lei',
  'Relatório de Arrecadação',
  'Ofício',
  'Minuta de Decreto',
  'Recomendação',
  'Jurídico',
  'Outros',
];
