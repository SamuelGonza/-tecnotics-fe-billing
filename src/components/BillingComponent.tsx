/**
 * Componente principal de facturación
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { InternalRouter } from '../router/internalRouter';
import { useTecnotics } from '../hooks/useTecnotics';

// Importar todos los estilos (base se importa automáticamente desde cada tema)
import '../theme/classic.css';
import '../theme/clean.css';
import '../theme/compact.css';

export interface BillingComponentProps {
  theme?: 'classic' | 'clean' | 'compact';
}

/**
 * Componente principal que debe usar el usuario final
 */
export const BillingComponent: React.FC<BillingComponentProps> = ({
  theme = 'clean',
}) => {
  const { isAuthenticated, isLoading, error } = useTecnotics();

  if (isLoading) {
    return (
      <Layout theme={theme}>
        <div className="tecnotics-loading">
          <div className="tecnotics-spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </Layout>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <Layout theme={theme}>
        <div className="tecnotics-error">
          <h2>Error de Autenticación</h2>
          <p>{error || 'No se pudo autenticar. Verifica tus tokens.'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout theme={theme}>
      <MemoryRouter>
        <InternalRouter />
      </MemoryRouter>
    </Layout>
  );
};

