import { useState, useEffect, useCallback } from 'react';
import type { Activity } from '../types/activity';
import { mockActivities } from '../data/mockData';

interface UseActivitiesResult {
    activities: Activity[];
    isLoading: boolean;
    error: string | null;
    isUsingMockData: boolean;
    refetch: () => void;
}

export function useActivities(): UseActivitiesResult {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUsingMockData, setIsUsingMockData] = useState(false);

    const fetchActivities = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sharepoint/activities');

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Transformar dados se necessário
            const transformedData: Activity[] = data.map((item: any) => ({
                ...item,
                ano: item.ano || new Date(item.dataCriacao).getFullYear(),
                mes: item.mes || new Date(item.dataCriacao).getMonth() + 1,
                responsaveis: Array.isArray(item.responsaveis) ? item.responsaveis :
                    item.responsaveis ? [item.responsaveis] : [],
            }));

            setActivities(transformedData);
            setIsUsingMockData(false);
        } catch (err: any) {
            console.warn('Falha ao buscar dados do SharePoint, usando dados mock:', err.message);
            setError(err.message);
            setActivities(mockActivities);
            setIsUsingMockData(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return {
        activities,
        isLoading,
        error,
        isUsingMockData,
        refetch: fetchActivities,
    };
}
