/**
 * Context de Tecnotics para autenticación y API
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { verifyAuth, AuthTokens } from '../services/auth';
import { TecnoticsAPI } from '../services/api';

export interface TecnoticsContextValue {
  api: TecnoticsAPI | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  apiUrl: string;
  companyData: {
    company_id: string;
    razon_social: string;
    avatar: string;
    prefixes: string[];
  } | null;
}

export const TecnoticsContext = createContext<TecnoticsContextValue | undefined>(
  undefined
);

export interface TecnoticsProviderProps {
  company_id: string;
  simba_token: string;
  fe_url?: string;
  children: ReactNode;
}

/**
 * Provider que envuelve la aplicación y proporciona autenticación y API
 */
export const TecnoticsProvider: React.FC<TecnoticsProviderProps> = ({
  company_id,
  simba_token,
  fe_url,
  children,
}) => {
  // URL de la API: usa fe_url si se proporciona, sino el default
  const apiUrl = fe_url || 'https://facturacionelectronicatt.tecnotics.co';
  const [api, setApi] = useState<TecnoticsAPI | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<{
    company_id: string;
    razon_social: string;
    avatar: string;
    prefixes: string[];
  } | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      setIsLoading(true);
      setError(null);

      const tokens: AuthTokens = {
        company_id,
        simba_token,
      };

      try {
        const result = await verifyAuth(tokens, apiUrl);

        if (result.success && result.data) {
          // Guardar datos de la compañía
          setCompanyData({
            company_id: result.data.company_id,
            razon_social: result.data.razon_social,
            avatar: result.data.avatar,
            prefixes: result.data.prefixes || [],
          });

          // Crear instancia de API
          const apiInstance = new TecnoticsAPI(tokens, apiUrl);
          setApi(apiInstance);
          setIsAuthenticated(true);
          toast.success(`Bienvenido ${result.data.razon_social}`, {
            duration: 3000,
            position: 'top-right',
          });
        } else {
          setError(result.message || 'Autenticación inválida');
          toast.error('Autenticación inválida', {
            duration: 4000,
            position: 'top-right',
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(`Error de autenticación: ${errorMessage}`, {
          duration: 4000,
          position: 'top-right',
        });
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, [company_id, simba_token, apiUrl]);

  const value: TecnoticsContextValue = {
    api,
    isAuthenticated,
    isLoading,
    error,
    apiUrl,
    companyData,
  };

  return (
    <TecnoticsContext.Provider value={value}>
      {/* Toaster solo para este contexto, no global */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'tecnotics-toast',
          style: {
            background: '#333',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          },
        }}
        containerStyle={{
          zIndex: 999999,
        }}
      />
      {children}
    </TecnoticsContext.Provider>
  );
};

