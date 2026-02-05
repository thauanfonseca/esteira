import { useState, useMemo } from 'react';
import './index.css';
import { Sidebar } from './components/Sidebar';
import { MacroView } from './components/MacroView';
import { MicroView } from './components/MicroView';
import { TeamView } from './components/TeamView';
import { useActivities } from './hooks/useActivities';
import { calculateStats, getYears } from './data/mockData';
import type { DashboardFilters } from './types/activity';
import { RefreshCw, AlertCircle, Database, Cloud } from 'lucide-react';

type ViewType = 'macro' | 'micro' | 'team';

// Threshold para alerta de baixa demanda (ajustar conforme necessário)
const ALERT_THRESHOLD = 5;

function App() {
  const [activeView, setActiveView] = useState<ViewType>('macro');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    ano: 2026,
    mes: null,
    municipio: null,
    responsavel: null,
    incluirCanceladas: false,
    incluirConcluidas: true,
  });

  // Buscar atividades da API (com fallback para mock)
  const { activities, isLoading, error, isUsingMockData, refetch } = useActivities();

  // Obter anos disponíveis
  const years = useMemo(() => getYears(activities), [activities]);

  // Ajustar ano inicial quando os dados carregarem
  useMemo(() => {
    if (years.length > 0 && !years.includes(filters.ano)) {
      setFilters(prev => ({ ...prev, ano: years[0] }));
    }
  }, [years, filters.ano]);

  // Calcular estatísticas com base nos filtros
  const stats = useMemo(
    () => calculateStats(activities, filters),
    [activities, filters]
  );

  // Handler para clicar em um município
  const handleMunicipioClick = (municipio: string) => {
    setSelectedMunicipio(municipio);
    setActiveView('micro');
  };

  // Handler para voltar da visão micro
  const handleBackFromMicro = () => {
    setSelectedMunicipio(null);
    setActiveView('macro');
  };

  // Handler para mudar de view
  const handleViewChange = (view: ViewType) => {
    if (view === 'macro') {
      setSelectedMunicipio(null);
    }
    setActiveView(view);
  };

  // Título e subtítulo da página
  const getPageInfo = () => {
    switch (activeView) {
      case 'macro':
        return {
          title: 'Visão Geral por Município',
          subtitle: `Análise de atividades${filters.mes ? ` - ${new Date(2025, filters.mes - 1).toLocaleString('pt-BR', { month: 'long' })}` : ''} de ${filters.ano}`,
        };
      case 'micro':
        return {
          title: selectedMunicipio || 'Detalhes do Município',
          subtitle: 'Análise detalhada de demandas e responsáveis',
        };
      case 'team':
        return {
          title: 'Visão por Responsável',
          subtitle: 'Distribuição de carga de trabalho da equipe',
        };
    }
  };

  const pageInfo = getPageInfo();

  if (isLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={48} className="pulse" style={{ color: 'var(--primary-500)', marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-primary)' }}>Carregando dados...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Conectando ao SharePoint</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        filters={filters}
        onFiltersChange={setFilters}
        years={years}
        selectedMunicipio={selectedMunicipio}
      />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">{pageInfo.title}</h1>
            <p className="page-subtitle">{pageInfo.subtitle}</p>
          </div>

          {/* Indicador de fonte de dados */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: isUsingMockData ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                border: `1px solid ${isUsingMockData ? 'rgba(234, 179, 8, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                borderRadius: '8px',
                fontSize: '0.8rem'
              }}
            >
              {isUsingMockData ? (
                <>
                  <Database size={16} style={{ color: 'var(--warning)' }} />
                  <span style={{ color: 'var(--warning)' }}>Dados de exemplo</span>
                </>
              ) : (
                <>
                  <Cloud size={16} style={{ color: 'var(--success)' }} />
                  <span style={{ color: 'var(--success)' }}>SharePoint conectado</span>
                </>
              )}
            </div>

            <button
              onClick={refetch}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              <RefreshCw size={14} />
              Atualizar
            </button>
          </div>
        </header>

        {/* Mensagem de erro se houver */}
        {error && isUsingMockData && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={20} style={{ color: 'var(--warning)' }} />
            <div>
              <strong style={{ color: 'var(--warning)' }}>Usando dados de exemplo</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Não foi possível conectar ao SharePoint. Verifique as variáveis de ambiente na Vercel.
              </p>
            </div>
          </div>
        )}

        {activeView === 'macro' && (
          <MacroView
            stats={stats}
            onMunicipioClick={handleMunicipioClick}
            alertThreshold={ALERT_THRESHOLD}
          />
        )}

        {activeView === 'micro' && selectedMunicipio && (
          <MicroView
            municipio={selectedMunicipio}
            activities={activities.filter(a =>
              a.ano === filters.ano &&
              (filters.mes === null || a.mes === filters.mes)
            )}
            onBack={handleBackFromMicro}
          />
        )}

        {activeView === 'team' && (
          <TeamView stats={stats} />
        )}
      </main>
    </div>
  );
}

export default App;
