import { Building2, Users, FileText, CheckCircle2, XCircle } from 'lucide-react';
import type { DashboardStats } from '../types/activity';
import { CHART_COLORS } from '../types/activity';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertsPanel } from './AlertsPanel';

interface MacroViewProps {
    stats: DashboardStats;
    onMunicipioClick: (municipio: string) => void;
    alertThreshold: number;
}

export function MacroView({ stats, onMunicipioClick, alertThreshold }: MacroViewProps) {
    // Dados para o donut chart de municípios
    const donutData = stats.atividadesPorMunicipio.slice(0, 12).map((item, index) => ({
        name: item.municipio,
        value: item.total,
        color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    // Dados para o gráfico de respostas
    const respostaData = [
        { name: 'Sim', value: stats.respostaSim, color: '#22c55e' },
        { name: 'Não', value: stats.respostaNao, color: '#3b82f6' },
    ];

    return (
        <div className="fade-in">
            {/* Alertas */}
            <AlertsPanel
                municipios={stats.atividadesPorMunicipio}
                threshold={alertThreshold}
                onMunicipioClick={onMunicipioClick}
            />

            {/* Cards de estatísticas */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FileText size={24} />
                    </div>
                    <div className="stat-value">{stats.totalAtividades.toLocaleString('pt-BR')}</div>
                    <div className="stat-label">Atividades</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                        <Building2 size={24} />
                    </div>
                    <div className="stat-value">{stats.totalMunicipios}</div>
                    <div className="stat-label">Municípios</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-value">{stats.totalResponsaveis}</div>
                    <div className="stat-label">Responsáveis</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-value">
                        {((stats.respostaSim / (stats.respostaSim + stats.respostaNao)) * 100).toFixed(1)}%
                    </div>
                    <div className="stat-label">Taxa de Resposta</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Donut Chart - Distribuição por Município */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Distribuição por Município</h3>
                            <p className="chart-subtitle">Top 12 municípios por atividades</p>
                        </div>
                    </div>

                    <div style={{ height: 280, display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {donutData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => onMunicipioClick(entry.name)}
                                        />
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

                        <div style={{ width: '40%', fontSize: '0.7rem' }}>
                            {donutData.slice(0, 6).map((item) => (
                                <div
                                    key={item.name}
                                    className="legend-item"
                                    style={{ marginBottom: '0.25rem', cursor: 'pointer' }}
                                    onClick={() => onMunicipioClick(item.name)}
                                >
                                    <div className="legend-color" style={{ background: item.color }} />
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Donut Chart - Resposta por Contato */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Resposta por Contato</h3>
                            <p className="chart-subtitle">Percentual de respostas obtidas</p>
                        </div>
                    </div>

                    <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie
                                    data={respostaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {respostaData.map((entry, index) => (
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {respostaData.map((item) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {item.name === 'Sim' ? (
                                        <CheckCircle2 size={20} color={item.color} />
                                    ) : (
                                        <XCircle size={20} color={item.color} />
                                    )}
                                    <div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                            {item.value.toLocaleString('pt-BR')}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {item.name} ({((item.value / stats.totalAtividades) * 100).toFixed(1)}%)
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar Chart - Atividade por Município */}
                <div className="chart-card full-width">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Atividade por Município</h3>
                            <p className="chart-subtitle">Clique em um município para ver detalhes</p>
                        </div>
                    </div>

                    <div className="bar-chart-container">
                        {stats.atividadesPorMunicipio.map((item, index) => {
                            const maxValue = stats.atividadesPorMunicipio[0]?.total || 1;
                            const percentage = (item.total / maxValue) * 100;

                            return (
                                <div
                                    key={item.municipio}
                                    className="bar-item"
                                    onClick={() => onMunicipioClick(item.municipio)}
                                >
                                    <span className="bar-label">{item.municipio}</span>
                                    <div className="bar-wrapper">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                background: item.total < alertThreshold
                                                    ? 'linear-gradient(90deg, #eab308, #f59e0b)'
                                                    : `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, ${CHART_COLORS[(index + 1) % CHART_COLORS.length]})`
                                            }}
                                        >
                                            {percentage > 15 && (
                                                <span className="bar-value">{item.total}</span>
                                            )}
                                        </div>
                                    </div>
                                    {percentage <= 15 && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '30px' }}>
                                            {item.total}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
