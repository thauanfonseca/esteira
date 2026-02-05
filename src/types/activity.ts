// Tipos para as atividades do SharePoint

export interface Activity {
  id: string;
  municipio: string;
  tipoDemanda: string;
  responsavel: string;
  nomeDemanda: string;
  data: string;
  ano: number;
  mes: number;
  respostaContato: 'Sim' | 'Não';
}

export interface MunicipioStats {
  municipio: string;
  total: number;
  porTipo: Record<string, number>;
}

export interface ResponsavelStats {
  responsavel: string;
  total: number;
  porTipo: Record<string, number>;
}

export interface DashboardFilters {
  ano: number;
  mes: number | null;
  municipio: string | null;
  responsavel: string | null;
}

export interface DashboardStats {
  totalAtividades: number;
  totalMunicipios: number;
  totalResponsaveis: number;
  respostaSim: number;
  respostaNao: number;
  atividadesPorMunicipio: MunicipioStats[];
  atividadesPorResponsavel: ResponsavelStats[];
  atividadesPorTipo: Record<string, number>;
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

export const TIPOS_DEMANDA = [
  'Atividade Administrativa',
  'Parecer',
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
  'Outros',
  'Resposta por Contato',
];
