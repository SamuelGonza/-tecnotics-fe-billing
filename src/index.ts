/**
 * @tecnotics/fe-billing
 * Librería React para integración de facturación electrónica
 */

// Exportar componente principal
export { BillingComponent } from './components/BillingComponent';
export type { BillingComponentProps } from './components/BillingComponent';

// Exportar componentes individuales (si el usuario quiere personalizar)
export { Header } from './components/Header';
export { Footer } from './components/Footer';
export { Layout } from './components/Layout';

// Exportar Provider
export { TecnoticsProvider } from './context/TecnoticsContext';
export type { TecnoticsProviderProps, TecnoticsContextValue } from './context/TecnoticsContext';

// Exportar hook
export { useTecnotics } from './hooks/useTecnotics';

// Exportar tipos útiles
export type { 
  Client, 
  Product, 
  InvoicePayload,
  InvoiceHeaders,
  TotalesHeader,
  MonedaValue,
  InvoiceResponse,
  CreateClientDTO,
  CreateProductDTO 
} from './services/api';
export type { InvoiceItem } from './components/ItemsTable';
export type { AuthTokens, AuthResponse } from './services/auth';

// Exportar utilidades
export { formatCurrency, formatCurrencyWithSymbol, getCurrencySymbol } from './utils/formatters';
export { numberToWords } from './utils/numberToWords';

// Exportar enums
export { TipoDocElectronico, MedioDePago, TIPO_DOC_MAP, MEDIO_PAGO_MAP, TIPO_DOC_LABELS, MEDIO_PAGO_LABELS } from './types/enums';

