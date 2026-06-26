# MVP LicitAI — Design System

## Conceito
SaaS para micro e pequenas empresas monitorarem licitações públicas brasileiras.
Diferencial: dados do PNCP (API oficial) + sumarização por IA + interface simples.

## Público-alvo
Empresários de pequenas empresas que querem vender pro governo mas não têm equipe para acompanhar editais.

## Páginas / Rotas (HashRouter — Vite static)

| Rota | Propsito | Estado |
|------|----------|--------|
| `/` | Landing page com hero, benefícios, planos, CTA | Pública |
| `/dashboard` | Lista de licitações, filtros, busca | Requer auth |
| `/licitacao/:id` | Detalhes do edital (resumo, checklist, documentos) | Requer auth |
| `/login` | Login com email + senha | Pública |
| `/register` | Cadastro | Pública |

## Paleta de Cores (tema escuro profissional — licitações = seriedade)

- **Background:** `#0f172a` (slate-950)
- **Surface:** `#1e293b` (slate-800)
- **Card:** `#1e293b` com borda `#334155`
- **Primary:** `#3b82f6` (blue-500) — ações principais
- **Accent:** `#10b981` (emerald-500) — valores, sucesso, checklist completo
- **Text primary:** `#f8fafc` (slate-50)
- **Text secondary:** `#94a3b8` (slate-400)
- **Danger/Alert:** `#f59e0b` (amber-500) — prazos próximos, alertas
- **Success:** `#10b981` (emerald-500)
- **Border:** `#334155` (slate-700)

## Tipografia

- **Fonte:** Inter (Google Fonts) — sans-serif moderno, legível em dashboards densos
- **Heading:** Inter 700, 1.5rem–2.5rem
- **Body:** Inter 400, 0.875rem–1rem
- **Mono:** JetBrains Mono (para códigos, CNPJs, valores) — opcional

## Layout

- Max width: 1280px (dashboard), 1024px (landing)
- Sidebar: 240px (desktop), drawer (mobile)
- Header: 64px, fixo, com logo + busca + perfil
- Content: padding 24px
- Mobile: stack vertical, sidebar como hamburger menu

## Componentes Compartilhados

- `Header`: logo, busca global, avatar/perfil, logout
- `Sidebar`: Dashboard, Licitações, Favoritos, Configurações (plano futuro)
- `CardLicitacao`: card de resumo de edital (órgão, objeto, valor, prazo, categoria badge)
- `BadgeCategoria`: cor por categoria (TI=indigo, Obras=orange, Saúde=rose, etc.)
- `BarraProgressoChecklist`: progresso visual de documentos
- `SkeletonCard`: estado de carregamento
- `EmptyState`: sem licitações, com ilustração

## Interações

- Hover cards: leve elevação (`shadow-lg`, `translateY(-2px)`), 200ms ease
- Filtros: dropdown com animação suave
- Loading: skeleton pulse
- Toast: notificações de sucesso/erro (sonner)
- Modal: detalhes de licitação ou confirmação

## Dependências

- `react`, `react-dom`
- `react-router-dom` (HashRouter)
- `tailwindcss`, `@tailwindcss/vite` (v4)
- `lucide-react` (ícones)
- `shadcn/ui` (via CLI) — Button, Card, Badge, Input, Select, Dialog, Sheet, Skeleton, Tabs
- `framer-motion` (animações leves — entrada de cards, stagger)
- `axios` (HTTP client)
- `date-fns` (formatação de datas)
- `sonner` (toasts)

## Asset Manifest

- Nenhuma imagem custom necessária no MVP.
- Ícones Lucide para todas as representações visuais.
- Logo: texto estilizado "LicitAI" com ícone de escala/balança (Lucide: `Scale` ou `Gavel`).

## Worker Grouping

1. **Scaffold**: init Vite + React + Tailwind + shadcn/ui, config global, layout, routing, header/sidebar, home page
2. **Backend**: Express API + Prisma + integração PNCP + auth JWT + seeds
3. **Frontend Pages**: dashboard (lista + filtros) + detalhes da licitação + login/register
