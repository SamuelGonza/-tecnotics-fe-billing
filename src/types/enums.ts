/**
 * Enums para tipos de documentos y medios de pago
 */

/**
 * Tipos de documentos electrónicos según la DIAN
 */
export enum TipoDocElectronico {
  FACTURA = "01",
  NOTA_DEBITO = "02",
  NOTA_CREDITO = "03"
}

/**
 * Medios de pago
 */
export enum MedioDePago {
  CONTADO = "1",
  CREDITO = "2"
}

/**
 * Mapeo de tipos de documento a sus valores DIAN
 */
export const TIPO_DOC_MAP: Record<string, TipoDocElectronico> = {
  'Factura de venta': TipoDocElectronico.FACTURA,
  'Factura POS': TipoDocElectronico.FACTURA, // Ambos usan el mismo código
  'Nota débito': TipoDocElectronico.NOTA_DEBITO,
  'Nota crédito': TipoDocElectronico.NOTA_CREDITO,
};

/**
 * Mapeo de medios de pago a sus valores
 */
export const MEDIO_PAGO_MAP: Record<string, MedioDePago> = {
  'Contado': MedioDePago.CONTADO,
  'Crédito': MedioDePago.CREDITO,
};

/**
 * Labels legibles para tipos de documento
 */
export const TIPO_DOC_LABELS: Record<TipoDocElectronico, string[]> = {
  [TipoDocElectronico.FACTURA]: ['Factura de venta', 'Factura POS'],
  [TipoDocElectronico.NOTA_DEBITO]: ['Nota débito'],
  [TipoDocElectronico.NOTA_CREDITO]: ['Nota crédito'],
};

/**
 * Labels legibles para medios de pago
 */
export const MEDIO_PAGO_LABELS: Record<MedioDePago, string> = {
  [MedioDePago.CONTADO]: 'Contado',
  [MedioDePago.CREDITO]: 'Crédito',
};


