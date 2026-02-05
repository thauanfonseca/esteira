import type { VercelRequest, VercelResponse } from '@vercel/node';

// Configuração Azure AD
const AZURE_CONFIG = {
    tenantId: process.env.AZURE_TENANT_ID!,
    clientId: process.env.AZURE_CLIENT_ID!,
    clientSecret: process.env.AZURE_CLIENT_SECRET!,
    scope: 'https://graph.microsoft.com/.default',
};

// SharePoint config
const SHAREPOINT_CONFIG = {
    siteHost: 'harrisonleiteadv.sharepoint.com',
    sitePath: '/sites/EsteiradeDemandas',
    listName: 'Demandas',
};

// Cache do token (em produção, usar Redis ou similar)
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
    // Verificar cache
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
        return tokenCache.token;
    }

    const tokenUrl = `https://login.microsoftonline.com/${AZURE_CONFIG.tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams({
        client_id: AZURE_CONFIG.clientId,
        client_secret: AZURE_CONFIG.clientSecret,
        scope: AZURE_CONFIG.scope,
        grant_type: 'client_credentials',
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Falha na autenticação: ${error}`);
    }

    const data = await response.json();

    // Cachear token
    tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 1 min antes de expirar
    };

    return data.access_token;
}

async function getSiteId(accessToken: string): Promise<string> {
    const url = `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteHost}:${SHAREPOINT_CONFIG.sitePath}`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erro ao buscar site: ${error}`);
    }

    const data = await response.json();
    return data.id;
}

async function getListItems(accessToken: string, siteId: string): Promise<any[]> {
    // Primeiro, buscar o ID da lista
    const listsUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists?$filter=displayName eq '${SHAREPOINT_CONFIG.listName}'`;

    const listsResponse = await fetch(listsUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!listsResponse.ok) {
        throw new Error('Erro ao buscar lista');
    }

    const listsData = await listsResponse.json();
    const listId = listsData.value[0]?.id;

    if (!listId) {
        throw new Error('Lista não encontrada');
    }

    // Buscar itens com paginação
    let allItems: any[] = [];
    let nextLink = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?$expand=fields&$top=500`;

    while (nextLink) {
        const response = await fetch(nextLink, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Prefer': 'HonorNonIndexedQueriesWarningMayFailRandomly',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar itens');
        }

        const data = await response.json();
        allItems = allItems.concat(data.value);
        nextLink = data['@odata.nextLink'] || null;
    }

    return allItems;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verificar variáveis de ambiente
        if (!AZURE_CONFIG.tenantId || !AZURE_CONFIG.clientId || !AZURE_CONFIG.clientSecret) {
            return res.status(500).json({
                error: 'Configuração Azure incompleta',
                message: 'Configure as variáveis AZURE_TENANT_ID, AZURE_CLIENT_ID e AZURE_CLIENT_SECRET'
            });
        }

        // Obter token
        const accessToken = await getAccessToken();

        // Buscar site ID
        const siteId = await getSiteId(accessToken);

        // Buscar itens
        const items = await getListItems(accessToken, siteId);

        // Transformar dados
        const activities = items.map((item: any) => ({
            id: item.id,
            nomeDemanda: item.fields.Title || '',
            taskId: item.fields.TaskID || '',
            municipio: item.fields.Munic_x00ed_pio?.LookupValue ||
                item.fields.Municipio?.LookupValue ||
                item.fields.Municipio ||
                'Não especificado',
            tipoDemanda: item.fields.Tipo_x0020_de_x0020_Demanda ||
                item.fields.TipodeDemanda ||
                item.fields.Tipo ||
                'Outros',
            prioridade: item.fields.Prioridade || 'Média',
            prazo: item.fields.Prazo_x0028_DataeHor_x00e1_rio || item.fields.Prazo || '',
            responsaveis: Array.isArray(item.fields.Respons_x00e1_vel)
                ? item.fields.Respons_x00e1_vel.map((r: any) => r.LookupValue || r)
                : item.fields.Responsavel
                    ? [item.fields.Responsavel]
                    : [],
            orientacoes: item.fields.Orienta_x00e7__x00f5_es_x0020_da ||
                item.fields.OrientacoesdaDemanda || '',
            descricao: item.fields.Descri_x00e7__x00e3_o_x0020_da_x ||
                item.fields.DescricaodaAtividade || '',
            area: item.fields._x00c1_rea || item.fields.Area || '',
            dataCriacao: item.fields.Created || '',
            dataModificacao: item.fields.Modified || '',
            cancelada: item.fields.Cancelada_x003f_ || item.fields.Cancelada || false,
            demandaInterna: item.fields.Demanda_x0020_Interna_x003f_ || item.fields.DemandaInterna || false,
            concluida: item.fields.Concluida || false,
        }));

        return res.status(200).json(activities);
    } catch (error: any) {
        console.error('Erro na API:', error);
        return res.status(500).json({
            error: 'Erro ao buscar dados',
            message: error.message
        });
    }
}
