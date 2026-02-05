import { Building2, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
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

    // Dados para o gráfico de status
    const statusData = [
        { name: 'Concluídas', value: stats.concluidas, color: '#22c55e' },
        { name: 'Pendentes', value: stats.pendentes, color: '#f59e0b' },
        { name: 'Canceladas', value: stats.canceladas, color: '#ef4444' },
    ].filter(d => d.value > 0);

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
                    <div className="stat-label">Total Atividades</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-value">{stats.concluidas.toLocaleString('pt-BR')}</div>
                    <div className="stat-label">Concluídas</div>
                    <div className="stat-change positive">
                        {((stats.concluidas / stats.totalAtividades) * 100).toFixed(1)}%
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-value">{stats.pendentes.toLocaleString('pt-BR')}</div>
                    <div className="stat-label">Pendentes</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                        <Building2 size={24} />
                    </div>
                    <div className="stat-value">{stats.totalMunicipios}</div>
                    <div className="stat-label">Municípios</div>
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

                {/* Donut Chart - Status */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Status das Demandas</h3>
                            <p className="chart-subtitle">Concluídas, pendentes e canceladas</p>
                        </div>
                    </div>

                    <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
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
                            {statusData.map((item) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {item.name === 'Concluídas' && <CheckCircle2 size={20} color={item.color} />}
                                    {item.name === 'Pendentes' && <Clock size={20} color={item.color} />}
                                    {item.name === 'Canceladas' && <XCircle size={20} color={item.color} />}
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
