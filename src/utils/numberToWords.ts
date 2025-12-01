/**
 * Convierte un número a su representación en palabras (español)
 */

const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

function convertirGrupo(num: number): string {
  if (num === 0) return '';
  if (num === 100) return 'CIEN';
  
  let resultado = '';
  
  // Centenas
  const c = Math.floor(num / 100);
  const resto = num % 100;
  
  if (c > 0) {
    resultado += centenas[c];
    if (resto > 0) resultado += ' ';
  }
  
  // Decenas y unidades
  if (resto >= 10 && resto < 20) {
    resultado += especiales[resto - 10];
  } else {
    const d = Math.floor(resto / 10);
    const u = resto % 10;
    
    if (d > 0) {
      if (d === 2 && u > 0) {
        resultado += 'VEINTI' + unidades[u];
      } else {
        resultado += decenas[d];
        if (u > 0) resultado += ' Y ' + unidades[u];
      }
    } else if (u > 0) {
      resultado += unidades[u];
    }
  }
  
  return resultado;
}

/**
 * Convierte un número a palabras en español
 * @param num - Número a convertir
 * @param currency - Código de moneda (para determinar el nombre)
 * @returns El número en palabras
 */
export function numberToWords(num: number, currency: string = 'COP'): string {
  if (num === 0) return 'CERO PESOS';
  
  // Separar parte entera y decimal
  const entero = Math.floor(num);
  const decimal = Math.round((num - entero) * 100);
  
  let resultado = '';
  
  if (entero === 0) {
    resultado = 'CERO';
  } else {
    // Millones
    const millones = Math.floor(entero / 1000000);
    const miles = Math.floor((entero % 1000000) / 1000);
    const cientos = entero % 1000;
    
    if (millones > 0) {
      if (millones === 1) {
        resultado += 'UN MILLÓN';
      } else {
        resultado += convertirGrupo(millones) + ' MILLONES';
      }
      if (miles > 0 || cientos > 0) resultado += ' ';
    }
    
    if (miles > 0) {
      if (miles === 1) {
        resultado += 'MIL';
      } else {
        resultado += convertirGrupo(miles) + ' MIL';
      }
      if (cientos > 0) resultado += ' ';
    }
    
    if (cientos > 0) {
      resultado += convertirGrupo(cientos);
    }
  }
  
  // Agregar nombre de moneda
  const currencyNames: Record<string, { singular: string; plural: string }> = {
    COP: { singular: 'PESO', plural: 'PESOS' },
    USD: { singular: 'DÓLAR', plural: 'DÓLARES' },
    EUR: { singular: 'EURO', plural: 'EUROS' },
    MXN: { singular: 'PESO', plural: 'PESOS' },
    ARS: { singular: 'PESO', plural: 'PESOS' },
    CLP: { singular: 'PESO', plural: 'PESOS' },
    PEN: { singular: 'SOL', plural: 'SOLES' },
    BRL: { singular: 'REAL', plural: 'REALES' },
  };
  
  const currencyName = currencyNames[currency] || { singular: 'PESO', plural: 'PESOS' };
  
  if (entero === 1) {
    resultado += ' ' + currencyName.singular;
  } else {
    resultado += ' ' + currencyName.plural;
  }
  
  // Agregar centavos si existen
  if (decimal > 0) {
    resultado += ' CON ' + decimal.toString().padStart(2, '0') + '/100';
  }
  
  return resultado;
}





