/**
 * Hook personalizado para acceder al contexto de Tecnotics
 */

import { useContext } from 'react';
import { TecnoticsContext, TecnoticsContextValue } from '../context/TecnoticsContext';

/**
 * Hook para acceder a la API y estado de autenticación
 * @throws Error si se usa fuera del TecnoticsProvider
 */
export function useTecnotics(): TecnoticsContextValue {
  const context = useContext(TecnoticsContext);

  if (context === undefined) {
    throw new Error(
      'useTecnotics debe ser usado dentro de un TecnoticsProvider'
    );
  }

  return context;
}




