import { ChevronRight, Home, FileText } from 'lucide-react';
import type { Activity } from '../types/activity';
import { CHART_COLORS } from '../types/activity';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MicroViewProps {
    municipio: string;
    activities: Activity[];
    onBack: () => void;
}

export function MicroView({ municipio, activities, onBack }: MicroViewProps) {
    // Filtrar atividades do município
    const municipioActivities = activities.filter(a => a.municipio === municipio);

    // Calcular estatísticas por tipo
    const porTipo: Record<string, number> = {};
    municipioActivities.forEach(a => {
        porTipo[a.tipoDemanda] = (porTipo[a.tipoDemanda] || 0) + 1;
    });

    const tipoData = Object.entries(porTipo)
        .map(([name, value], index) => ({
            name,
            value,
            color: CHART_COLORS[index % CHART_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

    // Agrupar por responsável
    const porResponsavel: Record<string, number> = {};
    municipioActivities.forEach(a => {
        porResponsavel[a.responsavel] = (porResponsavel[a.responsavel] || 0) + 1;
    });

    const responsavelData = Object.entries(porResponsavel)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="fade-in">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <div className="breadcrumb-item" onClick={onBack}>
                    <Home size={16} />
                    <span>Visão Geral</span>
                </div>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <div className="breadcrumb-item active">
                    <span>{municipio}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FileText size={24} />
                    </div>
                    <div className="stat-value">{municipioActivities.length}</div>
                    <div className="stat-label">Total de Atividades</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                        <FileText size={24} />
                    </div>
                    <div className="stat-value">{Object.keys(porTipo).length}</div>
                    <div className="stat-label">Tipos de Demanda</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}>
                        <FileText size={24} />
                    </div>
                    <div className="stat-value">{Object.keys(porResponsavel).length}</div>
                    <div className="stat-label">Responsáveis Ativos</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Donut Chart - Por Tipo */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Atividades por Tipo</h3>
                            <p className="chart-subtitle">Distribuição de demandas</p>
                        </div>
                    </div>

                    <div style={{ height: 300, display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tipoData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {tipoData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div style={{ width: '50%', maxHeight: '280px', overflowY: 'auto' }}>
                            {tipoData.map((item) => (
                                <div key={item.name} className="legend-item" style={{ marginBottom: '0.5rem' }}>
                                    <div className="legend-color" style={{ background: item.color }} />
                                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.name}
                                    </span>
                                    <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar Chart - Por Responsável */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Atividades por Responsável</h3>
                            <p className="chart-subtitle">Distribuição de carga</p>
                        </div>
                    </div>

                    <div className="bar-chart-container" style={{ maxHeight: '300px' }}>
                        {responsavelData.map((item, index) => {
                            const maxValue = responsavelData[0]?.value || 1;
                            const percentage = (item.value / maxValue) * 100;

                            return (
                                <div key={item.name} className="bar-item">
                                    <span className="bar-label">{item.name}</span>
                                    <div className="bar-wrapper">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                background: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, ${CHART_COLORS[(index + 1) % CHART_COLORS.length]})`
                                            }}
                                        >
                                            {percentage > 20 && (
                                                <span className="bar-value">{item.value}</span>
                                            )}
                                        </div>
                                    </div>
                                    {percentage <= 20 && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '30px' }}>
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tabela de Atividades */}
                <div className="chart-card full-width">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Últimas Atividades</h3>
                            <p className="chart-subtitle">Detalhes das demandas</p>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Responsável</th>
                                    <th>Tipo de Demanda</th>
                                    <th>Nome da Demanda</th>
                                    <th>Data</th>
                                    <th>Resposta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {municipioActivities.slice(0, 15).map((activity) => (
                                    <tr key={activity.id}>
                                        <td>{activity.responsavel}</td>
                                        <td>{activity.tipoDemanda}</td>
                                        <td>{activity.nomeDemanda}</td>
                                        <td>{new Date(activity.data).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <span style={{
                                                color: activity.respostaContato === 'Sim' ? 'var(--success)' : 'var(--info)',
                                                fontWeight: 500
                                            }}>
                                                {activity.respostaContato}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
