/**
 * Componente para seleccionar o buscar clientes
 */

import React, { useState, useEffect } from 'react';
import { useTecnotics } from '../hooks/useTecnotics';
import { Client, CreateClientDTO } from '../services/api';
import toast from 'react-hot-toast';

export interface ClientSelectorProps {
  selectedClient: Client | null;
  onSelectClient: (client: Client | null) => void;
}

/**
 * Selector de clientes con búsqueda y creación
 */
export const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedClient,
  onSelectClient,
}) => {
  const { api } = useTecnotics();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Estado del formulario de creación
  const [newClient, setNewClient] = useState<CreateClientDTO>({
    name: '',
    email: '',
    phone: '',
    doc_type: 'Cc',
    doc_number: '',
    address: '',
    tipoPersona: '2',
  });

  useEffect(() => {
    const loadClients = async () => {
      if (!api) return;

      setIsLoading(true);
      try {
        const { clients: data } = await api.getClients();
        setClients(data);
      } catch (error) {
        toast.error('Error al cargar clientes');
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [api]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.doc_number.includes(searchTerm)
  );

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
    setSearchTerm(client.name);
    setShowDropdown(false);
  };

  const handleClearClient = () => {
    onSelectClient(null);
    setSearchTerm('');
  };

  const handleCreateClient = async () => {
    if (!api) return;

    // Validaciones
    if (!newClient.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (!newClient.email.trim()) {
      toast.error('El email es requerido');
      return;
    }
    if (!newClient.phone.trim()) {
      toast.error('El teléfono es requerido');
      return;
    }
    if (!newClient.doc_number.trim()) {
      toast.error('El número de documento es requerido');
      return;
    }

    setIsCreating(true);
    try {
      const createdClient = await api.createClient(newClient);
      toast.success('Cliente creado exitosamente');
      
      // Agregar el nuevo cliente a la lista
      setClients([createdClient, ...clients]);
      
      // Seleccionar automáticamente el nuevo cliente
      onSelectClient(createdClient);
      
      // Limpiar formulario y cerrar
      setNewClient({
        name: '',
        email: '',
        phone: '',
        doc_type: 'Cc',
        doc_number: '',
        address: '',
        tipoPersona: '2',
      });
      setShowCreateForm(false);
      setSearchTerm(createdClient.name);
    } catch (error: any) {
      toast.error(error.message || 'Error al crear cliente');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowDropdown(false);
  };

  return (
    <div className="tecnotics-client-selector">
      <div className="tecnotics-label-row">
        <label className="tecnotics-label">Cliente</label>
        <button
          className="tecnotics-btn tecnotics-btn-link"
          onClick={toggleCreateForm}
          type="button"
        >
          {showCreateForm ? '← Volver' : '+ Nuevo Cliente'}
        </button>
      </div>

      {!showCreateForm ? (
        <>
          <div className="tecnotics-input-group">
            <input
              type="text"
              className="tecnotics-input"
              placeholder="Buscar cliente por nombre o documento..."
              value={selectedClient ? selectedClient.name : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                if (selectedClient) onSelectClient(null);
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={isLoading}
            />
            {selectedClient && (
              <button
                className="tecnotics-btn tecnotics-btn-clear"
                onClick={handleClearClient}
                type="button"
              >
                ✕
              </button>
            )}
          </div>

      {showDropdown && searchTerm && !selectedClient && (
        <div className="tecnotics-dropdown">
          {isLoading ? (
            <div className="tecnotics-dropdown-item">Cargando...</div>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client._id}
                className="tecnotics-dropdown-item"
                onClick={() => handleSelectClient(client)}
              >
                <div className="tecnotics-dropdown-item-name">
                  {client.name}
                </div>
                <div className="tecnotics-dropdown-item-doc">
                  {client.doc_type}: {client.doc_number}
                </div>
              </div>
            ))
          ) : (
            <div className="tecnotics-dropdown-item">
              No se encontraron clientes
            </div>
          )}
        </div>
      )}

          {selectedClient && (
            <div className="tecnotics-client-info">
              <div className="tecnotics-client-info-row">
                <span className="tecnotics-client-info-label">Documento:</span>
                <span>{selectedClient.doc_type} {selectedClient.doc_number}</span>
              </div>
              <div className="tecnotics-client-info-row">
                <span className="tecnotics-client-info-label">Email:</span>
                <span>{selectedClient.email}</span>
              </div>
              <div className="tecnotics-client-info-row">
                <span className="tecnotics-client-info-label">Teléfono:</span>
                <span>{selectedClient.phone}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="tecnotics-create-form">
          <h3 className="tecnotics-form-title">Crear Nuevo Cliente</h3>
          
          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Nombre completo *</label>
              <input
                type="text"
                className="tecnotics-input"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Ej: Juan Pérez García"
              />
            </div>
          </div>

          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Tipo de persona *</label>
              <select
                className="tecnotics-input"
                value={newClient.tipoPersona}
                onChange={(e) => setNewClient({ ...newClient, tipoPersona: e.target.value as '1' | '2' })}
              >
                <option value="2">Natural</option>
                <option value="1">Jurídica</option>
              </select>
            </div>
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Tipo de documento *</label>
              <select
                className="tecnotics-input"
                value={newClient.doc_type}
                onChange={(e) => setNewClient({ ...newClient, doc_type: e.target.value })}
              >
                <option value="Cc">Cédula de Ciudadanía</option>
                <option value="Nit">NIT</option>
                <option value="Ce">Cédula de Extranjería</option>
                <option value="Ti">Tarjeta de Identidad</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Pep">PEP</option>
              </select>
            </div>
          </div>

          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Número de documento *</label>
              <input
                type="text"
                className="tecnotics-input"
                value={newClient.doc_number}
                onChange={(e) => setNewClient({ ...newClient, doc_number: e.target.value })}
                placeholder="Ej: 1234567890"
              />
            </div>
          </div>

          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Email *</label>
              <input
                type="email"
                className="tecnotics-input"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="cliente@ejemplo.com"
              />
            </div>
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Teléfono *</label>
              <input
                type="tel"
                className="tecnotics-input"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="3001234567"
              />
            </div>
          </div>

          <div className="tecnotics-form-row">
            <div className="tecnotics-form-group">
              <label className="tecnotics-label">Dirección</label>
              <input
                type="text"
                className="tecnotics-input"
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                placeholder="Calle 123 #45-67"
              />
            </div>
          </div>

          <div className="tecnotics-form-actions">
            <button
              className="tecnotics-btn tecnotics-btn-secondary"
              onClick={toggleCreateForm}
              type="button"
              disabled={isCreating}
            >
              Cancelar
            </button>
            <button
              className="tecnotics-btn tecnotics-btn-primary"
              onClick={handleCreateClient}
              type="button"
              disabled={isCreating}
            >
              {isCreating ? 'Creando...' : 'Crear Cliente'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

