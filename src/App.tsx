import { useState, useMemo } from 'react';
import './index.css';
import { Sidebar } from './components/Sidebar';
import { MacroView } from './components/MacroView';
import { MicroView } from './components/MicroView';
import { TeamView } from './components/TeamView';
import { mockActivities, calculateStats, getYears } from './data/mockData';
import type { DashboardFilters } from './types/activity';

type ViewType = 'macro' | 'micro' | 'team';

// Threshold para alerta de baixa demanda (ajustar conforme necessário)
const ALERT_THRESHOLD = 5;

function App() {
  const [activeView, setActiveView] = useState<ViewType>('macro');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    ano: 2025,
    mes: null,
    municipio: null,
    responsavel: null,
    incluirCanceladas: false,
    incluirConcluidas: true,
  });

  // Obter anos disponíveis
  const years = useMemo(() => getYears(mockActivities), []);

  // Calcular estatísticas com base nos filtros
  const stats = useMemo(
    () => calculateStats(mockActivities, filters),
    [filters]
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
        </header>

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
            activities={mockActivities.filter(a =>
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
