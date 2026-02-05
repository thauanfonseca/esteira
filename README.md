# Dashboard de Atividades

Dashboard React para visualização de atividades de clientes, substituindo o Power BI por uma solução mais flexível.

## Funcionalidades

- 📊 **Visão Macro**: Dashboard geral por município
- 🔍 **Visão Micro**: Detalhes por tipo de demanda
- 👥 **Visão Equipe**: Carga de trabalho por responsável
- ⚠️ **Alertas**: Notificações de clientes com baixa demanda

## Tecnologias

- React 19 + TypeScript
- Vite 5
- Recharts (gráficos)
- Lucide React (ícones)

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Configuração (Futuro)

Para conectar ao SharePoint, configure as variáveis de ambiente:

```env
VITE_AZURE_CLIENT_ID=seu-client-id
VITE_AZURE_TENANT_ID=seu-tenant-id
SHAREPOINT_SITE_URL=seu-site.sharepoint.com/sites/NomeDoSite
SHAREPOINT_LIST_NAME=NomeDaLista
AZURE_CLIENT_SECRET=seu-secret
```

## Deploy

O projeto está configurado para deploy automático na Vercel.
