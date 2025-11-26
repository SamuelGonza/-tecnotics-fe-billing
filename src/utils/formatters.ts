/**
 * Utilidades para formatear valores
 */

/**
 * Formatea un número como moneda según el código de moneda
 * @param value - El valor numérico a formatear
 * @param currency - El código de moneda (COP, USD, EUR, etc.)
 * @returns El valor formateado como string
 */
export function formatCurrency(value: number, currency: string = 'COP'): string {
  const localeMap: Record<string, string> = {
    COP: 'es-CO',
    USD: 'en-US',
    EUR: 'de-DE',
    MXN: 'es-MX',
    ARS: 'es-AR',
    CLP: 'es-CL',
    PEN: 'es-PE',
    BRL: 'pt-BR',
  };

  const locale = localeMap[currency] || 'es-CO';

  return value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Obtiene el símbolo de la moneda
 * @param currency - El código de moneda
 * @returns El símbolo de la moneda
 */
export function getCurrencySymbol(currency: string = 'COP'): string {
  const symbolMap: Record<string, string> = {
    COP: '$',
    USD: '$',
    EUR: '€',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    PEN: 'S/',
    BRL: 'R$',
    GBP: '£',
  };

  return symbolMap[currency] || '$';
}

/**
 * Formatea un valor con el símbolo de la moneda
 * @param value - El valor numérico
 * @param currency - El código de moneda
 * @returns El valor formateado con símbolo
 */
export function formatCurrencyWithSymbol(value: number, currency: string = 'COP'): string {
  const symbol = getCurrencySymbol(currency);
  const formatted = formatCurrency(value, currency);
  return `${symbol}${formatted}`;
}


