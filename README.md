# @tecnotics/fe-billing

[![npm version](https://img.shields.io/npm/v/@tecnotics/fe-billing.svg)](https://www.npmjs.com/package/@tecnotics/fe-billing)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Librería React moderna y ligera para integrar facturación electrónica completa en tus aplicaciones web. Se conecta a la API de Tecnotics mediante autenticación basada en tokens.

## 🚀 Características

- ✅ **Plug & Play**: Integración simple en minutos
- 🎨 **3 Temas incluidos**: Classic, Clean y Compact
- 🔐 **Autenticación segura** con tokens duales
- 📦 **Extremadamente liviana**: No rompe tu proyecto
- 🔒 **Totalmente aislada**: CSS prefijado, router interno, sin globales
- ⚡ **TypeScript nativo**: Tipado completo
- 🎯 **React 18**: Última versión de React

## 📦 Instalación

```bash
npm install @tecnotics/fe-billing react react-dom react-router-dom
```

O con pnpm:

```bash
pnpm add @tecnotics/fe-billing react react-dom react-router-dom
```

## 🔧 Uso Básico

### 1. Envuelve tu aplicación con el Provider

```tsx
import { TecnoticsProvider, BillingComponent } from '@tecnotics/fe-billing';

function App() {
  return (
    <TecnoticsProvider
      company_id="tu_company_id"
      simba_token="tu_simba_token"
    >
      <BillingComponent theme="clean" />
    </TecnoticsProvider>
  );
}
```

### Desarrollo local con API personalizada

Para desarrollo local o uso con una API diferente, puedes especificar la URL:

```tsx
<TecnoticsProvider
  company_id="tu_company_id"
  simba_token="tu_simba_token"
  fe_url="http://localhost:3000"
>
  <BillingComponent theme="clean" />
</TecnoticsProvider>
```

### 2. Selecciona tu tema

Elige entre 3 temas disponibles:

```tsx
<BillingComponent theme="classic" />  // Estilo tradicional
<BillingComponent theme="clean" />    // Minimalista moderno (por defecto)
<BillingComponent theme="compact" />  // Compacto, ahorra espacio
```

## 📖 API Reference

### `<TecnoticsProvider>`

Provider principal que maneja la autenticación y proporciona acceso a la API.

**Props:**

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `company_id` | `string` | ✅ | ID de la empresa |
| `simba_token` | `string` | ✅ | Token de autenticación Simba |
| `fe_url` | `string` | ❌ | URL de la API (default: `https://facturacionelectronicatt.tecnotics.co`) |
| `children` | `ReactNode` | ✅ | Componentes hijos |

### `<BillingComponent>`

Componente principal de facturación con UI completa.

**Props:**

| Prop | Tipo | Por defecto | Descripción |
|------|------|-------------|-------------|
| `theme` | `'classic' \| 'clean' \| 'compact'` | `'clean'` | Tema visual |

### `useTecnotics()`

Hook para acceder al contexto de la librería.

**Retorna:**

```typescript
{
  api: TecnoticsAPI | null;        // Instancia de la API
  isAuthenticated: boolean;         // Estado de autenticación
  isLoading: boolean;               // Estado de carga
  error: string | null;             // Error de autenticación
  companyData: {                    // Datos de la empresa
    company_id: string;
    razon_social: string;
    avatar: string;
  } | null;
}
```

**Ejemplo:**

```tsx
import { useTecnotics } from '@tecnotics/fe-billing';

function MyComponent() {
  const { api, isAuthenticated } = useTecnotics();

  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  // Usar la API directamente
  const handleGetClients = async () => {
    const clients = await api.getClients();
    console.log(clients);
  };

  return <button onClick={handleGetClients}>Obtener Clientes</button>;
}
```

## 🎨 Temas

### Classic
Estilo tradicional con bordes definidos, sombras y colores clásicos. Ideal para aplicaciones empresariales.

### Clean (por defecto)
Diseño minimalista y moderno con espacios amplios y tipografía limpia. Perfecto para aplicaciones modernas.

### Compact
Diseño compacto que ahorra espacio en pantalla. Ideal para dashboards o pantallas pequeñas.

## 🔐 Autenticación

La librería realiza automáticamente:

1. **Verificación de tokens**: POST a `{VITE_APP_FE_URL}/company/signin/external`
2. **Recibe cookie de sesión**: `_tecnofe_session_` para peticiones subsecuentes
3. **Notificación visual**: Muestra toast con razón social
4. **Instanciación de API**: Si la autenticación es exitosa, crea la instancia de API

### Variables de Entorno

Crea un archivo `.env`:

```env
VITE_APP_FE_URL=http://localhost:3000
VITE_COMPANY_ID=tu_company_id
VITE_SIMBA_TOKEN=tu_simba_token
```

### Headers Enviados

```
company-id: string
simba-token: string
```

### Respuesta del Backend

```json
{
  "company_id": "123",
  "razon_social": "Mi Empresa S.A.",
  "avatar": "url_del_avatar"
}
```

**Cookie**: `_tecnofe_session_` (manejada automáticamente)

### Endpoints Disponibles

La API proporciona los siguientes métodos:

```typescript
// Obtener clientes
api.getClients(): Promise<Client[]>

// Obtener productos
api.getProducts(): Promise<Product[]>

// Crear factura
api.createInvoice(payload: InvoicePayload): Promise<InvoiceResponse>

// Buscar cliente por documento
api.searchClient(documentNumber: string): Promise<Client | null>
```

## 🛠️ Desarrollo

### Requisitos

- Node.js 16+
- React 18+
- TypeScript 5+

### Scripts

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Type checking
npm run type-check
```

### Build

El proyecto usa Rollup para generar:

- **ESM**: `dist/index.esm.js`
- **CommonJS**: `dist/index.cjs.js`
- **TypeScript Definitions**: `dist/index.d.ts`

## 📋 Tipos TypeScript

La librería exporta todos los tipos necesarios:

```typescript
import type {
  BillingComponentProps,
  TecnoticsProviderProps,
  TecnoticsContextValue,
  Client,
  Product,
  InvoicePayload,
  InvoiceResponse,
  InvoiceItem
} from '@tecnotics/fe-billing';
```

## 🔒 Aislamiento

La librería está diseñada para no interferir con tu aplicación:

- ✅ **CSS prefijado**: Todos los estilos usan `.tecnotics-*`
- ✅ **MemoryRouter**: Router interno que no afecta tu routing
- ✅ **Context aislado**: No contamina el árbol de contextos
- ✅ **Sin variables globales**: Nada se añade a `window`
- ✅ **Toaster local**: Notificaciones solo en el componente

## 📄 Licencia

MIT © Tecnotics

## 🤝 Soporte

¿Problemas o preguntas? Abre un issue en nuestro repositorio.

## 🔄 Changelog

### v1.0.0
- 🎉 Lanzamiento inicial
- ✅ Componente completo de facturación
- ✅ 3 temas visuales
- ✅ Autenticación con tokens
- ✅ Integración con API Tecnotics

---

Hecho con ❤️ por Tecnotics
