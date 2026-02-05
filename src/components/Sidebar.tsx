import {
    LayoutDashboard,
    Building2,
    Users,
    ChevronRight
} from 'lucide-react';
import type { DashboardFilters } from '../types/activity';

interface SidebarProps {
    activeView: 'macro' | 'micro' | 'team';
    onViewChange: (view: 'macro' | 'micro' | 'team') => void;
    filters: DashboardFilters;
    onFiltersChange: (filters: DashboardFilters) => void;
    years: number[];
    selectedMunicipio: string | null;
}

const MESES = [
    { value: null, label: 'Todos os meses' },
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
];

export function Sidebar({
    activeView,
    onViewChange,
    filters,
    onFiltersChange,
    years,
    selectedMunicipio
}: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <LayoutDashboard size={28} color="#818cf8" />
                <h1>Dashboard Atividades</h1>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeView === 'macro' ? 'active' : ''}`}
                    onClick={() => onViewChange('macro')}
                >
                    <Building2 size={20} />
                    <span>Visão por Município</span>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </button>

                <button
                    className={`nav-item ${activeView === 'micro' ? 'active' : ''}`}
                    onClick={() => onViewChange('micro')}
                    disabled={!selectedMunicipio}
                    style={{ opacity: selectedMunicipio ? 1 : 0.5 }}
                >
                    <LayoutDashboard size={20} />
                    <span>Detalhes {selectedMunicipio ? `- ${selectedMunicipio}` : ''}</span>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </button>

                <button
                    className={`nav-item ${activeView === 'team' ? 'active' : ''}`}
                    onClick={() => onViewChange('team')}
                >
                    <Users size={20} />
                    <span>Visão por Responsável</span>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </button>
            </nav>

            <div className="filters-section">
                <div className="filter-group">
                    <label className="filter-label">Ano</label>
                    <select
                        className="filter-select"
                        value={filters.ano}
                        onChange={(e) => onFiltersChange({ ...filters, ano: Number(e.target.value) })}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Mês</label>
                    <select
                        className="filter-select"
                        value={filters.mes ?? ''}
                        onChange={(e) => onFiltersChange({
                            ...filters,
                            mes: e.target.value ? Number(e.target.value) : null
                        })}
                    >
                        {MESES.map(mes => (
                            <option key={mes.label} value={mes.value ?? ''}>
                                {mes.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Harrison Leite Advogados
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                    Dashboard v1.0
                </p>
            </div>
        </aside>
    );
}
