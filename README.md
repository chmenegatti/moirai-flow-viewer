# 🌐 Moirai Flow Viewer - Frontend

Aplicação React/TypeScript para visualização interativa de fluxogramas gerados a partir de configurações ETCD.

## 🚀 Stack Tecnológica

- **React 18.3** - Framework UI
- **TypeScript 5.6** - Type safety
- **Vite 6.0** - Build tool
- **TailwindCSS 3.4** - Utility-first CSS
- **Shadcn/ui** - Componentes acessíveis
- **TanStack Query 5.8** - Data fetching
- **Mermaid 11.12** - Renderização de diagramas
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
# URL da API Backend
VITE_API_URL=http://localhost:3000/api

# Modo mock (para desenvolvimento sem backend)
VITE_USE_MOCK=false
```

## 🏃 Executando

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: <http://localhost:8080>

### Build para Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

### Build Desenvolvimento

```bash
npm run build:dev
```

## 🎨 Componentes Principais

### Index (Página Principal)

Gerencia o estado da aplicação e exibe a lista de exchanges.

```tsx
import Index from './pages/Index';
```

### ExchangeCard

Renderiza um card clicável para cada exchange.

```tsx
<ExchangeCard
  name="moirai.topic.vpn.create"
  index={0}
  onClick={handleClick}
/>
```

### FlowchartViewer

Modal que exibe o diagrama Mermaid renderizado.

```tsx
<FlowchartViewer
  content={svgContent}
  exchangeName="moirai.topic.vpn.create"
  onClose={handleClose}
  isLoading={false}
/>
```

### SearchInput

Input de busca com debounce e autocomplete.

```tsx
<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search exchanges..."
/>
```

## 📁 Estrutura de Diretórios

```bash
src/
├── components/          # Componentes React
│   ├── ExchangeCard.tsx
│   ├── FlowchartViewer.tsx
│   ├── Header.tsx
│   ├── SearchInput.tsx
│   ├── LoadingState.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   └── ui/             # Componentes Shadcn/ui
├── pages/              # Páginas
│   ├── Index.tsx
│   └── NotFound.tsx
├── services/           # Serviços de API
│   └── api.ts
├── types/              # TypeScript types
│   └── exchange.ts
├── hooks/              # Custom hooks
│   └── use-toast.tsx
├── lib/                # Utilitários
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🔌 Integração com Backend

O frontend consome duas APIs principais:

### GET /api/exchanges

Retorna lista de exchanges disponíveis:

```typescript
const { data } = await fetchExchanges();
// {
//   data: {
//     prefix: "moirai",
//     count: 24,
//     exchanges: ["moirai.topic.vpn.create", ...]
//   }
// }
```

### POST /api/flowchart

Gera diagrama para uma exchange específica:

```typescript
const svg = await fetchFlowchart("moirai.topic.vpn.create");
// Returns SVG string
```

## 🎯 Features

- ✅ **Busca em tempo real** - Filtra exchanges enquanto você digita
- ✅ **Visualização interativa** - Modal fullscreen com diagrama Mermaid
- ✅ **Responsivo** - Funciona em mobile, tablet e desktop
- ✅ **Loading states** - Feedback visual durante carregamento
- ✅ **Error handling** - Tratamento elegante de erros
- ✅ **Cache inteligente** - TanStack Query gerencia cache automaticamente
- ✅ **Modo escuro** - Tema Monokai inspirado

## 🎨 Tema e Estilo

O projeto usa um tema customizado inspirado no Monokai:

```css
--monokai-bg: #272822
--monokai-green: #A6E22E
--monokai-blue: #66D9EF
--monokai-yellow: #E6DB74
--monokai-orange: #FD971F
--monokai-pink: #F92672
```

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run build:dev` | Build de desenvolvimento |
| `npm run preview` | Preview do build |
| `npm run lint` | Verifica código com ESLint |

## 📚 Bibliotecas Principais

### Shadcn/ui Components

Componentes pré-construídos e acessíveis:

- `Button`, `Card`, `Dialog`, `Input`
- `Select`, `Tabs`, `Toast`, `Tooltip`
- E mais...

### TanStack Query

Gerenciamento de estado assíncrono:

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["exchanges"],
  queryFn: fetchExchanges,
});
```

### Mermaid

Renderização de diagramas:

```typescript
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "dark",
});
```

## 🐛 Troubleshooting

### Erro de CORS

Se você receber erros de CORS, certifique-se de que:

1. O backend está rodando em <http://localhost:3000>
2. CORS está configurado no backend (já configurado)
3. A variável `VITE_API_URL` está correta no `.env`

### Diagrama não renderiza

1. Verifique se o backend retorna SVG válido
2. Abra o console do navegador para ver erros
3. Teste a API diretamente com cURL

### Build falha

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

ISC License - veja LICENSE para detalhes

## 🔗 Links Úteis

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Mermaid Docs](https://mermaid.js.org/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Desenvolvido com ❤️ usando React + TypeScript + TailwindCSS**
