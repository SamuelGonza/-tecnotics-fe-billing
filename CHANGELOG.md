# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-11-25

### Agregado
- 🎉 Lanzamiento inicial de @tecnotics/fe-billing
- ✅ Componente completo de facturación electrónica
- 🎨 Tres temas visuales: Classic, Clean y Compact
- 🔐 Sistema de autenticación con tokens duales
- 📦 Integración completa con API Tecnotics
- 🧩 Componentes modulares:
  - `BillingComponent`: Componente principal
  - `ClientSelector`: Selector de clientes con búsqueda
  - `ProductSelector`: Selector de productos
  - `ItemsTable`: Tabla de items de factura
  - `TotalsBox`: Caja de totales
- 🔄 Router interno con MemoryRouter (no interfiere con el router del usuario)
- 🍞 Sistema de notificaciones con react-hot-toast
- 📘 Documentación completa en README
- 🔒 CSS completamente prefijado (`.tecnotics-*`)
- 📦 Build optimizado con Rollup (ESM + CJS)
- 🎯 Tipado completo con TypeScript
- ⚡ Soporte para React 18

### Características Técnicas
- Context API para gestión de estado
- Hook personalizado `useTecnotics()`
- Servicios de autenticación y API encapsulados
- Estilos aislados sin colisiones
- Sin dependencias globales
- Peer dependencies: react, react-dom, react-router-dom

---

[1.0.0]: https://github.com/tecnotics/fe-billing/releases/tag/v1.0.0


