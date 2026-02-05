import type { Activity, DashboardStats, MunicipioStats, ResponsavelStats, DashboardFilters } from '../types/activity';

// Dados mock para desenvolvimento - será substituído pela API real quando conectado ao SharePoint
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
        'Parecer', 'Atividade Administrativa', 'Outras Atividades',
        'Treinamento', 'Atendimento/Consulta', 'Orientações', 'Reunião',
        'Projeto de Lei', 'Relatório de Arrecadação', 'Ofício',
        'Minuta de Decreto', 'Recomendação', 'Outros'
    ];

    const areas = ['Jurídico', 'Administrativo', 'Tributário', 'Fiscal', 'Consultoria'];

    const prioridades = ['Alta', 'Média', 'Baixa'];

    const responsaveis = [
        'Leda Santana Machado', 'Letycia Ramos', 'Átila Leite',
        'Thauan Fonseca', 'Mikaelly Spósito Saldanha', 'Pedro Pablo',
        'Danilo Dourado', 'Felipe Augusto Ribeiro Sampaio',
        'Maria Clara Maia Matos', 'Harrison Leite', 'Ayala Santos Silveira',
        'André Rocha', 'Ruy Franklin', 'Lucas Cavalcante Rocha'
    ];

    const activities: Activity[] = [];
    let id = 1;

    // Gerar atividades distribuídas por município
    for (let ano = 2024; ano <= 2025; ano++) {
        for (let mes = 1; mes <= 12; mes++) {
            municipios.forEach((municipio, index) => {
                // Alguns municípios têm mais atividades que outros
                const baseCount = index < 5 ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 10) + 1;

                for (let i = 0; i < baseCount; i++) {
                    const dataCriacao = `${ano}-${String(mes).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
                    const concluida = Math.random() > 0.3;

                    activities.push({
                        id: String(id++),
                        nomeDemanda: `Demanda ${municipio} - ${tipos[Math.floor(Math.random() * tipos.length)]}`,
                        taskId: `TSK-${id}`,
                        municipio,
                        tipoDemanda: tipos[Math.floor(Math.random() * tipos.length)],
                        prioridade: prioridades[Math.floor(Math.random() * prioridades.length)],
                        prazo: dataCriacao,
                        responsaveis: [responsaveis[Math.floor(Math.random() * responsaveis.length)]],
                        orientacoes: '',
                        descricao: '',
                        area: areas[Math.floor(Math.random() * areas.length)],
                        dataCriacao,
                        dataModificacao: dataCriacao,
                        cancelada: Math.random() > 0.95,
                        demandaInterna: Math.random() > 0.8,
                        concluida,
                        ano,
                        mes,
                    });
                }
            });
        }
    }

    return activities;
}

export function calculateStats(
    activities: Activity[],
    filters: DashboardFilters
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
        filtered = filtered.filter(a => a.responsaveis.includes(filters.responsavel!));
    }

    if (!filters.incluirCanceladas) {
        filtered = filtered.filter(a => !a.cancelada);
    }

    // Calcular estatísticas por município
    const municipioMap = new Map<string, MunicipioStats>();
    filtered.forEach(a => {
        const stats = municipioMap.get(a.municipio) || {
            municipio: a.municipio,
            total: 0,
            concluidas: 0,
            pendentes: 0,
            porTipo: {},
            porArea: {}
        };
        stats.total++;
        if (a.concluida) stats.concluidas++;
        else stats.pendentes++;
        stats.porTipo[a.tipoDemanda] = (stats.porTipo[a.tipoDemanda] || 0) + 1;
        stats.porArea[a.area] = (stats.porArea[a.area] || 0) + 1;
        municipioMap.set(a.municipio, stats);
    });

    // Calcular estatísticas por responsável
    const responsavelMap = new Map<string, ResponsavelStats>();
    filtered.forEach(a => {
        a.responsaveis.forEach(resp => {
            const stats = responsavelMap.get(resp) || {
                responsavel: resp,
                total: 0,
                concluidas: 0,
                pendentes: 0,
                porTipo: {}
            };
            stats.total++;
            if (a.concluida) stats.concluidas++;
            else stats.pendentes++;
            stats.porTipo[a.tipoDemanda] = (stats.porTipo[a.tipoDemanda] || 0) + 1;
            responsavelMap.set(resp, stats);
        });
    });

    // Calcular por tipo
    const porTipo: Record<string, number> = {};
    filtered.forEach(a => {
        porTipo[a.tipoDemanda] = (porTipo[a.tipoDemanda] || 0) + 1;
    });

    // Calcular por área
    const porArea: Record<string, number> = {};
    filtered.forEach(a => {
        porArea[a.area] = (porArea[a.area] || 0) + 1;
    });

    // Calcular por prioridade
    const porPrioridade: Record<string, number> = {};
    filtered.forEach(a => {
        porPrioridade[a.prioridade] = (porPrioridade[a.prioridade] || 0) + 1;
    });

    // Contar status
    const concluidas = filtered.filter(a => a.concluida).length;
    const canceladas = filtered.filter(a => a.cancelada).length;
    const pendentes = filtered.filter(a => !a.concluida && !a.cancelada).length;

    return {
        totalAtividades: filtered.length,
        totalMunicipios: municipioMap.size,
        totalResponsaveis: responsavelMap.size,
        concluidas,
        pendentes,
        canceladas,
        atividadesPorMunicipio: Array.from(municipioMap.values()).sort((a, b) => b.total - a.total),
        atividadesPorResponsavel: Array.from(responsavelMap.values()).sort((a, b) => b.total - a.total),
        atividadesPorTipo: porTipo,
        atividadesPorArea: porArea,
        atividadesPorPrioridade: porPrioridade,
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
    const responsaveis = new Set(activities.flatMap(a => a.responsaveis));
    return Array.from(responsaveis).sort();
}
