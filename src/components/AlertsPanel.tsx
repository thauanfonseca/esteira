import { AlertTriangle, ChevronRight } from 'lucide-react';
import type { MunicipioStats } from '../types/activity';

interface AlertsPanelProps {
    municipios: MunicipioStats[];
    threshold: number;
    onMunicipioClick: (municipio: string) => void;
}

export function AlertsPanel({ municipios, threshold, onMunicipioClick }: AlertsPanelProps) {
    const lowDemandMunicipios = municipios.filter(m => m.total < threshold);

    if (lowDemandMunicipios.length === 0) {
        return null;
    }

    return (
        <div className="alerts-panel fade-in">
            <div className="alerts-header">
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Atenção: Clientes com Baixa Demanda
                </h3>
                <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    background: 'rgba(234, 179, 8, 0.2)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px'
                }}>
                    {lowDemandMunicipios.length} municípios
                </span>
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {lowDemandMunicipios.slice(0, 5).map((municipio) => (
                    <div
                        key={municipio.municipio}
                        className="alert-item"
                        onClick={() => onMunicipioClick(municipio.municipio)}
                    >
                        <div className="alert-content">
                            <AlertTriangle size={16} color="var(--warning)" />
                            <span className="alert-text">
                                <strong>{municipio.municipio}</strong> — apenas {municipio.total} atividades no período
                            </span>
                        </div>
                        <div className="alert-action">
                            Ver detalhes <ChevronRight size={14} />
                        </div>
                    </div>
                ))}
            </div>

            {lowDemandMunicipios.length > 5 && (
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.75rem',
                    textAlign: 'center'
                }}>
                    E mais {lowDemandMunicipios.length - 5} municípios com baixa demanda...
                </p>
            )}
        </div>
    );
}
