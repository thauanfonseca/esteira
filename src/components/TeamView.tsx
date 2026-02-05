import { Users, AlertTriangle, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '../types/activity';
import { CHART_COLORS } from '../types/activity';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TeamViewProps {
    stats: DashboardStats;
}

export function TeamView({ stats }: TeamViewProps) {
    // Dados para o donut chart de tipos
    const tipoData = Object.entries(stats.atividadesPorTipo)
        .map(([name, value], index) => ({
            name,
            value,
            color: CHART_COLORS[index % CHART_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

    // Calcular média de atividades por responsável
    const mediaAtividades = stats.totalAtividades / stats.totalResponsaveis;

    // Identificar responsáveis com sobrecarga (acima de 1.5x a média)
    const sobrecarga = stats.atividadesPorResponsavel.filter(r => r.total > mediaAtividades * 1.5);

    // Identificar responsáveis com pouca carga (abaixo de 0.5x a média)
    const baixaCarga = stats.atividadesPorResponsavel.filter(r => r.total < mediaAtividades * 0.5);

    return (
        <div className="fade-in">
            {/* Cards de estatísticas */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-value">{stats.totalResponsaveis}</div>
                    <div className="stat-label">Total de Responsáveis</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-value">{Math.round(mediaAtividades)}</div>
                    <div className="stat-label">Média por Responsável</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-value">{sobrecarga.length}</div>
                    <div className="stat-label">Com Sobrecarga</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-value">{baixaCarga.length}</div>
                    <div className="stat-label">Baixa Carga</div>
                </div>
            </div>

            {/* Alerta de sobrecarga */}
            {sobrecarga.length > 0 && (
                <div className="alerts-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <div className="alerts-header" style={{ color: 'var(--danger)' }}>
                        <AlertTriangle size={20} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                            Responsáveis com Sobrecarga
                        </h3>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {sobrecarga.map((r) => (
                            <span
                                key={r.responsavel}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem'
                                }}
                            >
                                <strong>{r.responsavel}</strong> — {r.total} atividades
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Donut Chart - Por Tipo de Atividade */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Distribuição por Tipo</h3>
                            <p className="chart-subtitle">Todas as atividades</p>
                        </div>
                    </div>

                    <div style={{ height: 300, display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tipoData.slice(0, 10)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {tipoData.slice(0, 10).map((entry, index) => (
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
                            {tipoData.slice(0, 10).map((item) => (
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

                {/* Contagem Total */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Contagem de ID</h3>
                            <p className="chart-subtitle">Total de registros</p>
                        </div>
                    </div>

                    <div style={{
                        height: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {stats.totalAtividades.toLocaleString('pt-BR')}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                            Contagem de ID
                        </div>
                    </div>
                </div>

                {/* Bar Chart - Atividades por Responsável */}
                <div className="chart-card full-width">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Atividades por Responsável</h3>
                            <p className="chart-subtitle">Ordenado por quantidade de atividades</p>
                        </div>
                    </div>

                    <div className="bar-chart-container">
                        {stats.atividadesPorResponsavel.map((item, index) => {
                            const maxValue = stats.atividadesPorResponsavel[0]?.total || 1;
                            const percentage = (item.total / maxValue) * 100;
                            const isSobrecarga = item.total > mediaAtividades * 1.5;
                            const isBaixaCarga = item.total < mediaAtividades * 0.5;

                            return (
                                <div key={item.responsavel} className="bar-item">
                                    <span className="bar-label" style={{
                                        color: isSobrecarga ? 'var(--danger)' : isBaixaCarga ? 'var(--warning)' : 'var(--text-secondary)'
                                    }}>
                                        {item.responsavel}
                                    </span>
                                    <div className="bar-wrapper">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                background: isSobrecarga
                                                    ? 'linear-gradient(90deg, #ef4444, #f97316)'
                                                    : isBaixaCarga
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
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: '40px' }}>
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
