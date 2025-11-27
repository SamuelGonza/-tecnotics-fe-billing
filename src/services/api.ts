/**
 * Servicio API para interactuar con el backend Tecnotics
 */

import { getAuthHeaders, AuthTokens } from './auth';

// Tipos para las entidades según la API del backend
export interface Client {
  _id: string;
  external_id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string;
  doc_type: string;
  doc_number: string;
  address?: string;
  tipoPersona: '1' | '2'; // 1 = Jurídica, 2 = Natural
  SmaIdNombre: string;
  roleUser: string;
  sendDomain: string[];
}

export interface Product {
  _id: string;
  company_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  description: string;
  kind: 'product' | 'service';
  code?: string;
  external_id?: string;
  taxes?: {
    iva: number;
    other: number;
  };
}

// DTOs para creación
export interface CreateClientDTO {
  name: string;
  email: string;
  phone: string;
  doc_type: string;
  doc_number: string;
  address?: string;
  tipoPersona: '1' | '2';
}

export interface CreateProductDTO {
  name: string;
  price: number;
  quantity: number;
  description: string;
  kind: 'product' | 'service';
  code?: string;
  taxes: {
    iva: number;
    other: number;
  };
}

export interface InvoiceItem {
  itemId: string;
  quantity: number;
  price: number;
  discount?: number;
  tax: number;
}

export interface InvoiceHeaders {
  prefijo: string;
  tipo_documento: string;
  f_elaboracion: string;
  f_vencimiento: string;
  forma_pago: string;
  moneda: string;
  referencia?: string; // Solo para notas débito/crédito
  valor_letras: string; // Valor total en letras
  observaciones?: string; // Notas/observaciones
}

export interface MonedaValue {
  IdMoneda: string;
  Value: number;
}

export interface TotalesHeader {
  TotalMonetario: {
    ValorBruto: MonedaValue;
    ValorBaseImpuestos: MonedaValue;
    TotalMasImpuestos: MonedaValue;
    ValorAPagar: MonedaValue;
  };
}

export interface InvoicePayload {
  headers: InvoiceHeaders;
  totales: TotalesHeader;
  client_id: string;
  items: InvoiceItem[];
}

export interface InvoiceResponse {
  success: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  message?: string;
}

/**
 * Clase API para encapsular todas las operaciones con el backend
 */
export class TecnoticsAPI {
  private tokens: AuthTokens;
  private apiUrl: string;

  constructor(tokens: AuthTokens, apiUrl: string) {
    this.tokens = tokens;
    this.apiUrl = apiUrl;
  }

  /**
   * Obtiene la lista de clientes con paginación
   */
  async getClients(page: number = 1, limit: number = 20): Promise<{ clients: Client[]; pagination: any }> {
    try {
      const response = await fetch(`${this.apiUrl}/clients?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeaders(this.tokens),
        credentials: 'include', // Incluir cookies
      });

      if (!response.ok) {
        throw new Error(`Error al obtener clientes: ${response.status}`);
      }

      const data = await response.json();
      return {
        clients: data.clients || [],
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Error en getClients:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo cliente
   */
  async createClient(clientData: CreateClientDTO): Promise<Client> {
    try {
      const response = await fetch(`${this.apiUrl}/clients`, {
        method: 'POST',
        headers: getAuthHeaders(this.tokens),
        credentials: 'include',
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al crear cliente: ${response.status}`);
      }

      const data = await response.json();
      return data.client;
    } catch (error) {
      console.error('Error en createClient:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de items (productos/servicios) con paginación
   */
  async getProducts(page: number = 1, limit: number = 20): Promise<{ items: Product[]; pagination: any }> {
    try {
      const response = await fetch(`${this.apiUrl}/items?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeaders(this.tokens),
        credentials: 'include', // Incluir cookies
      });

      if (!response.ok) {
        throw new Error(`Error al obtener items: ${response.status}`);
      }

      const data = await response.json();
      return {
        items: data.items || [],
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Error en getProducts:', error);
      throw error;
    }
  }

  /**
   * Busca items por nombre
   */
  async searchProducts(searchTerm: string, page: number = 1, limit: number = 20): Promise<{ items: Product[]; pagination: any }> {
    try {
      const response = await fetch(
        `${this.apiUrl}/items/search?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: getAuthHeaders(this.tokens),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Error al buscar items: ${response.status}`);
      }

      const data = await response.json();
      return {
        items: data.items || [],
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Error en searchProducts:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo item (producto/servicio)
   */
  async createProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const response = await fetch(`${this.apiUrl}/items`, {
        method: 'POST',
        headers: getAuthHeaders(this.tokens),
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al crear item: ${response.status}`);
      }

      const data = await response.json();
      return data.item;
    } catch (error) {
      console.error('Error en createProduct:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva factura
   */
  async createInvoice(payload: InvoicePayload): Promise<InvoiceResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/invoices`, {
        method: 'POST',
        headers: getAuthHeaders(this.tokens),
        credentials: 'include', // Incluir cookies
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error al crear factura: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        invoiceId: data._id || data.id,
        invoiceNumber: data.invoiceNumber,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Busca clientes por término de búsqueda
   */
  async searchClients(searchTerm: string, page: number = 1, limit: number = 20): Promise<{ clients: Client[]; pagination: any }> {
    try {
      const response = await fetch(
        `${this.apiUrl}/clients/search?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: getAuthHeaders(this.tokens),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        return { clients: [], pagination: {} };
      }

      const data = await response.json();
      return {
        clients: data.clients || [],
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Error en searchClients:', error);
      return { clients: [], pagination: {} };
    }
  }
}

