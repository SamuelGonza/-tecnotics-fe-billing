# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.2.0] - 2025-11-27

### Agregado
- ✨ Nuevo prop opcional `fe_url` en `TecnoticsProvider` para configurar URL personalizada de la API
- 🔧 Soporte para desarrollo local: ahora puedes usar `fe_url="http://localhost:3000"` para desarrollo
- 🌐 URL por defecto: `https://facturacionelectronicatt.tecnotics.co` (si no se especifica `fe_url`)

### Mejorado
- 📖 Documentación actualizada con ejemplos de uso de `fe_url`
- ⚙️ Mayor flexibilidad para diferentes entornos (producción, staging, desarrollo)

## [1.1.0] - 2025-11-26

### Cambiado
- ♻️ **BREAKING**: Eliminado router interno (`MemoryRouter`) para evitar conflictos con routers externos
- 📦 Removido `react-router-dom` de `peerDependencies` - Ya no es necesario instalarlo
- ⚡ Componente ahora es compatible con cualquier sistema de routing (React Router, Next.js, Remix, etc.)
- 🎯 Bundle más ligero sin dependencias de routing

### Arreglado
- 🐛 Corregido conflicto "router dentro de otro router" cuando se usa dentro de aplicaciones con React Router DOM

## [1.0.0] - 2025-11-26

### Agregado
- 🎉 Lanzamiento inicial de @tecnotics/fe-billing
- ✅ Componente completo de facturación electrónica
- 🎨 Tres temas visuales: Classic, Clean y Compact
- 🔐 Sistema de autenticación basado en `company_id` y `simba_token`
- 📦 Integración completa con API Tecnotics
- 🧩 Componentes modulares:
  - `BillingComponent`: Componente principal
  - `ClientSelector`: Selector y creación de clientes
  - `ProductSelector`: Selector y creación de productos/servicios
  - `ItemsTable`: Tabla editable de items con soporte temporal
  - `TotalsBox`: Caja de totales con cálculo de IVA
  - `ClientModal`: Modal de búsqueda y creación de clientes
  - `ProductModal`: Modal de búsqueda y creación de items
- 🍞 Sistema de notificaciones con react-hot-toast
- 📘 Documentación completa en README
- 🔒 CSS completamente prefijado (`.tecnotics-*`) sin colisiones
- 📦 Build optimizado con Rollup (ESM + CJS)
- 🎯 Tipado completo con TypeScript
- ⚡ Soporte para React 18
- 🎨 Logo de facturación y footer con branding
- 🌐 Google Fonts 'Inter' integrado
- 🎨 CSS Variables personalizables (`--primary-color`, `--secondary-color`, `--tertiary-color`)

### Características de Facturación
- 📋 Selector de prefijo de factura
- 📄 Tipos de documento: Factura de venta, Factura POS, Nota débito, Nota crédito
- 📅 Fechas de elaboración y vencimiento
- 💰 Múltiples monedas soportadas (COP, USD, EUR, etc.)
- 💳 Formas de pago: Contado y Crédito
- 🔢 Conversión de valor a letras en español
- 🧮 Cálculo automático de totales, subtotales e IVA
- 📝 Campo de referencia condicional para notas débito/crédito
- ⚡ Edición inline de items temporales
- 🔄 Sincronización de items con el backend
- 📊 Estructura de totales detallada para el backend

### Características Técnicas
- Context API para gestión de estado global
- Hook personalizado `useTecnotics()` para acceso a autenticación y API
- Servicios de autenticación y API encapsulados
- Estilos aislados sin colisiones con el proyecto host
- Sin router interno (compatible con cualquier router)
- Cookie-based session management (`_tecnofe_session_`)
- Formateo dinámico de moneda según selección
- Validación de formularios
- Enums para tipos de documento y medios de pago
- Peer dependencies: `react`, `react-dom` (sin `react-router-dom`)

### API Integration
- `POST /auth/verify` - Autenticación con headers
- `GET /clients` - Listar clientes con paginación
- `GET /clients/search` - Búsqueda de clientes
- `POST /clients` - Crear nuevo cliente
- `GET /items` - Listar items con paginación
- `GET /items/search` - Búsqueda de items
- `POST /items` - Crear nuevo producto/servicio
- `POST /invoices` - Crear factura electrónica

### Utilidades Exportadas
- `formatCurrency()` - Formateo de moneda
- `getCurrencySymbol()` - Obtener símbolo de moneda
- `formatCurrencyWithSymbol()` - Formateo completo
- `numberToWords()` - Conversión de número a letras en español
- `TipoDocElectronico` - Enum de tipos de documento
- `MedioDePago` - Enum de medios de pago

### Eliminado
- ❌ Router interno (`MemoryRouter`) - Eliminado para evitar conflictos con routers externos
- ❌ `react-router-dom` de peerDependencies - Ya no es requerido

---

[1.1.0]: https://github.com/tecnotics/fe-billing/releases/tag/v1.1.0
[1.0.0]: https://github.com/tecnotics/fe-billing/releases/tag/v1.0.0


