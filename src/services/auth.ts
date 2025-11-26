/**
 * Servicio de autenticación con backend Tecnotics
 */

export interface AuthTokens {
  company_id: string;
  simba_token: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    company_id: string;
    razon_social: string;
    avatar: string;
    prefixes: string[];
  };
}

/**
 * Obtiene la URL base del backend desde variables de entorno
 */
function getBackendUrl(): string {
  return import.meta.env.VITE_APP_FE_URL || 'https://facturacionelectronicatt.tecnotics.co';
}

/**
 * Verifica los tokens de autenticación contra el backend
 */
export async function verifyAuth(tokens: AuthTokens): Promise<AuthResponse> {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/company/signin/external`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'company-id': tokens.company_id,
        'simba-token': tokens.simba_token,
      },
      credentials: 'include', // Importante para manejar cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    
    // El backend devuelve: company_id, razon_social, avatar
    return {
      success: true,
      data: {
        company_id: data.data.company_id,
        razon_social: data.data.razon_social,
        avatar: data.data.avatar,
        prefixes: data.data.prefixes,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea headers de autenticación para las peticiones a la API
 */
export function getAuthHeaders(tokens: AuthTokens): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'company-id': tokens.company_id,
    'simba-token': tokens.simba_token,
  };
}

