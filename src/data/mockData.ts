import type { Activity, DashboardStats, MunicipioStats, ResponsavelStats } from '../types/activity';

// Dados mock para desenvolvimento - depois será substituído pela API real
export const mockActivities: Activity[] = generateMockData();

function generateMockData(): Activity[] {
    const municipios = [
        'Nova Viçosa', 'Rafael Jambeiro', 'Caravelas', 'Ibirapuã',
        'São Gonçalo dos Campos', 'Itamaraju', 'Central', 'Barra',
        'Maragogipe', 'Alcobaça', 'Santo Estêvão', 'Conceição do Jacuípe',
        'Mulungu do Morro', 'Itaberaba', 'Tanhaçu', 'Conde', 'Prado',
        'Buerarema', 'Candeal', 'Guanambi', 'Santa Bárbara', 'Brumado',
        'Boa Vista do Tupim', 'Camacan', 'Ibicuí', 'Ituberá', 'Ubatã',
        'Uruçuca', 'Gandu', 'Mortugaba', 'Serrinha', 'Santaluz'
    ];

    const tipos = [
        'Atividade Administrativa', 'Parecer', 'Outras Atividades',
        'Treinamento', 'Atendimento/Consulta', 'Orientações', 'Reunião',
        'Projeto de Lei', 'Relatório de Arrecadação', 'Ofício',
        'Minuta de Decreto', 'Recomendação', 'Outros'
    ];

    const responsaveis = [
        'Leda Santana Machado', 'Letycia Ramos', 'Átila Leite',
        'Thauan Fonseca', 'Mikaelly Spósito Saldanha', 'Pedro Pablo',
        'Danilo Dourado', 'Felipe Augusto Ribeiro Sampaio',
        'Maria Clara Maia Matos', 'Harrison Leite', 'Ayala Santos Silveira',
        'André Rocha', 'Ruy Franklin', 'Lucas Cavalcante Rocha'
    ];

    const activities: Activity[] = [];
    let id = 1;

    // Gerar atividades distribuídas por município (alguns com mais, outros com menos)
    for (let ano = 2024; ano <= 2025; ano++) {
        for (let mes = 1; mes <= 12; mes++) {
            municipios.forEach((municipio, index) => {
                // Alguns municípios têm mais atividades que outros
                const baseCount = index < 5 ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 10) + 1;

                for (let i = 0; i < baseCount; i++) {
                    activities.push({
                        id: String(id++),
                        municipio,
                        tipoDemanda: tipos[Math.floor(Math.random() * tipos.length)],
                        responsavel: responsaveis[Math.floor(Math.random() * responsaveis.length)],
                        nomeDemanda: `Demanda ${id}`,
                        data: `${ano}-${String(mes).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                        ano,
                        mes,
                        respostaContato: Math.random() > 0.06 ? 'Sim' : 'Não',
                    });
                }
            });
        }
    }

    return activities;
}

export function calculateStats(
    activities: Activity[],
    filters: { ano: number; mes: number | null; municipio: string | null; responsavel: string | null }
): DashboardStats {
    // Aplicar filtros
    let filtered = activities.filter(a => a.ano === filters.ano);

    if (filters.mes !== null) {
        filtered = filtered.filter(a => a.mes === filters.mes);
    }

    if (filters.municipio) {
        filtered = filtered.filter(a => a.municipio === filters.municipio);
    }

    if (filters.responsavel) {
        filtered = filtered.filter(a => a.responsavel === filters.responsavel);
    }

    // Calcular estatísticas por município
    const municipioMap = new Map<string, MunicipioStats>();
    filtered.forEach(a => {
        const stats = municipioMap.get(a.municipio) || { municipio: a.municipio, total: 0, porTipo: {} };
        stats.total++;
        stats.porTipo[a.tipoDemanda] = (stats.porTipo[a.tipoDemanda] || 0) + 1;
        municipioMap.set(a.municipio, stats);
    });

    // Calcular estatísticas por responsável
    const responsavelMap = new Map<string, ResponsavelStats>();
    filtered.forEach(a => {
        const stats = responsavelMap.get(a.responsavel) || { responsavel: a.responsavel, total: 0, porTipo: {} };
        stats.total++;
        stats.porTipo[a.tipoDemanda] = (stats.porTipo[a.tipoDemanda] || 0) + 1;
        responsavelMap.set(a.responsavel, stats);
    });

    // Calcular por tipo
    const porTipo: Record<string, number> = {};
    filtered.forEach(a => {
        porTipo[a.tipoDemanda] = (porTipo[a.tipoDemanda] || 0) + 1;
    });

    // Contar respostas
    const respostaSim = filtered.filter(a => a.respostaContato === 'Sim').length;
    const respostaNao = filtered.filter(a => a.respostaContato === 'Não').length;

    return {
        totalAtividades: filtered.length,
        totalMunicipios: municipioMap.size,
        totalResponsaveis: responsavelMap.size,
        respostaSim,
        respostaNao,
        atividadesPorMunicipio: Array.from(municipioMap.values()).sort((a, b) => b.total - a.total),
        atividadesPorResponsavel: Array.from(responsavelMap.values()).sort((a, b) => b.total - a.total),
        atividadesPorTipo: porTipo,
    };
}

export function getYears(activities: Activity[]): number[] {
    const years = new Set(activities.map(a => a.ano));
    return Array.from(years).sort((a, b) => b - a);
}

export function getMunicipios(activities: Activity[]): string[] {
    const municipios = new Set(activities.map(a => a.municipio));
    return Array.from(municipios).sort();
}

export function getResponsaveis(activities: Activity[]): string[] {
    const responsaveis = new Set(activities.map(a => a.responsavel));
    return Array.from(responsaveis).sort();
}
