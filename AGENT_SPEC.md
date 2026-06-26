# AGENT_SPEC — MVP LicitAI

## Objetivo do Usuário
Montar um MVP funcional de SaaS para monitorar licitações públicas brasileiras usando a API do PNCP (Portal Nacional de Contratações Públicas).

## Stack
- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + react-router-dom (HashRouter)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM + SQLite (MVP — PostgreSQL pode ser adicionado depois)
- **Auth**: JWT simples (email + senha hash bcrypt)
- **Dados**: API do PNCP (https://pncp.gov.br/api/pncp) — sem autenticação, leitura pública
- **IA**: Sumarização simulada/mock (para não depender de API key no MVP)

## Arquitetura de Dados (Prisma)

### User
- id, email, passwordHash, name, createdAt, plan (FREE/PRO default FREE)

### Licitacao (cached from PNCP)
- id (UUID), pncpId (string, unique), titulo, objeto, orgao, cnpjOrgao, modalidade, valorEstimado, dataAbertura, dataEncerramento, situacao, uf, municipio, categoria (enum), resumo (text), palavrasChave (string[]), createdAt, updatedAt

### Favorito
- id, userId, licitacaoId, createdAt

## API Backend (Express, porta 3001)

### Auth
- `POST /api/auth/register` — body: { email, password, name }
- `POST /api/auth/login` — body: { email, password } → retorna { token, user }
- `GET /api/auth/me` — header: Authorization Bearer token

### Licitacoes
- `GET /api/licitacoes` — query: page, limit, search, uf, categoria, modalidade, minValor, maxValor, dataInicio, dataFim
- `GET /api/licitacoes/:id` — detalhes
- `POST /api/licitacoes/sync` — dispara sync manual com PNCP (protegido por auth)
- `GET /api/licitacoes/pncp/:pncpId` — busca direta no PNCP e retorna JSON

### Favoritos
- `GET /api/favoritos` — lista do usuário logado
- `POST /api/favoritos` — body: { licitacaoId }
- `DELETE /api/favoritos/:id`

## Contrato Frontend ↔ Backend
- Base URL: `http://localhost:3001/api` (dev) — usado via proxy Vite no build
- Auth: header `Authorization: Bearer <token>`
- Erros: `{ error: string }` com status codes apropriados

## Sincronização PNCP
- Endpoint: `GET https://pncp.gov.br/api/pncp/v1/contratacoes`
- Params: pagina, tamanhoPagina (default 50)
- Dados retornados: lista de contratações com objeto, valor, orgão, modalidade, etc.
- Job: rota manual `/api/licitacoes/sync` que busca do PNCP, normaliza e salva no SQLite

## Telas Frontend
- Landing page (`/`) — hero, benefícios, planos, CTA
- Login (`/login`) — email + senha
- Register (`/register`) — email + senha + nome
- Dashboard (`/dashboard`) — lista de licitações, filtros, paginação, favoritos
- Detalhes (`/licitacao/:id`) — objeto, orgão, valor, prazos, requisitos, checklist, link PNCP

## Regras de Workers

### Worker Backend (coder)
- Implementa: todo o backend em `backend/`
- Pode editar: `backend/` e `prisma/schema.prisma`
- Não pode editar: `frontend/` 
- Deve: instalar deps, rodar prisma generate, criar seed básico, testar API com curl

### Worker Frontend (coder)
- Implementa: todo o frontend em `frontend/`
- Pode editar: `frontend/` e os dados de mock se necessário
- Não pode editar: `backend/`, `prisma/schema.prisma`
- Deve: instalar deps, usar HashRouter, integrar com backend real, implementar todas as telas
- Shared components: header, sidebar, layout devem estar em `frontend/src/components/`

## Merge Order
1. Backend primeiro (estabelece schema + API)
2. Frontend depois (consome API real)
3. Main agent integra e valida

## Validação Final
- Backend: `npm run dev` → testar com curl os endpoints
- Frontend: `npm run build` → deve compilar sem erros
- Integração: login → dashboard → lista de licitações → detalhes
