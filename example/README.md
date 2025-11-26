# Ejemplo de Uso

Este es un ejemplo de cómo integrar `@tecnotics/fe-billing` en tu aplicación React.

## 📦 Instalación

Desde la raíz del proyecto:

```bash
pnpm install
```

## 🚀 Ejecutar el Ejemplo

```bash
pnpm dev
```

Esto iniciará Vite y podrás ver el componente de facturación en acción.

## 🔐 Configuración

Edita `example/App.tsx` y reemplaza los tokens de prueba con tus tokens reales:

```tsx
const SIMBA_TOKEN = 'tu_token_simba_aqui';
const TECNOTICS_FE_TOKEN = 'tu_token_tecnoticsfe_aqui';
```

## 🎨 Probar Diferentes Temas

Cambia la prop `theme` del componente:

```tsx
<BillingComponent theme="classic" />  // Estilo tradicional
<BillingComponent theme="clean" />    // Minimalista (por defecto)
<BillingComponent theme="compact" />  // Compacto
```


